import React from 'react';
import './index.scss';
import SuggestedVideosView from './SuggestedVideosView';

class SuggesstedVideos extends React.Component {
  constructor(props) {
    super(props);
    this.onClickShowMore = this.onClickShowMore.bind(this);
    this.state = {suggestedVideosNum: 4};
  }
  onClickShowMore() {
    this.setState({suggestedVideosNum: 10});
  }
  render() {
    const defaultNum = 4;
    const suggestedVideosNum = this.state.suggestedVideosNum;

    return (
      <aside className="suggested-video-container">
        <h1>Up next</h1>
        <SuggestedVideosView
          videoInfos={this.props.videoLists}
          suggestedVideosNum={this.state.suggestedVideosNum}
        />
        <button className={suggestedVideosNum > defaultNum ?
          'show-more-button-clicked' : 'show-more-button'}
        onClick={this.onClickShowMore}>show more</button>
      </aside>
    );
  }
}

export default SuggesstedVideos;
