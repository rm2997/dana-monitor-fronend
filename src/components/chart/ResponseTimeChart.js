import * as React from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { Card, IconButton, Typography } from "@mui/material";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";

export default function ResponseTimeChart({
  dataSet,
  handleFetch,
  fetchIsActive,
}) {
  const chartSeries = [
    {
      baseline: "max",
      scaleType: "time",
      dataKey: "ResponseTime",
      label: "Response Time(ms)",
      color: "#FF9100",
      showMark: false,
      curve: "catmullRom",
    },
  ];

  return (
    <Card sx={{ width: "100%", display: "inline-flex" }}>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          sx={{ textAlign: "center", backgroundColor: "aliceblue" }}
        >
          Host Response Time
        </Typography>
        <Box sx={{ marginLeft: "10px" }}>
          <IconButton
            onClick={handleFetch}
            color="primary"
            disabled={fetchIsActive}
            title="Refresh"
          >
            <LoopSharpIcon />
          </IconButton>
        </Box>
        <LineChart
          series={chartSeries}
          grid={{ horizontal: true }}
          backgroundColor={{ fill: "transparent" }}
          dataset={dataSet ? dataSet : []}
          xAxis={[
            {
              scaleType: "point",
              dataKey: "time",
              tickInterval: (value, index) =>
                value.toString().substring(3) === "00" ? true : false,
            },
          ]}
          height={220}
          margin={{ left: 60, right: 30 }}
        ></LineChart>
      </Box>
    </Card>
  );
}
