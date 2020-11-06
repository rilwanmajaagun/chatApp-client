import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import Header from './component/Header';
import Footer from './component/Footer';
import Signup from './views/Signup';
import Home from './views/Home';
import Login from './views/Login';
import GeneralMessage from './views/GeneralMessage';
import PrivateMessage from './views/PrivateMessage';
import Room from './views/Room';
import ChatRoom from './views/ChatRoom';
import ChatWithFriends from './views/ChatWithFriends';
import AddFriends from './views/AddFriends';
import Push from './views/Push';




function App() {
  return (
    <div>
      <Router>
        <Header />
        <Push/>
        <Footer />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/generalMessage' component={GeneralMessage} />
          <Route path='/private' component={PrivateMessage} />
          <Route path='/room' component={Room} />
          <Route path='/chat' component={ChatRoom} />
          <Route path='/friends' component={ChatWithFriends} />
          <Route path='/addFriends' component={AddFriends}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
