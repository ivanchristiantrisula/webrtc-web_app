import { createStyles, Theme } from "@material-ui/core";
import { useEffect } from "react";
import UserCard from "../UserCard/UserCard";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    invite: {
      borderBottom: "solid black 1px",
      height: "3rem",
      display: "flex",
      alignItems: "center",
      paddingLeft: "50px",
    },
  })
);

export default function (props: any) {
  //function openChatChannel(uid: string) {}
  const classes = useStyles();
  return (
    <div>
      {Object.keys(props.users).map((keyName, i) => {
        if (keyName != props.userID)
          return (
            <div onClick={() => props.setPrivateChatTarget(keyName)}>
              <UserCard user={props.users[keyName]} />
            </div>
          );
      })}
    </div>
  );
}
