import React from 'react';
import './index.scss';
import VideosFullView from './VideosFullView';

class VideosFull extends React.Component {
  render() {
    return (
      <aside className="full-video-container">
        <VideosFullView
          searchContent={this.props.searchContent}
          history={this.props.history}
          watchlater={this.props.watchlater}
          username={this.props.username}
          userId={this.props.userId}
          pagetype={this.props.pagetype}
          videoInfos={this.props.videoLists}
        />
      </aside>
    );
  }
}

export default VideosFull;
