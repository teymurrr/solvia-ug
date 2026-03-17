

## Internal Sales Tool: Interactive Homologation Map

### Overview
A protected internal page (`/internal/homologation-map`) with an interactive SVG map of Europe. Click a country to see its homologation requirements; for Germany, drill into Bundesland-level differences. Designed for use during sales calls to visually explain requirements to prospects.

### Architecture

```text
/internal/homologation-map
├── EuropeMap (SVG)          ← clickable countries (DE, AT, ES highlighted)
├── CountryDetailPanel       ← slides in from right when country clicked
│   ├── Requirements summary (timeline, cost, language, docs)
│   ├── RegionMap (for Germany only — 16 Bundesländer SVG)
│   └── RegionDetailCard     ← differences per state
└── ComparisonMode toggle    ← side-by-side 2-country comparison
```

### Key Components

**1. Europe SVG Map** (`src/components/internal/EuropeMap.tsx`)
- Inline SVG with country paths for DE, AT, ES (other countries greyed out)
- Clickable regions with hover highlight (primary color fill)
- Country flags + labels overlaid
- Active country gets a glowing border

**2. Germany Regional Sub-Map** (`src/components/internal/GermanyRegionMap.tsx`)
- SVG of 16 Bundesländer, clickable
- Color-coded by processing speed or difficulty (green = fast, amber = medium, red = slow)
- Key regional differences to display per state:
  - Responsible authority (Regierungspräsidium, Landesamt, etc.)
  - Average processing time
  - FSP exam difficulty/format
  - Whether Berufserlaubnis is issued quickly
  - Specific state requirements

**3. Country Detail Panel** (`src/components/internal/CountryDetailPanel.tsx`)
- Pulls from existing `homologationDataByCountry` data
- Shows: timeline, cost breakdown, language requirements, required documents, professional exam info
- For Germany: "Click a state for regional details" prompt with the sub-map

**4. Regional Data** (`src/data/germanRegionalData.ts`)
- New data file with per-Bundesland information:
  - Authority name & contact
  - Average processing time
  - FSP format (e.g., Bayern uses different format than NRW)
  - Notes on Berufserlaubnis
  - Tips for that state

### Data to Create

**`src/data/germanRegionalData.ts`** — structured data for all 16 states covering:
- `bayern`, `nrw`, `hessen`, `berlin`, `hamburg`, etc.
- Fields: `authority`, `processingTime`, `fspFormat`, `berufserlaubnisSpeed`, `notes`, `difficulty` (1-5 scale for color coding)

**Austria & Spain** — no regional sub-maps needed initially (centralized processes), but the panel will show any relevant regional notes.

### Page & Route

- New page: `src/pages/internal/HomologationMap.tsx`
- Route: `/internal/homologation-map` (no auth gate needed since it's an internal tool, but hidden from navigation)
- Uses `MainLayout` with a full-width content area
- Responsive but optimized for desktop/presentation (1000px+ viewport)

### SVG Strategy

Use simplified inline SVG paths for Europe and Germany maps. No external map library needed — keeps bundle small and gives full styling control. The SVGs will be hand-crafted with accurate-enough country/state boundaries for a professional presentation.

### Implementation Steps

1. Create `germanRegionalData.ts` with data for all 16 Bundesländer
2. Create `EuropeMap.tsx` SVG component with clickable DE/AT/ES
3. Create `GermanyRegionMap.tsx` SVG component with 16 clickable states
4. Create `CountryDetailPanel.tsx` pulling from existing homologation data
5. Create `HomologationMap.tsx` page wiring everything together
6. Add route (hidden from nav)

