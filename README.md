# 📊 Mixo Ads - Campaign Performance Dashboard

A modern, real-time campaign analytics dashboard built with React, TypeScript, and Tailwind CSS. Features live data streaming, dark/light theme toggle, and a responsive design optimized for all screen sizes.

![Dashboard Preview](https://img.shields.io/badge/React-18.x-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashshuklaaa/campaign-performance.git
   cd campaign-performance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The production build will be generated in the `dist/` folder.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── CampaignDrawer.tsx    # Slide-out panel for campaign details
│   │   ├── CampaignTable.tsx     # Sortable table with pagination
│   │   ├── MetricCard.tsx        # Individual metric display card
│   │   ├── MetricsGrid.tsx       # Grid layout for metric cards
│   │   └── PerformanceChart.tsx  # Line chart for performance data
│   └── layout/
│       ├── Layout.tsx            # Main app layout with header
│       └── Sidebar.tsx           # Navigation sidebar
├── context/
│   └── ThemeContext.tsx          # Dark/Light theme management
├── lib/
│   ├── api.ts                    # API functions and data fetching
│   ├── mockData.ts               # Fallback mock data
│   └── utils.ts                  # Utility functions (cn helper)
├── pages/
│   ├── Dashboard.tsx             # Main dashboard page
│   └── CampaignDetails.tsx       # Campaign details page (legacy)
├── types.ts                      # TypeScript type definitions
├── App.tsx                       # App entry with routing
├── main.tsx                      # React entry point
└── index.css                     # Global styles & theme variables
```

---

## 🔌 API Integration

### Base URL
```
https://mixo-fe-backend-task.vercel.app
```

### API Endpoints Used

| Endpoint | Method | Description | Used In |
|----------|--------|-------------|---------|
| `/campaigns` | GET | Fetch all campaigns list | `Dashboard.tsx` |
| `/campaigns/:id` | GET | Fetch single campaign details | `CampaignDrawer.tsx` |
| `/campaigns/:id/insights` | GET | Get performance metrics for a campaign | `CampaignDrawer.tsx`, `Dashboard.tsx` |
| `/campaigns/insights` | GET | Get aggregate/global insights | `Dashboard.tsx` (MetricsGrid) |
| `/campaigns/:id/insights/stream` | SSE | Real-time live metrics streaming | `CampaignDrawer.tsx` |

---

## 📡 API Functions (src/lib/api.ts)

### 1. `fetchCampaigns()`
**Purpose:** Fetches all campaigns with their insights  
**Used in:** `Dashboard.tsx`  
**Returns:** `Campaign[]`

```typescript
const campaigns = await fetchCampaigns();
// Returns array of campaigns with impressions, clicks, spend, CTR
```

**What it shows:**
- Campaign names in the table
- Status (Active/Paused/Completed)
- Impressions, Clicks, CTR, Spend columns

---

### 2. `fetchCampaignById(id: string)`
**Purpose:** Fetches a single campaign with its insights  
**Used in:** `CampaignDrawer.tsx`  
**Returns:** `Campaign`

```typescript
const campaign = await fetchCampaignById('camp_123');
// Returns detailed campaign data for the drawer panel
```

**What it shows:**
- Campaign name & status in drawer header
- Budget and duration configuration
- Live metrics (Impressions, Clicks, Spend, Conversions)

---

### 3. `fetchGlobalInsights()`
**Purpose:** Fetches aggregate metrics across all campaigns  
**Used in:** `Dashboard.tsx` → `MetricsGrid`  
**Returns:** `Metric[]`

```typescript
const metrics = await fetchGlobalInsights();
// Returns array of metric cards data
```

**What it shows (11 metrics):**
| Metric | Description |
|--------|-------------|
| Total Campaigns | Count of all campaigns |
| Active Campaigns | Currently running campaigns |
| Paused Campaigns | Temporarily stopped |
| Completed Campaigns | Finished campaigns |
| Total Spend | Sum of all spending (USD) |
| Total Impressions | Sum of all views |
| Total Clicks | Sum of all clicks |
| Total Conversions | Sum of all conversions |
| Avg. CTR | Average click-through rate |
| Avg. CPC | Average cost per click |
| Avg. Conversion Rate | Average conversion percentage |

---

### 4. `subscribeToCampaignInsights(id, onData, onError)`
**Purpose:** Real-time Server-Sent Events (SSE) stream for live metrics  
**Used in:** `CampaignDrawer.tsx`  
**Returns:** Cleanup function `() => void`

```typescript
const unsubscribe = subscribeToCampaignInsights(
  'camp_123',
  (data) => setLiveMetrics(data),  // Called on each update
  (error) => console.error(error)   // Called on error
);

// Later: cleanup
unsubscribe();
```

**What it shows:**
- Live updating numbers in the campaign drawer
- Pulsing red "Live" indicator
- Color flash effect when data updates

---

### 5. `generateChartData()`
**Purpose:** Generates 7-day mock chart data  
**Used in:** `Dashboard.tsx` → `PerformanceChart`  
**Note:** API doesn't provide historical data, so this is simulated

```typescript
const chartData = generateChartData();
// Returns 7 days of impressions, clicks, conversions
```

**What it shows:**
- Area chart with 3 lines (Impressions, Clicks, Conversions)
- Date labels on X-axis
- Interactive tooltips

---

## 🎨 Features

### Theme Toggle (Dark/Light Mode)
- Toggle button in header (Sun/Moon icons)
- Persisted in `localStorage`
- CSS variables for consistent theming

### Slide-out Drawer
- Opens from right side when clicking "View" button
- Shows campaign details without page navigation
- Closes with Escape key or backdrop click
- Full-width on mobile, max-width on desktop

### Sortable Table
- Click column headers to sort (Asc → Desc → None)
- Visual indicators for sort direction
- Row index numbers (#)
- Pagination (10 items per page)
- Alternating row colors (zebra striping)

### Responsive Design
- Mobile-first approach
- Sidebar hidden on mobile (< 1024px)
- Grid layouts adapt: 1 → 2 → 3 → 4 columns
- Compact padding and text on small screens

### Custom Scrollbars
- Thin 6px scrollbars
- Theme-matching colors
- Works on Chrome, Edge, Firefox

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool & Dev Server |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Recharts | Charts & Graphs |
| Lucide React | Icons |

---

## 📂 Key Files Explained

### `src/lib/api.ts`
Central API layer - all backend communication happens here. Transforms API responses to frontend-friendly types.

### `src/context/ThemeContext.tsx`
React Context for theme management. Provides `theme` and `toggleTheme` to all components.

### `src/components/dashboard/CampaignDrawer.tsx`
The slide-out panel component. Handles:
- Loading campaign data
- SSE subscription for live updates
- Keyboard/backdrop close handling

### `src/components/dashboard/CampaignTable.tsx`
Complex table component with:
- Sorting state management
- Pagination logic
- Responsive styling

### `src/pages/Dashboard.tsx`
Main page that orchestrates:
- Data fetching on mount
- State for drawer (open/close, selected campaign)
- Layout of all dashboard components

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `tsconfig.json` | TypeScript configuration |
| `postcss.config.js` | PostCSS plugins (Tailwind, Autoprefixer) |

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## 👨‍💻 Author

**Yash Shukla**

---

## 📄 License

This project is created for assessment purposes.
