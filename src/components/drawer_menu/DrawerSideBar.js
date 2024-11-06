import React from "react";
import MuiDrawer from "@mui/material/Drawer";
import { IconButton, Divider, List } from "@mui/material";
import SideMenuItem from "./SideMenuItem";
import { styled, useTheme } from "@mui/material/styles";
import { UserConfirmDialogModel } from "../../models";
import UserConfirmDialog from "../dialog/UserConfirmDialog";
import {
  CableOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  ElectricalServices,
  EmojiObjectsOutlined,
  Logout,
  NetworkPing,
  RestartAltOutlined,
  Settings,
  StopCircleOutlined,
  TipsAndUpdatesOutlined,
  WbIncandescentOutlined,
} from "@mui/icons-material";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function DrawerSideBar({
  DrawerHeader,
  open,
  setOpen,
  handleCloseDanaGate,
  handleOpenDanaGate,
  handleRefreshPingStatus,
  handleRefreshPortStatus,
  handleRefreshGateStatus,
  handleRefreshDanaStatus,
  handelSignOut,
}) {
  const theme = useTheme();
  const [dialogState, setDialogState] = React.useState(
    new UserConfirmDialogModel()
  );
  const openDialog = (messageTitle, content, onConfirm) => {
    setDialogState({
      isOpen: true,
      messageTitle: messageTitle,
      content: content,
      onConfirm: onConfirm,
    });
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleConfirmUserDialog = () => {
    if (dialogState.onConfirm) {
      dialogState.onConfirm();
    }
    setDialogState({ ...dialogState, isOpen: false });
  };
  const handleCancelUserDialog = () => {
    setDialogState({ ...dialogState, isOpen: false });
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightOutlined />
          ) : (
            <ChevronLeftOutlined />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <SideMenuItem
          itemLabel="Settings"
          itemOpenStatus={open}
          itemIcon={<Settings />}
        />
        <SideMenuItem
          clickFunction={() =>
            openDialog(
              "Restart Dana Warning",
              "Are you sure you want restart Dana service?",
              () => console.log("Restart Operation accepted")
            )
          }
          itemLabel="Restart Dana"
          itemOpenStatus={open}
          itemIcon={<RestartAltOutlined />}
        />
        <SideMenuItem
          clickFunction={() =>
            openDialog(
              "Stop Dana Warning",
              "Are you sure you want stop Dana service?",
              () => console.log("Stop Dana operation accepted")
            )
          }
          itemLabel="Stop Dana"
          itemOpenStatus={open}
          itemIcon={<StopCircleOutlined />}
        />
      </List>
      <Divider />
      <List>
        <SideMenuItem
          itemLabel="Dana Status"
          itemOpenStatus={open}
          itemIcon={<CableOutlined />}
          clickFunction={handleRefreshDanaStatus}
        />
        <SideMenuItem
          itemLabel="Gate Status"
          itemOpenStatus={open}
          itemIcon={<TipsAndUpdatesOutlined />}
          clickFunction={handleRefreshGateStatus}
        />
        <SideMenuItem
          itemLabel="Ping Host"
          itemOpenStatus={open}
          itemIcon={<NetworkPing />}
          clickFunction={handleRefreshPingStatus}
        />
        <SideMenuItem
          itemLabel="Telnet Host"
          itemOpenStatus={open}
          itemIcon={<ElectricalServices />}
          clickFunction={handleRefreshPortStatus}
        />
        <SideMenuItem
          itemLabel="Close Gate"
          itemOpenStatus={open}
          itemIcon={<EmojiObjectsOutlined />}
          clickFunction={() =>
            openDialog(
              "Close Dana Gate Warning",
              "All the transactions will be failed, Are you sure you want close the Host gate?",
              () => handleCloseDanaGate()
            )
          }
        />
        <SideMenuItem
          itemLabel="Open Gate"
          itemOpenStatus={open}
          itemIcon={<WbIncandescentOutlined />}
          clickFunction={handleOpenDanaGate}
        />
        <Divider />
        <SideMenuItem
          itemLabel="Signout"
          itemOpenStatus={open}
          itemIcon={<Logout />}
          clickFunction={() =>
            openDialog("Signout", "Are you sure you want logout?", () =>
              handelSignOut()
            )
          }
        />
        <UserConfirmDialog
          isDialogOpen={dialogState.isOpen}
          onConfirm={handleConfirmUserDialog}
          handleClose={handleCancelUserDialog}
          dialogTitle={dialogState.messageTitle}
          dialogContentText={dialogState.content}
        />
      </List>
    </Drawer>
  );
}
