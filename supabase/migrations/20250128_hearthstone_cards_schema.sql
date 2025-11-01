-- Hearthstone Cards Schema Update Migration
-- Adds classes table, card images table, sync logs table, and updates cards table

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hearthstone Classes Table (for proper foreign key relationships)
CREATE TABLE IF NOT EXISTS hearthstone_classes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#808080',
    hero_class BOOLEAN DEFAULT true,
    standard BOOLEAN DEFAULT true,
    wild BOOLEAN DEFAULT true,
    classic BOOLEAN DEFAULT false,
    twist BOOLEAN DEFAULT false,
    battlegrounds BOOLEAN DEFAULT false,
    mercenaries BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert basic Hearthstone classes if they don't exist
INSERT INTO hearthstone_classes (name, slug, color) VALUES
    ('Druid', 'druid', '#FF7D0A'),
    ('Hunter', 'hunter', '#ABD473'),
    ('Mage', 'mage', '#69CCF0'),
    ('Paladin', 'paladin', '#F58CBA'),
    ('Priest', 'priest', '#FFFFFF'),
    ('Rogue', 'rogue', '#FFF569'),
    ('Shaman', 'shaman', '#0070DE'),
    ('Warlock', 'warlock', '#9482C9'),
    ('Warrior', 'warrior', '#C79C6E'),
    ('Demon Hunter', 'demon_hunter', '#A330C9')
ON CONFLICT (name) DO NOTHING;

-- Hearthstone Card Images Table
CREATE TABLE IF NOT EXISTS hearthstone_card_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id TEXT REFERENCES hearthstone_cards(id) ON DELETE CASCADE,
    image_type TEXT NOT NULL CHECK (image_type IN ('normal', 'gold', 'tile', 'tile_gold')),
    storage_path TEXT NOT NULL,
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    format TEXT DEFAULT 'webp',
    optimized_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Card Data Sync Log Table
CREATE TABLE IF NOT EXISTS card_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sync_type TEXT NOT NULL CHECK (sync_type IN ('full', 'incremental', 'manual')),
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
    cards_processed INTEGER DEFAULT 0,
    cards_added INTEGER DEFAULT 0,
    cards_updated INTEGER DEFAULT 0,
    cards_removed INTEGER DEFAULT 0,
    images_processed INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT
);

-- Update hearthstone_cards table to match new schema
ALTER TABLE hearthstone_cards
DROP COLUMN IF EXISTS player_class,
ADD COLUMN IF NOT EXISTS player_class_id INTEGER REFERENCES hearthone_classes(id),
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_gold_url TEXT,
ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'enUS',
ADD COLUMN IF NOT EXISTS multiclass_groups TEXT[];

-- Rename existing columns to match new naming convention
ALTER TABLE hearthstone_cards RENAME COLUMN image TO image_url_old;
ALTER TABLE hearthstone_cards RENAME COLUMN image_gold TO image_gold_url_old;

-- Update data to move from text class to foreign key
UPDATE hearthstone_cards
SET player_class_id = (SELECT id FROM hearthstone_classes WHERE LOWER(hearthstone_classes.name) = LOWER(hearthstone_cards.player_class))
WHERE player_class IS NOT NULL;

-- Move image URLs to new columns
UPDATE hearthstone_cards SET image_url = image_url_old WHERE image_url_old IS NOT NULL;
UPDATE hearthstone_cards SET image_gold_url = image_gold_url_old WHERE image_gold_url_old IS NOT NULL;

-- Drop old columns
ALTER TABLE hearthstone_cards DROP COLUMN IF EXISTS image_url_old;
ALTER TABLE hearthstone_cards DROP COLUMN IF EXISTS image_gold_url_old;

-- Update card_set column to match naming convention
ALTER TABLE hearthstone_cards RENAME COLUMN card_set TO card_set_name;
ALTER TABLE hearthstone_cards RENAME COLUMN card_set_name TO card_set;

-- Update multi_class_group to match new schema
ALTER TABLE hearthstone_cards RENAME COLUMN multi_class_group TO multiclass_groups_old;
ALTER TABLE hearthstone_cards ADD COLUMN IF NOT EXISTS multiclass_groups TEXT[];

-- Update card_type to include hero_power
ALTER TABLE hearthstone_cards DROP CONSTRAINT IF EXISTS hearthstone_cards_card_type_check;
ALTER TABLE hearthstone_cards ADD CONSTRAINT hearthstone_cards_card_type_check
    CHECK (card_type IN ('minion', 'spell', 'weapon', 'hero', 'location', 'hero_power'));

-- New indexes for performance
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_name ON hearthstone_cards(name);
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_class_id ON hearthstone_cards(player_class_id);
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_set ON hearthstone_cards(card_set);
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_cost ON hearthstone_cards(cost);
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_collectible ON hearthstone_cards(collectible);
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_locale ON hearthstone_cards(locale);

CREATE INDEX IF NOT EXISTS idx_hearthstone_classes_name ON hearthstone_classes(name);
CREATE INDEX IF NOT EXISTS idx_hearthstone_classes_slug ON hearthstone_classes(slug);

CREATE INDEX IF NOT EXISTS idx_card_images_card_id ON hearthstone_card_images(card_id);
CREATE INDEX IF NOT EXISTS idx_card_images_type ON hearthstone_card_images(image_type);
CREATE INDEX IF NOT EXISTS idx_card_sync_logs_started_at ON card_sync_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_card_sync_logs_status ON card_sync_logs(status);

-- RLS Policies
ALTER TABLE hearthstone_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearthstone_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearthstone_card_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_sync_logs ENABLE ROW LEVEL SECURITY;

-- Public read access to classes
CREATE POLICY "Classes are viewable by everyone" ON hearthstone_classes
    FOR SELECT USING (true);

-- Public read access to cards
CREATE POLICY "Cards are viewable by everyone" ON hearthstone_cards
    FOR SELECT USING (true);

-- Public read access to card images
CREATE POLICY "Card images are viewable by everyone" ON hearthstone_card_images
    FOR SELECT USING (true);

-- Only service role can modify classes
CREATE POLICY "Only service role can modify classes" ON hearthstone_classes
    FOR ALL USING (auth.role() = 'service_role');

-- Only service role can modify cards
CREATE POLICY "Only service role can modify cards" ON hearthstone_cards
    FOR ALL USING (auth.role() = 'service_role');

-- Only service role can modify card images
CREATE POLICY "Only service role can modify card images" ON hearthstone_card_images
    FOR ALL USING (auth.role() = 'service_role');

-- Only service role can access sync logs
CREATE POLICY "Only service role can access sync logs" ON card_sync_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Trigger for updated_at on classes table
CREATE TRIGGER update_hearthstone_classes_updated_at BEFORE UPDATE
    ON hearthstone_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;