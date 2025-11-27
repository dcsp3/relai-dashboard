import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, Users, Trophy, Share2 } from "lucide-react";

const leaderboard = [
  { name: "You", rank: 1, streak: 12, points: 3820, delta: "+2", badge: "On Fire" },
  { name: "Sam", rank: 2, streak: 9, points: 3610, delta: "-1", badge: "Curious Cat" },
  { name: "Priya", rank: 3, streak: 7, points: 3460, delta: "+4", badge: "Night Owl" },
  { name: "Leo", rank: 4, streak: 4, points: 3020, delta: "0", badge: "Sprint Mode" },
  { name: "Maya", rank: 5, streak: 3, points: 2750, delta: "-2", badge: "Focus Friend" },
];

const Community = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (!session) {
        navigate("/auth");
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary">Squad goals</p>
            <h1 className="text-4xl font-semibold text-foreground mt-2">Leaderboard & friends</h1>
            <p className="text-muted-foreground mt-2">
              Keep tabs on your crew, celebrate streaks, and trade prompt packs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="gap-2">
              <Users className="h-4 w-4" />
              Add friend
            </Button>
            <Button className="gap-2">
              <Share2 className="h-4 w-4" />
              Share invite link
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>This week's ladder</CardTitle>
              <CardDescription>Points update every hour</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map((person) => (
                <div
                  key={person.name}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {person.rank}
                    </div>
                    <div>
                      <p className="text-lg font-semibold flex items-center gap-2">
                        {person.name}
                        <Badge variant="secondary">{person.badge}</Badge>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Streak {person.streak} days · {person.points} pts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowUpIcon className="h-4 w-4 text-primary" />
                    {person.delta}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
                <CardDescription>What your friends are up to</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <p className="font-medium text-foreground">Sam hit day 10 of their streak 🔥</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="font-medium text-foreground">Priya shared a Notion prompt pack with you</p>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="font-medium text-foreground">Leo crossed 3k points. Send hype?</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming drops</CardTitle>
                <CardDescription>Friendly challenges land on Mondays</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Focus sprint</p>
                    <p className="text-sm text-muted-foreground">15 min build sessions · starts Monday</p>
                  </div>
                  <Badge>New</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Prompt remix</p>
                    <p className="text-sm text-muted-foreground">Swap top prompts with friends</p>
                  </div>
                  <Badge variant="secondary">Preview</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;



