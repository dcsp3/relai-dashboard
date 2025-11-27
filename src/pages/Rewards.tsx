import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Crown, RefreshCcw } from "lucide-react";

const badges = [
  { name: "Deep Diver", detail: "3 reflections in a day", earned: true },
  { name: "Focus Friend", detail: "5-day streak", earned: true },
  { name: "Prompt Chef", detail: "Share 10 prompts", earned: false },
  { name: "Clarity Drop", detail: "Log week of wins", earned: false },
];

const Rewards = () => {
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
            <p className="text-sm uppercase tracking-widest text-primary">Rewards vault</p>
            <h1 className="text-4xl font-semibold text-foreground mt-2">Badges & points</h1>
            <p className="text-muted-foreground mt-2">
              Earn points as you build mindful habits. Unlock perks, drops, and new badge art.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Redeem history
            </Button>
            <Button className="gap-2">
              <Gift className="h-4 w-4" />
              Claim reward
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Point balance</CardTitle>
              <CardDescription>Spend them on perks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">4,220 pts</p>
              <p className="text-sm text-muted-foreground">+320 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Next unlock</CardTitle>
              <CardDescription>Custom avatar frames</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">5,000 pts</p>
              <p className="text-sm text-muted-foreground">You're 780 pts away</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Weekly quest</CardTitle>
              <CardDescription>Finish all reflections</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">+500 pts</p>
              <p className="text-sm text-muted-foreground">Due Sunday night</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Badge board</CardTitle>
              <CardDescription>Collect art as you level up</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-2">
              <Star className="h-4 w-4" />
              8/24 earned
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`rounded-xl border border-border p-4 ${badge.earned ? "bg-primary/5" : "bg-muted/50"}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-foreground">{badge.name}</p>
                  {badge.earned ? (
                    <Badge className="gap-1">
                      <Crown className="h-4 w-4" />
                      Earned
                    </Badge>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{badge.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Rewards;



