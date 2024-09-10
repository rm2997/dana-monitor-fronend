import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Card, Box, Typography, IconButton } from "@mui/material";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";

export default function MyPieChart({ dataSet, handelFetch }) {
  const usingLuCount = dataSet
    ? dataSet.AllLUCount - (dataSet.AvailableLUCount + dataSet.FailedLUCount)
    : 0;
  const chartSeries = [
    {
      data: [
        {
          id: 0,
          value: dataSet ? dataSet.AvailableLUCount : 0,
          label: "Available",
          color: "#55C306",
        },
        {
          id: 1,
          value: dataSet ? dataSet.FailedLUCount : 0,
          label: "Failed",
          color: "#F1244F",
        },
        { id: 2, value: usingLuCount, label: "Using", color: "#70278E" },
      ],
    },
  ];
  return (
    <Card sx={{ width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ textAlign: "center", margin: "10px" }}
        >
          Lu Status
        </Typography>
        <Box sx={{ marginLeft: "10px" }}>
          <IconButton onClick={handelFetch} color="primary">
            <LoopSharpIcon />
          </IconButton>
        </Box>
        <PieChart series={chartSeries} width={400} height={200} />
      </Box>
    </Card>
  );
}
