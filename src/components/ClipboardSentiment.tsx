import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Lightbulb, TrendingDown, AlertCircle } from "lucide-react";

// Sample data from clipboard tracking
const clipboardData = {
  totalQueries: 142,
  trivialQueries: 68, // percentage
  complexQueries: 32,
  copyPasteCount: 89, // number of times AI responses were copy-pasted
  copyPasteRate: 63, // percentage
};

const ClipboardSentiment = () => {
  const [animatedCopyPaste, setAnimatedCopyPaste] = useState(0);
  const [animatedTrivial, setAnimatedTrivial] = useState(0);
  const [animatedComplex, setAnimatedComplex] = useState(0);
  
  useEffect(() => {
    // Animate all values together for better performance
    const duration = 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Update all values in one frame
      setAnimatedCopyPaste(clipboardData.copyPasteRate * easeOut);
      setAnimatedTrivial(clipboardData.trivialQueries * easeOut);
      setAnimatedComplex(clipboardData.complexQueries * easeOut);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Set final values exactly
        setAnimatedCopyPaste(clipboardData.copyPasteRate);
        setAnimatedTrivial(clipboardData.trivialQueries);
        setAnimatedComplex(clipboardData.complexQueries);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);
  
  const isHealthy = clipboardData.copyPasteRate < 50 && clipboardData.trivialQueries < 60;

  return (
      <div className="space-y-4">
          <Card
              className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent 
             border-orange-500/3 min-h-[120px] flex items-center justify-center text-center"
          >
              <CardContent className="p-0">
                  <div>
                      <p className="text-base text-foreground">
                          Your AI usage is{" "}
                          <span className="font-semibold text-orange-500">
                              42% higher
                          </span>{" "}
                          than yesterday.
                      </p>
                      <p className="text-l text-muted-foreground mt-1">
                          Try solving the next bit yourself.
                      </p>
                  </div>
              </CardContent>
          </Card>

          <Card className="flex flex-col min-h-[370px]">
              <CardHeader className="space-y-2 mb-2">
                  <div className="flex items-center justify-between">
                      <CardTitle>Query Analysis</CardTitle>
                  </div>
                  <CardDescription>
                      Based on {clipboardData.totalQueries} tracked queries in
                      the past week
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-3">
                      <div>
                          <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                  <Copy className="h-4 w-4 text-orange-500" />
                                  <span className="text-sm text-muted-foreground">
                                      Copy-pasted responses
                                  </span>
                              </div>
                              <span className="text-sm font-medium">
                                  {clipboardData.copyPasteCount} times
                              </span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                  className="h-full bg-orange-500"
                                  style={{
                                      width: `${animatedCopyPaste}%`,
                                      transition: "none",
                                  }}
                              />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                              {Math.round(animatedCopyPaste)}% of interactions
                          </p>
                      </div>

                      <div className="pt-2 border-t space-y-2">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                  <Lightbulb className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm text-muted-foreground">
                                      Query complexity
                                  </span>
                              </div>
                          </div>
                          <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                  Trivial
                              </span>
                              <span className="text-xs text-muted-foreground">
                                  Complex
                              </span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden relative">
                              <div
                                  className="h-full absolute left-0 top-0 bg-yellow-500"
                                  style={{
                                      width: `${animatedTrivial}%`,
                                      transition: "none",
                                  }}
                              />
                              <div
                                  className="h-full absolute right-0 top-0 bg-blue-500"
                                  style={{
                                      width: `${animatedComplex}%`,
                                      transition: "none",
                                  }}
                              />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                              <span className="font-medium">
                                  {Math.round(animatedTrivial)}%
                              </span>
                              <span className="font-medium">
                                  {Math.round(animatedComplex)}%
                              </span>
                          </div>
                      </div>
                  </div>

                  <div className="pt-8 border-t">
                      <p className="text-muted-foreground">
                          {isHealthy ? (
                              <span>
                                  You're engaging thoughtfully with AI
                                  responses.
                              </span>
                          ) : (
                              <span className="text-orange-500">
                                  Consider reducing copy-paste and asking more
                                  complex questions.
                              </span>
                          )}
                      </p>
                  </div>
              </CardContent>
          </Card>
      </div>
  );
};

export default ClipboardSentiment;

