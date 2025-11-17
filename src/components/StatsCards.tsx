import { Clock, TrendingDown, Shield, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    label: "Time Saved Today",
    value: "2h 34m",
    change: "+24%",
    icon: Clock,
    gradient: "from-accent to-accent/80",
  },
  {
    label: "AI Usage Reduced",
    value: "68%",
    change: "↓ 12%",
    icon: TrendingDown,
    gradient: "from-primary to-primary/80",
  },
  {
    label: "Apps Blocked",
    value: "12",
    change: "Active",
    icon: Shield,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    label: "Productivity Score",
    value: "94",
    change: "+8 pts",
    icon: Zap,
    gradient: "from-accent to-green-600",
  },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-accent">{stat.change}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
