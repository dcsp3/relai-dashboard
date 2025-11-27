import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLine, Sparkles } from "lucide-react";

const reflectionPrompts = [
  "What pattern did you notice in your AI usage today?",
  "How did AI help you solve a problem today?",
  "What's one thing you learned from your AI interactions?",
  "How did you balance AI assistance with your own thinking?",
];

const ReflectionPrompt = () => {
  // Rotate through prompts or use a specific one
  const currentPrompt = reflectionPrompts[0];

  return (
    <Card>
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-lg">Daily Reflection</CardTitle>
        </div>
        <CardDescription>Take a moment to reflect on your AI usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed italic">
          "{currentPrompt}"
        </p>
        <Button className="w-full gap-2" size="sm">
          <PenLine className="h-4 w-4" />
          Log Reflection
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReflectionPrompt;


