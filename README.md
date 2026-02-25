# AI Studio Self-Serve Package

A self-serve pricing and subscription management portal for AI Studio, built with React and Tailwind CSS.

## Quick Start

**Double-click `start.bat`** to launch the app, then open http://localhost:5173 in your browser.

Or run manually:
```bash
npm install
npm run dev
```

## Features

### Pricing Page (`/pricing`)
- Three-tier pricing: Starter (Free), Pro ($199/mo), Enterprise ($499/mo)
- Monthly/Yearly billing toggle with 17% savings on annual plans
- **Data Access differentiation:**
  - Historical data: 1 month / 6 months / 15 months
  - Geographic coverage: Worldwide only vs Per country breakdown
  - Data types: Web Data, App Data, Retail Data
- Feature comparison and usage limits display
- FAQ section

### Account Dashboard (`/dashboard`)
- Current plan overview with data access details
- Real-time usage tracking with visual progress bars
- **Consumption breakdown** by source (Direct, MCP, API)
- Usage history charts (queries, deep research over time)
- Billing management and invoice history
- Plan upgrade prompts

### AI Studio Demo (`/studio`)
- Interactive chat interface
- Real-time usage counter
- Sample AI responses with Similarweb-style insights

### Usage Limit System
- **Warning Toast**: Appears at 80% usage threshold
- **Upgrade Modal**: Full-screen prompt when limits are reached
- **Notification Bar**: Persistent banner for near-limit states

### Internationalization
- **Language Toggle**: Switch between English and Japanese
- All UI text is translatable

## Package Tiers

| Feature | Starter | Pro | Enterprise |
|---------|---------|-----|------------|
| Price | Free | $199/mo | $499/mo |
| AI Queries | 50 | 500 | Unlimited |
| Deep Research | 5 | 50 | 200 |
| Historical Data | 15 months | 15 months | 15 months |
| Geographic | Per country | Per country | Per country |
| Web Data | ✓ | ✓ | ✓ |
| App Data | ✗ | ✓ | ✓ |
| Retail Data | ✗ | ✗ | ✓ |

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx              # Main layout with header
│   ├── LanguageToggle.jsx      # EN/JP language switcher
│   ├── UpgradeModal.jsx        # Limit reached modal
│   ├── LimitWarningToast.jsx
│   └── UsageNotificationBar.jsx
├── context/
│   ├── UsageContext.jsx        # Global usage state & plans
│   └── LanguageContext.jsx     # i18n context
├── hooks/
│   └── useUsageLimits.js       # Usage tracking hooks
├── i18n/
│   └── translations.js         # EN/JP translations
├── pages/
│   ├── PricingPage.jsx         # Pricing tiers
│   ├── DashboardPage.jsx       # Account management
│   └── AIStudioDemo.jsx        # Chat interface
├── App.jsx
├── main.jsx
└── index.css
```

## Customization

### Modifying Plans
Edit `src/context/UsageContext.jsx` to adjust:
- Plan names and pricing
- Usage limits (queries, deep research, exports)
- Data access settings (historical months, country level, data types)
- Feature lists

### Styling
The project uses Tailwind CSS with a custom Similarweb color palette defined in `tailwind.config.js`.

### Translations
Add or modify translations in `src/i18n/translations.js` for English (`en`) and Japanese (`ja`).
