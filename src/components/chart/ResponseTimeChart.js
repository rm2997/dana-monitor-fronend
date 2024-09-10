import * as React from "react";
import Box from "@mui/material/Box";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { LinePlot, MarkPlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsLegend, ChartsTooltip, ChartsYAxis } from "@mui/x-charts";
import { Card, IconButton, Typography } from "@mui/material";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";

export default function ResponseTimeChart({ dataSet, handleFetch }) {
  const chartSeries = [
    {
      type: "line",
      dataKey: "responseTime",
      label: "Response Time(ms)",
      color: "#F18E31",
    },
  ];
  return (
    <Card sx={{ width: "100%", display: "inline-flex" }}>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ textAlign: "center", margin: "10px auto" }}
        >
          Host Response Time
        </Typography>
        <Box sx={{ marginLeft: "10px" }}>
          <IconButton onClick={handleFetch} color="primary">
            <LoopSharpIcon />
          </IconButton>
        </Box>
        <ResponsiveChartContainer
          series={chartSeries}
          dataset={dataSet ? dataSet : []}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "time",
            },
          ]}
          height={410}
        >
          <ChartsLegend />
          <LinePlot />
          <MarkPlot />
          <ChartsTooltip />
          <ChartsXAxis label="Time" />
          <ChartsYAxis label="Response" />
        </ResponsiveChartContainer>
      </Box>
    </Card>
  );
}
