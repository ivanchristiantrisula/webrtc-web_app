import { Grid, Paper, Box, createStyles, Theme } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar/sidebar";
import Friendlist from "./Friendlist/friendlist";
import _, { omit } from "underscore";
import Peer from "simple-peer";
import PrivateChat from "./PrivateChat/privatechat";
import SimplePeerFiles from "simple-peer-files";
import { makeStyles } from "@material-ui/styles";
import SearchUser from "./SearchUser/searchuser";
import axios from "axios";
import ChatList from "./Chatlist/ChatList";
import { useSnackbar } from "notistack";
import Meeting from "./Meeting/";
import AlertDialog from "./AlertDialog";
import { string } from "yargs";

const io = require("socket.io-client");
require("dotenv").config();

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
    borderLeft: "solid black 1px",
  },

  meeting: { backgroundColor: theme.palette.background.default },
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
  let [openSearchUserModal, setOpenSearchUserModal] = useState(false);
  let [onlineFriends, setOnlineFriends] = useState({});
  let [meetingID, setMeetingID] = useState("");
  let [meetingMode, setMeetingMode] = useState(false);

  let [alertDialogProps, setAlertDialogProps] = useState(
    initState.meetingProps
  );

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const spf = new SimplePeerFiles();

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
      console.log("Connected to signalling server");
      setSocketConnection(true);
    });

    socket?.current?.on("yourID", (id: string) => {
      console.log("User Socket ID : " + id);
      setUserSocketID(id);
    });
    socket?.current?.on("allUsers", (users: any) => {
      console.log("Fetched all users");
      let a = users;
      setAllUsers(a);
    });

    socket?.current?.on("disconnect", () => {
      setSocketConnection(false);
      console.log("Disconnected! Reconnecting to signalling server");
    });

    socket.current.on("sdpTransfer", (data: any) => {
      console.log(data);
      // peers.current[data.from].signal(data.signal);
      if (peers.current[data.from] !== undefined) {
        console.log(peers.current[data.from]);
        peers.current[data.from].signal(data.signal);
      } else {
        //set as receiver
        addPeer(data.from, false);
        peers.current[data.from].signal(data.signal);
        setOpenChatSocket(data.from);
      }
    });

    socket.current.on("meetingInvitation", (data: any) => {
      setMeetingID(data.meetingID);
      setAlertDialogProps({
        open: true,
        title: "You are invited to join a meeting",
        body: "User XXX invited you to join their meeting.",
        positiveTitle: "Join meeting",
        negativeTitle: "Decline Meeting",
        fromSocket: data.from,
      });
    });

    //close socket connection when tab is closed by user
    window.onbeforeunload = function () {
      socket.onclose = function () {}; // disable onclose handler first
      socket.close();
    };
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

    spf.receive(peers.current[socket_id], "1").then((transfer: any) => {
      //alert("masok gan");
      transfer.on("progress", (sentBytes: any) => {
        console.log(sentBytes);
      });

      transfer.on("done", (file: any) => {
        console.log(file);
        //alert("done trf");
        let payload = {
          senderInfo: allUsers[socket_id],
          from: socket_id,
          kind: "direct",
          type: file.type,
          timestamp: new Date().getTime(),
          file: file,
        };
        let x = chats;
        if (x[socket_id] === undefined) {
          x[socket_id] = new Array(payload);
        } else {
          x[socket_id].push(payload);
        }
        setChats({ ...x });
      });

      // Call readyToSend() in the sender side
      //peer.send("heySenderYouCanSendNow");
    });

    peers.current[socket_id].on("data", (data: any) => {
      let parsedData = JSON.parse(data.toString());
      if (parsedData.kind) {
        let x = chats;
        if (x[socket_id] === undefined) {
          x[socket_id] = new Array(JSON.parse(data.toString()));
        } else {
          x[socket_id].push(JSON.parse(data.toString()));
        }
        setChats({ ...x });
      }
      console.log(parsedData);
      enqueueSnackbar(
        `${parsedData.senderInfo.name} \n ${parsedData.message}`,
        {
          variant: "success",
        }
      );
    });

    peers.current[socket_id].on("connect", () => {
      // wait for 'connect' event before using the data channel
      let temp = { ...chatConnectionStatus };
      temp[socket_id] = 2;
      setChatConnectionStatus(temp);
    });
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
                intersects[key] = allFriends[friendIdx];
              }
            }
          }
        }
        setOnlineFriends(intersects);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const forwardChat = (payload: any, sid: string) => {
    console.log({ payload: payload, sid: sid });
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
          <Grid
            item
            xs
            className={`${classes.chatContainer} ${
              openMenu == "meeting" ? classes.hidden : ""
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
