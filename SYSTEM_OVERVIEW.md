
# Hearthstone Deck Website - System Overview

## 🎯 Project Structure

A Next.js application for displaying Hearthstone decks, news, and game updates with automated content crawling.

## 📁 Directory Structure

```
hs-deck-fe/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── cron/           # Cron job endpoints
│   │   │   │   ├── decks/route.ts
│   │   │   │   ├── news/route.ts
│   │   │   │   └── updates/route.ts
│   │   │   ├── decks/route.ts  # Public API for decks
│   │   │   ├── news/route.ts   # Public API for news
│   │   │   └── updates/route.ts # Public API for updates
│   │   └── page.tsx           # Home page
│   └── scripts/               # Crawl scripts
│       ├── crawl-decks.js
│       ├── crawl-news.js
│       ├── crawl-updates.js
│       └── crawl-all.sh
├── scripts/                   # Root scripts (symlinked)
├── package.json
└── .env.local
```

## 🗄️ Database Schema (Supabase)

All content is stored in a single `decks` table with type-based filtering:

```sql
CREATE TABLE decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('deck', 'news', 'update')),
  content JSONB NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Content Structure by Type:

**Decks (content_type = 'deck'):**
```json
{
  "cards": ["card_id_1", "card_id_2", ...],
  "deck_class": "Paladin",
  "archetype": "Aggro",
  "win_rate": 55.2,
  "popularity": 12.5
}
```

**News (content_type = 'news'):**
```json
{
  "author": "Blizzard Entertainment",
  "content": "Article content...",
  "category": "Expansion News",
  "published_date": "2024-01-15"
}
```

**Updates (content_type = 'update'):**
```json
{
  "version": "28.0.3",
  "patch_notes": "Balance changes...",
  "release_date": "2024-01-10",
  "affected_classes": ["Warrior", "Mage"]
}
```

## 🔄 API Endpoints

### Public APIs (Filtered Content)

- `GET /api/decks` - Returns only deck content (filtered by content_type = 'deck')
- `GET /api/news` - Returns only news content (filtered by content_type = 'news')  
- `GET /api/updates` - Returns only update content (filtered by content_type = 'update')

### Cron APIs (Content Crawling)

- `GET /api/cron/decks` - Triggers deck crawling (requires auth)
- `GET /api/cron/news` - Triggers news crawling (requires auth)
- `GET /api/cron/updates` - Triggers update crawling (requires auth)

**Security:** All cron endpoints require `Authorization: Bearer {CRON_SECRET}` header.

## 🚀 Crawl System

### Scripts Location
- `/scripts/crawl-decks.js` - Crawls Hearthstone deck websites
- `/scripts/crawl-news.js` - Crawls Hearthstone news sources  
- `/scripts/crawl-updates.js` - Crawls game update information
- `/scripts/crawl-all.sh` - Runs all crawl scripts sequentially

### NPM Commands
```bash
npm run crawl:decks     # Run deck crawl only
npm run crawl:news      # Run news crawl only  
npm run crawl:updates   # Run updates crawl only
npm run crawl           # Run all crawls
```

### Current Sources (Mock Data)
- **Decks**: HSReplay.net, Vicious Syndicate
- **News**: Blizzard Hearthstone news
- **Updates**: Official patch notes

## ⚙️ Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key  # For bypassing RLS
CRON_SECRET=your_cron_secret           # For cron endpoint security
```

## 🕐 Cron Job Configuration

### Local Development
```bash
# Add to crontab (crontab -e)
0 */6 * * *  cd /path/to/hs-deck-fe && npm run crawl:decks
0 */12 * * * cd /path/to/hs-deck-fe && npm run crawl:news  
0 0 * * *    cd /path/to/hs-deck-fe && npm run crawl:updates
```

### Vercel Deployment
Add to `vercel.json`:
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

## 🧪 Testing

### API Testing
```bash
# Test public APIs
curl http://localhost:3000/api/decks
curl http://localhost:3000/api/news
curl http://localhost:3000/api/updates

# Test cron endpoints (with secret)
curl -H "Authorization: Bearer your_cron_secret" http://localhost:3000/api/cron/decks
```

### Manual Crawl Testing
```bash
npm run crawl:decks
npm run crawl:news
npm run crawl:updates
npm run crawl
```

## 🚀 Deployment

1. Set environment variables in deployment platform
2. Configure cron jobs (Vercel cron feature or external service)
3. Deploy application
4. Test cron endpoints with correct authorization

## 🔧 Future Enhancements

- [ ] Implement actual web scraping (currently mock data)
- [ ] Add pagination to APIs
- [ ] Add search/filter capabilities
- [ ] Implement content caching
- [ ] Add rate limiting to crawl scripts
- [ ] Add error reporting and monitoring
- [ ] Implement content validation
- [ ] Add unit tests for crawl scripts
