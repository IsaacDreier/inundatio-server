const {
  findBySiteAfterDate,
  getLocationByZipcode,
  getLocationsByName,
  getSitesNearLatLong,
} = require('../services/dataService');
const { isPostalCode, isAlphanumeric, isLatLong } = require('validator');

exports.getSiteData = async (req, res) => {
  try {
    const site = req.query.site;
    const docs = await findBySiteAfterDate(
      site,
      new Date(Date.now() - 60 * 60 * 24 * 7)
    );
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

exports.getLocations = async (req, res) => {
  try {
    let locations = [];
    const { zip, name } = req.query;
    if (zip && isPostalCode(zip, 'US')) {
      locations = await getLocationByZipcode(zip);
    } else if (name && isAlphanumeric(name, 'en-US', { ignore: " -,'" })) {
      locations = await getLocationsByName(name);
    } else {
      return res
        .status(400)
        .send({ error: 'Must supply either a zipcode or name query' });
    }
    res.status(200).json(locations);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Server Error' });
  }
};

exports.getSitesNearLocation = async (req, res) => {
  try {
    if (!isLatLong(`${req.query.lat},${req.query.long}`))
      throw new Error('invaild latitude and longitude');
    const sites = await getSitesNearLatLong(
      req.query.lat,
      req.query.long,
      req.query.distance
    );
    res.status(200).send(sites);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Server Error' });
  }
};
