# Happy Birthday Website 🎂

A beautiful, interactive, and customizable birthday website. Featuring personalized messages, a floating cake animation, a memories carousel, and dynamically loaded galleries.

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **SETUP_GUIDE.md** | 📋 Complete setup checklist & instructions |
| **FIXES_SUMMARY.md** | 🔧 All improvements and bugs fixed |
| **TROUBLESHOOTING.md** | 🆘 Quick problem solving reference |

**Start here:** [SETUP_GUIDE.md](SETUP_GUIDE.md)

## ✨ Features

* **Interactive Intro:** Confetti animation splash screen.
* **CSS Animations:** Floating animated birthday cake with flickering candles and background sparkles.
* **Memories Carousel:** Fetches images and custom captions directly from a database.
* **Dynamic Birthday Gallery:** Loads a secondary grid of birthday pictures dynamically.
* **Early Access Screen:** Automatically hides the main content and shows an "early" screen if the visitor opens the page before the actual birthday.
* **Theme Toggling:** Double-click (desktop) or double-tap (mobile) anywhere to cycle through 3 different color modes (Red, Navy, Black). The chosen theme saves to local storage.
* **Keyboard Navigation:** Use arrow keys to navigate the carousel.
* **Accessibility:** Full keyboard navigation support, proper focus indicators, and screen reader friendly.
* **Error Handling:** Friendly error messages if database or audio fails.

## 🚀 Setup Instructions

1. **Clone or download the repository** and open the project folder.
2. **Set up Supabase**:
   * Create a new project at [Supabase](https://supabase.com/).
   * Get your Project URL and anon/public key.
   * Open `script.js` and replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual credentials.
3. **Set the Birthday Date:** Open `script.js` and update the `BIRTHDAY_DATE` variable (e.g., `'2026-05-12T00:00:00'`) to exactly when the page should unlock.
4. **Host your site:** You can easily host this folder using GitHub Pages, Vercel, Netlify, or simply open `index.html` in your browser for local testing.

## 🗄️ Database Schema (Supabase)

To make the carousel and gallery work, you need to create two tables in your Supabase project. 

> **Note:** Make sure to **Enable Row Level Security (RLS)** and add a `SELECT` policy allowing anonymous users to read the data.

**Table 1: `memories`**
* `id` (int8, primary key)
* `image_url` (text)
* `caption` (text, nullable)

**Table 2: `birthday_pics`**
* `id` (int8, primary key)
* `image_url` (text)

Upload your images to Supabase Storage (or another image hosting service) and paste the public URLs into the `image_url` column of these tables.

## 🎨 Customization

* **Text & Messages:** Open `index.html` to change the main "Happy Birthday" texts, the subtitle, and the large personalized paragraph in the `<section id="birthday">`.
* **Themes & Colors:** Open `style.css` and look at the very top. You can tweak the hex codes for `--bg`, `--accent`, and `--text` under the `[data-mode]` selectors to completely change the vibe.
* **Cake Colors:** In `style.css`, locate the `.candle-body` and `.tier-body` classes to change the gradient colors of the birthday cake.
