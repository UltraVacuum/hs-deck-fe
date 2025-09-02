#!/bin/bash

# Change to the scripts directory
cd "$(dirname "$0")"

echo "Starting all Hearthstone crawls..."

# Run deck crawl
echo "Crawling decks..."
node -r dotenv/config crawl-decks.js

# Run news crawl
echo "Crawling news..."
node -r dotenv/config crawl-news.js

# Run updates crawl
echo "Crawling updates..."
node -r dotenv/config crawl-updates.js

echo "All crawls completed!"
