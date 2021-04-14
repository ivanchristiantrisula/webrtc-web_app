import { SignalCellular1BarTwoTone } from "@material-ui/icons";
import { useEffect, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import BottomBar from "./bottomBar";

export default function App(props: any) {
  useEffect(() => {
    console.log(props.peer);
  });

  function sendChatText(text: string) {
    props.peer.send(text);
  }

  return (
    <div>
      <BottomBar
        handleSendText={(e: string) => {
          sendChatText(e);
        }}
      />
    </div>
  );
}
