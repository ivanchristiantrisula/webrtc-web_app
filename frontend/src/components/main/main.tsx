import { Grid, Paper, Box } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import styles from "./main.module.css";
import Sidebar from "./Sidebar/sidebar";
import Friendlist from "./Friendlist/friendlist";
import _, { omit } from "underscore";
import peer from "simple-peer";
import PrivateChat from "./PrivateChat/privatechat";
const io = require("socket.io-client");

//import Peer from "simple-peer";

function App() {
  let [allUsers, setAllUsers] = useState({});
  let socket: any = useRef();
  let [userSocketID, setUserSocketID] = useState("");
  let [socketConnection, setSocketConnection] = useState(false);
  let [privateChatTarget, setPrivateChatTarget] = useState();

  useEffect(() => {
    socket.current = io.connect("localhost:3001", {
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

    //acc call
    socket?.current?.on("connectionReq", (data: any) => {
      alert("ditelpon bang");
      console.log(data);
    });
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
            setPrivateChatTarget={(e: any) => setPrivateChatTarget(e)}
          />
        </Grid>
        <Grid item xs className={styles.chatContainer}>
          {privateChatTarget != null ? (
            <PrivateChat
              userSocketID={userSocketID}
              socketRecipient={privateChatTarget}
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
