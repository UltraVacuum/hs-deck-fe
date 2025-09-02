
# Hearthstone Crawl Cron Job Configuration

## For Linux/Unix Systems

Add the following lines to your crontab (`crontab -e`):

```bash
# Crawl decks every 6 hours
0 */6 * * * cd /Users/vicvinc/Desktop/codespace/hs-deck-fe && npm run crawl:decks >> /tmp/hs-crawl.log 2>&1

# Crawl news every 12 hours
0 */12 * * * cd /Users/vicvinc/Desktop/codespace/hs-deck-fe && npm run crawl:news >> /tmp/hs-crawl.log 2>&1

# Crawl updates every 24 hours
0 0 * * * cd /Users/vicvinc/Desktop/codespace/hs-deck-fe && npm run crawl:updates >> /tmp/hs-crawl.log 2>&1

# Or run all crawls daily at 2 AM
0 2 * * * cd /Users/vicvinc/Desktop/codespace/hs-deck-fe && npm run crawl >> /tmp/hs-crawl.log 2>&1
```

## For Vercel Deployment

Add this to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/decks",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/news", 
      "schedule": "0 */12 * * *"
    },
    {
      "path": "/api/cron/updates",
      "schedule": "0 0 * * *"
    }
  ]
}
```

Then create API endpoints at `/api/cron/[type]` that call the respective crawl scripts.

## Manual Testing

Test the crawl scripts manually:

```bash
npm run crawl:decks
npm run crawl:news  
npm run crawl:updates
npm run crawl  # runs all
```

## Environment Variables

Make sure these are set in your deployment environment:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for bypassing RLS)
