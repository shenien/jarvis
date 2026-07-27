# JARVIS

A personal command center — a single dark, glassmorphic home page that links out to every app you build for yourself. One live entry today (Pilatesmith — Smithy); more slots waiting.

## Structure

Plain HTML/CSS/JS, no build step.

- `index.html` — page structure
- `style.css` — dark HUD/glassmorphic theme
- `script.js` — clock, greeting, app registry, search, ambient particle field

## Adding a new app

Open `script.js` and add an entry to the `APPS` array at the top:

```js
{
  name: "My New App",
  desc: "One line about what it does.",
  url: "https://my-new-app.onrender.com",
  icon: "⚡",       // any emoji
  tag: "LIVE",      // or "BETA", "WIP", etc.
}
```

Save, commit, push — Render redeploys automatically.

## Local preview

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deployment

Hosted on [Render](https://render.com) as a Static Site, connected to this GitHub repo. Every push to `main` redeploys automatically. See `render.yaml` for the service config.
