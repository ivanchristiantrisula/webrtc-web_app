import { createStyles, makeStyles, Modal, Theme } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import _ from "underscore";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";
import UserCardInvite from "./UserCardInvite";
require("dotenv").config();

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
    findUserBox: {
      width: "100%",
      height: "50px",
      backgroudColor: "black",
    },
  })
);

export default () => {
  const classes = useStyles();
  let [users, setUsers] = useState([]);
  let [openSearchUserModal, setOpenSearchUserModal] = useState(false);
  let [pendings, setPendings] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/api/user/getPendingFriends`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setPendings(res.data.pendings);
      })
      .catch((err) => console.log(err));
  }, []);

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

  const handleAcceptFriendReq = (target: any) => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/acceptFriendRequest`,
        {
          target: target,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status == 200) alert("Sukses acc friend req");
        console.log(res);
      });
  };

  const handleRejectFriendReq = (target: any) => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/rejectFriendRequest`,
        {
          target: target,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status == 200) alert("Sukses reject friend req");
      });
  };
  return (
    <div className={classes.root}>
      <div
        className={classes.findUserBox}
        onClick={() => {
          setOpenSearchUserModal(true);
        }}
      >
        <Grid container>
          <Grid item xs={2}>
            <SearchIcon />
          </Grid>
          <Grid item xs={10}>
            Find User
          </Grid>
        </Grid>
      </div>

      <div>
        {pendings.length > 0
          ? pendings.map((obj) => {
              return (
                <UserCardInvite
                  user={obj}
                  accept={handleAcceptFriendReq}
                  reject={handleRejectFriendReq}
                />
              );
            })
          : ""}
      </div>

      <Modal
        open={openSearchUserModal}
        onClose={() => {
          setOpenSearchUserModal(false);
        }}
      >
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
      </Modal>
    </div>
  );
};
