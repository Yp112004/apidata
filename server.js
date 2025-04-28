// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');
// const cors = require('cors');
// const registrantRoutes = require('./routes/registrant');

// dotenv.config();
// const app = express();

// app.use(cors()); // 💥 Enable CORS here
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // API routes
// app.use('/api/registrants', registrantRoutes);

// // Start server
// const PORT = process.env.PORT || 7000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');
// const cors = require('cors');
// const { router: registrantRoutes, fetchAndSaveRegistrants } = require('./routes/registrant'); // Import both router and fetch function

// dotenv.config(); // Load environment variables

// const app = express();

// // Middleware
// app.use(cors()); // Enable CORS
// app.use(express.json()); // Parse JSON request bodies
// app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// // API Routes
// app.use('/api/registrants', registrantRoutes);

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(async () => {
//   console.log('✅ MongoDB connected');

//   // 🚀 Automatically fetch registrants after DB connection
//   try {
//     await fetchAndSaveRegistrants();
//     console.log('🎯 Initial registrant fetch completed');
//   } catch (error) {
//     console.error('❌ Failed to auto-fetch registrants:', error.message);
//   }

//   // Start the server
//   const PORT = process.env.PORT || 7000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server is running on port ${PORT}`);
//   });
// })
// .catch((err) => {
//   console.error('❌ MongoDB connection error:', err.message);
// });


// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cron = require('node-cron'); // 💥 Import cron
const registrantRoutes = require('./routes/registrant');
const { autoFetchRegistrants } = require('./services/autoFetch'); // (new file we'll create)

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API routes
app.use('/api/registrants', registrantRoutes);

// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ==============================
// 🕐 Setup auto-fetch cron job
// ==============================
cron.schedule('* * * * *', async () => {
  console.log('⏰ Cron triggered: Fetching registrants...');
  await autoFetchRegistrants();
});
