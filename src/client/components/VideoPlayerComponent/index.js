import React from 'react';
import './index.scss';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <video controls
        src={this.props.videosrc} type="video/mp4"
      />
    );
  }
}

export default VideoPlayer;

