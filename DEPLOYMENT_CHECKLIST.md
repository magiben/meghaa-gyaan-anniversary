# Deployment Checklist

## Before Deploying

- [ ] All content uploaded and saved
- [ ] Tested "Save Changes" button works
- [ ] Verified `public/data/site-data.json` exists
- [ ] Backed up `site-data.json` file
- [ ] Tested on multiple browsers
- [ ] Checked all images load correctly
- [ ] Checked all videos play correctly

## Deployment Options

### ✅ Option 1: Traditional Hosting (Recommended)
**Works with**: VPS, Shared Hosting, DigitalOcean, Linode, AWS EC2

**Steps**:
1. Build the project: `npm run build`
2. Upload files to server
3. Ensure `public/data` folder has write permissions
4. Start the server: `npm start`

**Pros**:
- File writes work perfectly
- No additional setup needed
- Data persists between deployments

---

### ❌ Option 2: Serverless (Requires Changes)
**Platforms**: Vercel, Netlify, AWS Lambda

**Problem**: These platforms don't support persistent file writes

**Solutions**:

#### A. Use Cloud Storage
- AWS S3
- Cloudinary
- Google Cloud Storage
- Requires code changes to use storage API

#### B. Use Database
- Supabase (free tier available)
- Firebase (free tier available)
- MongoDB Atlas (free tier available)
- Requires code changes to use database

#### C. Deploy to Different Platform
- Railway.app (supports file writes)
- Render.com (supports file writes)
- Fly.io (supports file writes)

---

## Post-Deployment

### Test Everything:
1. [ ] Visit your deployed URL
2. [ ] Check if existing content loads
3. [ ] Click "Edit Our Story ✨"
4. [ ] Upload a test image
5. [ ] Click "Save Changes"
6. [ ] Refresh the page
7. [ ] Verify image is still there
8. [ ] Open in incognito/private window
9. [ ] Verify content is visible

### Share with Others:
1. [ ] Copy your website URL
2. [ ] Send to someone else
3. [ ] Have them open it
4. [ ] Verify they see your content

---

## Backup Strategy

### Before Deployment:
```bash
# Backup your data
cp public/data/site-data.json backup-$(date +%Y%m%d).json
```

### After Deployment:
- Download `site-data.json` from server regularly
- Keep local backups
- Consider automated backups if using cloud hosting

---

## Troubleshooting Deployment

### Issue: "Save Changes" fails after deployment

**Check**:
1. Does `public/data` folder exist on server?
2. Does the folder have write permissions?
3. Is the platform serverless? (won't work)
4. Check server logs for errors

**Fix**:
```bash
# On server, ensure folder exists and is writable
mkdir -p public/data
chmod 755 public/data
```

### Issue: Content not visible to others

**Check**:
1. Did you click "Save Changes"?
2. Does `public/data/site-data.json` exist on server?
3. Is the file readable by the web server?
4. Check browser console for errors

**Fix**:
```bash
# On server, check file permissions
chmod 644 public/data/site-data.json
```

### Issue: Videos not playing after deployment

**Check**:
1. Is video under 10MB?
2. Is video format supported (MP4 recommended)?
3. Check browser console for errors
4. Try different video codec

---

## Platform-Specific Notes

### Vercel / Netlify
- ❌ File writes don't persist
- Use database or cloud storage instead
- Or deploy to different platform

### Railway / Render / Fly.io
- ✅ File writes work
- Ensure persistent volume is configured
- Follow platform docs for file storage

### VPS / Shared Hosting
- ✅ File writes work perfectly
- Just ensure folder permissions are correct
- No special configuration needed

---

## Security Considerations

### Password Protection
- Enable in Settings tab of edit panel
- Set a strong password
- Share password only with trusted people

### File Access
- `public/data/site-data.json` is publicly accessible
- Anyone can download it if they know the path
- Consider adding authentication if needed

### Backup Security
- Keep backups in secure location
- Don't commit `site-data.json` to public repos
- It's already in `.gitignore`

---

## Performance Tips

### Optimize Before Deploying:
1. Compress all images (use TinyPNG, Squoosh)
2. Compress all videos (use HandBrake)
3. Keep files under recommended sizes
4. Test loading speed

### After Deployment:
1. Use CDN if available
2. Enable gzip compression
3. Monitor page load times
4. Consider lazy loading for images

---

## Need Help?

1. Check server logs for errors
2. Test locally first: `npm run dev`
3. Verify setup: `npm run verify`
4. Check platform documentation
5. Ensure file permissions are correct

---

**Good luck with your deployment! 🚀**
