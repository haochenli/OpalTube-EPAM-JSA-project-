'use strict';

require('dotenv').config();
const cryptoJs = require('../modules/crypt-data');
const tokensDb = require('../collections/tokens-db');
const RETURN_FAILS = -1;
let protocol = process.env.DB_PROTOCOL;
let host = process.env.DB_HOST;
let port = process.env.DB_PORT;
let name = process.env.DB_NAME;
let username = process.env.Username;
let password = process.env.Password;
let url;
let ObjectId = require('mongodb').ObjectID;

if (password !== undefined) {
  url = protocol + '://' + username + ':' + password + '@' + host + ':' + port + '/' + name;
} else {
  url = protocol + '://' + host + ':' + port + '/' + name;
}
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;

function createToken(userId, userAgent, callback) {
  callback(tokensDb.createToken(userId, userAgent));
}

function notFound(req, res, db, sendContent) {
  db.collection('users').insert(sendContent, function() {
    let userId = sendContent._id;

    createToken(userId, req.headers['user-agent'], (tokenData) => {
      res.set('location', '/api/users/' + userId);
      res.setHeader('content-type', 'application/json');
      res.status(201).json({
        expiresAt: tokenData.expiresAt,
        token: tokenData.token,
      });
    });

    db.close();
    return RETURN_FAILS;
  });
}

function userNameConflict(res, db, sendContent) {
  let obj = {'error': 'username conflicts!'};

  res.setHeader('content-type', 'application/json');
  res.status(409).send(obj);
  db.close();
  return RETURN_FAILS;
}

function emailConflict(res, db, sendContent) {
  let obj = {'error': 'email conflicts!'};

  res.setHeader('content-type', 'application/json');
  res.status(409).send(obj);
  db.close();
  return RETURN_FAILS;
}

function phoneConflict(res, db, sendContent) {
  let obj = {'error': 'phone number conflicts!'};

  res.setHeader('content-type', 'application/json');
  res.status(409).send(obj);
  db.close();
  return RETURN_FAILS;
}

function mongoConnectErrorHandle(res, db) {
  let obj = {'error': 'Something wrong!'};

  res.setHeader('content-type', 'application/json');
  res.status(500).send(obj);
  db.close();
}

function createRandomAvatar() {
  let avatarArray = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYvZMrVrkB7YtrpK94tDV9vp7lHysXwgLWjGk2_NAmIhUpy2Ma',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMkqAdEqj4W2U83SoghDdmOpLx0RFzSiJBBjtbdbbQidKzUUib-g',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl7QJsf7bU_OivDEsAc6WGFcac34eMmNiUc8lmbrQHX0yLVA0FtA',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7IgM4hh2-ShOA9Y7i5Ax0oK8-dQ9bgqXYCAXPVrUsX3J2WFAy',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp34jAkg0xbGABitSx2oRAjuYozw23wHYRg4GQMZJOhV6rmBjxkQ',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfvslSVQuzPcCLmMOW4iGsaieZbqM7nXwr8BbI4BiHVQ9XvMb5',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQooFfyMXvmFPpWVB-_QdK7CnP4wEWOIBQCbk5oWkz6UcbaIJev6A',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoc1113c33htGMVAW52d9yse4QlMUunhMeEx21WplSgSJ3zVEOvQ',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbYPHP0RN64XSSotZ5S5oTWk66aVJ9ikKJGDYJ5bFWZDJGzGw',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPeUisg2rSfc50CyhB60P24-8nUmP6Drvc8CaMrOEldvr24pn4',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH7KE3502ivxYEjP55Slw-p8OihTk82jE_8e-mq_oO1Ztl-8-tgQ',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4MwNoRdHIOJJFK1O2dPGXNlys3IWKQaqxj24rL4SPUGLsbFsOVw',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiR1Ob450H1YsalQVSLmqdJx7uoS0VZ959BJ1b7CeA99njQGb6',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdljRDNWvcas8d0XTp1DIVErcXIF9uc4FdYnW8ibPcdHVrOvqGYw',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHY0WTqEVmY15BFy5NgnDOVSGZSPgH9AGGck7HZIJEC2p5WNid',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMdXQRel-i7rdXPxsCFdCiXhx4cUuoVJ59hQd2PebH_TI0Wdv2',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgMA5AUwqZ9P9jON1QHczhGNCnMLzMeaOJi56ByWuPp0ai8te_',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzGhW8iwT5NGBG89J0S9VA_wNXUjzIBc1wAbtROix62GTV7F4DSA',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlZUeJP_IMUxBlMDd452OB437ZEcSPi-T9MdYnpxCiWgdYJbqG8w',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSawEKljPQfBcgrAooZKNyvi8Zx8nqiMKDy4XzroCq8d8sFQ0Tv_w',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOewMCy_hxB73gEJW7C7ifg3BARWLgxmWXeyI4RQmN8aY8Lbt2ag',
  ];

  return avatarArray[Math.floor(Math.random() * 21)];
}

function dbInsert(req, res) {
  let sendContent = {
    'username': ' ',
    'email': '',
    'phone number': '',
    'full name': '',
    'password': '',
    'avatar': createRandomAvatar(),
    'watchlater': [],
    'history': [],
    'subscriptions': [],
    'subscribers': [],
  };

  sendContent.username = req.body.username;
  sendContent.email = req.body.email;
  sendContent['phone number'] = req.body['phone number'];
  sendContent['full name'] = req.body['full name'];
  sendContent.password = cryptoJs.encryptoData(req.body.password);
  MongoClient.connect(url, function(err, db) {
    if (err) {
      mongoConnectErrorHandle(res, db);
      return RETURN_FAILS;
    }
    db.collection('users').find({
      $or: [
        {'username': req.body.username},
        {'email': req.body.email},
        {'phone number': req.body['phone number']},
      ],
    }).toArray(function(err, items) {
      if (err) {
        console.log(err);
        return;
      } else if (items.length === 0) {
        notFound(req, res, db, sendContent);
      } else if (items[0].username === req.body.username) {
        userNameConflict(res, db, sendContent);
      } else if (items[0].email === req.body.email) {
        emailConflict(res, db, sendContent);
      } else if (items[0]['phone number'] === req.body['phone number']) {
        phoneConflict(res, db, sendContent);
      }
    });
  });
}

// find userinfo throw email
function findUserInfo(email, callback) {
  MongoClient.connect(url, (err, db) => {
    try {
      if (err) {
        throw err;
      }
      let usersDB = db.collection('users');

      usersDB.findOne({'email': email}, (err, result) => {
        if (err) {
          console.log(err);
        }
        db.close();
        if (result === null) {
          return callback([]);
        }
        let userinfo = result;

        return callback(userinfo);
      });
    } catch (e) {
      console.log(e.name + ':' + e.message);
      return callback(undefined);
    }
  });
}

// find userinfo through userId
function findUserInfoById(userId, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err.name + ':' + err.message);
      return callback(undefined);
    }
    let usersDB = db.collection('users');

    usersDB.findOne({'_id': ObjectId(userId)}, (err, result) => {
      if (err) {
        console.log(err);
      }
      db.close();
      if (result === null) {
        return callback([]);
      }
      return callback(result);
    });
  });
}

function findUserInfoByUsername(userName, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err.name + ':' + err.message);
      return callback(undefined);
    }
    let usersDB = db.collection('users');

    usersDB.findOne({'username': userName}, (err, result) => {
      if (err) {
        console.log(err);
      }
      db.close();
      if (result === null) {
        return callback([]);
      }
      return callback(result);
    });
  });
}

function updateUserInfos(oldUsername, newInfos, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err.name + ':' + err.message);
      return callback(undefined);
    }
    let usersDB = db.collection('users');

    usersDB.update({'username': oldUsername}, {$set: {'full name': newInfos.fullName, 'avatar': newInfos.avatar}}, (err, result) => {
      if (err) {
        console.log(err);
        return callback('failed');
      }
      db.close();
      return callback(newInfos);
    });
  });
}

function updateUserInfo(userInfos, userId, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      return callback(undefined);
    }
    let userDB = db.collection('users');

    userDB.update({'_id': ObjectId(userId)}, {'$set': userInfos}, (err, result) => {
      if (err) {
        console.log(err);
        return callback('Upadate Failed');
      }
      db.close();
      return callback('success');
    });
  });
}

function subscribe(userInfos, targetUserInfos, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      return callback(undefined);
    }
    let userDB = db.collection('users');

    userDB.update({'_id': ObjectId(userInfos.userId)}, {$push: {'subscriptions': targetUserInfos}}, (err) => {
      if (err) {
        console.log(err);
        return callback('Upadate Failed');
      }
      userDB.update({'_id': ObjectId(targetUserInfos.userId)}, {$push: {'subscribers': userInfos}}, (err) => {
        if (err) {
          console.log(err);
          return callback('Upadate Failed');
        }
        db.close();
        return callback('success');
      });
    });
  });
}

module.exports = {
  storeUser: dbInsert,
  findUserInfo: findUserInfo,
  findUserInfoById: findUserInfoById,
  findUserInfoByUsername: findUserInfoByUsername,
  updateUserInfos: updateUserInfos,
  updateUserInfo: updateUserInfo,
  subscribe: subscribe,
};
