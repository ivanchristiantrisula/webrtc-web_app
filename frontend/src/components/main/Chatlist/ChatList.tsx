import { createStyles, Theme } from "@material-ui/core";
import { useEffect } from "react";
import ChatCard from "./ChatCard";
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
  useEffect(() => {
    console.log(props.chats);
  }, [props.chats]);
  //function openChatChannel(uid: string) {}
  const classes = useStyles();

  return (
    <div>
      {Object.keys(props.chats).map((keyName, i) => {
        if (props.users[keyName] !== undefined)
          return (
            <div onClick={() => props.setPrivateChatTarget(keyName)}>
              <ChatCard
                user={props.users[keyName]}
                lastMsg={props.chats[keyName].slice(-1)[0]}
              />
            </div>
          );
      })}
    </div>
  );
}
