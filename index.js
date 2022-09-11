const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const dataRoutes = require('./routes/dataRoutes');

app.use(express.json());

app.use('/user', userRoutes);
app.use('/data', dataRoutes);

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

async function main() {
  try {
    connectToDatabase();
    app.listen(PORT, function () {
      console.log('Listening on port', PORT);
    });
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
}

main();
