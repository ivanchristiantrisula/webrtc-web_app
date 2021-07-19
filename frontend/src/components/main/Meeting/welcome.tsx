import Button from "@material-ui/core/Button";
export default (props: { onCreateMeeting: Function }) => {
  return (
    <>
      <Button
        variant="text"
        color="default"
        onClick={() => props.onCreateMeeting()}
      >
        Create a meeting
      </Button>
    </>
  );
};
