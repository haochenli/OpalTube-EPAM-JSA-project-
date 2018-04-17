import React from 'react';
import './index.scss';
import Uploads from '../../components/SuggestedVideosComponent/SuggestedVideosView';
import Subscribers from './SubscribersComponent';
import Header from '../../components/HeaderComponent';
import noVideoImg from './no-video.jpg';

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'tab': 'profile',
      'modify': false,
      'profileInfos': {uploads: [], subscribers: []},
      'loginuser': {},
      'isme': true,
    };
    this.defalutProfileInfos = {};
    this.fetchProfileInfos = this.fetchProfileInfos.bind(this);
    this.onChangeFullName = this.onChangeFullName.bind(this);
    this.onChangeAvatar = this.onChangeAvatar.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.fetchProfileInfos(this.props.location.search.split('=')[1], (profileInfos) => {
      if (profileInfos.fullName === undefined) {
        return;
      }
      this.defalutName = profileInfos.fullName;
      this.defalutAvatar = profileInfos.avatar;
      this.uploads = profileInfos.uploads;
      this.subscribers = profileInfos.subscribers;
      this.setState({'profileInfos': profileInfos});
      if (profileInfos.username !== this.state.loginuser.username) {
        this.setState({'isme': false});
      }
    });
    this.fetchLoginUserInfos((result) => {
      if (result.error) {
        return;
      }
      this.setState({'loginuser': result});
    });
  }
  fetchProfileInfos(userName, callback) {
    fetch('/api/profile/' + userName, {headers: {'Authorization': localStorage.getItem('token')}})
      .then((response) => response.json())
      .then((result) => callback(result));
  }
  fetchLoginUserInfos(callback) {
    fetch('/api/loginuser', {headers: {'Authorization': localStorage.getItem('token')}})
      .then((response) => response.json())
      .then((result) => callback(result));
  }
  onClickProfile() {
    this.setState({'tab': 'profile'});
  }
  onClickSubscription() {
    this.setState({'tab': 'subscription'});
  }
  onClickVideo() {
    this.setState({'tab': 'video'});
  }
  onChangeFullName(ev) {
    let profileInfos = this.state.profileInfos;

    profileInfos.fullName = ev.target.value;
    this.setState({'profileInfos': profileInfos});
  }
  onChangeAvatar(ev) {
    let profileInfos = this.state.profileInfos;

    profileInfos.avatar = ev.target.value;
    this.setState({'profileInfos': profileInfos});
  }
  onSubmit(ev) {
    ev.preventDefault();
    let statusCode;
    let newUserInfos = {
      'username': ev.target.elements.namedItem('username').value,
      'email': ev.target.elements.namedItem('email').value,
      'phoneNumber': ev.target.elements.namedItem('phoneNumber').value,
      'fullName': ev.target.elements.namedItem('fullName').value,
      'avatar': ev.target.elements.namedItem('avatar').value,
    };

    this.setState({'modify': true});
    fetch('/api/profile/' + newUserInfos.username, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify(newUserInfos),
    }).then((response) => {
      this.setState({'modify': false});
      statusCode = response.status;
      return response.json();
    }).then((result) => {
      if (statusCode === 200) {
        window.location.reload();
      }
    });
  }
  onCancel() {
    let defaultInfos = this.defalutProfileInfos;
    
    defaultInfos = {
      'fullName': this.defalutName,
      'avatar': this.defalutAvatar,
      'uploads': this.uploads,
      'subscribers': this.subscribers,
    };
    this.setState({profileInfos: defaultInfos});
  }
  render() {
    return (
      <div className="profile-screen">
        <Header userInfos={this.state.loginuser} />
        <div className="user-infos">
          <div className="profile-preview">
            <img src={this.state.profileInfos.avatar}/>
            <span className="user-full-name">{this.state.profileInfos.fullName}</span>
          </div>
          <nav>
            <button className={this.state.tab === 'profile' ?
              'my-profile-button active' : 
              'my-profile-button'}onClick={this.onClickProfile.bind(this)}>profife</button>
            <button className={this.state.tab === 'subscription' ?
              'my-subscriptions-button active' : 
              'my-subscriptions-button'} onClick={this.onClickSubscription.bind(this)}>subscribers</button>
            <button className={this.state.tab === 'video' ?
              'my-videos-button active' : 
              'my-videos-button'} onClick={this.onClickVideo.bind(this)}>videos</button>
          </nav>
          <form className={this.state.tab === 'profile' ?
            'my-profile show' :
            'my-profile'}
          onSubmit={this.onSubmit}
          >
            <h1>Profile</h1>
            <label>Username:</label>
            <input type="text" name="username" value={this.state.profileInfos.username} disabled={true}/>
            <label>Email:</label>
            <input type="email" name="email" value={this.state.profileInfos.email} disabled={true}/>
            <label>Phone number:</label>
            <input type="phoneNumber" name="phoneNumber" value={this.state.profileInfos.phoneNumber} disabled={true}/>
            <label htmlFor="fullName">Full name:</label>
            <input type="text" name="fullName" id="fullName" value={this.state.profileInfos.fullName} onChange={this.onChangeFullName} required
              placeholder="full name" disabled={!this.state.isme}/>
            <label htmlFor="avatar">Avatar:</label>
            <input type="avatar" name="avatar" id="avatar" value={this.state.profileInfos.avatar} onChange={this.onChangeAvatar} required
              placeholder="avatar" disabled={!this.state.isme}/>
            {
              this.state.isme ?
                <div>
                  <button type="submit" disabled={this.state.modify}>Modify</button>
                  <button type="button" className="cancel" onClick={this.onCancel.bind(this)}>Cancel</button>
                </div> :
                null
            }
            
          </form>
          <div className={this.state.tab === 'subscription' ?
            'my-subscriptions show' :
            'my-subscriptions'} >
            <h1>Subscribers</h1>
            <Subscribers subscribers={this.state.profileInfos.subscribers}/>
          </div>
          <div className={this.state.tab === 'video' ?
            'my-videos show' :
            'my-videos'} >
            <h1>My Videos</h1>
            {this.state.profileInfos.uploads.length === 0 ?
              <img src={noVideoImg} alt="no video"/> :
              <Uploads videoInfos={this.state.profileInfos.uploads} suggestedVideosNum={30}/>
            }
          </div>
        </div>
      </div>
    );
  }
}

ProfileScreen.defaultProps = {};

export default ProfileScreen;
