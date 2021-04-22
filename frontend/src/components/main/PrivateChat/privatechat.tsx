import { SignalCellular1BarTwoTone } from "@material-ui/icons";
import { useEffect, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import BottomBar from "./bottomBar";
import MeBubble from "../ChatBubble/MeBubble";
import ThemBubble from "../ChatBubble/ThemBubble";

export default (props: any) => {
  let [chat, setChat] = useState<any[]>([]);

  useEffect(() => {
    props.peer.on("data", (data: any) => {
      let x: any = [...chat];
      x.push(JSON.parse(data.toString()));
      setChat([...x]);
    });
  }, []);

  useEffect(() => {
    console.log(chat);
  }, [chat]);

  const sendChatText = (text: string) => {
    let payload = {
      from: props.userSocketID,
      method: "direct", //direct,foward,quote
      type: "text",
      message: text,
      timestamp: new Date().getTime(),
    };
    let x: any = [...chat];
    x.push(payload);
    console.log(x);
    setChat([...x]);

    props.peer.send(Buffer.from(JSON.stringify(payload)));
  };

  return (
    <div>
      {chat.map(function (obj: any) {
        if (obj.from == props.userSocketID) {
          return <MeBubble message={obj.message} />;
        } else {
          return <ThemBubble message={obj.message} />;
        }
      })}

      <BottomBar
        handleSendText={(e: string) => {
          sendChatText(e);
        }}
      />
    </div>
  );
};
