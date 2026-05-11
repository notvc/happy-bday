# 🆘 Quick Troubleshooting Reference

## Common Issues & Solutions

### 🔊 Music Not Playing

| Issue | Solution |
|-------|----------|
| Button doesn't appear | Check browser console (F12) for JS errors |
| Button shows, no sound | 1. Add `happy_birthday.mp3` to project folder<br>2. Check file format is MP3<br>3. Click button to start (autoplay usually blocked) |
| "Unavailable" message | File missing or wrong filename - rename to `happy_birthday.mp3` |
| Works on desktop, not mobile | Browser may require user interaction first - tap screen |

**Fix:** File must be in same folder as `index.html`

---

### 🖼️ Carousel Not Loading

| Symptom | Cause | Fix |
|---------|-------|-----|
| Shows settings icon | Supabase not connected | Update SB_URL & SB_KEY in script.js |
| Shows error icon | Table doesn't exist | Create `memories` table in Supabase |
| Empty carousel | No data | Add rows to memories table |
| Images won't load | URLs invalid | Check image URLs are public & complete |

**Debug:** Open browser console (F12 → Console) and look for red errors

---

### 📅 Early Screen Shows Instead of Birthday Page

```
"It's not yet your birthday MaMa"
```

**Causes:**
- [ ] Computer date is before birthday date
- [ ] BIRTHDAY_DATE set incorrectly in script.js

**Fix:** 
```javascript
// Check this line in script.js (line 18)
const BIRTHDAY_DATE = new Date('2026-05-10T20:00:00').getTime();
// Should be: your actual birthday date
```

---

### 🎨 Theme Colors Not Working

**Desktop:** Double-click page background → should see toast notification
**Mobile:** Double-tap page → should switch theme

**If not working:**
- [ ] Try double-clicking away from buttons
- [ ] Disable browser extensions (some block double-click)
- [ ] Check localStorage isn't disabled

---

### ⌨️ Keyboard Navigation Issues

| Feature | Should Work |
|---------|------------|
| Arrow keys in carousel | ✅ Only when carousel is hovered |
| Tab navigation | ✅ Works on all buttons |
| Enter on buttons | ✅ Should activate |

---

## Browser Console Errors Explained

### ❌ "Uncaught TypeError: Cannot read properties of null"
- **Cause:** Element not found in HTML
- **Fix:** Check element IDs in script.js match HTML

### ❌ "401 Unauthorized" (Supabase errors)
- **Cause:** Invalid credentials or RLS policy
- **Fix:** 
  1. Check SB_KEY is correct
  2. Verify RLS policy allows SELECT for anonymous users

### ❌ "Failed to fetch"
- **Cause:** Network error or invalid URL
- **Fix:** Check Supabase URL is complete and includes `https://`

---

## Performance Tips

**Slow carousel?**
- Compress images before uploading
- Use modern formats (JPEG, WebP)
- Limit to < 5MB per image

**Lagging animations?**
- Reduce confetti count (line 53 in script.js)
- Disable background noise texture if needed (style.css line 55)

---

## Mobile Checklist

- [ ] Responsive design works (test on smaller screens)
- [ ] Touch events work (carousel swipe, double-tap for theme)
- [ ] Music button accessible
- [ ] No horizontal scroll
- [ ] Text readable without zooming

---

## Deployment Checklist

Before going live:

- [ ] Audio file included
- [ ] Supabase configured (if using carousel)
- [ ] Birthday date set correctly
- [ ] Personalized text updated
- [ ] All images accessible
- [ ] Tested on phone & desktop
- [ ] Console shows no errors (F12)
- [ ] Music plays on first click

---

## Need More Help?

1. **Check the docs:**
   - `SETUP_GUIDE.md` - Full setup instructions
   - `FIXES_SUMMARY.md` - What was fixed and improved

2. **Browser Developer Tools (F12):**
   - Console tab: Shows all errors with line numbers
   - Network tab: Check if images/API calls fail
   - Application tab: Check localStorage works

3. **Common Fixes:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear cache: Hard refresh page
   - Check internet: Verify connection works

---

**Still stuck?** Check browser console for error messages - they usually tell you exactly what's wrong! 🔍
