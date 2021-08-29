import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { classicNameResolver } from "typescript";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
  card: {
    height: "auto",
    margin: "7px",
  },
}));

export default function AdminReports(props: { openReportDetail: Function }) {
  const [reports, setReports] = useState([]);
  const [openReportID, setOpenReportID] = useState({});
  const classes = useStyles();
  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    console.log(reports);
  }, [reports]);

  const fetchReports = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/api/report/getAllReports`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          setReports(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = (report: {}) => {
    props.openReportDetail(report);
  };
  return (
    <Box className={classes.root}>
      {reports.map((report) => {
        return (
          <Card className={classes.card}>
            <ButtonBase onClick={() => handleClick(report)}>
              <CardContent>
                <Grid container>
                  <Grid item xs={6}>
                    <Box textAlign="left">
                      <Typography variant="h6">{report.category}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="right">
                      <Typography color="textSecondary" variant="body1">
                        {new Date(report.timestamp).toLocaleDateString()}{" "}
                        {new Date(report.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={8}>
                    <Box textAlign="left">
                      <Typography color="textSecondary">
                        ID : {report._id}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Box
                      textAlign="right"
                      color={report.status === "Open" ? "dark green" : "red"}
                    >
                      <Typography variant="body1" color="initial">
                        {report.status}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </ButtonBase>
          </Card>
        );
      })}
    </Box>
  );
}
