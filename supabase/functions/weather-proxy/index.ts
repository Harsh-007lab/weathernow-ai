import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Security: Restrict CORS to trusted origins
const ALLOWED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:5173',
  'https://weathernow.vercel.app',
  // Add your production domain here
];

const getCorsHeaders = (origin: string | null) => {
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Fallback, overridden per request
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const isDev = Deno.env.get('ENVIRONMENT') !== 'production';

// Rate limiting using in-memory store (resets on function restart)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

// Input validation schemas
const WeatherByCitySchema = z.object({
  type: z.literal('weather-by-city'),
  city: z.string().trim().min(1).max(100),
});

const WeatherByCoordsSchema = z.object({
  type: z.literal('weather-by-coords'),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

const ForecastSchema = z.object({
  type: z.literal('forecast'),
  city: z.string().trim().min(1).max(100),
});

const CitySuggestionsSchema = z.object({
  type: z.literal('city-suggestions'),
  query: z.string().trim().min(2).max(100),
});

const RequestSchema = z.discriminatedUnion('type', [
  WeatherByCitySchema,
  WeatherByCoordsSchema,
  ForecastSchema,
  CitySuggestionsSchema,
]);

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
  const origin = req.headers.get('origin');
  const headers = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    // Rate limiting by IP
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    const body = await req.json();
    const validatedInput = RequestSchema.parse(body);

    if (isDev) {
      console.log('Weather proxy request:', { type: validatedInput.type, ip: clientIp });
    }

    const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OPENWEATHER_API_KEY not configured');
    }

    const BASE_URL = "https://api.openweathermap.org";
    let apiUrl = '';

    // Build API URL based on request type
    switch (validatedInput.type) {
      case 'weather-by-city':
        apiUrl = `${BASE_URL}/data/2.5/weather?q=${encodeURIComponent(validatedInput.city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        break;
      case 'weather-by-coords':
        apiUrl = `${BASE_URL}/data/2.5/weather?lat=${validatedInput.lat}&lon=${validatedInput.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        break;
      case 'forecast':
        apiUrl = `${BASE_URL}/data/2.5/forecast?q=${encodeURIComponent(validatedInput.city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        break;
      case 'city-suggestions':
        apiUrl = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(validatedInput.query)}&limit=5&appid=${OPENWEATHER_API_KEY}`;
        break;
    }

    // Proxy request to OpenWeather API
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('OpenWeather API error:', response.status, data);
      return new Response(
        JSON.stringify({ error: data.message || 'Weather API error' }),
        { status: response.status, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format', details: error.errors }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    console.error('Error in weather-proxy:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }
});
