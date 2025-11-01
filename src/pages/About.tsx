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
      <header className="container mx-auto px-4 py-6">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            About WeatherNow
          </h1>

          <section className="mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              WeatherNow is more than just a weather app—it's your intelligent
              companion for staying ahead of changing conditions. We combine
              cutting-edge artificial intelligence with real-time meteorological
              data from trusted sources to deliver the most accurate forecasts
              and personalized insights.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Whether you're planning your day, preparing for a trip, or simply
              curious about the weather, WeatherNow provides the information you
              need in a beautiful, intuitive interface.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              What Makes Us Different
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <feature.icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg leading-relaxed">
              To make weather forecasting accessible, accurate, and actionable
              for everyone. We believe that with the right information and
              insights, you can make better decisions and live more confidently,
              no matter what the weather brings.
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
