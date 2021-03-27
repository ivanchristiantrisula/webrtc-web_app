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

function App() {
  return (
    <React.Fragment>
      <List>
        <ListItem
          button
          key="Ga tau"
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ListItemIcon>
            <GroupIcon
              style={{ color: "white", display: "block", margin: "auto" }}
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          key="Ga tau"
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ListItemIcon>
            <ChatIcon
              style={{ color: "white", display: "block", margin: "auto" }}
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          key="Ga tau"
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ListItemIcon>
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
