import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    ComposedChart,
} from "recharts";

const currentWeekData = [
    { day: "Mon", usage: 145, prevUsage: 132 },
    { day: "Tue", usage: 128, prevUsage: 145 },
    { day: "Wed", usage: 156, prevUsage: 120 },
    { day: "Thu", usage: 98, prevUsage: 110 },
    { day: "Fri", usage: 87, prevUsage: 95 },
    { day: "Sat", usage: 134, prevUsage: 118 },
    { day: "Sun", usage: 76, prevUsage: 88 },
];

const UsageChart = () => {
    const [showComparison, setShowComparison] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        if (chartRef.current) observer.observe(chartRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <Card
            ref={chartRef}
            className="p-6"
            style={{ boxShadow: "var(--shadow-card)" }}
        >
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-foreground mb-1">
                        Weekly AI Usage Overview
                    </h2>

                    <div className="flex items-center gap-2">
                        <Label
                            htmlFor="compare-toggle"
                            className="text-sm text-muted-foreground cursor-pointer"
                        >
                            Compare with previous week
                        </Label>

                        {/* FIXED TOGGLE HANDLER */}
                        <Switch
                            id="compare-toggle"
                            checked={showComparison}
                            onCheckedChange={(checked: boolean) =>
                                setShowComparison(checked)
                            }
                        />
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={currentWeekData}>
                    <defs>
                        <linearGradient
                            id="colorUsage"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="hsl(185 85% 45%)"
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor="hsl(185 85% 45%)"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        opacity={0.3}
                    />

                    <XAxis
                        dataKey="day"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                    />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        label={{
                            value: "Minutes",
                            angle: -90,
                            position: "insideLeft",
                            fill: "hsl(var(--muted-foreground))",
                        }}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            boxShadow: "var(--shadow-soft)",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                    />

                    {/* AREA */}
                    <Area
                        type="monotone"
                        dataKey="usage"
                        name="This Week" // <-- tooltip label
                        stroke="hsl(185 85% 45%)"
                        strokeWidth={2}
                        fill="url(#colorUsage)"
                        isAnimationActive={isVisible}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />

                    {/* COMPARISON LINE */}
                    {showComparison && (
                        <Line
                            type="monotone"
                            dataKey="prevUsage"
                            name="Last Week" // <-- tooltip label
                            stroke="hsl(185 85% 65%)"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={false}
                            strokeOpacity={0.9}
                            isAnimationActive={isVisible}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default UsageChart;
