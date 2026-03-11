# Anniversary Website 💕

A beautiful anniversary website where you can upload photos, videos, and personalized messages to share with your partner.

## 🚀 JUST FIXED: "Failed to save online" Error

**If you're seeing this error, read `START_HERE.md` for the fix!**

The issue has been resolved - API body size limit increased from 4MB to 50MB.

## How It Works

### For the Person Creating the Content:

1. **Open the website** (your deployed URL)
2. **Click "Edit Our Story ✨"** button (bottom right)
3. **Upload your content:**
   - Add photos (auto-compressed, max 10MB each)
   - Add videos (max 10MB each, MP4 recommended)
   - Add background music
   - Edit all text messages
4. **Generate short share link:**
   - Go to "Settings" tab
   - Click "🔗 Generate Share Link"
   - System shows data size (e.g., "Uploading 12.45MB...")
   - Short link is created and copied to clipboard
   - Example: `yoursite.com?id=aB3xY9zK`
5. **Send the link** to your partner via WhatsApp, Email, SMS, etc.

### For the Partner:

1. **Click the short link** you received
2. **See everything** - all photos, videos, and messages
3. **No configuration needed** - just click and view!

## Features

- 📸 Upload multiple photos (auto-compressed to ~500KB each)
- 🎥 Upload videos (MP4 format recommended)
- ✍️ Customize all text content
- 🎵 Add background music
- 🔗 Generate short shareable link (e.g., `yoursite.com?id=aB3xY9zK`)
- 💝 Beautiful animations and design
- 📱 Works on all devices
- ⚡ Fast and lightweight
- 💾 Up to 50MB total storage per link

## Storage Limits

- **Total data**: 50MB maximum
- **Single file**: 10MB maximum
- **Photos**: Auto-compressed (1200px, 70% quality)
- **Videos**: Keep under 5MB for best performance
- **Audio**: Keep under 5MB

## Setup

```bash
npm install
npm run dev
```

## Deployment

Deploy to Vercel (recommended):

```bash
git add .
git commit -m "Deploy anniversary website"
git push
```

Vercel will automatically deploy. The share link system works perfectly with serverless deployments.

## 📚 Documentation

- **`START_HERE.md`** - Quick start after deploying the fix
- **`DEPLOY_FIX_NOW.md`** - Fast deployment guide (2 minutes)
- **`UNLIMITED_STORAGE_SETUP.md`** - Detailed storage information
- **`HOW_TO_USE.md`** - Complete user guide
- **`VIDEO_TROUBLESHOOTING.md`** - Video upload help

## Tips

- Images auto-compress to save space
- Use MP4 format for videos
- Keep videos under 30 seconds
- Test the share link in incognito mode before sending
- The short link is stored on the server (resets on redeploy)

## Troubleshooting

### "Failed to save online"
1. Deploy the latest code (see `START_HERE.md`)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check console (F12) for detailed errors

### "Data too large"
1. Remove some photos or videos
2. Use shorter video clips
3. Compress videos before uploading

### Videos not playing
1. Use MP4 format
2. Keep under 10MB
3. See `VIDEO_TROUBLESHOOTING.md`

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI

## Important Notes

⚠️ **Data Storage**: Links are stored in server memory and reset on redeploy. This is perfect for one-time special occasions. Create and share immediately for best experience.

✅ **Best For**: Anniversaries, birthdays, Valentine's Day, and other special moments!

---

Built with ❤️ for special moments
