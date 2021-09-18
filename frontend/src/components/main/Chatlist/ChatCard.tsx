import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Card,
  CardHeader,
  IconButton,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { useEffect } from "react";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "0.5rem",
    },
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  })
);

export default function (props: { user: any; lastMsg: any }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            aria-label=""
            src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${props.user.profilepicture}.png`}
            className={classes.avatar}
          />
        }
        title={props.user.name}
        subheader={
          props.lastMsg.type === "text"
            ? props.lastMsg.message
            : props.lastMsg.type.split("/")[0]
        }
      />
    </Card>
  );
}
