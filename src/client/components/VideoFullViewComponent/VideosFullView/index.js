import React from 'react';
import VideoPreview from '../../VideoPreviewComponent';

const VideosFullView = (props) => {
  let renderElement = [];
  if (props.pagetype === 'trending') {
    let order = props.videoInfos;

    order.sort((a, b) => b.viewNumber - a.viewNumber);
    renderElement = order.map((value, index) =>
      <VideoPreview
        videoInfo={value}
        key={value.videoId} />
    );
  } else if (props.pagetype === 'liked') {
    renderElement = props.videoInfos.filter((videoInfo) => videoInfo.likeStatus.some((likeStatus) => props.userId === likeStatus.userId && likeStatus.liked === true)).map((filteredVideoInfo) => <VideoPreview
      videoInfo={filteredVideoInfo}
      key={filteredVideoInfo.videoId} />);
  } else if (props.pagetype === 'feed') {
    renderElement = props.videoInfos.filter((videoInfo) => (videoInfo.author === props.username)).map((value)=><VideoPreview
      videoInfo={value}
      key={value.videoId} />);
  } else if (props.pagetype === 'history') {
    if (props.history !== undefined) {
      renderElement = props.videoInfos.filter((videoInfo)=>props.history.some((singleHistory)=>videoInfo.videoId === singleHistory.videoId)).map((value)=><VideoPreview
        videoInfo={value}
        key={value.videoId} />);
    }
  } else if (props.pagetype === 'watchlater') {
    if (props.watchlater !== undefined) {
      renderElement = props.videoInfos.filter((videoInfo)=>props.watchlater.some((watchElement)=>videoInfo.videoId === watchElement.videoId)).map((value)=><VideoPreview
        videoInfo={value}
        key={value.videoId} />);
    }
  } else if (props.pagetype === 'search') {
    let search = props.searchContent.slice(1);
    renderElement = props.videoInfos.filter((videoInfo)=>{
      return videoInfo.title.indexOf(search) !== -1;
    }).map((value)=>{
      return <VideoPreview
      videoInfo={value}
      key={value.videoId} />
    });
  }

  return (
    <div className="suggested-video-ul">
      {renderElement}
    </div>
  );
};

export default VideosFullView;

