import React from 'react';
import InputComment from '../InputComment';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.onClickComment = this.onClickComment.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onClickLikeButton = this.onClickLikeButton.bind(this);
    this.onClickDislikeButton = this.onClickDislikeButton.bind(this);
    this.state = {
      likeState: {
        likeClicked: this.props.commentInfo.likestatus,
        dislikeClicked: this.props.commentInfo.dislikestatus,
      },
      clickComment: false,
      likeNums: this.props.commentInfo.likeNums,
      dislikeNums: this.props.commentInfo.dislikeNums,
    };
  }
  onClickComment() {
    this.setState({clickComment: true});
  }
  onClickCancel() {
    this.setState({clickComment: false});
  }
  onClickLikeButton() {
    const likeState = this.state.likeState;

    if (likeState.dislikeClicked) {
      fetch('/api/videos/' + this.props.videoId + '/comments/'
      + this.props.commentId + '/dislike', {
        'method': 'delete',
        'headers': {'Authorization': localStorage.getItem('token')},
      }).then((response)=>{
        let newNums = this.state.dislikeNums - 1;

        this.setState({dislikeNums: newNums});
      });
      likeState.dislikeClicked = !likeState.dislikeClicked;
    } else {
      if (likeState.likeClicked === false) {
        fetch('/api/videos/' + this.props.videoId + '/comments/'
        + this.props.commentId + '/like', {
          'method': 'put',
          'headers': {'Authorization': localStorage.getItem('token')},
        }).then((response)=>{
          let newNums = this.state.likeNums + 1;

          this.setState({likeNums: newNums});
        });
      } else {
        fetch('/api/videos/' + this.props.videoId + '/comments/'
        + this.props.commentId + '/like', {
          'method': 'delete',
          'headers': {'Authorization': localStorage.getItem('token')},
        }).then((response)=>{
          let newNums = this.state.likeNums - 1;

          this.setState({likeNums: newNums});
        });
      }
      likeState.likeClicked = !likeState.likeClicked;
    }
    this.setState({likeState: likeState});
  }
  onClickDislikeButton() {
    const likeState = this.state.likeState;

    if (likeState.likeClicked) {
      fetch('/api/videos/' + this.props.videoId + '/comments/'
      + this.props.commentId + '/like', {
        'method': 'delete',
        'headers': {'Authorization': localStorage.getItem('token')},
      }).then((response)=>{
        let newNums = this.state.likeNums - 1;

        this.setState({likeNums: newNums});
      });
      likeState.likeClicked = !likeState.likeClicked;
    } else {
      if (likeState.dislikeClicked === false) {
        fetch('/api/videos/' + this.props.videoId +
        '/comments/' + this.props.commentId + '/dislike', {
          'method': 'put',
          'headers': {'Authorization': localStorage.getItem('token')},
        }).then((response)=>{
          let newNums = this.state.dislikeNums + 1;

          this.setState({dislikeNums: newNums});
        });
      } else {
        fetch('/api/videos/' + this.props.videoId + '/comments/'
        + this.props.commentId + '/dislike', {
          'method': 'delete',
          'headers': {'Authorization': localStorage.getItem('token')},
        }).then((response)=>{
          let newNums = this.state.dislikeNums - 1;

          this.setState({dislikeNums: newNums});
        });
      }
      likeState.dislikeClicked = !likeState.dislikeClicked;
    }
  }
  render() {
    return (
      <div className="comment" >
        <img src={this.props.commentInfo.avatar} alt=""/>
        <div className="comment-container">
          <p className="username">{this.props.commentInfo.username}</p>
          <p className="comment-content">
            {this.props.commentInfo.commentContent}
          </p>
          <button
            className={this.state.likeState.likeClicked ?
              'clicked like-button' :
              'like-button'
            }
            onClick={this.onClickLikeButton}>
          </button>
          <span className="like-num">{this.state.likeNums}</span>
          <button
            className={this.state.likeState.dislikeClicked ?
              'clicked dislike-button' :
              'dislike-button'
            }
            onClick={this.onClickDislikeButton}>
          </button>
          <span className="dislike-num">
            {this.state.dislikeNums}
          </span>
          <p className="comment-time">{new Date(this.props.commentInfo.commentTime).toLocaleString()}</p>
          <InputComment
            clicked={this.state.clickComment}
            onClickCancel={this.onClickCancel}
            avatar={this.props.avatar}
          />
        </div>
      </div>
    );
  }
}

export default Comment;
