import { Box, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import AirplayIcon from "@material-ui/icons/Airplay";
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import CallEndIcon from "@material-ui/icons/CallEnd";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useState } from "react";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    gridParent: {
      minHeight: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    gridItems: {
      height: "100%",
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
    },
    leftSection: {
      marginRight: "auto",
      paddingLeft: "20px",
    },
    midSection: {},
    rightSection: {
      marginLeft: "auto",
      paddingRight: "20px",
    },
    iconContainer: {
      marginLeft: "15px",
      marginRight: "15px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  })
);

export default (props: {
  meetingID: string;
  handleLeaveMeeting: Function;
  handleInviteUser: Function;
  handleMuteVideo: Function;
  handleMuteAudio: Function;
  handleScreenShare: Function;
}) => {
  const classes = useStyle();
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  return (
    <>
      <Grid className={classes.gridParent} container justify="center">
        <Grid item xs={4} className={classes.gridItems}>
          <Box display="flex" className={classes.leftSection}>
            <Box className={classes.iconContainer}>
              <AirplayIcon
                fontSize="large"
                onClick={() => props.handleScreenShare()}
              />
              Screen Share
            </Box>
            <Box className={classes.iconContainer}>
              <VideoLabelIcon fontSize="large" />
              Whiteboard
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4} className={classes.gridItems}>
          <Box display="flex" className={classes.midSection}>
            <Box
              className={classes.iconContainer}
              onClick={() => {
                props.handleMuteAudio();
                setAudio(!audio);
              }}
            >
              {audio ? (
                <>
                  <MicIcon fontSize="large" />
                  Disable Audio
                </>
              ) : (
                <>
                  <MicOffIcon fontSize="large" />
                  Enable Audio
                </>
              )}
            </Box>
            <Box
              className={classes.iconContainer}
              onClick={() => props.handleLeaveMeeting()}
            >
              <CallEndIcon fontSize="large" />
              End Call
            </Box>
            <Box
              className={classes.iconContainer}
              onClick={() => {
                props.handleMuteVideo();
                setVideo(!video);
              }}
            >
              {video ? (
                <>
                  <VideocamIcon fontSize="large" />
                  Disable Video
                </>
              ) : (
                <>
                  <VideocamOffIcon fontSize="large" />
                  Enable Video
                </>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2} className={classes.gridItems}>
          <Box display="flex" className={classes.midSection}>
            <Box
              className={classes.iconContainer}
              onClick={() => props.handleInviteUser()}
            >
              <PersonAddIcon fontSize="large" />
              Invite
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2} className={classes.gridItems}>
          <Box display="flex" className={classes.rightSection}>
            {props.meetingID}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
