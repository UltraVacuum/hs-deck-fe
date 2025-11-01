-- Hearthstone Schema Migration
-- Creates tables for Hearthstone cards, decks, and meta analysis

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hearthstone Cards Table
CREATE TABLE IF NOT EXISTS hearthstone_cards (
    id VARCHAR(50) PRIMARY KEY,
    name TEXT NOT NULL,
    text TEXT,
    cost INTEGER,
    attack INTEGER,
    health INTEGER,
    durability INTEGER,
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    player_class VARCHAR(50) NOT NULL,
    card_type VARCHAR(20) NOT NULL CHECK (card_type IN ('minion', 'spell', 'weapon', 'hero', 'location')),
    mechanics TEXT[],
    image TEXT,
    image_gold TEXT,
    flavor_text TEXT,
    artist TEXT,
    race VARCHAR(50),
    collectible BOOLEAN DEFAULT true,
    card_set VARCHAR(100) NOT NULL,
    multi_class_group TEXT[],
    spell_school VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hearthstone Decks Table
CREATE TABLE IF NOT EXISTS hearthstone_decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    class VARCHAR(50) NOT NULL,
    format VARCHAR(20) DEFAULT 'standard' CHECK (format IN ('standard', 'wild', 'classic', 'twist')),
    cards JSONB NOT NULL,
    creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT true,
    archetype VARCHAR(100),
    tags TEXT[],
    deck_code TEXT,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    copies INTEGER DEFAULT 0
);

-- Meta Snapshots Table
CREATE TABLE IF NOT EXISTS meta_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    format VARCHAR(20) NOT NULL,
    rankings JSONB NOT NULL,
    popular_decks JSONB NOT NULL,
    rising_cards JSONB NOT NULL,
    falling_cards JSONB NOT NULL,
    class_distribution JSONB NOT NULL,
    sample_size INTEGER DEFAULT 0,
    rank_range VARCHAR(50) DEFAULT 'all'
);

-- User Deck Favorites Table
CREATE TABLE IF NOT EXISTS user_deck_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    deck_id UUID REFERENCES hearthstone_decks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, deck_id)
);

-- User Deck Ratings Table
CREATE TABLE IF NOT EXISTS user_deck_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    deck_id UUID REFERENCES hearthstone_decks(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, deck_id)
);

-- User Collections Table
CREATE TABLE IF NOT EXISTS user_card_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id VARCHAR(50) REFERENCES hearthstone_cards(id) ON DELETE CASCADE,
    count_normal INTEGER DEFAULT 0,
    count_golden INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, card_id)
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(100) NOT NULL,
    progress INTEGER DEFAULT 0,
    max_progress INTEGER DEFAULT 1,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- User Statistics Table
CREATE TABLE IF NOT EXISTS user_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    decks_created INTEGER DEFAULT 0,
    decks_shared INTEGER DEFAULT 0,
    decks_copied INTEGER DEFAULT 0,
    cards_collected INTEGER DEFAULT 0,
    total_likes_received INTEGER DEFAULT 0,
    achievements_unlocked INTEGER DEFAULT 0,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_class ON hearthstone_cards(player_class);
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_cost ON hearthstone_cards(cost);
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_rarity ON hearthstone_cards(rarity);
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_type ON hearthstone_cards(card_type);
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_set ON hearthstone_cards(card_set);
CREATE INDEX IF NOT EXISTS idx_hearthstone_cards_collectible ON hearthstone_cards(collectible);

CREATE INDEX IF NOT EXISTS idx_hearthstone_decks_class ON hearthstone_decks(class);
CREATE INDEX IF NOT EXISTS idx_hearthstone_decks_format ON hearthstone_decks(format);
CREATE INDEX IF NOT EXISTS idx_hearthstone_decks_creator ON hearthstone_decks(creator_id);
CREATE INDEX IF NOT EXISTS idx_hearthstone_decks_public ON hearthstone_decks(is_public);
CREATE INDEX IF NOT EXISTS idx_hearthstone_decks_created ON hearthstone_decks(created_at);
CREATE INDEX IF NOT EXISTS idx_hearthstone_decks_likes ON hearthstone_decks(likes DESC);

CREATE INDEX IF NOT EXISTS idx_meta_snapshots_timestamp ON meta_snapshots(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_meta_snapshots_format ON meta_snapshots(format);

CREATE INDEX IF NOT EXISTS idx_user_deck_favorites_user ON user_deck_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_deck_favorites_deck ON user_deck_favorites(deck_id);

CREATE INDEX IF NOT EXISTS idx_user_deck_ratings_user ON user_deck_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_deck_ratings_deck ON user_deck_ratings(deck_id);

CREATE INDEX IF NOT EXISTS idx_user_card_collections_user ON user_card_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_card_collections_card ON user_card_collections(card_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(unlocked_at);

-- Create RLS (Row Level Security) policies
ALTER TABLE hearthstone_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deck_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deck_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for decks
CREATE POLICY "Users can view public decks" ON hearthstone_decks
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own decks" ON hearthstone_decks
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert own decks" ON hearthstone_decks
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own decks" ON hearthstone_decks
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own decks" ON hearthstone_decks
    FOR DELETE USING (auth.uid() = creator_id);

-- RLS Policies for user favorites
CREATE POLICY "Users can manage own favorites" ON user_deck_favorites
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user ratings
CREATE POLICY "Users can manage own ratings" ON user_deck_ratings
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user collections
CREATE POLICY "Users can manage own collection" ON user_card_collections
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user achievements
CREATE POLICY "Users can manage own achievements" ON user_achievements
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user statistics
CREATE POLICY "Users can view own statistics" ON user_statistics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics" ON user_statistics
    FOR UPDATE USING (auth.uid() = user_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hearthstone_cards_updated_at BEFORE UPDATE
    ON hearthstone_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hearthstone_decks_updated_at BEFORE UPDATE
    ON hearthstone_decks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_deck_ratings_updated_at BEFORE UPDATE
    ON user_deck_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_card_collections_updated_at BEFORE UPDATE
    ON user_card_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE
    ON user_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_statistics_updated_at BEFORE UPDATE
    ON user_statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user statistics
CREATE OR REPLACE FUNCTION create_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_statistics (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create user statistics when a new user signs up
CREATE TRIGGER create_user_statistics_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_statistics();

-- Function to update deck statistics
CREATE OR REPLACE FUNCTION update_deck_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_statistics
        SET decks_created = decks_created + 1,
            updated_at = NOW()
        WHERE user_id = NEW.creator_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.is_public = false AND NEW.is_public = true THEN
            UPDATE user_statistics
            SET decks_shared = decks_shared + 1,
                updated_at = NOW()
            WHERE user_id = NEW.creator_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update deck statistics
CREATE TRIGGER update_deck_statistics_trigger
    AFTER INSERT OR UPDATE ON hearthstone_decks
    FOR EACH ROW EXECUTE FUNCTION update_deck_statistics();

COMMIT;