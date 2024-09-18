import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function MyProgressChart(props) {
  const value = props.value ? props.value : 100;
  return (
    <div>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        {props.labelName}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "90%", margin: "13px" }}>
          <LinearProgress
            variant="determinate"
            {...props}
            sx={{ height: "17px", borderRadius: "10px" }}
            color={value > 50 ? (value > 75 ? "error" : "warning") : "success"}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.primary">{`${Math.round(
            value
          )}%`}</Typography>
        </Box>
      </Box>
    </div>
  );
}
