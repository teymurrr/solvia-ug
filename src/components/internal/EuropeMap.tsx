import React, { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps';

interface EuropeMapProps {
  selectedCountry: string | null;
  onCountryClick: (country: string) => void;
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

const COUNTRY_MAP: Record<string, string> = {
  DEU: 'germany',
  AUT: 'austria',
  ESP: 'spain',
};

const ACTIVE_ISO: Set<string> = new Set(['DEU', 'AUT', 'ESP']);

const MARKERS: { country: string; coordinates: [number, number]; label: string; flag: string }[] = [
  { country: 'germany', coordinates: [10.4, 51.1], label: 'Germany', flag: '🇩🇪' },
  { country: 'austria', coordinates: [14.5, 47.5], label: 'Austria', flag: '🇦🇹' },
  { country: 'spain', coordinates: [-3.7, 40.0], label: 'Spain', flag: '🇪🇸' },
];

const EuropeMap: React.FC<EuropeMapProps> = ({ selectedCountry, onCountryClick }) => {
  return (
    <div className="relative w-full" style={{ maxHeight: '70vh' }}>
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-10, -52, 0],
          center: [0, 0],
          scale: 800,
        }}
        width={600}
        height={500}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup center={[0, 0]} zoom={1} minZoom={1} maxZoom={1}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso = geo.properties?.ISO_A3 || geo.id;
                const countryKey = COUNTRY_MAP[iso];
                const isActive = ACTIVE_ISO.has(iso);
                const isSelected = countryKey === selectedCountry;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (countryKey) onCountryClick(countryKey);
                    }}
                    style={{
                      default: {
                        fill: isSelected
                          ? 'hsl(var(--primary))'
                          : isActive
                            ? 'hsl(var(--primary) / 0.2)'
                            : 'hsl(var(--muted))',
                        stroke: isActive
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--border))',
                        strokeWidth: isActive ? 1.2 : 0.3,
                        outline: 'none',
                        cursor: isActive ? 'pointer' : 'default',
                        transition: 'fill 200ms',
                      },
                      hover: {
                        fill: isSelected
                          ? 'hsl(var(--primary))'
                          : isActive
                            ? 'hsl(var(--primary) / 0.35)'
                            : 'hsl(var(--muted))',
                        stroke: isActive
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--border))',
                        strokeWidth: isActive ? 1.5 : 0.3,
                        outline: 'none',
                        cursor: isActive ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Country labels */}
          {MARKERS.map(({ country, coordinates, label, flag }) => (
            <Marker
              key={country}
              coordinates={coordinates}
              onClick={() => onCountryClick(country)}
              style={{ cursor: 'pointer' }}
            >
              <text
                textAnchor="middle"
                y={-6}
                style={{ fontSize: 14, pointerEvents: 'none', userSelect: 'none' }}
              >
                {flag}
              </text>
              <text
                textAnchor="middle"
                y={8}
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  fill: selectedCountry === country
                    ? 'hsl(var(--primary-foreground))'
                    : 'hsl(var(--foreground))',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {label}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(EuropeMap);
