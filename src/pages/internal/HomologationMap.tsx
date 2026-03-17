import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import EuropeMap from '@/components/internal/EuropeMap';
import CountryDetailPanel from '@/components/internal/CountryDetailPanel';
import { Map } from 'lucide-react';

const HomologationMap: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleCountryClick = (country: string) => {
    if (selectedCountry === country) {
      setSelectedCountry(null);
      setSelectedState(null);
    } else {
      setSelectedCountry(country);
      setSelectedState(null);
    }
  };

  const handleStateClick = (stateKey: string) => {
    setSelectedState(selectedState === stateKey ? null : stateKey);
  };

  const handleClose = () => {
    setSelectedCountry(null);
    setSelectedState(null);
  };

  return (
    <MainLayout>
      <div className="bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="max-w-[1600px] mx-auto flex items-center gap-3">
            <Map className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Homologation Requirements Map</h1>
              <p className="text-sm text-muted-foreground">
                Interactive overview — click a country to explore requirements
              </p>
            </div>
            <span className="ml-auto text-xs bg-primary/10 text-primary font-medium px-2 py-1 rounded">
              Internal Tool
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className={`grid gap-6 ${selectedCountry ? 'grid-cols-1 lg:grid-cols-[1fr_420px]' : 'grid-cols-1'}`}>
            {/* Map */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-secondary border border-primary" />
                    Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-primary" />
                    Selected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-muted" />
                    Coming soon
                  </span>
                </div>
              </div>
              <EuropeMap
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
              />
              {!selectedCountry && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  👆 Click on Germany, Austria, or Spain to view homologation details
                </p>
              )}
            </div>

            {/* Detail Panel */}
            {selectedCountry && (
              <CountryDetailPanel
                country={selectedCountry}
                selectedState={selectedState}
                onStateClick={handleStateClick}
                onClose={handleClose}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomologationMap;
