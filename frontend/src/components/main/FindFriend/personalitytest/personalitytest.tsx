import {
  Typography,
  Box,
  Container,
  makeStyles,
  Paper,
  Theme,
  Button,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@material-ui/core/LinearProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import "./style.css";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-start",
    alignContent: "stretch",
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
    height: "40%",
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
    paddingTop: "5%",
  },
  navigationContainer: {
    width: "100%",
    height: "5%",

    display: "flex",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "50%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  navButton: {
    width: "50%",
    height: "100%",
  },
}));

export default () => {
  const classes = useStyles();
  const [questions, setQuestions] = useState(
    require("./questions.json").questions
  );
  const [answers, setAnswers] = useState([]);
  const [currQuestionNum, setCurrQuestionNum] = useState(0);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  const nextQuestion = () => {
    setCurrQuestionNum(currQuestionNum + 1);
  };

  const prevQuestion = () => {
    setCurrQuestionNum(currQuestionNum - 1);
  };

  const pickSelection = (selection: number) => {
    if (answers[currQuestionNum] === undefined) {
      setAnswers((old) => [...old, selection]);
    } else {
      let x = answers;
      x[currQuestionNum] = selection;
      setAnswers([...x]);
    }
  };

  return (
    <Container className={classes.root}>
      <Box className={classes.progressContainer}>
        <LinearProgressWithLabel
          value={(answers.length / (questions.length - 1)) * 100}
        />
      </Box>
      <Box className={classes.questionContainer}>
        <Typography variant="h4">{questions[currQuestionNum].title}</Typography>
      </Box>
      <Box className={classes.answersArea}>
        {questions[currQuestionNum].selections.map(
          (selection: string, idx: number) => {
            return (
              <Paper
                elevation={5}
                className={classes.answerBox}
                onClick={() => pickSelection(idx)}
                color={answers[currQuestionNum] === idx ? "red" : "black"}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={answers[currQuestionNum] == idx ? true : false}
                    />
                  }
                  label={
                    <Typography variant="subtitle1">{selection}</Typography>
                  }
                />
              </Paper>
            );
          }
        )}
      </Box>
      <Box className={classes.navigationContainer}>
        <Box className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.navButton}
            onClick={prevQuestion}
          >
            Previous Question
          </Button>
        </Box>
        <Box className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.navButton}
            onClick={nextQuestion}
            disabled={answers[currQuestionNum] === undefined}
          >
            Next Question
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
