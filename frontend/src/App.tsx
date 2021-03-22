import React from 'react';
import logo from './logo.svg';
import './App.css';

import {Switch,Route, BrowserRouter} from 'react-router-dom';

import LandingPage from "./components/landing/";
import RegisterPage from "./components/register/";
import MainPage from "./components/main/";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingPage}/>
        <Route path="/register" component={RegisterPage}/>
        <Route path="/chat" component={MainPage}/>
      </Switch>
    </BrowserRouter>
    
  );
}

export default App;
