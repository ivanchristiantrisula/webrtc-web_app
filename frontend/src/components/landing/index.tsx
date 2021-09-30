import React, { useState } from "react";
// import '../App.css';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styles from "./landing.module.css";
import { Box, Grid, Link, makeStyles, Theme } from "@material-ui/core";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import Background from "./background.svg";
import { url } from "inspector";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${Background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  logoArea: {
    height: "5rem",
  },
  credsArea: {
    height: "10rem",
    alignItems: "center",
    justify: "center",
  },
  toRegister: {
    height: "3rem",
    display: "flex",
    alignItems: "center",
  },
  loginArea: {
    height: "3rem",
    display: "flex",
    alignItems: "center",
    justify: "center",
  },
  loginBox: {
    transform: "translateY(-50%)",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "20px",
  },
  name1: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
    fontSize: "2rem",
  },
  name2: {
    color: theme.palette.secondary.main,
    fontWeight: "bold",
    fontSize: "2rem",
  },
  textField: {
    marginBottom: "1rem",
  },
}));

function App() {
  const classes = useStyles();
  let history = useHistory();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const toRegister = () => {
    history.push("/register");
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status == 200) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          history.push("/chat");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box className={classes.root}>
      <Box
        boxShadow="5"
        width="20%"
        minWidth="25rem"
        margin="auto"
        padding="15px 20px 15px 20px"
        position="relative"
        top="50%"
        className={classes.loginBox}
      >
        <Grid container>
          <Grid item xs={12}>
            <Box
              className={classes.logoArea}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <span className={classes.name1}>
                <ChatBubbleOutlineOutlinedIcon fontSize="large" />
                Chat
              </span>
              <span className={classes.name2}>App</span>
            </Box>
          </Grid>
          <Grid item alignItems="center" justify="center" xs={12}>
            <Box>
              <form onSubmit={handleLogin}>
                <FormControl fullWidth>
                  <TextField
                    id="email"
                    label="Email"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    fullWidth
                    className={classes.textField}
                  />
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    fullWidth
                    className={classes.textField}
                  />
                </FormControl>
              </form>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box className={classes.toRegister}>
              Don't have an account yet? <Link href="/register">Sign Up</Link>{" "}
              now!
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box className={classes.loginArea}>
              <FormControl fullWidth>
                <Button
                  onClick={handleLogin}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Login
                </Button>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
