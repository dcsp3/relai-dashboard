import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Clock } from "lucide-react";

interface ToolLimit {
  id: string;
  tool_name: string;
  daily_limit_minutes: number;
}

const ToolLimits = () => {
  const [limits, setLimits] = useState<ToolLimit[]>([]);
  const [newToolName, setNewToolName] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLimits();
  }, []);

  const fetchLimits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_tool_limits')
        .select('*')
        .eq('user_id', user.id)
        .order('tool_name', { ascending: true });

      if (error) throw error;
      setLimits(data || []);
    } catch (error) {
      console.error('Error fetching limits:', error);
      toast.error('Failed to load limits');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLimit = async () => {
    if (!newToolName.trim() || !newLimit) {
      toast.error('Please enter tool name and limit');
      return;
    }

    const limitMinutes = parseInt(newLimit);
    if (limitMinutes <= 0) {
      toast.error('Limit must be greater than 0');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('ai_tool_limits')
        .insert({
          user_id: user.id,
          tool_name: newToolName.trim(),
          daily_limit_minutes: limitMinutes
        });

      if (error) throw error;

      toast.success('Limit added successfully');
      setNewToolName("");
      setNewLimit("");
      fetchLimits();
    } catch (error: any) {
      console.error('Error adding limit:', error);
      if (error.code === '23505') {
        toast.error('Limit already exists for this tool');
      } else {
        toast.error('Failed to add limit');
      }
    }
  };

  const handleDeleteLimit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_tool_limits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Limit removed');
      fetchLimits();
    } catch (error) {
      console.error('Error deleting limit:', error);
      toast.error('Failed to remove limit');
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">AI Tool Limits</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Set daily time limits for specific AI tools
      </p>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="toolName">Tool Name</Label>
            <Input
              id="toolName"
              value={newToolName}
              onChange={(e) => setNewToolName(e.target.value)}
              placeholder="e.g., ChatGPT"
            />
          </div>
          <div>
            <Label htmlFor="limit">Daily Limit (minutes)</Label>
            <Input
              id="limit"
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="60"
              min="1"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddLimit} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Limit
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {limits.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No limits set yet. Add your first limit above.
          </p>
        ) : (
          limits.map((limit) => (
            <div
              key={limit.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{limit.tool_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {limit.daily_limit_minutes} minutes per day
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteLimit(limit.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ToolLimits;
