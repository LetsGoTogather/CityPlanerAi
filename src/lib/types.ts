export interface ZoneDistribution {
  residential: number;
  commercial: number;
  industrial: number;
  greenSpaces: number;
  publicServices: number;
}

export interface SpecialRequirements {
  needAirport: boolean;
  needMetro: boolean;
  solarPower: boolean;
  waterRecycling: boolean;
}

export interface CityParams {
  population: number;
  budget: number;
  zoneDistribution: ZoneDistribution;
  specialRequirements: SpecialRequirements;
}

export interface Road {
  type: 'highway' | 'arterial' | 'local';
  coordinates: number[][];
  reason: string;
}

export interface Zone {
  type: 'residential' | 'commercial' | 'industrial' | 'greenSpaces' | 'publicServices';
  coordinates: number[][];
  density?: string;
  reason: string;
}

export interface Infrastructure {
  type: string;
  coordinates: number[];
  reason: string;
  capacity?: string;
}

export interface MapData {
  roads: Road[];
  zones: Zone[];
  infrastructure: Infrastructure[];
}

export interface CityPlan {
  overview?: string;
  roadNetwork: {
    highways: string[];
    arterialRoads: string[];
    localRoads: string[];
    reasoning: string;
  };
  zoning: Record<string, { areas: string[]; density?: string; reasoning: string }>;
  infrastructure: {
    powerSupply: { locations: string[]; type: string; capacity: string; reasoning: string };
    waterSupply: { treatmentPlants: string[]; pipelineNetwork: string; reasoning: string };
    sewageSystem: { treatmentPlants: string[]; network: string; reasoning: string };
  };
  budgetBreakdown: {
    landAcquisition: string;
    roadConstruction: string;
    buildingConstruction: string;
    utilities: string;
    materials: string; // JSON string
  };
  timeline: {
    phase1: string;
    phase2: string;
    phase3: string;
  };
}

export interface Simulation {
  trafficAnalysis: string;
  pollutionAnalysis: string;
  potentialIssues: string[];
  suggestions: string[];
}

export interface FullReport {
  cityPlan: CityPlan;
  simulation: Simulation;
  cityParams: CityParams;
  mapData: MapData;
}
