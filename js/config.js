/**
 * ====================================================================
 * PERSONAL RELATIONSHIP WEBSITE CONFIGURATION
 * ====================================================================
 * Welcome! All your personal details, text, names, dates, and photos 
 * can be easily changed right here in this file.
 * 
 * Simply replace the placeholder values below with your actual information.
 * You do NOT need to touch HTML or CSS files!
 */

const CONFIG = {
  // ------------------------------------------------------------------
  // 1. COUPLE INFORMATION
  // ------------------------------------------------------------------
  partner1Name: "Ashwin",  // Your name
  partner2Name: "Anna",    // Her name
  
  // Relationship start date in YYYY-MM-DD format (used for dynamic duration calculation)
  // Format: "YYYY-MM-DD" -> "2026-02-20" means 20 February 2026
  startDateISO: "2026-02-20",
  startDateFormatted: "20 February 2026",

  // Main hero photo path (displayed on the home page)
  heroPhoto: "assets/photos/main-couple-photo.jpg",
  heroSubtitle: "Together since 20 February 2026",

  // ------------------------------------------------------------------
  // 2. ABOUT OUR RELATIONSHIP CONTENT
  // ------------------------------------------------------------------
  about: {
    heroTitle: "About Our Relationship",
    journeyStart: "20 February 2026",
    
    // Editable text sections
    howWeMet: "[How we met - Replace this text with the story of your first meeting, where you were, and your very first impressions of each other.]",
    howItStarted: "[How it started - Replace this text with details on how your relationship bloomed, your first official date, or when you realized it was special.]",
    ourStory: "[Our story goes here - Replace this text with an overview of your journey together, milestones reached, and how you have grown side-by-side.]",
    specialMoments: "[Our special memories - Replace this text with memorable dates, surprise trips, late-night talks, or milestones you cherish.]",
    thingsWeLove: [
      "[Favorite shared hobby or activity, e.g., Exploring cozy coffee shops]",
      "[Favorite travel memory, e.g., Sunset walks along the beach]",
      "[Shared ritual, e.g., Late night movies and homemade dinner]",
      "[Shared dream, e.g., Traveling the world together]"
    ],
    memories: "[Unforgettable moments - Replace this text with a list or narrative of small, sweet everyday moments that define your bond.]",
    personalMessage: "[Personal message - A heart-felt message or quote expressing your love, appreciation, and excitement for all the years ahead.]"
  },

  // ------------------------------------------------------------------
  // 3. PHOTO GALLERY DATA (Our Memories)
  // ------------------------------------------------------------------
  // Add, edit, or remove photos in this array.
  // Make sure your image files are placed in the `assets/photos/` folder!
  photos: [
    {
      id: 1,
      image: "assets/photos/photo1.jpg",
      date: "20 February 2026",
      place: "Special Moment",
      caption: "Smiling side by side",
      aspect: "portrait"
    },
    {
      id: 2,
      image: "assets/photos/photo2.jpg",
      date: "05 March 2026",
      place: "Unforgettable Day",
      caption: "A sweet moment together",
      aspect: "portrait"
    },
    {
      id: 3,
      image: "assets/photos/photo3.jpg",
      date: "24 March 2026",
      place: "Together Always",
      caption: "Every memory with you is a favorite",
      aspect: "portrait"
    },
    {
      id: 4,
      image: "assets/photos/photo4.jpg",
      date: "10 April 2026",
      place: "Our Story",
      caption: "Looking forward to all the years ahead",
      aspect: "portrait"
    },
    {
      id: 5,
      image: "assets/photos/photo5.jpg",
      date: "01 May 2026",
      place: "Golden Hours",
      caption: "Laughing together",
      aspect: "portrait"
    },
    {
      id: 6,
      image: "assets/photos/photo6.jpg",
      date: "18 May 2026",
      place: "Sweet Day",
      caption: "Soft lighting & happy memories",
      aspect: "portrait"
    },
    {
      id: 7,
      image: "assets/photos/photo7.jpg",
      date: "05 June 2026",
      place: "Outing Together",
      caption: "A day filled with joy",
      aspect: "portrait"
    },
    {
      id: 8,
      image: "assets/photos/photo8.jpg",
      date: "22 June 2026",
      place: "Cherished Moment",
      caption: "Holding hands & making memories",
      aspect: "portrait"
    },
    {
      id: 9,
      image: "assets/photos/photo9.jpg",
      date: "10 July 2026",
      place: "Happy Smiles",
      caption: "Every day with you is special",
      aspect: "portrait"
    },
    {
      id: 10,
      image: "assets/photos/photo10.jpg",
      date: "04 August 2026",
      place: "Memories Shared",
      caption: "Simple moments, deepest bond",
      aspect: "portrait"
    },
    {
      id: 11,
      image: "assets/photos/photo11.jpg",
      date: "19 August 2026",
      place: "Special Date",
      caption: "Love and warmth",
      aspect: "portrait"
    },
    {
      id: 12,
      image: "assets/photos/photo12.jpg",
      date: "15 September 2026",
      place: "Forever Journey",
      caption: "Together for a lifetime",
      aspect: "portrait"
    }
  ]
};

// Make config available globally
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
