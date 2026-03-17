import React from 'react';
import { germanRegionalData, getDifficultyColor, type BundeslandData } from '@/data/germanRegionalData';

interface GermanyRegionMapProps {
  selectedState: string | null;
  onStateClick: (stateKey: string) => void;
}

const statePaths: Record<string, { d: string; labelX: number; labelY: number; abbr: string }> = {
  'schleswig-holstein': {
    d: 'M180,20 L220,15 L240,30 L235,55 L225,70 L200,75 L185,65 L175,45 Z',
    labelX: 208, labelY: 45, abbr: 'SH',
  },
  hamburg: {
    d: 'M200,78 L215,75 L222,82 L218,92 L205,95 L198,88 Z',
    labelX: 210, labelY: 86, abbr: 'HH',
  },
  'mecklenburg-vorpommern': {
    d: 'M245,25 L310,20 L335,35 L330,60 L305,70 L270,68 L245,60 L240,40 Z',
    labelX: 288, labelY: 46, abbr: 'MV',
  },
  bremen: {
    d: 'M165,90 L178,87 L183,95 L178,103 L167,103 L163,97 Z',
    labelX: 173, labelY: 96, abbr: 'HB',
  },
  niedersachsen: {
    d: 'M120,70 L160,65 L185,72 L195,85 L200,100 L240,95 L250,110 L245,140 L225,155 L195,160 L165,155 L140,145 L120,130 L110,105 L115,85 Z',
    labelX: 178, labelY: 120, abbr: 'NI',
  },
  brandenburg: {
    d: 'M290,75 L335,70 L355,85 L358,115 L350,140 L325,150 L295,148 L278,135 L272,110 L275,90 Z',
    labelX: 315, labelY: 112, abbr: 'BB',
  },
  berlin: {
    d: 'M310,105 L325,102 L330,110 L325,118 L312,118 L308,112 Z',
    labelX: 319, labelY: 111, abbr: 'BE',
  },
  'sachsen-anhalt': {
    d: 'M250,110 L275,105 L290,115 L295,148 L285,170 L260,175 L240,165 L235,145 L242,125 Z',
    labelX: 265, labelY: 142, abbr: 'ST',
  },
  nrw: {
    d: 'M100,145 L140,140 L165,150 L175,170 L170,195 L148,210 L120,212 L100,200 L90,180 L92,160 Z',
    labelX: 133, labelY: 178, abbr: 'NW',
  },
  hessen: {
    d: 'M155,165 L185,160 L200,175 L205,200 L195,225 L175,235 L155,228 L145,210 L148,190 Z',
    labelX: 175, labelY: 198, abbr: 'HE',
  },
  thueringen: {
    d: 'M210,165 L248,160 L265,175 L262,200 L245,215 L220,218 L205,208 L205,185 Z',
    labelX: 235, labelY: 190, abbr: 'TH',
  },
  sachsen: {
    d: 'M270,155 L310,150 L335,160 L340,185 L330,210 L305,218 L280,215 L268,200 L265,175 Z',
    labelX: 303, labelY: 185, abbr: 'SN',
  },
  'rheinland-pfalz': {
    d: 'M90,210 L120,205 L140,215 L145,240 L135,265 L115,275 L95,268 L82,250 L80,230 Z',
    labelX: 113, labelY: 242, abbr: 'RP',
  },
  saarland: {
    d: 'M75,260 L90,255 L95,268 L90,280 L78,282 L72,272 Z',
    labelX: 83, labelY: 270, abbr: 'SL',
  },
  'baden-wuerttemberg': {
    d: 'M115,250 L150,240 L175,250 L185,275 L180,305 L155,320 L125,315 L108,295 L105,270 Z',
    labelX: 145, labelY: 285, abbr: 'BW',
  },
  bayern: {
    d: 'M180,230 L215,220 L250,225 L270,240 L280,270 L275,305 L260,330 L230,340 L200,335 L180,315 L175,285 L178,255 Z',
    labelX: 228, labelY: 280, abbr: 'BY',
  },
};

const GermanyRegionMap: React.FC<GermanyRegionMapProps> = ({ selectedState, onStateClick }) => {
  return (
    <div className="relative w-full">
      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground justify-center">
        <span className="font-medium">Difficulty:</span>
        {[1, 2, 3, 4, 5].map((d) => (
          <div key={d} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getDifficultyColor(d) }}
            />
            <span>{d}</span>
          </div>
        ))}
      </div>

      <svg viewBox="60 5 310 350" className="w-full h-auto" style={{ maxHeight: '55vh' }}>
        {Object.entries(statePaths).map(([key, state]) => {
          const data = germanRegionalData[key];
          const isSelected = selectedState === key;
          const fillColor = data ? getDifficultyColor(data.difficulty) : 'hsl(215, 20%, 65%)';

          return (
            <g
              key={key}
              className="cursor-pointer"
              onClick={() => onStateClick(key)}
            >
              <path
                d={state.d}
                fill={isSelected ? 'hsl(213, 97%, 47%)' : fillColor}
                stroke={isSelected ? 'hsl(213, 97%, 35%)' : 'hsl(0, 0%, 100%)'}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className="transition-all duration-200 hover:opacity-80"
                style={isSelected ? { filter: 'drop-shadow(0 0 6px hsl(213 97% 47% / 0.5))' } : {}}
              />
              <text
                x={state.labelX}
                y={state.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[9px] font-bold pointer-events-none select-none ${
                  isSelected ? 'fill-primary-foreground' : 'fill-foreground'
                }`}
              >
                {state.abbr}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GermanyRegionMap;
