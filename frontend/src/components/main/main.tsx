import { Grid, Paper, Box } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import styles from "./main.module.css";
import Sidebar from "./Sidebar/sidebar";
import Friendlist from "./Friendlist/friendlist";
import _, { omit } from "underscore";
import Peer from "simple-peer";
import PrivateChat from "./PrivateChat/privatechat";
const io = require("socket.io-client");
require("dotenv").config();

//import Peer from "simple-peer";

function App() {
  let [allUsers, setAllUsers] = useState({});
  let socket: any = useRef();
  let [userSocketID, setUserSocketID] = useState("");
  let [socketConnection, setSocketConnection] = useState(false);
  let [openChatPeer, setOpenChatPeer] = useState({});
  let [peers, setPeers] = useState({});
  let [chatConnectionStatus, setChatConnectionStatus] = useState([]);

  function initConnection() {
    socket.current = io.connect(process.env.REACT_APP_BACKEND_URI, {
      withCredentials: true,
    });

    socket?.current?.on("connect", () => {
      console.log("Connected to signalling server");
      setSocketConnection(true);
    });

    socket?.current?.on("yourID", (id: any) => {
      console.log("User ID set");
      setUserSocketID(id);
    });
    socket?.current?.on("allUsers", (users: any) => {
      console.log("Fetched all users");
      setAllUsers(users);
    });

    socket?.current?.on("disconnect", () => {
      setSocketConnection(false);
      console.log("Disconnected! Reconnecting to signalling server");
    });
  }

  function initPeerConnection() {
    //acc call
    socket?.current?.on("connectionReq", (data: any) => {
      console.log(data);
      acceptCoonection(data);
    });
  }

  function startPeerConnection(socketRecipient: string) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      },
    });

    peer.on("signal", (data: any) => {
      socket.current.emit("requestConnection", {
        userToCall: socketRecipient,
        signalData: data,
        from: userSocketID,
      });
      let temp = { ...chatConnectionStatus };
      temp[socketRecipient] = 1;
      setChatConnectionStatus(temp);
    });

    peer.on("connect", () => {
      let temp = { ...chatConnectionStatus };
      temp[socketRecipient] = 2;
      setChatConnectionStatus(temp);
    });

    peer.on("data", (data) => {
      // got a data channel message
      alert(data);
    });

    socket.current.on("connectionAcc", (signal: any) => {
      // setCallAccepted(true);
      console.log(signal);
      peer.signal(signal);

      peer.on("data", (data) => {
        // got a data channel message
        console.log("got a message from peer1: " + data);
      });
    });

    let x = { ...peers };
    x[socketRecipient] = peer;
    setPeers(x);
    setOpenChatPeer(peer);
  }

  function acceptCoonection(data: any) {
    let origin: string = data.from;

    //setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
    });
    peer.on("signal", (data) => {
      socket.current.emit("acceptConnection", { signal: data, to: origin });

      let temp = { ...chatConnectionStatus };
      temp[origin] = 1;
      setChatConnectionStatus(temp);
    });
    peer.on("data", (data) => {
      // got a data channel message
      alert(data);
    });

    // peer.on("stream", (stream) => {
    //   partnerVideo.current.srcObject = stream;
    // });

    peer.signal(data.signal);
    peer.on("connect", () => {
      // wait for 'connect' event before using the data channel
      let temp = { ...chatConnectionStatus };
      temp[origin] = 2;
      setChatConnectionStatus(temp);
    });
    let x = { ...peers };
    x[origin] = peer;
    setPeers(x);
  }

  useEffect(() => {
    initConnection();
    initPeerConnection();
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
            userID={userSocketID}
            setPrivateChatTarget={(e: any) => startPeerConnection(e)}
          />
        </Grid>
        <Grid item xs className={styles.chatContainer}>
          {!_.isEmpty(openChatPeer) ? (
            <PrivateChat
              userSocketID={userSocketID}
              peer={openChatPeer}
              socket={socket}
            />
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
