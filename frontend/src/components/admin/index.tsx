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
import BannedUsers from "./bans";

const useStyles = makeStyles((theme: Theme) => ({
  hidden: {
    visibility: "hidden",
  },

  visible: {
    visibility: "visible",
  },
  sidebar: {
    width: "5rem",
  },
  midContainer: {
    width: "30rem",
    minWidth: 0,
    borderRight: "solid #d7d9d7 1px",
    backgroundColor: theme.palette.background.default,
  },
  rightContainer: {
    width: "auto",
    backgroundColor: theme.palette.background.default,
  },
}));

export default function AdminPage() {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState("reports");
  const [reportDetail, setReportDetail] = useState({});

  const renderMidContent = () => {
    if (openMenu === "reports") {
      return (
        <AdminReports
          openReportDetail={(report: any) => setReportDetail(report)}
        />
      );
    } else if (openMenu === "bans") {
      return <BannedUsers />;
    }
  };

  return (
    <Box>
      <Grid container>
        {/* SIDEBAR */}
        <Grid item className={classes.sidebar}>
          <Sidebar openMenu={(menu: string) => setOpenMenu(menu)} />
        </Grid>
        {/* MID */}
        <Grid item className={`${classes.midContainer}`}>
          {renderMidContent()}
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
