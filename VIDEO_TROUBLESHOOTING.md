# Video Upload & Playback Troubleshooting

## ✅ Fixed: Video Playback Issues

### What Was Fixed:

1. **Better video format validation** - Only accepts MP4, WebM, OGG
2. **Error handling** - Shows helpful message if video fails to load
3. **Proper video attributes** - Added `preload`, `loop`, and proper `muted` handling
4. **Format recommendations** - Guides users to use MP4 format

## How to Upload Videos Correctly

### Step 1: Prepare Your Video

**Recommended Format: MP4**
- Most compatible across all browsers
- Best compression
- Widely supported

**Recommended Settings:**
- Resolution: 720p (1280x720) or lower
- File size: Under 5MB (under 3MB is ideal)
- Codec: H.264
- Frame rate: 30fps or lower

### Step 2: Compress Your Video

Use one of these tools:

**Online Tools (Free):**
- https://www.freeconvert.com/video-compressor
- https://www.videosmaller.com/
- https://clideo.com/compress-video

**Desktop Tools:**
- HandBrake (free, powerful)
- VLC Media Player (free, can convert)
- FFmpeg (command line, advanced)

**Compression Tips:**
- Lower the resolution to 720p or 480p
- Reduce bitrate to 1-2 Mbps
- Use H.264 codec
- Keep videos short (under 30 seconds is ideal)

### Step 3: Upload

1. Go to "Diary" tab in edit panel
2. Click "Upload Video"
3. Select your MP4 file
4. Wait for upload to complete
5. You'll see "✓ Video uploaded"

## Troubleshooting

### Video Won't Upload

**Problem:** File too large
**Solution:** Compress the video to under 5MB

**Problem:** Wrong format
**Solution:** Convert to MP4 using online converter

**Problem:** Upload fails
**Solution:** Try a smaller file or refresh the page

### Video Uploaded But Won't Play

**Problem:** Video shows but doesn't play
**Solution:** 
1. Make sure it's MP4 format
2. Try re-uploading with a smaller file
3. Check if video plays in VLC player first
4. Try converting with HandBrake

**Problem:** Video is black/blank
**Solution:**
1. Video codec might not be supported
2. Re-encode with H.264 codec
3. Use HandBrake with "Web Optimized" preset

**Problem:** Video loads slowly
**Solution:**
1. File is too large - compress more
2. Use lower resolution (480p or 360p)
3. Reduce video length

### Video Plays on Desktop But Not Mobile

**Problem:** Format compatibility
**Solution:**
1. Use MP4 with H.264 codec
2. Avoid WebM or OGG for mobile
3. Test on mobile before sharing

## Quick Compression Guide (HandBrake)

1. Download HandBrake (free)
2. Open your video
3. Select "Web" preset
4. Set dimensions to 720p or lower
5. Click "Start Encode"
6. Result: Much smaller file!

## Recommended Video Specs

| Setting | Recommended | Maximum |
|---------|-------------|---------|
| Format | MP4 | MP4, WebM, OGG |
| Codec | H.264 | H.264, VP9 |
| Resolution | 720p | 1080p |
| File Size | 2-3MB | 10MB |
| Duration | 15-30 sec | 2 min |
| Bitrate | 1-2 Mbps | 5 Mbps |

## Example: Convert with FFmpeg

If you have FFmpeg installed:

```bash
# Compress video to 720p, 2Mbps
ffmpeg -i input.mp4 -vf scale=1280:720 -b:v 2M -c:v libx264 -c:a aac output.mp4

# Compress to 480p, 1Mbps (smaller)
ffmpeg -i input.mp4 -vf scale=854:480 -b:v 1M -c:v libx264 -c:a aac output.mp4
```

## Still Having Issues?

1. **Test the video file:**
   - Play it in VLC or browser first
   - Make sure it's not corrupted

2. **Check file size:**
   - Must be under 10MB
   - Recommended under 5MB

3. **Verify format:**
   - MP4 is most reliable
   - H.264 codec required

4. **Try a different video:**
   - Use a test video to see if upload works
   - If test works, original video has issues

5. **Clear browser cache:**
   - Sometimes old data interferes
   - Try incognito/private mode

## Summary

✅ **Use MP4 format with H.264 codec**
✅ **Keep file size under 5MB**
✅ **Compress with HandBrake or online tools**
✅ **Test video before uploading**
✅ **Lower resolution if needed (720p or 480p)**

Videos should now upload and play correctly! 🎥
