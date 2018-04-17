import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Signup from '../client/screen/SignUpScreen';
import Login from '../client/screen/LoginScreen';
import Home from '../client/screen/HomeScreen';
import Trending from '../client/screen/TrendingScreen';
import Liked from '../client/screen/LikedScreen';
import Feed from '../client/screen/FeedScreen';
import History from '../client/screen/HistoryScreen';
import WatchLater from '../client/screen/WatchLaterScreen';
import Profile from '../client/screen/ProfileScreen';
import Search from '../client/screen/SearchScreen';


class App extends React.Component {
  render() {
    return (
      <Router>
        <div>

          <Route exact path="/" component={Signup} />
          <Route path="/trending" component={Trending} />
          <Route path="/login" component={Login} />
          <Route path="/feed" component={Feed} />
          <Route path="/search" component={Search} />
          <Route path="/signup" component={Signup} />
          <Route path="/watchlater" component={WatchLater} />
          <Route path="/history" component={History} />
          <Route path="/home" component={Home} />
          <Route path="/watch" component={Home} />
          <Route path="/liked" component={Liked} />
          <Route path="/profile" component={Profile} />
        </div>
      </Router>
    );
  }
}

export default App;
