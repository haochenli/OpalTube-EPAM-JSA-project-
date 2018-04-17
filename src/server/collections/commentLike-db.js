'use strict';

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
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

function dbError(err, res, db) {
  if (err) {
    res.status(404).send();
    db.close();
    return;
  }
}

function commentRequestHandler(req, res, callback) {
  let userId;
  let videosId = req.params.videoId;
  let commentId = req.params.commentsId;
  let votetype = req.params.votetype;

  console.log(videosId);
  MongoClient.connect(url, (err, db) => {
    if (err) {
      throw err;
    }
    db.collection('videos').find({'_id': ObjectId(videosId)})
      .toArray(function(err, items) {
        dbError(err, res, db);
        let VideoObject = items[0];
        let token = req.get('Authorization');

        db.collection('tokenDescriptors')
          .find({'token': token})
          .toArray(function(err, subitems) {
            dbError(err, res, db);
            if (subitems[0] === undefined) {
              console.log('Not login', err);
              res.status(400).send({'error': 'Not login sorry!'});
              db.close();
              return;
            }
            userId = subitems[0].userId;
            let inputObj = {
              'votetype': votetype,
              'db': db,
              'videosId': videosId,
              'userId': userId,
              'VideoObject': VideoObject,
              'res': res,
              'commentId': commentId,
            };

            callback(inputObj);
          });
      });
  });
}

function updateCommentsInfo(obj, tempArray) {
  obj.VideoObject.commentInfos[obj.commentId].LikeStatus = tempArray;
  obj.db.collection('videos')
    .update({'_id': ObjectId(obj.videosId)},
      {$set: {'commentInfos': obj.VideoObject.commentInfos}});
}

module.exports = {
  commentRequestHandler: commentRequestHandler,
  updateCommentsInfo: updateCommentsInfo,
};
