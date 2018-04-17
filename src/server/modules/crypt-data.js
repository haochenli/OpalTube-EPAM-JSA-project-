'use strict';

let CryptoJS = require('crypto-js');

function crypto(String) {
  let encrypted = CryptoJS.AES.encrypt(String, 'Secret Passphrase');

  return encrypted.toString();
}

function decrypto(String) {
  let decrypted = CryptoJS.AES.decrypt(String, 'Secret Passphrase');

  return decrypted.toString();
}

module.exports = {
  encryptoData: crypto,
  decryptoData: decrypto,
};
// let encrypted = CryptoJS.AES.encrypt(req.body.password, 'Secret Passphrase');
// let decrypted = CryptoJS.AES.decrypt(encrypted, 'Secret Passphrase');
// console.log(decrypted.toString(CryptoJS.enc.Utf8));
