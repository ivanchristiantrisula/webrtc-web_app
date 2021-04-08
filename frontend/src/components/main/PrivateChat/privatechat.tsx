import { SignalCellular1BarTwoTone } from "@material-ui/icons";
import { useEffect } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

export default function App(props: any) {
  useEffect(() => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
        ],
      },
      // stream: stream,
    });

    peer.on("signal", (data: any) => {
      props.socket.current.emit("requestConnection", {
        userToCall: props.socketRecipient,
        signalData: data,
        from: props.userSocketID,
      });
    });

    props.socket.current.on("connectionAcc", (signal: any) => {
      // setCallAccepted(true);
      console.log(signal);
      peer.signal(signal);
    });
  });
  return <div>Ini chat gan</div>;
}
