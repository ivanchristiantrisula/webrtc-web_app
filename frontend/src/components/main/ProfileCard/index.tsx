import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Box } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    width: "100%",
    height: 200,
  },
});

export default function ProfileCard(props: {
  user: any;
  isUserFriend: boolean;
  addFriendHandler?: Function;
}) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          title="Contemplative Reptile"
          image={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${props.user.profilepicture}.png`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.user.name}
          </Typography>
          <Typography gutterBottom variant="overline" component="h6">
            {props.user.MBTI}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.user.bio}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Box display={props.isUserFriend ? "none" : "block"}>
          <Button size="small" color="secondary">
            Block
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={() => props.addFriendHandler(props.user._id)}
          >
            Add Friend
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
