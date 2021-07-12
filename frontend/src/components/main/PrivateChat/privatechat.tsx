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
import _ from "underscore";
import ReplyCard from "./replyCard";
import { Box, createStyles, Grid, makeStyles } from "@material-ui/core";

const useStyle = makeStyles(() =>
  createStyles({
    root: {
      minHeight: "100%",
      height: "100%",
      width: "100%",
    },
    topBar: {
      height: "2.5rem",
      borderBottom: "solid black 1px",
      width: "100%",
      minWidth: "100%",
    },
    chatArea: {
      width: "100%",
      minWidth: "100%",
      overflowY: "scroll",
    },
    chatContainer1: {
      width: "100%",
    },

    replyCard: {
      height: "50px",
      width: "100%",
    },
    bottomBar: {
      height: "100px",
      bottom: "0px",
      width: "100%",
    },
  })
);

export default (props: any) => {
  let classes = useStyle();

  let [chat, setChat] = useState<any[]>([]);
  let [videoCall, setVideoCall] = useState(false);
  let [openUserPickerModal, setOpenUserPickerModal] = useState(false);
  let [replyChat, setReplyChat] = useState({});
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
    console.log(props);
    let payload = {
      senderInfo: props.myInfo,
      from: props.userSocketID,
      kind: "direct", //direct,forward,quote TODO : GANTI KIND JADI SOURCE
      type: "text",
      message: text,
      timestamp: new Date().getTime(),
    };
    if (_.isEmpty(replyChat)) {
      payload["reply"] = null;
    } else {
      payload["reply"] = replyChat;
      setReplyChat({});
    }
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
      senderInfo: props.myInfo,
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
    setReplyChat(chat);
  };

  const handleReport = (chat: any, targetSID: any) => {
    alert("report msg");
  };

  const sendForward = (user: any, sid: string) => {
    let payload = forwardChat.current;
    payload["origin"] = payload["from"];
    payload["from"] = props.userSocketID;
    payload["senderInfo"] = props.myInfo;

    props.sendForward(payload, sid);

    setOpenUserPickerModal(false);
    //setChat([...chat, payload]);
    //props.addChatFromSender(payload);
    //props.peer.send(Buffer.from(JSON.stringify(payload)));
  };
  const renderReplyCard = () => {
    if (!_.isEmpty(replyChat)) {
      return (
        <Box order={3} className={classes.replyCard}>
          <ReplyCard chat={replyChat} />
        </Box>
      );
    }
    return;
  };
  return (
    <div className={classes.root}>
      <Box display="flex" className={classes.root} flexDirection="column">
        <Box order={1} className={classes.topBar}>
          <TopBar
            startVideoCall={() => {
              startVideoCall(true);
            }}
          />
        </Box>
        <Box order={2} className={classes.chatArea} flexGrow={1}>
          <div className={classes.chatContainer1}>
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
          </div>
        </Box>
        {renderReplyCard()}
        <Box order={4} className={classes.bottomBar}>
          <BottomBar
            handleSendText={(e: string) => {
              sendChatText(e);
            }}
            handleFileUpload={(file: File) => {
              handleFileUpload(file);
            }}
          />
        </Box>
      </Box>
      {videoCall ? (
        <div>
          <VideoCall
            peer={props.peer}
            userSocketID={props.userSocketID}
            socket={props.socket}
          />
        </div>
      ) : null}
      <UserPicker
        isOpen={openUserPickerModal}
        users={props.users}
        onPickedUser={sendForward}
        multipleUser={false}
        title="Foward"
      />
    </div>
  );
};
