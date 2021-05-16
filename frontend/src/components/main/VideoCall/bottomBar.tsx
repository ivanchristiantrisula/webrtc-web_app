import { createStyles } from "@material-ui/core";
import CallEndIcon from "@material-ui/icons/CallEnd";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: "white",
      position: "relative",
      width: "100%",
      bottom: 0,
      left: 0,
    },
  })
);

export default (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div
        onClick={() => {
          props.endCall();
        }}
      >
        <CallEndIcon />
      </div>
    </div>
  );
};
