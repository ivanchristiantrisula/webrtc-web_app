import { useRef, useState, useEffect } from "react";
import Peer from "simple-peer";
import UserPicker from "../UserPicker/UserPicker";

export default (props: { friends: any; socket: any }) => {
  const peers = useRef({});
  const userSockets = useRef([]);
  const [openUserPicker, setOpenUserPicker] = useState(true);
  const [invitedUsers, setInvitedUsers] = useState({});

  useEffect(() => {
    props.socket.on("meetingInvitationResponse", (response: boolean) => {
      alert("meeting response : " + response);
    });
  }, []);

  const createPeer = () => {};

  const inviteUser = (users: {}) => {
    for (const key in users) {
      if (Object.prototype.hasOwnProperty.call(users, key)) {
        const element = users[key];

        props.socket.emit("inviteUserToMeeting", {
          to: key,
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
