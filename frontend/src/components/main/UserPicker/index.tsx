import UserCard from "./UserCard";
import Modal from "@material-ui/core/Modal";
import { useEffect, useState } from "react";
import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
} from "@material-ui/core";
import _ from "underscore";
import Button from "@material-ui/core/Button";

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
  onPickedUser: (users: {}) => void;
  title: string;
  multipleUser: boolean;
  handleClose: () => void;
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
      let x = {};
      x[idx] = props.users[idx];
      setPickedUsers({ ...x });
    }
  };

  const handleConfirm = () => {
    props.onPickedUser(pickedUsers);
  };

  const handleClose = () => {
    props.handleClose();
  };

  return (
    <>
      <Dialog open={props.isOpen}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          {Object.keys(props.users).map((idx: any) => {
            return (
              <div
                onClick={() => {
                  handleClick(idx);
                }}
                style={{ width: "500px" }}
              >
                <UserCard
                  user={props.users[idx]}
                  multiple={props.multipleUser}
                  selected={!_.isUndefined(pickedUsers[idx])}
                />
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button color="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
