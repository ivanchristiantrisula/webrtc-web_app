import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Button,
  Card,
  CardHeader,
  IconButton,
  Box,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { useEffect } from "react";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: "solid black 1px",
      height: "5rem",
      display: "flex",
      alignItems: "center",
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    avatar: {},
    buttonArea: {
      display: "flex",
      alignItems: "center",
    },
    card: {
      marginTop: "1rem",
    },
  })
);

export default function (props: { user: any; addFriend: Function }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar
            src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${props.user.profilepicture}.png`}
          />
        }
        action={
          <IconButton>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                props.addFriend(props.user);
              }}
            >
              Add
            </Button>
          </IconButton>
        }
        title={props.user.name}
        subheader=""
      />
    </Card>
  );
}
