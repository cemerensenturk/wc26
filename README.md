# ⚽ FIFA World Cup 2026 Bracket Predictor

> Built by [cemeren.dev](https://cemeren.dev)

A fully interactive bracket prediction app for the **FIFA World Cup 2026**, supporting the new 48-team format. Rank your groups, choose the best third-placed teams, and predict every match all the way to the Final.

---

## 🌐 Live Demo

[cemeren.dev](https://cemeren.dev)

---

## ✨ Features

- **Step 1 — Group Stage**: Drag & drop to rank all 48 teams across 12 groups (A–L)
- **Step 2 — Best Third Place**: Select exactly 8 of the 12 third-placed teams to advance
- **Step 3 — Knockout Bracket**: A classic left-right bracket tree covering:
  - Round of 32 (16 matches)
  - Round of 16 (8 matches)
  - Quarter-Finals (4 matches)
  - Semi-Finals (2 matches)
  - Third-Place Match
  - Final
- **Round locking**: Rounds are locked until the previous round is fully completed
- **Semi-Final losers** automatically fill the Third-Place match
- **Champion reveal** with animated trophy on Final selection
- **Share as Image**: Download your completed bracket as a PNG
- **RotaScore link**: Simulate the matches at [cemeren.dev/rotascore](https://cemeren.dev/rotascore)
- Fully **responsive** (mobile & desktop)

---

## 🎨 Design

The UI follows the official **FIFA World Cup 2026** color palette:

| Color | Hex | Usage |
|---|---|---|
| Average Green | `#3CAC3B` | Success states, buttons, qualifiers |
| Hermes Blue | `#2A398D` | Background base, share button |
| Torch Red | `#E61D25` | Accents, warnings |
| Light Gray | `#D1D4D1` | Secondary text, borders |
| Dark Heather Grey | `#474A4A` | Supporting surfaces |

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) | Drag & drop |
| [lucide-react](https://lucide.dev) | Icons |
| [html2canvas](https://html2canvas.hertzen.com) | Bracket screenshot export |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── assets/          # Logo and static files
├── components/
│   ├── Group.jsx          # Single group drag-drop list
│   ├── GroupStage.jsx     # Step 1: All 12 groups
│   ├── BestThirdsStage.jsx# Step 2: Best 3rd place selection
│   ├── BracketStage.jsx   # Step 3: Full knockout bracket
│   ├── MatchCard.jsx      # Individual match component
│   └── TeamCard.jsx       # Draggable team row
├── context/
│   └── TournamentContext.jsx  # Global state (groups, bracket, selections)
├── data/
│   └── teams.js           # All 48 teams with flags and group assignments
├── App.jsx
├── index.css              # Design system & WC2026 theme
└── main.jsx
```

---

## 🏆 WC 2026 Format

- **48 teams** in **12 groups** of 4
- **Top 2** from each group advance automatically (24 teams)
- **Best 8 third-placed teams** also advance (8 teams)
- **32 teams** enter the knockout stage

---

*Made with ❤️ by [cemeren.dev](https://cemeren.dev)*
