# TrustNet — Personal Safety App

![TrustNet UI Mockup](./ui_mockup.png)

TrustNet is a modern, responsive personal safety and emergency dispatch web application. It features automated safety tracking, live-location sharing capabilities, circle guardian management, and national safety helpline integrations.

## Key Features

- **Emergency SOS Activator**: Press-and-hold activation overlay with precise 1.5-second loading animations to prevent accidental triggers.
- **Live Safety Heatmap**: Dynamic maps visualizing local safety ratings and safe spaces.
- **Safety Circle & Guardians**: Layer 1 and Layer 2 circle systems for immediate emergency alerts and escalations.
- **Safety History**: Logs of active journeys, check-ins, and timelines of previous alerts.
- **Privacy Guard**: Full end-to-end data control, encrypted location sharing toggles, and customized data retention controls.
- **Help & Support**: Direct triggers to national emergency services dispatch (112/100) and general FAQs.

## Tech Stack

- **Core Framework**: React 19 + TypeScript
- **Routing & SSR**: [TanStack Start](https://tanstack.com/router/latest/docs/start/overview) (File-based routing, SSR and Client Hydration)
- **Styling**: TailwindCSS v4 + Custom HSL variables
- **State & Data**: TanStack Query (React Query)
- **Bundler**: Vite

---

## Getting Started

### Prerequisites

You will need [Node.js](https://nodejs.org/) (v18+ recommended) and `npm` or `bun` installed on your machine.

### Installation

1. Clone this repository (or navigate to your local copy):
   ```bash
   git clone https://github.com/nagnitin/TrustNet.git
   cd TrustNet
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or using bun:
   bun install
   ```

### Running the App

#### 1. Development Mode
Run the development server locally:
```bash
npm run dev
# or
bun dev
```
The application will be accessible at [http://localhost:5173](http://localhost:5173) (or the port indicated in the terminal, e.g. `5174`).

#### 2. Production Build & Preview
To compile the application into a production bundle and preview it locally:
```bash
# Build client and server targets
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```text
├── src/
│   ├── routes/          # TanStack Start Route Files (File-based Routing)
│   │   ├── __root.tsx   # Root layout shell, BottomNav & SOS overlay logic
│   │   ├── index.tsx    # Home Page
│   │   ├── heatmap.tsx  # Interactive Maps & Routes
│   │   ├── circle.tsx   # Layer 1 & 2 Network Circles
│   │   ├── guardian.tsx # Guardian Angel configuration
│   │   ├── history.tsx  # Safety Journey logs & Timeline
│   │   ├── privacy.tsx  # Privacy Guard toggles
│   │   └── support.tsx  # FAQ & emergency calling triggers
│   ├── lib/             # Shared client/auth state logic
│   └── styles.css       # Core design styling
```
