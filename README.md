
# Event RSVP

A small, offline Event RSVP single-page app for collecting attendee information locally in the browser.

## Description

This project provides a simple client-side RSVP app that runs entirely offline. It lets event organizers collect names, emails and guest counts, view the RSVP list, delete entries, export the list as CSV, and clear all RSVPs. Data is persisted in the browser using `localStorage`.

## Features

- Responsive, mobile-first layout with card UI
- Accessible semantic HTML and focus styles
- RSVP form with validation (email format, guests 1–10)
- Store RSVPs in `localStorage` (offline-first)
- Render RSVP list with per-item delete
- Export RSVPs to CSV
- Clear all RSVPs with confirmation

## Local run

Open the app in your browser by opening `index.html` from the `event-rsvp` folder. No build step or server is required.

Example (PowerShell / Terminal):

```powershell
# From the repository root
start "" "event-rsvp\index.html"
```

Or in many systems you can double-click the `index.html` file or drag it into the browser.

## Deploy to GitHub Pages

Option A — use the `main` branch (recommended):

1. Create a new repository on GitHub (e.g. `your-username/event-rsvp`).
2. From your local project root run:

```bash
git init
git add event-rsvp
git commit -m "Add event-rsvp app"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

3. In the GitHub repository settings, go to *Pages* and set the source to the `main` branch (root). Save — your site will be published at `https://<your-username>.github.io/<repo>/`.

Option B — publish from a `gh-pages` branch (automated deploy):

1. Create the repository on GitHub and push `main` as above.
2. Create a `gh-pages` branch containing the `event-rsvp` folder contents and push it (or use a deploy action). Example:

```bash
git checkout --orphan gh-pages
git --work-tree=event-rsvp add --all
git --work-tree=event-rsvp commit -m "Publish event-rsvp"
git push origin HEAD:gh-pages --force
git checkout main
```

3. In the repository *Pages* settings set the source to `gh-pages` branch.

Notes

- Replace `https://github.com/<your-username>/<repo>.git` with your repository URL.
- GitHub Pages may take a minute to publish after enabling.

---

If you want, I can add a small `.gitignore` and an initial commit, or create a GitHub repo and push for you if you provide the remote URL.

