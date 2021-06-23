import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import React from "react";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100px",
      minWidth: "100%",
    },
  })
);

export default (props: any) => {
  const classes = useStyle();

  const renderReplyChat = () => {
    if (props.chat.type === "text") {
      return props.chat.message;
    } else {
      return props.chat.type.split("/")[0];
    }
  };
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={11}>
          Replying
        </Grid>
        <Grid item xs={1}>
          {/* Close icon */}
        </Grid>
        <Grid item xs={12}>
          {renderReplyChat()}
        </Grid>
      </Grid>
    </div>
  );
};
