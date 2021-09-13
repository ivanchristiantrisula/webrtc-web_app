import { Box, Fade, Popper } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "./usercard";
import ProfileCard from "../ProfileCard";

export default () => {
  let [users, setUsers] = useState([]);
  let [userDetail, setUserDetail] = useState({});
  let [openProfileCard, setOpenProfileCard] = useState(false);
  let [cardAnchorEl, setCardAnchorEl] = useState<HTMLDivElement>();

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URI +
          "/api/user/getFriendsRecommendation",
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
  }, []);

  const handleClickUserCard =
    (user: any) => (e: React.MouseEvent<HTMLDivElement>) => {
      setUserDetail(user);
      setOpenProfileCard(true);
      setCardAnchorEl(e.currentTarget);
    };

  const addFriend = (id: string) => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/addFriend`,
        {
          user: { _id: id },
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
    <>
      <Popper
        open={openProfileCard}
        anchorEl={cardAnchorEl}
        placement={"right-start"}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <ProfileCard
              user={userDetail}
              addFriendHandler={addFriend}
              isUserFriend={false}
            />
          </Fade>
        )}
      </Popper>
      <Box>
        {users.map((user, i) => {
          if (user) {
            return (
              <Box onClick={handleClickUserCard(user)} key={i}>
                <UserCard user={user} />
              </Box>
            );
          }
        })}
      </Box>
    </>
  );
};
