import { createStyles, makeStyles } from "@material-ui/core";
import VideoCallIcon from "@material-ui/icons/VideoCall";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "absolute",
      top: "0px",
      width: "100%",
      height: "3rem",
      borderBottom: "solid black 1px",
    },
  })
);

export default (props: any) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
        onClick={() => {
          props.startVideoCall();
        }}
      >
        <VideoCallIcon />
      </div>
    </div>
  );
};
