import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  total_points: number;
  current_streak: number;
}

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setCurrentUserId(user.id);

      // Get friends
      const { data: friendships } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      const friendIds = friendships?.map(f => f.friend_id) || [];
      const allUserIds = [user.id, ...friendIds];

      // Get stats for all users
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('user_id, total_points, current_streak')
        .in('user_id', allUserIds)
        .order('total_points', { ascending: false });

      if (statsError) throw statsError;

      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', allUserIds);

      if (profilesError) throw profilesError;

      // Combine data
      const combined = stats.map(stat => {
        const profile = profiles.find(p => p.user_id === stat.user_id);
        return {
          user_id: stat.user_id,
          full_name: profile?.full_name || 'Anonymous',
          avatar_url: profile?.avatar_url || null,
          total_points: stat.total_points,
          current_streak: stat.current_streak
        };
      });

      setEntries(combined);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-medium">{index + 1}</span>;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="flex-1 h-4 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Leaderboard</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Compete with friends to reduce AI usage
      </p>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Add friends to see the leaderboard
          </p>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.user_id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                entry.user_id === currentUserId
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(index)}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar_url || undefined} />
                <AvatarFallback>
                  {entry.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {entry.full_name}
                  {entry.user_id === currentUserId && (
                    <span className="text-xs text-muted-foreground ml-2">(You)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.current_streak} day streak
                </p>
              </div>

              <Badge variant="secondary" className="font-bold">
                {entry.total_points} pts
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default Leaderboard;
