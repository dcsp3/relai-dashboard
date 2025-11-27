import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";

export const StreakCard = () => {
    // Placeholder (replace with real analytics)
    const DAILY_LIMIT_MIN = 180; // 3h
    const todayUsage = 135; // example: 2h 15m

    const healthyToday = todayUsage < DAILY_LIMIT_MIN;
    const nearLimitToday =
        todayUsage >= DAILY_LIMIT_MIN * 0.8 && todayUsage < DAILY_LIMIT_MIN;

    const current = 8;
    const longest = 15;

    const [animCurrent, setAnimCurrent] = useState(0);
    const [animLongest, setAnimLongest] = useState(0);

    useEffect(() => {
        const duration = 1200;
        const startTime = Date.now();

        const animate = () => {
            const progress = Math.min((Date.now() - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setAnimCurrent(Math.round(current * eased));
            setAnimLongest(Math.round(longest * eased));

            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, []);

    const statusText = healthyToday
        ? "Under limit"
        : nearLimitToday
        ? "Near limit"
        : "Limit exceeded";

    const statusColor = healthyToday
        ? "text-emerald-400"
        : nearLimitToday
        ? "text-amber-400"
        : "text-red-400";

    return (
        <Card
            className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            style={{ boxShadow: "var(--shadow-card)" }}
        >
            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
                <Flame className="h-5 w-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-foreground">
                    Streaks
                </h2>

                <InfoTooltip text="A healthy usage streak continues on days where you stay under your daily AI limit." />
            </div>

            {/* Numbers */}
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
                <div>
                    <p className="text-4xl font-extrabold leading-tight">
                        {animCurrent} days
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Healthy usage streak
                    </p>
                </div>

                <div>
                    <p className="text-2xl font-semibold leading-tight">
                        {animLongest} days
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Longest streak
                    </p>
                </div>
            </div>
        </Card>
    );
};
