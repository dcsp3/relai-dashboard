import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, YAxis, CartesianGrid } from "recharts";

const trendData = [
  { day: "Mon", current: 62, previous: 54 },
  { day: "Tue", current: 70, previous: 60 },
  { day: "Wed", current: 86, previous: 64 },
  { day: "Thu", current: 64, previous: 58 },
  { day: "Fri", current: 58, previous: 55 },
  { day: "Sat", current: 72, previous: 62 },
  { day: "Sun", current: 48, previous: 50 },
];

const delta = 14;

const MomentumCard = () => {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>Usage momentum</CardTitle>
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            +{delta}%
          </Badge>
        </div>
        <CardDescription>This week vs last week (total focused minutes)</CardDescription>
        <p className="text-3xl font-semibold text-foreground">
          460 min
          <span className="text-sm text-muted-foreground font-normal ml-2">weekly total</span>
        </p>
      </CardHeader>
      <CardContent className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="hsl(258 90% 60%)"
              strokeWidth={3}
              dot={false}
              name="This week"
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="hsl(258 70% 80%)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              name="Last week"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MomentumCard;



