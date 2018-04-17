'use strict';

const signupData = require('../collections/users-db');

const EMAIL_REGEXP = /\S+@\S+\.\S+/;

function sendBadRequest(res, message) {
  res.setHeader('content-type', 'application/json');
  res.status(400).send({'error': message});
}

function validateUsername(username) {
  if (username.replace(' ', '') === '') {
    throw new Error('the username is void');
  }
}

function validateEmail(email) {
  if (email.replace(' ', '') === '') {
    throw new Error('the email is void');
  }
  if (!EMAIL_REGEXP.test(email)) {
    throw new Error('the email format is invalid');
  }
}

function validatePhoneNumber(phoneNumber) {
  if (phoneNumber.replace(' ', '') === '') {
    throw new Error('the phone number is void');
  }
  if (!/^\d+$/.test(phoneNumber)) {
    throw new Error('the phone number is invalid');
  }
}

function validateFullName(fullName) {
  if (fullName.replace(' ', '') === '') {
    throw new Error('the full name is void');
  }
  if (/\d/.test(fullName)) {
    throw new Error('the full name is invalid');
  }
}

function validatePassword(password) {
  if (password.replace(' ', '') === '') {
    throw new Error('the password is void');
  }
  if (password.length <= 5) {
    throw new Error('the password is too short');
  }
}

function checkInfoValid(userData) {
  validateUsername(userData.username);
  validateEmail(userData.email);
  validatePhoneNumber(userData.phoneNumber);
  validateFullName(userData.fullName);
  validatePassword(userData.password);
}

function signupUser(req, res) {
  try {
    checkInfoValid({
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body['phone number'],
      fullName: req.body['full name'],
      password: req.body.password,
    });
    signupData.storeUser(req, res);
  } catch (error) {
    sendBadRequest(res, error.message);
  }
}

module.exports = {signupUser: signupUser};
