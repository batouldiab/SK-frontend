# ESCWA Skills Monitor - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Application Flow](#application-flow)
5. [Component Architecture](#component-architecture)
6. [Data Management](#data-management)
7. [Routing System](#routing-system)
8. [Theming System](#theming-system)
9. [Chart Components](#chart-components)
10. [Development Setup](#development-setup)
11. [Build & Deployment](#build--deployment)
12. [Performance Considerations](#performance-considerations)
13. [Security Considerations](#security-considerations)
14. [API Reference](#api-reference)
15. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

The ESCWA Skills Monitor is a single-page application (SPA) built with React 19, utilizing a modern component-based architecture with client-side routing and data visualization capabilities.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
├─────────────────────────────────────────────────────────┤
│  React 19 + React Router                                │
│  ├─ DefaultLayout (Theme Provider)                      │
│  ├─ AppRoutes (Route Configuration)                     │
│  └─ Pages                                               │
│      ├─ CountryCitiesMap (Streamlit Embed)             │
│      ├─ GreenOverview (Charts)                          │
│      ├─ GreenOccupations (Data Viz)                     │
│      ├─ GreenInEnergySector (Multi-Section)             │
│      └─ Benchmarking (Interactive Comparison)           │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                             │
│  ├─ CSV Files (Public Directory)                        │
│  ├─ Excel Files (XLSX format)                           │
│  └─ Streamlit External Service                          │
└─────────────────────────────────────────────────────────┘
```

### Design Patterns

- **Component-Based Architecture**: Modular, reusable components
- **Container/Presentational Pattern**: Pages (containers) manage state, components handle presentation
- **Layout Pattern**: DefaultLayout wrapper provides consistent UI shell
- **Dynamic Theming**: CSS variables driven by route context
- **Data Fetching**: Client-side fetch with async/await
- **Error Boundaries**: Loading and error states for data components

---

## Technology Stack

### Core Framework
- **React**: `19.1.1` - Modern UI library with latest features
- **React DOM**: `19.1.1` - DOM-specific methods
- **React Router DOM**: `7.9.5` - Client-side routing

### Build Tools
- **Vite**: `rolldown-vite@7.1.14` - Ultra-fast bundler and dev server
  - Using Rolldown variant for enhanced performance
- **@vitejs/plugin-react**: `5.0.4` - React Fast Refresh support

### UI Libraries
- **PrimeReact**: `10.9.7` - Comprehensive component library
  - Theme: `saga-blue`
  - Icons: PrimeIcons `7.0.0`
- **Tailwind CSS**: `4.1.16` - Utility-first CSS framework
  - Plugin: `@tailwindcss/vite` `4.1.16`
- **Lucide React**: `0.554.0` - Icon library

### Data Visualization
- **AG Charts React**: `12.3.1` - Advanced charting library
  - Community Edition: `ag-charts-community` `12.3.1`
  - Enterprise Edition: `ag-charts-enterprise` `12.3.1`
- **Chart.js**: `4.5.1` - Flexible charting library

### Data Processing
- **PapaParse**: `5.5.3` - CSV parsing library
- **XLSX**: `0.18.5` - Excel file parsing
- **Hyparquet**: `1.20.2` - Parquet file support

### State Management
- **React Redux**: `9.2.0` - State management (currently commented out)

### Development Tools
- **ESLint**: `9.36.0` - Linting
  - Plugin: `eslint-plugin-react-hooks` `5.2.0`
  - Plugin: `eslint-plugin-react-refresh` `0.4.22`
- **TypeScript Types**: Type definitions for React

---

## Project Structure

```
skillsmonitoradditional/
├── public/
│   ├── data/                          # Static data files
│   │   ├── green_fig1.csv             # Green jobs timeline
│   │   ├── green_fig2.csv             # Green jobs overview
│   │   ├── green_fig3.csv             # Green occupations
│   │   ├── green_fig4.csv             # Additional occupations
│   │   ├── green_fig6.csv             # Energy sector data
│   │   ├── green_fig7.csv             # Energy details
│   │   ├── green_fig8.csv             # O&G breakdown
│   │   ├── green_fig9.csv             # Geographic distribution
│   │   ├── benchmarking_fig1_2.csv    # Occupational demand
│   │   ├── benchmarking_fig3_5.csv    # Skill metrics
│   │   ├── benchmarking_fig4_5.csv    # Additional data
│   │   ├── benchmarking_fig6_*.csv    # Country-specific (22 files)
│   │   ├── benchmarking_fig7.csv      # Comparative analysis
│   │   └── benchmarking_fig8_9.csv    # Hierarchy patterns
│   └── vite.svg
│
├── src/
│   ├── components/                    # Reusable components
│   │   ├── BenchmarkingFig1Fig2.jsx   # Occupational demand radar
│   │   ├── BenchmarkingFig3.jsx       # Soft skill comparison
│   │   ├── BenchmarkingFig4.jsx       # Hard skill comparison
│   │   ├── BenchmarkingFig5_1.jsx     # Soft skill categories
│   │   ├── BenchmarkingFig5_2.jsx     # Hard skill categories
│   │   ├── BenchmarkingFig6.jsx       # Shared skill job titles
│   │   ├── BenchmarkingFig8.jsx       # Hierarchy distribution
│   │   ├── ControlsPanel.jsx          # Filter controls
│   │   ├── Dropdown.jsx               # Custom dropdown
│   │   ├── ErrorMessage.jsx           # Error UI
│   │   ├── GreenFig1.jsx              # Green jobs timeline chart
│   │   ├── GreenFig2.jsx              # Green jobs overview chart
│   │   ├── GreenFig3.jsx              # Occupation breakdown
│   │   ├── GreenFig4.jsx              # Additional occupations
│   │   ├── GreenFig6.jsx              # Energy sector chart
│   │   ├── GreenFig7.jsx              # Energy details
│   │   ├── GreenFig8.jsx              # O&G breakdown
│   │   ├── GreenFig9.jsx              # Geographic chart
│   │   ├── InfoBox.jsx                # Information panels
│   │   ├── LoadingSpinner.jsx         # Loading UI
│   │   ├── MapView.jsx                # Map component
│   │   ├── PageHeader.jsx             # Page header component
│   │   ├── ParquetReaderComponent.jsx # Parquet data reader
│   │   ├── ProtectedRoute.jsx         # Route guards
│   │   ├── SkillCategory.jsx          # Skill categorization
│   │   ├── SkillItem.jsx              # Individual skill display
│   │   ├── SkillsPanel.jsx            # Skills panel container
│   │   └── StreamlitMap.jsx           # Streamlit iframe embed
│   │
│   ├── layouts/
│   │   └── DefaultLayout.jsx          # Main layout wrapper
│   │
│   ├── pages/                         # Route pages
│   │   ├── Benchmarking.jsx           # Benchmarking dashboard
│   │   ├── BenchmarkingOccupationalDemands.jsx  # Legacy page
│   │   ├── BenchmarkingOccupationalPattern.jsx  # Legacy page
│   │   ├── BenchmarSkillSimilarity.jsx          # Legacy page
│   │   ├── CountryCitiesMap.jsx       # Map page (Streamlit)
│   │   ├── GreenInEnergySector.jsx    # Energy sector page
│   │   ├── GreenOccupations.jsx       # Occupations page
│   │   └── GreenOverview.jsx          # Green jobs overview
│   │
│   ├── store/
│   │   └── store.jsx                  # Redux store (unused)
│   │
│   ├── utils/
│   │   ├── haversineKm.jsx            # Distance calculation
│   │   ├── ParseUtils.jsx             # Safe parsing utilities
│   │   ├── scaleUtils.jsx             # Scaling utilities
│   │   └── stringUtils.jsx            # String manipulation
│   │
│   ├── App.css                        # Application styles
│   ├── App.jsx                        # Root component
│   ├── AppRoutes.jsx                  # Route configuration
│   ├── index.css                      # Global styles
│   └── main.jsx                       # Application entry point
│
├── .gitignore
├── eslint.config.js                   # ESLint configuration
├── package.json                       # Dependencies
├── README.md                          # Project README
├── TECHNICAL_DOCUMENTATION.md         # This file
├── USER_GUIDE.md                      # User documentation
└── vite.config.js                     # Vite configuration
```

---

## Application Flow

### 1. Application Initialization

**Entry Point**: [src/main.jsx](src/main.jsx)

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

**Flow**:
1. React creates root element
2. Wraps app in StrictMode for development checks
3. Initializes BrowserRouter for client-side routing
4. Renders App component

### 2. App Component

**File**: [src/App.jsx](src/App.jsx:11-17)

```jsx
function App() {
  return <AppRoutes />;
}
```

- Simple pass-through to routing layer
- Redux Provider commented out (future state management)

### 3. Routing Layer

**File**: [src/AppRoutes.jsx](src/AppRoutes.jsx:9-24)

Defines application routes:
- All routes wrapped in `DefaultLayout`
- Legacy routes redirect to consolidated pages
- 404 redirects to home

### 4. Layout System

**File**: [src/layouts/DefaultLayout.jsx](src/layouts/DefaultLayout.jsx:38-167)

**Responsibilities**:
- Route-based theming
- Header and navigation
- Content container
- Theme variable injection

---

## Component Architecture

### Layout Components

#### DefaultLayout
**Location**: [src/layouts/DefaultLayout.jsx](src/layouts/DefaultLayout.jsx)

**Features**:
- Dynamic theming based on route
- Sticky header with branding
- PrimeReact Menubar integration
- CSS custom properties for theme tokens
- Responsive design

**Theme Tokens**:
```javascript
{
  purple: { /* Jobs/Home theme */ },
  green: { /* Green Jobs theme */ },
  blue: { /* Benchmarking theme */ }
}
```

**Theme Detection Logic**:
```javascript
const isGreenRoute = path.includes("green");
const isBenchmarkingRoute = path.includes("bench");
const themeKey = isGreenRoute ? "green" : isBenchmarkingRoute ? "blue" : "purple";
```

### Page Components

#### 1. CountryCitiesMap
**Location**: [src/pages/CountryCitiesMap.jsx](src/pages/CountryCitiesMap.jsx)

Embeds Streamlit application via iframe:
- **Streamlit URL**: `https://cities-skills-v2.streamlit.app/?embed=true`
- Full-screen iframe
- External data visualization

#### 2. GreenOverview
**Location**: [src/pages/GreenOverview.jsx](src/pages/GreenOverview.jsx)

Displays two main charts:
- `<GreenFig1 />` - Timeline of green jobs percentage
- `<GreenFig2 />` - Overview metrics

#### 3. GreenOccupations
**Location**: [src/pages/GreenOccupations.jsx](src/pages/GreenOccupations.jsx)

Shows occupation breakdown:
- `<GreenFig3 />` - Primary occupations
- `<GreenFig4 />` - Additional occupations

#### 4. GreenInEnergySector
**Location**: [src/pages/GreenInEnergySector.jsx](src/pages/GreenInEnergySector.jsx)

Multi-section energy analysis:
- Section 1: Green occupations in energy
  - `<GreenFig6 />` - Energy sector trends
  - `<GreenFig7 />` - Detailed breakdowns
- Section 2: Oil & Gas focus
  - `<GreenFig8 />` - O&G green jobs
  - `<GreenFig9 />` - Geographic distribution

#### 5. Benchmarking
**Location**: [src/pages/Benchmarking.jsx](src/pages/Benchmarking.jsx:38-485)

**State Management**:
```javascript
const [selectedCountries, setSelectedCountries] = useState([DEFAULT_COUNTRY]);
```

**Features**:
- Country selection (max 3, US locked)
- 7 analytical sections
- Dynamic chart updates based on selection

**Sections**:
1. Occupational Demand (`BenchmarkingFig1Fig2`)
2. Hard Skill Mix (`BenchmarkingFig5_2`)
3. Hard Skill Similarity (`BenchmarkingFig4`)
4. Soft Skill Mix (`BenchmarkingFig5_1`)
5. Soft Skill Similarity (`BenchmarkingFig3`)
6. Seniority Pattern (`BenchmarkingFig8`)
7. Shared Skill Job Titles (`BenchmarkingFig6`)

### Chart Components

All chart components follow a similar pattern:

**Common Pattern** (Example: [GreenFig1.jsx](src/components/GreenFig1.jsx:5-198)):

```javascript
const Component = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCsv = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/filename.csv");
        const text = await response.text();
        // Parse CSV
        // Transform data
        // Set chart config
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCsv();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  return <Chart data={chartData} options={chartOptions} />;
};
```

**Chart Libraries Used**:
- **Chart.js** (via PrimeReact): `GreenFig1`, `GreenFig2`
- **AG Charts**: Most benchmarking components

---

## Data Management

### Data Sources

#### 1. CSV Files (Static)
**Location**: `/public/data/*.csv`

**Format**: Tab-delimited or comma-separated

**Loading Pattern**:
```javascript
const response = await fetch("/data/green_fig1.csv");
const text = await response.text();

// Delimiter detection
const delimiter = headerLine.includes("\t") ? "\t"
  : headerLine.includes(";") ? ";" : ",";

const rows = text.trim().split(/\r?\n/);
```

**Data Files**:

**Green Jobs**:
- `green_fig1.csv` - Year, Count, Total, Percentage
- `green_fig2.csv` - Aggregate metrics
- `green_fig3.csv` - Occupation, Green%, Non-Green%
- `green_fig4.csv` - Extended occupations
- `green_fig6.csv` - Energy sector time series
- `green_fig7.csv` - Energy details
- `green_fig8.csv` - O&G breakdown
- `green_fig9.csv` - Country, Green Job Count

**Benchmarking**:
- `benchmarking_fig1_2.csv` - Country, Occupation, Count, Standardized%
- `benchmarking_fig3_5.csv` - Skill similarity metrics
- `benchmarking_fig4_5.csv` - Skill data
- `benchmarking_fig6_<country>.csv` - 22 country-specific files
- `benchmarking_fig7.csv` - Comparative data
- `benchmarking_fig8_9.csv` - Hierarchy levels

#### 2. Excel Files (XLSX)
**Location**: `/public/data/*.xlsx`

**Files**:
- `grouped_country_with_desc_updated_aggregated_clustered.xlsx`
  - Geographic centers (city coordinates, radius)
- `cities_skills_with_desc_updated.xlsx`
  - Skills by city

**Library**: `xlsx` package

#### 3. External Services
**Streamlit App**: `https://cities-skills-v2.streamlit.app/`

### Data Parsing Utilities

**File**: [src/utils/ParseUtils.jsx](src/utils/ParseUtils.jsx:1-10)

```javascript
const safeParseInt = (val) => {
  if (typeof val === 'number') return Math.floor(val);
  const parsed = parseInt(String(val).replace(/[^\d]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

const safeParseFloat = (val) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};
```

**Usage**: Ensures robust parsing with fallbacks

### Data Transformation

**Standardization**:
- Job counts normalized to "per 1,000" or "per 100" for fair comparison
- Percentage calculations for green job shares
- Year filtering (2021-2025 range)

**Example** (from GreenFig1):
```javascript
// Filter year range
if (parseInt(year, 10) < 2021 || parseInt(year, 10) > 2025) return;

// Parse percentage with locale handling
const percentage = parseFloat(cols[3].toString().replace(",", "."));
```

---

## Routing System

### Route Configuration

**File**: [src/AppRoutes.jsx](src/AppRoutes.jsx:9-24)

```jsx
<Routes>
  <Route element={<DefaultLayout />}>
    <Route path="/" element={<CountryCitiesMap />} />
    <Route path="greenOverview" element={<GreenOverview />} />
    <Route path="greenOccupations" element={<GreenOccupations />} />
    <Route path="greenInEnergySector" element={<GreenInEnergySector />} />
    <Route path="benchmarking" element={<Benchmarking />} />

    {/* Legacy redirects */}
    <Route path="benchmarkingOccupationalDemands" element={<Navigate to="/benchmarking" replace />} />
    <Route path="benchmarSkillSimilarity" element={<Navigate to="/benchmarking" replace />} />
    <Route path="benchmarkingOccupationalPattern" element={<Navigate to="/benchmarking" replace />} />
  </Route>
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### Navigation

**Menu Structure** (from DefaultLayout):
```javascript
const menuItems = [
  {
    label: "Jobs Across ESCWA Countries",
    icon: "pi pi-fw pi-globe",
    command: () => navigate("/")
  },
  {
    label: "Green Jobs",
    icon: "pi pi-fw pi-leaf",
    items: [
      { label: "Overview in Arab Region", command: () => navigate("/greenOverview") },
      { label: "Explore Green Occupations", command: () => navigate("/greenOccupations") },
      { label: "Green Jobs in Energy Sector", command: () => navigate("/greenInEnergySector") }
    ]
  },
  {
    label: "Benchmarking",
    icon: "pi pi-fw pi-sliders-h",
    command: () => navigate("/benchmarking")
  }
];
```

### Route Guards

**File**: [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx)
- Currently not in use
- Available for future authentication

---

## Theming System

### CSS Custom Properties

**Global Styles**: [src/index.css](src/index.css:4-23)

```css
:root {
  --theme-accent: #7c3aed;
  --theme-accent-strong: #5b21b6;
  --theme-accent-soft: #f3e8ff;
  --theme-ink: #0f172a;
  --theme-muted: #475569;
  --theme-surface: rgba(255, 255, 255, 0.88);
  --theme-surface-border: rgba(255, 255, 255, 0.6);
  --theme-shadow-soft: 0 18px 60px rgba(15, 23, 42, 0.14);
}
```

### Dynamic Theme Injection

**Location**: [DefaultLayout.jsx](src/layouts/DefaultLayout.jsx:94-103)

```jsx
<div
  className={`theme-shell theme-${themeKey}`}
  style={{
    "--theme-accent": theme.accent,
    "--theme-accent-strong": theme.accentStrong,
    "--theme-accent-soft": theme.accentSoft,
    "--theme-surface": theme.surface,
    "--theme-surface-border": theme.surfaceBorder,
    "--theme-shadow-soft": theme.shadow,
    "--theme-veil-from": theme.veilFrom,
    "--theme-veil-to": theme.veilTo
  }}
>
```

### Theme Tokens

```javascript
const themeTokens = {
  purple: {
    accent: "#8b5cf6",
    accentStrong: "#6d28d9",
    accentSoft: "rgba(139, 92, 246, 0.14)",
    // ... more tokens
  },
  green: {
    accent: "#0ea36d",
    accentStrong: "#047857",
    // ... more tokens
  },
  blue: {
    accent: "#0ea5e9",
    accentStrong: "#0369a1",
    // ... more tokens
  }
};
```

### Tailwind CSS Integration

**Configuration**: Tailwind 4.x with Vite plugin

**Usage**:
- Utility classes for layout: `flex`, `grid`, `gap-*`
- Responsive modifiers: `md:`, `lg:`
- Dark mode support: `dark:`
- Custom classes in `@layer components`

---

## Chart Components

### Chart.js Implementation

**Example**: [GreenFig1.jsx](src/components/GreenFig1.jsx)

**Configuration**:
```javascript
const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: { color: textColor }
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y.toFixed(2)}%`
      }
    }
  },
  scales: {
    x: {
      ticks: { color: textColorSecondary },
      grid: { color: surfaceBorder }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: textColorSecondary,
        callback: (value) => value + "%"
      },
      title: {
        display: true,
        text: "Percentage of Green Jobs"
      }
    }
  }
};
```

### AG Charts Implementation

**Features**:
- Interactive tooltips
- Legend controls
- Responsive sizing
- Theme integration
- Data updates via props

**Common Props**:
```javascript
<AgCharts
  options={{
    data: chartData,
    series: [...],
    axes: [...],
    legend: { enabled: true },
    theme: 'ag-default'
  }}
/>
```

### Chart Patterns

**Radar Charts**: Benchmarking skill distributions
**Line Charts**: Time series (green jobs trends)
**Bar Charts**: Comparative metrics (country comparisons)
**Heatmaps**: Skill similarity matrices

---

## Development Setup

### Prerequisites

- **Node.js**: v18+ recommended
- **npm**: v9+ or equivalent package manager
- **Git**: For version control

### Installation

```bash
# Clone repository
git clone <repository-url>
cd skillsmonitoradditional

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Server

**Command**: `npm run dev`

**Features**:
- Hot Module Replacement (HMR)
- Fast refresh for React components
- Port: Default Vite port (usually 5173)

**Vite Configuration**: [vite.config.js](vite.config.js:6-14)
```javascript
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  preview: {
    allowedHosts: true,
    host: true
  }
})
```

### Available Scripts

```json
{
  "dev": "vite",              // Start dev server
  "build": "vite build",      // Production build
  "lint": "eslint .",         // Run linter
  "preview": "vite preview"   // Preview production build
}
```

---

## Build & Deployment

### Production Build

```bash
npm run build
```

**Output**: `dist/` directory

**Build Process**:
1. Vite bundles all JavaScript/JSX
2. Tailwind CSS processes utility classes
3. Assets optimized and hashed
4. HTML entry point generated

### Build Optimizations

- **Code Splitting**: Automatic by Vite
- **Tree Shaking**: Dead code elimination
- **Minification**: JavaScript and CSS
- **Asset Optimization**: Images, fonts

### Deployment

**Static Hosting Compatible**:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

**Configuration Needed**:
- SPA fallback to `index.html` for all routes
- CORS headers for Streamlit embed (if needed)

**Example Netlify Config** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

Currently no environment variables used. Future considerations:
- API endpoints
- Feature flags
- Analytics keys

---

## Performance Considerations

### Bundle Size Optimization

**Current Bundle**:
- PrimeReact (comprehensive but large)
- AG Charts (enterprise features)
- Chart.js (lightweight alternative)

**Recommendations**:
1. **Code Splitting**:
   ```javascript
   const GreenOverview = lazy(() => import('./pages/GreenOverview'));
   ```

2. **Tree Shaking**: Import only used components
   ```javascript
   import { Menubar } from 'primereact/menubar'; // ✅
   // vs
   import * from 'primereact'; // ❌
   ```

3. **Dynamic Imports**: Load charts on demand

### Data Loading Optimization

**Current**: Fetch on component mount

**Issues**:
- Multiple CSV fetches
- No caching between route changes

**Improvements**:
1. **Data Caching**:
   ```javascript
   const dataCache = new Map();

   const fetchCached = async (url) => {
     if (dataCache.has(url)) return dataCache.get(url);
     const data = await fetch(url).then(r => r.text());
     dataCache.set(url, data);
     return data;
   };
   ```

2. **Prefetching**: Load data before route transition

3. **Service Worker**: Cache CSV files offline

### Render Optimization

**Current Optimizations**:
- `useMemo` for menu items in DefaultLayout
- Component-level loading states

**Additional Opportunities**:
1. **React.memo**: Prevent unnecessary re-renders
   ```javascript
   export default React.memo(GreenFig1);
   ```

2. **Virtual Scrolling**: For large data tables

3. **Debouncing**: Country selection changes

---

## Security Considerations

### Content Security Policy (CSP)

**Current**: None implemented

**Recommendation**:
```html
<meta http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    frame-src https://cities-skills-v2.streamlit.app;
    connect-src 'self' https://cities-skills-v2.streamlit.app;
  "
>
```

### Data Validation

**Current**: [ParseUtils.jsx](src/utils/ParseUtils.jsx) provides safe parsing

**Additional Checks**:
```javascript
// Validate CSV structure
if (lines.length < 2) {
  throw new Error("CSV file appears to be empty");
}

// Validate data ranges
if (parseInt(year, 10) < 2021 || parseInt(year, 10) > 2025) return;
```

### Third-Party Dependencies

**Audit Regularly**:
```bash
npm audit
npm audit fix
```

**Critical Dependencies**:
- React (official package)
- PrimeReact (established library)
- AG Charts (commercial library)

### Iframe Security

**Streamlit Embed** ([StreamlitMap.jsx](src/components/StreamlitMap.jsx:44-51)):

**Current**:
```jsx
<iframe
  src={streamlitUrl}
  className="..."
  title="Streamlit App"
/>
```

**Security Attributes** (commented out):
```jsx
allow="camera; microphone; clipboard-write"
sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
```

**Recommendation**: Re-enable with minimal permissions

---

## API Reference

### Utility Functions

#### ParseUtils

**Location**: [src/utils/ParseUtils.jsx](src/utils/ParseUtils.jsx)

```javascript
import { safeParseInt, safeParseFloat } from './utils/ParseUtils';

// Convert to integer with fallback
const count = safeParseInt(value); // Returns 0 if NaN

// Convert to float with fallback
const percentage = safeParseFloat(value); // Returns 0 if NaN
```

#### scaleUtils

**Location**: [src/utils/scaleUtils.jsx](src/utils/scaleUtils.jsx)

Scale-related utilities for charts.

#### stringUtils

**Location**: [src/utils/stringUtils.jsx](src/utils/stringUtils.jsx)

String manipulation helpers.

#### haversineKm

**Location**: [src/utils/haversineKm.jsx](src/utils/haversineKm.jsx)

Calculate distance between geographic coordinates:
```javascript
import haversine from './utils/haversineKm';

const distance = haversine(lat1, lon1, lat2, lon2); // Returns km
```

### Component Props

#### Benchmarking Chart Components

**BenchmarkingFig1Fig2**:
```jsx
<BenchmarkingFig1Fig2 selectedCountries={["United States", "Egypt"]} />
```

**BenchmarkingFig3**:
```jsx
<BenchmarkingFig3 selectedCountries={countryArray} />
```

**Pattern**: All benchmarking components accept `selectedCountries` prop

### Chart Configuration Objects

**Chart.js Options**:
```javascript
{
  maintainAspectRatio: boolean,
  plugins: {
    legend: { display, position, labels },
    tooltip: { callbacks }
  },
  scales: {
    x: { ticks, grid },
    y: { beginAtZero, ticks, grid, title }
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. CSV Loading Errors

**Symptom**: "Error loading chart data: HTTP error! status: 404"

**Cause**: CSV file not found in `/public/data/`

**Solution**:
```bash
# Verify file exists
ls public/data/green_fig1.csv

# Check file name matches exactly
# CSV files are case-sensitive on Linux servers
```

#### 2. Chart Not Rendering

**Symptom**: Blank chart area, no errors

**Possible Causes**:
- Data parsing failed silently
- CSV delimiter mismatch
- Invalid data format

**Debug Steps**:
```javascript
// Add console logs in useEffect
console.log("Raw CSV:", text);
console.log("Parsed data:", chartData);
console.log("Chart options:", chartOptions);
```

#### 3. Streamlit Embed Not Loading

**Symptom**: Blank iframe or CORS errors

**Causes**:
- Streamlit app down
- CORS policy blocking
- Network firewall

**Solution**:
```javascript
// Check Streamlit URL directly
window.open('https://cities-skills-v2.streamlit.app/', '_blank');

// Update URL if moved
setStreamlitUrl('new-url');
```

#### 4. Build Failures

**Symptom**: `npm run build` fails

**Common Causes**:
- ESLint errors
- Missing dependencies
- Syntax errors

**Solution**:
```bash
# Check for linting issues
npm run lint

# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

#### 5. Slow Performance

**Symptoms**:
- Slow route transitions
- Chart loading delays
- High memory usage

**Solutions**:
- Implement data caching (see Performance section)
- Add loading skeletons
- Use React.memo for components
- Reduce bundle size

### Debug Mode

**Enable React DevTools**:
```bash
npm install -D @react-devtools/core
```

**Vite Debug**:
```bash
DEBUG=vite:* npm run dev
```

### Browser Compatibility

**Supported Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Unsupported**:
- Internet Explorer (ES6+ required)

**Polyfills**: None currently included

---

## Contributing

### Code Style

**ESLint Configuration**: [eslint.config.js](eslint.config.js)

**Rules**:
- React Hooks rules enforced
- React Refresh rules for HMR
- No unused variables

**Format**:
```bash
npm run lint
```

### Component Guidelines

1. **File Naming**: PascalCase for components (`GreenFig1.jsx`)
2. **Export**: Default export for components
3. **Props**: Destructure in function signature
4. **State**: Use hooks (useState, useEffect)
5. **Loading States**: Always handle loading and error states

**Template**:
```jsx
const MyComponent = ({ propA, propB }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{/* Component content */}</div>;
};

export default MyComponent;
```

### Git Workflow

**Branches**:
- `main` - Production code
- `dev` - Development branch
- Feature branches: `feature/description`

**Commits**: Descriptive messages
```bash
git commit -m "modified GreenFig9 (green energy sector chart) to include only countries in GCC"
```

---

## Roadmap

### Planned Features

1. **Authentication**: User login and role-based access
2. **Data Export**: Download charts as PNG/CSV
3. **Comparison Tool**: Save and compare country selections
4. **Real-time Updates**: WebSocket integration for live data
5. **Mobile Optimization**: Enhanced mobile UI
6. **Offline Mode**: Service worker for offline access
7. **Analytics**: User behavior tracking
8. **Multi-language**: i18n support (Arabic, English, French)

### Technical Debt

1. **Redux Integration**: Currently commented out, needs cleanup or removal
2. **Legacy Routes**: Three redirect routes can be removed
3. **Data Caching**: Implement global data cache
4. **Error Boundaries**: Add React error boundaries
5. **TypeScript Migration**: Convert JSX to TSX
6. **Testing**: Add unit and integration tests
7. **Accessibility**: WCAG 2.1 AA compliance
8. **Documentation**: JSDoc comments for components

---

## Version History

**Current Version**: 0.0.0

### Recent Changes (from Git Log)

- `cac091b` - Updated Streamlit app link
- `6e18520` - Modified key insights and notes on benchmarking
- `0bec4c2` - Added padding for legend of heatmap
- `83779e6` - Modified GreenFig9 to include only GCC countries
- `72c4c5d` - Fixed showing of levels on heatmap axis

---

## License

*License information not specified in package.json - project is marked as private*

---

## Contact & Support

For technical issues or questions:
- Check this documentation first
- Review the [User Guide](USER_GUIDE.md) for functional questions
- Create an issue in the project repository
- Contact the development team

---

## Appendix

### File Size Reference

**Large Data Files**:
- `cities_skills_with_desc_updated.xlsx` - Skills by city (size varies)
- `grouped_country_with_desc_updated_aggregated_clustered.xlsx` - Geographic data

### Country List

22 countries supported in benchmarking:
1. United States (locked baseline)
2. Algeria
3. Bahrain
4. Djibouti
5. Egypt
6. Iraq
7. Jordan
8. Kuwait
9. Lebanon
10. Libya
11. Mauritania
12. Morocco
13. Oman
14. Palestine
15. Qatar
16. Saudi Arabia
17. Somalia
18. Sudan
19. Syria
20. Tunisia
21. United Arab Emirates
22. Yemen

### External Dependencies

**PrimeReact Theme**: `saga-blue`
**Font**: Space Grotesk (Google Fonts)
**Streamlit App**: `https://cities-skills-v2.streamlit.app/`

---

**Document Version**: 1.0
**Last Updated**: December 2025
**Maintained By**: Development Team
