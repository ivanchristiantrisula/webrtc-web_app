import { useEffect } from "react";
import UserCard from "../UserCard/UserCard";

export default function (props: any) {
  function openChatChannel(uid: string) {}
  return (
    <div>
      {Object.keys(props.users).map((keyName, i) => {
        if (keyName != props.userID)
          return (
            <div onClick={() => props.setPrivateChatTarget(keyName)}>
              <UserCard user={props.users[keyName]} />
            </div>
          );
      })}
    </div>
  );
}
