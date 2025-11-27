import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { User } from "@supabase/supabase-js";
import { Flame, Sparkles, Target, Clock, Trophy, ArrowUpRight, PenLine, LogOut } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [streak, setStreak] = useState(5);
  const [weeklyMinutes, setWeeklyMinutes] = useState(872);
  const [topTool, setTopTool] = useState("ChatGPT");
  const [avgSessions, setAvgSessions] = useState(9);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || "");
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
      })
      .eq("user_id", user.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    navigate("/auth");
  };

  const getInitials = () => {
    if (fullName) {
      return fullName.split(" ").map(n => n[0]).join("").toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || "U";
  };

  const habitHighlights = [
    {
      label: "Weekly time",
      value: `${Math.floor(weeklyMinutes / 60)}h ${weeklyMinutes % 60}m`,
      detail: "+12% vs last week",
      icon: Clock,
    },
    {
      label: "Top tool",
      value: topTool,
      detail: "46 sessions this week",
      icon: Sparkles,
    },
    {
      label: "Avg sessions/day",
      value: avgSessions,
      detail: "Goal: 8 / day",
      icon: Target,
    },
  ];

  const wins = [
    {
      title: "Finished research brief with Claude",
      timeAgo: "2h ago",
    },
    {
      title: "Logged reflection streak",
      timeAgo: "Yesterday",
    },
    {
      title: "Shared prompt pack with Sam",
      timeAgo: "2 days ago",
    },
  ];

  const reflectionPrompt = "What pattern did you notice in your AI usage today?";

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 py-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Daily streak</p>
                <p className="text-3xl font-semibold text-foreground flex items-center gap-2">
                  <Flame className="h-6 w-6 text-primary" />
                  {streak} days
                </p>
                <p className="text-sm text-muted-foreground">
                  Keep showing up and we'll keep the insights flowing.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" className="gap-2">
                <PenLine className="h-4 w-4" />
                Log a reflection
              </Button>
              <Button className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                View insights
              </Button>
              <Button variant="outline" className="gap-2 text-destructive border-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {habitHighlights.map((item) => (
            <Card key={item.label}>
              <CardContent className="py-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">{item.label}</p>
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Reflection prompt</CardTitle>
              <CardDescription>Capture a quick insight before you forget it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-foreground">{reflectionPrompt}</p>
              <Button variant="outline" className="w-full">
                Write a note
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent wins</CardTitle>
              <CardDescription>Your highlight reel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wins.map((win) => (
                <div key={win.title} className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{win.title}</p>
                    <p className="text-sm text-muted-foreground">{win.timeAgo}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl} alt={fullName} />
                  <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <Input
                    id="avatar-url"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
