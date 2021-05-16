import { createStyles } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Socket } from "net";
import { useEffect, useRef, useState } from "react";
import BottomBar from "./bottomBar";

const useStyles = makeStyles(() =>
  createStyles({
    videoArea: {
      position: "relative",
      top: 0,
      bottom: 0,
      width: "100%",
      height: "80%",
      overlay: "hidden",
    },
    partner: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "90%",
    },
    user: {
      position: "absolute",
      zIndex: 1,
      bottom: 0,
      right: 0,
      width: "10%",
      height: "10%",
    },
    partnerVideo: {
      minWidth: "100%",
      minHeight: "100%",
      width: "auto",
      height: "auto",
    },
    userVideo: {
      width: "auto",
      height: "auto",
    },
    bottomBar: {
      backgroundColor: "black",
      height: "auto",
      zIndex: 2,
    },
  })
);

export default (props: any) => {
  const classes = useStyles();
  const [userStream, setUserStream] = useState<any>();
  const [partnerStream, setPartnerStream] = useState<any>();
  let userVideo = useRef<any>();
  let partnerVideo = useRef<any>();

  useEffect(() => {
    props.peer.on("stream", (stream: any) => {
      //alert("stream");
      console.log(stream);
      setPartnerStream(stream);

      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: any) => {
        setUserStream(stream);
        props.peer.addStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });
  }, []);

  const endCall = () => {
    props.peer.removeStream(userStream);
  };

  return (
    <div>
      <div className={classes.videoArea}>
        <div className={classes.partner}>
          <video
            className={classes.partnerVideo}
            playsInline
            muted
            ref={partnerVideo}
            autoPlay
          />
        </div>
        <div className={classes.user}>
          <video
            className={classes.userVideo}
            playsInline
            muted
            ref={userVideo}
            autoPlay
          />
        </div>
      </div>
      <BottomBar
        className={classes.bottomBar}
        endCall={() => {
          endCall();
        }}
      />
    </div>
  );
};
