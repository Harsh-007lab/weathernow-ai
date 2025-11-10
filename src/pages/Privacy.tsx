import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateMetaTags, injectStructuredData } from "@/lib/seo";

const Privacy = () => {
  useEffect(() => {
    // SEO Meta Tags
    updateMetaTags({
      title: "Privacy Policy | WeatherNow - Your Data, Your Control",
      description:
        "Learn how WeatherNow protects your privacy. We don't store location data, respect your privacy, and comply with GDPR and data protection regulations.",
      keywords:
        "privacy policy, data protection, GDPR, weather app privacy, location privacy",
      url: "https://weathernow-ai.vercel.app/privacy",
    });

    // Structured Data
    injectStructuredData({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy",
      description: "WeatherNow's privacy policy and data protection practices.",
      publisher: {
        "@type": "Organization",
        name: "WeatherNow",
      },
    });
  }, []);

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
          <div className="text-center mb-12 sm:mb-16">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Last updated: November 10, 2025
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Website: WeatherNow (https://weathernow-ai.vercel.app/)
            </p>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 sm:space-y-10 border border-gray-200/50 dark:border-gray-700/50">
            <section>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                WeatherNow respects your privacy. This policy explains what information we collect, how we use it, and how we protect it.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                1. Information We Collect
              </h2>
              <div className="space-y-5 sm:space-y-6 text-gray-700 dark:text-gray-300">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">a) Location Data</h3>
                  <p className="text-sm sm:text-base leading-relaxed">
                    If you allow location access, we use your device's coordinates only to display weather information. We do not store, track, or share your location.
                  </p>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">b) Search History & Favorites</h3>
                  <p className="text-sm sm:text-base leading-relaxed">
                    We may store the cities you search or mark as favorites locally on your device to improve your experience. This data is not sent to our servers unless account sync is enabled later.
                  </p>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">c) Email (Contact / Suggestions Form)</h3>
                  <p className="text-sm sm:text-base leading-relaxed">
                    If you submit feedback or contact us, we store your email to respond. We never sell or share email data.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                2. How We Use Your Information
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We use data to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <li>Provide accurate weather data</li>
                <li>Improve app performance and speed</li>
                <li>Respond to user suggestions</li>
                <li>Personalize the experience (favorites, theme, location option)</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                We do not sell personal data or track users across websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                3. Third-Party Services
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-600">
                      <th className="py-2 px-3 font-semibold text-gray-900 dark:text-white">Service</th>
                      <th className="py-2 px-3 font-semibold text-gray-900 dark:text-white">Purpose</th>
                      <th className="py-2 px-3 font-semibold text-gray-900 dark:text-white">Policy Link</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-3">OpenWeather API</td>
                      <td className="py-3 px-3">Weather data</td>
                      <td className="py-3 px-3">
                        <a
                          href="https://openweathermap.org/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                          Privacy Policy
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-3">Supabase</td>
                      <td className="py-3 px-3">Secure backend and routing</td>
                      <td className="py-3 px-3">
                        <a
                          href="https://supabase.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                          Privacy Policy
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-3">Google AdSense</td>
                      <td className="py-3 px-3">Ads display and relevance</td>
                      <td className="py-3 px-3">
                        <a
                          href="https://policies.google.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                          Privacy Policy
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Ads may use cookies to show relevant ads. Users can opt out of personalized ads here:{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  https://www.google.com/settings/ads
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                4. Cookies
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                We use cookies only to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3">
                <li>Remember theme mode</li>
                <li>Improve loading speed</li>
                <li>Store recent searches locally</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Users can clear cookies anytime from browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                5. Security
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                WeatherNow uses HTTPS encryption, backend protection for API keys, and regular vulnerability checks. No system is completely risk free. Report security issues to us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                6. Children's Privacy
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                WeatherNow is safe for all ages. We do not knowingly collect data from children under 13.
              </p>
            </section>

            <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                7. Contact Us
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                For privacy or support inquiries:
              </p>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href="mailto:harshagrawal070406@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  harshagrawal070406@gmail.com
                </a>
              </p>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                We respond within 48 hours.
              </p>
            </section>

            <section className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                8. Updates to This Policy
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                If we update this policy, we will notify users on the website.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Privacy;
