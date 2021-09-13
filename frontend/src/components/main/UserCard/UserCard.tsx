import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Card,
  CardContent,
  Box,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { useEffect } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "5rem",
      alignItems: "center",
      margin: "10px",
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
    // <div style={{ height: "auto" }}>
    //   <Grid container spacing={1} className={classes.root}>
    //     <Grid item xs={2} className={classes.avatar}>
    //       <Avatar className={classes.purple}>
    //         {props.user.name.charAt(0)}
    //       </Avatar>
    //     </Grid>
    //     <Grid item>{props.user.name}</Grid>
    //   </Grid>
    // </div>
    <Card className={classes.root}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={2} className={classes.avatar}>
            <Avatar
              className={classes.purple}
              src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${props.user.profilepicture}.png`}
            />
          </Grid>
          <Grid item xs>
            {props.user.name}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
