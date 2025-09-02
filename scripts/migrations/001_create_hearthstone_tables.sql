
-- Create tables for Hearthstone decks, news, and game updates

-- Table for Hearthstone decks
CREATE TABLE IF NOT EXISTS hearthstone_decks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deck_name TEXT NOT NULL,
    deck_class TEXT NOT NULL,
    deck_code TEXT UNIQUE NOT NULL,
    win_rate DECIMAL(5,2),
    popularity DECIMAL(5,2),
    dust_cost INTEGER,
    cards JSONB NOT NULL DEFAULT '[]',
    archetype TEXT,
    tier TEXT,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Hearthstone news
CREATE TABLE IF NOT EXISTS hearthstone_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    excerpt TEXT,
    author TEXT,
    source_url TEXT UNIQUE NOT NULL,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for game updates/patches
CREATE TABLE IF NOT EXISTS hearthstone_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    patch_notes TEXT,
    release_date TIMESTAMP WITH TIME ZONE,
    impact_level TEXT,
    affected_classes TEXT[] DEFAULT '{}',
    source_url TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_hearthstone_decks_class ON hearthstone_decks(deck_class);
CREATE INDEX IF NOT EXISTS idx_hearthstone_decks_tier ON hearthstone_decks(tier);
CREATE INDEX IF NOT EXISTS idx_hearthstone_decks_created ON hearthstone_decks(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_hearthstone_news_published ON hearthstone_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_hearthstone_news_category ON hearthstone_news(category);

CREATE INDEX IF NOT EXISTS idx_hearthstone_updates_version ON hearthstone_updates(version);
CREATE INDEX IF NOT EXISTS idx_hearthstone_updates_release ON hearthstone_updates(release_date DESC);

-- Enable Row Level Security (optional)
ALTER TABLE hearthstone_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearthstone_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearthstone_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for decks" ON hearthstone_decks FOR SELECT USING (true);
CREATE POLICY "Allow public read access for news" ON hearthstone_news FOR SELECT USING (true);
CREATE POLICY "Allow public read access for updates" ON hearthstone_updates FOR SELECT USING (true);

