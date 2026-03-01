import { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Plane, Home, Coffee, Truck } from "lucide-react";
import { formatTime } from "../../utils/helpers";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom colored markers for different item types
const createColoredIcon = (color) => new Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const markerColors = {
  flight: "blue",
  hotel: "violet",
  activity: "green",
  transport: "orange",
  food: "red",
  other: "grey",
};

// Destination coordinates lookup
const destinationCoords = {
  rome: { lat: 41.9028, lng: 12.4964 },
  florence: { lat: 43.7696, lng: 11.2558 },
  venice: { lat: 45.4408, lng: 12.3155 },
  italy: { lat: 41.8719, lng: 12.5674 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.209 },
  goa: { lat: 15.2993, lng: 74.124 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  kerala: { lat: 10.8505, lng: 76.2711 },
  manali: { lat: 32.2396, lng: 77.1887 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  bali: { lat: -8.4095, lng: 115.1889 },
  maldives: { lat: 3.2028, lng: 73.2207 },
  agra: { lat: 27.1767, lng: 78.0081 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  chennai: { lat: 13.0827, lng: 80.2707 },
};

// Helper to get coordinates for a location
const getCoordinates = (location) => {
  if (!location) return null;
  const key = location.toLowerCase().split(",")[0].trim();
  return destinationCoords[key] || null;
};

// Component to fit map bounds
const FitBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = markers.map(m => [m.lat, m.lng]);
      if (bounds.length === 1) {
        map.setView(bounds[0], 12);
      } else {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [markers, map]);

  return null;
};

const TripMapView = ({ trip, itinerary = [] }) => {
  // Extract all locations from itinerary and destinations
  const markers = useMemo(() => {
    const result = [];

    // Add destination markers
    const destinations = trip?.destinations || [trip?.destination];
    destinations.forEach((dest, index) => {
      const coords = getCoordinates(dest);
      if (coords) {
        result.push({
          id: `dest-${index}`,
          type: "destination",
          name: dest,
          ...coords,
        });
      }
    });

    // Add itinerary item markers
    itinerary.forEach((day, dayIndex) => {
      (day.items || []).forEach((item, itemIndex) => {
        const coords = item.coordinates || getCoordinates(item.location);
        if (coords) {
          result.push({
            id: item.id || `item-${dayIndex}-${itemIndex}`,
            type: item.type || "other",
            name: item.title,
            location: item.location,
            time: item.time || item.startTime,
            day: day.day || dayIndex + 1,
            ...coords,
          });
        }
      });
    });

    return result;
  }, [trip, itinerary]);

  // Create route path
  const routePath = useMemo(() => {
    return markers
      .filter(m => m.lat && m.lng)
      .map(m => [m.lat, m.lng]);
  }, [markers]);

  // Default center (India)
  const defaultCenter = { lat: 20.5937, lng: 78.9629 };
  const center = markers.length > 0 
    ? { lat: markers[0].lat, lng: markers[0].lng }
    : defaultCenter;

  const typeIcons = {
    flight: Plane,
    hotel: Home,
    activity: MapPin,
    transport: Truck,
    food: Coffee,
    destination: Navigation,
  };

  if (markers.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No locations to display</h3>
        <p className="text-muted-foreground">
          Add itinerary items with locations to see them on the map.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(markerColors).map(([type, color]) => {
          const Icon = typeIcons[type] || MapPin;
          return (
            <div key={type} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color === "violet" ? "#8B5CF6" : color }}
              />
              <span className="capitalize">{type}</span>
            </div>
          );
        })}
      </div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl overflow-hidden border border-border"
        style={{ height: "500px" }}
      >
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds markers={markers} />

          {/* Route Line */}
          {routePath.length > 1 && (
            <Polyline
              positions={routePath}
              color="#FF385C"
              weight={3}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}

          {/* Markers */}
          {markers.map((marker) => {
            const color = markerColors[marker.type] || markerColors.other;
            const Icon = typeIcons[marker.type] || MapPin;

            return (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={createColoredIcon(color)}
              >
                <Popup>
                  <div className="min-w-[150px]">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{marker.name}</span>
                    </div>
                    {marker.location && (
                      <p className="text-sm text-muted-foreground">{marker.location}</p>
                    )}
                    {marker.day && (
                      <p className="text-xs text-muted-foreground mt-1">Day {marker.day}</p>
                    )}
                    {marker.time && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(marker.time)}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </motion.div>

      {/* Locations List */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" />
          Route Overview
        </h4>
        <div className="space-y-2">
          {markers.map((marker, index) => {
            const Icon = typeIcons[marker.type] || MapPin;
            return (
              <div key={marker.id} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  {index < markers.length - 1 && (
                    <div className="w-0.5 h-4 bg-border" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{marker.name}</p>
                  {marker.location && (
                    <p className="text-xs text-muted-foreground">{marker.location}</p>
                  )}
                </div>
                {marker.day && (
                  <span className="text-xs text-muted-foreground">Day {marker.day}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripMapView;
