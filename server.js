const express = require('express');
const config = require('./config');
const app = express();
const PORT = process.env.PORT || 3000;
const connectToDatabase = require('./database');

const userRoutes = require('./routes/userRoutes');
const dataRoutes = require('./routes/dataRoutes');

app.use(express.json());

app.use('/user', userRoutes);
app.use('/data', dataRoutes);

module.exports.startServer = () => {
  try {
    connectToDatabase();
    app.listen(PORT, function () {
      console.log('Listening on port', PORT);
    });
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
};
