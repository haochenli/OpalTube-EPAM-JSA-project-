'use strict';

const usersDb = require('../collections/users-db');
const tokensDb = require('../collections/tokens-db');
const encryptoData = require('../modules/crypt-data');

function sendBadRequest(res, message, statusNum) {
  res.status(statusNum).json({'error': message});
}

function checkEmail(email) {
  let reg = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

  return reg.test(email);
}

function checkPassword(password) {
  let reg = /\S{6,}/;

  return reg.test(password);
}

function validatePassword(password) {
  if (password === undefined) {
    throw new Error('missing field');
  }
  if (checkPassword(password) === false) {
    throw new Error('password format error');
  }
}

function validateEmail(email) {
  if (email === undefined) {
    throw new Error('missing field');
  }
  if (checkEmail(email) === false) {
    throw new Error('email format error');
  }
}

function validateContentType(contentType) {
  if (contentType !== 'application/json') {
    throw new Error('Content-Type wrong');
  }
}

function checkInfoValid(userData) {
  validateContentType(userData.contentType);
  validateEmail(userData.email);
  validatePassword(userData.password);
}

function checkIfPasswordMatch(password, userinfo) {
  let passwordInDb = encryptoData.decryptoData(userinfo.password || 404);

  password = encryptoData.encryptoData(password);
  password = encryptoData.decryptoData(password);

  return (password === passwordInDb);
}

function createToken(userinfo, userAgent, callback) {
  callback(tokensDb.createToken(userinfo._id, userAgent));
}

function login(req, res) {
  try {
    checkInfoValid({
      contentType: req.headers['content-type'].toLowerCase(),
      email: req.body.email,
      password: req.body.password,
    });
    usersDb.findUserInfo(req.body.email, (userinfo) => {
      if (userinfo === undefined) {
        return sendBadRequest(res, 'something went wrong', 500);
      }
      if (checkIfPasswordMatch(req.body.password, userinfo)) {
        createToken(userinfo, req.headers['user-agent'], (tokenData) => {
          res.status(200).json({
            expiresAt: tokenData.expiresAt,
            token: tokenData.token,
          });
        });
      } else {
        sendBadRequest(res, 'password or username not match', 403);
      }
    });
  } catch (error) {
    sendBadRequest(res, error.message, 400);
  }
}

function logout(req, res) {
  let obj = {};
  let token = req.get('Authorization');

  if (token === undefined) {
    res.status(401).json(obj);
    return;
  }
  tokensDb.deleteToken(token, (deleteInfo) => {
    if (deleteInfo === undefined) {
      res.status(500).json(obj);
    } else if (deleteInfo === false) {
      res.status(403).json(obj);
    } else {
      res.status(204).json(obj);
    }
  });
}

module.exports = {login: login, logout: logout};
