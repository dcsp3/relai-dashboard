import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import UsageChart from "@/components/UsageChart";
import AIAppsList from "@/components/AIAppsList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your AI Usage Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and control your AI application usage to boost productivity
          </p>
        </div>
        
        <StatsCards />
        <UsageChart />
        <AIAppsList />
      </main>
    </div>
  );
};

export default Index;
