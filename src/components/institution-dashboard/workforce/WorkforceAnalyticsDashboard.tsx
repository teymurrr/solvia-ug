import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BarChart3, ChevronDown, ChevronUp, RefreshCw, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ExecutiveSnapshot from './ExecutiveSnapshot';
import RiskRadar from './RiskRadar';
import CostExposure from './CostExposure';
import HiringBlockers from './HiringBlockers';
import { WorkforceData } from './types';
import { generateMockWorkforceData } from './mockData';

const WorkforceAnalyticsDashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [data, setData] = useState<WorkforceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data - in production this would fetch from API
    const loadData = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(generateMockWorkforceData());
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(generateMockWorkforceData());
      setIsLoading(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground">Loading workforce analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Workforce Analytics
                  {data.isDemo && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="text-xs">
                            <Info className="h-3 w-3 mr-1" />
                            Demo
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            This is demo data. Connect your HR system to see real metrics.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardTitle>
                <CardDescription>
                  Last updated: {data.lastUpdated.toLocaleTimeString()}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expand
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Section 1: Executive Snapshot */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Executive Snapshot
              </h3>
              <ExecutiveSnapshot data={data.kpis} />
            </section>

            {/* Sections 2 & 3: Risk Radar and Cost Exposure - side by side on larger screens */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Section 2: Risk Radar */}
              <section>
                <RiskRadar departments={data.departments} />
              </section>

              {/* Section 3: Cost Exposure */}
              <section className="space-y-6">
                <CostExposure data={data.costs} />
                
                {/* Section 4: Hiring Blockers */}
                <HiringBlockers 
                  blockers={data.hiringBlockers}
                  internationalHires={data.internationalHires}
                />
              </section>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default WorkforceAnalyticsDashboard;
