import { useEffect, useState } from "react";
import Main from "./main";
import Welcome from "./welcome";

export default (props: {
  meetingID: string;
  friends: any;
  socket: any;
  userSocketID: string;
  meetingMode: boolean;
  handleNewMeeting: Function;
}) => {
  const [meetingID, setMeetingID] = useState("");

  useEffect(() => {
    props.socket.on("meetingID", (id: string) => {
      setMeetingID(id);

      props.handleNewMeeting(id);
    });
  }, []);

  const requestMeetingID = () => {
    props.socket.emit("requestNewRoom");
  };
  return (
    <>
      {props.meetingID && props.meetingMode ? (
        <Main
          friends={props.friends}
          socket={props.socket}
          userSocketID={props.userSocketID}
          meetingID={meetingID}
        />
      ) : (
        <Welcome onCreateMeeting={requestMeetingID} />
      )}
    </>
  );
};
