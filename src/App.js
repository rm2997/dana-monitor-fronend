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
  const [danaStatus, setDanaStatus] = useState({
    GateWayName: "",
    BankName: "",
    HostIP: "",
    ThreadCount: 0,
    DiskSpace: 0,
    CpuUsage: 0,
    MemoryUsage: 0,
  });
  const [portStatus, setPortStatus] = useState(false);
  const [pingStatus, setPingStatus] = useState(false);
  const [gateStatus, setGateStatus] = useState(false);
  const [luStatus, setLuStatus] = useState({
    AllLUCount: 0,
    FailedLUCount: 0,
    AvailableLUCount: 0,
  });
  const [responseTimes, setResponseTimes] = useState(null);
  const [myChartData, setMyChartData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    console.log("from use Effect for dana status", danaStatus);
  }, [danaStatus]);

  useEffect(() => {
    console.log("from use Effect for lu status", luStatus);
  }, [luStatus]);

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

      //setMyChartData(result);
      parseReceivedData(result);
    } catch (err) {
      console.log(`Failed to load API data: ${err}`);
    }
  };

  function parseReceivedData(data) {
    try {
      data.forEach((element) => {
        if (element) {
          const {
            PingStatus,
            GateStatus,
            PortStatus,
            AllLUCount,
            FailedLUCount,
            AvailableLUCount,
            GateWayName,
            BankName,
            HostIP,
            ThreadCount,
            DiskSpace,
            CpuUsage,
            MemoryUsage,
          } = JSON.parse(element).Data;
          const tmpLuStatus = { ...luStatus };
          const tmpDanaStatus = { ...danaStatus };

          if (PingStatus) setPingStatus(PingStatus);
          if (GateStatus) setGateStatus(GateStatus);
          if (PortStatus) setPortStatus(PortStatus);

          if (AllLUCount) tmpLuStatus.AllLUCount = AllLUCount;
          if (FailedLUCount) tmpLuStatus.FailedLUCount = FailedLUCount;
          if (AvailableLUCount) tmpLuStatus.AvailableLUCount = AvailableLUCount;
          setLuStatus({ ...tmpLuStatus });

          if (GateWayName) tmpDanaStatus.GateWayName = GateWayName;
          if (BankName) tmpDanaStatus.BankName = BankName;
          if (HostIP) tmpDanaStatus.HostIP = HostIP;
          if (ThreadCount) tmpDanaStatus.ThreadCount = ThreadCount;
          if (DiskSpace) tmpDanaStatus.DiskSpace = DiskSpace;
          if (CpuUsage) tmpDanaStatus.CpuUsage = CpuUsage;
          if (MemoryUsage) tmpDanaStatus.MemoryUsage = MemoryUsage;
          setDanaStatus({ ...tmpDanaStatus });
        }
      });
    } catch (err) {
      console.log(`Error in message parser: ${err}`);
    }
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
          danaStatus.BankName + danaStatus.GateWayName !== ""
            ? danaStatus.BankName + danaStatus.GateWayName
            : "Disconnected"
        }
      >
        <div style={{ margin: "5px", display: "flex", flexDirection: "row" }}>
          <div style={{ width: "70%", margin: "5px" }}>
            <TransactionChart
              dataSet={!responseTimes ? responseTimes : []}
              handelFetch={(e) => handleRefresh()}
              handlePlaying={() => handelPlaying(!playing)}
              isPlaying={playing}
              chartLable={"Host"}
            />
          </div>
          <div style={{ width: "30%", margin: "5px" }}>
            <ResponseTimeChart dataSet={!responseTimes ? responseTimes : []} />
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
              label={`Thread Count: ${danaStatus.ThreadCount}`}
              value={danaStatus.ThreadCount}
            />
          </Card>
          <Card style={{ width: "40%", margin: "10px" }}>
            <MyProgressChart
              value={danaStatus.CpuUsage}
              labelName="Cpu Usage"
            />
            <MyProgressChart
              value={danaStatus.MemoryUsage}
              labelName="Memory Usage"
            />
            <MyProgressChart
              value={danaStatus.DiskSpace}
              labelName="Disk Usage"
            />
          </Card>
        </div>
      </DrawerMenu>
      {myChartData ? <></> : <FirstLoading />}
    </MainArea>
  );
}

export default App;
