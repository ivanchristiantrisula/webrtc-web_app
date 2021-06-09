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
