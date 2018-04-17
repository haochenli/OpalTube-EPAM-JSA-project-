'use strict';

import React from 'react';
import Header from '../../components/HeaderComponent';
import NavigationBar from '../../components/NavigationBarComponent';
import VideosFull from '../../components/VideoFullViewComponent';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'videoLists': [],
      'clickUpload': false,
      'errorMessage': null,
      'uploading': false,
      'loginuser': {subscriptions:[]},
    };
    this.onClickUpload = this.onClickUpload.bind(this);
    this.onClickCancelUpload = this.onClickCancelUpload.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.fetchVideoLists((result) => {
      if (result.error) {
        return;
      }
      this.setState({videoLists: result});
    });
    this.fetchLoginUserInfos((result) => {
      if (result.error) {
        return;
      }
      this.setState({loginuser: result});
    });
  }
  fetchLoginUserInfos(callback) {
    fetch('/api/loginuser', {headers: {'Authorization': localStorage.getItem('token')}})
      .then((response) => response.json())
      .then((result) => callback(result));
  }
  fetchVideoLists(callback) {
    fetch('/api/videos')
      .then((response) => response.json())
      .then((result) => callback(result));
  }
  onClickUpload() {
    this.setState({clickUpload: true});
  }
  onClickCancelUpload() {
    this.setState({
      clickUpload: false,
      errorMessage: null,
      uploading: false,
    });
  }
  onSubmit(ev) {
    ev.preventDefault();
    let statusCode;
    let obj = {
      url: ev.target.elements.namedItem('video-url').value || undefined,
      preview: ev.target.elements.namedItem('video-preview').value || undefined,
      title: ev.target.elements.namedItem('video-title').value || undefined,
    };

    this.setState({uploading: true});
    fetch('/api/videos', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify(obj),
    }).then((response) => {
      statusCode = response.status;
      return response.json();
    }).then((result) => {
      if (statusCode === 201) {
        this.fetchVideoLists((newVideoLists) => {
          if (newVideoLists.error) {
            return;
          }
          this.setState({videoLists: newVideoLists});
        });
        this.onClickCancelUpload();
      } else {
        this.setState({
          errorMessage: result.error,
          uploading: false,
        });
      }
    });
  }
  render() {
    return (
      <div className="home-container">
        <Header className="header"
          onClickUpload={this.onClickUpload}
          userInfos={this.state.loginuser}
        />
        <div className="main">
          {this.state.clickUpload ?
            <form className="upload-form" onSubmit={this.onSubmit}>
              <input type="url" name="video-url" placeholder="video url" required
                disabled = {this.state.uploading}/>
              <input type="text" name="video-preview" placeholder="video preview" required
                disabled = {this.state.uploading}/>
              <input type="text" name="video-title" placeholder="video title" required
                disabled = {this.state.uploading}/>
              <button type="submit" disabled={this.state.uploading}
                className={this.state.uploading ? 'loading' : ''}>Upload</button>
              <button onClick={this.onClickCancelUpload}>Cancel</button>
              <p className="error-message">{this.state.errorMessage}</p>
              {this.state.uploading ?
                <div className="loader"></div> :
                null
              }
            </form>
            :
            null
          }
          <NavigationBar selected={'history'} className="navigationBar" subscriptions={this.state.loginuser.subscriptions}/>
          <div className="videos-full">
            <VideosFull
              history={this.state.loginuser.history}
              username={this.state.loginuser.username}
              userId={this.state.loginuser.userId}
              pagetype={'history'}
              videoLists={this.state.videoLists}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;