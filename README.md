# SAMX | Samuel Ogunlusi Portfolio

Official portfolio website for Samuel Ogunlusi, showcasing work in IT Support, Cybersecurity, Technical Operations and Infrastructure.

## About this redesign

This repository contains the **approved SAMX 2026 redesign**, built as a lightweight static website using HTML, CSS, and JavaScript. No frameworks, package installation or build commands are required.

### Site sections
- Introduction and original portrait
- Mission and About
- Featured projects: Wazuh SIEM & AI-Assisted Alert Triage, OpenCanary & Wazuh Correlation, ML-Based DDoS Detection and Windows Server / Active Directory
- Core competencies
- Experience and education (MSc Cybersecurity, BSc Computer Science)
- Contact and professional links

AB Fitness is intentionally excluded from the site and assets. The project-card imagery is illustrative and is **not** presented as screenshots of actual deployed software.

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. You can also open `index.html` directly in a browser.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Set **Framework Preset** to `Other` (static HTML).
3. Leave the build command blank and set the output directory to `.` if Vercel requires a value.
4. Deploy. Check DNS and domain assignments in the Vercel project settings before replacing an existing production domain.

If your current Vercel project is linked to this GitHub repository and its automatic production deployments are enabled, merging the changes into the production branch may trigger a redeploy.

## Directory structure

```text
index.html
styles.css
app.js
assets/
  samuel-exact-portrait.png
  project-1.webp
  project-2.webp
  project-3.webp
  project-4.webp
  approved-laptop.webp
  approved-wave.webp
  favicon.svg
```

## Credits and notes

Portrait: exact user-approved image. The visual design, textual content and animations are kept from the approved SAMX build. The photography/illustrative assets used in project cards must be reviewed for publication permissions before promotion on a public site.

Contact: [LinkedIn](https://www.linkedin.com/in/samuel-ogunlusi) | [GitHub](https://github.com/SamXl-Codes)
