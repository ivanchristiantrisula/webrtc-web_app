import { createStyles, makeStyles, Theme } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import ImageIcon from "@material-ui/icons/Image";
import { useRef, useState, useLayoutEffect } from "react";

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
  let fileInput = useRef();
  let textInput = useRef<HTMLInputElement>();

  useLayoutEffect(() => {
    console.log(textInput); // { current: <h1_object> }
  });

  const sendText = () => {
    if (text != "") {
      props.handleSendText(text);
      setText("");
      textInput.current.value = "";
    }
  };

  return (
    <div className={classes.root}>
      <TextField
        label="Send a text"
        inputRef={textInput}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            sendText();
          }
        }}
      />
      <div onClick={sendText}>
        <SendIcon />
      </div>
      <input
        type="file"
        onChange={(e) => {
          props.handleFileUpload(e.target.files[0]);
        }}
      />
    </div>
  );
}
