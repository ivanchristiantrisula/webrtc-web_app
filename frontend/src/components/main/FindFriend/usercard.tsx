import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  InputAdornment,
} from "@material-ui/core";
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
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  })
);

export default function (props: { user: any }) {
  const classes = useStyles();

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <div style={{ height: "auto" }}>
      <Grid direction="column" container spacing={1} className={classes.root}>
        <Grid item xs={2} className={classes.avatar}>
          <Avatar
            className={classes.avatar}
            src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${props.user.profilepicture}.png`}
          />
        </Grid>
        <Grid container item direction="row">
          <Grid item xs={12} style={{ height: "100%" }} alignItems="center">
            {props.user.name}
          </Grid>
          <Grid item xs={12} style={{ height: "100%" }} alignItems="center">
            {props.user.MBTI}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
