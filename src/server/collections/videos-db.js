'use strict';

require('dotenv').config();
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
const tokensDb = require('./tokens-db');
const usersDb = require('./users-db');

function updateVideoInfo(videoInfos, videoId, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      return callback(undefined);
    }
    let videosDB = db.collection('videos');

    videosDB.update({'_id': ObjectId(videoId)}, {'$set': videoInfos}, (err, result) => {
      if (err) {
        console.log(err);
        return callback('Upadate Failed');
      }
      db.close();
      return callback('success');
    });
  });
}

function findVideoInfo(videoId, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err.name + ':' + err.message);
      return callback(undefined);
    }
    let videosDB = db.collection('videos');

    videosDB.findOne({'_id': ObjectId(videoId)}, (err, result) => {
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

function addCommentToVideo(userInfo, videoId, content, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err.name + ':' + err.message);
      return callback(undefined);
    }
    let videosDB = db.collection('videos');

    videosDB.findOne({'_id': ObjectId(videoId)}, (err, videoInfo) => {
      if (err) {
        console.log(err);
        return callback(undefined);
      }
      let commentId;

      if (videoInfo.commentInfos.length === 0) {
        commentId = 0;
      } else {
        commentId = videoInfo
          .commentInfos[videoInfo.commentInfos.length - 1].commentId + 1;
      }
      let obj = {
        'username': userInfo.username,
        'userId': userInfo._id,
        'avatar': userInfo.avatar,
        'commentTime': Date.now(),
        'LikeStatus': [],
        'commentContent': content,
        'commentId': commentId,
      };

      videosDB.update({'_id': ObjectId(videoId)},
        {$push: {'commentInfos': obj}},
        (err, result) => {
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
  });
}

function addComment(videoId, token, content, callback) {
  tokensDb.getToken(token, (tokenInfo) => {
    usersDb.findUserInfoById(tokenInfo.userId, (userInfo) => {
      addCommentToVideo(userInfo, videoId, content, callback);
    });
  });
}

function getAllVideo(callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err.name + ':' + err.message);
      return callback(undefined);
    }
    let videosDB = db.collection('videos');

    videosDB.find().sort({'videoDetails.publishDate': -1}).toArray((err, result) => {
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

function insertVideoToDatabase(userInfo, videoInfos, token, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err.name + ':' + err.message);
      return callback(undefined);
    }
    let videosDB = db.collection('videos');
    let uploadVideoInfos = {
      'videoUrl': videoInfos.videoUrl,
      'videoDetails': {
        'title': videoInfos.videoTitle,
        'views': 0,
        'LikeStatus': [],
        'publishDate': Date.now(),
        'time': '5:00',
        'preview': videoInfos.preview,
      },
      'uploader': {
        'name': userInfo.username,
        'userId': userInfo._id,
        'avatar': userInfo.avatar,
        'subscribers': userInfo.subscribers,
      },
      'commentInfos': [],
    };

    videosDB.insertOne(uploadVideoInfos, (err, result) => {
      if (err) {
        return callback(undefined);
      }
      return callback(result.ops[0]._id.toString());
    });
  });
}

function addVideo(videoInfos, token, callback) {
  tokensDb.getToken(token, (tokenInfo) => {
    usersDb.findUserInfoById(tokenInfo.userId, (userInfo) => {
      insertVideoToDatabase(userInfo, videoInfos, token, callback);
    });
  });
}

function getUploadVideosByUsername(userName, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err.name + ':' + err.message);
      return callback(undefined);
    }
    let videosDB = db.collection('videos');

    videosDB.find({'uploader.name': userName}).toArray((err, result) => {
      if (err) {
        console.log(err);
      }
      db.close();
      if (result.length === 0) {
        return callback([]);
      }
      return callback(result.map((value) => ({
        'videoId': value._id.toString(),
        'videoSrc': value.videoUrl,
        'previewSrc': value.videoDetails.preview,
        'title': value.videoDetails.title,
        'videoTime': value.videoDetails.time,
        'author': value.uploader.name,
        'viewNumber': value.videoDetails.views,
      }
      )));
    });
  });
}

function increaseViewNum(videoId, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err.name + ':' + err.message);
      return callback(undefined);
    }
    let videosDB = db.collection('videos');

    videosDB.findOne({'_id': ObjectId(videoId)}, (err, videoInfo) => {
      if (err) {
        console.log(err.name + ':' + err.message);
        return callback(undefined);
      }
      if (videoInfo === null) {
        return callback([]);
      }
      let newVideoDetails = videoInfo.videoDetails;

      newVideoDetails.views = ++videoInfo.videoDetails.views;
      videosDB.update({'_id': ObjectId(videoId)}, {$set: {'videoDetails': newVideoDetails}}, (err, result) => {
        if (err) {
          console.log(err);
          return callback(undefined);
        }
        db.close();
        return callback(newVideoDetails.views);
      });
    });
  });
}

function increaseSubscribe(userInfos, targetUserInfos, callback) {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      return callback(undefined);
    }
    let videosDB = db.collection('videos');

    videosDB.updateMany({'uploader.userId': ObjectId(targetUserInfos.userId)}, {$push: {'uploader.subscribers': userInfos}}, (err) => {
      if (err) {
        console.log(err);
        return callback('Upadate Failed');
      }
      db.close();
      return callback('success');
    });
  });
}

module.exports = {
  findVideoInfo: findVideoInfo,
  updateVideoInfo: updateVideoInfo,
  addComment: addComment,
  addVideo: addVideo,
  getAllVideo: getAllVideo,
  getUploadVideosByUsername: getUploadVideosByUsername,
  increaseViewNum: increaseViewNum,
  increaseSubscribe: increaseSubscribe,
};

