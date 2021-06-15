import { createStyles, makeStyles, Theme, Grid } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { useEffect } from "react";

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
      <Grid direction="column" container spacing={1} className={classes.root}>
        <Grid item xs={2} className={classes.avatar}>
          <Avatar className={classes.purple}>
            {props.user.name.charAt(0)}
          </Avatar>
        </Grid>
        <Grid container item direction="row">
          <Grid item xs={12} style={{ height: "100%" }} alignItems="center">
            {props.user.name}
          </Grid>
          <Grid item xs={12} style={{ height: "100%" }} alignItems="center">
            {props.lastMsg.type === "text"
              ? props.lastMsg.message
              : props.lastMsg.type.split("/")[0]}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
