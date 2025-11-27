import { useState, useEffect } from "react";
import { TrendingDown, Leaf, Zap, Activity, Clock, Hourglass, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { StreakCard } from "./StreakCard";
import UsageHeatmap from "./UsageHeatmap";
import { InfoTooltip } from "./InfoTooltip";

// Calculate CO2 saved based on time saved
// Using weekly data: 65+82+54+112+123+76+134 = 646 minutes = ~10.77 hours
// Estimate: ~0.35 kg CO2 saved per hour of AI-assisted work
const calculateCO2Saved = () => {
  const weeklyMinutesSaved = 646; // Sum from UsageChart data
  const hoursSaved = weeklyMinutesSaved / 60;
  const co2PerHour = 0.35; // kg CO2 saved per hour
  const totalCO2 = hoursSaved * co2PerHour;
  return totalCO2.toFixed(1);
};

// Calculate day-over-day usage comparison
const getUsageComparison = () => {
  const todayUsage = 235; // minutes today
  const yesterdayUsage = 189; // minutes yesterday
  const difference = todayUsage - yesterdayUsage;
  const percentChange = ((difference / yesterdayUsage) * 100).toFixed(0);
  const isIncrease = difference > 0;
  
  return {
    today: todayUsage,
    change: `${isIncrease ? '+' : ''}${percentChange}%`,
    isIncrease,
  };
};

const usageComparison = getUsageComparison();

// Daily limit data
const dailyLimitData = {
  used: 135, // minutes used today
  limit: 180, // daily limit in minutes
  percentage: Math.round((135 / 180) * 100),
};

const DailyLimitCard = () => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedMinutes, setAnimatedMinutes] = useState(0);

    const size = 135;
    const stroke = 7;
    const center = size / 2;

    // Proper radius (leaves padding so donut fits perfectly)
    const radius = center - stroke * 1.2;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    // Animate both percentage and minutes together
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const startPercentage = 0;
    const targetPercentage = dailyLimitData.percentage;
    const startMinutes = 0;
    const targetMinutes = dailyLimitData.used;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Animate both values
      setAnimatedPercentage(startPercentage + (targetPercentage - startPercentage) * easeOut);
      setAnimatedMinutes(startMinutes + (targetMinutes - startMinutes) * easeOut);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure we end at exact target values
        setAnimatedPercentage(targetPercentage);
        setAnimatedMinutes(targetMinutes);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);
  
  // Calculate offset: when percentage is 0, offset should be full circumference (empty)
  // When percentage is 100, offset should be 0 (full circle)
  const offset = circumference - (animatedPercentage / 100) * circumference;
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  };
  
  return (
      <Card
          className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
          style={{ boxShadow: "var(--shadow-card)" }}
      >
          <div className="flex items-center gap-2 mb-4">
              <Hourglass className="h-5 w-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-foreground">
                  Daily Limit
              </h2>

              <InfoTooltip text="Your daily limit helps you keep AI usage balanced. Staying under this limit encourages independent thinking and reduces over-reliance on AI." />
          </div>

          {/* LEFT CHART — RIGHT NUMBERS */}
          <div className="flex items-center w-full gap-6">
              {/* Left side expands fully */}
              <div className="flex-1 flex items-center justify-center">
                  <div
                      className="relative"
                      style={{ width: `${size}px`, height: `${size}px` }}
                  >
                      <svg
                          width={size}
                          height={size}
                          className="transform -rotate-90 absolute inset-0"
                      >
                          <circle
                              cx={center}
                              cy={center}
                              r={radius}
                              stroke="hsl(var(--muted))"
                              strokeWidth="6"
                              fill="none"
                          />
                          <circle
                              cx={center}
                              cy={center}
                              r={radius}
                              stroke="hsl(142 70% 45%)"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                          />
                      </svg>

                      <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-2xl font-bold text-foreground">
                              {Math.round(animatedPercentage)}%
                          </p>
                      </div>
                  </div>
              </div>

              {/* Right side text */}
              <div className="flex flex-col items-start">
                  <p className="text-3xl font-bold text-foreground mb-1">
                      {formatTime(Math.round(animatedMinutes))}
                  </p>
                  <p className="text-sm text-muted-foreground">
                      of {formatTime(dailyLimitData.limit)}
                  </p>
              </div>
          </div>
      </Card>
  );

};

const RAW_SCORE = 78; // 0–100
const CHANGE: number = 6;

// Breakdown per factor (0–100)
const factors = [
    { label: "Context", value: 82 },
    { label: "Specificity", value: 74 },
    { label: "Constraints", value: 69 },
    { label: "Reflection", value: 88 },
];

export const PromptQualityCard = () => {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const duration = 1200;
        const start = Date.now();

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(RAW_SCORE * eased));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setAnimatedScore(RAW_SCORE);
            }
        };

        requestAnimationFrame(animate);
    }, []);
    
  const changeLabel =
      CHANGE === 0
          ? "No change vs last week"
          : CHANGE > 0
          ? `↑ ${CHANGE}% vs last week`
          : `↓ ${Math.abs(CHANGE)}% vs last week`;


    const changeColor =
        CHANGE > 0
            ? "text-emerald-400"
            : CHANGE < 0
            ? "text-red-400"
            : "text-muted-foreground";

    return (
        <Card
            className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            style={{ boxShadow: "var(--shadow-card)" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-sky-400" />
                    <h2 className="text-xl font-semibold text-foreground">
                        Prompt quality
                    </h2>
                    <InfoTooltip text="Higher scores come from prompts that add context, specify the goal, set constraints (tone, length, format), and include a brief reflection or follow-up." />
                </div>
            </div>

            {/* Main score */}
            <div className="flex items-center gap-6 mb-4">
                <div>
                    <p className="text-5xl font-extrabold leading-none">
                        {animatedScore}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        out of 100 (last 50 prompts)
                    </p>
                </div>
            </div>

            {/* Factor chips */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                {factors.map((f) => (
                    <div
                        key={f.label}
                        className="flex items-center justify-between px-2 py-1 rounded-md bg-muted/40"
                    >
                        <span className="text-muted-foreground">{f.label}</span>
                        <span className="font-medium text-foreground">
                            {f.value}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const StatsCards = () => {
  return (
      <div className="grid grid-cols-2 gap-4">
          <DailyLimitCard />
          <PromptQualityCard />
          <UsageHeatmap />
          <StreakCard />
      </div>
  );
};

export default StatsCards;
