'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { CityParams, ZoneDistribution } from '@/lib/types';
import { getOptimizedZones } from '@/app/actions';
import { Loader2, Wand2, Users, Banknote, Building, Factory, TreePine, School, Plane, TramFront, Sun, Recycle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

interface ParametersFormProps {
  terrainSummary: string;
  onParamsSubmit: (params: CityParams) => void;
  initialValues?: CityParams | null;
}

const defaultParams: CityParams = {
  population: 50000,
  budget: 1000000000,
  zoneDistribution: {
    residential: 40,
    commercial: 20,
    industrial: 15,
    greenSpaces: 15,
    publicServices: 10,
  },
  specialRequirements: {
    needAirport: false,
    needMetro: true,
    solarPower: true,
    waterRecycling: true,
  },
};

const zoneIcons: Record<keyof ZoneDistribution, React.ElementType> = {
  residential: Building,
  commercial: Users,
  industrial: Factory,
  greenSpaces: TreePine,
  publicServices: School,
}

const ParametersForm: React.FC<ParametersFormProps> = ({ terrainSummary, onParamsSubmit, initialValues }) => {
  const [params, setParams] = useState<CityParams>(initialValues || defaultParams);
  const [isOptimizing, startOptimization] = useTransition();
  const { toast } = useToast();

  const handleParamChange = (field: keyof Omit<CityParams, 'zoneDistribution' | 'specialRequirements'>, value: string) => {
    setParams(p => ({ ...p, [field]: Number(value) || 0 }));
  };

  const handleZoneChange = (zone: keyof ZoneDistribution, value: number[]) => {
    setParams(prev => {
      const newValue = value[0];
      const newZoneDist = { ...prev.zoneDistribution, [zone]: newValue };
      const total = Object.values(newZoneDist).reduce((a, b) => a + b, 0);
  
      // ✅ Clamp total to 100%
      if (total > 100) {
        const overflow = total - 100;
        newZoneDist[zone] = Math.max(0, newValue - overflow);
      }
  
      return { ...prev, zoneDistribution: newZoneDist };
    });
  };

  const handleSpecialReqChange = (req: keyof CityParams['specialRequirements'], value: boolean) => {
    setParams(p => ({
      ...p,
      specialRequirements: { ...p.specialRequirements, [req]: value },
    }));
  };
  
  const handleOptimize = () => {
    startOptimization(async () => {
      try {
        const result = await getOptimizedZones(terrainSummary, params.population, params.budget);
        setParams(p => ({...p, zoneDistribution: result.zoneDistribution}));
        toast({
          title: "Zones Optimized",
          description: "AI has suggested an optimal zone distribution.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Optimization Failed",
          description: "Could not get AI-optimized zones.",
        });
      }
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalZonePercentage = Object.values(params.zoneDistribution).reduce((sum, val) => sum + val, 0);
    if (Math.round(totalZonePercentage) !== 100) {
      toast({
        variant: "destructive",
        title: "Invalid Zone Distribution",
        description: `Zone percentages must add up to 100. Current total: ${Math.round(totalZonePercentage)}%`,
      });
      return;
    }
    onParamsSubmit(params);
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center">Set City Parameters</CardTitle>
        <CardDescription className="text-lg text-center">
          Define the core specifications for your new city.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="population" className="flex items-center gap-2 text-base"><Users className="w-5 h-5 text-primary"/>Target Population</Label>
              <Input
                id="population"
                type="number"
                value={params.population}
                onChange={e => handleParamChange('population', e.target.value)}
                placeholder="e.g., 50000"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2 text-base"><Banknote className="w-5 h-5 text-primary"/>Total Budget (in your currency)</Label>
              <Input
                id="budget"
                type="number"
                value={params.budget}
                onChange={e => handleParamChange('budget', e.target.value)}
                placeholder="e.g., 1000000000"
                className="text-base"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold">Zone Distribution</h4>
               <Button type="button" variant="outline" size="sm" onClick={handleOptimize} disabled={isOptimizing}>
                {isOptimizing ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Wand2 className="w-4 h-4 mr-2" />}
                AI Optimize
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 border rounded-lg">
              {Object.entries(params.zoneDistribution).map(([zone, value]) => {
                const Icon = zoneIcons[zone as keyof ZoneDistribution];
                return (
                <div key={zone} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`zone-${zone}`} className="capitalize flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {zone.replace(/([A-Z])/g, ' $1')}
                    </Label>
                    <span className="text-sm font-medium text-primary">{value}%</span>
                  </div>
                  <Slider
                    id={`zone-${zone}`}
                    min={0}
                    max={100}
                    step={1}
                    value={[value]}
                    onValueChange={v => handleZoneChange(zone as keyof ZoneDistribution, v)}
                  />
                </div>
              )})}
            </div>
             <p className="text-sm text-center text-muted-foreground">Total: {Math.round(Object.values(params.zoneDistribution).reduce((a, b) => a + b, 0))}%</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Special Requirements</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                    <Switch id="needAirport" checked={params.specialRequirements.needAirport} onCheckedChange={v => handleSpecialReqChange('needAirport', v)} />
                    <Label htmlFor="needAirport" className="flex items-center gap-2"><Plane className="w-4 h-4"/> Airport</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="needMetro" checked={params.specialRequirements.needMetro} onCheckedChange={v => handleSpecialReqChange('needMetro', v)} />
                    <Label htmlFor="needMetro" className="flex items-center gap-2"><TramFront className="w-4 h-4"/> Metro</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="solarPower" checked={params.specialRequirements.solarPower} onCheckedChange={v => handleSpecialReqChange('solarPower', v)} />
                    <Label htmlFor="solarPower" className="flex items-center gap-2"><Sun className="w-4 h-4"/> Solar Power</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="waterRecycling" checked={params.specialRequirements.waterRecycling} onCheckedChange={v => handleSpecialReqChange('waterRecycling', v)} />
                    <Label htmlFor="waterRecycling" className="flex items-center gap-2"><Recycle className="w-4 h-4"/> Water Recycling</Label>
                </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Generate City Plan →
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ParametersForm;
