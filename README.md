# Punith Gowda G — Portfolio Website

A modern, high-performance personal portfolio website for **Punith Gowda G** (AI/ML Engineer & Full Stack Developer), built with clean HTML5, CSS3, and JavaScript.

---

## 📁 Clean Project Structure

The project has been cleaned and structured for direct zero-configuration deployment to any static hosting provider:

```
portfolio/
├── index.html              # Main homepage & portfolio entry point
├── 404.html                # Custom branded 404 error page
├── robots.txt              # Search engine crawler directives
├── sitemap.xml             # XML sitemap for SEO indexing
├── .gitignore              # Ignores OS, IDE, and temporary files
├── vercel.json             # Vercel deployment & cache headers configuration
├── netlify.toml            # Netlify deployment & security headers configuration
├── css/
│   ├── style.css           # Design tokens, theme variables, core layouts & components
│   ├── animations.css      # Keyframe animations, hero effects & smooth transitions
│   └── responsive.css      # Mobile, tablet, and responsive breakpoints
├── js/
│   ├── main.js             # Interactions, theme toggling, scroll progress & animations
│   ├── bg3d.js             # Interactive 3D constellation canvas background
│   └── resume-generator.js # Dynamic resume preview & modal generator
├── assets/
│   ├── images/             # Profile photos & project screenshots
│   ├── certificates/       # Certification badges & credential images
│   ├── icons/              # Custom brand & tech stack icons
│   └── resume/             # PDF Resume (assets/resume/resume.pdf)
└── README.md               # Project documentation & deployment guide
```

---

## 🚀 How to Deploy

### Option 1: GitHub Pages (Recommended & Free)
1. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio release"
   ```
2. Create a new repository on GitHub (e.g. `portfolio` or `<your-username>.github.io`).
3. Link and push to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
4. On GitHub, go to **Settings** → **Pages** → under **Build and deployment**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)`
   - Click **Save**.
5. Your portfolio will be live at `https://<your-username>.github.io/<your-repo-name>/`!

---

### Option 2: Vercel (Instant 1-Click)
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** → **Project**.
3. Import your GitHub repository (or drag-and-drop the project folder).
4. Leave Build Command empty and Output Directory as `./` (handled automatically via `vercel.json`).
5. Click **Deploy**.

---

### Option 3: Netlify (Instant Drag-and-Drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this folder directly into Netlify.
3. Your site is live immediately with a free HTTPS URL!

---

## 🛠️ Local Development

To run and preview the website locally without any build steps:

```bash
# Using Python
python -m http.server 8000

# OR using Node's serve
npx serve .
```

Then open `http://localhost:8000` or `http://localhost:3000` in your browser.
