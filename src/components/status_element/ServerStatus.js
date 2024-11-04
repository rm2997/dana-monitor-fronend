import { Box, Card, IconButton, Typography } from "@mui/material";
import React from "react";
import {
  BackupTableSharp,
  RotateRightSharp,
  SaveAltSharp,
} from "@mui/icons-material";
import MyGaugeChart from "../chart/MyGaugeChart";

export default function ServerStatus({
  cpuUsage,
  diskSpace,
  memoryUsage,
  fetchIsActive,
  handleRotateTable,
  handleBackupLogs,
  handleBackupDb,
}) {
  return (
    <Card>
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          backgroundColor: "aliceblue",
          marginBottom: 1,
        }}
      >
        Server Status
      </Typography>
      <Box>
        <IconButton
          color={"primary"}
          title="Backup transaction table"
          disabled={fetchIsActive}
          onClick={handleRotateTable}
        >
          <BackupTableSharp />
        </IconButton>
        <IconButton
          color={"primary"}
          title="Backup log files"
          disabled={fetchIsActive}
          onClick={handleBackupLogs}
        >
          <RotateRightSharp />
        </IconButton>
        <IconButton
          color={"primary"}
          title="Backup Database"
          disabled={fetchIsActive}
          onClick={handleBackupDb}
        >
          <SaveAltSharp />
        </IconButton>
      </Box>
      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <MyGaugeChart value={cpuUsage} lable="Cpu usage" />
        <MyGaugeChart value={memoryUsage} lable="Memory usage" />
        <MyGaugeChart value={diskSpace} lable="Disk space" />
      </div>
    </Card>
  );
}
