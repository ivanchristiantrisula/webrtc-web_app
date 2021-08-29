import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Container,
} from "@material-ui/core";

const ReportInformation = (props: { report: any }) => {
  return (
    <>
      <Card>
        <CardHeader title="Report Information" subheader="Chat Report" />
        <CardContent>
          <Box>
            <Box width="100%" height="1.5rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Reporter</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.reporter}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="1.5rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Reportee</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.reportee}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="1.5rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Report Type</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.type}
                    {" report"}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="1.5rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Category</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.category}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="1.5rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Description</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.description}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

const ReportProof = () => {
  return <></>;
};

const DetailReport = (props: { report: any }) => {
  return (
    <Container>
      <Box width>
        <ReportInformation report={props.report} />
      </Box>
    </Container>
  );
};

export default DetailReport;
