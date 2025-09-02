

#!/usr/bin/env node

const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

console.log('Setting up Hearthstone content crawl cron jobs...');

// Schedule deck crawl every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('Running deck crawl...');
  exec('node crawl-decks.js', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error('Deck crawl error:', error);
      return;
    }
    console.log('Deck crawl completed:', stdout);
  });
});

// Schedule news crawl every 4 hours
cron.schedule('0 */4 * * *', () => {
  console.log('Running news crawl...');
  exec('node crawl-news.js', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error('News crawl error:', error);
      return;
    }
    console.log('News crawl completed:', stdout);
  });
});

// Schedule updates crawl every 12 hours
cron.schedule('0 */12 * * *', () => {
  console.log('Running updates crawl...');
  exec('node crawl-updates.js', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error('Updates crawl error:', error);
      return;
    }
    console.log('Updates crawl completed:', stdout);
  });
});

console.log('Cron jobs scheduled:');
console.log('- Decks: every 6 hours');
console.log('- News: every 4 hours');
console.log('- Updates: every 12 hours');
console.log('Cron jobs are now running...');

// Keep the process alive
process.stdin.resume();

