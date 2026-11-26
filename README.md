# Ruohan Li Portfolio

Static portfolio website containing:

- Home page
- About page
- TikTok Search case study
- ByteDance / Gauth case study
- Uber Wait & Save case study
- Audi HMI case study
- SafeBook privacy case study
- Local images and fonts
- Responsive layouts and hover interactions

## Local preview

Run a local server from this folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy with GitHub Pages

1. Create a new GitHub repository.
2. Upload everything inside this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`.
6. Click **Save**.

GitHub will provide a public URL after deployment.

## Pages

- `index.html` — Home
- `about.html` — About
- `tiktok.html` — TikTok Search
- `bytedance.html` — ByteDance / Gauth
- `uber.html` — Uber Wait & Save
- `audi.html` — Audi HMI
- `safebook.html` — SafeBook

## Notes

- Keep the `assets` folder structure unchanged.
- All internal links use relative paths and work on GitHub Pages.
- Update the résumé URL directly in each HTML file if needed.
