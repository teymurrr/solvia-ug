

## Plan: Official Document Uploads per Country/Region

### What
Allow uploading and accessing official PDF documents (e.g., government requirement checklists) per country and optionally per German Bundesland. Documents are stored in Supabase Storage and linked via a database table. They appear as downloadable links in the CountryDetailPanel and regional state detail cards.

### Database

**New table: `homologation_documents`**
- `id` uuid PK
- `country` text (e.g., 'germany', 'austria', 'spain')
- `region` text nullable (e.g., 'bayern', 'berlin' — for German states)
- `title` text (display name, e.g., "Official Approbation Checklist - Bayern")
- `file_path` text (storage path in bucket)
- `file_name` text (original filename)
- `file_size` integer
- `uploaded_by` uuid (admin user)
- `created_at` timestamptz
- RLS: anyone can SELECT (internal tool, no sensitive data); only admins can INSERT/UPDATE/DELETE

**Storage bucket:** `homologation-documents` (already exists, private). Add an RLS policy allowing authenticated users to read, and admins to upload.

### UI Changes

1. **CountryDetailPanel** — Add a "Official Documents" section after the existing documents list. Query `homologation_documents` filtered by country (and region=null for country-level docs). Each doc shows title + download button using signed URL.

2. **State Detail Card** (inside CountryDetailPanel for Germany) — When a Bundesland is selected, also show region-specific documents filtered by `region = selectedState`.

3. **Upload UI** — Add a small admin-only upload button (visible only to admins) in both the country panel and state detail card. Uses a file input for PDF upload to the `homologation-documents` bucket, then inserts a row into the table.

### Implementation Steps

1. Create `homologation_documents` table + storage RLS policies via migration
2. Build a reusable `DocumentList` component that fetches and displays documents with signed URL download links
3. Build a small `DocumentUpload` component (admin-only) for uploading PDFs
4. Integrate both into `CountryDetailPanel` — country-level docs and per-state docs
5. Add admin role check using existing `is_admin` function

