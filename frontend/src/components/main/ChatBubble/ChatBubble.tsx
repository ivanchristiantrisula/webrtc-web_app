import "./style.css";
import { useEffect, useState } from "react";
import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import ReplyBubble from "./replyBubble";
import { Box, Grid, makeStyles, Theme } from "@material-ui/core";
import { classicNameResolver } from "typescript";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import GetAppIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";

const useStyles = makeStyles((theme: Theme) => ({
  reportBubble: {
    border: "solid red 2px",
  },
}));

const FileBubble = (props: { chat: any; sender: string }) => {
  return (
    <Box flexGrow={1} height="auto" width="300px">
      <Grid container spacing={2}>
        <Grid item>
          {props.sender === "me" ? (
            <PublishIcon fontSize="large" />
          ) : (
            <GetAppIcon fontSize="large" />
          )}
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1">
                {props.sender === "me" ? "File Sent" : "File Received"}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {props.chat.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {props.chat.size}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function (props: {
  data: any;
  socketID: string;
  handleReply?: Function;
  handleForward?: Function;
  handleReport?: Function;
}) {
  const classes = useStyles();
  let [mouseX, setMouseX] = useState(null as number);
  let [mouseY, setMouseY] = useState(null as number);
  let [border, setBorder] = useState("");

  useEffect(() => {
    if (props.data.isReported) {
      setBorder("sold red 1px");
    } else {
      setBorder("");
    }
  }, []);

  const initialState = {
    mouseX: null as any,
    mouseY: null as any,
  };

  const renderBubbleData = () => {
    if (props.data.type == "text") {
      return props.data.message;
    } else {
      let typeSplit = props.data.type.split("/");
      if (typeSplit[0] == "image") {
        return <img src={URL.createObjectURL(props.data.file)}></img>;
      } else {
        return (
          <FileBubble
            chat={props.data}
            sender={props.data.from == props.socketID ? "me" : "them"}
          />
        );
      }
    }
  };

  const handleClose = () => {
    setMouseX(null);
    setMouseY(null);
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLLIElement>) => {
    event.preventDefault();

    setMouseX(event.clientX - 2);
    setMouseY(event.clientY - 4);
  };

  const renderReplyBubble = () => {
    if (props.data.reply) {
      return <ReplyBubble chat={props.data.reply} />;
    }
    return;
  };

  return (
    <>
      <ul>
        <li
          className={`${props.data.from == props.socketID ? "me" : "them"}  ${
            props.data.isReported ? classes.reportBubble : ""
          }`}
          onContextMenu={handleContextMenu}
        >
          {renderReplyBubble()}
          {renderBubbleData()}
        </li>
      </ul>
      <Menu
        keepMounted
        open={mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          mouseY !== null && mouseX !== null
            ? { top: mouseY, left: mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            props.handleReply(props.data);
            handleClose();
          }}
        >
          Reply
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.handleForward(props.data);
            handleClose();
          }}
        >
          Forward
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.handleReport(props.data);
            handleClose();
          }}
        >
          Report
        </MenuItem>
      </Menu>
    </>
  );
}
