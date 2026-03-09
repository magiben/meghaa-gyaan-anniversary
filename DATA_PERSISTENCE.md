# Data Persistence Guide

## How It Works

Your anniversary website now saves all uploaded images, videos, and text changes to a file on the server (`public/data/site-data.json`), making them visible to everyone who visits the site.

## Key Features

1. **Local Editing**: Changes are saved locally in your browser as you edit
2. **Server Persistence**: Click "Save Changes" to upload to the server
3. **Global Visibility**: Once saved to server, everyone sees the same content
4. **No Database Required**: Uses a simple JSON file
5. **10MB File Limit**: Upload images and videos up to 10MB each

## How to Use

1. Click "Edit Our Story ✨" button
2. Upload images/videos and edit text in any tab
3. Changes are saved locally as you work
4. Click the **"Save Changes"** button at the bottom
5. Wait for confirmation: "✓ Saved successfully!"
6. Share the website link - others will see your uploaded content!

## Technical Details

- Images and videos are converted to base64 format
- Data is stored in `public/data/site-data.json` on the server
- The data folder is gitignored to prevent accidental commits
- Falls back to localStorage if server data doesn't exist
- Maximum file size: 10MB per file

## File Size Recommendations

- **Images**: Keep under 2MB for best performance
- **Videos**: Keep under 10MB (you'll get a warning over 5MB)
- **For larger files**: Consider using external hosting (YouTube for videos, Imgur for images) and paste the URL instead

## Troubleshooting

If "Save Changes" fails:
1. Check that the `public/data` folder exists and is writable
2. Try refreshing the page and saving again
3. Check browser console for error messages
4. Ensure your files are under 10MB each

## Deployment Note

When deploying:
- **Traditional hosting** (VPS, shared hosting): Works out of the box
- **Serverless platforms** (Vercel, Netlify): File writes don't persist between deployments
  - For these platforms, consider using a database (Supabase, Firebase) or cloud storage (S3, Cloudinary)
  - Or deploy to a platform that supports persistent file storage
