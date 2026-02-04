# Health Hub

A modern, app-like health tracking dashboard built with Next.js, Supabase, and Recharts.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Supabase project and run the schema in `supabase/schema.sql`.
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase URL and anon key.
4. Run the app:
   ```bash
   npm run dev
   ```

## Ingest CSV Data
Run the ingest script (requires internet access):
```bash
python scripts/ingest.py --reset
```
This will parse the CSVs in `data/` and reinsert fresh data.

## CSV Import/Export
- Go to `/import-export` to download templates or upload CSVs.
- Field mappings are listed on the page.

## Notes
- Auth is disabled for local development. Add RLS and `owner_id` later when you enable auth.
