import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Card, Box, Typography, IconButton } from "@mui/material";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";
import {
  AddCircleOutline,
  PublishedWithChangesOutlined,
} from "@mui/icons-material";

export default function MyPieChart({
  dataSet,
  handleFetch,
  fetchIsActive,
  handleGetLuPack,
  handleReconnectLUs,
}) {
  const usingLuCount = dataSet
    ? dataSet.AllLUCount - (dataSet.AvailableLUCount + dataSet.FailedLUCount)
    : 0;
  const chartSeries = [
    {
      highlightScope: { highlight: "item", fade: "global" },
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
          sx={{
            textAlign: "center",
            backgroundColor: "aliceblue",
            marginBottom: -1,
          }}
        >
          Lu Status
        </Typography>
        <Box sx={{ marginLeft: 1, marginTop: 1 }}>
          <IconButton
            onClick={handleFetch}
            color="primary"
            disabled={fetchIsActive}
            title="Refresh"
          >
            <LoopSharpIcon />
          </IconButton>
          <IconButton
            onClick={handleGetLuPack}
            color="primary"
            disabled={fetchIsActive}
            title="Add LU Pack"
          >
            <AddCircleOutline />
          </IconButton>
          <IconButton
            color="primary"
            disabled={fetchIsActive}
            onClick={handleReconnectLUs}
            title="Reconnect failed Lu(s)"
          >
            <PublishedWithChangesOutlined />
          </IconButton>
        </Box>
        <PieChart
          series={chartSeries}
          width={400}
          height={200}
          sx={{ marginBottom: 1 }}
        />
      </Box>
    </Card>
  );
}
