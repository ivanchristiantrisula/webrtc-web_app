import { useRef, useState, useEffect } from "react";
import Peer from "simple-peer";
import UserPicker from "../UserPicker/UserPicker";
import _ from "underscore";

export default (props: {
  friends: any;
  socket: any;
  userSocketID: string;
  meetingID: string;
}) => {
  const peers = useRef({});
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
      x.push(data);
      setUserSockets(x);
    });

    requestMeetingMembers();
  }, []);

  useEffect(() => {
    userSockets.forEach((socketID) => {
      if (
        _.isUndefined(peers.current[socketID]) &&
        socketID !== props.userSocketID
      ) {
        createPeer(socketID);
      }
    });
  }, [userSockets]);

  const requestMeetingMembers = () => {
    props.socket.emit("requestMeetingMembers", props.meetingID);
  };

  const createPeer = (socketID: string) => {
    alert(socketID);
  };

  const isMeetingAdmin = () => {
    if (userSockets[0] === props.userSocketID) return true;
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
