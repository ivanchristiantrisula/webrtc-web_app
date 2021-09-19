import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  CardHeader,
  createStyles,
  Grid,
  makeStyles,
  Theme,
} from "@material-ui/core";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      paddingLeft: "2rem",
      paddingRight: "1rem",
    },
  })
);

export default (props: { startVideoCall: Function; user: any }) => {
  const classes = useStyles();

  const handleClickVideoCall = () => {
    props.startVideoCall();
  };

  return (
    <Grid
      container
      className={classes.root}
      alignItems="center"
      justify="center"
    >
      <Grid item xs={7}>
        <CardHeader
          avatar={
            <Avatar
              src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${props.user.profilepicture}.png`}
            />
          }
          title={props.user.name}
        />
      </Grid>
      <Grid item xs={3}>
        <Box textAlign="right">
          <ButtonBase onClick={handleClickVideoCall}>
            <VideocamOutlinedIcon fontSize="large" />
          </ButtonBase>
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Box textAlign="right">
          <ButtonBase>
            <MoreVertIcon fontSize="large" />
          </ButtonBase>
        </Box>
      </Grid>
    </Grid>
  );
};
