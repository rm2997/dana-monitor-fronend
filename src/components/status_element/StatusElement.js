import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { Box } from "@mui/material";

export default function StatusElement({
  label,
  value,
  handleFetch,
  fetchIsActive,
  title,
}) {
  return (
    <Box sx={{ margin: "1px auto", color: value ? "green" : "red" }}>
      <Checkbox
        onClick={handleFetch}
        readOnly
        color={value ? "success" : "error"}
        size="large"
        checked={value}
        label={label}
        icon={value ? <CheckOutlinedIcon /> : <CloseOutlinedIcon />}
        checkedIcon={<CheckOutlinedIcon />}
        disabled={fetchIsActive}
        title={title}
      />
      {label}
    </Box>
  );
}
