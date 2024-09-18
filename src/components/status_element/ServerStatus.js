import { Box, Card, IconButton, Typography } from "@mui/material";
import React from "react";
import MyProgressChart from "../chart/MyProgressChart";
import {
  BackupTableSharp,
  RotateRightSharp,
  SaveAltSharp,
} from "@mui/icons-material";

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
    <Card sx={{ width: "100%" }}>
      <Box sx={{ width: "100%" }}>
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
        <MyProgressChart value={cpuUsage} labelName="Cpu Usage" />
        <MyProgressChart value={memoryUsage} labelName="Memory Usage" />
        <MyProgressChart value={diskSpace} labelName="Disk Usage" />
      </Box>
    </Card>
  );
}
