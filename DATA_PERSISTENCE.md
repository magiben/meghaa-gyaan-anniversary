# Data Persistence Guide

## How It Works

Your anniversary website now saves all uploaded images, videos, and text changes to a file on the server, making them visible to everyone who visits the site.

## Key Features

1. **Local Editing**: Changes are saved locally in your browser as you edit
2. **Server Persistence**: Click "Save Changes" to upload to the server
3. **Global Visibility**: Once saved to server, everyone sees the same content
4. **No Database Required**: Uses a simple JSON file (`data/site-data.json`)

## How to Use

1. Click "Edit Our Story ✨" button
2. Upload images/videos and edit text in any tab
3. Changes are saved locally as you work
4. Click the **"Save Changes"** button at the bottom
5. Wait for confirmation: "✓ Saved successfully!"
6. Your changes are now live for everyone

## Technical Details

- Images and videos are converted to base64 format
- Data is stored in `data/site-data.json` on the server
- The data folder is gitignored to prevent accidental commits
- Falls back to localStorage if server data doesn't exist

## File Size Limitations

Since media files are stored as base64 in JSON:
- Keep images under 2MB each
- Keep videos under 5MB each
- For larger files, consider using external hosting (YouTube, Imgur, etc.) and paste the URL

## Deployment Note

When deploying to a hosting service:
- Ensure the `data` folder has write permissions
- Some serverless platforms (Vercel, Netlify) don't support file writes
- For those platforms, you'll need to use a database or external storage service
