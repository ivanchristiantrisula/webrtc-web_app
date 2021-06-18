import "./style.css";
import { useEffect, useState } from "react";
import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

export default function (props: any) {
  let [mouseX, setMouseX] = useState(null as number);
  let [mouseY, setMouseY] = useState(null as number);

  const initialState = {
    mouseX: null as any,
    mouseY: null as any,
  };

  const renderBubbleData = () => {
    if (props.data.type == "text") {
      return props.data.message;
    } else {
      let typeSplit = props.data.type.split("/");
      console.log(props.data);
      if (typeSplit[0] == "image") {
        return <img src={URL.createObjectURL(props.data.file)}></img>;
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

  return (
    <>
      <ul>
        <li
          className={props.data.from == props.socketID ? "me" : "them"}
          onContextMenu={handleContextMenu}
        >
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
          }}
        >
          Reply
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.handleForward(props.data);
          }}
        >
          Foward
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.handleReport(props.data);
          }}
        >
          Report
        </MenuItem>
      </Menu>
    </>
  );
}
