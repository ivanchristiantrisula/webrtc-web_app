import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Button,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { useEffect } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

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
    avatar: {
      marginLeft: "0.8rem",
    },
  })
);

export default function (props: any) {
  const classes = useStyles();

  return (
    <div style={{ height: "auto" }}>
      <Grid container spacing={1} className={classes.root}>
        <Grid item xs={2} className={classes.avatar}>
          <Avatar className={classes.purple}>
            {props.user.name.charAt(0)}
          </Avatar>
        </Grid>
        <Grid item xs={6}>
          {props.user.name}
        </Grid>
        <Grid>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <div
                onClick={() => {
                  props.accept(props.user);
                }}
              >
                <CheckCircleIcon />
              </div>
            </Grid>
            <Grid item>
              <div
                onClick={() => {
                  props.reject(props.user);
                }}
              >
                <CancelIcon />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
