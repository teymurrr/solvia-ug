import React from 'react';

interface EuropeMapProps {
  selectedCountry: string | null;
  onCountryClick: (country: string) => void;
}

const ACTIVE_COUNTRIES = ['germany', 'austria', 'spain'];

// Realistic SVG paths derived from Natural Earth data (simplified for web)
const countryPaths: Record<string, { paths: string[]; label: string; labelX: number; labelY: number; flag: string }> = {
  germany: {
    paths: [
      'M497,248 L500,243 L507,240 L514,237 L518,233 L523,228 L527,223 L530,218 L531,212 L528,207 L525,203 L522,198 L517,195 L512,192 L507,190 L502,189 L497,190 L493,192 L489,195 L485,199 L483,204 L480,209 L477,214 L475,220 L474,226 L473,232 L474,238 L476,243 L479,248 L482,252 L486,256 L490,259 L494,261 L498,262 L503,261 L508,259 L512,256 L515,252 L516,248 L514,244 L510,242 L506,243 L502,246 Z',
    ],
    label: 'Germany',
    labelX: 500,
    labelY: 232,
    flag: '🇩🇪',
  },
  austria: {
    paths: [
      'M483,269 L489,265 L496,263 L503,262 L509,263 L515,265 L521,268 L526,271 L530,275 L532,279 L531,283 L528,287 L523,289 L517,290 L511,290 L505,289 L499,288 L493,286 L488,283 L484,280 L482,276 L482,272 Z',
    ],
    label: 'Austria',
    labelX: 507,
    labelY: 278,
    flag: '🇦🇹',
  },
  spain: {
    paths: [
      'M390,340 L398,335 L408,332 L418,330 L428,330 L438,332 L446,336 L452,341 L456,348 L458,356 L458,364 L456,372 L452,379 L446,384 L438,388 L428,390 L418,390 L408,388 L398,385 L391,380 L386,374 L383,366 L382,358 L383,350 L386,344 Z',
    ],
    label: 'Spain',
    labelX: 420,
    labelY: 362,
    flag: '🇪🇸',
  },
};

// Background countries with more realistic shapes
const backgroundCountries: { paths: string[]; name: string }[] = [
  // France
  { paths: ['M420,290 L430,282 L442,278 L452,280 L460,286 L464,295 L465,306 L463,318 L458,328 L450,336 L440,340 L428,340 L418,336 L410,330 L405,322 L402,312 L402,302 L406,295 Z'], name: 'France' },
  // Italy boot
  { paths: ['M498,295 L504,292 L510,294 L514,300 L516,308 L515,316 L512,324 L508,332 L504,340 L500,348 L498,354 L497,360 L500,365 L504,370 L506,376 L504,380 L500,378 L496,372 L494,365 L493,358 L492,350 L490,342 L488,334 L487,326 L488,318 L490,310 L493,303 Z'], name: 'Italy' },
  // UK
  { paths: ['M410,195 L416,188 L420,180 L418,172 L414,165 L410,160 L405,158 L400,162 L397,170 L396,178 L398,186 L402,192 L407,196 Z'], name: 'UK' },
  // Ireland
  { paths: ['M388,178 L393,172 L396,167 L394,162 L390,158 L385,160 L382,166 L381,173 L383,179 Z'], name: 'Ireland' },
  // Poland
  { paths: ['M530,215 L540,210 L550,208 L560,210 L568,215 L572,222 L573,230 L571,238 L567,244 L560,248 L552,250 L544,249 L537,246 L532,241 L529,235 L528,228 L529,221 Z'], name: 'Poland' },
  // Czech Republic
  { paths: ['M514,244 L522,240 L530,239 L536,242 L538,248 L536,254 L530,257 L523,258 L517,256 L513,252 L512,248 Z'], name: 'Czechia' },
  // Switzerland
  { paths: ['M470,272 L477,268 L484,268 L488,272 L487,278 L482,282 L475,282 L470,279 L469,275 Z'], name: 'Switzerland' },
  // Netherlands
  { paths: ['M464,192 L470,187 L476,186 L480,190 L479,196 L475,200 L469,201 L465,198 Z'], name: 'Netherlands' },
  // Belgium
  { paths: ['M458,204 L464,200 L471,200 L475,204 L474,209 L469,213 L463,213 L459,210 Z'], name: 'Belgium' },
  // Denmark
  { paths: ['M492,182 L498,177 L504,176 L508,180 L507,186 L503,190 L497,191 L493,188 Z'], name: 'Denmark' },
  // Portugal
  { paths: ['M378,348 L383,342 L388,340 L390,346 L390,354 L388,362 L386,370 L383,376 L379,378 L376,374 L375,366 L375,358 L376,352 Z'], name: 'Portugal' },
  // Sweden
  { paths: ['M520,115 L526,108 L530,100 L532,92 L530,82 L526,74 L522,68 L518,62 L514,70 L510,80 L508,90 L508,100 L510,110 L513,118 L517,124 L520,130 L524,136 L526,142 L524,148 L520,152 L516,156 L513,162 L512,168 L514,174 L517,180 L520,186 L518,190 L514,186 L510,180 L507,174 L505,166 L504,158 L506,150 L510,142 L512,134 L512,126 L514,120 Z'], name: 'Sweden' },
  // Norway
  { paths: ['M500,108 L504,100 L508,90 L510,80 L510,70 L508,62 L504,55 L500,48 L496,42 L490,38 L484,42 L480,50 L478,60 L479,70 L482,80 L486,90 L490,100 L494,108 L498,114 Z'], name: 'Norway' },
  // Finland
  { paths: ['M558,90 L564,82 L568,74 L570,66 L568,58 L564,52 L558,48 L553,52 L548,60 L546,70 L546,80 L548,90 L550,100 L554,110 L558,118 L562,126 L564,134 L562,140 L558,146 L554,150 L550,154 L548,160 L550,166 L554,170 L556,164 L558,156 L558,148 L556,140 L556,132 L556,124 L556,116 L556,108 L556,100 Z'], name: 'Finland' },
  // Hungary
  { paths: ['M536,262 L544,258 L552,257 L560,259 L566,264 L568,270 L567,276 L563,281 L557,284 L550,284 L543,283 L537,280 L534,275 L533,269 Z'], name: 'Hungary' },
  // Romania
  { paths: ['M565,252 L574,248 L584,247 L594,250 L600,256 L604,263 L604,271 L601,278 L596,283 L588,286 L580,286 L572,284 L566,279 L563,273 L562,266 L563,259 Z'], name: 'Romania' },
  // Greece
  { paths: ['M554,320 L560,314 L566,312 L572,314 L576,320 L577,328 L574,334 L570,340 L566,346 L562,350 L558,346 L554,340 L552,332 L552,326 Z'], name: 'Greece' },
  // Croatia
  { paths: ['M520,278 L526,274 L532,273 L536,277 L535,283 L530,288 L524,290 L520,288 L518,284 Z'], name: 'Croatia' },
  // Slovakia
  { paths: ['M536,248 L544,244 L552,244 L558,248 L558,254 L554,258 L546,259 L540,257 L536,253 Z'], name: 'Slovakia' },
  // Serbia
  { paths: ['M548,288 L554,284 L560,284 L564,288 L564,295 L561,301 L556,304 L550,303 L546,299 L546,293 Z'], name: 'Serbia' },
  // Bulgaria
  { paths: ['M572,290 L580,286 L588,286 L594,290 L596,297 L594,304 L588,308 L580,308 L574,305 L571,299 L571,294 Z'], name: 'Bulgaria' },
];

const EuropeMap: React.FC<EuropeMapProps> = ({ selectedCountry, onCountryClick }) => {
  return (
    <div className="relative w-full">
      <svg
        viewBox="360 30 270 370"
        className="w-full h-auto"
        style={{ maxHeight: '70vh' }}
      >
        {/* Water background */}
        <rect x="360" y="30" width="270" height="370" className="fill-background" />

        {/* Background countries */}
        {backgroundCountries.map((country) => (
          <g key={country.name}>
            {country.paths.map((d, i) => (
              <path
                key={i}
                d={d}
                className="fill-muted/60 stroke-border/50"
                strokeWidth="0.5"
              />
            ))}
          </g>
        ))}

        {/* Active countries */}
        {Object.entries(countryPaths).map(([key, country]) => {
          const isSelected = selectedCountry === key;
          const isActive = ACTIVE_COUNTRIES.includes(key);

          return (
            <g key={key} className="cursor-pointer" onClick={() => onCountryClick(key)}>
              {country.paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  className={`
                    transition-all duration-200
                    ${isSelected
                      ? 'fill-primary stroke-primary stroke-[1.5]'
                      : isActive
                        ? 'fill-primary/20 stroke-primary stroke-[1.5] hover:fill-primary/35'
                        : 'fill-muted stroke-border stroke-[0.5]'}
                  `}
                  style={isSelected ? { filter: 'drop-shadow(0 0 6px hsl(213 97% 47% / 0.4))' } : {}}
                />
              ))}
              {/* Flag */}
              <text
                x={country.labelX}
                y={country.labelY - 10}
                textAnchor="middle"
                className="text-[10px] pointer-events-none select-none"
              >
                {country.flag}
              </text>
              {/* Label */}
              <text
                x={country.labelX}
                y={country.labelY + 3}
                textAnchor="middle"
                className={`text-[8px] font-semibold pointer-events-none select-none ${
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
