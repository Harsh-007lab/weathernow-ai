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
    name: "WeatherNow",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
    description:
      "AI-powered weather forecasting app with real-time data, 5-day forecasts, and personalized insights.",
    url: "https://weathernow.vercel.app/",
    creator: {
      "@type": "Organization",
      name: "WeatherNow",
      url: "https://weathernow.vercel.app/",
    },
    featureList: [
      "Real-time weather data",
      "5-day forecast",
      "AI-powered insights",
      "Location-based weather",
      "Weather alerts",
      "UV index tracking",
      "Air quality monitoring",
    ],
  };

  // Add specific weather observation if city data is available
  if (cityName && temperature !== undefined) {
    return [
      baseSchema,
      {
        "@context": "https://schema.org",
        "@type": "WeatherObservation",
        name: `Current Weather in ${cityName}`,
        description: `Real-time weather conditions for ${cityName}`,
        observedProperty: {
          "@type": "PropertyValue",
          name: "Temperature",
          value: temperature,
          unitText: "°C",
        },
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
