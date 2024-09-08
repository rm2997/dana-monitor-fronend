import MainArea from "./components/main_area/MainArea";
import DrawerMenu from "./components/drawer_menu/DrawerMenu";
import TransactionChart from "./components/chart/TransactionChart";
import MyPieChart from "./components/chart/MyPieChart";

import { useEffect, useState } from "react";
import MyProgressChart from "./components/chart/MyProgressChart";
import { Card, Typography } from "@mui/material";
import StatusElement from "./components/status_element/StatusElement";
import FirstLoading from "./components/progress/FirstLoading";
import ResponseTimeChart from "./components/chart/ResponseTimeChart";

let timer = null;
function App() {
  const [danaStatus, setDanaStatus] = useState(null);
  const [portStatus, setPortStatus] = useState(false);
  const [pingStatus, setPingStatus] = useState(false);
  const [gateStatus, setGateStatus] = useState(false);
  const [luStatus, setLuStatus] = useState(null);
  const [responseTimes, setResponseTimes] = useState(null);
  const [myChartData, setMyChartData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    loadApiData();
  }, [apiUrl]);

  useEffect(() => {
    if (playing)
      timer = setInterval(() => {
        setApiUrl(apiUrl);
      }, 30000);
    else clearTimeout(timer);
  }, [playing, apiUrl]);

  const loadConfig = async () => {
    try {
      const response = await fetch("/config.json");
      if (!response.ok) {
        throw new Error("Failed to fetch config file");
      }
      const data = await response.json();
      const environment = process.env.NODE_ENV || "development";
      setApiUrl(data[environment].REACT_APP_API_URL);
      console.log(
        `ApiUrl loaded successfully : ${data[environment].REACT_APP_API_URL}`
      );
    } catch (err) {
      console.log(`Error caught: ${err}`);
    }
  };

  const loadApiData = async () => {
    try {
      if (apiUrl === "") {
        console.log("API Address is not loaded yet!");
        return;
      }
      console.log(`Sending request to API: ${apiUrl}/GetDanaStatus`);
      const response = await fetch(`${apiUrl}/GetDanaStatus`);
      if (!response.ok) {
        console.log("Failed to load API data!");
        return;
      }
      const result = await response.json();

      setMyChartData(result);
      parseReceivedData(result);
    } catch (err) {
      console.log(`Failed to load API data: ${err}`);
    }
  };

  function parseReceivedData(data) {
    data.forEach((element) => {
      if (element) {
        const { PingStatus, GateStatus, PortStatus } = JSON.parse(element).Data;
        if (PingStatus) setPingStatus(PingStatus);
        if (GateStatus) setGateStatus(GateStatus);
        if (PortStatus) setPortStatus(PortStatus);
      }
    });
  }

  function handleRefresh() {
    loadApiData();
  }

  function handelPlaying(newPlaying) {
    setPlaying(newPlaying);
  }
  return (
    <MainArea>
      <DrawerMenu
        DanaName={
          danaStatus
            ? danaStatus.BankName + danaStatus.GateWayName
            : "Disconnected"
        }
      >
        <div style={{ margin: "5px", display: "flex", flexDirection: "row" }}>
          <div style={{ width: "70%", margin: "5px" }}>
            <TransactionChart
              dataSet={myChartData}
              handelFetch={(e) => handleRefresh()}
              handlePlaying={() => handelPlaying(!playing)}
              isPlaying={playing}
              chartLable={"Host"}
            />
          </div>
          <div style={{ width: "30%", margin: "5px" }}>
            <ResponseTimeChart dataSet={responseTimes ? responseTimes : []} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "35%", margin: "5px" }}>
            <MyPieChart dataSet={luStatus} />
          </div>
          <Card style={{ width: "25%", margin: "5px" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "center", margin: "1px" }}
            >
              Overall Status
            </Typography>
            <StatusElement label={"Gate Status"} value={gateStatus} />
            <StatusElement label={"Host Ping"} value={pingStatus} />
            <StatusElement label={"Host Telnet"} value={portStatus} />
            <StatusElement
              label={`Thread Count: ${danaStatus ? danaStatus.ThreadCount : 0}`}
              value={
                danaStatus ? (danaStatus.ThreadCount ? true : false) : false
              }
            />
          </Card>
          <Card style={{ width: "40%", margin: "10px" }}>
            <MyProgressChart
              value={danaStatus ? danaStatus.CpuUsage : 100}
              labelName="Cpu Usage"
            />
            <MyProgressChart
              value={danaStatus ? danaStatus.MemoryUsage : 100}
              labelName="Memory Usage"
            />
            <MyProgressChart
              value={danaStatus ? danaStatus.DiskSpace : 100}
              labelName="Disk Usage"
            />
          </Card>
        </div>
      </DrawerMenu>
      {!myChartData ? <FirstLoading /> : <></>}
    </MainArea>
  );
}

export default App;
