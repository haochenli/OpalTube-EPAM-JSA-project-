'use strict';

const commentDb = require('../collections/commentLike-db');

function deletecommentRequestHandler(res, req) {
  commentDb.commentRequestHandler(res, req, (obj)=>{
    let tempArray = obj.VideoObject.commentInfos[obj.commentId].LikeStatus;
    let flag = [false];

    if (obj.votetype === 'like') {
      iterateArray(tempArray, false, obj.userId, 'liked', flag);
      commentDb.updateCommentsInfo(obj, tempArray);
    } else if (obj.votetype === 'dislike') {
      iterateArray(tempArray, false, obj.userId, 'disliked', flag);
      commentDb.updateCommentsInfo(obj, tempArray);
    }
    sendResponse(tempArray, obj.res, obj.db);
  });
}

function putcommentRequestHandler(res, req) {
  commentDb.commentRequestHandler(res, req, (obj)=>{
    let tempArray = obj.VideoObject.commentInfos[obj.commentId].LikeStatus;
    let flag = [false];

    if (obj.votetype === 'like') {
      iterateArray(tempArray, true, obj.userId, 'liked', flag);
      if (!flag[0]) {
        createObj(true, false, tempArray, obj.userId);
      }
      commentDb.updateCommentsInfo(obj, tempArray);
    } else if (obj.votetype === 'dislike') {
      iterateArray(tempArray, true, obj.userId, 'disliked', flag);
      if (!flag[0]) {
        createObj(false, true, tempArray, obj.userId);
      }
      commentDb.updateCommentsInfo(obj, tempArray);
    }
    sendResponse(tempArray, obj.res, obj.db);
  });
}

function sendResponse(tempArray, res, db) {
  if (tempArray === undefined) {
    res.status(500).send();
  }
  let sendObj = countLikeAndDislikedNumber(tempArray);

  res.setHeader('content-type', 'application/json');

  res.status(200).send(sendObj);
}

function iterateArray(tempArray, changedValue, userId, target, flag) {
  tempArray.forEach((part, index)=> {
    if (tempArray[index].userId === userId.toString()) {
      if (target === 'disliked') {
        tempArray[index].disliked = changedValue;
      } else if (target === 'liked') {
        tempArray[index].liked = changedValue;
      }
      flag[0] = true;
    }
  });
}

function countLikeAndDislikedNumber(commentUserArray) {
  let likednumber = 0;
  let dislikednumber = 0;

  commentUserArray.forEach(function(element) {
    if (element.liked === true) {
      likednumber++;
    }
    if (element.disliked === true) {
      dislikednumber++;
    }
  });
  let result = {
    'likedNumber': likednumber,
    'dislikedNumber': dislikednumber,
  };

  return result;
}

function createObj(like, dislike, tempArray, userId) {
  let objInsert = {
    'userId': userId.toString(),
    'liked': like,
    'disliked': dislike,
  };

  tempArray.push(objInsert);
}

module.exports = {
  commentEnable: putcommentRequestHandler,
  commentDisable: deletecommentRequestHandler,
};
