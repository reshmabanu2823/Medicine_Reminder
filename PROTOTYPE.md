# MediTrack+ Design Prototype

Interactive prototype and component library for the "Medicine Reminder & Stock Tracker" design are available in this repository.

How to run locally:

```bash
npm i
npm run dev
# open http://localhost:5173/design
```

What it contains:

- `src/design/DesignShowcase.tsx` — interactive prototype page (Splash, Onboarding, Auth, Dashboard, Stock)
- `src/design/components/*` — mini component library (Button, Card, Toggle, Input, Header)
- `src/styles/themes.css` — CSS variables for Light and Dark themes and responsive utilities

Design notes:

- Light theme: blue + white tones. Dark theme: deep navy with teal accents.
- Tokens are available as CSS variables for quick developer handoff.
- Screens are responsive (mobile-first) and adapt layouts for larger widths.

Next steps for production handoff:
- Replace inline icons/logos with vector SVGs and export tokens to a design token format (JSON).
- Wire the prototype to a backend (Firebase/Django) and persist medicines, reminders and settings.
