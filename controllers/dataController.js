const { findBySiteAfterDate } = require('../services/dataService');

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
