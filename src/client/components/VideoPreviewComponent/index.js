import React from 'react';

class VideoPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {viewNumber: this.props.videoInfo.viewNumber};
  }
  storeHistory() {
    this.setState({viewNumber: this.state.viewNumber + 1});
    fetch(`/api/videos/${this.props.videoInfo.videoId}/track-video-history`, {
      method: 'post',
      headers: {'Authorization': localStorage.getItem('token')},
    });
  }
  render() {
    return (
      <li className="suggested-video-list">
        <div className="suggested-video">
          <a href={`/watch?videoId=${this.props.videoInfo.videoId}`}
            style={
              {backgroundImage: `url(${this.props.videoInfo.previewSrc})`}
            }
            onClick={this.storeHistory.bind(this)}
          >
            <span>{this.props.videoInfo.videoTime}</span>
          </a>
        </div>
        <p className="title">{this.props.videoInfo.title}</p>
        <span className="video-message">
          <span>{this.props.videoInfo.author}</span>
          <span>{this.state.viewNumber} views</span>
        </span>
      </li>
    );
  }
}

export default VideoPreview;
