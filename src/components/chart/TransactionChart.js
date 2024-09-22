import * as React from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { Card, IconButton, Typography } from "@mui/material";
import PlayCircleOutlineSharpIcon from "@mui/icons-material/PlayCircleOutlineSharp";
import PauseCircleOutlineSharpIcon from "@mui/icons-material/PauseCircleOutlineSharp";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";

export default function TransactionChart({
  dataSet,
  handelFetch,
  fetchIsActive,
  chartLable,
  handlePlaying,
  isPlaying,
}) {
  const chartSeries = [
    {
      baseline: "max",
      dataKey: `to${chartLable}`,
      label: `To ${chartLable}`,
      color: "#52be80",
      showMark: false,
      curve: "catmullRom",
    },
    {
      baseline: "max",
      dataKey: `from${chartLable}`,
      label: `From ${chartLable}`,
      color: "#e74c3c",
      showMark: false,
      curve: "catmullRom",
    },
  ];

  return (
    <Card sx={{ width: "100%", display: "inline-flex" }}>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            backgroundColor: "aliceblue",
          }}
        >
          {chartLable} Transaction Status
        </Typography>
        <Box sx={{ marginLeft: "10px" }}>
          <IconButton
            onClick={handelFetch}
            color="primary"
            disabled={fetchIsActive}
            title="Refresh"
          >
            <LoopSharpIcon />
          </IconButton>
          <IconButton
            onClick={handlePlaying}
            color="primary"
            title="Auto Refresh|Pause"
          >
            {isPlaying ? (
              <PauseCircleOutlineSharpIcon />
            ) : (
              <PlayCircleOutlineSharpIcon />
            )}
          </IconButton>
        </Box>
        <LineChart
          series={chartSeries}
          dataset={dataSet ? dataSet : []}
          xAxis={[
            {
              tickInterval: (value, index) =>
                value.toString().substring(3) === "00" ? true : false,
              scaleType: "point",
              dataKey: "time",
            },
          ]}
          height={240}
          margin={{ left: 55, right: 30 }}
        ></LineChart>
      </Box>
    </Card>
  );
}
