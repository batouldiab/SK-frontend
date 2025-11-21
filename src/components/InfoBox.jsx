import React from "react";
import { Layers } from "lucide-react";

// 3. Info Box Component
const InfoBox = ({ minRadius, maxRadius }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
    <p className="font-semibold mb-2 flex items-center gap-2">
      <Layers className="w-4 h-4" />
      Bubble Sizing
    </p>
    <ul className="space-y-1 text-xs text-gray-700">
      <li><span className="font-medium text-red-600">Red core:</span> scaled by Total_posts within selected country</li>
      <li><span className="font-medium text-green-600">Green halo:</span> coverage area (Radius_km_max)</li>
      <li><span className="font-medium text-blue-600">Blue dots:</span> individual locations in cluster (when city selected)</li>
    </ul>
    <p className="mt-2 text-xs text-gray-600">
      Visual core radius range: {minRadius}m - {maxRadius}m
    </p>
  </div>
);
export default InfoBox;