import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock } from "lucide-react";

const wins = [
  {
    title: "Finished research brief with Claude",
    timeAgo: "2h ago",
    icon: Trophy,
  },
  {
    title: "Logged reflection streak",
    timeAgo: "Yesterday",
    icon: Trophy,
  },
  {
    title: "Shared prompt pack with Sam",
    timeAgo: "2 days ago",
    icon: Trophy,
  },
  {
    title: "Reduced copy-paste by 15%",
    timeAgo: "3 days ago",
    icon: Trophy,
  },
];

const WinsFeed = () => {
  return (
    <Card>
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <CardTitle className="text-lg">Recent Wins</CardTitle>
        </div>
        <CardDescription>Celebrate your achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {wins.map((win, index) => {
            const Icon = win.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5">
                  <Icon className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">{win.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{win.timeAgo}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WinsFeed;


