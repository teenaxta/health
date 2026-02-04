-- Generated from user-provided procedures data
begin;
delete from lab_tests where category = 'procedure' or test_name ilike '%mri%' or test_name ilike '%endoscopy%' or test_name ilike '%colonoscopy%' or test_name ilike '%biopsy%';
insert into lab_tests (entry_date, test_name, result_text, lab_name, reference_notes, category) values
  ('2025-09-08', $$Upper GI Endoscopy$$, $$Oropharynx: Good hygiene; normal vocal cord movement.

Esophagus: Normal upper third; multiple ulcerations with erythema, friable (bleeds easily) in middle/lower third (LA Class C); incompetent LES.

Stomach: No fundal varix; moderate gastritis throughout.

Duodenum: Multiple erosions in bulb and descending duodenum.$$, $$Chugtai$$, $$Inflammation in esophagus (reflux), gastritis, and mild duodenal erosions. Note: Several doctors dispute the "LA Class C" finding based on the images.$$, 'procedure'),
  ('2025-09-10', $$Gastric Biopsy$$, $$Mild Chronic Focal Active Gastritis; H. pylori: Mild Colonization.$$, $$Chugtai$$, $$Confirms mild H. pylori-associated gastritis; no intestinal metaplasia or dysplasia.$$, 'procedure'),
  ('2025-12-24', $$Abdomen MRI (Pancreatic Protocol)$$, $$Liver, Gallbladder, Pancreas, Spleen, Kidneys: All normal; no masses, stones, or ductal dilatation.

Vessels: Aorta, IVC, Portal/Hepatic veins patent/normal.

Bowel/Nodes: No wall thickening, abnormal dilatation, or lymph node enlargement.

Other: No ascites, hernias, or pleural effusion.$$, $$Chugtai$$, $$Pancreatic outline preserved. No fat stranding or focal mesenteritis. Small and large bowel caliber within normal limits.$$, 'procedure'),
  ('2025-11-04', $$Terminal Ileum Biopsy$$, $$Ileal mucosa with mild non-specific inflammation; villous architecture intact; no dysplasia/malignancy.$$, $$Chugtai$$, $$Normal overall structure. No evidence of Crohn's disease, celiac disease, or cancer.$$, 'procedure'),
  ('2025-11-04', $$Rectal Biopsy$$, $$Rectal mucosa with mild non-specific inflammation and prominent lymphoid aggregates; no dysplasia/malignancy.$$, $$Chugtai$$, $$Mild, non-specific inflammation (likely benign irritation or infection). No cancer, ulcerative colitis, or structural abnormality.$$, 'procedure');
commit;