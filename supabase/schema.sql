-- Health Hub schema (updated)

create extension if not exists "uuid-ossp";

create table if not exists weights (
  id uuid primary key default uuid_generate_v4(),
  entry_date date not null,
  meal text not null default 'other',
  value numeric,
  unit text not null default 'kg',
  source text,
  menu text,
  symptoms text,
  calories numeric,
  fat numeric,
  protein numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lab_tests (
  id uuid primary key default uuid_generate_v4(),
  entry_date date not null,
  test_name text not null,
  value numeric,
  unit text,
  result_text text,
  lab_name text,
  problematic text,
  category text default 'lab',
  reference_notes text,
  ref_low numeric,
  ref_high numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists medications (
  id uuid primary key default uuid_generate_v4(),
  entry_date date not null,
  prescribed_by text,
  name text not null,
  dose numeric,
  dose_unit text,
  dose_count numeric,
  frequency text,
  start_date date not null,
  end_date date,
  stop_date date,
  status text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists diagnoses (
  id uuid primary key default uuid_generate_v4(),
  entry_date date not null,
  name text not null,
  diagnosis_date date not null,
  status text not null,
  provider text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists doctor_visits (
  id uuid primary key default uuid_generate_v4(),
  visit_date date not null,
  doctor text not null,
  diagnosis_summary text,
  medications_summary text,
  completed boolean,
  weight_value numeric,
  weight_unit text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists symptoms (
  id uuid primary key default uuid_generate_v4(),
  entry_date date not null,
  feelings text not null,
  symptoms text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace view events_timeline as
select
  id,
  entry_date,
  'weight' as category,
  'Weight' as title,
  value || ' ' || unit as subtitle,
  notes
from weights
union all
select
  id,
  entry_date,
  'lab_test' as category,
  test_name as title,
  coalesce(cast(value as text), result_text, '') || ' ' || coalesce(unit, '') as subtitle,
  coalesce(reference_notes, notes)
from lab_tests
union all
select
  id,
  entry_date,
  'medication' as category,
  name as title,
  dose || ' ' || dose_unit || coalesce(' x' || dose_count::text, '') as subtitle,
  notes
from medications
union all
select
  id,
  entry_date,
  'diagnosis' as category,
  name as title,
  status as subtitle,
  notes
from diagnoses
union all
select
  id,
  visit_date as entry_date,
  'visit' as category,
  doctor as title,
  coalesce(diagnosis_summary, '') as subtitle,
  medications_summary as notes
from doctor_visits
union all
select
  id,
  entry_date,
  'symptom' as category,
  feelings as title,
  coalesce(symptoms, '') as subtitle,
  notes
from symptoms;
