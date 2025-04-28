// services/autoFetch.js

const axios = require('axios');
const Registrant = require('../models/Registrant');

const CONFIG = {
  apiUrl: 'https://api.webinarjam.com/everwebinar/registrants',
  apiKey: '9deb35c5-a85c-469e-921e-8ec2673d03ac',
  webinarId: '10',
  scheduleId: '44',
  ghlWebhookUrl: 'https://services.leadconnectorhq.com/hooks/QVivSRwKDL7TOu49oHt6/webhook-trigger/2045ce50-fbd2-4378-bfc4-34db08e80f4b',
};

async function fetchRegistrantsFromAPI() {
  let currentPage = 1;
  let totalPages = 1;
  const allRegistrants = [];

  console.log('📥 Starting registrants fetch...');

  do {
    try {
      const response = await axios.post(`${CONFIG.apiUrl}?page=${currentPage}`, {
        api_key: CONFIG.apiKey,
        webinar_id: CONFIG.webinarId,
        schedule: CONFIG.scheduleId,
      });

      const data = response.data;

      if (!data.registrants || !data.registrants.data) {
        console.warn(`⚠️ No registrants found on page ${currentPage}.`);
        break;
      }

      allRegistrants.push(...data.registrants.data);
      totalPages = data.registrants.total_pages || 1;
      console.log(`✅ Page ${currentPage} fetched.`);

      currentPage++;
    } catch (error) {
      console.error(`❌ Error fetching page ${currentPage}:`, error.message);
      break;
    }
  } while (currentPage <= totalPages);

  console.log(`📦 Total registrants fetched: ${allRegistrants.length}`);
  return allRegistrants;
}

async function sendToGHLWebhook(registrants) {
  console.log('🚀 Sending registrants to GHL webhook...');

  const webhookPromises = registrants.map((reg) => {
    const payload = {
      firstName: reg.firstName,
      lastName: reg.lastName,
      email: reg.email,
      phone: reg.phone,
      timezone: reg.timezone,
      webinarId: reg.webinarId,
      schedule: reg.schedule,
      attendedLive: reg.attendedLive,
    };

    return axios.post(CONFIG.ghlWebhookUrl, payload)
      .catch((err) => {
        console.error(`❌ Failed to send to GHL for ${reg.email}:`, err.message);
      });
  });

  await Promise.all(webhookPromises);
  console.log('✅ All registrants sent to GHL webhook.');
}

async function saveRegistrantsToDB(registrants) {
    console.log('💾 Saving registrants to database...');
    
    // Find the latest signup date
    const latestSignup = registrants.reduce((latest, reg) => {
      const regSignupDate = new Date(reg.signup_date);
      return regSignupDate > latest ? regSignupDate : latest;
    }, new Date(0)); // Start with the earliest date
  
    // Save registrants to DB
    await Registrant.insertMany(registrants);
  
    // Update the lastFetchedDate for future reference
    await Registrant.updateOne({}, { lastFetchedDate: latestSignup });
    console.log('✅ Registrants saved to MongoDB.');
  }
  

async function autoFetchRegistrants() {
  try {
    const apiRegistrants = await fetchRegistrantsFromAPI();

    if (apiRegistrants.length === 0) {
      console.warn('⚠️ No registrants to process.');
      return;
    }

    const registrantDocs = apiRegistrants.map((reg) => ({
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

    await sendToGHLWebhook(registrantDocs);
    await saveRegistrantsToDB(registrantDocs);

    console.log(`🎯 Auto-fetch cycle completed. Total saved: ${registrantDocs.length}`);
  } catch (error) {
    console.error('❌ Auto-fetch process failed:', error.message);
  }
}

module.exports = { autoFetchRegistrants };
