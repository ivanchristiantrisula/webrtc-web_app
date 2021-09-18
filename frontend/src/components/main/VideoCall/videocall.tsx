import { Box, createStyles, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Socket } from "net";
import { useEffect, useRef, useState } from "react";
import BottomBar from "./bottombar";

const useStyles = makeStyles(() =>
  createStyles({
    videoArea: {},
    user: {
      position: "absolute",
      zIndex: 999,
      top: 0,
      right: 0,
      width: "300px",
      height: "200px",
    },
    partnerVideo: {
      width: "100%",
      height: "90%",
      maxWidth: "100%",
      maxHeight: "100%",
    },
    userVideo: {
      width: "300px",
      height: "150px",
    },
    bottomBar: {
      backgroundColor: "black",
      height: "10%",
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
    alert("msok");
    props.peer.removeStream(userStream);
  };

  const muteAudio = () => {
    partnerVideo.current.srcObject.getAudioTracks()[0].enabled =
      !partnerVideo.current.srcObject.getAudioTracks()[0].enabled;
  };

  const muteVideo = () => {
    userVideo.current.srcObject.getVideoTracks()[0].enabled =
      !userVideo.current.srcObject.getVideoTracks()[0].enabled;
  };

  return (
    <>
      {/* <Box className={classes.videoArea}>
        <Box className={classes.partner}>
          <video
            className={classes.partnerVideo}
            playsInline
            muted
            ref={partnerVideo}
            autoPlay
          />
        </Box>
        <Box className={classes.user}>
          <video
            className={classes.userVideo}
            playsInline
            muted
            ref={userVideo}
            autoPlay
          />
        </Box>
      </Box>
      <BottomBar
        className={classes.bottomBar}
        endCall={() => {
          endCall();
        }}
      /> */}
      <Grid container>
        <Grid item xs={12}>
          <video
            className={classes.partnerVideo}
            playsInline
            muted
            ref={partnerVideo}
            autoPlay
          />
        </Grid>
        <Grid item xs={12}>
          <Box className={classes.bottomBar}>
            <BottomBar
              handleEndCall={endCall}
              handleMuteAudio={muteAudio}
              handleMuteVideo={muteVideo}
            />
          </Box>
        </Grid>
      </Grid>
      <Box className={classes.user}>
        <video
          className={classes.userVideo}
          playsInline
          muted
          ref={userVideo}
          autoPlay
        />
      </Box>
    </>
  );
};
