-- Add deck matchup data table
CREATE TABLE IF NOT EXISTS deck_matchups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES decks(id),
  opponent_class INTEGER NOT NULL REFERENCES hearthstone_classes(id),
  games_played INTEGER NOT NULL DEFAULT 0,
  win_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  format VARCHAR(20) NOT NULL DEFAULT 'standard',
  timeframe VARCHAR(10) NOT NULL DEFAULT '7d',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(deck_id, opponent_class, format, timeframe)
);

-- Add indexes
CREATE INDEX idx_deck_matchups_deck_id ON deck_matchups(deck_id);
CREATE INDEX idx_deck_matchups_opponent_class ON deck_matchups(opponent_class);