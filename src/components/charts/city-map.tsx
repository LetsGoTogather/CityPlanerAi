'use client';

import { useRef, useEffect } from 'react';
import type { MapData } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface CityMapProps {
  mapData: MapData;
  satelliteImage: string | null;
}

const zoneConfig: Record<string, { color: string; label: string }> = {
  residential: { color: '#2ECC71', label: 'Residential' },
  commercial: { color: '#3498DB', label: 'Commercial' },
  industrial: { color: '#F39C12', label: 'Industrial' },
  greenSpaces: { color: '#1ABC9C', label: 'Green Space' },
  publicServices: { color: '#9B59B6', label: 'Public Service' },
};

const roadConfig = {
  highway: { color: '#E74C3C', width: 5 },
  arterial: { color: '#7F8C8D', width: 3 },
  local: { color: '#BDC3C7', width: 1.5 },
};

const infraConfig: Record<string, { color: string; icon: string }> = {
    hospital: { color: '#E74C3C', icon: 'H' },
    school: { color: '#3498DB', icon: 'S' },
    power_plant: { color: '#F1C40F', icon: 'P' },
    water_treatment: { color: '#1ABC9C', icon: 'W' },
    sewage_treatment: { color: '#9B59B6', icon: 'S' },
    default: { color: '#95A5A6', icon: 'I' },
};

// Helper function to calculate center of polygon
function getCenter(coordinates: number[][], width: number, height: number) {
  if (!coordinates || coordinates.length === 0) {
    return { x: width / 2, y: height / 2};
  }
  let sumX = 0, sumY = 0;
  const numPoints = coordinates.length > 1 && coordinates[0].toString() === coordinates[coordinates.length-1].toString()
    ? coordinates.length - 1
    : coordinates.length;

  for(let i=0; i<numPoints; i++) {
    sumX += (coordinates[i][0] / 100) * width;
    sumY += (coordinates[i][1] / 100) * height;
  }
  
  return {
    x: sumX / numPoints,
    y: sumY / numPoints,
  };
}


export function CityMap({ mapData, satelliteImage }: CityMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawMapElements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw zones
    mapData.zones?.forEach(zone => {
      const config = zoneConfig[zone.type];
      if (!config || !zone.coordinates || zone.coordinates.length < 2) return;

      ctx.fillStyle = `${config.color}80`; // Add transparency
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      zone.coordinates.forEach((coord, index) => {
        const x = (coord[0] / 100) * width;
        const y = (coord[1] / 100) * height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      // A closed polygon has the same start and end point. If not, close it.
      if(zone.coordinates[0].toString() !== zone.coordinates[zone.coordinates.length - 1].toString()){
        ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();

      const center = getCenter(zone.coordinates, width, height);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(config.label, center.x, center.y);
    });

    // Draw roads
    mapData.roads?.forEach(road => {
      const config = roadConfig[road.type];
      if (!config || !road.coordinates) return;

      ctx.strokeStyle = config.color;
      ctx.lineWidth = config.width;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      road.coordinates.forEach((coord, index) => {
        const x = (coord[0] / 100) * width;
        const y = (coord[1] / 100) * height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    // Draw infrastructure
    mapData.infrastructure?.forEach(infra => {
        const config = infraConfig[infra.type] || infraConfig.default;
        if (!config || !infra.coordinates) return;

        const x = (infra.coordinates[0] / 100) * width;
        const y = (infra.coordinates[1] / 100) * height;
        
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.icon, x, y);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!mapData || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on container
    const container = canvas.parentElement;
    if (!container) return;

    const size = Math.min(container.clientWidth, 800);
    const aspectRatio = 3/4;
    canvas.width = size;
    canvas.height = size * aspectRatio;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    
    if (satelliteImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        drawMapElements(ctx, width, height);
      };
      img.onerror = () => {
        // If image fails, draw on a plain background
        ctx.fillStyle = 'hsl(var(--muted))';
        ctx.fillRect(0, 0, width, height);
        drawMapElements(ctx, width, height);
      }
      img.src = satelliteImage;
    } else {
      ctx.fillStyle = 'hsl(var(--muted))';
      ctx.fillRect(0, 0, width, height);
      drawMapElements(ctx, width, height);
    }
  }, [mapData, satelliteImage]);


  return (
    <div className="w-full">
      <div className="relative w-full aspect-[4/3] max-w-[800px] mx-auto">
        <canvas ref={canvasRef} className="rounded-lg border bg-muted" />
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
         {Object.entries(zoneConfig).map(([key, { color, label }]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color, opacity: 0.7 }} />
            <span>{label}</span>
          </div>
        ))}
        {Object.entries(roadConfig).map(([key, { color }]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-4 h-1" style={{ backgroundColor: color }} />
              <span className="capitalize">{key}</span>
            </div>
        ))}
         {Object.entries(infraConfig).filter(([k]) => k !== 'default').map(([key, { color, icon }]) => (
             <div key={key} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full flex items-center justify-center text-white text-[8px]" style={{ backgroundColor: color }}>{icon}</div>
                 <span className="capitalize">{key.replace('_', ' ')}</span>
             </div>
         ))}
      </div>
    </div>
  );
}
