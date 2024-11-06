import { Box, LinearProgress } from "@mui/material";
import React from "react";

export default function TopSideLoading({ isShowing, progressValue }) {
  return (
    isShowing && (
      <Box
        style={{
          marginBottom: "5px",
        }}
      >
        <LinearProgress
          variant="determinate"
          color="success"
          value={progressValue}
        />
      </Box>
    )
  );
}
