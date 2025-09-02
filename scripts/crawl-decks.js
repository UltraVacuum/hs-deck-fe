
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const crypto = require('crypto');
const cheerio = require('cheerio');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Popular Hearthstone deck websites
const DECK_SOURCES = [
  'https://hsreplay.net/decks/',
  'https://www.vicioussyndicate.com/deck-lists/',
  'https://hearthstone.blizzard.com/en-us/news/'
];

async function crawlHsReplayDecks() {
  try {
    console.log('Crawling HSReplay decks...');
    
    // This is a simplified example - in production you would use proper API or web scraping
    const mockDecks = [
      {
        deck_name: "Aggro Paladin",
        deck_class: "Paladin",
        deck_code: "AAECAZ8FBPvoA6HiBKHiBKTyBQ3UoATWoAT5pAT6pAT7pQTlsASStQThtQTjuQTkuQTlzQTp0ASN1AQA",
        win_rate: 55.2,
        popularity: 12.5,
        dust_cost: 3200,
        cards: [
          { name: "Righteous Protector", cost: 1 },
          { name: "Argent Squire", cost: 1 },
          { name: "Lost in the Jungle", cost: 1 }
        ],
        archetype: "Aggro",
        tier: "Tier 1",
        source_url: "https://hsreplay.net/decks/aggro-paladin/"
      },
      {
        deck_name: "Control Warrior",
        deck_class: "Warrior",
        deck_code: "AAECAQcE++gDle0F0PkFDPvoA5XtBZDtBZDvBZDwBZDxBZDyBZDzBZD0BZD1BZD2BZD3BZD4BZD5BQA=",
        win_rate: 52.8,
        popularity: 8.3,
        dust_cost: 5600,
        cards: [
          { name: "Shield Slam", cost: 1 },
          { name: "Execute", cost: 2 },
          { name: "Brawl", cost: 5 }
        ],
        archetype: "Control",
        tier: "Tier 2",
        source_url: "https://hsreplay.net/decks/control-warrior/"
      }
    ];

    for (const deck of mockDecks) {
      // Generate a UUID for the deck and use a default user_id
      const deckData = {
        id: crypto.randomUUID(),
        deck_meta: deck,
        user_id: '00000000-0000-0000-0000-000000000000' // Default user ID
      };
      
      const { data, error } = await supabase
        .from('decks')
        .upsert(deckData, { onConflict: 'id' });

      if (error) {
        console.error('Error inserting deck:', error);
      } else {
        console.log('Inserted/updated deck:', deck.deck_name);
      }
    }

  } catch (error) {
    console.error('Error crawling HSReplay:', error);
  }
}

async function main() {
  console.log('Starting Hearthstone deck crawl...');
  
  await crawlHsReplayDecks();
  
  console.log('Deck crawl completed!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { crawlHsReplayDecks };
