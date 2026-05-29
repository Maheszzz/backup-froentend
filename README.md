
<div align="center">
  <img src="https://img.shields.io/badge/MakeMyStay-realty-red?style=for-the-badge&logo=homeassistant" alt="MakeMyStay Logo" width="80" height="auto" />
  <h1>MakeMyStay.ai</h1>
  <p>The first AI-native revenue engine for co-living and rental operators. Automate growth today.</p>

  <p>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    </a>
    <a href="https://vitejs.dev/">
      <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
  </p>
</div>

---

## 🚀 Features

- **Modern & Responsive Design**: Built with React 19 and TailwindCSS for a seamless experience across all devices.
- **Dynamic Property Listings**: Browse and search properties with real-time filtering options.
- **AI-Powered Insights**: Leveraging AI to optimize revenue and management for property operators.
- **Service Showcases**: Detailed pages for Property Management, Revenue Optimization, Tenant Acquisition, and Market Intelligence.
- **Contact Integration**: Integrated contact forms and direct links to sales and support teams.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd make-my-stay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will run at `http://localhost:5173`.

4. **Verify local API wiring before opening the listings pages**
   ```bash
   npm run check:local
   ```
   This checks the frontend API base URL, backend health, backend `ENV`, database connectivity, and a live PG listings request.

5. **Build for production**
   ```bash
   npm run build
   ```

## 📂 Project Structure

```bash
make-my-stay/
├── public/          # Static assets (images, logos, etc.)
├── src/
│   ├── components/  # Reusable UI components (Layouts, Modules, Sections, UI)
│   ├── hooks/       # Custom React hooks (useProperties, useContacts)
│   ├── lib/         # Utility functions and API clients
│   ├── pages/       # Application pages and route definitions
│   ├── types/       # TypeScript type definitions and interfaces
│   ├── App.tsx      # Main application component with routing
│   └── main.tsx     # Entry point
├── dist/            # Production build output
└── vite.config.ts   # Vite configuration
```

## 🔧 Environment Variables

Create a `.env` file in the root directory to configure your environment:

```env
# Use either name (both are supported; VITE_API_BASE_URL wins if both are set)
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

For local development, make sure the backend is running with `ENV=development`. If the backend is started in production mode, browser requests from `localhost` can be blocked by CORS even when the API itself is healthy.

## SEO / Google Search Console

After deploying changes to titles or meta, use Search Console **URL Inspection** and **Request indexing** for key URLs (home, `/pg`, `/rent`, sample locality and property pages). Expect **7–14+ days** for visible SERP updates. See [docs/seo-gsc.md](docs/seo-gsc.md) for a short checklist.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is proprietary software. All rights reserved. © 2026 MakeMyStay.ai
# backup-froentend
