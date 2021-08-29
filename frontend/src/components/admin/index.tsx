import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { classicNameResolver } from "typescript";
import _ from "underscore";
import AdminReports from "./reports";
import Sidebar from "./sidebar";
import ReportDetail from "./reports/detail";

const useStyles = makeStyles((theme: Theme) => ({
  sidebar: {
    width: "5rem",
  },
  midContainer: { width: "30rem", minWidth: 0, borderRight: "solid black 1px" },
  rightContainer: { width: "auto" },
}));

export default function AdminPage() {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState("reports");
  const [reportDetail, setReportDetail] = useState({});
  return (
    <Box>
      <Grid container>
        {/* SIDEBAR */}
        <Grid item className={classes.sidebar}>
          <Sidebar openMenu={(menu: string) => setOpenMenu(menu)} />
        </Grid>
        {/* MID */}
        <Grid item className={classes.midContainer}>
          <AdminReports
            openReportDetail={(report: any) => setReportDetail(report)}
          />
        </Grid>
        {/* RIGHT */}
        <Grid item xs className={classes.rightContainer}>
          {!_.isEmpty(reportDetail) ? (
            <ReportDetail report={reportDetail} />
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
}
