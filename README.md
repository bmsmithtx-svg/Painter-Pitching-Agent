# Painter Pitching Agent

Painter Pitching Agent is a local Next.js PWA for tracking bullpen pitching sessions. It supports a coach login, saved bullpen sessions, a clickable vertical strike zone, pitch controls, plotted pitch dots, and a live pitch log.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Login

- Username: `CodyPainter`
- Password: `BobbyCoxField`

## Current Limitations

- Authentication is local app-level auth stored in the browser.
- Bullpen sessions are saved in `localStorage`, not a backend database.
- Player profiles and cloud storage are not included yet.

## Future Features

- Backend auth and user roles.
- Cloud session storage and team/player profiles.
- Player profiles and pitcher-specific reports.
- Exportable reports and pitch charts.
- More detailed analytics by pitch type and location.
