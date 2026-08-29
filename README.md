# 🏫 OpenSchool Blueprint Engine

> **Free, open-source school infrastructure modeling, 2D architectural CAD floor plan generator, real-time African cost calculator, and bankable PDF tender export suite.**

[![Deploy to GitHub Pages](https://github.com/abuabulorHBK/openschool-blueprint-engine/actions/workflows/deploy.yml/badge.svg)](https://github.com/abuabulorHBK/openschool-blueprint-engine/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview

**OpenSchool Blueprint Engine** empowers NGOs, governments, educational trusts, community groups, and architects to plan, cost, design, and export bankable tender documents for modern secondary schools.

The platform is purpose-built for the African continent and Cambridge curriculum (IGCSE / AS / A-Level) standards across 9 African countries (Tanzania, Kenya, Uganda, Rwanda, Ghana, Nigeria, South Africa, Zambia, Zimbabwe).

### 🚀 Key Capabilities

- 📐 **Interactive 2D Floor Plan CAD Engine**: Procedural SVG architectural layouts with wing zoning (STEM, Humanities, Admin, Sports, Quadrangle).
- 💰 **Real-Time African Cost Estimator**: Localized construction rates ($/m²), equipment catalogs, and currency conversions.
- 📦 **Automated Bill of Quantities (BOQ)**: Comprehensive materials, civil works, electrical, plumbing, and furnishings breakdown.
- 📄 **Bankable Tender Export**: Instant in-browser PDF generation (`jsPDF`), DXF CAD export, CSV procurement schedules, and JSON interchange.
- 🌐 **100% Client-Side / Zero-Backend**: Runs entirely in the browser with IndexedDB/LocalStorage persistence. Zero server cost, zero tracking, works anywhere worldwide.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Icons**: Lucide React
- **Exporting**: jsPDF, jsPDF-AutoTable, DXF Generator
- **Storage**: IndexedDB with LocalStorage transparent fallback
- **CI/CD**: GitHub Actions + GitHub Pages (Global Fastly Anycast CDN)

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm

### Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/abuabulorHBK/openschool-blueprint-engine.git
cd openschool-blueprint-engine

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Testing & Linting

```bash
# Run all JS tests
npm run test:js

# Run full test suite & linters
npm run test:all

# Build production bundle
npm run build
```

---

## 🌍 GitHub Pages Deployment

The repository includes an automated GitHub Actions CI/CD workflow (`.github/workflows/deploy.yml`).

1. Push code to `main`.
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Select **Source**: `GitHub Actions`.
4. Your application will be live at `https://abuabulorHBK.github.io/openschool-blueprint-engine/`.

---

## 📄 License

MIT License. Open and free for global educational infrastructure planning.
