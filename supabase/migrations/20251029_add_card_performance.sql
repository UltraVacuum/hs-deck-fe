-- Add card performance metrics table
CREATE TABLE IF NOT EXISTS card_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES hearthstone_cards(id),
  format VARCHAR(20) NOT NULL DEFAULT 'standard',
  timeframe VARCHAR(10) NOT NULL DEFAULT '7d',
  deck_inclusion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  played_winrate DECIMAL(5,2) NOT NULL DEFAULT 0,
  mulligan_winrate DECIMAL(5,2) NOT NULL DEFAULT 0,
  avg_copies_in_deck DECIMAL(3,1) NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  popularity_change DECIMAL(5,2) DEFAULT 0,
  winrate_change DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(card_id, format, timeframe)
);

-- Add indexes for performance
CREATE INDEX idx_card_performance_card_id ON card_performance(card_id);
CREATE INDEX idx_card_performance_format ON card_performance(format);
CREATE INDEX idx_card_performance_timeframe ON card_performance(timeframe);