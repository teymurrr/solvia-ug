import React from 'react';

interface EuropeMapProps {
  selectedCountry: string | null;
  onCountryClick: (country: string) => void;
}

const ACTIVE_COUNTRIES = ['germany', 'austria', 'spain'];

const countryPaths: Record<string, { d: string; label: string; labelX: number; labelY: number; flag: string }> = {
  germany: {
    d: 'M480,180 L500,175 L520,180 L530,195 L540,210 L535,230 L540,250 L530,270 L520,280 L500,285 L485,280 L475,270 L465,255 L460,240 L465,225 L470,210 L475,195 Z',
    label: 'Germany',
    labelX: 500,
    labelY: 230,
    flag: '🇩🇪',
  },
  austria: {
    d: 'M475,285 L500,290 L525,285 L545,290 L555,300 L545,315 L525,320 L500,318 L480,315 L465,305 L468,295 Z',
    label: 'Austria',
    labelX: 510,
    labelY: 305,
    flag: '🇦🇹',
  },
  spain: {
    d: 'M280,350 L320,340 L360,345 L390,355 L400,380 L395,410 L380,430 L350,440 L310,445 L280,435 L260,415 L255,390 L260,370 Z',
    label: 'Spain',
    labelX: 330,
    labelY: 395,
    flag: '🇪🇸',
  },
};

// Simplified background country shapes for context
const backgroundCountries: { d: string; name: string }[] = [
  // France
  { d: 'M350,270 L380,260 L410,265 L430,280 L440,310 L430,340 L400,355 L370,350 L340,340 L330,315 L335,290 Z', name: 'France' },
  // Italy
  { d: 'M470,320 L490,325 L500,345 L495,370 L485,400 L475,420 L465,430 L460,415 L465,390 L460,360 L455,340 Z', name: 'Italy' },
  // UK
  { d: 'M340,150 L355,145 L365,160 L360,185 L350,200 L335,205 L325,195 L320,175 L325,160 Z', name: 'UK' },
  // Poland
  { d: 'M540,180 L575,175 L600,185 L605,210 L600,240 L580,255 L555,260 L540,250 L535,230 L540,210 Z', name: 'Poland' },
  // Czech Republic
  { d: 'M520,250 L545,248 L560,255 L558,270 L545,278 L525,280 L515,272 L518,260 Z', name: 'Czechia' },
  // Switzerland
  { d: 'M440,280 L465,275 L475,285 L468,298 L450,300 L438,292 Z', name: 'Switzerland' },
  // Netherlands
  { d: 'M430,155 L450,148 L460,155 L458,170 L448,178 L435,175 L428,165 Z', name: 'Netherlands' },
  // Belgium
  { d: 'M410,175 L430,170 L440,180 L435,192 L420,195 L408,188 Z', name: 'Belgium' },
  // Denmark
  { d: 'M470,130 L490,125 L500,135 L498,150 L488,160 L475,158 L468,148 Z', name: 'Denmark' },
  // Portugal
  { d: 'M245,370 L260,365 L265,385 L262,415 L255,430 L242,425 L238,400 Z', name: 'Portugal' },
  // Sweden
  { d: 'M500,50 L520,40 L535,55 L540,85 L535,115 L520,135 L505,130 L495,110 L490,80 L492,60 Z', name: 'Sweden' },
  // Norway
  { d: 'M460,30 L480,25 L495,40 L500,50 L492,60 L490,80 L480,100 L470,110 L460,95 L455,70 L458,45 Z', name: 'Norway' },
  // Finland
  { d: 'M560,30 L580,25 L600,40 L610,70 L605,100 L590,120 L575,115 L565,90 L555,60 Z', name: 'Finland' },
  // Hungary
  { d: 'M545,280 L575,275 L595,285 L598,300 L585,310 L560,315 L545,308 L540,295 Z', name: 'Hungary' },
  // Romania
  { d: 'M600,270 L635,265 L655,280 L658,305 L645,320 L620,325 L600,315 L595,295 Z', name: 'Romania' },
  // Greece
  { d: 'M570,380 L590,370 L605,380 L608,400 L600,420 L585,430 L570,420 L565,400 Z', name: 'Greece' },
];

const EuropeMap: React.FC<EuropeMapProps> = ({ selectedCountry, onCountryClick }) => {
  return (
    <div className="relative w-full">
      <svg
        viewBox="220 10 470 460"
        className="w-full h-auto"
        style={{ maxHeight: '70vh' }}
      >
        {/* Background countries */}
        {backgroundCountries.map((country) => (
          <path
            key={country.name}
            d={country.d}
            className="fill-muted stroke-border"
            strokeWidth="1"
          />
        ))}

        {/* Active countries */}
        {Object.entries(countryPaths).map(([key, country]) => {
          const isSelected = selectedCountry === key;
          const isActive = ACTIVE_COUNTRIES.includes(key);

          return (
            <g key={key} className="cursor-pointer" onClick={() => onCountryClick(key)}>
              <path
                d={country.d}
                className={`
                  transition-all duration-200 stroke-2
                  ${isSelected 
                    ? 'fill-primary stroke-primary' 
                    : isActive 
                      ? 'fill-secondary stroke-primary hover:fill-primary/30' 
                      : 'fill-muted stroke-border'}
                `}
                style={isSelected ? { filter: 'drop-shadow(0 0 8px hsl(213 97% 47% / 0.5))' } : {}}
              />
              {/* Country label */}
              <text
                x={country.labelX}
                y={country.labelY - 12}
                textAnchor="middle"
                className={`text-[11px] font-bold pointer-events-none select-none ${
                  isSelected ? 'fill-primary-foreground' : 'fill-foreground'
                }`}
              >
                {country.flag}
              </text>
              <text
                x={country.labelX}
                y={country.labelY + 4}
                textAnchor="middle"
                className={`text-[10px] font-semibold pointer-events-none select-none ${
                  isSelected ? 'fill-primary-foreground' : 'fill-foreground'
                }`}
              >
                {country.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default EuropeMap;
