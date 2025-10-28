# WeatherNow - AI-Powered Weather App

A modern, production-grade weather application built with React, TypeScript, and Tailwind CSS. Features AI-powered insights, 5-day forecasts, and beautiful weather visualizations.

## ✨ Features

### Core Weather Features
- 🌡️ **Current Weather Data** - Real-time temperature, humidity, wind speed, and more
- 📅 **5-Day Forecast** - Detailed daily and hourly forecasts with precipitation chances
- 📍 **Geolocation Support** - Auto-detect your location for instant weather updates
- 🔍 **Smart City Search** - Autocomplete suggestions with city, state, and country
- 🔄 **Auto-Refresh** - Automatic data refresh every 15 minutes

### AI-Powered Features
- 🤖 **AI Weather Insights** - Smart outfit and activity recommendations powered by Lovable AI
- 💬 **AI Chat Assistant** - Ask questions like "What should I wear?" or "Will it rain?"
- 🎯 **Context-Aware Responses** - AI uses real-time weather data for personalized advice

### Advanced UX
- 🎨 **Dynamic Weather Backgrounds** - Beautiful gradients that change with weather conditions
- ✨ **Weather Particles** - Animated rain, snow, and cloud effects
- 🌓 **Dark/Light/Auto Mode** - System-aware theme switching
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎭 **Smooth Animations** - Framer Motion-powered transitions
- ⚡ **Loading Skeletons** - Enhanced perceived performance

### Technical Features
- 🏗️ **Clean Architecture** - Organized with custom hooks and service layers
- 📦 **Offline Support** - Service worker caching for offline access
- 🚀 **PWA Ready** - Installable on mobile and desktop
- 🎯 **TypeScript** - Full type safety throughout the application
- 🔐 **Secure API Handling** - Proper secret management via Supabase
- 🎨 **Design System** - Semantic tokens and consistent styling

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS with custom design system
- **Animations:** Framer Motion
- **State Management:** React Query (TanStack Query)
- **Backend:** Supabase Edge Functions (Lovable Cloud)
- **AI:** Lovable AI (Google Gemini 2.5 Flash)
- **Weather API:** OpenWeatherMap API
- **Build Tool:** Vite
- **UI Components:** Radix UI + shadcn/ui

## 📦 Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd weathernow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
The project uses Lovable Cloud, so Supabase credentials are automatically configured. 

For the weather API, you can use the default key or add your own:
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## 🚀 Deployment

The app is configured as a PWA and can be deployed to any static hosting platform. Simply open [Lovable](https://lovable.dev/projects/78f687bc-b351-4299-945a-329ff237fe05) and click on Share -> Publish.

Build for production:
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── api/              # API service layer (weatherApi.ts)
├── components/       # React components
│   ├── ui/          # Reusable UI components (shadcn/ui)
│   ├── AIChat.tsx   # AI chat assistant
│   ├── ForecastCard.tsx
│   ├── ThemeToggle.tsx
│   ├── WeatherBackground.tsx
│   ├── WeatherCard.tsx
│   ├── WeatherInsights.tsx
│   ├── WeatherMetrics.tsx
│   └── WeatherParticles.tsx
├── context/          # React context providers
│   └── ThemeContext.tsx
├── hooks/           # Custom React hooks
│   ├── useAutoRefresh.ts
│   ├── useGeoLocation.ts
│   └── useWeather.ts
├── types/           # TypeScript type definitions
│   └── weather.ts
├── pages/           # Page components
│   └── Index.tsx
└── utils/           # Utility functions

supabase/
└── functions/       # Supabase Edge Functions
    ├── weather-insights/
    └── ai-chat/

public/
├── manifest.json    # PWA manifest
└── sw.js           # Service worker
```

## 🎨 Design System

The app uses a comprehensive design system with:

- **Semantic Color Tokens** - Theme-aware colors (HSL)
- **Weather-Specific Gradients** - Sunny, cloudy, rainy, etc.
- **Glass Morphism Effects** - Modern blurred backgrounds
- **Responsive Typography** - Fluid text scaling
- **Smooth Transitions** - Consistent animation timings

## 🤖 AI Integration

The app uses **Lovable AI** for intelligent weather insights:

1. **Weather Insights** - Automatic outfit and activity suggestions
2. **AI Chat** - Interactive assistant for weather questions
3. **Context-Aware** - Uses real-time weather data for responses
4. **Rate Limit Handling** - Graceful error handling with user feedback

## 📱 PWA Features

- ✅ Installable on mobile/desktop
- ✅ Offline support with service worker
- ✅ Splash screen
- ✅ App icons and theme colors
- ✅ Responsive meta tags

## 🔑 API Keys

### OpenWeatherMap API
Get your free API key at [openweathermap.org](https://openweathermap.org/api)

### Lovable AI
Automatically configured when using Lovable Cloud. No additional setup required.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- Lovable AI for intelligent insights
- Radix UI & shadcn/ui for beautiful components
- Framer Motion for smooth animations
