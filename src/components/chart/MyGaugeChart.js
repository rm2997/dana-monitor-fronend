import { Typography } from "@mui/material";
import React from "react";
import GaugeComponent from "react-gauge-component";

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
      <GaugeComponent
        id={lable}
        type="semicircle"
        value={value}
        maxValue={100}
        pointer={{
          animate: true,
          elastic: true,
          type: "arrow",
          baseColor: "yellow",
          width: 15,
        }}
        arc={{
          gradient: true,
          padding: 0,
          width: 0.15,
          subArcs: [
            {
              limit: 25,
              color: "#5BE12C",
              showTick: false,
            },
            {
              limit: 50,
              color: "#F5CD19",
              showTick: true,
            },
            {
              limit: 75,
              color: "#F58B19",
              showTick: false,
            },
            {
              limit: 100,
              color: "#EA4228",
              showTick: true,
            },
          ],
        }}
      />
      <Typography
        variant="body2"
        color="text.primary"
        textAlign="center"
        sx={{ margin: "1px" }}
      >
        {lable}
      </Typography>
    </div>
  );
}
