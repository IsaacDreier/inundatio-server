function distance(lat1, long1, lat2, long2) {
  const lat1R = lat1 * (Math.PI / 180);
  const long1R = long1 * (Math.PI / 180);
  const lat2R = lat2 * (Math.PI / 180);
  const long2R = long2 * (Math.PI / 180);

  const latExp = Math.pow(Math.sin((lat2R - lat1R) / 2), 2);
  const longExp = Math.pow(Math.sin((long2R - long1R) / 2), 2);

  const distance =
    3958.8 *
    2 *
    Math.sqrt(latExp + Math.cos(lat1R) * Math.cos(lat2R) * longExp);
  return distance;
}

module.exports = distance;
