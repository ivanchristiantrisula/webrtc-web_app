import { Grid, Paper, Box } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import styles from "./main.module.css";
import Sidebar from "./Sidebar/sidebar";
import Friendlist from "./Friendlist/friendlist";
import _, { omit } from "underscore";
import Peer from "simple-peer";
import PrivateChat from "./PrivateChat/privatechat";
import { convertToObject } from "typescript";
const io = require("socket.io-client");
require("dotenv").config();

//import Peer from "simple-peer";

const App = () => {
  let [allUsers, setAllUsers] = useState({});
  let socket: any = useRef();
  let userSocketID = useRef("");
  let [socketConnection, setSocketConnection] = useState(false);
  let [openChatPeer, setOpenChatPeer] = useState({});
  let [openChatSocket, setOpenChatSocket] = useState("");
  let peers: any = useRef(new Array());
  let [chatConnectionStatus, setChatConnectionStatus] = useState([]);

  const initSocketListener = () => {
    socket.current = io.connect(process.env.REACT_APP_BACKEND_URI, {
      withCredentials: true,
    });

    socket?.current?.on("connect", () => {
      console.log("Connected to signalling server");
      setSocketConnection(true);
    });

    socket?.current?.on("yourID", (id: string) => {
      console.log(id);
      userSocketID.current = id;
    });
    socket?.current?.on("allUsers", (users: any) => {
      console.log("Fetched all users");
      setAllUsers(users);
    });

    socket?.current?.on("disconnect", () => {
      setSocketConnection(false);
      console.log("Disconnected! Reconnecting to signalling server");
    });

    socket?.current?.on("connectionReq", (data: any) => {
      console.log(data);
      addPeer(data.from, false, data.signal);
      setOpenChatSocket(data.from);
    });

    socket.current.on("connectionAcc", (data: any) => {
      peers.current[data.from].signal(data.signal);
    });

    //close socket connection when tab is closed by user
    // window.onbeforeunload = function () {
    //   socket.onclose = function () {}; // disable onclose handler first
    //   socket.close();
    // };
  };

  const addPeer = (
    socket_id: string,
    isInitiator: boolean,
    signalData?: any
  ) => {
    peers.current[socket_id] = new Peer({
      initiator: isInitiator,
      trickle: false,
    });

    peers.current[socket_id].on("signal", (data: any) => {
      if (isInitiator) {
        socket.current.emit("requestConnection", {
          userToCall: socket_id,
          signalData: data,
          from: userSocketID.current,
        });
      } else {
        socket.current.emit("acceptConnection", {
          signal: data,
          to: socket_id,
          from: userSocketID.current,
        });
      }
    });

    // peer.on("stream", (stream) => {
    //   partnerVideo.current.srcObject = stream;
    // });

    peers.current[socket_id].on("connect", () => {
      // wait for 'connect' event before using the data channel
      let temp = { ...chatConnectionStatus };
      temp[socket_id] = 2;
      setChatConnectionStatus(temp);
    });

    if (!isInitiator) peers.current[socket_id].signal(signalData);

    //setOpenChatSocket(socket_id);
    //open private chat section
  };

  const startPeerConnection = (socketRecipient: string) => {
    addPeer(socketRecipient, true);
    setOpenChatSocket(socketRecipient);
  };

  useEffect(() => {
    initSocketListener();
  }, []);

  return (
    <Box height="100vh">
      {/* {Object.keys(allUsers).map((keyName, i) => (
                keyName+"<br>"
            ))} */}
      <Grid container justify="center" style={{ height: "100vh" }}>
        <Grid style={{ width: "5rem" }} item className={styles.sidebar}>
          <Sidebar />
        </Grid>
        <Grid item style={{ width: "30rem" }} className={styles.friendlist}>
          <Friendlist
            users={allUsers}
            userID={userSocketID.current}
            setPrivateChatTarget={(e: any) => startPeerConnection(e)}
          />
        </Grid>
        <Grid item xs className={styles.chatContainer}>
          {openChatSocket != "" ? (
            <PrivateChat
              userSocketID={userSocketID.current}
              peer={peers.current[openChatSocket]}
              socket={socket}
            />
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;
