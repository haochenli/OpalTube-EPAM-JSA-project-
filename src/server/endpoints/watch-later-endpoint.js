'use strict';

const usersDb = require('../collections/users-db');
const tokensDb = require('../collections/tokens-db');

function updateErrorhandle(res, result) {
  if (result === 'Upadate Failed') {
    res.status(500).json({'error': 'Update Failed'});
    return;
  }
  if (result === undefined) {
    res.status(500).json({'error': 'Unable connect database'});
    return;
  }
}

function watchLater(req, res) {
  let token = req.get('Authorization');
  let userId;

  if (token === undefined) {
    res.status(400).json({'error': 'unauthorization'});
    return;
  }
  tokensDb.getToken(token, (tokenInfos) => {
    userId = tokenInfos.userId;
    let videoId = req.params.videoId;

    usersDb.findUserInfoById(userId, (userInfos) => {
      if (userInfos.email === undefined) {
        res.status(404).json({'error': 'not found'});
        return;
      }
      let existuser = userInfos.watchlater.filter(function(value, index, array) {
        return (value.videoId === videoId);
      });

      if (existuser.length === 0) {
        userInfos.watchlater.push({'videoId': videoId});
      }
      usersDb.updateUserInfo(userInfos, userId, (result) => {
        updateErrorhandle(res, result);
        res.status(200).json({});
      });
    });
  });
}

module.exports = {watchLater: watchLater};

