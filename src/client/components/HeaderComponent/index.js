'use strict';

import React from 'react';
import './index.scss';
import search from './assets/search.png';
import upload from './assets/upload.png';
import userprofile from './assets/userprofile.png';

class header extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      'onClickdropdown' : false, 
    }
  }
  changeDropdown(){
    this.setState({'onClickdropdown': !this.state.onClickdropdown});
  }
  clickSearch() {
   let value = document.getElementsByClassName('search-name')[0].value;
   window.location.href = '/search?'+value;
  }
  pressEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.clickSearch();
    }
  }
  Userlogout() {
    let token = localStorage.getItem('token');

    fetch('/api/login', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    }).then(function(event) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      window.location.href = '/login';
    }
    );
  }
  render() {
    return (
      <header className="header">
        <a href="/home" className="team-name">opal</a>
        <div className="obstacle"></div>
        <form>
          <img onClick={this.clickSearch} className="search-logo" src={search} ></img>
          <input className="search-name" placeholder="search" type="search" onKeyPress={this.pressEnter.bind(this)}>

          </input>
        </form>
        <div className="right-top">
          <button className="right-top-button" onClick={this.props.onClickUpload}>
            <img className="upload-logo" src={upload}></img>
            <span className="upload-name">upload</span>
          </button>
          <img className="user-profile" src={this.props.userInfos.avatar}></img>
          <nav className="hoverstuff">
            <div className="dropdown" onClick={this.changeDropdown.bind(this)}>
              {this.state.onClickdropdown ?
               <div className="dropdown-content">
                <a href={`/profile?username=${this.props.userInfos.username}`}>{this.props.userInfos.username}</a>
                <button onClick={this.Userlogout}>logout</button>
              </div> 
              :
              null
              }
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

header.defaultProps = {userprofile: userprofile};

export default header;

