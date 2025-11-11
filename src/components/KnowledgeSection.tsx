import { Card } from '@/components/ui/card';
import { BookOpen, CloudRain, Droplets, Sun, TrendingUp } from 'lucide-react';

export const KnowledgeSection = () => {
  const articles = [
    {
      icon: TrendingUp,
      title: "How to Read Weather Forecasts",
      content: "Weather forecasts use probability percentages to indicate the chance of precipitation in your area. A 70% chance of rain means that in similar conditions, precipitation occurred 7 out of 10 times. Temperature forecasts show expected highs and lows, while 'feels like' temperatures account for wind chill or heat index. Weather maps use colors to represent temperature ranges, with blue indicating cold and red showing heat. Understanding these basics helps you plan your day more effectively and dress appropriately for conditions.",
    },
    {
      icon: Droplets,
      title: "Why Humidity Affects Comfort Levels",
      content: "Humidity measures the amount of water vapor in the air, directly impacting how your body regulates temperature. When humidity is high, sweat cannot evaporate efficiently from your skin, making you feel hotter than the actual temperature. Low humidity allows sweat to evaporate quickly, cooling you down but potentially causing dehydration and dry skin. The ideal indoor humidity range is 30-50% for optimal comfort and health. High humidity also creates favorable conditions for mold growth, dust mites, and can make breathing difficult for people with respiratory conditions.",
    },
    {
      icon: Sun,
      title: "Understanding UV Index",
      content: "The UV Index measures the intensity of ultraviolet radiation from the sun reaching Earth's surface. It ranges from 0 (minimal risk) to 11+ (extreme risk). A UV Index of 3 or higher requires sun protection like sunscreen, hats, and sunglasses. UV radiation peaks during midday hours (10 AM - 4 PM) and is strongest in summer months. Even on cloudy days, up to 80% of UV rays can penetrate clouds, so protection remains important. Repeated UV exposure without protection increases skin cancer risk and causes premature skin aging.",
    },
    {
      icon: CloudRain,
      title: "What Causes Rain and Storms",
      content: "Rain forms when water vapor in clouds condenses into droplets heavy enough to fall. This happens when warm, moist air rises, cools, and reaches its dew point. Thunderstorms develop when warm air rapidly rises through cooler air, creating powerful updrafts. Lightning occurs from the buildup of electrical charges within storm clouds, while thunder is the sound wave produced by rapidly expanding air heated by lightning. Storm severity depends on atmospheric instability, moisture availability, and wind patterns. Understanding these processes helps you anticipate weather changes and stay safe during severe conditions.",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Weather Knowledge Center</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article, index) => {
          const Icon = article.icon;
          return (
            <Card 
              key={index} 
              className="glass p-5 hover-scale transition-all animate-scale-in"
              style={{ '--stagger-delay': index + 1 } as any}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground flex-1">
                  {article.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {article.content}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
