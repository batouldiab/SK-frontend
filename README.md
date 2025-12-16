# ESCWA Skills Monitor

A data visualization and analysis platform for tracking employment trends, skills demand, and green job opportunities across the ESCWA region (Arab countries). This application provides region-wide labor intelligence through interactive dashboards and comparative analysis.

## Live Demo

**Deployed Application**: [https://skillsmonitorfigures.onrender.com](https://skillsmonitorfigures.onrender.com)

## Overview

The Skills Monitor includes three main sections:

### 1. Jobs Across ESCWA Countries
- Interactive map showing job distribution across ESCWA member countries
- Skills demand analysis by country and city
- Geographic visualization of employment centers

### 2. Green Jobs Analysis
- **Overview**: Timeline and distribution of green jobs in the Arab region (2021-2025)
- **Occupations**: Breakdown of green vs. non-green job classifications
- **Energy Sector**: Green job trends in energy industries, including Oil & Gas analysis

### 3. Benchmarking
- Compare labor markets across 22 countries (using US as reference)
- Occupational demand patterns
- Hard and soft skill similarity analysis
- Seniority and hierarchy patterns
- Shared skill job titles

## Features

- Interactive data visualizations using Chart.js and AG Charts
- CSV-based data processing for green jobs and benchmarking metrics
- Excel file support for geographic data
- Responsive design with Tailwind CSS
- Dynamic theming based on section (purple for jobs, green for green jobs, blue for benchmarking)

## Technology Stack

- **React** 19.1.1 - UI library
- **Vite** - Fast build tool and dev server
- **React Router** 7.9.5 - Client-side routing
- **PrimeReact** 10.9.7 - Component library
- **Tailwind CSS** 4.1.16 - Utility-first CSS
- **Chart.js** & **AG Charts** - Data visualization
- **PapaParse** - CSV parsing
- **XLSX** - Excel file parsing

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ or equivalent package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd skillsmonitoradditional

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173 (or the next available port)
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
skillsmonitoradditional/
├── public/data/           # CSV and Excel data files
├── src/
│   ├── components/        # Reusable components (charts, UI elements)
│   ├── layouts/          # Layout components (DefaultLayout)
│   ├── pages/            # Route pages
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Root component
│   ├── AppRoutes.jsx     # Route configuration
│   └── main.jsx          # Application entry point
└── vite.config.js        # Vite configuration
```

## Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Non-technical user documentation
- **[TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)** - Comprehensive technical reference for developers

## Data Sources

The application uses static CSV and Excel files located in `/public/data/`:
- Green jobs data (9 CSV files)
- Benchmarking data (25+ CSV files)
- Geographic data (2 Excel files)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Private project

## Deployment

The application is deployed on Render at [https://skillsmonitorfigures.onrender.com](https://skillsmonitorfigures.onrender.com)

For deployment to other platforms (Vercel, Netlify, AWS, etc.), ensure proper configuration for SPA routing (all routes should serve `index.html`).
