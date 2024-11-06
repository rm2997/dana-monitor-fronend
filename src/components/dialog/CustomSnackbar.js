import { Alert, Snackbar } from "@mui/material";
import React from "react";

export default function CustomSnackbar({
  open,
  closeSnackFunc,
  state,
  message,
}) {
  return (
    <Snackbar autoHideDuration={6000} open={open} onClose={closeSnackFunc}>
      <Alert
        severity={state ? "success" : "error"}
        variant="filled"
        onClose={closeSnackFunc}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
