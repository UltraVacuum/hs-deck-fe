


const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const cheerio = require('cheerio');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Game update sources
const UPDATE_SOURCES = [
  'https://hearthstone.blizzard.com/en-us/patchnotes',
  'https://playhearthstone.com/patchnotes'
];

async function crawlPatchNotes() {
  try {
    console.log('Crawling Hearthstone patch notes...');
    
    // Mock patch data
    const mockUpdates = [
      {
        version: "28.2.3",
        title: "Balance Update - January 2024",
        description: "This update addresses several cards that have been overperforming in the current meta.",
        patch_notes: `
• Sif: Mana cost increased from 8 to 9
• Yogg-Saron: Chance to cast random spells reduced by 20%
• Several bug fixes and performance improvements
        `,
        release_date: new Date().toISOString(),
        impact_level: "Major",
        affected_classes: ["Mage", "Priest", "Druid"],
        source_url: "https://hearthstone.blizzard.com/en-us/patchnotes/28.2.3"
      },
      {
        version: "28.2.2",
        title: "Hotfix - December 2023",
        description: "Quick fix for server stability issues and matchmaking problems.",
        patch_notes: `
• Fixed server crash when playing certain card combinations
• Improved matchmaking algorithm
• Minor UI fixes
        `,
        release_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        impact_level: "Minor",
        affected_classes: [],
        source_url: "https://hearthstone.blizzard.com/en-us/patchnotes/28.2.2"
      }
    ];

    for (const update of mockUpdates) {
      const { data, error } = await supabase
        .from('decks')
        .upsert({ 
          id: crypto.randomUUID(),
          deck_meta: update,
          user_id: "00000000-0000-0000-0000-000000000000"
        }, { onConflict: 'id' });

      if (error) {
        console.error('Error inserting update:', error);
      } else {
        console.log('Inserted/updated update:', update.version);
      }
    }

  } catch (error) {
    console.error('Error crawling patch notes:', error);
  }
}

async function main() {
  console.log('Starting Hearthstone updates crawl...');
  
  await crawlPatchNotes();
  
  console.log('Updates crawl completed!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { crawlPatchNotes };


