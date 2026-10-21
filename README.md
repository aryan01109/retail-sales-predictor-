# Retail Intelligence — Retail & E-commerce Sales Analysis

A production-style React + TypeScript analytics frontend for a Data Science academic project.

## Stack
- Vite + React + TypeScript
- Tailwind CSS
- Recharts
- Framer Motion
- Lucide React
- FastAPI-ready API service layer

## Run locally
```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Build
```bash
npm run build
npm run preview
```

## Backend integration
Copy `.env.example` to `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Expected endpoints:
- `GET /dashboard`
- `GET /sales/trend`
- `GET /sales/category`
- `GET /sales/region`
- `GET /products`
- `GET /customers`
- `GET /model/metrics`
- `POST /predict`

The current UI uses an explicitly client-side mock Superstore-style dataset so the frontend runs immediately. Replace the service calls with your FastAPI responses when the backend is ready. The ML page intentionally does not display fabricated metrics or confidence values.

## Project structure
```text
src/
  components/     Shared UI and charts
  data/            Development fallback dataset
  layouts/         Application shell/sidebar/header
  pages/           Analytics pages
  services/       API and aggregation layer
  types/           TypeScript models
  utils/           Formatting helpers
```

## Data integrity
The mock dataset is clearly indicated in the header. It is development fallback data, not claimed as your real academic dataset. Connect your actual CSV/API before presenting analytical results as real.
