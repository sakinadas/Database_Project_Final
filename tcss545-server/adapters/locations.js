const base = require('./base');

const locationMapper = location => {
  return {
    id: location.id,
    name: location.name,
    address: location.address,
    phone: location.phone
  };
};

exports.getLocation = function (id) {
  return base
    .query(`SELECT * FROM Location WHERE id = ${id};`)
    .then(rows => {
      return rows.map(locationMapper);
    });
};

exports.getAllLocations = () => {
  return base
    .query(`SELECT * FROM Location;`)
    .then(rows => {
      return rows.map(locationMapper);
    });
};

exports.findOfferingLocations = function (offeringId) {
  return base.query(`SELECT DISTINCT Location.* FROM
    Location
    INNER JOIN LocationOffering ON (Location.id = LocationOffering.locationId)
    INNER JOIN OfferingPrice ON (OfferingPrice.id = LocationOffering.offeringPriceId)
    WHERE OfferingPrice.offeringId = ${offeringId};`).then(rows => {
    return rows.map(locationMapper);
  });
};