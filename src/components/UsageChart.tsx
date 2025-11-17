import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const data = [
  { day: "Mon", usage: 145, saved: 65 },
  { day: "Tue", usage: 128, saved: 82 },
  { day: "Wed", usage: 156, saved: 54 },
  { day: "Thu", usage: 98, saved: 112 },
  { day: "Fri", usage: 87, saved: 123 },
  { day: "Sat", usage: 134, saved: 76 },
  { day: "Sun", usage: 76, saved: 134 },
];

const UsageChart = () => {
  return (
    <Card className="p-6 mb-8" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">Weekly Overview</h2>
        <p className="text-sm text-muted-foreground">AI usage patterns and time saved</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(185 85% 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(185 85% 45%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142 70% 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142 70% 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="day" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
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
          <Area
            type="monotone"
            dataKey="usage"
            stroke="hsl(185 85% 45%)"
            strokeWidth={2}
            fill="url(#colorUsage)"
            name="AI Usage"
          />
          <Area
            type="monotone"
            dataKey="saved"
            stroke="hsl(142 70% 45%)"
            strokeWidth={2}
            fill="url(#colorSaved)"
            name="Time Saved"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default UsageChart;
