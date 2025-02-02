import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { Event } from "@/store/userStore";
import React from 'react';
import EventDrawer from '@/components/stats/EventDrawer';

export default function EventPieChart({ events }: { events: Event[] }) {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [selectedEvents, setSelectedEvents] = React.useState<Event[]>([]);

    const chartConfig = {
        pedago: {
          label: "pedago",
          color: "hsl(0, 100%, 50%)",
        },
        rush: {
          label: "rush",
          color: "hsl(210, 100%, 50%)",
        },
        partnership: {
          label: "partnership",
          color: "hsl(120, 100%, 40%)",
        },
        meet: {
          label: "meet",
          color: "hsl(30, 100%, 50%)",
        },
        conference: {
          label: "conference",
          color: "hsl(0, 100%, 50%)",
        },
        meet_up: {
          label: "meet_up",
          color: "hsl(240, 100%, 50%)",
        },
        event: {
          label: "event",
          color: "hsl(30, 100%, 40%)",
        },
        association: {
          label: "association",
          color: "hsl(0, 100%, 40%)",
        },
        speed_working: {
          label: "speed_working",
          color: "hsl(240, 100%, 40%)",
        },
        hackathon: {
          label: "hackathon",
          color: "hsl(210, 100%, 30%)",
        },
        workshop: {
          label: "workshop",
          color: "hsl(120, 100%, 20%)",
        },
        challenge: {
          label: "challenge",
          color: "hsl(30, 100%, 20%)",
        },
        other: {
          label: "other",
          color: "hsl(0, 100%, 20%)",
        },
        extern: {
          label: "extern",
          color: "hsl(240, 100%, 10%)",
        },
      } satisfies ChartConfig

    const eventCounts = events.reduce((acc: Record<string, number>, event: Event) => {
        acc[event.event.kind] = (acc[event.event.kind] || 0) + 1;
        return acc;
    }, {});
    console.log(eventCounts);
    const data = Object.entries(eventCounts).map(([kind, count]) => ({
        kind,
        count,
        fill: chartConfig[kind as keyof typeof chartConfig].color,
    }));
    console.log(data);

    const handlePieClick = (data: { kind: string; count: number }) => {
        const filteredEvents = events.filter(event => event.event.kind === data.kind);
        setSelectedEvents(filteredEvents);
        setIsDrawerOpen(true);
    };

    return (
        <>
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="kind"
                        innerRadius={60}
                        strokeWidth={5}
                        onClick={handlePieClick}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="text-3xl font-bold"
                                                fill="white"
                                            >
                                                {events.length}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                Événements
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>

            <EventDrawer 
                isOpen={isDrawerOpen} 
                onClose={setIsDrawerOpen} 
                events={selectedEvents} 
            />
        </>
    );
}
