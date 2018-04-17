'use strict';

let mongodb = require('mongodb');
let randomstring = require('randomstring');
let MongoClient = mongodb.MongoClient;
let protocol = process.env.DB_PROTOCOL;
let host = process.env.DB_HOST;
let port = process.env.DB_PORT;
let name = process.env.DB_NAME;
let username = process.env.Username;
let password = process.env.Password;
let url;

if (password !== undefined) {
  url = protocol + '://' + username + ':' + password + '@' + host + ':' + port + '/' + name;
} else {
  url = protocol + '://' + host + ':' + port + '/' + name;
}
const TOKEN_LIFETIME = 7;

// insert tokenDescriptor to database
function insertTokenDescriptor(item) {
  MongoClient.connect(url, (err, db) => {
    try {
      if (err) {
        throw err;
      }
      let tokensDb = db.collection('tokenDescriptors');

      tokensDb.insert(item, (err, result) => {
        if (err !== null) {
          console.log(err.name + ':' + err.message);
        }
        db.close();
      });
    } catch (e) {
      console.log(e.name + ':' + e.message);
    }
  });
}

function createToken(userId, userAgent) {
  let tokenDescriptor = {};
  let expiresAt = new Date().getTime() + TOKEN_LIFETIME * 24 * 60 * 60 * 1000;

  tokenDescriptor.userId = userId.toString();
  tokenDescriptor.userAgent = userAgent;
  tokenDescriptor.expiresAt = expiresAt;
  tokenDescriptor.token = randomstring.generate(32);
  insertTokenDescriptor(tokenDescriptor);
  return tokenDescriptor;
}

// delete Token from db
function deleteToken(token, callback) {
  /* eslint no-console: "off" */
  MongoClient.connect(url, (err, db) => {
    try {
      if (err) {
        console.log(err);
        return callback(undefined);
      }
      let tokensDb = db.collection('tokenDescriptors');

      tokensDb.findOne({'token': token}, (err, result) => {
        if (err) {
          console.log(err.name + ':' + err.message);
          return;
        }
        if (result === null) {
          db.close();
          return callback(false);
        }
        tokensDb.remove({'token': token}, () => {
          db.close();
          return callback(true);
        });
      });
    } catch (e) {
      console.log(e.name + ':' + e.message);
    }
  });
}

// get Token from db
function getToken(token, callback) {
  MongoClient.connect(url, (err, db) => {
    try {
      if (err) {
        throw err;
      }
      let tokensDb = db.collection('tokenDescriptors');

      tokensDb.findOne({'token': token}, (err, result) => {
        if (err) {
          console.log(err.name + ':' + err.message);
          return;
        }
        db.close();
        if (result === null) {
          return callback([]);
        }
        return callback(result);
      });
    } catch (e) {
      console.log(e.name + ':' + e.message);
    }
  });
}

module.exports = {
  createToken: createToken,
  deleteToken: deleteToken,
  getToken: getToken,
};
