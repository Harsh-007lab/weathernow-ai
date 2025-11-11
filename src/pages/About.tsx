import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cloud, Sparkles, TrendingUp, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateMetaTags, injectStructuredData } from "@/lib/seo";

const About = () => {
  useEffect(() => {
    // SEO Meta Tags
    updateMetaTags({
      title: "About WeatherNow | AI-Powered Weather Intelligence",
      description:
        "Learn how WeatherNow combines cutting-edge AI with real-time meteorological data to deliver the most accurate weather forecasts and personalized insights.",
      keywords:
        "about weathernow, weather technology, AI forecasting, meteorology, weather app features",
      url: "https://weathernow.vercel.app/about",
    });

    // Structured Data
    injectStructuredData({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About WeatherNow",
      description:
        "WeatherNow is an AI-powered weather forecasting platform providing accurate, real-time weather data and intelligent insights.",
      mainEntity: {
        "@type": "Organization",
        name: "WeatherNow",
        url: "https://weathernow.vercel.app/",
        logo: "https://weathernow.vercel.app/favicon.png",
        description:
          "AI-powered weather forecasting service with personalized insights",
      },
    });
  }, []);

  const features = [
    {
      icon: Cloud,
      title: "Real-Time Data",
      description:
        "Access live weather conditions from thousands of meteorological stations worldwide.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description:
        "Get personalized recommendations powered by advanced machine learning algorithms.",
    },
    {
      icon: TrendingUp,
      title: "Accurate Forecasts",
      description:
        "5-day forecasts with hour-by-hour precision using multiple data sources.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your location data is never stored or shared. Complete privacy guaranteed.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-950">
      <header className="container mx-auto px-4 sm:px-6 py-6">
        <Link to="/">
          <Button variant="ghost" className="gap-2 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            About WeatherNow
          </h1>

          <section className="mb-12 sm:mb-16 space-y-6">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              WeatherNow is more than just a weather app—it's your intelligent
              companion for staying ahead of changing conditions. We combine
              cutting-edge artificial intelligence with real-time meteorological
              data from trusted sources to deliver the most accurate forecasts
              and personalized insights.
            </p>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Whether you're planning your day, preparing for a trip, or simply
              curious about the weather, WeatherNow provides the information you
              need in a beautiful, intuitive interface.
            </p>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our platform processes data from thousands of weather stations, satellites, and atmospheric sensors worldwide. We analyze temperature patterns, precipitation probability, wind dynamics, and atmospheric pressure to provide forecasts you can trust. The integration of machine learning allows us to identify patterns and improve prediction accuracy over time, making each forecast more reliable than the last.
            </p>
          </section>

          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              How WeatherNow Helps You
            </h2>
            <div className="space-y-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">For Daily Planning:</strong> Know exactly what to wear, whether to bring an umbrella, and how to time your outdoor activities. Our detailed hourly forecasts help you optimize your schedule around weather conditions.
              </p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">For Travel:</strong> Check conditions at your destination before you leave. Multi-day forecasts help you pack appropriately and plan activities that won't be disrupted by weather.
              </p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">For Health & Safety:</strong> UV index warnings protect your skin, humidity levels help manage respiratory conditions, and severe weather alerts keep you safe during storms.
              </p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">For Outdoor Activities:</strong> Wind speed data helps sailors and cyclists, temperature trends guide runners and hikers, and precipitation forecasts ensure your event stays dry.
              </p>
            </div>
          </section>

          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-10 text-gray-900 dark:text-white">
              What Makes Us Different
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Our Mission</h2>
            <p className="text-base sm:text-lg leading-relaxed text-white/95">
              To make weather forecasting accessible, accurate, and actionable
              for everyone. We believe that with the right information and
              insights, you can make better decisions and live more confidently,
              no matter what the weather brings.
            </p>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
