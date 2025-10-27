import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temp, condition, humidity, windSpeed } = await req.json();
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
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
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
    console.error("Error in weather-insights function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
