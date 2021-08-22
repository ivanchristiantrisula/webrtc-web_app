import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import React from "react";
import GroupIcon from "@material-ui/icons/Group";
import ChatIcon from "@material-ui/icons/Chat";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";

function App(props: any) {
  const getUID = () => {
    return JSON.parse(localStorage.getItem("user"))._id;
  };
  return (
    <React.Fragment>
      <List>
        <ListItem
          button
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ListItemIcon
            onClick={() => {
              props.openMenu("friendlist");
            }}
          >
            <PersonIcon
              style={{ color: "white", display: "block", margin: "auto" }}
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ListItemIcon
            onClick={() => {
              props.openMenu("chatlist");
            }}
          >
            <ChatIcon
              style={{ color: "white", display: "block", margin: "auto" }}
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ListItemIcon
            onClick={() => {
              props.openMenu("searchUser");
            }}
          >
            <SearchIcon
              style={{ color: "white", display: "block", margin: "auto" }}
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ListItemIcon
            onClick={() => {
              props.openMenu("meeting");
            }}
          >
            <GroupIcon
              style={{ color: "white", display: "block", margin: "auto" }}
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ListItemIcon
            onClick={() => {
              if (props.user.MBTI === "" || props.user.MBTI === undefined) {
                props.openMenu("personalitytest");
              } else {
                props.openMenu("findfriend");
              }
            }}
          >
            <PersonAddIcon
              style={{ color: "white", display: "block", margin: "auto" }}
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          style={{
            position: "fixed",
            bottom: "0",
            paddingBottom: "20px",
            width: "5rem",
          }}
        >
          <ListItemIcon
            onClick={() => {
              props.openMenu("profile");
            }}
          >
            <Avatar
              src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${
                JSON.parse(localStorage.getItem("user")).profilepicture
              }.png`}
            />
          </ListItemIcon>
        </ListItem>
      </List>
    </React.Fragment>
  );
}

export default App;
