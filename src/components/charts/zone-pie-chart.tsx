"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import type { ZoneDistribution } from "@/lib/types"

interface ZonePieChartProps {
  distribution: ZoneDistribution;
}

const chartConfig = {
  residential: {
    label: "Residential",
    color: "hsl(var(--chart-1))",
  },
  commercial: {
    label: "Commercial",
    color: "hsl(var(--chart-2))",
  },
  industrial: {
    label: "Industrial",
    color: "hsl(var(--chart-3))",
  },
  greenSpaces: {
    label: "Green Spaces",
    color: "hsl(var(--chart-4))",
  },
  publicServices: {
    label: "Public Services",
    color: "hsl(var(--chart-5))",
  },
} satisfies Record<keyof ZoneDistribution, { label: string; color: string; }>


export function ZonePieChart({ distribution }: ZonePieChartProps) {
  const chartData = Object.entries(distribution).map(([key, value]) => ({
    name: chartConfig[key as keyof ZoneDistribution].label,
    value: value,
    fill: chartConfig[key as keyof ZoneDistribution].color,
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-mt-4"
        />
      </PieChart>
    </ChartContainer>
  )
}
