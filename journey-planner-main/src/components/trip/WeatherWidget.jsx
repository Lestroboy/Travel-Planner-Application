import { useMemo } from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from "lucide-react";

// Mock weather data generator based on destination and dates
const generateMockWeather = (destination, startDate, endDate) => {
  // Weather patterns by destination type
  const weatherPatterns = {
    beach: { temp: [28, 34], humidity: [70, 85], conditions: ["sunny", "partly_cloudy", "sunny"] },
    mountain: { temp: [8, 20], humidity: [40, 60], conditions: ["cloudy", "partly_cloudy", "snow"] },
    city: { temp: [20, 32], humidity: [50, 70], conditions: ["sunny", "partly_cloudy", "cloudy"] },
    tropical: { temp: [26, 32], humidity: [75, 90], conditions: ["sunny", "rain", "partly_cloudy"] },
    desert: { temp: [25, 45], humidity: [10, 30], conditions: ["sunny", "sunny", "partly_cloudy"] },
  };

  // Map destinations to patterns
  const destinationPatterns = {
    goa: "beach",
    maldives: "beach",
    bali: "tropical",
    kerala: "tropical",
    manali: "mountain",
    shimla: "mountain",
    dubai: "desert",
    jaipur: "desert",
    mumbai: "city",
    delhi: "city",
    rome: "city",
    florence: "city",
    venice: "city",
    singapore: "tropical",
  };

  const destKey = destination?.toLowerCase()?.split(",")[0]?.trim() || "city";
  const patternKey = destinationPatterns[destKey] || "city";
  const pattern = weatherPatterns[patternKey];

  // Generate weather for each day
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const randTemp = pattern.temp[0] + Math.random() * (pattern.temp[1] - pattern.temp[0]);
    const randHumidity = pattern.humidity[0] + Math.random() * (pattern.humidity[1] - pattern.humidity[0]);
    const condition = pattern.conditions[Math.floor(Math.random() * pattern.conditions.length)];

    days.push({
      date: new Date(currentDate).toISOString().split("T")[0],
      temp: Math.round(randTemp),
      tempMin: Math.round(randTemp - 3 - Math.random() * 3),
      tempMax: Math.round(randTemp + 2 + Math.random() * 3),
      humidity: Math.round(randHumidity),
      condition,
      windSpeed: Math.round(5 + Math.random() * 15),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};

const conditionIcons = {
  sunny: Sun,
  partly_cloudy: Cloud,
  cloudy: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
};

const conditionLabels = {
  sunny: "Sunny",
  partly_cloudy: "Partly Cloudy",
  cloudy: "Cloudy",
  rain: "Rainy",
  snow: "Snowy",
};

const conditionColors = {
  sunny: "text-accent-orange",
  partly_cloudy: "text-secondary",
  cloudy: "text-muted-foreground",
  rain: "text-secondary",
  snow: "text-secondary",
};

export const WeatherWidget = ({ trip }) => {
  const weather = useMemo(() => {
    const destination = trip?.destinations?.[0] || trip?.destination;
    return generateMockWeather(destination, trip?.startDate, trip?.endDate);
  }, [trip]);

  if (!weather || weather.length === 0) return null;

  // Get average/summary weather
  const avgTemp = Math.round(weather.reduce((sum, d) => sum + d.temp, 0) / weather.length);
  const primaryCondition = weather[0]?.condition || "sunny";
  const WeatherIcon = conditionIcons[primaryCondition] || Sun;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-xl border border-border"
    >
      <div className={`${conditionColors[primaryCondition]}`}>
        <WeatherIcon className="w-8 h-8" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{avgTemp}°C</span>
          <span className="text-sm text-muted-foreground">
            {conditionLabels[primaryCondition]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Expected weather during your trip
        </p>
      </div>
    </motion.div>
  );
};

// Compact weather for day in itinerary
export const DayWeather = ({ date, destination }) => {
  const weather = useMemo(() => {
    const days = generateMockWeather(destination, date, date);
    return days[0];
  }, [date, destination]);

  if (!weather) return null;

  const WeatherIcon = conditionIcons[weather.condition] || Sun;

  return (
    <div className="flex items-center gap-2 text-sm">
      <WeatherIcon className={`w-4 h-4 ${conditionColors[weather.condition]}`} />
      <span className="font-medium">{weather.temp}°C</span>
      <span className="text-muted-foreground hidden sm:inline">
        {conditionLabels[weather.condition]}
      </span>
    </div>
  );
};

// Detailed weather forecast component
export const WeatherForecast = ({ trip }) => {
  const weather = useMemo(() => {
    const destination = trip?.destinations?.[0] || trip?.destination;
    return generateMockWeather(destination, trip?.startDate, trip?.endDate);
  }, [trip]);

  if (!weather || weather.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 text-center">
        <Cloud className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">No weather data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      {/* <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
        <Thermometer className="w-5 h-5 text-primary" />
        Weather Forecast
      </h3> */}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {weather.slice(0, 7).map((day, index) => {
          const WeatherIcon = conditionIcons[day.condition] || Sun;
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
          const dayNum = date.getDate();

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-muted/50 rounded-xl p-3 text-center hover:bg-muted transition-colors"
            >
              {/* <p className="text-xs text-muted-foreground mb-1">{dayName}</p>
              <p className="font-semibold mb-2">{dayNum}</p>
              <WeatherIcon className={`w-8 h-8 mx-auto mb-2 ${conditionColors[day.condition]}`} />
              <p className="font-semibold">{day.temp}°C</p>
              <p className="text-xs text-muted-foreground">
                {day.tempMin}° / {day.tempMax}°
              </p> */}
              {/* <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                <Droplets className="w-3 h-3" />
                {day.humidity}%
              </div> */}
            </motion.div>
          );
        })}
      </div>

      {weather.length > 7 && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          Showing forecast for first 7 days of your {weather.length}-day trip
        </p>
      )}
    </div>
  );
};

export default WeatherWidget;
