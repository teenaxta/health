-- Manual ingest (generated)
begin;
delete from doctor_visits;
delete from medications;
delete from diagnoses;
delete from lab_tests;
delete from weights;
insert into weights (entry_date, meal, value, unit, source, menu, symptoms, notes) values
('2025-11-05', 'lunch', 111.8, 'kg', 'diet log', '450G daal Chawal', NULL, 'Day: Wednesday'),
('2025-11-06', 'lunch', 112.5, 'kg', 'diet log', '2 roti with shaljam', NULL, 'Day: Thursday'),
('2025-11-09', 'breakfast', 112.45, 'kg', 'diet log', '470g poridge', NULL, 'Day: Sunday'),
('2025-11-11', 'breakfast', 111.2, 'kg', 'diet log', '400g porridge', '1 loose motion', 'Day: Tuesday'),
('2025-11-11', 'dinner', 111.6, 'kg', 'diet log', '2 plate rice with yogurt with chicken piece', NULL, 'Day: Tuesday'),
('2025-11-12', 'breakfast', 111.8, 'kg', 'diet log', 'Museli in milk', NULL, 'Day: Wednesday'),
('2025-11-13', 'breakfast', 111.9, 'kg', 'diet log', '1 bowl mueseli', '1 watery loose motion', 'Day: Thursday'),
('2025-11-18', 'breakfast', 112.15, 'kg', 'diet log', 'Dalia', NULL, 'Day: Tuesday'),
('2025-11-19', 'breakfast', 112.1, 'kg', 'diet log', 'Dalia', NULL, 'Day: Wednesday'),
('2025-11-29', 'breakfast', 112.0, 'kg', 'diet log', 'oats', NULL, 'Day: Saturday'),
('2025-11-30', 'breakfast', 112.3, 'kg', 'diet log', 'oats', 'having difficulty in eating things like cucumber. food is getting struck near the epiglotis areas', 'Day: Sunday'),
('2025-12-20', 'breakfast', 110.9, 'kg', 'diet log', 'oats', 'no pain or discomfort, stool comes out like small bits and very pale in color', 'Day: Saturday'),
('2025-12-22', 'dinner', 111.55, 'kg', 'diet log', 'White Rice and yogurt', NULL, 'Day: Monday'),
('2025-12-25', 'breakfast', 110.15, 'kg', 'diet log', 'oats', 'no pain or discomfort, last stool came out quite normal', 'Day: Thursday'),
('2026-01-27', 'dinner', 109.85, 'kg', 'diet log', 'White rice with kofta and egg', 'Water brash', 'Day: Tuesday'),
('2026-01-31', 'lunch', 109.2, 'kg', 'diet log', 'White rice with egg and boiled vegetables', 'None. Feels alright. Minimal to no water brash since yesterday', 'Day: Saturday');
insert into lab_tests (entry_date, test_name, value, unit, result_text, lab_name, category, reference_notes, ref_low, ref_high, notes) values
('2025-08-15', 'Serum Amylase', 117.0, 'U/L', NULL, 'DHA Center', 'lab', 'Problematic: Slight. Slightly elevated — may indicate mild pancreatic irritation.', NULL, NULL, NULL),
('2025-08-15', 'Blood Complete Count (CBC)', NULL, NULL, 'All values within normal limits', 'DHA Center', 'lab', 'Problematic: No. Normal blood cell profile.', NULL, NULL, NULL),
('2025-08-15', 'Urea', 18.0, 'mg/dL', NULL, 'DHA Center', 'lab', 'Problematic: No. Normal kidney function.', NULL, NULL, NULL),
('2025-08-15', 'Creatinine', 1.2, 'mg/dL', NULL, 'DHA Center', 'lab', 'Problematic: No. Normal kidney function.', NULL, NULL, NULL),
('2025-08-15', 'Serum Lipase', 28.0, 'U/L', NULL, 'DHA Center', 'lab', 'Problematic: No. Within normal range.', NULL, NULL, NULL),
('2025-08-15', 'Stool Routine Examination', NULL, NULL, 'Normal (No ova, cysts, or blood)', 'DHA Center', 'lab', 'Problematic: No. No parasitic infection or GI bleeding observed.', NULL, NULL, NULL),
('2025-08-27', 'Helicobacter Pylori IgA Antibody', 2.85, 'U/mL', NULL, 'DHA Center', 'lab', 'Problematic: Yes. Indicates current or recent H. pylori infection.', NULL, NULL, NULL),
('2025-08-27', 'Helicobacter Pylori IgM Antibody', 3.14, 'U/mL', NULL, 'DHA Center', 'lab', 'Problematic: Yes. Suggests recent or active H. pylori infection.', NULL, NULL, NULL),
('2025-08-27', 'Liver Function Tests', NULL, NULL, 'Normal (Bilirubin 0.4, ALT 35, AST 39)', 'DHA Center', 'lab', 'Problematic: No. Normal liver function.', NULL, NULL, NULL),
('2025-09-08', 'Upper GI Endoscopy (a lot of doctor are disputing the finding based on the endoscopy images)', NULL, NULL, 'Oropharynx: Good hygiene with normal movement of vocal cords.
Esophagus: Normal upper third of esophagus, Multiple ulceration with surrounding erythema, friable to touch, seen in the middle and lower third of esophagus, (LA Classification C))
Incompetent LES.
Stomach: No fundal varix seen. Moderate gastritis seen in whole stomach.
Duodenum: Multiple erosions seen in duodenal bulb and descending duodenum, Normal number and height of the duodenal folds.', 'Chugtai', 'procedure', 'Problematic: Yes. Findings indicate inflammation in the esophagus (reflux), gastritis, and mild duodenal erosions. Biopsies were taken for H. pylori.', NULL, NULL, NULL),
('2025-09-09', 'Stool for Helicobacter Pylori Antigen', NULL, NULL, '4.24 (Positive)', 'Chugtai', 'lab', 'Problematic: Yes. Positive for H. pylori infection, indicating active bacterial presence.', NULL, NULL, NULL),
('2025-09-10', 'Gastric Biopsy (Histopathology)', NULL, NULL, 'Mild Chronic Focal Active Gastritis, H. pylori: Mild Colonization', 'Chugtai', 'lab', 'Problematic: Yes. Confirms mild H. pylori-associated gastritis, no intestinal metaplasia or dysplasia.', NULL, NULL, NULL),
('2025-09-24', 'Stool Analysis (Chughtai Lab)', 2.0, '/LPF', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal stool profile, no infection or inflammation.', NULL, NULL, NULL),
('2025-09-27', 'Calprotectin (Stool Inflammatory Marker)', NULL, NULL, '<20 µg/g (Normal)', 'Chugtai', 'lab', 'Problematic: No. No intestinal inflammation; rules out IBD.', NULL, NULL, NULL),
('2025-10-14', 'Uric Acid', 7.4, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: Yes. Mild hyperuricemia; may need hydration/diet adjustment.', NULL, NULL, NULL),
('2025-10-14', 'Vitamin D (25-OH)', 10.9, 'ng/mL', NULL, 'Chugtai', 'lab', 'Problematic: Yes. Severe deficiency; supplementation advised.', NULL, NULL, NULL),
('2025-10-14', 'Lipid Profile', NULL, NULL, 'Total Cholesterol 118, HDL 33 (Low), LDL 69', 'Chugtai', 'lab', 'Problematic: Yes. Low HDL, otherwise good lipid profile.', NULL, NULL, NULL),
('2025-10-14', 'CBC', NULL, NULL, 'Normal', 'Chugtai', 'lab', 'Problematic: No. Healthy blood count.', NULL, NULL, NULL),
('2025-10-14', 'ESR', 10.0, 'mm/hr', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal inflammation marker.', NULL, NULL, NULL),
('2025-10-14', 'Plasma Glucose (Fasting)', 86.0, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal.', NULL, NULL, NULL),
('2025-10-14', 'HbA1c', NULL, NULL, '5.30%', 'Chugtai', 'lab', 'Problematic: No. Normal glycemic control.', NULL, NULL, NULL),
('2025-10-14', 'Renal Profile', NULL, NULL, 'Urea 20, Creatinine 0.9, eGFR 120', 'Chugtai', 'lab', 'Problematic: No. Normal kidney function.', NULL, NULL, NULL),
('2025-10-14', 'Liver Profile', NULL, NULL, 'All within normal limits', 'Chugtai', 'lab', 'Problematic: No. Healthy liver function.', NULL, NULL, NULL),
('2025-10-14', 'TSH', 0.4, '0', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal thyroid function.', NULL, NULL, NULL),
('2025-10-14', 'HBsAg & Anti-HCV', NULL, NULL, 'Non-Reactive', 'Chugtai', 'lab', 'Problematic: No. No hepatitis B or C infection.', NULL, NULL, NULL),
('2025-10-21', 'Stool for Pancreatice Elastase-1', 145.0, 'ug/g', NULL, 'Chugtai', 'lab', 'Problematic: Yes. Over 200ug/g considered normal; 100-200 ug/g sight to moderate exocrine pancreate insufficiency', NULL, NULL, 'stool was formed'),
('2025-10-21', 'Stool test Occult', NULL, NULL, 'No blood or puss', 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2025-10-21', 'C. Difficile', NULL, NULL, 'Normal', 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2025-10-21', 'Stool for fat globules (AKU)', NULL, NULL, 'Negative', 'Chugtai', 'lab', 'Problematic: No. No excess fat detected in the stool. This means normal fat digestion and absorption — no evidence of fat malabsorption or pancreatic insufficiency severe enough to cause steatorrhea (fatty stool).', NULL, NULL, NULL),
('2025-11-04', 'Terminal Ileum Biopsy', NULL, NULL, 'Ileal mucosa with mild non-specific inflammation; villous architecture intact; no dysplasia or malignancy seen', 'Chugtai', 'lab', 'Problematic: Slight. Normal overall structure. Mild, non-specific inflammation only — no evidence of Crohn’s disease, celiac disease, or cancer.', NULL, NULL, NULL),
('2025-11-04', 'Rectal Biopsy', NULL, NULL, 'Rectal mucosa with mild non-specific inflammation and prominent lymphoid aggregates; no dysplasia or malignancy seen', 'Chugtai', 'lab', 'Problematic: Slight. Mild, non-specific inflammation — could be due to irritation, infection, or other benign causes. No cancer, ulcerative colitis, or structural abnormality.', NULL, NULL, NULL),
('2025-11-05', 'Serum Amylase', 57.0, 'U/L', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal — within reference range (25–125 U/L). Indicates normal enzyme activity; no sign of acute pancreatitis or major pancreatic inflammation.', NULL, NULL, NULL),
('2025-11-05', 'Serum Lipase', 25.0, 'U/L', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal — within reference range (0–60 U/L). Lipase is a more specific test for the pancreas; this result rules out acute pancreatic inflammation.', NULL, NULL, NULL),
('2025-11-11', 'Serum Vitamin B12', 237.0, 'pg/ml', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal range', NULL, NULL, NULL),
('2025-11-11', 'Serum Magnesium', 2.1, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2025-11-11', 'Stool for Helicobacter Pylori Antigen', NULL, NULL, '0.189 (Negative)', 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2025-12-01', 'ESR', 10.0, 'mm/hr', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2025-12-01', 'Serum Amylase', 63.0, 'U/L', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2025-12-01', 'Serum Lipase', 24.0, 'U/L', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2025-12-01', 'Serum CRP', 13.7, 'mg/L', NULL, 'Chugtai', 'lab', 'Problematic: Yes. High', NULL, NULL, NULL),
('2025-12-01', 'Serum 25-OH Vitamin D', 46.7, 'ng/ml', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2025-12-01', 'Serum TSH', 0.93, 'uIU/mL', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2025-12-01', 'Serum HBsAg', NULL, NULL, '0.5', 'Chugtai', 'lab', 'Problematic: No. Non reactive', NULL, NULL, NULL),
('2025-12-01', 'Serum Anti-HCV', NULL, NULL, '0.12', 'Chugtai', 'lab', 'Problematic: No. Non reactive', NULL, NULL, NULL),
('2025-12-01', 'Serum Anti-Tissue Transglutaminase IgG', 0.5, 'AU/mL', NULL, 'Chugtai', 'lab', 'Problematic: No. Negative', NULL, NULL, NULL),
('2025-12-01', 'Serum Anti-Tissue Transglutaminase IgA', 2.4, 'AU/mL', NULL, 'Chugtai', 'lab', 'Problematic: No. Negative', NULL, NULL, NULL),
('2025-12-22', 'Stool for Pancreatice Elastase-1', 77.3, 'ug/g', NULL, 'Chugtai', 'lab', 'Problematic: Yes. Over 200ug/g considered normal; 100-200 ug/g sight to moderate exocrine pancreate insufficiency; Under 100 considered severe pancreatic enzyme insufficiency', NULL, NULL, 'stool was formed'),
('2025-12-22', 'Uric Acid', 7.4, 'mg/dL', NULL, 'chugtai', 'lab', 'Problematic: Yes. Mild hyperuricemia; may need hydration/diet adjustment.', NULL, NULL, NULL),
('2025-12-22', 'Serum CRP', 8.3, 'mg/L', NULL, 'Chugtai', 'lab', 'Problematic: Yes. High', NULL, NULL, NULL),
('2025-12-22', 'Serum Calcium (Total)', 9.0, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. In Normal range', NULL, NULL, NULL),
('2025-12-22', 'Serum Iron', 58.0, 'ug/dL', NULL, 'Chugtai', 'lab', 'Problematic: Yes. Under 65 considered low', NULL, NULL, NULL),
('2025-12-22', 'Serum TIBC', 306.0, 'ug/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2025-12-22', 'Serum 25-OH Vitamin D', 34.1, 'ng/mL', NULL, 'Chugtai', 'lab', 'Problematic: Slightly. While in the optimal range, the value has dropped since last reading which was 46.7. Note that last vitamin D dose was taken on 17 November 2025', NULL, NULL, NULL),
('2025-12-22', 'CBC MPV fl', NULL, NULL, '11.1', 'Chugtai', 'lab', 'Problematic: Yes. acceptable range is 7-11. Pervious value was 10.2 on 14 October 2025', NULL, NULL, NULL),
('2025-12-22', 'Abs. Lymphocytes', NULL, NULL, '3.12', 'Chugtai', 'lab', 'Problematic: Yes. acceptable range is 1-3. Pervious value was 2.82 on 14 October 2025', NULL, NULL, NULL),
('2025-12-22', 'CBC apart from CBC MPV fl  and Abs. Lymphocytes', NULL, NULL, 'Normal', 'Chugtai', 'lab', 'Problematic: No. apart from CBC MPV fl  and Abs. Lymphocytes  all values are normal', NULL, NULL, NULL),
('2025-12-23', 'Serum Human IgG 4', 506.0, 'mg/L', NULL, 'Chugtai', 'lab', 'Problematic: No. 39.2 - 864 is considered normal', NULL, NULL, NULL),
('2025-12-24', 'Abdomen Mri with contrast (Pancreatic Protocol)', NULL, NULL, 'Findings:
Liver: Smooth surfaced, homogenous textured liver. No hepatic mass or abscess seen. No intra or
extra hepatic biliary duct dilatation. Portal and hepatic veins are patent.
Gall bladder: Normal in size and shape. No mass or calculus seen. No pericholecystic fluid
collection.
Pancreas: Normal outlines. No mass or ductal dilatation. No peripancreatic inflammatory changes
or fluid collection.
Spleen: Normal size. No mass seen.
Kidneys: Both are normal. No mass or cyst seen. No hydronephrosis.
Retroperitoneum: No retroperitoneal mass or collection.
Aorta & IVC: Normal.
Lymph nodes: No intra or retroperitoneal lymph node enlargement.
Mesentery /Omentum: No mass seen.
Stomach & Bowel: No mass, wall thickening or abnormal dilatation.
Abdominal Walls: No hernia, mass or collection.
Ascites: None.
Pleural effusion: No basal pleural effusion seen.', 'Chugtai', 'procedure', 'Problematic: No. Pancreatic outline is preserved. No peripancreatic collection or fat stranding.
No focal mesenteritis. Small and large bowel caliber within normal limits.', NULL, NULL, NULL),
('2025-12-26', 'Vitman B12', 228.0, 'pg/ML', NULL, 'Chugtai', 'lab', 'Problematic: Slightly. It''s in borderline optimal range (187-883) and the value has dropped from 237 from 11th November', NULL, NULL, NULL),
('2025-12-26', 'Stool for Pancreatice Elastase-1', 213.0, 'ug/g', NULL, 'Chugtai', 'lab', 'Problematic: No. Over 200ug/g considered normal; 100-200 ug/g sight to moderate exocrine pancreate insufficiency; Under 100 considered severe pancreatic enzyme insufficiency', NULL, NULL, 'stool was formed'),
('2025-12-26', 'Stool for Pancreatice Elastase-1 (conducted by IDC Lab)', 312.0, 'ug/mL', NULL, 'IDC', 'lab', 'Problematic: No. Over 200ug/g considered normal; 100-200 ug/mL sight to moderate exocrine pancreate insufficiency; Under 100 considered severe pancreatic enzyme insufficiency', NULL, NULL, 'stool was formed'),
('2026-01-24', 'Stool for Undigested Food Particles', NULL, NULL, 'Absent', 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2026-01-24', 'Liver Function Tests', NULL, NULL, 'Normal', 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2026-01-24', 'Serum Vitamin B12', 284.0, 'pg/mL', NULL, 'Chugtai', 'lab', 'Problematic: No. Still Low', NULL, NULL, NULL),
('2026-01-24', 'Serum Magnesium', 1.9, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. Slight drop from previous result but still normal', NULL, NULL, NULL),
('2026-01-24', 'Serum Amylase', 71.0, 'U/L', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2026-01-24', 'Serum Iron', 85.0, 'ug/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2026-01-24', 'Serum Lipase', 38.0, 'U/L', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal', NULL, NULL, NULL),
('2026-01-24', 'Serum CRP', 8.0, 'mg/L', NULL, 'Chugtai', 'lab', 'Problematic: Yes. Non specific inflamation', NULL, NULL, NULL),
('2026-01-24', 'Serum 25-OH Vitamin D', 39.7, 'ng/mL', NULL, 'Chugtai', 'lab', 'Problematic: No. Normal but a bit low despite active supplemenation', NULL, NULL, NULL),
('2026-01-24', 'Blood C/E e Peripheral Film/Smear', NULL, NULL, 'Normal CBC
PERIPHERAL SMEAR
RBC Morphology:
Normocytic normochromic
WBC Morphology:
Some lymphocytes are reactive in type.
Platelets Morphology:
Adequate.', 'Chugtai', 'lab', 'Problematic: Slight. Overall normal', NULL, NULL, NULL),
('2026-01-24', 'PT / INR', 12.0, '/', NULL, 'Chugtai', 'lab', 'Problematic: Yes. Sligtly elevated PT (10.0 - 11.5) and INR (0.93 - 1.08). Using as vitamin K proxy', NULL, NULL, NULL),
('2026-01-24', 'Serum Anti-Tissue Transglutaminase IgA', 2.5, 'AU/mL', NULL, 'Chugtai', 'lab', 'Problematic: No. Negative', NULL, NULL, NULL),
('2026-01-30', 'Stool for Pancreatice Elastase-1', 49.2, 'ug/g', NULL, 'Chugtai', 'lab', 'Problematic: Yes. Over 200ug/g considered normal; 100-200 ug/g sight to moderate exocrine pancreate insufficiency; Under 100 considered severe pancreatic enzyme insufficiency', NULL, NULL, 'stool was formed'),
('2026-01-30', 'Stool for Pancreatice Elastase-1', 128.0, 'ug/g', NULL, 'IDC', 'lab', 'Problematic: Yes. Over 200ug/g considered normal; 100-200 ug/g sight to moderate exocrine pancreate insufficiency; Under 100 considered severe pancreatic enzyme insufficiency', NULL, NULL, 'stool was formed'),
('2026-01-31', 'Serum CA 19-9', 3.0, 'u/mL', NULL, 'Chugtai', 'lab', 'Problematic: No. 37u/mL and under considered normal. Above considered high', NULL, NULL, NULL),
('2026-02-03', 'Plasma Glucose (Fasting)', 82.0, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. 70-90 considered normal', NULL, NULL, NULL),
('2026-02-03', 'Glycosylated Hemoglobin (HbA1c)', NULL, NULL, '5.20%', 'Chugtai', 'lab', 'Problematic: No. under 5.7% considered normal', NULL, NULL, NULL),
('2026-02-03', 'Serum Total Cholesterol', 114.0, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. <200 is desirable', NULL, NULL, NULL),
('2026-02-03', 'Serum Triglycerides', 61.0, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. <150 is desirable', NULL, NULL, NULL),
('2026-02-03', 'Serum HDL-Cholesterol', 38.0, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: Yes. Normal is > 40. However value higher than last time', NULL, NULL, NULL),
('2026-02-03', 'Direct LDL Cholesterol', 61.0, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. <100 desirable', NULL, NULL, NULL),
('2026-02-03', 'Serum Non-HDL Cholesterol', 76.0, 'mg/dL', NULL, 'Chugtai', 'lab', 'Problematic: No. <129 is desirable', NULL, NULL, NULL);
insert into medications (entry_date, prescribed_by, name, dose, dose_unit, dose_count, frequency, start_date, end_date, stop_date, status, notes) values
('2025-08-27', 'Dr. Mian Asim Masood', 'Cap Voniza', 20.0, 'mg', NULL, NULL, '2025-08-27', NULL, '2025-08-27', 'stopped', 'Original: Cap Voniza 20 mg'),
('2025-08-27', 'Dr. Mian Asim Masood', 'Tab Pelton-V', 10.0, 'mg', NULL, NULL, '2025-08-27', NULL, '2025-08-27', 'stopped', 'Original: Tab Pelton-V 10 mg'),
('2025-08-27', 'Dr. Mian Asim Masood', 'Tab Seluroid', 50.0, 'mg', NULL, NULL, '2025-08-27', NULL, '2025-08-27', 'stopped', 'Original: Tab Seluroid 50 mg'),
('2025-08-27', 'Dr. Mian Asim Masood', 'Tab Nimixa', 550.0, 'mg', NULL, NULL, '2025-08-27', NULL, '2025-08-27', 'stopped', 'Original: Tab Nimixa 550 mg'),
('2025-09-05', 'Dr. Mian Asim Masood', 'Cap Esso', 40.0, 'mg', NULL, NULL, '2025-09-05', NULL, '2025-09-05', 'stopped', 'Original: Cap Esso 40 mg'),
('2025-09-05', 'Dr. Mian Asim Masood', 'Tab ITP', 50.0, 'mg', NULL, NULL, '2025-09-05', NULL, '2025-09-05', 'stopped', 'Original: Tab ITP 50 mg'),
('2025-09-05', 'Dr. Mian Asim Masood', 'Tab Neoprod', 50.0, 'mg', NULL, NULL, '2025-09-05', NULL, '2025-09-05', 'stopped', 'Original: Tab Neoprod 50 mg'),
('2025-09-05', 'Dr. Mian Asim Masood', 'Syr Gaviscon Advance', NULL, NULL, NULL, NULL, '2025-09-05', NULL, '2025-09-05', 'stopped', 'Original: Syr Gaviscon Advance'),
('2025-09-08', 'Dr. Mian Asim Masood', 'Cap Delomzo DR', 30.0, 'mg', NULL, NULL, '2025-09-08', NULL, '2025-09-08', 'stopped', 'Original: Cap Delomzo DR 30 mg'),
('2025-09-08', 'Dr. Mian Asim Masood', 'Tab Motilium', 10.0, 'mg', NULL, NULL, '2025-09-08', NULL, '2025-09-08', 'stopped', 'Original: Tab Motilium 10 mg'),
('2025-09-08', 'Dr. Mian Asim Masood', 'Tab Seluroid', 50.0, 'mg', NULL, NULL, '2025-09-08', NULL, '2025-09-08', 'stopped', 'Original: Tab Seluroid 50 mg'),
('2025-09-08', 'Dr. Mian Asim Masood', 'Syr Ulsonic', NULL, NULL, NULL, NULL, '2025-09-08', NULL, '2025-09-08', 'stopped', 'Original: Syr Ulsonic'),
('2025-09-08', 'Dr. Mian Asim Masood', 'Tab Baclin', 10.0, 'mg', NULL, NULL, '2025-09-08', NULL, '2025-09-08', 'stopped', 'Original: Tab Baclin 10 mg'),
('2025-09-10', 'Prof. Dr. Muhammad Asif Gul / Dr. Hira Sadaqat', 'Cap Ospamox', 500.0, 'mg', 500, NULL, '2025-09-10', NULL, '2025-09-10', 'stopped', 'Original: Cap Ospamox 500 mg'),
('2025-09-10', 'Prof. Dr. Muhammad Asif Gul / Dr. Hira Sadaqat', 'Tab Leflox', 250.0, 'mg', 250, NULL, '2025-09-10', NULL, '2025-09-10', 'stopped', 'Original: Tab Leflox 250 mg'),
('2025-09-10', 'Prof. Dr. Muhammad Asif Gul / Dr. Hira Sadaqat', 'Tab Prevent', 500.0, 'mg', NULL, NULL, '2025-09-10', NULL, '2025-09-10', 'stopped', 'Original: Tab Prevent 500 mg'),
('2025-09-10', 'Prof. Dr. Muhammad Asif Gul / Dr. Hira Sadaqat', 'Cap Purpalia', 40.0, 'mg', NULL, NULL, '2025-09-10', NULL, '2025-09-10', 'stopped', 'Original: Cap Purpalia 40 mg'),
('2025-09-16', 'Prof. Dr. Muhammad Asif Gul', 'Cap Ospamox', 500.0, 'mg', 500, NULL, '2025-09-16', NULL, '2025-09-16', 'stopped', 'Original: Cap Ospamox 500 mg'),
('2025-09-16', 'Prof. Dr. Muhammad Asif Gul', 'Tab Leflox', 250.0, 'mg', 250, NULL, '2025-09-16', NULL, '2025-09-16', 'stopped', 'Original: Tab Leflox 250 mg'),
('2025-09-16', 'Prof. Dr. Muhammad Asif Gul', 'Tab Prevent', 500.0, 'mg', NULL, NULL, '2025-09-16', NULL, '2025-09-16', 'stopped', 'Original: Tab Prevent 500 mg'),
('2025-09-16', 'Prof. Dr. Muhammad Asif Gul', 'Cap Purpalia', 40.0, 'mg', NULL, NULL, '2025-09-16', NULL, '2025-09-16', 'stopped', 'Original: Cap Purpalia 40 mg'),
('2025-10-03', 'Prof. Dr. Muhammad Asif Gul', 'Tab Vodyson', 10.0, 'mg', NULL, NULL, '2025-10-03', NULL, '2025-10-03', 'stopped', 'Original: Tab Vodyson 10 mg'),
('2025-10-03', 'Prof. Dr. Muhammad Asif Gul', 'Tab Cidine', 1.0, 'mg', NULL, NULL, '2025-10-03', NULL, '2025-10-03', 'stopped', 'Original: Tab Cidine 1 mg'),
('2025-10-03', 'Prof. Dr. Muhammad Asif Gul', 'Syr Hyland', 5.0, 'ml', NULL, NULL, '2025-10-03', NULL, '2025-10-03', 'stopped', 'Original: Syr Hyland 5 ml'),
('2025-12-01', 'Dr. Moazzam Baig', 'Tab Nexum', 40.0, 'mg', NULL, '2 months', '2025-12-01', NULL, NULL, 'active', 'Original: Tab Nexum 40mg 2 months'),
('2025-12-01', 'Dr. Moazzam Baig', 'Tab Palton V', NULL, NULL, NULL, NULL, '2025-12-01', NULL, NULL, 'active', 'Original: Tab Palton V'),
('2025-12-01', 'Dr. Moazzam Baig', '7 14 days', NULL, NULL, NULL, '14 days', '2025-12-01', NULL, NULL, 'active', 'Original: 7 14 days'),
('2025-12-01', 'Dr. Moazzam Baig', 'Tab Rafixa', 550.0, 'mg', NULL, '10 days', '2025-12-01', NULL, NULL, 'active', 'Original: Tab Rafixa 550mg 10 days'),
('2025-12-01', 'Dr. Moazzam Baig', 'Tab colofac', 135.0, 'mg', NULL, '7 days', '2025-12-01', NULL, NULL, 'active', 'Original: Tab colofac 135mg 7 days'),
('2025-12-01', 'Dr. Moazzam Baig', 'Tab bismol 7 days', NULL, NULL, NULL, '7 days', '2025-12-01', NULL, NULL, 'active', 'Original: Tab bismol 7 days'),
('2025-12-25', 'Dr. Ghias ul hassan', 'h2 fiber syrup', NULL, NULL, NULL, NULL, '2025-12-25', NULL, NULL, 'active', 'Original: h2 fiber syrup'),
('2025-12-25', 'Dr. Ghias ul hassan', 'vonma', 20.0, 'mg', 2, 'twice per day', '2025-12-25', NULL, NULL, 'active', 'Original: vonma 20 mg twice per day'),
('2025-12-25', 'Dr. Ghias ul hassan', 'sunny D after 15 days', NULL, NULL, NULL, 'after 15 days', '2025-12-25', NULL, NULL, 'active', 'Original: sunny D after 15 days');
insert into diagnoses (entry_date, name, diagnosis_date, status, provider, notes) values
('2025-08-27', 'Loose stools ( diarrhea )', '2025-08-27', 'monitoring', 'Dr. Mian Asim Masood', 'Loose stools ( diarrhea ). LFTs advised, H. Pylori IgM/IgAordered. Follow-up 3 Sep.'),
('2025-09-05', 'Chronic gastritis', '2025-09-05', 'monitoring', 'Dr. Mian Asim Masood', 'Chronic gastritis'),
('2025-09-08', 'Chronic gastritis O/P EGD – biopsy awaited', '2025-09-08', 'monitoring', 'Dr. Mian Asim Masood', 'Chronic gastritis O/P EGD – biopsy awaited'),
('2025-09-10', 'Loose stools ≈ 1 month ( post-Flagyl )', '2025-09-10', 'monitoring', 'Prof. Dr. Muhammad Asif Gul / Dr. Hira Sadaqat', 'Loose stools ≈ 1 month ( post-Flagyl ).'),
('2025-09-15', 'Early weight loss begins after antibiotics', '2025-09-15', 'monitoring', '—', 'Early weight loss begins after antibiotics.'),
('2025-09-16', 'On H', '2025-09-16', 'monitoring', 'Prof. Dr. Muhammad Asif Gul', 'On H. Pylori treatment'),
('2025-09-25', 'Near completion of antibiotics', '2025-09-25', 'monitoring', '—', 'Near completion of antibiotics.'),
('2025-09-28', 'Post-treatment stabilization', '2025-09-28', 'monitoring', '—', 'Post-treatment stabilization.'),
('2025-09-30', 'Slight improvement in digestion', '2025-09-30', 'monitoring', '—', 'Slight improvement in digestion.'),
('2025-10-03', 'Epigastric heaviness, air burps, retrosternal burn', '2025-10-03', 'monitoring', 'Prof. Dr. Muhammad Asif Gul', 'Epigastric heaviness, air burps, retrosternal burn. Loose stool settled. Calprotectin < 20 (normal).'),
('2025-10-05', 'Weight plateau after recovery', '2025-10-05', 'monitoring', '—', 'Weight plateau after recovery.'),
('2025-10-14', 'Stable digestive state, weight maintained', '2025-10-14', 'monitoring', '—', 'Stable digestive state, weight maintained.'),
('2025-12-01', 'IBS, GERD, APD, Anxiety Depression', '2025-12-01', 'monitoring', 'Dr. Moazzam Baig', 'IBS, GERD, APD, Anxiety Depression'),
('2025-12-25', 'GERD, GAD, Nothing in MRI for pancreas lets repeat test after 2 months', '2025-12-25', 'monitoring', 'Dr. Ghias ul hassan', 'GERD, GAD, Nothing in MRI for pancreas lets repeat test after 2 months');
insert into doctor_visits (visit_date, doctor, diagnosis_summary, medications_summary, completed, weight_value, weight_unit, notes) values
('2025-08-27', 'Dr. Mian Asim Masood', 'Loose stools ( diarrhea )', 'Cap Voniza 20 mg ; Tab Pelton-V 10 mg ; Tab Seluroid 50 mg ; Tab Nimixa 550 mg', TRUE, 121.0, 'kg', 'Loose stools ( diarrhea ). LFTs advised, H. Pylori IgM/IgAordered. Follow-up 3 Sep.'),
('2025-09-05', 'Dr. Mian Asim Masood', 'Chronic gastritis', 'Cap Esso 40 mg ; Tab ITP 50 mg ; Tab Neoprod 50 mg ; Syr Gaviscon Advance', TRUE, NULL, NULL, 'Chronic gastritis'),
('2025-09-08', 'Dr. Mian Asim Masood', 'Chronic gastritis O/P EGD – biopsy awaited', 'Cap Delomzo DR 30 mg ; Tab Motilium 10 mg ; Tab Seluroid 50 mg; Syr Ulsonic Tab Baclin 10 mg', TRUE, 120.0, 'kg', 'Chronic gastritis O/P EGD – biopsy awaited'),
('2025-09-10', 'Prof. Dr. Muhammad Asif Gul / Dr. Hira Sadaqat', 'Loose stools ≈ 1 month ( post-Flagyl )', 'Cap Ospamox 500 mg ; Tab Leflox 250 mg ; Tab Prevent 500 mg ; Cap Purpalia 40 mg', TRUE, 120.0, 'kg', 'Loose stools ≈ 1 month ( post-Flagyl ).'),
('2025-09-16', 'Prof. Dr. Muhammad Asif Gul', 'On H', 'Cap Ospamox 500 mg ; Tab Leflox 250 mg ; Tab Prevent 500 mg ; Cap Purpalia 40 mg', TRUE, 118.0, 'kg', 'On H. Pylori treatment'),
('2025-10-03', 'Prof. Dr. Muhammad Asif Gul', 'Epigastric heaviness, air burps, retrosternal burn', 'Tab Vodyson 10 mg ; Tab Cidine 1 mg ; Syr Hyland 5 ml', TRUE, 117.0, 'kg', 'Epigastric heaviness, air burps, retrosternal burn. Loose stool settled. Calprotectin < 20 (normal).'),
('2025-12-01', 'Dr. Moazzam Baig', 'IBS, GERD, APD, Anxiety Depression', 'Tab Nexum 40mg 2 months, ; Tab Palton V 12.7 14 days,  ; Tab Rafixa 550mg 10 days, ; Tab colofac 135mg 7 days, ; Tab bismol 7 days', NULL, 112.3, 'kg', 'IBS, GERD, APD, Anxiety Depression'),
('2025-12-25', 'Dr. Ghias ul hassan', 'GERD, GAD, Nothing in MRI for pancreas lets repeat test after 2 months', '1. h2 fiber syrup; 2. vonma 20 mg twice per day; 3. sunny D after 15 days', NULL, 110.5, 'kg', 'GERD, GAD, Nothing in MRI for pancreas lets repeat test after 2 months');
commit;