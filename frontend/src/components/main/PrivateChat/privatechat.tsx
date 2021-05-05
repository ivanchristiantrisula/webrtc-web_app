import { SignalCellular1BarTwoTone } from "@material-ui/icons";
import { useEffect, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import BottomBar from "./bottomBar";
import ChatBubble from "../ChatBubble/ChatBubble";
import TopBar from "./topbar";
import VideoCall from "../VideoCall/videocall";
import { Socket } from "dgram";
import SimplePeerFiles from "simple-peer-files";

export default (props: any) => {
  let [chat, setChat] = useState<any[]>([]);
  let [videoCall, setVideoCall] = useState(false);

  useEffect(() => {
    //console.log(props.peer);
    //console.log(props);
    props.socket.on("startVideoCall", () => {
      startVideoCall(false);
    });
  });

  const sendChatText = (text: string) => {
    let payload = {
      from: props.userSocketID,
      kind: "direct", //direct,foward,quote
      type: "text",
      message: text,
      timestamp: new Date().getTime(),
    };
    //setChat([...chat, payload]);
    props.addChatFromSender(payload);
    props.peer.send(Buffer.from(JSON.stringify(payload)));
  };

  const startVideoCall = (isInitiator: boolean) => {
    setVideoCall(true);

    if (isInitiator)
      props.socket.emit("startVideoCall", { to: props.recipientSocketID });
  };

  const handleFileUpload = (file: File) => {
    const spf = new SimplePeerFiles();

    spf.send(props.peer, "1", file).then((transfer: any) => {
      transfer.on("progress", (sentBytes: any) => {
        console.log(sentBytes);
      });
      transfer.start();
    });
  };

  return (
    <div>
      {videoCall ? (
        <div>
          <VideoCall peer={props.peer} userSocketID={props.userSocketID} />
        </div>
      ) : (
        <div>
          <TopBar
            startVideoCall={() => {
              startVideoCall(true);
            }}
          />
          {props.chat !== undefined ? (
            <div>
              {props.chat.map(function (obj: any) {
                return <ChatBubble data={obj} socketID={props.userSocketID} />;
              })}
            </div>
          ) : (
            ""
          )}

          <BottomBar
            handleSendText={(e: string) => {
              sendChatText(e);
            }}
            handleFileUpload={(file: File) => {
              handleFileUpload(file);
            }}
          />
        </div>
      )}
    </div>
  );
};
