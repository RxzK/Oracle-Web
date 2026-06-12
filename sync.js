const { crawl } = require('../oracle/indexer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const CLOUD_API_URL = 'https://oracle-web-api.onrender.com/api/sync'; // User will update this
const ROOT_DIR = path.join(__dirname, '..');

async function syncToCloud() {
    console.log("Starting Cloud Sync...");
    const data = crawl(ROOT_DIR);

    try {
        const res = await axios.post(CLOUD_API_URL, { data });
        console.log(`Successfully synced ${res.data.count} items to the cloud Oracle.`);
    } catch (error) {
        console.error("Sync failed:", error.response?.data || error.message);
    }
}

// Run sync every 30 minutes
syncToCloud();
setInterval(syncToCloud, 30 * 60 * 1000);
