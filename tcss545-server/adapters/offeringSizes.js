'use strict';

const base = require('./base');

const offeringSizeMapper = size => {
    return {
        id: size.id,
        name: size.name,
        oz: size.oz
    };
};

exports.findOfferingSize = (id) => {
    return base.queryOne(`SELECT * FROM OfferingSize WHERE id = ${id}`).then(offeringSizeMapper);
};

