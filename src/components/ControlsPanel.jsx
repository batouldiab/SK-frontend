import React from "react";
import Dropdown from "./Dropdown";

// 2. Controls Panel Component
const ControlsPanel = ({ 
  countries, 
  cities, 
  selectedCountry, 
  selectedCity, 
  bubbleMode,
  onCountryChange,
  onCityChange,
  onBubbleModeChange
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <Dropdown
      label="Country"
      options={countries}
      value={selectedCountry}
      onChange={onCountryChange}
    />
    
    <Dropdown
      label="City (Center)"
      options={cities}
      value={selectedCity}
      onChange={onCityChange}
    />
    
    <Dropdown
      label="Bubbles to show"
      options={['Coverage only (green)', 'Posts only (red)', 'Both']}
      value={bubbleMode}
      onChange={onBubbleModeChange}
    />
  </div>
);
export default ControlsPanel;