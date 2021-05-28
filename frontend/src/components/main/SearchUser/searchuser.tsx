import { createStyles, makeStyles, Theme } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { useState } from "react";
import UserCard from "./UserCard";
import _ from "underscore";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

export default () => {
  const classes = useStyles();
  let [users, setUsers] = useState([]);

  const handleKeywordChange = (keyword: string) => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/findUser?keyword=${keyword}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addFriend = (user: any) => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/addFriend`,
        {
          user: user,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.error) alert(res.data.error);
        if (res.status == 200) {
          alert("sukses add friend");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">Find User</h2>
      <TextField
        label="Send a text"
        onChange={(e) => handleKeywordChange(e.target.value)}
      />
      <div>
        {users.map((obj) => {
          if (!_.isEmpty(obj))
            return (
              <UserCard
                user={obj}
                addFriend={(user: any) => {
                  addFriend(user);
                }}
              />
            );
        })}
      </div>
    </div>
  );
};
