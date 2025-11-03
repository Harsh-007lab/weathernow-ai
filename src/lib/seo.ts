/**
 * SEO Configuration and Utilities
 * Manages dynamic meta tags and structured data
 */

interface MetaTagsConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

/**
 * Update page meta tags dynamically
 */
export const updateMetaTags = ({
  title,
  description,
  keywords,
  image = "/assets/weathernow-banner.png",
  url = "https://weathernow.vercel.app/",
}: MetaTagsConfig) => {
  // Update title
  document.title = title;

  // Update or create meta tags
  const updateMeta = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? "property" : "name";
    let element = document.querySelector(
      `meta[${attribute}="${name}"]`
    ) as HTMLMetaElement;

    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.content = content;
  };

  // Standard meta tags
  updateMeta("description", description);
  if (keywords) updateMeta("keywords", keywords);

  // Open Graph tags
  updateMeta("og:title", title, true);
  updateMeta("og:description", description, true);
  updateMeta("og:image", image, true);
  updateMeta("og:url", url, true);

  // Twitter tags
  updateMeta("twitter:title", title);
  updateMeta("twitter:description", description);
  updateMeta("twitter:image", image);
};

/**
 * Generate JSON-LD structured data for weather service
 */
export const generateWeatherSchema = (cityName?: string, temperature?: number) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "WeatherNow AI",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "2340",
      bestRating: "5",
      worstRating: "1"
    },
    description:
      "AI-powered weather forecasting app with real-time data, 5-day forecasts, sun trajectory visualization, and personalized insights. Get accurate weather predictions with intelligent recommendations.",
    url: "https://weathernow-ai.vercel.app/",
    creator: {
      "@type": "Organization",
      name: "WeatherNow AI",
      url: "https://weathernow-ai.vercel.app/",
      logo: "https://weathernow-ai.vercel.app/icons/icon-512.png"
    },
    featureList: [
      "Real-time weather data with timezone-aware sun position",
      "5-day detailed forecast with hourly breakdowns",
      "AI-powered weather insights and recommendations",
      "Location-based weather tracking",
      "Interactive sun trajectory visualization",
      "Weather alerts and notifications",
      "Favorites and recent searches",
      "Dark/Light theme with auto city-time sync",
      "PWA with offline support"
    ],
    softwareVersion: "2.0",
    screenshot: "https://weathernow-ai.vercel.app/assets/weathernow-banner.png",
    accessibilityFeature: [
      "Keyboard navigation",
      "ARIA labels",
      "Screen reader support",
      "High contrast support"
    ]
  };

  // Add specific weather observation if city data is available
  if (cityName && temperature !== undefined) {
    return [
      baseSchema,
      {
        "@context": "https://schema.org",
        "@type": "WeatherObservation",
        name: `Current Weather in ${cityName}`,
        description: `Real-time weather conditions for ${cityName} with AI-powered insights`,
        observedProperty: {
          "@type": "PropertyValue",
          name: "Temperature",
          value: temperature,
          unitText: "°C",
        },
        dateObserved: new Date().toISOString(),
      },
    ];
  }

  return baseSchema;
};

/**
 * Inject JSON-LD structured data into page
 */
export const injectStructuredData = (schema: object | object[]) => {
  // Remove existing schema
  const existingScript = document.getElementById("structured-data");
  if (existingScript) {
    existingScript.remove();
  }

  // Add new schema
  const script = document.createElement("script");
  script.id = "structured-data";
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};
