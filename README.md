# 🛍️ Retail Intelligence: ML Sales Prediction

A production-style **React + TypeScript** analytics dashboard that forecasts retail order sales using a **Random Forest regression model**. Built as a Data Science academic project at L.D. College of Engineering (2026–27).

🔗 **Live demo:** https://retail-sales-predictor-rw9w.vercel.app/

![Dashboard screenshot](![Uploading Screenshot 2026-10-21 124029.png…]()
)

---

## ✨ Features

- **Sales prediction:** select category, sub-category, region, segment, quantity, discount and ship mode to get a forecasted sales value and estimated profit.
- **Confidence interval:** every forecast shows a range bar with lower and upper bounds.
- **Quick scenarios:** one-click presets (Bulk Phones, Office Chairs at 20% off, Bulk Paper Supplies).
- **Model metrics:** architecture, R² score, MAE, RMSE and inference latency at a glance.
- **Better inputs:** quantity stepper, discount slider with percentage badge, and sub-category options filtered by category.
- **Share and reset:** share a prediction result or reset the form to defaults.
- **Dark and light theme** with a responsive layout.

## 🧠 Machine Learning Model

| Item | Details |
|------|---------|
| Algorithm | Random Forest Regressor |
| Target variable | Total Sales ($) |
| Features | Category, Sub-Category, Region, Segment, Quantity, Discount, Ship Mode |
| Validation | 5-fold cross-validation |
| Dataset | Superstore-style retail sales data (`<add dataset source / link>`) |

**Evaluation results** (from the training notebook):

| Metric | Value |
|--------|-------|
| R² score | `<value>` |
| Mean Absolute Error (MAE) | `<value>` |
| Root Mean Squared Error (RMSE) | `<value>` |

> Training notebook: `<link to notebook / folder>`

## 🧱 Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | Vite, React, TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend (ready) | FastAPI + scikit-learn |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install and run

```bash
git clone https://github.com/aryan01109/retail-sales-predictor.git
cd retail-sales-predictor
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## 🔌 Backend Integration

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Expected endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/dashboard` | Dashboard summary |
| GET | `/sales/trend` | Sales over time |
| GET | `/sales/category` | Sales by category |
| GET | `/sales/region` | Sales by region |
| GET | `/products` | Product list |
| GET | `/customers` | Customer data |
| GET | `/model/metrics` | Model performance metrics |
| POST | `/predict` | Run a prediction |

Example `/predict` request:

```json
{
  "category": "Furniture",
  "sub_category": "Bookcases",
  "region": "East",
  "segment": "Corporate",
  "quantity": 3,
  "discount": 0.1,
  "ship_mode": "Standard Class"
}
```

Example response:

```json
{
  "predicted_sales": 742.1,
  "predicted_profit": 151.4,
  "confidence_interval": [701, 783]
}
```

## 📁 Project Structure

```text
src/
├── components/   # Shared UI and charts
├── data/         # Development fallback dataset
├── layouts/      # App shell, sidebar, header
├── pages/        # Analytics and prediction pages
├── services/     # API and aggregation layer
├── types/        # TypeScript models
└── utils/        # Formatting helpers
```

## ⚠️ Data Integrity Note

Until the FastAPI backend is connected, the app uses a **client-side mock dataset** so the interface runs immediately. Values shown in demo mode are for UI demonstration only. Connect your real trained model and dataset before presenting results as actual analysis.

## 🗺️ Roadmap

- [ ] Connect the live FastAPI model endpoint
- [ ] Compute the confidence interval from the spread of predictions across trees
- [ ] Export prediction history to CSV
- [ ] SHAP-based explanations for each prediction

## 👤 Author

**Aryan Bhoya**
L.D. College of Engineering, Ahmedabad
GitHub: [@aryan01109](https://github.com/aryan01109)

## 📄 License

MIT License © 2026 Aryan Bhoya. See [LICENSE](./LICENSE).
