import { useRef, useState, useEffect } from "react";
import Peer from "simple-peer";
import UserPicker from "../UserPicker/UserPicker";

export default (props: { friends: any }) => {
  const peers = useRef({});
  const userSockets = useRef([]);
  const [openUserPicker, setOpenUserPicker] = useState(true);

  useEffect(() => {}, []);

  const createPeer = () => {};

  return (
    <>
      <UserPicker
        isOpen={openUserPicker}
        title={"Invite to meeting"}
        multipleUser={true}
        users={props.friends}
        onPickedUser={() => {
          alert("Picked");
        }}
        handleClose={() => setOpenUserPicker(false)}
      />
    </>
  );
};
