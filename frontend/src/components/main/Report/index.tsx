import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  InputLabel,
  NativeSelect,
} from "@material-ui/core";
import axios from "axios";

export default function Report(props: {
  open: boolean;
  chat?: {};
  targetUID: string;
  closeDialog: Function;
}) {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = useState("Spam");
  const [description, setDescription] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.closeDialog();
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.currentTarget.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.currentTarget.value);
  };

  const handleSubmit = () => {
    console.log(props);
    const payload = {
      reporter: JSON.parse(localStorage.getItem("user"))._id,
      reportee: props.targetUID,
      type: props.chat ? "chat" : "profile",
      category: category,
      proof: props.chat || null,
      description: description,
    };
    console.log(payload);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/api/user/report`, payload, {
        withCredentials: true,
      })
      .then((res) => {
        //do something
        if (res.status === 200) props.closeDialog();
      })
      .catch((err) => {
        //do something
      });
  };

  return (
    <Box>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            By reporting, you agree to send some part of this convesation to
            admin. False report may result in unfavorable meassure
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="report-category">
              Violation Category
            </InputLabel>
            <NativeSelect
              onChange={handleCategoryChange}
              inputProps={{
                name: "category",
                id: "report-category",
              }}
            >
              <option value={"Spam"}>Spam</option>
              <option value={"Nudity or sexual activity"}>
                Nudity or sexual activity
              </option>
              <option value={"Hate Speech"}>Hate Speech</option>
              <option value={"Bullying or harashment"}>
                Bullying or harashment
              </option>
              <option value={"False Information"}>False Information</option>
              <option value={"Scam or fraud"}>Scam or fraud</option>
              <option value={"Sale of illegal goods"}>
                Sale of illegal goods
              </option>
              <option value={"Other reason"}>Other reason</option>
            </NativeSelect>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
              defaultValue=""
              variant="outlined"
              onChange={handleDescriptionChange}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
