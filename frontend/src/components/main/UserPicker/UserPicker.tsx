import UserCard from "./UserCard";
import Modal from "@material-ui/core/Modal";
import { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import _ from "underscore";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      broderRight: "solid black 1px",
      height: "100vh",
    },
    paper: {
      position: "absolute",
      width: 400,
      height: 600,
      left: "50%",
      top: "50%",
      marginLeft: -200,
      marginTop: -300,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

export default (props: {
  isOpen: boolean;
  users: any;
  onPickedUser: (user: any, sid: string) => void;
  title: string;
  multipleUser: boolean;
}) => {
  let [pickedUsers, setPickedUsers] = useState({});
  let classes = useStyles();

  useEffect(() => {
    //console.log(props);
  }, []);

  const handleClick = (idx: string) => {
    if (props.multipleUser) {
      let x = pickedUsers;
      if (_.isUndefined(x[idx])) {
        x[idx] = props.users[idx];
      } else {
        x[idx] = undefined;
      }

      setPickedUsers({ ...x });
    } else {
      props.onPickedUser(props.users[idx], idx);
    }
  };

  return (
    <>
      <Modal open={props.isOpen}>
        <div className={classes.paper}>
          <h2>{props.title}</h2>
          {Object.keys(props.users).map((idx: any) => {
            return (
              <div
                onClick={() => {
                  handleClick(idx);
                }}
              >
                <UserCard
                  user={props.users[idx]}
                  multiple={props.multipleUser}
                  selected={!_.isUndefined(pickedUsers[idx])}
                />
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};
