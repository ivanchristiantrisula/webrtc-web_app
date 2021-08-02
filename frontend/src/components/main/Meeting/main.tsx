import { useRef, useState, useEffect } from "react";
import Peer from "simple-peer";
import UserPicker from "../UserPicker";
import _ from "underscore";
import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import BottomBar from "./bottombar";
import { Socket } from "socket.io-client";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      backgroundColor: "black",
    },

    videoArea: {
      minWidth: "100%",
      height: "93%",
      alignItems: "center",
      justifyContent: "center",
    },
    video: {
      minWidth: "100%",
      minHeight: "100%",
      aspectRatio: "3/2",
    },

    vidContainer: {
      minWidth: "49%",
      minHeight: "49%",
    },

    bottomBar: {
      height: "7%",
      width: "100%",
      backgroundColor: "white",
    },

    userVidContainer: {
      alignSelf: "flex-end",
      justifyContent: "flex-end",
      marginRight: "10px",
      marginBottom: "10px",
      textAlign: "right",
    },

    userVid: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
  })
);

const Video = (props: { peer: any }) => {
  const ref = useRef<any>();
  const classes = useStyle();

  useEffect(() => {
    props.peer.on("stream", (stream: any) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <video className={classes.video} playsInline autoPlay muted ref={ref} />
  );
};

export default (props: {
  friends: any;
  socket: Socket;
  userSocketID: string;
  meetingID: string;
  endMeeting: Function;
}) => {
  const classes = useStyle();
  let peersRef = useRef([]);
  let myStreamRef = useRef<any>();
  const [openUserPicker, setOpenUserPicker] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState({});
  const [userSockets, setUserSockets] = useState([]);
  const [userStreamStatus, setUserStreamStatus] = useState(false);
  const [myStream, setMyStream] = useState<any>({});
  const [peers, setPeers] = useState([]);
  //const [streams, setStreams] = useState([]);

  useEffect(() => {
    props.socket.on("meetingInvitationResponse", (response: boolean) => {
      //do something when user has responed meeting invitation
    });

    props.socket.on("meetingMembers", (data: any) => {
      console.log(data);
      setUserSockets(data);

      //connect to everyone
      data.forEach((socket: any) => {
        //check if peer connection doesn't exist, then create the connection
        if (
          _.isUndefined(peersRef.current.find((p) => p.socket === socket)) &&
          socket != props.userSocketID
        ) {
          console.log(myStream);
          let peer = createPeer(socket, true);
          peersRef.current.push({
            peer: peer,
            socket: socket,
          });
          setPeers((p) => [...p, peer]);
        }
      });

      //check if user just created the room
      if (data.length === 1) {
        setOpenUserPicker(true);
      }
    });

    props.socket.on("newMeetingMember", (data: any) => {
      setUserSockets((old) => [...old, data]);
    });

    props.socket.on("meetingSDPTransfer", (data: any) => {
      if (data.from !== data.to) {
        let peerIdx = peersRef.current.findIndex((p) => p.socket == data.from);
        console.log(data);
        //alert(peerIdx);
        if (peerIdx == -1) {
          let x = createPeer(data.from, false);
          x.signal(data.signal);
          peersRef.current.push({
            peer: x,
            socket: data.from,
          });
          setPeers((p) => [...p, x]);
        } else {
          //console.log(peersRef.current[peerIdx].peer);
          //console.log(peerRef);
          peersRef.current[peerIdx].peer.signal(data.signal);
        }
      }
    });

    props.socket.on("removeMeetingPeer", ({ socketID }) => {
      let idx = peersRef.current.findIndex((p) => p.socket === socketID);

      if (idx > -1) {
        peersRef.current.splice(idx, 1);

        setPeers([...peers.splice(idx, 1)]);
      }
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        setMyStream(stream);
        if (myStreamRef.current) {
          myStreamRef.current.srcObject = stream;
        }

        //wait untill user stream is available, then request meeting members
        requestMeetingMembers();
      });
  }, []);

  const requestMeetingMembers = () => {
    props.socket.emit("requestMeetingMembers", props.meetingID);
  };

  const createPeer = (socketID: string, isInitiator: boolean) => {
    console.log(myStream);
    let peer = new Peer({
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
      stream: myStreamRef.current.srcObject,
    });

    peer.on("signal", (data: any) => {
      props.socket.emit("transferSDPMeeting", {
        signal: data,
        to: socketID,
        from: props.userSocketID,
      });
    });

    peer.on("connect", (data: any) => {
      //do somtheing when connected
      // let x = userSockets;
      // x[socketID].status = "Connected. Waiting for stream";
      // setUserSockets(x);
    });

    return peer;
  };

  const isMeetingAdmin = () => {
    if (userSockets[0].socket === props.userSocketID) return true;
    return false;
  };

  const inviteUser = (users: {}) => {
    setOpenUserPicker(false);
    for (const key in users) {
      if (Object.prototype.hasOwnProperty.call(users, key)) {
        const element = users[key];

        props.socket.emit("inviteUserToMeeting", {
          to: key,
          meetingID: props.meetingID,
        });
      }
    }
  };

  const leaveMeeting = () => {
    props.socket.emit("leaveMeeting", { meetingID: props.meetingID });
    peersRef.current.forEach((element) => {
      element.peer.destroy();
    });
    props.endMeeting();
  };

  const toggleVideo = () => {
    myStreamRef.current.srcObject.getVideoTracks()[0].enabled =
      !myStreamRef.current.srcObject.getVideoTracks()[0].enabled;
  };

  const toggleAudio = () => {
    myStreamRef.current.srcObject.getAudioTracks()[0].enabled =
      !myStreamRef.current.srcObject.getAudioTracks()[0].enabled;
  };

  const toggleScreenShare = () => {
    //@ts-ignore
    const stream = navigator.mediaDevices.getDisplayMedia();
    console.log(stream);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" className={classes.root}>
        <Box
          className={classes.videoArea}
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
        >
          {peers.map((peer, i) => {
            return (
              <Box className={classes.vidContainer}>
                <Video key={i} peer={peer} />
              </Box>
            );
          })}
          <Box
            height="150px"
            zIndex="99"
            alignSelf="flex-end"
            justifyContent="flex-end"
            flex="1"
          ></Box>
          <Box
            width="300px"
            height="150px"
            zIndex="99"
            className={classes.userVidContainer}
          >
            <video
              className={classes.userVid}
              playsInline
              //ref={(stream) => (streams.current[0] = stream)}
              ref={myStreamRef}
              autoPlay
              muted
            />
          </Box>
        </Box>
        <Box className={classes.bottomBar}>
          <BottomBar
            meetingID={props.meetingID}
            handleLeaveMeeting={leaveMeeting}
            handleInviteUser={() => setOpenUserPicker(true)}
            handleMuteVideo={toggleVideo}
            handleMuteAudio={toggleAudio}
            handleScreenShare={toggleScreenShare}
          />
        </Box>
      </Box>

      <UserPicker
        isOpen={openUserPicker}
        title={"Invite to meeting"}
        multipleUser={true}
        users={props.friends}
        onPickedUser={inviteUser}
        handleClose={() => setOpenUserPicker(false)}
      />
    </>
  );
};
