import {
  Box,
  ButtonBase,
  Container,
  createStyles,
  FormControl,
  Grid,
  makeStyles,
  Theme,
} from "@material-ui/core";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import ImageIcon from "@material-ui/icons/Image";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import { useRef, useState, useLayoutEffect } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      backgroundColor: theme.palette.background.paper,
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
    },
  })
);

export default function (props: {
  handleFileUpload: Function;
  handleSendText: Function;
  isUploadingFile: boolean;
}) {
  const classes = useStyles();
  let [text, setText] = useState("");
  let fileInput = useRef();
  let textInput = useRef<TextFieldProps>();

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
    // <div className={classes.root}>
    //   <TextField
    //     label="Send a text"
    //     inputRef={textInput}
    //     onChange={(e) => setText(e.target.value)}
    //     onKeyPress={(e) => {
    //       if (e.key === "Enter") {
    //         sendText();
    //       }
    //     }}
    //   />
    //   <div onClick={sendText}>
    //     <SendIcon />
    //   </div>
    //   <input
    //     type="file"
    //     onChange={(e) => {
    //       props.handleFileUpload(e.target.files[0]);
    //     }}
    //     disabled={props.isUploadingFile}
    //   />
    // </div>
    <Container maxWidth={false} className={classes.root}>
      <Grid
        container
        alignItems="center"
        justify="center"
        spacing={2}
        className={classes.root}
      >
        <Grid item>
          <Box textAlign="center">
            <ButtonBase>
              <PublishOutlinedIcon />
            </ButtonBase>
          </Box>
        </Grid>
        <Grid item xs>
          <FormControl fullWidth>
            <TextField
              label="Say something"
              fullWidth
              variant="outlined"
              multiline
              onChange={(e) => setText(e.target.value)}
              inputRef={textInput}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <Box textAlign="center">
            <ButtonBase onClick={sendText}>
              <SendIcon />
            </ButtonBase>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
