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
  const containerRef = useRef<HTMLDivElement>(null);

  const drawMapElements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Your existing drawing code remains exactly the same
    mapData.zones?.forEach(zone => {
      const config = zoneConfig[zone.type];
      if (!config || !zone.coordinates || zone.coordinates.length < 2) return;

      ctx.fillStyle = `${config.color}80`;
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      zone.coordinates.forEach((coord, index) => {
        const x = (coord[0] / 100) * width;
        const y = (coord[1] / 100) * height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
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

    // Draw roads and infrastructure...
  };

useEffect(() => {
    const canvas = canvasRef.current;
    if (!mapData || !canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get the actual rendered size from CSS (browser handles aspect ratio)
    const renderedWidth = canvas.clientWidth;
    const renderedHeight = canvas.clientHeight;

    // Set canvas internal resolution to match displayed size
    canvas.width = renderedWidth;
    canvas.height = renderedHeight;

    if (satelliteImage) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, renderedWidth, renderedHeight);
        ctx.drawImage(img, 0, 0, renderedWidth, renderedHeight);
        drawMapElements(ctx, renderedWidth, renderedHeight);
      };
      img.onerror = () => {
        ctx.fillStyle = 'hsl(var(--muted))';
        ctx.fillRect(0, 0, renderedWidth, renderedHeight);
        drawMapElements(ctx, renderedWidth, renderedHeight);
      };
      img.src = satelliteImage;
      return;
    }
  
    // If no satellite image
    ctx.fillStyle = 'hsl(var(--muted))';
    ctx.fillRect(0, 0, renderedWidth, renderedHeight);
    drawMapElements(ctx, renderedWidth, renderedHeight);
  }, [mapData, satelliteImage]);

  return (
    <div className="w-full">
      {/* Simple container - CSS handles everything */}
      <div className="w-full max-h-[600px] rounded-lg border-2 border-dashed border-border bg-muted/50 flex items-center justify-center p-4">
        <canvas 
          ref={canvasRef} 
          className="max-w-full max-h-[600px] object-contain"
        />
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
        {/* ... your legend code */}
      </div>
    </div>
  );
}
