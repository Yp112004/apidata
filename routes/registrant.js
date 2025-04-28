const express = require('express');
const axios = require('axios');
const Registrant = require('../models/Registrant');

const router = express.Router();

// WebinarJam and GHL Configuration
const CONFIG = {
  apiUrl: 'https://api.webinarjam.com/everwebinar/registrants',
  apiKey: process.env.WEBINARJAM_API_KEY,  // Use environment variables for security
  webinarId: process.env.WEBINAR_ID,      // Webinar ID from environment variables
  scheduleId: process.env.SCHEDULE_ID,    // Schedule ID from environment variables
  ghlWebhookUrl: process.env.GHL_WEBHOOK_URL,  // GHL webhook URL from environment variables
};

/**
 * Fetch registrants from WebinarJam API
 */
async function fetchRegistrants() {
  let currentPage = 1;
  let totalPages = 1;
  const allRegistrants = [];

  console.log('📥 Starting to fetch registrants...');

  try {
    do {
      console.log(`➡️ Fetching page ${currentPage}...`);

      const response = await axios.post(`${CONFIG.apiUrl}?page=${currentPage}`, {
        api_key: CONFIG.apiKey,
        webinar_id: CONFIG.webinarId,
        schedule: CONFIG.scheduleId,
      });

      const data = response.data;

      if (!data.registrants || !data.registrants.data) {
        throw new Error(`No registrants found on page ${currentPage}.`);
      }

      const registrants = data.registrants.data;
      allRegistrants.push(...registrants);

      totalPages = data.registrants.total_pages || 1;
      currentPage++;

    } while (currentPage <= totalPages);

    console.log(`✅ Total registrants fetched: ${allRegistrants.length}`);
    return allRegistrants;

  } catch (error) {
    console.error('❌ Error fetching registrants:', error.message);
    throw error;
  }
}

/**
 * Send registrants to GHL webhook
 */
async function sendToGHL(registrants) {
  console.log('🚀 Sending registrants to GHL webhook...');

  const webhookPromises = registrants.map((reg) =>
    axios.post(CONFIG.ghlWebhookUrl, {
      firstName: reg.firstName,
      lastName: reg.lastName,
      email: reg.email,
      phone: reg.phone,
      timezone: reg.timezone,
      webinarId: reg.webinarId,
      schedule: reg.schedule,
      attendedLive: reg.attendedLive,
    }).catch((error) => {
      console.error(`❌ Failed to send ${reg.email} to GHL webhook:`, error.message);
    })
  );

  await Promise.all(webhookPromises);
  console.log('✅ All registrants sent to GHL webhook.');
}

/**
 * Save registrants into MongoDB
 */
async function saveRegistrants(registrants) {
  console.log('💾 Saving registrants to database...');

  const savedRegistrants = [];
  for (const reg of registrants) {
    // Check if the registrant already exists by email (to avoid duplicates)
    const existingRegistrant = await Registrant.findOne({ email: reg.email });
    if (!existingRegistrant) {
      const savedReg = await Registrant.create(reg);
      savedRegistrants.push(savedReg);
    }
  }

  console.log('✅ Registrants saved successfully.');
  return savedRegistrants;
}

/**
 * Main API to fetch, send, and save registrants
 */
router.get('/fetch', async (req, res) => {
  try {
    const fetchedData = await fetchRegistrants();

    // Prepare registrant documents
    const registrantDocs = fetchedData.map((reg) => ({
      firstName: reg.first_name,
      lastName: reg.last_name,
      email: reg.email,
      phone: reg.phone_number,
      timezone: reg.timezone || '',
      webinarId: CONFIG.webinarId,
      schedule: CONFIG.scheduleId,
      attendedLive: reg.attended_live || false,
      webinarResponse: reg,
    }));

    await sendToGHL(registrantDocs);
    const savedData = await saveRegistrants(registrantDocs);

    res.status(200).json({
      success: true,
      message: `Fetched, sent, and saved ${savedData.length} registrants successfully.`,
      savedData,
    });

  } catch (error) {
    console.error('❌ Process failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch, send, or save registrants.',
      error: error.message,
    });
  }
});

module.exports = router;
