import {
  Typography,
  Box,
  Container,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import "./style.css";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    backgroundColor: "white",
  },
  questionContainer: {
    height: "10%",
    width: "100%",
    display: "flex",
    alignContent: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
    paddingBottom: "20px",
  },
  answersArea: {
    height: "50%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  answerBox: {
    display: "flex",
    alignItems: "center",
    height: "100px",
    paddingLeft: "20px",
    marginBottom: "20px",
  },
  progressContainer: {
    width: "100%",
    height: "10%",
  },
  navigationContainer: {
    width: "100%",
    height: "10%",
  },
}));

export default () => {
  const classes = useStyles();
  const [questions, setQuestions] = useState(
    require("./questions.json").questions
  );
  const [answers, setAnswers] = useState([]);
  const [questionNum, setQuestionNum] = useState(0);

  return (
    <Container className={classes.root}>
      <Box className={classes.progressContainer}></Box>
      <Box className={classes.questionContainer}>
        <Typography variant="h4">{questions[questionNum].title}</Typography>
      </Box>
      <Box className={classes.answersArea}>
        {questions[questionNum].selections.map((selection: string) => {
          return (
            <Paper elevation={5} className={classes.answerBox}>
              <Typography variant="subtitle1">{selection}</Typography>
            </Paper>
          );
        })}
      </Box>
      <Box className={classes.navigationContainer}></Box>
    </Container>
  );
};
