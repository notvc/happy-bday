# Birthday Website - Complete Setup Guide

## 🚀 Quick Start

### 1. **Audio Setup** (IMPORTANT)
Your website plays birthday music on load. You need to add an audio file:

**Steps:**
- Place an audio file named `happy_birthday.mp3` in the same folder as `index.html`
- Or update the filename in `script.js` line 389 if you use a different filename

**Recommended Audio:**
- Any MP3 file you like (royalty-free music from Pixabay, YouTube, etc.)
- Suggested: Find celebratory/birthday music on Pixabay.com

### 2. **Supabase Database Setup** (Optional but Recommended)

#### Create Tables in Supabase:

**Table 1: `memories`**
```sql
CREATE TABLE memories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  image_url TEXT NOT NULL,
  caption TEXT
);
```

**Table 2: `birthday_pics`**
```sql
CREATE TABLE birthday_pics (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  image_url TEXT NOT NULL
);
```

#### Enable Row Level Security:
1. Go to your Supabase project
2. Click **SQL Editor** → Create a new query
3. Enable RLS on both tables
4. Add this policy for public READ access:

```sql
CREATE POLICY "Allow public read access"
ON memories FOR SELECT
USING (true);

CREATE POLICY "Allow public read access"
ON birthday_pics FOR SELECT
USING (true);
```

#### Get Your Credentials:
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **Anon/Public key**
3. Update `script.js` lines 9-10:
```javascript
const SB_URL = "YOUR_PROJECT_URL";
const SB_KEY = "YOUR_ANON_KEY";
```

### 3. **Upload Images**

- **Upload images to Supabase Storage** or use external URLs
- Add image URLs to your tables:
  - For `memories`: Add `image_url` and optional `caption`
  - For `birthday_pics`: Add `image_url`

### 4. **Customize Your Message**

Edit `index.html` to personalize:
- Line 67: Birthday title (change "Happy Birthday Love")
- Line 68: Subtitle 
- Line 168: Main birthday message
- Change "Jewel" to the person's name

### 5. **Set the Birthday Date**

In `script.js` line 18, update:
```javascript
const BIRTHDAY_DATE = new Date('2026-05-10T20:00:00').getTime();
```

Format: `'YYYY-MM-DDTHH:MM:SS'`

---

## 🐛 Troubleshooting

### Music Won't Play
**Issue:** Button shows but music doesn't start
- ✅ Check that `happy_birthday.mp3` exists in the project folder
- ✅ Chrome/Firefox block autoplay - user must click first
- ✅ Check browser console (F12) for errors
- ✅ Verify file format is MP3 (not WAV, OGG, etc.)

### Carousel Not Showing
**Issue:** Memories carousel blank/shows error
- ✅ Check Supabase credentials in `script.js`
- ✅ Verify table names are exactly `memories` and `birthday_pics`
- ✅ Check RLS policies are enabled for public SELECT
- ✅ Confirm images are uploaded and URLs are correct
- ✅ Open browser console (F12) - check for database errors

### Early Screen Shows Instead of Birthday Page
**Issue:** Page shows "It's not yet your birthday"
- ✅ Check the `BIRTHDAY_DATE` in `script.js` 
- ✅ Verify your computer's date/time is correct
- ✅ Date should be in the past to see birthday page

### Theme Switching Not Working
- ✅ Double-click (desktop) or double-tap (mobile) on the page
- ✅ Your choice is saved to browser storage
- ✅ Works on any element except buttons

### Images Not Loading
- ✅ Check image URLs are public (not private)
- ✅ Verify URLs are complete (including `https://`)
- ✅ Test URLs directly in browser address bar
- ✅ Use `https://` not `http://` for security

---

## 📱 Deployment

### GitHub Pages (Free)
1. Push project to GitHub
2. Go to Settings → Pages
3. Set source to `main` branch
4. Site will be live at `github.com/username/repo`

### Netlify (Free)
1. Connect GitHub repo
2. Build command: (leave empty)
3. Deploy folder: `.` (root)
4. Done! URL will be auto-generated

### Vercel (Free)
1. Import project
2. Default settings work
3. Deploy with one click

---

## ✨ Improvements Made

- ✅ **Fixed Audio Constructor Bug** - Was passing 2 arguments, now correctly passes 1
- ✅ **Removed Duplicate Script Tag** - Clean HTML
- ✅ **Better Error Handling** - Shows helpful messages for failed database connections
- ✅ **Accessibility Improvements** - Focus states for keyboard navigation
- ✅ **Keyboard Support** - Arrow keys navigate carousel when hovered
- ✅ **Better Button Labels** - Improved ARIA labels for screen readers
- ✅ **Music Feedback** - Shows status when playback fails
- ✅ **Setup Documentation** - Clear checklist for configuration

---

## 📞 Need Help?

Check the browser console (F12 → Console tab) for error messages. Most issues will log there with helpful details.

---

**Made with ♥** — Happy Birthday! 🎂
