'use client';

import React from 'react';
import type { FullReport } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ZonePieChart } from '@/components/charts/zone-pie-chart';
import { CityMap } from '@/components/charts/city-map';
import {
  FileText,
  Map,
  Wrench,
  DollarSign,
  Calendar,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  TrafficCone,
  Wind
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Helper to safely parse JSON strings from the report
const parseJsonString = (jsonString: string | undefined, fallback: any = {}) => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse JSON string from report:", e);
    return fallback;
  }
};


interface CityReportProps {
  report: FullReport;
  onStartOver: () => void;
  imageData: string | null;
}

const CityReport: React.FC<CityReportProps> = ({ report, onStartOver, imageData }) => {
  const { cityPlan, simulation, cityParams, mapData } = report;

  const renderList = (items: string[] | undefined) => {
    if (!items || items.length === 0) return <p>No items to display.</p>;
    return (
        <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    );
  };

  const materials = parseJsonString(cityPlan.budgetBreakdown.materials, {});
  const zoningDetails = cityPlan.zoning ? Object.entries(cityPlan.zoning) : [];


  return (
    <div className="space-y-8 animate-in fade-in-50">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
             <div className="p-3 bg-primary/10 rounded-full">
               <FileText className="w-8 h-8 text-primary" />
             </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-headline">
            AI-Generated City Plan Report
          </CardTitle>
          <CardDescription className="text-lg">
            A comprehensive blueprint for a new city of {cityParams.population.toLocaleString()} people with a budget of ${cityParams.budget.toLocaleString()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
            <Button onClick={onStartOver}>Start New Plan</Button>
            <Button variant="outline" onClick={() => window.print()}>Download Report (Print)</Button>
        </CardContent>
      </Card>
      
      {mapData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Map className="text-primary"/>AI Generated City Map</CardTitle>
          </CardHeader>
          <CardContent>
            <CityMap mapData={mapData} satelliteImage={imageData} />
          </CardContent>
        </Card>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Map className="text-primary"/>Zoning & Layout</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Executive Summary</AccordionTrigger>
                        <AccordionContent>{cityPlan.overview || "No overview provided."}</AccordionContent>
                    </AccordionItem>
                    {cityPlan.roadNetwork && (
                      <AccordionItem value="item-2">
                          <AccordionTrigger>Road Network</AccordionTrigger>
                          <AccordionContent className="space-y-3">
                              <div><strong>Highways:</strong> {renderList(cityPlan.roadNetwork.highways)}</div>
                              <div><strong>Arterial Roads:</strong> {renderList(cityPlan.roadNetwork.arterialRoads)}</div>
                              <p><strong>Reasoning:</strong> {cityPlan.roadNetwork.reasoning}</p>
                          </AccordionContent>
                      </AccordionItem>
                    )}
                    {zoningDetails.length > 0 && (
                      <AccordionItem value="item-3">
                          <AccordionTrigger>Zone Details</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                              {zoningDetails.map(([key, value]) => (
                                  <div key={key}>
                                      <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                      <p className="text-sm text-muted-foreground">{value.reasoning}</p>
                                  </div>
                              ))}
                          </AccordionContent>
                      </AccordionItem>
                    )}
                </Accordion>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Zone Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ZonePieChart distribution={cityParams.zoneDistribution} />
            </CardContent>
        </Card>
      </div>

       {cityPlan.infrastructure && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wrench className="text-primary"/>Infrastructure Plan</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            {Object.entries(cityPlan.infrastructure).map(([key, value]) => (
              <div key={key} className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold capitalize text-lg">{key.replace(/([A-Z])/g, ' $1')}</h4>
                <p className="text-sm mt-1">{value.reasoning}</p>
              </div>
            ))}
          </CardContent>
        </Card>
       )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="text-primary"/>Budget & Materials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(cityPlan.budgetBreakdown).filter(([key]) => key !== 'materials').map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-medium">{value.toString()}</span>
              </div>
            ))}
            <Separator/>
            <h4 className="font-semibold">Materials Required</h4>
             {Object.keys(materials).length > 0 ? (
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(materials).map(([key, value]) => (
                    <div key={key} className="flex justify-between pr-4">
                        <span className="capitalize text-muted-foreground">{key}</span>
                        <span className="font-mono">{String(value)}</span>
                    </div>
                    ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">Material details not available.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="text-primary"/>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              {Object.entries(cityPlan.timeline).map(([key, value]) => (
                <div key={key} className="relative pl-6">
                    <CheckCircle className="absolute left-0 top-1 w-4 h-4 text-green-500"/>
                    <h4 className="font-semibold capitalize">{key.replace('phase', 'Phase ')}</h4>
                    <p className="text-sm text-muted-foreground">{String(value)}</p>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-secondary/50">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Simulation & Optimization Analysis</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2"><TrafficCone className="text-accent"/>Traffic Analysis</h3>
                <p>{simulation.trafficAnalysis}</p>
                 <h3 className="text-xl font-semibold flex items-center gap-2"><Wind className="text-accent"/>Pollution Analysis</h3>
                <p>{simulation.pollutionAnalysis}</p>
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2"><AlertTriangle className="text-destructive"/>Potential Issues</h3>
                <div>{renderList(simulation.potentialIssues)}</div>

                <h3 className="text-xl font-semibold flex items-center gap-2"><Lightbulb className="text-green-500"/>Suggestions</h3>
                <div>{renderList(simulation.suggestions)}</div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CityReport;
