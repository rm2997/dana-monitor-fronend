import * as React from "react";
import Box from "@mui/material/Box";
import DrawerHeaderBar from "./DrawerHeaderBar";
import { CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";
import DrawerSideBar from "./DrawerSideBar";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
export default function DrawerMenu({
  // children,
  DanaName,
  user,
  handleCloseDanaGate,
  handleOpenDanaGate,
  handleRefreshPingStatus,
  handleRefreshPortStatus,
  handleRefreshGateStatus,
  handleRefreshDanaStatus,
  handelSignOut,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ display: "flex", backgroundColor: "rbga(255,255,255,0)" }}>
      <CssBaseline />
      <DrawerHeaderBar
        open={open}
        setOpen={setOpen}
        title={`Dana Monitor - ${DanaName}`}
        userName={user}
      />
      <Box component="main" sx={{ marginBottom: "15px", marginRight: "15px" }}>
        <DrawerHeader />
        <DrawerSideBar
          DrawerHeader={DrawerHeader}
          open={open}
          setOpen={setOpen}
          handleCloseDanaGate={handleCloseDanaGate}
          handleOpenDanaGate={handleOpenDanaGate}
          handleRefreshPingStatus={handleRefreshPingStatus}
          handleRefreshPortStatus={handleRefreshPortStatus}
          handleRefreshGateStatus={handleRefreshGateStatus}
          handleRefreshDanaStatus={handleRefreshDanaStatus}
          handelSignOut={handelSignOut}
        />
        {/* <div>
          {children.map((child) => (
            <div>{child}</div>
          ))}
        </div> */}
      </Box>
    </Box>
  );
}
