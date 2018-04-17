import React from 'react';
import './index.scss';
import CommentsView from './CommentsView';
import userAvatar from './assets/Oval 4.png';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.addComment = this.addComment.bind(this);
    this.state = {'posting': false};
  }
  addComment(value, videoId) {
    let statusCode;

    this.setState({'posting': true});
    fetch('/api/videos/' + videoId + '/comments/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify({'content': value}),
    })
      .then((response) => {
        statusCode = response.status;
        response.json();
      })
      .then((result) => {
        if (statusCode === 200) {
          this.fetchVideoInfos(this.props.videoId, (videoInfos) => {
            this.props.updateVideoInfos(videoInfos);
            this.setState({'posting': false});
          });
        }
      });
  }
  fetchVideoInfos(videoId, callback) {
    fetch('/api/videos/' + videoId, {headers: {'Authorization': localStorage.getItem('token')}})
      .then((response) => response.json())
      .then((result) => callback(result));
  }
  render() {
    return (
      <CommentsView commentInfos={this.props.commentInfos}
        updateVideoInfos={this.props.updateVideoInfos}
        objectId={this.props.objectId}
        addComment={this.addComment}
        avatar={this.props.userInfos.avatar}
        videoId={this.props.videoId}
        posting={this.state.posting}
      />
    );
  }
}

export default Comments;
