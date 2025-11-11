import { motion } from "framer-motion";
import { CloudSun } from "lucide-react";

export const WeatherOverview = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 sm:p-8 md:p-10 space-y-4 backdrop-blur-md border border-white/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <CloudSun className="w-8 h-8 text-white" aria-hidden="true" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Weather Overview</h2>
      </div>

      <div className="space-y-4 text-white/90 leading-relaxed">
        <p className="text-sm sm:text-base">
          Weather patterns are constantly shifting due to atmospheric pressure systems, temperature gradients, and wind circulation. Modern meteorology relies on thousands of ground stations, satellites, and ocean buoys to track these changes in real time. By analyzing data from multiple sources, forecasters can predict conditions with increasing accuracy, helping communities prepare for storms, heatwaves, and seasonal shifts.
        </p>
        
        <p className="text-sm sm:text-base">
          Local forecasting combines global climate models with regional topography, proximity to water bodies, and urban heat effects. Coastal cities experience different weather dynamics than inland regions due to ocean currents and moisture levels. Mountain ranges can block storm systems or create microclimates, while urban areas often record higher temperatures than surrounding countryside—a phenomenon known as the urban heat island effect.
        </p>
        
        <p className="text-sm sm:text-base">
          Climate trends over recent decades show increased variability in precipitation patterns and temperature extremes. Scientists use historical data to identify long-term shifts, such as earlier spring thaws, more intense rainfall events, and changing growing seasons. Understanding these trends helps governments, farmers, and infrastructure planners make informed decisions about water management, agriculture, and disaster preparedness.
        </p>
        
        <p className="text-sm sm:text-base">
          Advances in artificial intelligence and machine learning have revolutionized weather prediction. AI models can process vast datasets faster than traditional methods, identifying subtle patterns that improve forecast precision. These technologies enable earlier warnings for severe weather, better air quality monitoring, and personalized recommendations for daily activities—making weather intelligence more accessible and actionable for everyone.
        </p>
      </div>
    </motion.section>
  );
};
