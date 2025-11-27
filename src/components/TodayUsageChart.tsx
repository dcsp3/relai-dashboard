import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Sample hourly data for today (08:00 to 16:00)
const hourlyData = [
  { time: "08:00", usage: 12 },
  { time: "09:00", usage: 28 },
  { time: "10:00", usage: 45 },
  { time: "11:00", usage: 32 },
  { time: "12:00", usage: 18 },
  { time: "13:00", usage: 25 },
  { time: "14:00", usage: 38 },
  { time: "15:00", usage: 22 },
  { time: "16:00", usage: 15 },
];

const TodayUsageChart = () => {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <CardTitle>Today's AI Usage</CardTitle>
        <CardDescription>Hourly breakdown of your AI tool usage</CardDescription>
      </CardHeader>
      <CardContent className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
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
            <Line
              type="monotone"
              dataKey="usage"
              stroke="hsl(185 85% 45%)"
              strokeWidth={3}
              dot={{ fill: "hsl(185 85% 45%)", r: 4 }}
              activeDot={{ r: 6 }}
              name="Usage (min)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TodayUsageChart;


