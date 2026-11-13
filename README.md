# Private Personal Relationship Website

An elegant, modern, minimal, and premium personal relationship website designed to showcase your story, photos, and special moments together.

---

## 🌟 Features

- **Hero Page**: Large focus couple photo, names badge, "Together since 20 February 2026", and CTA buttons.
- **Dynamic Relationship Counter**: Automatically calculates the exact duration (Months, Days) and features a live real-time ticking clock (Days, Hours, Minutes, Seconds) starting from 20 February 2026.
- **About Our Relationship**: Dedicated section for your story, how you met, special moments, favorite things, and a personal message.
- **Masonry Photo Gallery**: Aesthetic responsive collage arrangement supporting portrait, landscape, and square photos with smooth hover zoom effects.
- **Fullscreen Touch-Friendly Lightbox**: Click any photo to view in high resolution with Date, Place, Caption, Prev/Next navigation, Keyboard shortcuts (Arrow Keys / Esc), and mobile touch swipe support.
- **Session Photo Upload Preview**: HTML5 Drag & Drop or file picker to temporarily preview photos in your gallery during your browser session without needing a backend.
- **Private Sign-In**: Server-side Vercel authentication permits only the two configured accounts. There is no public account-creation flow.

---

## 📁 File Structure

```
/
├── index.html           # Home page (Hero, Counter, Teaser)
├── about.html           # About Our Relationship page
├── gallery.html         # Photo Gallery & Session Upload page
├── css/
│   └── style.css        # Responsive stylesheet & design system
├── js/
│   ├── config.js        # CENTRAL EDITABLE DATA FILE (Names, Story, Photos)
│   └── script.js        # Dynamic logic, counter, lightbox & gallery renderer
├── assets/
│   └── photos/          # Photo storage folder
│       ├── main-couple-photo.jpg
│       ├── photo1.jpg
│       ├── photo2.jpg
│       └── ...
└── README.md
```

---

## ✏️ How to Customize Your Content

All content is managed in **one single file**: `js/config.js`. You do **not** need to edit HTML code!

### 1. Changing Names & Start Date
Open `js/config.js` and update:

```javascript
partner1Name: "Ashwin",      // Replace with your name
partner2Name: "Ananya",      // Replace with her name
startDateISO: "2026-02-20",  // Format: YYYY-MM-DD
startDateFormatted: "20 February 2026",
```

### 2. Replacing the Main Hero Photo
1. Place your main couple image inside `assets/photos/main-couple-photo.jpg`.
2. Update the variable in `js/config.js`:
```javascript
heroPhoto: "assets/photos/main-couple-photo.jpg",
```

### 3. Editing Your Relationship Story
Update the `about` object in `js/config.js`:

```javascript
about: {
  howWeMet: "Your story of how you met...",
  howItStarted: "How your relationship bloomed...",
  ourStory: "Your story together...",
  specialMoments: "Surprise trips, milestones...",
  thingsWeLove: [
    "Exploring coffee shops",
    "Sunset walks on the beach"
  ],
  personalMessage: "A heart-felt message or quote..."
}
```

### 4. Adding or Editing Gallery Photos
Place your photos in `assets/photos/` (e.g., `my-photo.jpg`). Then add or edit entries in the `photos` array in `js/config.js`:

```javascript
{
  id: 13,
  image: "assets/photos/my-photo.jpg",
  date: "14 March 2026",
  place: "Alappuzha",
  caption: "A beautiful afternoon together",
  aspect: "portrait" // "portrait", "landscape", or "square"
}
```

---

## 🚀 How to Run Locally & Deploy

### Running Locally
Authentication is enforced by Vercel server-side middleware and API routes. Do not use Python's HTTP server, `npx serve`, or open the HTML files directly for a private deployment; those methods do not enforce login.

```bash
npx vercel dev
```

Before running locally, link the project with the Vercel CLI and create `.env.local` with the five environment variables listed below. Keep that file private; it is excluded from Git.

### Deploying Privately on Vercel
In the Vercel project settings, add these environment variables for the deployment:

- `ANNA_USERNAME`
- `ANNA_PASSWORD`
- `ASHWIN_USERNAME`
- `ASHWIN_PASSWORD`
- `AUTH_SECRET` — use a random secret of at least 32 characters (for example, generate one with `openssl rand -base64 32`)

Set the username and password values privately in Vercel; do not put real credentials in source files or commit them. After adding or changing variables, redeploy the project. Static-only hosts and simple local HTTP servers do not run the authentication middleware, so they cannot provide this access restriction.
