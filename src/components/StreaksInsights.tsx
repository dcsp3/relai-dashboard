import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Flame, Trophy, TrendingUp, Target } from "lucide-react";

interface UserStats {
  current_streak: number;
  longest_streak: number;
  total_points: number;
}

const StreaksInsights = () => {
  const [stats, setStats] = useState<UserStats>({
    current_streak: 0,
    longest_streak: 0,
    total_points: 0
  });
  const [weeklyReduction, setWeeklyReduction] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError) throw statsError;

      if (statsData) {
        setStats(statsData);
      }

      // Calculate weekly reduction
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      const twoWeeksAgo = new Date(today);
      twoWeeksAgo.setDate(today.getDate() - 14);

      const { data: lastWeekData } = await supabase
        .from('ai_usage_logs')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .gte('usage_date', lastWeek.toISOString().split('T')[0]);

      const { data: previousWeekData } = await supabase
        .from('ai_usage_logs')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .gte('usage_date', twoWeeksAgo.toISOString().split('T')[0])
        .lt('usage_date', lastWeek.toISOString().split('T')[0]);

      const lastWeekTotal = lastWeekData?.reduce((sum, log) => sum + log.duration_minutes, 0) || 0;
      const previousWeekTotal = previousWeekData?.reduce((sum, log) => sum + log.duration_minutes, 0) || 0;

      if (previousWeekTotal > 0) {
        const reduction = ((previousWeekTotal - lastWeekTotal) / previousWeekTotal) * 100;
        setWeeklyReduction(Math.max(0, Math.round(reduction)));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const insights = [
    {
      label: "Current Streak",
      value: `${stats.current_streak} days`,
      icon: Flame,
      gradient: "from-orange-500 to-red-600",
      description: "Keep it up!"
    },
    {
      label: "Longest Streak",
      value: `${stats.longest_streak} days`,
      icon: Trophy,
      gradient: "from-yellow-500 to-amber-600",
      description: "Personal best"
    },
    {
      label: "Total Points",
      value: stats.total_points,
      icon: Target,
      gradient: "from-primary to-primary/80",
      description: "Keep earning"
    },
    {
      label: "Weekly Reduction",
      value: `${weeklyReduction}%`,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600",
      description: "vs. last week"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`bg-gradient-to-br ${insight.gradient} p-3 rounded-xl shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-1">{insight.value}</p>
              <p className="text-sm font-medium text-foreground mb-1">{insight.label}</p>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StreaksInsights;
