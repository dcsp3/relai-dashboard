import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import UsageChart from "@/components/UsageChart";
import ClipboardSentiment from "@/components/ClipboardSentiment";
import UsageHeatmap from "@/components/UsageHeatmap";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [firstName, setFirstName] = useState(
      localStorage.getItem("firstName") || ""
  );
  useEffect(() => {
    const loadSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setIsAuthenticated(!!session);

      if (!session) {
        navigate("/auth");
        return;
      }

      fetchUserName(session.user.id, session.user.email);
    };

    loadSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        navigate("/auth");
      } else {
        fetchUserName(session.user.id, session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserName = async (userId: string, fallbackEmail?: string | null) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .single();

   if (data?.full_name) {
       const name = data.full_name.split(" ")[0];
       localStorage.setItem("firstName", name);
       setFirstName(name);
       return;
   }

   if (fallbackEmail) {
       const name = fallbackEmail.split("@")[0];
       localStorage.setItem("firstName", name);
       setFirstName(name);
   }
  };

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground text-center mb-3">
            Hi <span className="text-primary">{firstName}</span>, here's what's happening today.
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="lg:col-span-1">
        <StatsCards />
          </div>
          <div className="lg:col-span-1">
            <ClipboardSentiment />
          </div>
        </div>
        <UsageChart />
      </main>
    </div>
  );
};

export default Index;
