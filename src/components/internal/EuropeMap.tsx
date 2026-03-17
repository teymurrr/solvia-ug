import React, { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

interface EuropeMapProps {
  selectedCountry: string | null;
  onCountryClick: (country: string) => void;
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

const COUNTRY_MAP: Record<string, string> = {
  '276': 'germany',
  '40': 'austria',
  '724': 'spain',
};

const ACTIVE_ISO = new Set(['276', '40', '724']);

const MARKERS: { country: string; coordinates: [number, number]; label: string; flag: string }[] = [
  { country: 'germany', coordinates: [10.4, 51.1], label: 'Germany', flag: '🇩🇪' },
  { country: 'austria', coordinates: [14.5, 47.5], label: 'Austria', flag: '🇦🇹' },
  { country: 'spain', coordinates: [-3.7, 40.0], label: 'Spain', flag: '🇪🇸' },
];

// Colors as concrete values (CSS var syntax doesn't work in inline SVG styles)
const COLORS = {
  muted: '#f1f5f9',
  border: '#e2e8f0',
  primary: '#2563eb',
  primaryLight: 'rgba(37, 99, 235, 0.2)',
  primaryHover: 'rgba(37, 99, 235, 0.35)',
  primaryForeground: '#ffffff',
  foreground: '#0f172a',
};

const EuropeMap: React.FC<EuropeMapProps> = ({ selectedCountry, onCountryClick }) => {
  return (
    <div className="relative w-full">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-10, -52, 0],
          center: [0, 0],
          scale: 1000,
        }}
        width={800}
        height={580}
        style={{ width: '100%', height: 'auto' }}
      >
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
                        ? COLORS.primary
                        : isActive
                          ? COLORS.primaryLight
                          : COLORS.muted,
                      stroke: isActive ? COLORS.primary : COLORS.border,
                      strokeWidth: isActive ? 1.2 : 0.3,
                      outline: 'none',
                      cursor: isActive ? 'pointer' : 'default',
                      transition: 'fill 200ms',
                    },
                    hover: {
                      fill: isSelected
                        ? COLORS.primary
                        : isActive
                          ? COLORS.primaryHover
                          : COLORS.muted,
                      stroke: isActive ? COLORS.primary : COLORS.border,
                      strokeWidth: isActive ? 1.5 : 0.3,
                      outline: 'none',
                      cursor: isActive ? 'pointer' : 'default',
                    },
                    pressed: {
                      fill: isActive ? COLORS.primary : COLORS.muted,
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
          >
            <g style={{ cursor: 'pointer' }}>
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
                  fontSize: 10,
                  fontWeight: 600,
                  fill: selectedCountry === country ? COLORS.primaryForeground : COLORS.foreground,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {label}
              </text>
            </g>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default memo(EuropeMap);
