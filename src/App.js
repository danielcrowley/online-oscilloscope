import React, { Component } from 'react';
//import WebSocket from 'webscocket'
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
  
} from "react-router-dom";
// import Chat from './pages/Chat';
// import Signup from './pages/Signup';
// import Login from './pages/Login';
import ScreenGrab from './pages/screengrab';
import Home from './pages/home'
import { auth } from './services/firebase';



export default function App() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/ScreenGrab/:screenGrabId">
              <ScreenGrab />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
      
    );
  }
  
