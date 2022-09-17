const {
  findBySiteAfterDate,
  getLocationByZipcode,
  getLocationsByName,
} = require('../services/dataService');
const { isPostalCode, isAlphanumeric } = require('validator');

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
