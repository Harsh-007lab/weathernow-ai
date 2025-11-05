import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const isDev = Deno.env.get('ENVIRONMENT') !== 'production';

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 50;
const RATE_WINDOW = 60 * 1000;

// Input validation
const WeatherInsightsSchema = z.object({
  temp: z.number().min(-100).max(100),
  condition: z.string().max(50),
  humidity: z.number().min(0).max(100),
  windSpeed: z.number().min(0).max(500),
});

const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    const body = await req.json();
    const { temp, condition, humidity, windSpeed } = WeatherInsightsSchema.parse(body);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Given the weather conditions:
- Temperature: ${temp}°C
- Condition: ${condition}
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} m/s

Provide brief, practical advice (2-3 sentences each) for:
1. Outfit suggestion (what to wear)
2. Activity recommendation (what to do)

Keep responses concise, friendly, and actionable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a helpful weather assistant. Provide practical, concise advice about clothing and activities based on weather conditions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      if (isDev) {
        const errorText = await response.text();
        console.error("AI Gateway error:", response.status, errorText);
      }
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Unable to generate weather insights. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the response to extract outfit and activity suggestions
    const lines = aiResponse.split('\n').filter((line: string) => line.trim());
    let outfit = "";
    let activity = "";
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('outfit') || line.includes('wear') || line.includes('1.')) {
        outfit = lines[i].replace(/^[\d.]+\s*/, '').replace(/^(outfit|wear)[:\s]*/i, '').trim();
      } else if (line.includes('activity') || line.includes('do') || line.includes('2.')) {
        activity = lines[i].replace(/^[\d.]+\s*/, '').replace(/^(activity|do)[:\s]*/i, '').trim();
      }
    }

    // Fallback if parsing fails
    if (!outfit || !activity) {
      const parts = aiResponse.split('\n\n');
      outfit = parts[0] || "Dress comfortably for the current conditions.";
      activity = parts[1] || "Enjoy your day!";
    }

    return new Response(
      JSON.stringify({ 
        insights: {
          outfit,
          activity
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (isDev) {
        console.error('Validation error:', error.errors);
      }
      return new Response(
        JSON.stringify({ error: 'Invalid weather data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.error("Error in weather-insights:", {
      type: error instanceof Error ? error.name : 'Unknown',
      timestamp: new Date().toISOString(),
    });
    
    return new Response(
      JSON.stringify({ error: "An error occurred while generating insights" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
