'use strict';

const usersDb = require('../collections/users-db');
const tokensDb = require('../collections/tokens-db');
const videosDb = require('../collections/videos-db.js');

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

function trackVideoHistory(req, res) {
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
      if (userInfos.history.length === 0 || userInfos.history[userInfos.history.length - 1].videoId !== videoId) {
        userInfos.history.push({'videoId': videoId});
      }
      usersDb.updateUserInfo(userInfos, userId, (result) => {
        updateErrorhandle(res, result);
        videosDb.increaseViewNum(videoId, (videosViews) => {
          res.status(200).json({'views': videosViews});
        });
      });
    });
  });
}

module.exports = {trackVideoHistory: trackVideoHistory};
