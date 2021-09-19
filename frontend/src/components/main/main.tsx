import { Grid, Paper, Box, createStyles, Theme } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Friendlist from "./Friendlist/friendlist";
import _, { omit } from "underscore";
import Peer from "simple-peer";
import PrivateChat from "./PrivateChat/privatechat";
import { makeStyles } from "@material-ui/styles";
import SearchUser from "./SearchUser/searchuser";
import axios from "axios";
import ChatList from "./Chatlist/ChatList";
import { useSnackbar } from "notistack";
import Meeting from "./Meeting/";
import AlertDialog from "./AlertDialog";
import FriendFinder from "./FindFriend";
import FindFriend from "./FindFriend";
import Profile from "./Profile/";
import streamSaver from "streamsaver";

const io = require("socket.io-client");
require("dotenv").config();

const worker = new Worker("../worker.js");

//import Peer from "simple-peer";

const useStyles = makeStyles((theme: Theme) => ({
  hidden: {
    display: "none",
  },

  sidebar: {
    backgroundColor: theme.palette.primary.main,
  },

  friendlist: {
    backgroundColor: theme.palette.background.default,
    width: "30rem",
  },

  chatContainer: {
    backgroundColor: theme.palette.background.default,
    borderLeft: "solid #d7d9d7 1px",
  },

  meeting: { backgroundColor: theme.palette.background.default },

  findfriend: { backgroundColor: theme.palette.background.default },

  profile: { backgroundColor: theme.palette.background.default },
}));

const initState = {
  meetingProps: {
    open: false,
    title: "",
    body: "",
    positiveTitle: "",
    negativeTitle: "",
    fromSocket: "",
  },
};

const App = () => {
  let [allUsers, setAllUsers] = useState({});
  let socket: any = useRef();
  const [userSocketID, setUserSocketID] = useState("");
  let [socketConnection, setSocketConnection] = useState(false);
  let [openChatSocket, setOpenChatSocket] = useState("");
  let peers: any = useRef({});
  let [chats, setChats] = useState({});
  let [chatConnectionStatus, setChatConnectionStatus] = useState([]);
  let [openMenu, setOpenMenu] = useState("friendlist");
  let [onlineFriends, setOnlineFriends] = useState({});
  let [meetingID, setMeetingID] = useState("");
  let [meetingMode, setMeetingMode] = useState(false);
  let fileTransfers = useRef({});

  let [alertDialogProps, setAlertDialogProps] = useState(
    initState.meetingProps
  );

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    initSocketListener();
    fetchUserFriends();
  }, []);

  useEffect(() => {
    fetchUserFriends();
  }, [allUsers]);

  const initSocketListener = () => {
    socket.current = io.connect(process.env.REACT_APP_BACKEND_URI, {
      withCredentials: true,
    });

    socket?.current?.on("connect", () => {
      console.info("Connected to signalling server");
      setSocketConnection(true);
    });

    socket?.current?.on("yourID", (id: string) => {
      console.info("User Socket ID : " + id);
      setUserSocketID(id);
    });
    socket?.current?.on("allUsers", (users: any) => {
      console.info("Fetched all users");
      let a = users;
      setAllUsers(a);
    });

    socket?.current?.on("disconnect", () => {
      setSocketConnection(false);
      console.info("Disconnected! Reconnecting to signalling server");
    });

    socket.current.on("sdpTransfer", handleReceivingSDP);

    socket.current.on("meetingInvitation", handleReceivingMeetingInvitation);

    //close socket connection when tab is closed by user
    window.onbeforeunload = function () {
      socket.onclose = function () {}; // disable onclose handler first
      socket.close();
    };
  };

  const handleReceivingSDP = (data: any) => {
    if (peers.current[data.from] !== undefined) {
      peers.current[data.from].signal(data.signal);
    } else {
      //set as receiver
      addPeer(data.from, false);
      peers.current[data.from].signal(data.signal);
      setOpenChatSocket(data.from);
    }
  };

  const handleReceivingMeetingInvitation = (data: any) => {
    setMeetingID(data.meetingID);
    setAlertDialogProps({
      open: true,
      title: "You are invited to join a meeting",
      body: "User XXX invited you to join their meeting.",
      positiveTitle: "Join meeting",
      negativeTitle: "Decline Meeting",
      fromSocket: data.from,
    });
  };

  const addPeer = (
    socket_id: string,
    isInitiator: boolean,
    signalData?: any
  ) => {
    peers.current[socket_id] = new Peer({
      initiator: isInitiator,
      trickle: true,
      config: {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
          // public turn server from https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b
          // set your own servers here
        ],
      },
    });

    peers.current[socket_id].on("signal", (data: any) => {
      //console.log(data);
      socket.current.emit("transferSDP", {
        signal: data,
        to: socket_id,
        from: userSocketID,
      });
    });

    peers.current[socket_id].on("data", (data: any) => {
      let dataType = "";
      if (Buffer.isBuffer(data)) dataType = "buffer";
      if (typeof data === "string") dataType = "string";

      const isJsonParsable = (x: Buffer) => {
        try {
          JSON.parse(x.toString());
        } catch (e) {
          return false;
        }
        return true;
      };

      if (isJsonParsable(data)) {
        data = JSON.parse(data.toString());
        if (data.type === "file") {
          if (data.done) {
            let x = chats;
            if (x[socket_id] === undefined) {
              x[socket_id] = new Array(data);
            } else {
              x[socket_id].push(data);
            }
            setChats({ ...x });
            download(socket_id, data.name);
          }
        } else if (data.type === "text") {
          let parsedData = data;
          if (parsedData.kind) {
            let x = chats;
            if (x[socket_id] === undefined) {
              x[socket_id] = new Array(parsedData);
            } else {
              x[socket_id].push(parsedData);
            }
            setChats({ ...x });
          }
          enqueueSnackbar(
            `${parsedData.senderInfo.name} \n ${parsedData.message}`,
            {
              variant: "success",
            }
          );
        }
      } else {
        //IF DATA ISNT PARSEABLE, THEN IT HAS TO BE ARRAY BUFFER
        if (fileTransfers.current[socket_id] === undefined)
          //CHECK IF SERVICE WORKER IS AVAILABLE FOR THIS PEER
          fileTransfers.current[socket_id] = new Worker("../worker.js"); //CREATE NEW SERVICE WORKER TO RECEIVE ARRAY BUFFER

        fileTransfers.current[socket_id].postMessage(
          new Uint8Array(data).buffer //convert buffer to arraybuffer then passes it to worker
        );
      }
    });

    peers.current[socket_id].on("connect", () => {
      // wait for 'connect' event before using the data channel
      let temp = { ...chatConnectionStatus };
      temp[socket_id] = 2;
      setChatConnectionStatus(temp);
    });
  };

  const download = (socket_id: string, name: string) => {
    //setGotFile(false);
    fileTransfers.current[socket_id].postMessage("download");
    fileTransfers.current[socket_id].addEventListener(
      "message",
      (event: any) => {
        const stream = event.data.stream();
        const fileStream = streamSaver.createWriteStream(name);
        stream.pipeTo(fileStream);
      }
    );
    delete fileTransfers.current[socket_id];
  };

  const startPeerConnection = (socketRecipient: string) => {
    if (peers.current[socketRecipient] === undefined) {
      addPeer(socketRecipient, true);
    }
    setOpenChatSocket(socketRecipient);
  };

  const addChatFromSender = (data: any, sid?: any) => {
    //console.log(data);
    if (!sid) sid = openChatSocket;

    let x = chats;
    if (x[sid] === undefined) {
      x[sid] = new Array(data);
    } else {
      x[sid].push(data);
    }
    setChats({ ...x });
  };

  const fetchUserFriends = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/api/user/getFriends`, {
        withCredentials: true,
      })
      .then((res) => {
        let allFriends = res.data.friends;
        console.log(allFriends);
        //intersects all user array with all friends array to find online ones
        let intersects = {};
        for (const key in allUsers) {
          if (Object.prototype.hasOwnProperty.call(allUsers, key)) {
            if (key != userSocketID) {
              const element = allUsers[key];
              let friendIdx = allFriends.findIndex(
                (friend: any) => friend._id == element._id
              );
              if (friendIdx != -1) {
                intersects[key] = allUsers[key];
              }
            }
          }
        }
        setOnlineFriends(intersects);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const forwardChat = (payload: any, sid: string) => {
    //check if user is already connected with target peer
    if (peers.current[sid] !== undefined) {
      peers.current[sid].send(Buffer.from(JSON.stringify(payload)));
    } else {
      //wait until target peer is successfuly connected, then forward the chat
      startPeerConnection(sid);
      peers.current[sid].on("connect", () => {
        peers.current[sid].send(Buffer.from(JSON.stringify(payload)));
      });
    }
    addChatFromSender(payload, sid);
  };

  const handleMeetingInviteAccepted = (targetSID: string) => {
    socket.current.emit("respondMeetingInvitation", {
      response: true,
      to: targetSID,
      meetingID: meetingID,
    });
    setOpenMenu("meeting");
    setMeetingMode(true);
  };

  const handleMeetingInviteDeclined = (targetSID: string) => {
    socket.current.emit("respondMeetingInvitation", {
      response: false,
      to: targetSID,
      meetingID: meetingID,
    });
    setMeetingID("");
  };

  const endMeeting = () => {
    setMeetingMode(false);
    setMeetingID("");
  };

  return (
    <>
      <Box height="100vh">
        <Grid container justify="center" style={{ height: "100vh" }}>
          <Grid style={{ width: "5rem" }} item className={classes.sidebar}>
            <Sidebar
              openMenu={(menu: string) => {
                setOpenMenu(menu);
              }}
              user={allUsers[userSocketID]}
            />
          </Grid>
          <Grid
            item
            className={`${classes.friendlist} ${
              openMenu != "friendlist" ? classes.hidden : ""
            }`}
          >
            <Friendlist
              users={onlineFriends}
              userID={userSocketID}
              setPrivateChatTarget={(e: any) => startPeerConnection(e)}
            />
          </Grid>
          <Grid
            item
            className={`${classes.friendlist} ${
              openMenu != "chatlist" ? classes.hidden : ""
            }`}
          >
            <ChatList
              users={onlineFriends}
              userID={userSocketID}
              setPrivateChatTarget={(e: any) => startPeerConnection(e)}
              chats={chats}
            />
          </Grid>
          {openMenu == "searchUser" ? (
            <Grid item style={{ width: "30rem" }}>
              <SearchUser />
            </Grid>
          ) : (
            ""
          )}
          {openMenu == "meeting" || meetingMode ? (
            <Grid
              item
              xs
              className={`${classes.meeting} ${
                openMenu != "meeting" ? classes.hidden : ""
              }`}
            >
              <Meeting
                friends={onlineFriends}
                socket={socket.current}
                userSocketID={userSocketID}
                meetingID={meetingID}
                meetingMode={meetingMode}
                handleNewMeeting={(id: string) => {
                  setMeetingID(id);
                  setMeetingMode(true);
                }}
                endMeeting={endMeeting}
              />
            </Grid>
          ) : (
            ""
          )}
          {openMenu == "findfriend" ? (
            <Grid item xs className={classes.findfriend}>
              <FindFriend />
            </Grid>
          ) : null}

          {openMenu == "profile" ? (
            <Grid item xs className={classes.profile}>
              <Profile user={allUsers[userSocketID]} />
            </Grid>
          ) : null}

          <Grid
            item
            xs
            className={`${classes.chatContainer} ${
              openMenu == "meeting" ||
              openMenu == "personalitytest" ||
              openMenu == "profile"
                ? classes.hidden
                : ""
            }`}
          >
            {openChatSocket != "" ? (
              <PrivateChat
                userSocketID={userSocketID}
                recipientSocketID={openChatSocket}
                peer={peers.current[openChatSocket]}
                socket={socket.current}
                chat={chats[openChatSocket]}
                addChatFromSender={(data: any) => {
                  addChatFromSender(data);
                }}
                users={onlineFriends}
                sendForward={forwardChat}
                myInfo={allUsers[userSocketID]}
              />
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Box>
      <AlertDialog
        open={alertDialogProps.open}
        title={alertDialogProps.title}
        body={alertDialogProps.body}
        posActionButtonName={alertDialogProps.positiveTitle}
        negActionButtonName={alertDialogProps.negativeTitle}
        onPosClicked={() => {
          setAlertDialogProps(initState.meetingProps);
          handleMeetingInviteAccepted(alertDialogProps.fromSocket);
        }}
        onNegClicked={() => {
          setAlertDialogProps(initState.meetingProps);
          handleMeetingInviteDeclined(alertDialogProps.fromSocket);
        }}
        handleClose={() => setAlertDialogProps(initState.meetingProps)}
      />
    </>
  );
};

export default App;
