import {
  Card,
  CardActions,
  CardContent,
  Collapse,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
  Avatar,
  CardHeader,
  Box,
  Grid,
  Button,
  FormControl,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import { red } from "@material-ui/core/colors";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "0.5rem",
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    avatar: {
      backgroundColor: red[500],
    },
  })
);

const BannedUserCard = (props: { user: any; handleUserUnbanned: Function }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleExpandClick = () => setExpanded(!expanded);

  const handleClick = () => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/unbanUser`,
        {
          userID: props.user._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) props.handleUserUnbanned();
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar
              aria-label=""
              src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${props.user.profilepicture}.png`}
            ></Avatar>
          }
          action={
            <IconButton aria-label="">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.user.name}
          subheader=""
        />
        <CardContent>
          {"Banned on : "}
          <Typography variant="body2" color="textSecondary" component="p">
            {new Date(props.user.bannedDate).toLocaleDateString()}{" "}
            {new Date(props.user.bannedDate).toLocaleTimeString()}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Box>
              <Box width="100%" height="">
                <Grid container>
                  <Grid item xs={6}>
                    <Box textAlign="left">Banned Date</Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="right" fontWeight="fontWeightBold">
                      {new Date(props.user.bannedDate).toLocaleDateString()}{" "}
                      {new Date(props.user.bannedDate).toLocaleTimeString()}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box>
              <Box width="100%" height="">
                <Grid container>
                  <Grid item xs={6}>
                    <Box textAlign="left">Violation Type</Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="right" fontWeight="fontWeightBold">
                      {props.user.report[0].category}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box width="100%" height="">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Notes</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="right" fontWeight="fontWeightBold">
                    {}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <FormControl fullWidth>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                >
                  Unban User
                </Button>
              </FormControl>
            </Box>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};

const BannedUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const removeUser = (user: any) => {
    setUsers(users.filter((item) => user._id !== item._id));
  };

  const fetchBannedUsers = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/api/user/getBannedUsers`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <>
      {users.map((user, idx) => {
        return (
          <BannedUserCard
            key={idx}
            user={user}
            handleUserUnbanned={() => removeUser(user)}
          />
        );
      })}
    </>
  );
};

export default BannedUsers;
