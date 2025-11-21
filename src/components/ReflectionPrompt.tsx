import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface Prompt {
  id: string;
  prompt_text: string;
  prompt_date: string;
}

const ReflectionPrompt = () => {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [reflection, setReflection] = useState("");
  const [smallWin, setSmallWin] = useState("");
  const [hasReflected, setHasReflected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayPrompt();
  }, []);

  const fetchTodayPrompt = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      // Get today's prompt
      let { data: promptData, error: promptError } = await supabase
        .from('reflection_prompts')
        .select('*')
        .eq('prompt_date', today)
        .maybeSingle();

      if (promptError) throw promptError;

      // Create prompt if it doesn't exist
      if (!promptData) {
        const prompts = [
          "What did you learn today without using AI?",
          "Describe a moment when you solved a problem on your own.",
          "How did limiting AI usage make you feel today?",
          "What skill did you practice without AI assistance?",
          "What's one thing you're proud of accomplishing today?"
        ];
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

        const { data: newPrompt, error: createError } = await supabase
          .from('reflection_prompts')
          .insert({ prompt_text: randomPrompt, prompt_date: today })
          .select()
          .single();

        if (createError) throw createError;
        promptData = newPrompt;
      }

      setPrompt(promptData);

      // Check if user has reflected today
      const { data: reflectionData, error: reflectionError } = await supabase
        .from('user_reflections')
        .select('reflection_text, small_win')
        .eq('user_id', user.id)
        .eq('prompt_id', promptData.id)
        .maybeSingle();

      if (reflectionError) throw reflectionError;

      if (reflectionData) {
        setReflection(reflectionData.reflection_text);
        setSmallWin(reflectionData.small_win || "");
        setHasReflected(true);
      }
    } catch (error) {
      console.error('Error fetching prompt:', error);
      toast.error('Failed to load reflection prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!prompt || !reflection.trim()) {
      toast.error('Please write your reflection');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_reflections')
        .insert({
          user_id: user.id,
          prompt_id: prompt.id,
          reflection_text: reflection,
          small_win: smallWin || null
        });

      if (error) throw error;

      setHasReflected(true);
      toast.success('Reflection saved! +10 points');
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast.error('Failed to save reflection');
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (!prompt) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
      <div className="flex items-start gap-3 mb-4">
        <Sparkles className="h-6 w-6 text-accent mt-1" />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground mb-1">Daily Reflection</h2>
          <p className="text-foreground/80">{prompt.prompt_text}</p>
        </div>
      </div>

      {!hasReflected ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Your Reflection
            </label>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Small Win Today 🎉 (Optional)
            </label>
            <Textarea
              value={smallWin}
              onChange={(e) => setSmallWin(e.target.value)}
              placeholder="What's one small victory you had today?"
              className="min-h-[60px]"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Submit Reflection
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-background/50 rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">Your Reflection</p>
            <p className="text-foreground">{reflection}</p>
          </div>
          {smallWin && (
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">Small Win 🎉</p>
              <p className="text-foreground">{smallWin}</p>
            </div>
          )}
          <p className="text-sm text-accent font-medium">✓ Reflection completed for today!</p>
        </div>
      )}
    </Card>
  );
};

export default ReflectionPrompt;
