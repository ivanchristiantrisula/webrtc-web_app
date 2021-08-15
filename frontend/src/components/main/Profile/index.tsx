import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputBase,
  InputLabel,
  TextField,
  TextFieldClassKey,
  TextFieldProps,
  Theme,
} from "@material-ui/core";
import {
  Container,
  createStyles,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  FormLabel,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import { TextFormat, Visibility, VisibilityOff } from "@material-ui/icons";
import clsx from "clsx";

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
    margin: {
      margin: theme.spacing(1),
    },
    textField: {
      width: "25ch",
    },

    passwordDialog: {
      width: "50%",
    },
  })
);

const initState = {
  name: JSON.parse(localStorage.getItem("user")).name,
  bio: JSON.parse(localStorage.getItem("user")).bio,
};

const ChangePasswordDialog = (props: {
  openDialog: boolean;
  onClose: Function;
}) => {
  const classes = useStyle();
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState(false);

  useEffect(() => {
    validation();
  }, [oldPassword, newPassword, confirmPassword]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleChangeOld = (pass: string) => {
    setOldPassword(pass);
  };
  const handleChangeNew = (pass: string) => {
    setNewPassword(pass);
  };
  const handleChangeConfirm = (pass: string) => {
    setConfirmPassword(pass);
  };

  const validation = () => {
    let match = confirmPassword === newPassword;
    setConfirmError(!match);

    return match;
  };
  const handleSave = () => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/changePassword`,
        {
          old: oldPassword,
          new: newPassword,
          confirm: confirmPassword,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          resetCookies();
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Dialog open={props.openDialog}>
      <DialogTitle id="">Change Password</DialogTitle>
      <DialogContent>
        <Box>
          <FormControl className={clsx(classes.margin, classes.textField)}>
            <TextField
              label="Old Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => handleChangeOld(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => handleChangeNew(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => handleChangeConfirm(e.target.value)}
              error={confirmError ? true : false}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSave()}
          disabled={
            oldPassword != "" &&
            newPassword != "" &&
            confirmPassword != "" &&
            !confirmError
              ? false
              : true
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
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

export default (props: { user: any }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  let history = useHistory();
  const classes = useStyle();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(props.user.name);
  const [bio, setBio] = useState(props.user.bio);
  const [openChangePassDialog, setOpenChangePassDialog] = useState(false);

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
            style={{
              height: "70%",
              alignItems: "flex-start",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box style={{ width: "100%", marginBottom: "20px" }}>
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
            </Box>
            <Box style={{ float: "right" }} width="100%"></Box>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                setOpenChangePassDialog(true);
              }}
            >
              Change Password
            </Button>
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

      <ChangePasswordDialog
        openDialog={openChangePassDialog}
        onClose={() => {
          setOpenChangePassDialog(false);
        }}
      />
    </>
  );
};
