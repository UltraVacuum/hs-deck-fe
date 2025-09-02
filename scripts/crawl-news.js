
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Hearthstone news sources
const NEWS_SOURCES = [
  'https://hearthstone.blizzard.com/en-us/news',
  'https://playhearthstone.com/news',
  'https://www.vicioussyndicate.com/'
];

async function crawlBlizzardNews() {
  try {
    console.log('Crawling Blizzard Hearthstone news...');
    
    // Mock news data - in production, you would scrape the actual websites
    const mockNews = [
      {
        title: "New Expansion: Titans Rising",
        content: "The latest expansion brings 145 new cards featuring the mighty Titans...",
        excerpt: "Discover the new Titan cards and mechanics in the latest expansion",
        author: "Blizzard Entertainment",
        source_url: "https://hearthstone.blizzard.com/en-us/news/12345678/titans-rising",
        image_url: "https://d15f34w2p8l1cc.cloudfront.net/hearthstone/expansions/titans-rising.jpg",
        published_at: new Date().toISOString(),
        category: "Expansion",
        tags: ["expansion", "titans", "new-cards"]
      },
      {
        title: "Balance Changes Coming Next Week",
        content: "We're making adjustments to several cards based on community feedback...",
        excerpt: "Upcoming balance changes to address meta concerns",
        author: "Blizzard Balance Team",
        source_url: "https://hearthstone.blizzard.com/en-us/news/12345679/balance-changes",
        image_url: "https://d15f34w2p8l1cc.cloudfront.net/hearthstone/news/balance-update.jpg",
        published_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        category: "Balance",
        tags: ["balance", "patch", "meta"]
      }
    ];

    for (const news of mockNews) {
      const { data, error } = await supabase
        .from('decks')
        .upsert({ 
          id: crypto.randomUUID(),
          deck_meta: news,
          user_id: "00000000-0000-0000-0000-000000000000"
        }, { onConflict: 'id' });

      if (error) {
        console.error('Error inserting news:', error);
      } else {
        console.log('Inserted/updated news:', news.title);
      }
    }

  } catch (error) {
    console.error('Error crawling Blizzard news:', error);
  }
}

async function main() {
  console.log('Starting Hearthstone news crawl...');
  
  await crawlBlizzardNews();
  
  console.log('News crawl completed!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { crawlBlizzardNews };

