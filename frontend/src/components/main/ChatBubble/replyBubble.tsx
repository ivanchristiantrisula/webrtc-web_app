import classes from "*.module.css";
import { makeStyles, Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: "lightslategray",
      border: "solid black 1px",
      marginBottom: "5px",
      borderRadius: "10px",
      padding: "10px",
      marginRight: "10px",
    },
  })
);
export default (props: { chat: any }) => {
  const classes = useStyle();

  return <div className={classes.root}>{props.chat.message}</div>;
};
