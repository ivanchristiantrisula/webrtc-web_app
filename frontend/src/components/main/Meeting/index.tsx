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
  endMeeting: Function;
}) => {
  const [meetingID, setMeetingID] = useState<string>();

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
          meetingID={meetingID || props.meetingID}
          endMeeting={props.endMeeting()}
        />
      ) : (
        <Welcome onCreateMeeting={requestMeetingID} />
      )}
    </>
  );
};
