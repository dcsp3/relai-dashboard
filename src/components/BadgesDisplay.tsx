import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock } from "lucide-react";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_required: number;
  earned: boolean;
  earned_at?: string;
}

const BadgesDisplay = () => {
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all badges
      const { data: allBadges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .order('points_required', { ascending: true });

      if (badgesError) throw badgesError;

      // Get user's earned badges
      const { data: earnedBadges, error: earnedError } = await supabase
        .from('user_badges')
        .select('badge_id, earned_at')
        .eq('user_id', user.id);

      if (earnedError) throw earnedError;

      // Combine data
      const combined = allBadges.map(badge => {
        const earned = earnedBadges?.find(eb => eb.badge_id === badge.id);
        return {
          ...badge,
          earned: !!earned,
          earned_at: earned?.earned_at
        };
      });

      setBadges(combined);
    } catch (error) {
      console.error('Error fetching badges:', error);
      toast.error('Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Badges & Achievements</h2>
          <p className="text-sm text-muted-foreground">
            {badges.filter(b => b.earned).length} of {badges.length} earned
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative p-4 rounded-lg border-2 transition-all ${
              badge.earned
                ? 'bg-primary/5 border-primary/20 hover:shadow-lg hover:-translate-y-1'
                : 'bg-muted/30 border-border/50 opacity-60'
            }`}
          >
            {!badge.earned && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <div className="text-center space-y-2">
              <div className="text-4xl">{badge.icon}</div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{badge.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {badge.description}
                </p>
              </div>
              
              {badge.earned ? (
                <Badge variant="secondary" className="text-xs">
                  Earned!
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  {badge.points_required} pts
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BadgesDisplay;
