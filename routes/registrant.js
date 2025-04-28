// // const express = require('express');
// // const axios = require('axios');
// // const Registrant = require('../models/Registrant');
// // const router = express.Router();

// // // Fetch and save all registrants from WebinarJam
// // router.get('/fetch', async (req, res) => {
// //   const baseRequestBody = {
// //     api_key: '9deb35c5-a85c-469e-921e-8ec2673d03ac',
// //     webinar_id: '10',
// //     schedule: '44',
// //   };

  

// //   let currentPage = 1;
// //   let allRegistrants = [];
// //   let totalPages = 1;

// //   try {
// //     // Fetch all pages
// //     do {
// //       const requestBody = { ...baseRequestBody, page: currentPage };

// //       const response = await axios.post(
// //         'https://api.webinarjam.com/everwebinar/registrants',
// //         requestBody
// //       );

// //       const data = response.data;

// //       const registrants = data.registrants?.data || [];
// //       allRegistrants.push(...registrants);

// //       totalPages = data.registrants?.total_pages || 1;
// //       currentPage++;

// //     } while (currentPage <= totalPages);

// //     // Save all registrants to DB
// //     const savedRegistrants = [];

// //     for (let regData of allRegistrants) {
// //       const newRegistrant = new Registrant({
// //         firstName: regData.first_name,
// //         lastName: regData.last_name,
// //         email: regData.email,
// //         phone: regData.phone_number,
// //         webinarId: baseRequestBody.webinar_id,
// //         schedule: baseRequestBody.schedule,
// //         timezone: regData.timezone || '', // or default
// //         webinarResponse: regData, // full raw response
// //       });

// //       const savedRegistrant = await newRegistrant.save();
// //       savedRegistrants.push(savedRegistrant);
// //     }

// //     res.status(200).json({
// //       success: true,
// //       message: `Fetched and saved ${savedRegistrants.length} registrants successfully.`,
// //       savedData: savedRegistrants,
// //     });

// //   } catch (error) {
// //     console.error('Error fetching registrants:', error.message);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch or save registrants.',
// //       error: error.message,
// //     });
// //   }
// // });

// // // Get all saved registrants
// // router.get('/all', async (req, res) => {
// //   try {
// //     const registrants = await Registrant.find().sort({ createdAt: 0 });
// //     res.json({ success: true, savedData: registrants });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: 'Error fetching registrants', error: error.message });
// //   }
// // });

// // module.exports = router;


// const express = require('express');
// const axios = require('axios');
// const Registrant = require('../models/Registrant');
// const router = express.Router();

// // Route to fetch all registrants from WebinarJam API and save into DB
// router.get('/fetch', async (req, res) => {

//     const baseRequestBody =
//    {
//     api_key: '9deb35c5-a85c-469e-921e-8ec2673d03ac',
//     webinar_id: '10',
//     first_name: 'John',
//     last_name: '',
//     email: 'john@example.com',
//     phone_country_code: '+91',
//     phone: '9876543210',
//     schedule: '44',
//     timezone: 'GMT+05:30',
//   };

//   let currentPage = 1;
//   let allRegistrants = [];
//   let totalPages = 1;

//   try {
//     // Fetch all pages
//     do {
//       const requestBody = { ...baseRequestBody, page: currentPage };

//       const response = await axios.post(
//         'https://api.webinarjam.com/everwebinar/registrants',
//         requestBody
//       );

//       const data = response.data;

//       const registrants = data.registrants?.data || [];
//       allRegistrants.push(...registrants);

//       totalPages = data.registrants?.total_pages || 1;
//       currentPage++;

//     } while (currentPage <= totalPages);

//     // Save all registrants to DB
//     const savedRegistrants = [];

//     for (let regData of allRegistrants) {
//       const existingRegistrant = await Registrant.findOne({ email: regData.email });
    
//       if (!existingRegistrant) {
//         const newRegistrant = new Registrant({
//           firstName: regData.first_name,
//           lastName: regData.last_name,
//           email: regData.email,
//           phone: regData.phone_number,
//           webinarId: baseRequestBody.webinar_id,
//           schedule: baseRequestBody.schedule,
//           timezone: regData.timezone || '',
//           webinarResponse: regData,
//         });
    
//         const savedRegistrant = await newRegistrant.save();
//         savedRegistrants.push(savedRegistrant);
//       }
//     }
    
//     res.status(200).json({
//       success: true,
//       message: `Fetched and saved ${savedRegistrants.length} registrants successfully.`,
//       savedData: savedRegistrants,
//     });

//   } catch (error) {
//     console.error('Error fetching registrants:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch or save registrants.',
//       error: error.message,
//     });
//   }
// });

// // Route to get all saved registrants from MongoDB
// router.get('/all', async (req, res) => {
//   try {
//     const registrants = await Registrant.find().sort({ createdAt: -1 });
//     res.json({ success: true, savedData: registrants });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching registrants', error: error.message });
//   }
// });

// module.exports = router;


// const express = require('express');
// const axios = require('axios');
// const Registrant = require('../models/Registrant');
// const router = express.Router();


// router.get('/fetch', async (req, res) => {
//   const API_URL = 'https://api.webinarjam.com/everwebinar/registrants';
//   const API_KEY = '9deb35c5-a85c-469e-921e-8ec2673d03ac';
//   const WEBINAR_ID = '10';
//   const SCHEDULE_ID = '44';

//   const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/QVivSRwKDL7TOu49oHt6/webhook-trigger/f77201dc-8d28-4827-a70b-a139fb88a762';

//   let currentPage = 1;
//   let totalPages = 1;
//   const allRegistrants = [];

//   try {
//     console.log('Starting to fetch registrants...');

//     do {
//       console.log(`Fetching page ${currentPage}...`);

//       const requestBody = {
//         api_key: API_KEY,
//         webinar_id: WEBINAR_ID,
//         schedule: SCHEDULE_ID,
//       };

//       const response = await axios.post(`${API_URL}?page=${currentPage}`, requestBody);
//       const data = response.data;

//       if (!data.registrants || !data.registrants.data) {
//         throw new Error(`No registrants found on page ${currentPage}.`);
//       }

//       const registrants = data.registrants.data;
//       allRegistrants.push(...registrants);

//       totalPages = data.registrants.total_pages || 1;
//       currentPage++;

//     } while (currentPage <= totalPages);

//     console.log(`Fetched total ${allRegistrants.length} registrants.`);
//     const registrantDocs = allRegistrants.map((regData) => ({
//       firstName: regData.first_name,
//       lastName: regData.last_name,
//       email: regData.email,
//       phone: regData.phone_number,
//       webinarId: WEBINAR_ID,
//       schedule: SCHEDULE_ID,
//       timezone: regData.timezone || '',
//       attendedLive: regData.attended_live || false,   // 🛠️ Capture attended_live
//       webinarResponse: regData,
//     }));
    
//     // --------- SEND TO GHL WEBHOOK ----------
//     console.log('Sending data to GHL webhook...');
    
//     for (const reg of registrantDocs) {
//       try {
//         await axios.post(GHL_WEBHOOK_URL, {
//           firstName: reg.firstName,
//           lastName: reg.lastName,
//           email: reg.email,
//           phone: reg.phone,
//           timezone: reg.timezone,
//           webinarId: reg.webinarId,
//           schedule: reg.schedule,
//           attendedLive: reg.attendedLive,  // 🛠️ Send attended_live
//         });
//       } catch (sendError) {
//         console.error(`Failed to send registrant ${reg.email} to GHL webhook:`, sendError.message);
//       }
//     }
    

//     console.log('All registrants sent to GHL webhook.');

//     // --------- SAVE LOCALLY ----------
//     const savedRegistrants = await Registrant.insertMany(registrantDocs);

//     console.log('All registrants saved successfully.');

//     res.status(200).json({
//       success: true,
//       message: `Fetched, sent to GHL, and saved ${savedRegistrants.length} registrants successfully.`,
//       savedData: savedRegistrants,
//     });

//   } catch (error) {
//     console.error('Error fetching registrants:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch, send, or save registrants.',
//       error: error.message,
//     });
//   }
// });


// module.exports = router;


// const express = require('express');
// const axios = require('axios');
// const Registrant = require('../models/Registrant');
// const router = express.Router();

// router.get('/fetch', async (req, res) => {
//   const API_URL = 'https://api.webinarjam.com/everwebinar/registrants';
//   const API_KEY = '9deb35c5-a85c-469e-921e-8ec2673d03ac';
//   const WEBINAR_ID = '10';
//   const SCHEDULE_ID = '44';
//   const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/QVivSRwKDL7TOu49oHt6/webhook-trigger/2045ce50-fbd2-4378-bfc4-34db08e80f4b';

//   let currentPage = 1;
//   let totalPages = 1;
//   const allRegistrants = [];

//   try {
//     console.log('📥 Starting to fetch registrants...');

//     // Fetch all pages
//     do {
//       console.log(`➡️ Fetching page ${currentPage}...`);

//       const response = await axios.post(`${API_URL}?page=${currentPage}`, {
//         api_key: API_KEY,
//         webinar_id: WEBINAR_ID,
//         schedule: SCHEDULE_ID,
//       });

//       const data = response.data;

//       if (!data.registrants || !data.registrants.data) {
//         throw new Error(`No registrants found on page ${currentPage}.`);
//       }

//       const registrants = data.registrants.data;
//       allRegistrants.push(...registrants);

//       totalPages = data.registrants.total_pages || 1;
//       currentPage++;
//     } while (currentPage <= totalPages);

//     console.log(`✅ Fetched total ${allRegistrants.length} registrants.`);

//     // Prepare registrant documents
//     const registrantDocs = allRegistrants.map((regData) => ({
//       firstName: regData.first_name,
//       lastName: regData.last_name,
//       email: regData.email,
//       phone: regData.phone_number,
//       timezone: regData.timezone || '',
//       webinarId: WEBINAR_ID,
//       schedule: SCHEDULE_ID,
//       attendedLive: regData.attended_live || false,
//       webinarResponse: regData,
//     }));

//     // --------- SEND TO GHL WEBHOOK PARALLEL ----------
//     console.log('🚀 Sending registrants to GHL webhook...');

//     const webhookPromises = registrantDocs.map((reg) => {
//       return axios.post(GHL_WEBHOOK_URL, {
//         firstName: reg.firstName,
//         lastName: reg.lastName,
//         email: reg.email,
//         phone: reg.phone,
//         timezone: reg.timezone,
//         webinarId: reg.webinarId,
//         schedule: reg.schedule,
//         attendedLive: reg.attendedLive,
//       }).catch((error) => {
//         console.error(`❌ Failed to send ${reg.email} to GHL webhook:`, error.message);
//       });
//     });

//     await Promise.all(webhookPromises);

//     console.log('✅ All registrants sent to GHL webhook.');

//     // --------- SAVE LOCALLY ----------
//     console.log('💾 Saving registrants to database...');

//     const savedRegistrants = await Registrant.insertMany(registrantDocs);

//     console.log('✅ All registrants saved successfully.');

//     res.status(200).json({
//       success: true,
//       message: `Fetched, sent to GHL, and saved ${savedRegistrants.length} registrants successfully.`,
//       savedData: savedRegistrants,
//     });

//   } catch (error) {
//     console.error('❌ Error in fetch process:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch, send, or save registrants.',
//       error: error.message,
//     });
//   }
// });

// module.exports = router;

// routes/registrant.js

const express = require('express');
const axios = require('axios');
const Registrant = require('../models/Registrant');

const router = express.Router();

// WebinarJam and GHL Configuration
const CONFIG = {
  apiUrl: 'https://api.webinarjam.com/everwebinar/registrants',
  apiKey: '9deb35c5-a85c-469e-921e-8ec2673d03ac',
  webinarId: '10',
  scheduleId: '44',
  ghlWebhookUrl: 'https://services.leadconnectorhq.com/hooks/QVivSRwKDL7TOu49oHt6/webhook-trigger/2045ce50-fbd2-4378-bfc4-34db08e80f4b',
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
  const savedRegistrants = await Registrant.insertMany(registrants);
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