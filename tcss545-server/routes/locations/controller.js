'use strict';

const Adapter = require('../../adapters/locations');

exports.getLocations = (req, res, next) => {
  console.log('in controller');
  Adapter
    .getAllLocations()
    .then(locations => locations.length ? res.json(locations) : res.status(404).json(locations))
    .catch(error => res.status(500).send(error));
};

exports.getLocationsById = (req, res, next) => {
  console.log('req.params.id', req.params.id);

  Adapter
    .getLocation(req.params.id)
    .then(locations => locations.length ?  res.json(locations[0]) : res.status(404).json(locations))
    .catch(error => res.status(500).send(error));
};
