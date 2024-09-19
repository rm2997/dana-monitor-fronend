import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import StatusElement from "./StatusElement";
import { Lock, LockOpenRounded } from "@mui/icons-material";

export default function OverallStatus({
  pingStatus,
  gateStatus,
  portStatus,
  threadCount,
  handleRefreshGateStatus,
  handleRefreshPingStatus,
  handleRefreshPortStatus,
  handleRefreshDanaStatus,
  fetchIsActive,
  handleCloseDanaGate,
  handleOpenDanaGate,
}) {
  return (
    <Card sx={{ width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            backgroundColor: "aliceblue",
            marginBottom: 3,
          }}
        >
          Overall Status
        </Typography>

        <Stack direction={"row"} spacing={2}>
          <StatusElement
            label={"Gate Status"}
            value={gateStatus}
            handleFetch={(e) => handleRefreshGateStatus()}
            fetchIsActive={fetchIsActive}
            title="Press to check Dana gate status."
          />
          <IconButton
            size="large"
            title="Open Dana gate"
            color={"success"}
            onClick={handleOpenDanaGate}
            disabled={fetchIsActive || gateStatus}
          >
            <LockOpenRounded />
          </IconButton>
          <IconButton
            size="large"
            title="Close Dana gate!"
            color={"error"}
            onClick={handleCloseDanaGate}
            disabled={fetchIsActive || !gateStatus}
          >
            <Lock />
          </IconButton>
        </Stack>
        <StatusElement
          label={"Host Ping"}
          value={pingStatus}
          handleFetch={(e) => handleRefreshPingStatus()}
          fetchIsActive={fetchIsActive}
          title="Press to send ping request."
        />
        <StatusElement
          label={"Host Telnet"}
          value={portStatus}
          handleFetch={(e) => handleRefreshPortStatus()}
          fetchIsActive={fetchIsActive}
          title="Press to check host port."
        />
        <StatusElement
          label={`Thread Count: ${threadCount}`}
          value={threadCount}
          handleFetch={(e) => handleRefreshDanaStatus()}
          fetchIsActive={fetchIsActive}
          title="Press to check Dana server status."
        />
      </Box>
    </Card>
  );
}
