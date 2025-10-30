import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Shirt, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WeatherInsightsProps {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export const WeatherInsights = ({ temp, condition, humidity, windSpeed }: WeatherInsightsProps) => {
  const [insights, setInsights] = useState<{ outfit: string; activity: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInsights();
  }, [temp, condition, humidity, windSpeed]);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('weather-insights', {
        body: { temp, condition, humidity, windSpeed }
      });

      if (error) {
        // Production-safe error handling
        if (error.message.includes('429')) {
          toast({
            title: "Rate limit reached",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
        } else if (error.message.includes('402')) {
          toast({
            title: "Credits needed",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
        }
        return;
      }

      if (data?.insights) {
        setInsights(data.insights);
      }
    } catch (error) {
      // Errors handled silently in production
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="glass p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-white" />
          <h3 className="text-xl font-bold text-white">AI Weather Insights</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-white/60" />
        </div>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <Card className="glass p-6 animate-scale-in hover-scale transition-all">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-white animate-pulse" />
        <h3 className="text-xl font-bold text-white">AI Weather Insights</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/15 transition-all">
          <div className="flex items-start gap-3">
            <Shirt className="w-5 h-5 text-white/80 mt-1 flex-shrink-0" />
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">What to Wear</p>
              <p className="text-white">{insights.outfit}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/15 transition-all">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-white/80 mt-1 flex-shrink-0" />
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Activity Suggestion</p>
              <p className="text-white">{insights.activity}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
