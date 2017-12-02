const base = require('./base');

const tagMapper = tag => {
    return {
        id: tag.id,
        name: tag.name
    };
};

exports.findTag = function (id) {
    return base.queryOne(`SELECT * FROM Tag WHERE id = ${id};`).then(tagMapper);
};

exports.findTagByName = function (id) {
    return base.query(`SELECT * FROM Tag WHERE name LIKE '%${id}%';`).then(rows => {
        return rows.map(tagMapper);
    });
};

exports.findOfferingTags = function (offeringId) {
    return base.query(`SELECT DISTINCT Tag.* FROM
    Tag
    INNER JOIN OfferingTag ON (Tag.id = OfferingTag.tagId)
    WHERE OfferingTag.offeringId = ${offeringId};`).then(function (rows) {
        return rows.map(tagMapper);
    });
};