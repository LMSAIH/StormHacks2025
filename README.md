# MapD - Urban Development Impact Analysis Platform

<div align="center">
  <img src="./frontend/public/mapd.svg" alt="MapD Logo" width="200"/>
  
  **AI-Powered Urban Planning & Development Impact Visualization**
  
  [![City of Vancouver](https://img.shields.io/badge/Data-City%20of%20Vancouver-blue)](https://opendata.vancouver.ca)
  [![React](https://img.shields.io/badge/React-19.1.1-blue)](https://react.dev)
  [![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)](https://fastapi.tiangolo.com)
  [![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com)
</div>

---

## 🌟 Overview

**MapD** is an intelligent urban planning platform that leverages AI to analyze and visualize the impact of development projects on surrounding infrastructure and communities. Built for the City of Vancouver, MapD helps city planners, developers, and citizens understand how new construction projects affect schools, parks, transit, and other vital community amenities.

### Key Features

- 🗺️ **Interactive Map Visualization** - Explore development permits across Vancouver with real-time geospatial data
- 🤖 **AI-Powered Impact Analysis** - OpenAI-driven assessments of how developments affect nearby infrastructure
- 📊 **Comprehensive Infrastructure Data** - Tracks 9 categories: parks, schools, transit, libraries, cultural spaces, fire halls, and more
- 📈 **Quantitative Impact Scoring** - Multi-factor analysis with scores from -10 to +10 for each affected amenity
- 🔍 **Advanced Filtering & Search** - Find permits by location, value, property use, and proximity
- 💾 **Distributed Caching** - Cloudflare Workers edge caching for optimal global performance
- 🎨 **Beautiful UI** - Modern, responsive interface with Mapbox GL, TailwindCSS, and shadcn/ui

---

## 🏗️ Architecture

The project consists of three main components:

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │─────▶│ Cloudflare       │─────▶│    Backend      │
│   React + TS    │      │ Worker (Cache)   │      │  FastAPI + AI   │
│   Mapbox GL     │      │ Edge Network     │      │    MongoDB      │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

### Technology Stack

**Frontend:**
- React 19.1.1 with TypeScript
- Mapbox GL JS for interactive maps
- TailwindCSS 4 + shadcn/ui for styling
- Vite for build tooling
- Axios for API requests

**Backend:**
- FastAPI for high-performance REST API
- MongoDB for data storage
- OpenAI GPT-4 for impact analysis
- Python 3.10+ with async/await support
- Docker containerization

**Edge Layer:**
- Cloudflare Workers for API caching
- 5-minute cache TTL for GET requests
- CORS handling and request proxying
- Global CDN distribution

---

## 📦 Project Structure

```
StormHacks2025/
├── frontend/              # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── Map/       # Mapbox integration & markers
│   │   │   ├── MapSidebar/# Sidebar with permits list
│   │   │   └── ui/        # Reusable UI components
│   │   ├── pages/         # Home & Visualization pages
│   │   ├── api/           # API request functions
│   │   ├── data/          # GeoJSON boundaries
│   │   └── types/         # TypeScript definitions
│   └── public/            # Static assets
│
├── backend/               # FastAPI Python backend
│   ├── app.py            # Main API with endpoints
│   ├── script_create_db.py            # Database initialization
│   ├── script_enchance_permits.py     # Enrich permits with nearby amenities
│   ├── script_impact_report_generate.py # AI impact analysis generation
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile         # Container configuration
│   └── docker-compose.yml # Service orchestration
│
└── cloudflare-worker/     # Edge caching layer
    └── throbbing-rain-c8ee/
        └── src/
            └── index.ts   # Worker logic with caching
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.10+
- **MongoDB** (local or Atlas)
- **OpenAI API Key**
- **Mapbox Access Token**

### Environment Variables

Create `.env` files in both `backend/` and `frontend/`:

**Backend `.env`:**
```bash
MONGODB_URL=mongodb://localhost:27017/
OPENAI_API_KEY=sk-your-openai-api-key
```

**Frontend `.env`:**
```bash
VITE_MAPBOX_TOKEN=pk.your-mapbox-token
VITE_API_BASE_URL=http://localhost:8000
```

### Installation & Running

#### 1️⃣ Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Initialize database (import City of Vancouver data)
python script_create_db.py

# Enhance permits with nearby amenities
python script_enchance_permits.py

# Generate AI impact reports
python script_impact_report_generate.py

# Run the API server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

**Or use Docker:**
```bash
cd backend
docker-compose up --build
```

#### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Access the app at `http://localhost:5173`

#### 3️⃣ Cloudflare Worker (Optional)

```bash
cd cloudflare-worker/throbbing-rain-c8ee

# Install dependencies
npm install

# Run locally
npm run dev

# Deploy to Cloudflare
npm run deploy
```

---

## 🔌 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/development-permits` | Fetch development permits with filters |
| GET | `/amenities` | Get nearby amenities for coordinates |
| GET | `/impact_reports/{permit_id}` | Retrieve AI-generated impact analysis |
| POST | `/hypothetical-impact-report` | Generate hypothetical impact for custom data |

### Query Parameters for `/development-permits`

- `lon`, `lat` - Filter by coordinates
- `max_distance` - Maximum distance in km (default: 1.0)
- `min_value`, `max_value` - Filter by project value
- `property_use` - Filter by property use category
- `limit` - Number of results (default: 100)
- `skip` - Pagination offset

---

## 🎯 Features in Detail

### 1. Interactive Map Visualization
- **Mapbox GL JS** integration with custom markers
- Real-time permit clustering and individual markers
- Click-to-view permit details with popup info cards
- Dynamic amenity markers (schools, parks, transit, etc.)
- Vancouver neighborhood boundary overlays
- Smooth camera transitions and zoom controls

### 2. AI Impact Analysis
- **OpenAI GPT-4** analyzes each development permit
- Evaluates impact on 9 infrastructure categories
- Multi-factor reasoning considering:
  - Distance and accessibility
  - Project scale and type
  - Positive benefits (e.g., increased demand, revitalization)
  - Negative effects (e.g., strain on resources, disruption)
- Impact scores: -10 (severely negative) to +10 (highly positive)
- Quantitative estimates (e.g., "~5% enrollment increase")

### 3. Enhanced Permit Data
- Enriches City of Vancouver open data with:
  - Nearby amenities within configurable radius
  - Calculated distances using Haversine formula
  - Property use categories and specific use details
  - Project value and elapsed days tracking
  - Geographic area classification

### 4. Sidebar & Filtering
- **Overview Tab**: Summary statistics and controls
- **Projects Tab**: Searchable, paginated permit list
- Filter by boundaries, property type, and value
- Sort by date, value, or distance
- Responsive design with smooth animations

### 5. Right Panel Impact Display
- Detailed breakdown of infrastructure impacts
- Color-coded impact scores (red/yellow/green)
- Justification for each assessment
- Summary statistics and overall importance rating

---

## 🗄️ Database Schema

### Collections

**`development_permits`**
- Source: City of Vancouver Open Data
- Fields: address, project description, value, property use, coordinates, dates

**`enhanced_development_permits`**
- Enriched permits with nearby amenities array
- Distance calculations for each amenity type
- Sorted by proximity

**`impact_reports`**
- AI-generated impact analysis
- Analysis summary with title, description, importance
- Analyzed infrastructure array with scores and justifications
- Linked to original permit via `original_permit_id`

**Infrastructure Collections** (9 types):
- `parks`, `schools`, `libraries`, `community_centers`
- `cultural_spaces`, `public_art`, `public_washrooms`
- `rapid_transit_stations`, `fire_halls`

---

## 🤝 Contributing

We welcome contributions! Areas for improvement:

- 🧪 Add unit and integration tests
- 🎨 Enhance UI/UX with more visualizations
- 📊 Add historical trend analysis
- 🔔 Implement real-time notifications for new permits
- 🌐 Multi-language support
- 📱 Mobile app version
- 🔐 User authentication and saved searches

---

## 🏆 Hackathon Tracks

This project was built for **StormHacks 2025** and applies for:

- ✅ **Most Likely to Become a Startup** - Real market need for urban planning tools
- ✅ **United Nations Sustainable Development Goals Enactus Challenge** - Supports sustainable cities (SDG 11)
- ✅ **BluePrint Social Good Track** - Improves community engagement in urban development
- ✅ **SEE Sustainable Engineering Track** - Promotes efficient resource planning and sustainable urban growth
- ✅ **IEEE SFU Prize Track** - Advanced technical implementation with AI and geospatial data
- ✅ **Best Design** - Polished UI with excellent UX
- ✅ **[MLH] Best Use of .TECH** - Modern web platform showcasing technical innovation in urban development

---

## 👥 Team

Built with ❤️ by *404 Rizz Not Found* Team at StormHacks 2025

---

## 🙏 Acknowledgments

- **City of Vancouver** for providing comprehensive open data
- **OpenAI** for GPT-4 API
- **Mapbox** for mapping platform
- **Cloudflare** for edge infrastructure
- [Isometric Icons ©2025](https://github.com/Martz94/isometric-icons) is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

