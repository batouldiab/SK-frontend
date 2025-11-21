import React, { useMemo } from "react";
import { MapPin } from "lucide-react";
import { normcase } from "../utils/stringUtils";
import { scaleRadiusBySum } from "../utils/scaleUtils"

// Map View Component
const MapView = ({ centers, selectedCity, onCityClick, bubbleMode, minRadius, maxRadius }) => {
  const totalPosts = useMemo(() => 
    centers.reduce((sum, c) => sum + c.Total_posts, 0),
    [centers]
  );

  const centersWithRadii = useMemo(() => {
    const redRadii = scaleRadiusBySum(
      centers.map(c => c.Total_posts),
      totalPosts,
      minRadius,
      maxRadius
    );

    return centers.map((center, idx) => ({
      ...center,
      redRadius: redRadii[idx],
      greenRadius: center.Radius_km_max * 1000,
      isSelected: selectedCity && normcase(center.Center_City) === normcase(selectedCity)
    }));
  }, [centers, totalPosts, minRadius, maxRadius, selectedCity]);

  return (
    <div className="relative w-full h-[520px] bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Map Visualization</p>
          <p className="text-sm mt-2">In production, this would render using DeckGL</p>
          <p className="text-xs mt-4 max-w-md">
            {centersWithRadii.length} cities loaded • Bubble mode: {bubbleMode}
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg max-h-48 overflow-y-auto">
        <p className="text-xs font-semibold mb-2 text-gray-700">Cities ({centersWithRadii.length})</p>
        {centersWithRadii.slice(0, 10).map((center, idx) => (
          <div
            key={idx}
            onClick={() => onCityClick(center)}
            className={`text-xs py-1 px-2 mb-1 rounded cursor-pointer transition-colors ${
              center.isSelected 
                ? 'bg-blue-100 text-blue-800 font-medium' 
                : 'hover:bg-gray-100'
            }`}
          >
            {center.Center_City} • {center.Total_posts} posts
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;