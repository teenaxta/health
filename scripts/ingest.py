#!/usr/bin/env python3
import argparse
import csv
import json
import os
import re
from datetime import datetime
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError


ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT / ".env.local"
DATA_DIR = ROOT / "data"


def load_env():
    if ENV_PATH.exists():
        for line in ENV_PATH.read_text().splitlines():
            if "=" in line:
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip())


def parse_date(value):
    if not value:
        return None
    value = value.strip()
    if value in ("—", "-", "NA", "N/A"):
        return None
    for fmt in ("%d-%b-%y", "%d-%b-%Y", "%B %d, %Y", "%b %d, %Y"):
        try:
            return datetime.strptime(value, fmt).date().isoformat()
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(value).date().isoformat()
    except Exception:
        return None


def request_json(method, url, payload=None):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = Request(
        url,
        data=data,
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        method=method,
    )
    with urlopen(req) as resp:
        if resp.status not in (200, 201, 204):
            raise RuntimeError(f"{method} failed {resp.status}")


def post_rows(table, rows, batch_size=100):
    if not rows:
        return 0
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    total = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        request_json("POST", url, batch)
        total += len(batch)
    return total


def delete_all(table):
    url = f"{SUPABASE_URL}/rest/v1/{table}?id=not.is.null"
    request_json("DELETE", url)


def parse_meal(raw):
    if not raw:
        return "other"
    value = raw.strip().lower()
    if "breakfast" in value:
        return "breakfast"
    if "lunch" in value:
        return "lunch"
    if "dinner" in value:
        return "dinner"
    return "other"


def is_procedure(name):
    return bool(re.search(r"mri|endoscopy|colonoscopy", name, re.IGNORECASE))


load_env()
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit(
        "Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    )

parser = argparse.ArgumentParser()
parser.add_argument(
    "--reset",
    action="store_true",
    help="Delete existing rows in target tables before import.",
)
args = parser.parse_args()

files = {
    "diet": DATA_DIR / "diet and weight summarized.csv",
    "visits": DATA_DIR / "doctor visits.csv",
    "tests": DATA_DIR / "test summary.csv",
}

for name, path in files.items():
    if not path.exists():
        raise SystemExit(f"Missing {path}")

# Parse diet/weight
weights = []
with files["diet"].open(newline="") as fh:
    reader = csv.DictReader(fh)
    reader.fieldnames = [h.lstrip("\ufeff").strip() for h in reader.fieldnames]
    for row in reader:
        date = parse_date(row.get("Date", ""))
        weight_raw = (row.get("Weight before meal (kg)") or "").strip()
        if not date or not weight_raw:
            continue
        try:
            value = float(weight_raw)
        except ValueError:
            continue
        meal = parse_meal(row.get("Meal", ""))
        notes_parts = []
        day = (row.get("Day") or "").strip()
        if day:
            notes_parts.append(f"Day: {day}")
        notes = "; ".join(notes_parts) if notes_parts else None
        weights.append(
            {
                "entry_date": date,
                "meal": meal,
                "value": value,
                "unit": "kg",
                "source": "diet log",
                "menu": (row.get("Menu") or "").strip() or None,
                "symptoms": (row.get("Post Meal Symptoms") or "").strip() or None,
                "notes": notes,
            }
        )

# Parse doctor visits
visit_weights = []
diagnoses = []
medications = []
doctor_visits = []
med_skipped = []

med_regex = re.compile(
    r"(?P<name>.*?)(?P<dose>\d+(?:\.\d+)?)\s*(?P<unit>mg|ml|mcg|g|iu|units?)\b",
    re.IGNORECASE,
)
count_regex = re.compile(r"(?:x|×)\s*(\d+)", re.IGNORECASE)

with files["visits"].open(newline="") as fh:
    reader = csv.DictReader(fh)
    reader.fieldnames = [h.lstrip("\ufeff").strip() for h in reader.fieldnames]
    for row in reader:
        date = parse_date(row.get("Date", ""))
        if not date:
            continue
        doctor = (row.get("Doctor") or "").strip()
        dx_comments = (row.get("Diagnosis / Comments") or "").strip()
        medicines = (row.get("Medicines Prescribed") or "").strip()
        completed_raw = (row.get("Completed") or "").strip().lower()
        completed = True if completed_raw == "yes" else False if completed_raw == "no" else None
        weight_raw = (row.get("Weight (kg)") or "").strip()

        if weight_raw and weight_raw not in ("—", "-"):
            weight_match = re.search(r"(\d+(?:\.\d+)?)", weight_raw)
            if weight_match:
                visit_weights.append(
                    {
                        "entry_date": date,
                        "meal": "other",
                        "value": float(weight_match.group(1)),
                        "unit": "kg",
                        "source": "doctor visit",
                        "notes": f"Doctor: {doctor}" if doctor else None,
                    }
                )

        if dx_comments:
            short_name = re.split(r"[.;\n]", dx_comments)[0].strip()
            if len(short_name) > 80:
                short_name = short_name[:77] + "..."
            diagnoses.append(
                {
                    "entry_date": date,
                    "name": short_name or "Doctor visit",
                    "diagnosis_date": date,
                    "status": "monitoring",
                    "provider": doctor or None,
                    "notes": dx_comments,
                }
            )

        if medicines:
            items = [item.strip() for item in medicines.split("\n") if item.strip()]
            for item in items:
                match = med_regex.search(item)
                name = None
                dose = None
                unit = None
                if match:
                    name = match.group("name").strip(" -\t")
                    dose = float(match.group("dose"))
                    unit = match.group("unit").lower()
                else:
                    med_skipped.append(item)
                count_match = count_regex.search(item)
                dose_count = int(count_match.group(1)) if count_match else None
                status = "stopped" if completed is True else "active"
                medications.append(
                    {
                        "entry_date": date,
                        "prescribed_by": doctor or None,
                        "name": name or item,
                        "dose": dose,
                        "dose_unit": unit,
                        "dose_count": dose_count,
                        "frequency": None,
                        "start_date": date,
                        "end_date": None,
                        "stop_date": date if status == "stopped" else None,
                        "status": status,
                        "notes": f"Original: {item}",
                    }
                )

        doctor_visits.append(
            {
                "visit_date": date,
                "doctor": doctor or "Unknown",
                "diagnosis_summary": re.split(r"[.;\n]", dx_comments)[0].strip()
                if dx_comments
                else None,
                "medications_summary": medicines.replace("\n", "; ").strip() if medicines else None,
                "completed": completed,
                "weight_value": float(re.search(r"(\d+(?:\.\d+)?)", weight_raw).group(1))
                if weight_raw and weight_raw not in ("—", "-") and re.search(r"(\d+(?:\.\d+)?)", weight_raw)
                else None,
                "weight_unit": "kg" if weight_raw and weight_raw not in ("—", "-") else None,
                "notes": dx_comments or None,
            }
        )

# Parse tests
lab_tests = []

pair_regex = re.compile(
    r"(?P<name>[A-Za-z][A-Za-z\s\-\(\)\/]+):\s*(?P<value>\d+(?:\.\d+)?)\s*(?P<unit>[^,]+)"
)
value_unit_regex = re.compile(r"(?P<value>\d+(?:\.\d+)?)\s*(?P<unit>[A-Za-z\/]+)")

with files["tests"].open(newline="") as fh:
    reader = csv.DictReader(fh)
    reader.fieldnames = [h.lstrip("\ufeff").strip() for h in reader.fieldnames]
    for row in reader:
        test_name = (row.get("Test Name") or "").strip()
        date = parse_date(row.get("Test Date", ""))
        result = (row.get("Test Result") or "").strip()
        problematic = (row.get("Problematic (No/Slight/Yes)") or "").strip()
        interpretation = (row.get("Test Interpretation") or "").strip()
        lab_name = (row.get("Lab") or "").strip()
        notes = (row.get("Notes") or "").strip()
        if not date or not test_name:
            continue

        reference_notes = (
            (f"Problematic: {problematic}. " if problematic else "") + interpretation
        ).strip() or None

        pairs = pair_regex.findall(result)
        if pairs:
            for name, value, unit in pairs:
                lab_tests.append(
                    {
                        "entry_date": date,
                        "test_name": name.strip(),
                        "value": float(value),
                        "unit": unit.strip(),
                        "result_text": None,
                        "lab_name": lab_name or None,
                        "category": "procedure" if is_procedure(name) else "lab",
                        "reference_notes": reference_notes,
                        "ref_low": None,
                        "ref_high": None,
                        "notes": notes or None,
                    }
                )
            continue

        match = value_unit_regex.search(result)
        if match:
            lab_tests.append(
                {
                    "entry_date": date,
                    "test_name": test_name,
                    "value": float(match.group("value")),
                    "unit": match.group("unit").strip(),
                    "result_text": None,
                    "lab_name": lab_name or None,
                    "category": "procedure" if is_procedure(test_name) else "lab",
                    "reference_notes": reference_notes,
                    "ref_low": None,
                    "ref_high": None,
                    "notes": notes or None,
                }
            )
        else:
            lab_tests.append(
                {
                    "entry_date": date,
                    "test_name": test_name,
                    "value": None,
                    "unit": None,
                    "result_text": result or None,
                    "lab_name": lab_name or None,
                    "category": "procedure" if is_procedure(test_name) else "lab",
                    "reference_notes": reference_notes,
                    "ref_low": None,
                    "ref_high": None,
                    "notes": notes or None,
                }
            )


try:
    if args.reset:
        for table in [
            "weights",
            "lab_tests",
            "medications",
            "diagnoses",
            "doctor_visits",
        ]:
            delete_all(table)

    inserted = {
        "weights": 0,
        "lab_tests": 0,
        "medications": 0,
        "diagnoses": 0,
        "doctor_visits": 0,
    }

    inserted["weights"] += post_rows("weights", weights)
    inserted["weights"] += post_rows("weights", visit_weights)
    inserted["lab_tests"] = post_rows("lab_tests", lab_tests)
    inserted["medications"] = post_rows("medications", medications)
    inserted["diagnoses"] = post_rows("diagnoses", diagnoses)
    inserted["doctor_visits"] = post_rows("doctor_visits", doctor_visits)

    print("Inserted counts:", inserted)
    if med_skipped:
        print("Skipped meds (unparsed):", len(med_skipped))
except URLError as e:
    raise SystemExit("Network error. Run this script on a machine with internet access.") from e
