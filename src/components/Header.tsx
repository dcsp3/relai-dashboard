import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-lg shadow-lg">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AIGuard</h1>
            <p className="text-xs text-muted-foreground">Take control of AI usage</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="sm">Dashboard</Button>
          <Button variant="ghost" size="sm">Settings</Button>
          <Button variant="default" size="sm" className="bg-gradient-to-r from-primary to-primary/90">
            Install Extension
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
