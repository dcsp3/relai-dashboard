import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, SlidersHorizontal, ShieldCheck, PauseCircle, Zap, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import AIAppsList from "@/components/AIAppsList";
import { DailyLimitDial } from "@/components/DailyLimitDial";

const Limits = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [dailyLimit, setDailyLimit] = useState(180);

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
                      <h1 className="text-4xl font-semibold text-foreground mt-2">
                          Limits & guardrails
                      </h1>
                  </div>
              </div>

              <section className="space-y-4">
                  {/* TOP: Daily Limit + Options */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                      {/* DAILY LIMIT CARD */}
                      <Card
                          className="p-2 min-h-[180px]"
                          style={{ boxShadow: "var(--shadow-card)" }}
                      >
                          <CardHeader>
                              <CardTitle>Daily AI Usage Limit</CardTitle>
                              <CardDescription>
                                  Set a total daily cap across all AI tools.
                              </CardDescription>
                          </CardHeader>

                          <CardContent>
                              <div className="flex items-center justify-center w-full gap-6">
                                  {/* Left arrow */}
                                  <button
                                      onClick={() =>
                                          setDailyLimit((v) =>
                                              Math.max(0, v - 1)
                                          )
                                      }
                                      className="p-2 mb-12 rounded-md bg-secondary hover:bg-secondary/70 transition flex items-center justify-center"
                                  >
                                      <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                                  </button>

                                  {/* Center dial */}
                                  <DailyLimitDial
                                      value={dailyLimit}
                                      onChange={setDailyLimit}
                                      max={600}
                                  />

                                  {/* Right arrow */}
                                  <button
                                      onClick={() =>
                                          setDailyLimit((v) =>
                                              Math.min(600, v + 1)
                                          )
                                      }
                                      className="p-2 mb-12 rounded-md bg-secondary hover:bg-secondary/70 transition flex items-center justify-center"
                                  >
                                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                  </button>
                              </div>
                          </CardContent>

                          <p className="text-xs text-muted-foreground text-center mt-2 pt-2 border-t flex items-center justify-center gap-1.5">
                              <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                              <span>
                                  Access to all AI tools will be restricted once
                                  you hit this limit.
                              </span>
                          </p>
                      </Card>

                      {/* OPTIONS PANEL */}
                      <Card
                          className="p-2 min-h-[220px]"
                          style={{ boxShadow: "var(--shadow-card)" }}
                      >
                          <CardHeader>
                              <CardTitle>Options</CardTitle>
                              <CardDescription>
                                  Extra controls to guide how AI tools show up
                                  in your day.
                              </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4">
                              {/* Option toggles */}
                              <div className="space-y-3">
                                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40">
                                      <span className="text-sm">
                                          Enable tracking
                                      </span>
                                      <Switch defaultChecked />
                                  </div>

                                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40">
                                      <span className="text-sm">
                                          Smart nudges
                                      </span>
                                      <Switch defaultChecked />
                                  </div>

                                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40">
                                      <span className="text-sm">
                                          Clipboard tracking
                                      </span>
                                      <Switch />
                                  </div>

                                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40">
                                      <span className="text-sm">
                                          Soft-lock delay
                                      </span>
                                      <Switch />
                                  </div>

                                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40">
                                      <span className="text-sm">
                                          AI Adblock
                                      </span>
                                      <Switch />
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  </div>
              </section>

              <section className="space-y-4">
                  <AIAppsList />
              </section>
          </main>
      </div>
  );
};

export default Limits;

