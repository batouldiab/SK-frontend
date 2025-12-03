import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';

import MapView from '../components/MapView';
import ControlsPanel from '../components/ControlsPanel';
import InfoBox from '../components/InfoBox';
import SkillsPanel from '../components/SkillsPanel';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// import utility functions
import { normcase, cleanString } from '../utils/stringUtils';
import { safeParseInt, safeParseFloat } from '../utils/ParseUtils';
import haversineKm from '../utils/haversineKm';

// ============================================
// DATA LOADING FUNCTIONS
// ============================================

const loadCentersData = async () => {
  try {
    const response = await fetch('/data/grouped_country_with_desc_updated_aggregated_clustered.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const centersData = {};
    
    workbook.SheetNames.forEach(sheetName => {
      if (sheetName === 'Unknown_Country') return;
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const centers = jsonData
        .map(row => {
          const centerLat = safeParseFloat(row['Center Latitude'] || row['Center_Latitude']);
          const centerLon = safeParseFloat(row['Center Longitude'] || row['Center_Longitude']);
          const centerCity = cleanString(row['Center_City']);
          
          if (!centerLat || !centerLon || !centerCity) return null;
          
          return {
            Sheet: sheetName,
            Center_City: centerCity,
            __City_norm__: normcase(centerCity),
            lat: centerLat,
            lon: centerLon,
            Radius_km_max: safeParseFloat(row['Radius_km_max'] || 0),
            Members_count: safeParseInt(row['Members_count'] || 0),
            Total_posts: safeParseInt(row['Total_posts'] || row['total_posts'] || 0),
            Members: String(row['Members'] || '')
          };
        })
        .filter(Boolean);
      
      if (centers.length > 0) {
        centersData[sheetName] = centers;
      }
    });
    
    return centersData;
  } catch (error) {
    console.error('Error loading centers data:', error);
    return {};
  }
};

const loadSkillsData = async () => {
  try {
    const response = await fetch('/data/cities_skills_with_desc_updated.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const skillsData = {};
    
    workbook.SheetNames.forEach(sheetName => {
      if (sheetName === 'Unknown_Country') return;
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const skills = jsonData
        .map(row => {
          const skill = cleanString(row['Skill']);
          const city = cleanString(row['City']);
          const lat = safeParseFloat(row['Latitude']);
          const lon = safeParseFloat(row['Longitude']);
          const count = safeParseInt(row['count'] || row['frequency'] || 0);
          
          if (!skill || !city || !lat || !lon) return null;
          
          return {
            Skill: skill,
            SkillType: cleanString(row['SkillType'] || row['Skill Type'] || row['Type'] || ''),
            City: city,
            __City_norm__: normcase(city),
            Latitude: lat,
            Longitude: lon,
            count: count
          };
        })
        .filter(Boolean);
      
      if (skills.length > 0) {
        skillsData[sheetName] = skills;
      }
    });
    
    return skillsData;
  } catch (error) {
    console.error('Error loading skills data:', error);
    return {};
  }
};

// ============================================
// MAIN CONTAINER COMPONENT
// ============================================

const CountryCitiesMap = () => {
  const [centersData, setCentersData] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [bubbleMode, setBubbleMode] = useState('Both');

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [centers, skills] = await Promise.all([
          loadCentersData(),
          loadSkillsData()
        ]);
        
        if (Object.keys(centers).length === 0) {
          throw new Error('No centers data loaded. Please check the Excel files.');
        }
        
        setCentersData(centers);
        setSkillsData(skills);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Compute countries list
  const countries = useMemo(() => {
    if (!centersData) return ['All'];
    return ['All', ...Object.keys(centersData).sort()];
  }, [centersData]);
  
  // Compute cities list
  const cities = useMemo(() => {
    if (selectedCountry === 'All' || !centersData || !centersData[selectedCountry]) {
      return ['All'];
    }
    return ['All', ...centersData[selectedCountry]
      .sort((a, b) => b.Total_posts - a.Total_posts)
      .map(c => c.Center_City)];
  }, [selectedCountry, centersData]);

  // Get current centers for map
  const currentCenters = useMemo(() => {
    if (!centersData) return [];
    if (selectedCountry === 'All') {
      return Object.values(centersData).flat();
    }
    return centersData[selectedCountry] || [];
  }, [selectedCountry, centersData]);

  // Get current skills for panel
  const currentSkills = useMemo(() => {
    if (!skillsData || !selectedCountry || selectedCountry === 'All') {
      return [];
    }
    
    const skills = skillsData[selectedCountry] || [];
    if (selectedCity === 'All') return skills;
    
    const selectedCityNorm = normcase(selectedCity);
    const centerData = centersData[selectedCountry]?.find(
      c => normcase(c.Center_City) === selectedCityNorm
    );
    
    if (!centerData) {
      return skills.filter(s => s.__City_norm__ === selectedCityNorm);
    }
    
    const radius = centerData.Radius_km_max;
    const citiesInRadius = new Set();
    
    skills.forEach(skill => {
      const distance = haversineKm(
        centerData.lat,
        centerData.lon,
        skill.Latitude,
        skill.Longitude
      );
      if (distance <= radius) {
        citiesInRadius.add(skill.__City_norm__);
      }
    });
    
    return skills.filter(s => citiesInRadius.has(s.__City_norm__));
  }, [selectedCountry, selectedCity, skillsData, centersData]);

  // Compute radius range
  const radiusRange = useMemo(() => {
    if (selectedCountry === 'All') {
      return { min: 10000, max: 300000 };
    }
    return { min: 1000, max: 10000 };
  }, [selectedCountry]);

  // Event handlers
  const handleCityClick = (center) => {
    if (center.Sheet !== selectedCountry) {
      setSelectedCountry(center.Sheet);
    }
    setSelectedCity(center.Center_City);
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCity('All');
  };

  // Render states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!centersData) return <ErrorMessage message="No data available" />;

  return (
    <div className="page-grid">
      <PageHeader />

      <div className="page-panel panel-grid">
        <ControlsPanel
          countries={countries}
          cities={cities}
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          bubbleMode={bubbleMode}
          onCountryChange={handleCountryChange}
          onCityChange={setSelectedCity}
          onBubbleModeChange={setBubbleMode}
        />

        <InfoBox minRadius={radiusRange.min} maxRadius={radiusRange.max} />
      </div>

      <div className="page-panel">
        <MapView
          centers={currentCenters}
          selectedCity={selectedCity}
          onCityClick={handleCityClick}
          bubbleMode={bubbleMode}
          minRadius={radiusRange.min}
          maxRadius={radiusRange.max}
        />
      </div>

      {selectedCountry !== 'All' && selectedCity !== 'All' && currentSkills.length > 0 && (
        <div className="page-panel">
          <SkillsPanel
            skills={currentSkills}
            country={selectedCountry}
            city={selectedCity}
            scope={`Aggregated within ${currentCenters.find(c => normcase(c.Center_City) === normcase(selectedCity))?.Radius_km_max || 0} km`}
          />
        </div>
      )}
    </div>
  );
};

export default CountryCitiesMap;
