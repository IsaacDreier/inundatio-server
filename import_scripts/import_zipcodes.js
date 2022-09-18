const connectToDatabase = require('../database');
const Location = require('../models/LocationModel');
const fs = require('fs/promises');
const { isNumeric } = require('validator');

async function main() {
  try {
    await connectToDatabase();
    const contents = await fs.readFile(
      './static_data/us_zipcodes/US.txt',
      'utf-8'
    );
    const lines = contents.split('\n');
    lines.forEach(async (line) => {
      const [
        country,
        zip,
        name,
        state,
        adc1,
        adn2,
        adc2,
        adn3,
        adc3,
        lat,
        long,
        accuracy,
      ] = line.split('\t');
      const locDoc = {
        country,
        zip,
        name,
        state,
        location: {
          type: 'Point',
          coordinates: [long, lat],
        },
      };
      try {
        await Location.create(locDoc);
      } catch (error) {
        console.log(error, locDoc);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

main();
