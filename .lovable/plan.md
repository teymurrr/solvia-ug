

## Root Cause Analysis

**Why clicking doesn't work:** The `world-atlas` TopoJSON uses **numeric ISO 3166-1 codes** as the `id` (e.g., `"276"` for Germany), not alpha-3 codes like `"DEU"`. The current code checks `geo.properties?.ISO_A3` (which doesn't exist in this dataset) and falls back to `geo.id` which returns `"276"` — but the `COUNTRY_MAP` only has keys for `DEU`, `AUT`, `ESP`. So no country ever matches, nothing highlights, nothing is clickable.

The hand-drawn SVG worked because each `<path>` had a manually assigned `id` like `"germany"` that matched directly.

**Why the map is too small:** `maxHeight: '60vh'` plus fixed `width={800} height={520}` dimensions constrain the map. The page also has padding and a header eating up space.

## Fix

### 1. EuropeMap.tsx — Fix country matching
Replace alpha-3 ISO keys with **numeric** ISO codes:

```text
COUNTRY_MAP: { '276': 'germany', '40': 'austria', '724': 'spain' }
ACTIVE_ISO:  Set(['276', '40', '724'])
```

### 2. EuropeMap.tsx — Make map fill available space
- Remove `maxHeight: '60vh'` constraint
- Increase `scale` from 900 to ~1000 for a larger Europe view
- Use `calc(100vh - 180px)` as max height so it fills the viewport minus the header/legend area
- Adjust `width` and `height` SVG dimensions to better fill the container

### 3. HomologationMap.tsx — Remove excess spacing
- Remove `min-h-screen` from the outer div (let the map dictate height)
- Reduce padding so the map card stretches to fill viewport

These three changes should restore full interactivity (hover, click, color-coding) and make the map fill the screen without scrolling.

