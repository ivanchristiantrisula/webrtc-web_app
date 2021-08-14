import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  Input,
  InputBase,
  InputLabel,
  TextField,
  TextFieldClassKey,
  TextFieldProps,
  Theme,
} from "@material-ui/core";
import { Container, createStyles, makeStyles } from "@material-ui/core";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
    topGrid: {
      height: "20%",
    },
    bottomGrid: {
      height: "100%",
    },

    avatar: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },

    grid: {
      display: "flex",
      alignItems: "center",
      paddingLeft: "20px",
      paddingRight: "20px",
      paddingTop: "40px",
    },
  })
);

const initState = {
  name: JSON.parse(localStorage.getItem("user")).name,
  bio: JSON.parse(localStorage.getItem("user")).bio,
};

export default (props: { user: any }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  let history = useHistory();
  const classes = useStyle();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(props.user.name);
  const [bio, setBio] = useState(props.user.bio);

  let nameInputRef = useRef<TextFieldProps>();
  let bioInputRef = useRef<TextFieldProps>();

  const resetFields = () => {
    setName(initState.name);
    setBio(initState.bio);
    nameInputRef.current.value = props.user.name;
    bioInputRef.current.value = props.user.bio;
    setEditMode(false);
  };

  const saveProfileEdit = () => {
    // send post to backend
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/updateProfile`,
        {
          name: name,
          bio: bio,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status == 200) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          resetCookies();
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const resetCookies = () => {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };
  return (
    <>
      <Container className={classes.root}>
        <Grid container style={{ height: "100%", width: "100%" }}>
          <Grid
            item
            xs={3}
            style={{
              height: "20%",
            }}
            className={classes.grid}
          >
            <Avatar
              className={classes.avatar}
              src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${
                JSON.parse(localStorage.getItem("user"))._id
              }.png`}
            />
          </Grid>

          <Grid item xs={9} style={{ height: "20%" }} className={classes.grid}>
            <FormControl fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                id="name"
                defaultValue={name}
                onChange={(e) => {
                  setEditMode(true);
                  setName(e.target.value);
                }}
                inputRef={nameInputRef}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            className={classes.grid}
            style={{ height: "70%", alignItems: "flex-start" }}
          >
            <TextField
              id="outlined-multiline-static"
              label="Bio"
              multiline
              rows={12}
              defaultValue={bio}
              variant="outlined"
              fullWidth
              placeholder="Tell the world a little about yourself"
              onChange={(e) => {
                setEditMode(true);
                setBio(e.target.value);
              }}
              inputRef={bioInputRef}
            />
          </Grid>
          <Grid item xs={12} style={{ height: "10%", float: "right" }}>
            <Box
              style={{ float: "right" }}
              display={editMode ? "block" : "none"}
            >
              <Button color="primary" onClick={() => resetFields()}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => saveProfileEdit()}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
