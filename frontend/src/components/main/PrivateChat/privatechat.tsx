import { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import BottomBar from "./bottomBar";
import ChatBubble from "../ChatBubble/ChatBubble";
import TopBar from "./topbar";
import VideoCall from "../VideoCall/videocall";
import { Socket } from "dgram";
import SimplePeerFiles from "simple-peer-files";
import UserPicker from "../UserPicker/UserPicker";

export default (props: any) => {
  let [chat, setChat] = useState<any[]>([]);
  let [videoCall, setVideoCall] = useState(false);
  let [openUserPickerModal, setOpenUserPickerModal] = useState(false);
  //let [forwardChat, setForwardChat] = useState({});

  let forwardChat = useRef({});

  useEffect(() => {
    //console.log(props.peer);
    //console.log(props);
    props.socket.on("startVideoCall", () => {
      startVideoCall(false);
    });

    props.socket.on("endVideoCall", () => {});
  }, []);

  const sendChatText = (text: string) => {
    let payload = {
      from: props.userSocketID,
      kind: "direct", //direct,forward,quote TODO : GANTI KIND JADI SOURCE
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
    //alert("sadf");
    const spf = new SimplePeerFiles();

    props.addChatFromSender({
      from: props.userSocketID,
      kind: "direct",
      type: file.type,
      timestamp: new Date().getTime(),
      file: file,
    });

    spf.send(props.peer, "1", file).then((transfer: any) => {
      transfer.on("progress", (sentBytes: any) => {
        console.log(sentBytes);
      });
      transfer.start();
    });
  };

  const handleForward = (chat: any, targetSID: any) => {
    //alert("forward msg");
    setOpenUserPickerModal(true);
    forwardChat.current = chat;
  };

  const handleReply = (chat: any, targetSID: any) => {
    alert("reply msg");
  };

  const handleReport = (chat: any, targetSID: any) => {
    alert("report msg");
  };

  const sendForward = (user: any, sid: string) => {
    let payload = forwardChat.current;
    payload["origin"] = payload["from"];
    payload["from"] = props.userSocketID;

    props.sendForward(payload, sid);

    setOpenUserPickerModal(false);
    //setChat([...chat, payload]);
    //props.addChatFromSender(payload);
    //props.peer.send(Buffer.from(JSON.stringify(payload)));
  };

  return (
    <>
      {videoCall ? (
        <div>
          <VideoCall
            peer={props.peer}
            userSocketID={props.userSocketID}
            socket={props.socket}
          />
        </div>
      ) : (
        <div>
          <TopBar
            startVideoCall={() => {
              startVideoCall(true);
            }}
          />
          {props.chat !== undefined ? (
            <>
              {props.chat.map(function (obj: any) {
                return (
                  <ChatBubble
                    data={obj}
                    socketID={props.userSocketID}
                    handleReply={handleReply}
                    handleForward={handleForward}
                    handleReport={handleReport}
                  />
                );
              })}
            </>
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
      <UserPicker
        isOpen={openUserPickerModal}
        users={props.users}
        onPickedUser={sendForward}
      />
    </>
  );
};
