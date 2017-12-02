'use strict';

const base = require('./base');

const offeringPriceMapper = price => {
    return {
        id: price.id,
        price: price.price,
        offeringSizeId: price.offeringSizeId,
        offeringId: price.offeringId
    };
};

exports.findOfferingPrice = (id) => {
    return base.queryOne(`SELECT * FROM OfferingPrice WHERE id = ${id}`).then(offeringPriceMapper);
};

exports.findOfferingPricesForOffering = (offeringId) => {
    return base.query(`SELECT OfferingPrice.* FROM
    OfferingPrice
    INNER JOIN Offering ON (Offering.id = OfferingPrice.offeringId)
    WHERE Offering.id = ${offeringId};`).then(rows => {
        return rows.map(offeringPriceMapper);
    });
};

