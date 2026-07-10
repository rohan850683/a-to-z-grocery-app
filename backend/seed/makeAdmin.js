require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  try {
    await connectDB();

    const email = 'rohaan2611@gmail.com';

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found. Pehle is email se signup karo:', email);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`${email} is now admin ✅`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

run();