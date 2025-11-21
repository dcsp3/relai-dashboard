import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DayActivity {
  date: string;
  minutes: number;
}

const ActivityHeatmap = () => {
  const [activities, setActivities] = useState<DayActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('ai_usage_logs')
        .select('usage_date, duration_minutes')
        .eq('user_id', user.id)
        .gte('usage_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('usage_date', { ascending: true });

      if (error) throw error;

      // Aggregate by date
      const aggregated = data.reduce((acc, log) => {
        const existing = acc.find(a => a.date === log.usage_date);
        if (existing) {
          existing.minutes += log.duration_minutes;
        } else {
          acc.push({ date: log.usage_date, minutes: log.duration_minutes });
        }
        return acc;
      }, [] as DayActivity[]);

      setActivities(aggregated);
    } catch (error) {
      console.error('Error fetching activity:', error);
      toast.error('Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (minutes: number) => {
    if (minutes === 0) return 'bg-muted';
    if (minutes < 30) return 'bg-green-200 dark:bg-green-900';
    if (minutes < 60) return 'bg-yellow-200 dark:bg-yellow-900';
    if (minutes < 120) return 'bg-orange-200 dark:bg-orange-900';
    return 'bg-red-200 dark:bg-red-900';
  };

  const getDaysArray = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const activity = activities.find(a => a.date === dateStr);
      days.push({
        date: dateStr,
        minutes: activity?.minutes || 0,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return days;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-10 gap-2">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const days = getDaysArray();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Activity Heatmap</h2>
      <p className="text-sm text-muted-foreground mb-4">Last 30 days of AI usage</p>
      
      <div className="grid grid-cols-10 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`aspect-square rounded ${getIntensityColor(day.minutes)} hover:ring-2 ring-primary transition-all cursor-pointer`}
            title={`${day.date}: ${day.minutes} minutes`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-muted"></div>
          <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-900"></div>
          <div className="w-4 h-4 rounded bg-yellow-200 dark:bg-yellow-900"></div>
          <div className="w-4 h-4 rounded bg-orange-200 dark:bg-orange-900"></div>
          <div className="w-4 h-4 rounded bg-red-200 dark:bg-red-900"></div>
        </div>
        <span>More</span>
      </div>
    </Card>
  );
};

export default ActivityHeatmap;
