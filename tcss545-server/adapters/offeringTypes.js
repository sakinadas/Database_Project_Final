'use strict';

const base = require('./base');

const offeringTypeMapper = type => {
    return {
        id: type.id,
        name: type.name,
        description: type.description
    };
};

exports.findOfferingType = function (id) {
    return base.queryOne(`SELECT * FROM OfferingType WHERE id = ${id};`).then(offeringTypeMapper);
};

exports.findOfferingTypes = function () {
    return base.query(`SELECT * FROM OfferingType`).then(rows => {
        return rows.map(offeringTypeMapper);
    });
};

exports.findLocationOfferingTypes = function (locationId) {
    return base.query(`SELECT DISTINCT OfferingType.* FROM
    Location
    INNER JOIN LocationOffering ON (Location.id = LocationOffering.locationId)
    INNER JOIN OfferingPrice ON (OfferingPrice.id = LocationOffering.offeringPriceId)
    INNER JOIN Offering ON (Offering.id = OfferingPrice.offeringId)
    INNER JOIN OfferingType ON (OfferingType.id = Offering.offeringTypeId)
    WHERE Location.id = ${locationId}`).then(rows => {
        return rows.map(offeringTypeMapper);
    });
};
