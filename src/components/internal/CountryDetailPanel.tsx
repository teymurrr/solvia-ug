import React from 'react';
import { homologationDataByCountry } from '@/data/homologationData';
import { germanRegionalData, getDifficultyLabel, getDifficultyColor } from '@/data/germanRegionalData';
import GermanyRegionMap from './GermanyRegionMap';
import { Clock, DollarSign, Languages, FileText, GraduationCap, MapPin, Building, Gauge } from 'lucide-react';

interface CountryDetailPanelProps {
  country: string;
  selectedState: string | null;
  onStateClick: (stateKey: string) => void;
  onClose: () => void;
}

const CountryDetailPanel: React.FC<CountryDetailPanelProps> = ({
  country,
  selectedState,
  onStateClick,
  onClose,
}) => {
  const data = homologationDataByCountry[country];
  if (!data) return null;

  const stateData = selectedState ? germanRegionalData[selectedState] : null;

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg overflow-y-auto max-h-[85vh] animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          {data.country}
        </h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors text-lg font-bold px-2"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted rounded-lg p-3 text-center">
            <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">Timeline</div>
            <div className="text-sm font-bold text-foreground">{data.processTime.min}–{data.processTime.max} mo</div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <DollarSign className="w-4 h-4 text-primary mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">Cost</div>
            <div className="text-sm font-bold text-foreground">
              {data.costEstimate.min.toLocaleString()}–{data.costEstimate.max.toLocaleString()}€
            </div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <Languages className="w-4 h-4 text-primary mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">Language</div>
            <div className="text-sm font-bold text-foreground">{data.languageRequirement.level}</div>
          </div>
        </div>

        {/* Language Details */}
        <div className="bg-muted/50 rounded-lg p-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1">
            <GraduationCap className="w-4 h-4 text-primary" />
            {data.languageRequirement.exam}
          </h3>
          <p className="text-xs text-muted-foreground">{data.languageRequirement.description}</p>
        </div>

        {/* Cost Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-primary" />
            Cost Breakdown
          </h3>
          <div className="space-y-1">
            {data.costEstimate.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{item.item}</span>
                <span className="font-medium text-foreground">{item.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" />
            Required Documents ({data.documents.length})
          </h3>
          <div className="grid grid-cols-1 gap-1.5">
            {data.documents.map((doc, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${doc.required ? 'bg-destructive' : 'bg-muted-foreground'}`} />
                <div>
                  <span className="font-medium text-foreground">{doc.name}</span>
                  <span className="text-muted-foreground"> — {doc.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Exam */}
        {data.professionalExam && (
          <div className="bg-accent/30 rounded-lg p-3 border border-accent">
            <h3 className="text-sm font-semibold text-foreground mb-1">{data.professionalExam.name}</h3>
            <p className="text-xs text-muted-foreground">{data.professionalExam.description}</p>
          </div>
        )}

        {/* Average Salaries */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">💰 Average Salaries (monthly)</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.averageSalaries)
              .filter(([key]) => key !== 'currency')
              .map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs bg-muted rounded px-2 py-1.5">
                  <span className="text-muted-foreground capitalize">{key}</span>
                  <span className="font-semibold text-foreground">
                    {(value as number).toLocaleString()}€
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Germany Regional Sub-Map */}
        {country === 'germany' && (
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              Regional Differences (Bundesländer)
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Click a state to see specific requirements and processing details.
            </p>
            <GermanyRegionMap selectedState={selectedState} onStateClick={onStateClick} />

            {/* State Detail Card */}
            {stateData && (
              <div className="mt-4 bg-muted rounded-lg p-4 animate-fade-in space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground text-base">{stateData.name}</h4>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: getDifficultyColor(stateData.difficulty) }}
                  >
                    {getDifficultyLabel(stateData.difficulty)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Building className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Authority: </span>
                      <span className="text-muted-foreground">{stateData.authority}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Processing: </span>
                      <span className="text-muted-foreground">{stateData.processingTime}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">FSP Format: </span>
                      <span className="text-muted-foreground">{stateData.fspFormat}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Gauge className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Berufserlaubnis: </span>
                      <span className="text-muted-foreground">{stateData.berufserlaubnisSpeed}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground border-t border-border pt-2">{stateData.notes}</p>
                <p className="text-xs text-primary font-medium">💡 {stateData.tips}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryDetailPanel;
