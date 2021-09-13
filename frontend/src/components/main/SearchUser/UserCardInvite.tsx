import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Button,
  Fade,
  Popper,
  ButtonBase,
  Box,
  ClickAwayListener,
  Card,
  CardContent,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { useEffect, useRef, useState } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ProfileCard from "../ProfileCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    avatar: {
      marginLeft: "0.8rem",
    },
  })
);

export default function (props: {
  user: any;
  accept: Function;
  reject: Function;
}) {
  const classes = useStyles();
  let [openProfileCard, setOpenProfileCard] = useState(false);
  let [cardAnchorEl, setCardAnchorEl] = useState<HTMLDivElement>();

  let rootAnchorRef = useRef<any>();

  const toggleProfileCard = () => {
    setOpenProfileCard(true);
    setCardAnchorEl(rootAnchorRef.current);
  };

  const closePopper = () => {
    if (openProfileCard) {
      setOpenProfileCard(false);
      setCardAnchorEl(null);
    }
  };

  return (
    <>
      <ClickAwayListener onClickAway={closePopper}>
        <div style={{ height: "auto", margin: "0.5rem" }} ref={rootAnchorRef}>
          <Card>
            <CardContent>
              <Grid container spacing={1} className={classes.root}>
                <Grid item xs={2} className={classes.avatar}>
                  <ButtonBase onClick={toggleProfileCard}>
                    <Avatar className={classes.purple}>
                      {props.user.name.charAt(0)}
                    </Avatar>
                  </ButtonBase>
                </Grid>
                <Grid item xs={6}>
                  <ButtonBase onClick={toggleProfileCard}>
                    {props.user.name}
                  </ButtonBase>
                </Grid>
                <Grid>
                  <Grid container direction="row" alignItems="center">
                    <Grid item>
                      <Box
                        onClick={() => {
                          props.accept(props.user);
                        }}
                      >
                        <CheckCircleIcon />
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box
                        onClick={() => {
                          props.reject(props.user);
                        }}
                      >
                        <CancelIcon />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </ClickAwayListener>

      <Popper
        open={openProfileCard}
        anchorEl={cardAnchorEl}
        placement={"right-start"}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <ProfileCard
              user={props.user}
              // addFriendHandler={addFriend}
              // isUserFriend={false}
            />
          </Fade>
        )}
      </Popper>
    </>
  );
}
