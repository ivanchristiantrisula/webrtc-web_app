import { useState,useEffect,useRef } from "react";
const io = require("socket.io-client")
//import Peer from "simple-peer";

function App(){
    let [allUsers,setAllUsers] = useState({});
    let socket:any = useRef();
    let [userSocketID,setUserSocketID] = useState("")

    useEffect(() => {
        socket.current = io.connect("localhost:3002");

        socket?.current?.on("yourID", (id : any) => {
            setUserSocketID(id);
        })
        socket?.current?.on("allUsers", (users : any) => {
            console.log(users)
            setAllUsers(users);
        })
    }, [])

    return(
        <div>
            {Object.keys(allUsers).map((keyName, i) => (
                keyName+"<br>"
            ))}
        </div>
    );
}

export default App;