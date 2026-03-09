# Quick Start Guide

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create data folder:**
   ```bash
   node setup-data-folder.js
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Go to `http://localhost:3000`
   - Click "Edit Our Story ✨" button
   - Upload your images and videos
   - Edit text as needed
   - Click "Save Changes" at the bottom

## Sharing Your Website

Once you've saved your changes:
1. The data is stored in `public/data/site-data.json`
2. Anyone who visits your website will see the same content
3. Share your website URL with others
4. They'll see all your uploaded images, videos, and text

## Important Notes

- **File Size Limit**: 10MB per file (images/videos)
- **Best Performance**: Keep images under 2MB, videos under 5MB
- **Data Location**: `public/data/site-data.json` (gitignored)
- **Backup**: Save a copy of `site-data.json` to backup your content

## Troubleshooting

**"Failed to save" error:**
- Make sure `public/data` folder exists (run `node setup-data-folder.js`)
- Check file permissions on the folder
- Try refreshing the page

**Videos not playing:**
- Ensure video is under 10MB
- Try a different video format (MP4 works best)
- Check browser console for errors

**Changes not visible to others:**
- Make sure you clicked "Save Changes" button
- Check that `public/data/site-data.json` file was created
- Refresh the page on the other device

## Need Help?

Check `DATA_PERSISTENCE.md` for detailed technical information.
