import { Grid, Paper, Box } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import styles from "./main.module.css";
import Sidebar from "./sidebar";
const io = require("socket.io-client");
//import Peer from "simple-peer";

function App() {
  let [allUsers, setAllUsers] = useState({});
  let socket: any = useRef();
  let [userSocketID, setUserSocketID] = useState("");

  useEffect(() => {
    socket.current = io.connect("localhost:3001", {
      withCredentials: true,
    });

    socket?.current?.on("yourID", (id: any) => {
      setUserSocketID(id);
    });
    socket?.current?.on("allUsers", (users: any) => {
      console.log(users);
      setAllUsers(users);
    });
  }, []);

  return (
    <Box height="100vh">
      {/* {Object.keys(allUsers).map((keyName, i) => (
                keyName+"<br>"
            ))} */}
      <Grid container justify="center">
        <Grid item xs={1} className={styles.sidebar}>
          <Sidebar />
        </Grid>
        <Grid item xs={3} className={styles.friendlist}>
          <Box height="100vh"></Box>
        </Grid>
        <Grid item xs={8} className={styles.chatContainer}>
          <Box height="100vh"></Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
