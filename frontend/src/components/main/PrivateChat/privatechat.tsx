import { SignalCellular1BarTwoTone } from "@material-ui/icons";
import { useEffect, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import BottomBar from "./bottomBar";

export default function App(props: any) {
  useEffect(() => {
    //console.log(props.peer);
    console.log(props.chat);
  }, [props.chat]);

  function sendChatText(text: string) {
    let payload = {
      origin: "direct", //direct,foward,quote
      type: "text",
      message: text,
    };

    props.peer.send(Buffer.from(JSON.stringify(payload)));
  }

  return (
    <div>
      {() => {
        if (props.chat != "undefined") {
          return props.chat.map((obj: any) => {
            return obj.message;
          });
        }
      }}

      <BottomBar
        handleSendText={(e: string) => {
          sendChatText(e);
        }}
      />
    </div>
  );
}
