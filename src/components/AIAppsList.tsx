import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bot, Clock } from "lucide-react";

interface AIApp {
  name: string;
  url: string;
  timeUsed: string;
  blocked: boolean;
  category: string;
}

const initialApps: AIApp[] = [
  { name: "ChatGPT", url: "chat.openai.com", timeUsed: "45m", blocked: true, category: "Chat" },
  { name: "Claude", url: "claude.ai", timeUsed: "32m", blocked: true, category: "Chat" },
  { name: "Midjourney", url: "midjourney.com", timeUsed: "28m", blocked: false, category: "Image" },
  { name: "GitHub Copilot", url: "github.com/copilot", timeUsed: "1h 12m", blocked: true, category: "Code" },
  { name: "Gemini", url: "gemini.google.com", timeUsed: "18m", blocked: false, category: "Chat" },
  { name: "Perplexity", url: "perplexity.ai", timeUsed: "22m", blocked: true, category: "Search" },
];

const AIAppsList = () => {
  const [apps, setApps] = useState(initialApps);

  const toggleBlock = (index: number) => {
    setApps(apps.map((app, i) => 
      i === index ? { ...app, blocked: !app.blocked } : app
    ));
  };

  return (
    <Card className="p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">AI Applications</h2>
        <p className="text-sm text-muted-foreground">Manage access to AI-powered tools</p>
      </div>
      <div className="space-y-3">
        {apps.map((app, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-lg">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{app.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {app.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{app.url}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{app.timeUsed}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm font-medium text-muted-foreground">
                {app.blocked ? "Blocked" : "Allowed"}
              </span>
              <Switch
                checked={app.blocked}
                onCheckedChange={() => toggleBlock(index)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AIAppsList;
