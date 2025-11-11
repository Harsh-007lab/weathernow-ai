import { Card } from '@/components/ui/card';
import { BookOpen, Thermometer, Wind, Droplets, Gauge, Sun } from 'lucide-react';
import type { WeatherData } from '@/types/weather';

interface WeatherEducationProps {
  data: WeatherData;
}

export const WeatherEducation = ({ data }: WeatherEducationProps) => {
  const getTemperatureInsight = (temp: number) => {
    if (temp < 0) {
      return "Freezing temperatures can make outdoor activities challenging and require proper winter clothing. At this temperature, exposed skin can develop frostbite quickly, and hypothermia becomes a serious risk. Roads may be icy, so extra caution is needed when traveling.";
    } else if (temp < 10) {
      return "Cool temperatures like this are ideal for brisk outdoor activities like hiking or jogging. You'll want to layer clothing to stay comfortable, as your body generates heat during movement. This temperature range is perfect for enjoying fall foliage or winter sports.";
    } else if (temp < 20) {
      return "Mild temperatures create comfortable conditions for most outdoor activities without overheating. This is the perfect weather for gardening, outdoor dining, or casual walks. You may need a light jacket in the morning or evening when temperatures dip slightly.";
    } else if (temp < 30) {
      return "Warm temperatures are great for beach trips, swimming, and summer sports. Your body can regulate heat well at this temperature, though staying hydrated becomes important during prolonged outdoor exposure. Evening temperatures will feel pleasant and comfortable.";
    } else {
      return "High temperatures require serious precautions to avoid heat exhaustion and dehydration. Limit strenuous outdoor activities to early morning or evening hours, and drink plenty of water throughout the day. Seek air-conditioned spaces during peak heat hours.";
    }
  };

  const getWindInsight = (speed: number) => {
    if (speed < 5) {
      return "Calm winds create peaceful conditions perfect for outdoor dining, photography, or leisurely walks. Smoke rises vertically, and water surfaces remain smooth. This is ideal weather for activities requiring stability like drone flying or fishing.";
    } else if (speed < 12) {
      return "Light breezes provide natural cooling without disrupting most outdoor activities. You'll notice leaves rustling and flags moving gently. This wind speed is perfect for sailing small boats, flying kites, or enjoying a comfortable picnic.";
    } else if (speed < 20) {
      return "Moderate winds can make outdoor activities more challenging and may require securing loose items. Tree branches sway noticeably, and it becomes harder to use umbrellas. Cycling against the wind requires more effort, while sailing becomes more exciting.";
    } else {
      return "Strong winds can make travel difficult and potentially dangerous. Secure outdoor furniture and avoid parking under trees. High-profile vehicles may experience handling issues, and pedestrians should be cautious of flying debris. Consider postponing outdoor activities.";
    }
  };

  const getHumidityInsight = (humidity: number) => {
    if (humidity < 30) {
      return "Low humidity makes the air feel drier and can cause skin irritation, dry throat, and static electricity. While heat feels less oppressive, you'll need to drink more water and use moisturizers. Indoor plants may need extra watering, and wooden furniture can crack.";
    } else if (humidity < 60) {
      return "Comfortable humidity levels make breathing easy and help your body regulate temperature efficiently. This range is ideal for most activities and helps prevent both dehydration and excessive sweating. Indoor comfort is optimal without needing humidifiers or dehumidifiers.";
    } else if (humidity < 80) {
      return "High humidity makes the air feel heavier and can make temperatures feel warmer than they actually are. Your body's ability to cool through sweating becomes less effective, leading to discomfort during physical activities. Mold and mildew growth increases in this range.";
    } else {
      return "Very high humidity creates muggy conditions where sweat doesn't evaporate efficiently, making even moderate temperatures feel oppressive. This can lead to heat exhaustion more quickly during outdoor work or exercise. Indoor spaces may feel damp, and condensation can form on windows.";
    }
  };

  const getPressureInsight = (pressure: number) => {
    if (pressure < 1000) {
      return "Low atmospheric pressure typically signals approaching storms or unsettled weather. As air rises and cools, clouds form and precipitation becomes likely. People with arthritis or migraines often report increased discomfort during low-pressure systems. Barometric changes can also affect fishing success.";
    } else if (pressure < 1020) {
      return "Normal atmospheric pressure indicates stable weather conditions with no major systems approaching. This is typical of fair weather patterns where conditions remain predictable. Your weather apps' forecasts will be most accurate during these stable pressure periods.";
    } else {
      return "High atmospheric pressure usually brings clear skies and settled weather conditions. As air descends and warms, clouds dissipate and precipitation is unlikely. This creates excellent conditions for outdoor events, stargazing, and activities requiring good visibility. Expect calm, pleasant weather.";
    }
  };

  const getSunInsight = (sunrise: string, sunset: string) => {
    const sunriseTime = new Date(`2000-01-01T${sunrise}`);
    const sunsetTime = new Date(`2000-01-01T${sunset}`);
    const daylightHours = (sunsetTime.getTime() - sunriseTime.getTime()) / (1000 * 60 * 60);
    
    if (daylightHours < 10) {
      return "Short daylight hours are typical of winter months when the sun's angle is lower in the sky. This affects not only outdoor activity time but can also impact mood and energy levels. Many people benefit from morning sunlight exposure to maintain their circadian rhythm during these shorter days.";
    } else if (daylightHours < 14) {
      return "Moderate daylight hours provide a balanced day for work and leisure activities. This typical day length gives you ample time for outdoor activities after work or school. Solar panels operate efficiently, and natural lighting can reduce electricity needs for most of the day.";
    } else {
      return "Long daylight hours characteristic of summer months provide extended time for outdoor activities and natural vitamin D production. The sun's high angle delivers more direct solar energy, making it perfect for solar power generation. Evening activities can extend later while still enjoying natural light.";
    }
  };

  return (
    <Card className="glass p-6 animate-scale-in">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Understanding Today's Weather</h2>
      </div>

      <div className="space-y-6">
        {/* Temperature Insight */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary/80" />
            <h3 className="text-lg font-semibold text-foreground">Temperature Impact</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {getTemperatureInsight(data.temp)}
          </p>
        </div>

        {/* Wind Insight */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-primary/80" />
            <h3 className="text-lg font-semibold text-foreground">Wind Conditions</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {getWindInsight(data.windSpeed)}
          </p>
        </div>

        {/* Humidity Insight */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary/80" />
            <h3 className="text-lg font-semibold text-foreground">Humidity Effects</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {getHumidityInsight(data.humidity)}
          </p>
        </div>

        {/* Pressure Insight */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary/80" />
            <h3 className="text-lg font-semibold text-foreground">Atmospheric Pressure</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {getPressureInsight(data.pressure)}
          </p>
        </div>

        {/* Sunrise/Sunset Insight */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-primary/80" />
            <h3 className="text-lg font-semibold text-foreground">Daylight & Solar Activity</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {getSunInsight(data.sunrise, data.sunset)}
          </p>
        </div>
      </div>
    </Card>
  );
};
