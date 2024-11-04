import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {
  Toolbar,
  CssBaseline,
  IconButton,
  Divider,
  Typography,
  List,
  MenuItem,
} from "@mui/material";
import {
  Cable,
  DoNotDisturbOn,
  ElectricalServices,
  Fence,
  LockOpen,
  Logout,
  NetworkPing,
  Settings,
  Traffic,
} from "@mui/icons-material";
import SideMenuItem from "./SideMenuItem";
import { UserConfirmDialogModel } from "../../models";
import UserConfirmDialog from "../dialog/UserConfirmDialog";

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

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

export default function DrawerMenu({
  children,
  DanaName,
  handleCloseDanaGate,
  handleOpenDanaGate,
  handleRefreshPingStatus,
  handleRefreshPortStatus,
  handleRefreshGateStatus,
  handleRefreshDanaStatus,
  handelSignOut,
  user,
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [dialogState, setDialogState] = React.useState(
    new UserConfirmDialogModel()
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const openDialog = (messageTitle, content, onConfirm) => {
    setDialogState({
      isOpen: true,
      messageTitle: messageTitle,
      content: content,
      onConfirm: onConfirm,
    });
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img
              src="/Dana_logo.png"
              style={{ width: "30px", height: "30px" }}
            ></img>
            Dana Monitor - {DanaName}
          </Typography>
          <MenuItem onClick={(e) => console.log("hi")}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <AccountCircle />
            </IconButton>
            <p>{user}</p>
          </MenuItem>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
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
            itemIcon={<RestartAltIcon />}
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
            itemIcon={<DoNotDisturbOn />}
          />
        </List>
        <Divider />
        <List>
          <SideMenuItem
            itemLabel="Dana Status"
            itemOpenStatus={open}
            itemIcon={<Cable />}
            clickFunction={handleRefreshDanaStatus}
          />
          <SideMenuItem
            itemLabel="Gate Status"
            itemOpenStatus={open}
            itemIcon={<Fence />}
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
            itemIcon={<Traffic />}
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
            itemIcon={<LockOpen />}
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
        </List>
      </Drawer>
      <Box component="main" sx={{ height: "100vh", flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div>
          {children.map((child) => (
            <div>{child}</div>
          ))}
        </div>
      </Box>
      <UserConfirmDialog
        isDialogOpen={dialogState.isOpen}
        onConfirm={handleConfirmUserDialog}
        handleClose={handleCancelUserDialog}
        dialogTitle={dialogState.messageTitle}
        dialogContentText={dialogState.content}
      />
    </Box>
  );
}
