'use strict';

const config = require('../db/config.json');
const Promise = require('bluebird');
const mysql = require('mysql');
// const dbPool = Promise.promisifyAll(mysql.createPool(config));
const dbPool = mysql.createPool(config);

const BaseDb = {

  query: function (query) {
    console.log(query);
    return new Promise((resolve, reject) => {
      dbPool.query(query, (err, rows) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  queryOne: function (query) {
    return BaseDb.query(query).then(rows => {
      let result = rows.map(item => item);
      if (result.length === 1) {
        return result[0];
      } else {
        return Promise.rejected();
      }
    });
  }

};

module.exports = BaseDb;