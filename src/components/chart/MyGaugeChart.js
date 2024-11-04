import { Typography } from "@mui/material";
import React from "react";
import GaugeChart from "react-gauge-chart";

export default function MyGaugeChart({ value, lable }) {
  return (
    <div
      style={{
        width: "30%",
        height: "200px",
        alignContent: "center",
        margin: "auto 5px",
      }}
    >
      <GaugeChart
        id={lable}
        percent={value / 100}
        nrOfLevels={20}
        textColor="red"
        animate={false}
      />
      <Typography
        variant="body2"
        color="text.primary"
        textAlign="center"
        sx={{ margin: "5px" }}
      >{`${lable} ${Math.round(value)}%`}</Typography>
    </div>
  );
}
