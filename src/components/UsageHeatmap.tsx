import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Grid3X3 } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKS_TO_SHOW = 11;

type DayCell = { date: Date; value: number };

const generateHeatmap = () => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - WEEKS_TO_SHOW * 7);

    const alignedStart = new Date(startDate);
    alignedStart.setDate(alignedStart.getDate() - alignedStart.getDay());
    alignedStart.setHours(0, 0, 0, 0);

    const weeks: DayCell[][] = [];
    let cursor = new Date(alignedStart);

    for (let i = 0; i < WEEKS_TO_SHOW; i++) {
        const weekCells: DayCell[] = [];
        for (let d = 0; d < 7; d++) {
            weekCells.push({
                date: new Date(cursor),
                value: cursor <= endDate ? Math.floor(Math.random() * 5) : -1,
            });
            cursor.setDate(cursor.getDate() + 1);
        }
        weeks.push(weekCells);
    }
    return weeks;
};

const intensityClasses = [
    "bg-muted/60",
    "bg-[hsl(152,75%,80%)]",
    "bg-[hsl(152,70%,65%)]",
    "bg-[hsl(152,65%,50%)]",
    "bg-[hsl(152,70%,35%)]",
];

const UsageHeatmap = () => {
    const heatmap = useMemo(() => generateHeatmap(), []);

    const labels = useMemo(() => {
        const out: { index: number; text: string }[] = [];
        heatmap.forEach((week, i) => {
            const name = week[0].date.toLocaleString("default", {
                month: "short",
            });
            const prev = out[out.length - 1];
            if (!prev || prev.text !== name) out.push({ index: i, text: name });
        });
        return out;
    }, [heatmap]);

    return (
        <Card
            className="py-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            style={{ boxShadow: "var(--shadow-card)" }}
        >
            <div className="flex items-center gap-2 mb-4 px-6">
                <Grid3X3 className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-foreground">
                    AI Usage Heatmap
                </h2>

                <InfoTooltip text="Each square represents a day of AI activity. Darker squares indicate heavier usage. This helps you spot patterns and track how your usage changes over time." />
            </div>
            <CardContent className="pb-4">
                <div className="flex">
                    {/* DAY LABELS */}
                    <div className="flex flex-col text-xs text-muted-foreground w-12 pt-[8px] pb-[6px] mx-[1px]">
                        {days.map((d) =>
                            ["Mon", "Wed", "Fri"].includes(d) ? (
                                <span
                                    key={d}
                                    className="h-[18px] leading-none px-2"
                                >
                                    {d}
                                </span>
                            ) : (
                                <span
                                    key={d}
                                    className="h-[18px] leading-none px-2"
                                ></span>
                            )
                        )}
                    </div>

                    {/* HEATMAP BLOCK (LEFT-ALIGNED) */}
                    <div>
                        {/* MONTH LABELS */}
                        <div className="relative h-5 mb-2 flex text-xs text-muted-foreground">
                            {labels.map((label) => (
                                <span
                                    key={label.index}
                                    className="absolute"
                                    style={{ left: `${label.index * 22}px` }}
                                >
                                    {label.text}
                                </span>
                            ))}
                        </div>

                        {/* GRID */}
                        <div className="flex gap-[6px]">
                            {heatmap.map((week, wIndex) => (
                                <div
                                    key={wIndex}
                                    className="flex flex-col gap-[3px]"
                                >
                                    {week.map(({ date, value }) =>
                                        value === -1 ? (
                                            <span
                                                key={date.toISOString()}
                                                className="h-[14px] w-[14px] rounded-sm opacity-0"
                                            />
                                        ) : (
                                            <span
                                                key={date.toISOString()}
                                                className={`h-[14px] w-[14px] rounded-[3px] border border-border/30 ${intensityClasses[value]}`}
                                                title={`${date.toLocaleDateString(
                                                    undefined,
                                                    {
                                                        weekday: "short",
                                                        month: "short",
                                                        day: "numeric",
                                                    }
                                                )} · ${
                                                    value > 0
                                                        ? `${value * 15} min`
                                                        : "No usage"
                                                }`}
                                            />
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UsageHeatmap;
