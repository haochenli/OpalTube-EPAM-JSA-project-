'use strict';

const videosDb = require('../collections/videos-db');
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

function thumbUp(req, res) {
  let token = req.get('Authorization');
  let userId;

  if (token === undefined) {
    res.status(400).json({'error': 'unauthorization'});
    return;
  }
  tokensDb.getToken(token, (userInfos) => {
    userId = userInfos.userId;
    let insertUser = true;
    let videoId = req.params.videoId;

    videosDb.findVideoInfo(req.params.videoId, (videoInfos) => {
      if (videoInfos._id === undefined) {
        res.status(404).json({'error': 'not found'});
        return;
      }
      videoInfos.videoDetails.LikeStatus.map(function(likeStatus) {
        if (likeStatus.userId.toString() === userId.toString()) {
          likeStatus.liked = true;
          likeStatus.disliked = false;
          insertUser = false;
        } return;
      });
      if (insertUser) {
        videoInfos.videoDetails.LikeStatus.push({
          'userId': userId,
          'liked': true,
          'disliked': false,
        });
      }
      videosDb.updateVideoInfo(videoInfos, videoId, (result) => {
        updateErrorhandle(res, result);
        res.status(200).json({});
      });
    });
  });
}

function thumbDown(req, res) {
  let token = req.get('Authorization');
  let userId;

  if (token === undefined) {
    res.status(400).json({'error': 'unauthorization'});
    return;
  }
  tokensDb.getToken(token, (userInfos) => {
    userId = userInfos.userId;
    let insertUser = true;
    let videoId = req.params.videoId;

    videosDb.findVideoInfo(req.params.videoId, (videoInfos) => {
      if (videoInfos._id === undefined) {
        res.status(404).json({'error': 'not found'});
        return;
      }
      videoInfos.videoDetails.LikeStatus.map(function(likeStatus) {
        if (likeStatus.userId.toString() === userId.toString()) {
          likeStatus.liked = false;
          likeStatus.disliked = true;
          insertUser = false;
        } return;
      });
      if (insertUser) {
        videoInfos.videoDetails.LikeStatus.push({
          'userId': userId,
          'liked': false,
          'disliked': true,
        });
      }
      videosDb.updateVideoInfo(videoInfos, videoId, (result) => {
        updateErrorhandle(res, result);
        res.status(200).json({});
      });
    });
  });
}

function cancelthumbUp(req, res) {
  let token = req.get('Authorization');
  let userId;

  if (token === undefined) {
    res.status(400).json({'error': 'unauthorization'});
    return;
  }
  tokensDb.getToken(token, (userInfos) => {
    userId = userInfos.userId;
    let videoId = req.params.videoId;

    videosDb.findVideoInfo(req.params.videoId, (videoInfos) => {
      if (videoInfos._id === undefined) {
        res.status(404).json({'error': 'not found'});
        return;
      }
      videoInfos.videoDetails.LikeStatus.map(function(likeStatus) {
        if (likeStatus.userId.toString() === userId.toString()) {
          likeStatus.liked = false;
        } return;
      });
      videosDb.updateVideoInfo(videoInfos, videoId, (result) => {
        updateErrorhandle(res, result);
        res.status(200).json({});
      });
    });
  });
}

function cancelthumbDown(req, res) {
  let token = req.get('Authorization');
  let userId;

  if (token === undefined) {
    res.status(400).json({'error': 'unauthorization'});
    return;
  }
  tokensDb.getToken(token, (userInfos) => {
    userId = userInfos.userId;
    let videoId = req.params.videoId;

    videosDb.findVideoInfo(req.params.videoId, (videoInfos) => {
      if (videoInfos._id === undefined) {
        res.status(404).json({'error': 'not found'});
        return;
      }
      videoInfos.videoDetails.LikeStatus.map(function(likeStatus) {
        if (likeStatus.userId.toString() === userId.toString()) {
          likeStatus.disliked = false;
        } return;
      });
      videosDb.updateVideoInfo(videoInfos, videoId, (result) => {
        updateErrorhandle(res, result);
        res.status(200).json({});
      });
    });
  });
}

function judgeVotetype(req, res) {
  let votetype = req.params.votetype;

  if (votetype === 'likes') {
    thumbUp(req, res);
  } else if (votetype === 'dislikes') {
    thumbDown(req, res);
  }
}

function judgeCanceltype(req, res) {
  let votetype = req.params.votetype;

  if (votetype === 'likes') {
    cancelthumbUp(req, res);
  } else if (votetype === 'dislikes') {
    cancelthumbDown(req, res);
  }
}

module.exports = {
  judgeVotetype: judgeVotetype,
  judgeCanceltype: judgeCanceltype,
};

