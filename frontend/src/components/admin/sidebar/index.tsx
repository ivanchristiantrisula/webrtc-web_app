import {
  Avatar,
  Box,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popper,
  Theme,
} from "@material-ui/core";
import React, { useState } from "react";
import ReportIcon from "@material-ui/icons/Report";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => ({
  open: {
    borderLeft: "solid white 5px",
    color: "white",
  },
  openIcon: {
    color: "white",
  },
  icon: {
    color: "rgb(201, 206, 209)",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: 0,
  },
  avatar: {
    position: "fixed",
    bottom: "0",
    marginBottom: "10px",
    width: "5rem",
    borderRadius: 0,
  },
  root: {
    backgroundColor: theme.palette.secondary.main,
    width: "5rem",
    height: "100vh",
  },
}));

function App(props: { openMenu: Function }) {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState("reports");

  const handleLogOut = () => {
    localStorage.clear();

    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    window.location.href = "/";
  };
  return (
    <Box className={classes.root}>
      <List>
        <ListItem
          button
          className={`${openMenu === "reports" ? classes.open : ""} ${
            classes.iconContainer
          }`}
          onClick={() => {
            setOpenMenu("reports");
            props.openMenu("reports");
          }}
        >
          <ListItemIcon>
            <ReportIcon
              style={{ display: "block", margin: "auto" }}
              className={
                openMenu === "reports" ? classes.openIcon : classes.icon
              }
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          className={`${openMenu === "bans" ? classes.open : ""} ${
            classes.iconContainer
          }`}
          onClick={() => {
            setOpenMenu("bans");
            props.openMenu("bans");
          }}
        >
          <ListItemIcon>
            <CloseIcon
              style={{ display: "block", margin: "auto" }}
              className={openMenu === "bans" ? classes.openIcon : classes.icon}
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
      </List>
    </Box>
  );
}

export default App;
