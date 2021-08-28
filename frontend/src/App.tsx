import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import LandingPage from "./components/landing/";
import RegisterPage from "./components/register/";
import MainPage from "./components/main/main";
import {
  createMuiTheme,
  makeStyles,
  Snackbar,
  ThemeProvider,
} from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import AdminPage from "./components/admin";

const theme = createMuiTheme({
  palette: {
    type: "light",
  },
});
const useStyles = makeStyles({
  snackbar: {
    whiteSpace: "pre-line",
  },
});

function App() {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          classes={{
            variantSuccess: classes.snackbar,
            variantError: classes.snackbar,
            variantWarning: classes.snackbar,
            variantInfo: classes.snackbar,
          }}
        >
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/chat" component={MainPage} />
            <Route path="/admin" component={AdminPage} />
          </Switch>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
