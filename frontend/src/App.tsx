import React from 'react';
import logo from './logo.svg';
import './App.css';

import {Switch,Route, BrowserRouter} from 'react-router-dom';

import LandingPage from "./components/landing/";
import RegisterPage from "./components/register/";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingPage}/>
        <Route path="/register" component={RegisterPage}/>
      </Switch>
    </BrowserRouter>
    
  );
}

export default App;
