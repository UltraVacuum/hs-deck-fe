


# Hearthstone Content Crawl Scripts

This directory contains scripts for crawling Hearthstone content including decks, news, and game updates.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (copy from main project):
```bash
cp ../.env.local .env
```

3. Add the following to your `.env` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# Optional: For write operations
SUPABASE_SERVICE_KEY=your_service_key
```

## Usage

### Manual Crawling
```bash
# Crawl decks only
npm run crawl:decks

# Crawl news only
npm run crawl:news

# Crawl updates only
npm run crawl:updates

# Crawl all content
npm run crawl:all
```

### Automated Cron Jobs
To set up automated crawling, run:
```bash
node setup-cron.js
```

This will start cron jobs that run:
- Deck crawl: Every 6 hours
- News crawl: Every 4 hours  
- Updates crawl: Every 12 hours

### Database Migration
To create the required tables, run the SQL migration:
```sql
-- Execute this in your Supabase SQL editor
\i migrations/001_create_hearthstone_tables.sql
```

## API Endpoints

The scripts populate data that can be accessed via:
- `GET /api/decks` - List of Hearthstone decks
- `GET /api/news` - Latest Hearthstone news
- `GET /api/updates` - Game updates and patch notes

## Testing

Test the API endpoints:
```bash
node test-api.js
```

## Notes

- The scripts currently use mock data. For production, implement actual web scraping from:
  - HSReplay.net for decks
  - Blizzard official news
  - Patch notes websites
- Ensure proper error handling and rate limiting for production use
- Consider adding authentication for write operations

