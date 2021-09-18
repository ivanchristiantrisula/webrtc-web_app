import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Card,
  CardContent,
  Box,
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
      alignItems: "center",
      margin: "0.5rem",
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    avatar: {
      marginLeft: "0.8rem",
    },
  })
);

export default function (props: any) {
  const classes = useStyles();

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            className={classes.purple}
            src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${props.user.profilepicture}.png`}
          />
        }
        title={props.user.name}
      />
    </Card>
  );
}
