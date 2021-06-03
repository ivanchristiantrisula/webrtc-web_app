import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Switch, Route, BrowserRouter } from "react-router-dom";

import LandingPage from "./components/landing/";
import RegisterPage from "./components/register/";
import MainPage from "./components/main/main";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/chat" component={MainPage} />
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
