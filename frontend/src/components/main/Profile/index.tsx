import { Grid, Theme } from "@material-ui/core";
import { Container, createStyles, makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
    topGrid: {
      height: "20%",
    },
    bottomGrid: {
      height: "80%",
    },
  })
);

export default () => {
  const classes = useStyle();
  return (
    <>
      <Container className={classes.root}>
        <Grid container>
          <Grid item xs={12} className={classes.topGrid}>
            <Grid item xs={4}></Grid>
            <Grid item></Grid>
          </Grid>
          <Grid item xs={12} className={classes.bottomGrid}></Grid>
        </Grid>
      </Container>
    </>
  );
};
