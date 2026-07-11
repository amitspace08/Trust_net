# TrustNet — Personal Safety Network

TrustNet is a modern, responsive, and privacy-first personal safety web application. It implements a multi-layered peer-to-peer safety network, community safe spaces, and dynamic crowdsourced area safety ratings designed to protect individuals in high-risk scenarios and daily commutes.

---

## 🚀 Key System Features (Frontend Complete)

### 1. Multi-Layer SOS Escalation Chain
* **1.5s Hold SOS Trigger:** Large red centerpiece button requiring a continuous 1.5-second hold to activate. Uses a pulsing ring animation to prevent accidental triggers.
* **5-Second Countdown Cancel Screen:** A large countdown timer from 5 to 0. Features a stress-optimized, oversized *"Cancel — I am safe"* button.
* **Layer 1 Active SOS Screen (Purple):** Alerts designated primary contacts immediately. Displays a live status bar showing *"Location sharing — live"* with a pulsing green dot.
* **Layer 2 Social Graph Escalation (Teal):** When 90 seconds pass with no response from Layer 1, the app automatically transitions to Layer 2. Traverses the social graph to locate nearby second-degree contacts (Friends-of-Friends) and alerts them.
* **Layer 3 Guardian Angel Network (Gold):** Escalates after another 90 seconds. Alerts verified community volunteers who have marked themselves on-duty via the *Guardian Angel Dashboard*.
* **Police Escalation:** Final step in the timeline for law enforcement dispatch.
* **Pre-Response Confirmations:** Protects responders against accidental confirmations by displaying mutual connections, distance indicators, and a community helper disclaimer.
* **Decline & Re-Routing:** Responders can click *"I cannot help right now"*, immediately routing the emergency alert to the next ranked candidate.

### 2. Community Safe Spaces
* **Registration Form:** Under 5 fields allowing local businesses/locations (shops, pharmacies, petrol stations, police stations, public buildings) to register as community Safe Spaces.
* **Interactive Map Pins:** Green building pins on the map show nearby safe spaces. Tapping a pin opens a popup badge detailing distance, address, and walking directions.
* **SOS Fallback Routing:** During any active SOS, the nearest Safe Space is persistently displayed at the bottom of the screen with a quick-tap navigation button linking directly to Google Maps walking directions.

### 3. Crowdsourced Safety Ratings
* **Floating Score Badge:** A dynamic colored badge in the corner of the map showing the average safety score of the current area:
  - **Green (Score $\ge$ 7):** Safe Zone.
  - **Amber (Score 4 to 6):** Caution Recommended.
  - **Red (Score $\le$ 3):** High Risk.
* **Score & Tag Details Popup:** Tapping the badge displays the exact score, total ratings, and the top two reported conditions.
* **20-Second Rate Screen:** Rapid 1-to-10 grid selector with optional tags (*Poor lighting, Isolated, Well-lit, Crowded, Police presence*) and a community helper contribution check.
* **Auto-Return Success Screen:** Confirms rating submission and automatically navigates back to the map view.

---

## 🛠️ Project Structure & File Index

```text
├── src/
│   ├── routes/              # TanStack Start Route Files
│   │   ├── __root.tsx       # Root layout shell & global app layout
│   │   ├── index.tsx        # Home Page (Long-press SOS activator & quick actions)
│   │   ├── heatmap.tsx      # Map screen with safety score badges & rating modals
│   │   ├── circle.tsx       # My Trust Circle (Add, view, accept Layer 1 contacts)
│   │   ├── safe-spaces.tsx  # Register spaces and search list within 1km
│   │   ├── guardian.tsx     # GA registration screen, dashboard, and availability toggles
│   │   ├── sos.tsx          # Distressed user view (3-Layer color banner, maps, 4-node timeline)
│   │   ├── sos-receiver.tsx # Responding contact view (Distinct headers, fuzzy pins, confirmation modal, decline, thank you screen)
│   │   ├── history.tsx      # Safety Journey logs and timelines
│   │   ├── privacy.tsx      # Privacy settings & location sharing controls
│   │   └── support.tsx      # Helplines (112 / 100) & FAQ section
│   ├── lib/
│   │   ├── auth.tsx         # User authentication & mock profiles
│   │   └── contacts-db.ts   # Social Graph Traversal engine & mock DB
│   └── styles.css           # Custom styling classes
```

---

## 🏃 Getting Started

### Prerequisites
You need [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Installation

1. Navigate to the project root directory:
   ```bash
   cd TrustNet
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

### Running the App

#### 1. Development Mode
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:5178](http://localhost:5178) in your web browser.

#### 2. Production Compile & Build check
Compile the client and SSR build to verify TypeScript and build health:
```bash
npm run build
```

---

## 🧪 Demonstration & Simulation Steps

### Flow 1: SOS Escalation Chain
1. Open the home page (`/`) and **press and hold the big red SOS button** for 1.5 seconds.
2. The red 5-second countdown screen will appear. Do not press cancel.
3. Once the timer reaches 0, the **Layer 1 Active Screen (Purple)** will load with the *"Location sharing — live"* green status bar.
4. Click *"Simulate L2 Timeout"* inside the status card to mimic direct contacts failing to pick up. The app transitions to the calm searching screen and escalates to **Layer 2 (Teal)**.
5. Click *"Simulate L3 Timeout"* to mimic no response from L2. The app escalates to **Layer 3 (Gold - Guardian Angels)**.
6. Open a separate tab/window at `/sos-receiver?role=layer2` or `/sos-receiver?role=layer3` to see the responder alert panel. Click *"I can help"* $\rightarrow$ *"Confirm & Respond"* to see the distressed user page update dynamically with the helper's name and route.
7. Click *"I am safe — end SOS"* on the sender tab to trigger the double-tap prevention modal, end the emergency cleanly, and trigger the responder's thank-you page.

### Flow 2: Safe Space Registration & Routing
1. Go to the Home Page and click **Safe Spaces** $\rightarrow$ **Register a Space** tab.
2. Fill out the business name, choose a category, enter the address, check the confirmation, and submit.
3. Click the **Safe Spaces Nearby** tab to see your new registered business integrated into the sorted 1km proximity list.
4. Go to `/sos` active screen and look at the bottom: the nearest Safe Space (Apollo Pharmacy) is persistently displayed with a walking route map highlight and a button to launch walking directions.

### Flow 3: Location Safety Rating
1. Navigate to the **Heatmap** page (`/heatmap`).
2. Observe the floating circular badge in the top-right corner. It displays `7.3` in a **green circle** (since the average score is $\ge$ 7).
3. Click the badge to open the detail popup displaying the average score, number of ratings, and top conditions (*Well-lit, Police presence*).
4. Tap *"Rate this Area"* to open the 1-20s submission panel. Tap a low score (e.g. `2`) and select tags (*Poor lighting, Isolated*), then submit.
5. The success overlay will slide in confirming the rating, and the average score on the badge will update to represent your submission.

---

## 📈 Verification Summary (All Frontend Tasks Complete)

* **Task 1 to 3 (Weeks 4-5):** Completed. Fully functional SOS counts, fuzzy mapping offset (+100m-200m) for semi-strangers, decline state handlers, timeline rendering, and double-tap prevention handlers.
* **Task 1 (Week 6):** Completed. Fully functional Guardian Angel registration checkboxes, availability ON/OFF dashboards with stats, GA profile matching, L3 alerts, and gold colors.
* **Task 2 (Week 6):** Completed. Under-5-field Safe Space registry, green building pins, detail walking directions popups, and persistent SOS safe-destination banner.
* **Task 3 (Week 6):** Completed. Dynamic rating score average, colored circles, 10-score selector grids, tag filters, and success notifications.
* **Performance & Network:** Leverages lightweight GPU-accelerated CSS animations and robust client caching to guarantee fast updates on 20% battery limits and slow 2G internet.
