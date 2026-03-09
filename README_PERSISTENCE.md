# Anniversary Website - Data Persistence

## ✨ What's New

Your anniversary website now has **persistent storage** that works across devices and browsers!

### Key Features:
- ✅ Upload images and videos (up to 10MB each)
- ✅ Edit all text content
- ✅ Save changes to the server
- ✅ Share the link - others see your content
- ✅ No database needed - uses simple JSON file

---

## 🚀 Quick Setup (3 Steps)

```bash
# Step 1: Install dependencies
npm install

# Step 2: Create data folder
npm run setup

# Step 3: Start the server
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## 📝 How to Use

### 1. Edit Your Content
- Click the **"Edit Our Story ✨"** button (bottom right)
- Navigate through tabs: General, Photos, Diary, Memories, etc.
- Upload images/videos by clicking "Upload" buttons
- Edit text in any field

### 2. Save Your Changes
- Scroll to the bottom of the edit panel
- Click the **"Save Changes"** button
- Wait for: **"✓ Saved successfully!"**

### 3. Share with Others
- Copy your website URL
- Send it to anyone
- They'll see all your uploaded content!

---

## 📁 How It Works

### Data Storage
```
public/data/site-data.json  ← All your content is saved here
```

### What Gets Saved:
- Images (converted to base64)
- Videos (converted to base64)
- All text content
- Settings and preferences

### Sharing Behavior:
1. **You upload** images/videos on your laptop
2. **You click** "Save Changes"
3. **Data is saved** to `public/data/site-data.json`
4. **You share** the website link
5. **Others see** your uploaded content when they visit

---

## ⚠️ Important Notes

### File Size Limits
- **Maximum**: 10MB per file
- **Recommended**: 
  - Images: Under 2MB
  - Videos: Under 5MB
- **Warning**: Files over 5MB will show a confirmation dialog

### Browser Behavior
- Changes are saved **locally** as you edit (instant)
- Changes are saved **to server** when you click "Save Changes"
- Others won't see changes until you click "Save Changes"

### Data Persistence
- ✅ Survives browser refresh
- ✅ Survives browser close
- ✅ Visible to all visitors
- ✅ Persists across devices
- ❌ Not backed up automatically (see Backup section)

---

## 🔧 Troubleshooting

### "Failed to save" Error

**Solution 1**: Run setup script
```bash
npm run setup
```

**Solution 2**: Manually create folder
```bash
mkdir -p public/data
```

**Solution 3**: Check permissions
- Ensure `public/data` folder is writable
- On Linux/Mac: `chmod 755 public/data`

**Solution 4**: Verify setup
```bash
npm run verify
```

### Videos Not Playing
- Ensure video is under 10MB
- Use MP4 format (best compatibility)
- Try compressing the video
- Check browser console for errors

### Changes Not Visible to Others
- Make sure you clicked "Save Changes" button
- Check that `public/data/site-data.json` exists
- Have the other person refresh their browser
- Check that you're sharing the correct URL

---

## 💾 Backup Your Data

Your content is stored in one file. Back it up regularly!

```bash
# Copy the data file to a safe location
cp public/data/site-data.json ~/backup/site-data-backup.json
```

### Restore from Backup
```bash
# Copy backup back to data folder
cp ~/backup/site-data-backup.json public/data/site-data.json
```

---

## 🌐 Deployment

### Works With:
- ✅ Traditional hosting (VPS, shared hosting)
- ✅ Platforms with persistent storage
- ✅ Self-hosted servers

### Doesn't Work With:
- ❌ Vercel (serverless, no persistent files)
- ❌ Netlify (serverless, no persistent files)
- ❌ Other serverless platforms

### For Serverless Platforms:
You'll need to use:
- Cloud storage (AWS S3, Cloudinary)
- Database (Supabase, Firebase, MongoDB)
- Or deploy to a platform with persistent storage

---

## 📊 File Size Reference

| File Type | Recommended | Maximum | Notes |
|-----------|-------------|---------|-------|
| Images    | < 2MB       | 10MB    | JPEG/PNG work best |
| Videos    | < 5MB       | 10MB    | MP4 recommended |
| Audio     | < 5MB       | 10MB    | MP3 recommended |

### Compression Tips:
- **Images**: Use tools like TinyPNG, Squoosh
- **Videos**: Use HandBrake, FFmpeg
- **Online**: Use online compressors

---

## 🛠️ Technical Details

### Architecture
```
Browser (Edit Panel)
    ↓ (Save Changes)
API Route (/api/save)
    ↓ (Write File)
public/data/site-data.json
    ↓ (Read File)
All Visitors See Content
```

### API Endpoints
- `POST /api/save` - Save data to server
- `GET /api/save` - Load data from server

### Fallback Strategy
1. Try loading from API
2. Try loading from public/data/site-data.json
3. Fall back to localStorage
4. Fall back to default data

---

## 📚 Additional Resources

- `QUICK_START.md` - Quick setup guide
- `DATA_PERSISTENCE.md` - Detailed technical docs
- `SETUP_INSTRUCTIONS.txt` - Step-by-step instructions

---

## 🆘 Need Help?

1. Run verification: `npm run verify`
2. Check browser console for errors
3. Check terminal for server errors
4. Ensure files are under 10MB
5. Try refreshing the page

---

## ✅ Checklist

Before sharing your website:

- [ ] Ran `npm run setup`
- [ ] Uploaded all images
- [ ] Uploaded all videos
- [ ] Edited all text
- [ ] Clicked "Save Changes"
- [ ] Saw "✓ Saved successfully!" message
- [ ] Verified `public/data/site-data.json` exists
- [ ] Tested on another device/browser
- [ ] Backed up the data file

---

**Enjoy your anniversary website! 💕**
