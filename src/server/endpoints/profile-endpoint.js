'use strict';

const tokensDb = require('../collections/tokens-db');
const usersDb = require('../collections/users-db');
const videosDb = require('../collections/videos-db');

function getUserProfiles(req, res) {
  if (req.get('Authorization') === undefined) {
    res.status(401).json({'error': 'unauthorized'});
    return;
  }
  tokensDb.getToken(req.get('Authorization'), (tokenInfos) => {
    if (tokenInfos._id === undefined) {
      res.status(401).json({'error': 'unauthorized'});
      return;
    }
    usersDb.findUserInfoByUsername(req.params.username, (userInfos) => {
      if (userInfos === undefined) {
        res.status(404).json({'error': 'not found'});
        return;
      }
      videosDb.getUploadVideosByUsername(req.params.username, (uploadVideos) => {
        res.status(200).json({
          'username': userInfos.username,
          'email': userInfos.email,
          'phoneNumber': userInfos['phone number'],
          'fullName': userInfos['full name'],
          'avatar': userInfos.avatar,
          'subscribers': userInfos.subscribers,
          'uploads': uploadVideos,
        });
      });
    });
  });
}

function modifyUserProfiles(req, res) {
  if (req.get('Authorization') === undefined) {
    res.status(401).json({'error': 'unauthorized'});
    return;
  }
  tokensDb.getToken(req.get('Authorization'), (tokenInfos) => {
    if (tokenInfos._id === undefined) {
      res.status(401).json({'error': 'unauthorized'});
      return;
    }
    usersDb.updateUserInfos(req.params.username, req.body, (updateResult) => {
      if (updateResult === 'failed') {
        res.status(500).json({'error': 'update failed'});
        return;
      }
      res.status(200).json({});
    });
  });
}

module.exports = {
  getUserProfiles: getUserProfiles,
  modifyUserProfiles: modifyUserProfiles,
};
