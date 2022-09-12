const mongoose = require('mongoose');
const config = require('./config');
async function connectToDatabase() {
  try {
    await mongoose.connect(
      `mongodb://${config.mongoUser}:${config.mongoPassword}@${config.mongoHost}:${config.mongoPort}/${config.mongoDatabase}`
    );
    console.log('Successfully connected to database!');
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = connectToDatabase;
