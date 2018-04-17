'use strict';

require('dotenv').config();
let MongoClient = require('mongodb').MongoClient;
let protocol = process.env.DB_PROTOCOL;
let host = process.env.DB_HOST;
let port = process.env.DB_PORT;
let name = process.env.DB_NAME;
let url = protocol + '://' + host + ':' + port + '/' + name;

function checkDatabaseHealth(req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      return;
    }
    let adminDb = db.admin();

    adminDb.serverStatus(function(err, info) {
      if (err) {
        console.log(err);
        return;
      }
      res.json(info.version);
      db.close();
    });
  });
}

module.exports = {checkDatabaseHealth: checkDatabaseHealth};

