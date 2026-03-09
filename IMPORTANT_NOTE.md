# Important Note About Short Links

## How It Works

The short link system uses an in-memory store on the server. This means:

### ✅ Advantages:
- **Very short links**: Just 8 characters (e.g., `yoursite.com?id=aB3xY9zK`)
- **Easy to share**: No long URLs to copy/paste
- **Fast**: Instant link generation

### ⚠️ Important Limitation:

**The in-memory store resets when:**
- You redeploy your website
- The serverless function restarts (on platforms like Vercel)
- The server restarts

This means **old links may stop working after a redeploy**.

## Solution for Production

For a production environment where links should persist forever, you have two options:

### Option 1: Use Vercel KV (Redis) - Recommended
```bash
# Install Vercel KV
npm install @vercel/kv

# Update app/api/share/route.ts to use KV instead of Map
```

### Option 2: Use Vercel Postgres
```bash
# Install Vercel Postgres
npm install @vercel/postgres

# Create a table to store the data
# Update app/api/share/route.ts to use Postgres
```

### Option 3: Use Any Database
- Supabase (free tier)
- Firebase (free tier)
- MongoDB Atlas (free tier)
- PlanetScale (free tier)

## For Your Use Case

Since this is for a one-time anniversary gift:
1. Your friend creates the content
2. Generates the link
3. Sends it to her partner
4. Partner views it

**As long as you don't redeploy between steps 2-4, it will work perfectly!**

If you want the link to last forever, implement one of the database solutions above.

## Quick Fix for Persistence

If you need links to persist across redeploys without setting up a database, you can:

1. Generate the link
2. Test it immediately
3. Send it to the partner
4. Avoid redeploying until after the anniversary date

The link will work fine for this use case!
