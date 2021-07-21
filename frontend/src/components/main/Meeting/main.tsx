import { useRef, useState, useEffect } from "react";
import Peer from "simple-peer";
import UserPicker from "../UserPicker";
import _ from "underscore";

export default (props: {
  friends: any;
  socket: any;
  userSocketID: string;
  meetingID: string;
}) => {
  let peers = useRef({});
  let streams = useRef({});
  const [openUserPicker, setOpenUserPicker] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState({});
  const [userSockets, setUserSockets] = useState([]);

  useEffect(() => {
    props.socket.on("meetingInvitationResponse", (response: boolean) => {
      alert("meeting response : " + response);
    });

    props.socket.on("meetingMembers", (data: any) => {
      setUserSockets(data);

      //check if user just created the room
      if (data.length === 1) {
        setOpenUserPicker(true);
      }
    });

    props.socket.on("newMeetingMember", (data: any) => {
      let x = userSockets;
      let payload = {
        socket: data,
        status: "Connecting",
      };
      x.push(payload);
      setUserSockets([...x]);
    });

    props.socket.on("meetingSDPTransfer", (data: any) => {
      if (_.isUndefined(peers.current[data.from])) createPeer(data.from, false);
      peers.current[data.from].signal(data.signal);
    });

    requestMeetingMembers();
  }, []);

  useEffect(() => {
    userSockets.forEach(({ socket, status }) => {
      if (
        _.isUndefined(peers.current[socket]) &&
        socket !== props.userSocketID
      ) {
        createPeer(socket, true);
      }
    });
  }, [userSockets]);

  const requestMeetingMembers = () => {
    props.socket.emit("requestMeetingMembers", props.meetingID);
  };

  const createPeer = (socketID: string, isInitiator: boolean) => {
    peers.current[socketID] = new Peer({
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
    });

    peers.current[socketID].on("signal", (data: any) => {
      props.socket.current.emit("transferSDPMeeting", {
        signal: data,
        to: socketID,
        from: props.userSocketID,
      });
    });

    peers.current[socketID].on("connect", (data: any) => {
      //do somtheing when connected
      let x = userSockets;
      x[socketID].status = "Connected. Waiting for stream";
      setUserSockets([...x]);
    });

    peers.current[socketID].on("stream", (stream: any) => {
      streams.current[socketID].srcObject = stream;

      let x = userSockets;
      x[socketID].status = "Stream available";
      setUserSockets([...x]);
    });
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

  return (
    <>
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
