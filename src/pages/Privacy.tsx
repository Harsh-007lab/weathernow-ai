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
      url: "https://weathernow.vercel.app/privacy",
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
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last updated: November 1, 2025
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Our Commitment to Privacy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                At WeatherNow, your privacy is paramount. We believe you should
                have control over your data, which is why we've designed our
                service to collect minimal information and respect your privacy
                at every step.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold mb-2">Location Data</h3>
                  <p className="leading-relaxed">
                    When you use location services, we access your approximate
                    location only to provide weather information. This data is
                    never stored on our servers and is only used temporarily to
                    fetch weather data.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Search Queries</h3>
                  <p className="leading-relaxed">
                    City names you search for are used only to retrieve weather
                    information and are not stored or associated with your
                    identity.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="leading-relaxed">
                    We use privacy-focused analytics to understand how our
                    service is used and improve the experience. This data is
                    anonymized and never contains personally identifiable
                    information.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>To provide accurate weather forecasts for your location</li>
                <li>To respond to your AI chat queries</li>
                <li>To improve and optimize our service</li>
                <li>To ensure the security of our application</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Third-Party Services
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We use OpenWeather API to fetch weather data. When you request
                weather information, your location or searched city is sent to
                OpenWeather's servers. Please review{" "}
                <a
                  href="https://openweather.co.uk/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  OpenWeather's Privacy Policy
                </a>{" "}
                for more information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Data Security
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                All communications between your device and our servers are
                encrypted using industry-standard SSL/TLS protocols. We
                implement security best practices to protect against
                unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Your Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Access any personal data we may hold</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of analytics tracking</li>
                <li>Withdraw consent for location services at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                WeatherNow uses minimal cookies only for essential
                functionality, such as remembering your theme preference. We do
                not use advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Children's Privacy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                WeatherNow is safe for all ages. We do not knowingly collect
                personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Changes to This Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update this privacy policy from time to time. Any changes
                will be posted on this page with an updated revision date.
              </p>
            </section>

            <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you have questions about this privacy policy or our data
                practices, please contact us through our website.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Privacy;
