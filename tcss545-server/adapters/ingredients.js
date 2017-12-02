const base = require('./base');

const ingredientMapper = (ingredient) => {
    return {
        id: ingredient.id,
        name: ingredient.name
    };
};

exports.findIngredient = function (id) {
    return base.queryOne(`SELECT * FROM Ingredient WHERE id = ${id};`).then(ingredientMapper);
};

exports.findIngredientByName = function (id, callback) {
    dbPool.query(`SELECT * FROM Ingredient WHERE name LIKE '%${id}%';`, callback).then(rows => {
        return rows.map(ingredientMapper);
    });
};

exports.findOfferingIngredients = function (offeringId) {
    return base.query(`SELECT DISTINCT Ingredient.* FROM
    Ingredient
    INNER JOIN OfferingIngredient ON (Ingredient.id = OfferingIngredient.ingredientId)
    WHERE OfferingIngredient.offeringId = ${offeringId};`).then(rows => {
        return rows.map(ingredientMapper);
    });
};