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
- **100% Front-End & Easy to Edit**: Built strictly with HTML, CSS, and Vanilla JavaScript. No backend, database, or build tools required.

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
Simply double-click `index.html` to open in any web browser, or launch a simple local HTTP server:

```bash
# Using Python
python3 -m http.server 3000

# Using Node / npx
npx serve .
```

Open `http://localhost:3000` in your browser.

### Free One-Click Hosting
- **GitHub Pages**: Upload repository to GitHub -> Settings -> Pages -> Deploy from main branch.
- **Vercel / Netlify**: Drag & drop the project folder directly onto [Netlify Drop](https://app.netlify.com/drop) or [Vercel](https://vercel.com).
