import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";

export default function SideMenuItem({
  itemLabel,
  clickFunction,
  itemIcon,
  itemOpenStatus,
}) {
  return (
    <ListItem
      key={itemLabel}
      disablePadding
      sx={{ display: "block" }}
      onClick={clickFunction}
      title={itemLabel}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: itemOpenStatus ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: itemOpenStatus ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {itemIcon}
        </ListItemIcon>
        <ListItemText
          primary={itemLabel}
          sx={{ opacity: itemOpenStatus ? 1 : 0 }}
        />
      </ListItemButton>
    </ListItem>
  );
}
