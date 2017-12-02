'use strict';

const OfferingAdapter = require('../../adapters/offerings');
const OfferingTypeAdapter = require('../../adapters/offeringTypes');
const LocationAdapter = require('../../adapters/locations');
const TagAdapter = require('../../adapters/tags');
const IngredientAdapter = require('../../adapters/ingredients');
const PricesAdapter = require('../../adapters/offeringPrices');
const SizesAdapter = require('../../adapters/offeringSizes');
const Promise = require('bluebird');

let offeringMapper = (offering) => {
  return Promise.all([
    TagAdapter.findOfferingTags(offering.id).then(tags => {
      offering.tags = tags
    }),
    IngredientAdapter.findOfferingIngredients(offering.id).then(ingredients => {
      offering.ingredients = ingredients;
    }),
    LocationAdapter.findOfferingLocations(offering.id).then(locations => {
      offering.locations = locations;
    }),
    OfferingTypeAdapter.findOfferingType(offering.offeringTypeId).then(type => {
      offering.type = type;
      delete offering.offeringTypeId;
    }),
    PricesAdapter.findOfferingPricesForOffering(offering.id).then(prices => {
      let sizes = [];
      prices.forEach(price => {
        delete price.offeringId;
        sizes.push(SizesAdapter.findOfferingSize(price.offeringSizeId).then(size => {
          price.size = size;
          delete price.offeringSizeId;
        }));
      });
      offering.prices = prices;
      return Promise.all(sizes);
    })
  ]).then(() => {
    return offering;
  }, (err) => {
    console.error(err);
    return Promise.rejected(err);
  });
};

exports.getOfferings = (req, res) => {
  OfferingAdapter.findOfferings()
    .then(offerings => Promise.all(offerings.map(offeringMapper)), () => res.status(400).send('Bad Request'))
    .then(offerings => res.json(offerings), () => res.status(500).send('Internal Server Error'));
};

exports.getOffering = (req, res) => {
  let id = req.params.id;
  OfferingAdapter.findOffering(id)
    .then(offeringMapper, () => res.status(404).send('Not Found'))
    .then((offering) => res.json(offering), () => res.status(500).send('Internal Server Error'))
};

exports.searchOfferings = (req, res) => {
  let request = req.body;
  if (!request || !request.searchType) {
    res.status(416).send('Bad Request');
  }
  if (request.searchType === 'ALL' || request.searchType === 'ANY') {
      OfferingAdapter.findByQuery(request)
          .then(offerings => Promise.all(offerings.map(offeringMapper)), () => res.status(400).send('Bad Request'))
          .then(offerings => res.json(offerings), (error) => {console.error(error); res.status(500).send('Internal Server Error')});
  } else {
    res.status(400).send('Bad Request');
  }
};

