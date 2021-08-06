import {
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
              props.openMenu("findfriend");
            }}
          >
            <PersonAddIcon
              style={{ color: "white", display: "block", margin: "auto" }}
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
      </List>
    </React.Fragment>
  );
}

export default App;
