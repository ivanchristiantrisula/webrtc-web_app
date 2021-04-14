import { createStyles, makeStyles, Theme } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      bottom: "0px",
      width: "100%",
    },
  })
);

export default function (props: any) {
  const classes = useStyles();
  let [text, setText] = useState("");

  return (
    <div className={classes.root}>
      <TextField
        label="Send a text"
        onChange={(e) => setText(e.target.value)}
      />
      <div
        onClick={() => {
          props.handleSendText(text);
        }}
      >
        <SendIcon />
      </div>
    </div>
  );
}
