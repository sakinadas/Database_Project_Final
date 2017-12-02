'use strict';

const base = require('./base');

const offeringMapper = offering => {
    return {
        id: offering.id,
        name: offering.name,
        description: offering.description,
        offeringTypeId: offering.offeringTypeId
    };
};

exports.findOffering = function (id) {
    return base.queryOne(`SELECT * FROM Offering WHERE id = ${id};`).then(offeringMapper);
};

exports.findOfferings = function () {
    return base.query(`SELECT * FROM Offering;`).then(rows => {
        return rows.map(offeringMapper);
    });
};

exports.findOfferingsForType = (typeId) => base.query(`SELECT * FROM Offering WHERE offeringTypeId = ${typeId}`)
    .then(rows => {
        return rows.map(offeringMapper)
    });

exports.findOfferingsForTypeAndLocation = (typeId, locationId) => base.query(`SELECT DISTINCT Offering.* FROM
    LocationOffering
    INNER JOIN OfferingPrice ON (LocationOffering.offeringPriceId = OfferingPrice.id)
    INNER JOIN Offering ON (Offering.id = OfferingPrice.offeringId)
WHERE LocationOffering.locationId = ${locationId} AND Offering.offeringTypeId = ${typeId};`)
    .then(rows => {
        return rows.map(offeringMapper)
    });

exports.findByQuery = (request) =>
    base.query(searchQuery(request)).then(rows => rows.map(offeringMapper));

let emptyArray = obj => !Array.isArray(obj) || !obj.length;
let emptyString = obj => !(typeof obj === 'string') || !obj.trim().length;
let listValues = values => values.map(value => "'" + value + "'").join(',');

let searchQuery = request => {
    if (!request.name) {
        request.name = '';
    }
    if (!request.type) {
        request.type = '';
    }
    if (!request.tags) {
        request.tags = [];
    }
    if (!request.ingredients) {
        request.ingredients = [];
    }
    let sql = 'SELECT DISTINCT Offering.* FROM Offering';
    let criterion = request.searchType === 'ALL' ? 'AND' : 'OR';
    sql += '\n\tINNER JOIN OfferingType ON (OfferingType.id = Offering.offeringTypeId)';
    if (!emptyArray(request.tags)) {
        sql += '\n\tINNER JOIN OfferingTag ON (OfferingTag.offeringId = Offering.id)';
        sql += '\n\tINNER JOIN Tag ON (Tag.Id = OfferingTag.tagId)';
    }
    if (!emptyArray(request.ingredients)) {
        sql += '\n\tINNER JOIN OfferingIngredient ON (OfferingIngredient.offeringId = Offering.id)';
        sql += '\n\tINNER JOIN Ingredient ON (Ingredient.Id = OfferingIngredient.ingredientId)';
    }
    let whereClause = '';
    let first = true;
    if (request.searchType === 'ALL' || !emptyString(request.name)) {
        first = false;
        whereClause += '\n\tOffering.name LIKE \'%' + request.name + '%\'';
    }
    if (request.searchType === 'ALL' || !emptyString(request.type)) {
        whereClause += '\n\t';
        if (!first) {
            whereClause += criterion;
        }
        first = false;
        whereClause += ' OfferingType.name LIKE \'%' + request.type + '%\'';
    }
    if (!emptyArray(request.tags)) {
        whereClause += '\n\t';
        if (!first) {
            whereClause += criterion;
        }
        first = false;
        whereClause += ' LOWER(Tag.name) IN (' + listValues(request.tags) + ')';
    }
    if (!emptyArray(request.ingredients)) {
        whereClause += '\n\t';
        if (!first) {
            whereClause += criterion;
        }
        whereClause += ' LOWER(Ingredient.name) IN (' + listValues(request.ingredients) + ')';
    }
    if (whereClause.trim() !== '') {
        sql += '\nWHERE' + whereClause;
    }
    sql += ';';
    return sql;
};