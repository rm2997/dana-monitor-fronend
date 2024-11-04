import * as React from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { Card, CircularProgress, IconButton, Typography } from "@mui/material";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";
import { Pause, PlayArrow } from "@mui/icons-material";

export default function TransactionChart({
  dataSet,
  handelFetch,
  fetchIsActive,
  chartLable,
  handlePlaying,
  isPlaying,
  timeProgress,
  setTimeProgress,
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

  React.useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        if (isPlaying) {
          if (timeProgress > 59) setTimeProgress(0);
          else setTimeProgress((timeProgress) => timeProgress + 1);
        } else {
          clearTimeout(timer);
          setTimeProgress(0);
        }
      }, 1000);
    } else {
      clearTimeout(timer);
      setTimeProgress(0);
    }

    return () => {
      setTimeProgress(0);
      clearTimeout(timer);
    };
  }, []);

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
            title="Auto refresh Start|Pause"
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
            {isPlaying && (
              <CircularProgress
                variant="determinate"
                color="warning"
                value={(timeProgress % 60) * (100 / 60)}
                size={30}
                sx={{
                  position: "absolute",
                  top: "12%",
                  left: "12%",
                  /*marginTop: -34,
                  marginLeft: -34,*/
                }}
              />
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
