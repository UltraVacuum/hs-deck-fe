


const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAPI(endpoint) {
  try {
    console.log(`Testing ${endpoint}...`);
    const response = await axios.get(`${BASE_URL}/${endpoint}`);
    console.log(`✅ ${endpoint}: Success`);
    console.log(`   Data length: ${response.data.data?.length || 0}`);
    return true;
  } catch (error) {
    console.log(`❌ ${endpoint}: Error - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('Testing Hearthstone API endpoints...\n');
  
  const endpoints = ['decks', 'news', 'updates'];
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    const passed = await testAPI(endpoint);
    if (!passed) allPassed = false;
  }
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 All API endpoints are working correctly!');
  } else {
    console.log('⚠️  Some API endpoints failed. Make sure the server is running.');
  }
  console.log('='.repeat(50));
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAPI };


