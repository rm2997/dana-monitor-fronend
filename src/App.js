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
  const [apiStatus, setApiStatus] = useState(false);
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
  const [transactions, setTransactions] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    const getApiInfo = async () => {
      let data = await loadApiData("GetDanaStatus");
      if (data) setDanaStatus(data);

      data = await loadApiData("GetLuStatus");
      if (data) setLuStatus(data);

      data = await loadApiData("GetPortStatus");
      if (data) setPortStatus(data);

      data = await loadApiData("GetPingStatus");
      if (data) setPingStatus(data);

      data = await loadApiData("GetGateStatus");
      if (data) setGateStatus(data);

      data = await loadApiData("GetResponseTimes");
      if (data) setResponseTimes(data);
      data = await loadApiData("GetHostTransactions");
      if (data) setTransactions(data);
      setApiStatus(true);
    };
    getApiInfo();
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

  const loadApiData = async (apiSubject) => {
    try {
      setApiStatus(false);
      if (apiUrl === "") {
        console.log("API Address is not loaded yet!");
        return;
      }
      console.log(`Sending request to API: ${apiUrl}/${apiSubject}`);
      const response = await fetch(`${apiUrl}/${apiSubject}`);
      if (!response.ok) {
        console.log("Failed to load API data!");
        return;
      }
      const result = await response.json();

      const retval = await parseReceivedData(result, apiSubject).then(
        (data) => data
      );

      return retval;
    } catch (err) {
      console.log(`Failed to load API data: ${err}`);
    }
  };

  const parseReceivedData = async (data, apiSubject) => {
    try {
      if (!data) return null;
      const parsedData = JSON.parse(data);
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
      } = parsedData.Data;

      switch (apiSubject) {
        case "GetDanaStatus":
          const tmpDanaStatus = { ...danaStatus };
          if (GateWayName) tmpDanaStatus.GateWayName = GateWayName;
          if (BankName) tmpDanaStatus.BankName = BankName;
          if (HostIP) tmpDanaStatus.HostIP = HostIP;
          if (ThreadCount) tmpDanaStatus.ThreadCount = ThreadCount;
          if (DiskSpace) tmpDanaStatus.DiskSpace = DiskSpace;
          if (CpuUsage) tmpDanaStatus.CpuUsage = CpuUsage;
          if (MemoryUsage) tmpDanaStatus.MemoryUsage = MemoryUsage;
          return { ...tmpDanaStatus };
        case "GetLuStatus":
          const tmpLuStatus = { ...luStatus };
          if (AllLUCount) tmpLuStatus.AllLUCount = AllLUCount;
          if (FailedLUCount) tmpLuStatus.FailedLUCount = FailedLUCount;
          if (AvailableLUCount) tmpLuStatus.AvailableLUCount = AvailableLUCount;
          return { ...tmpLuStatus };
        case "GetPingStatus":
          if (PingStatus) return PingStatus; //setPingStatus(PingStatus);
          break;
        case "GetGateStatus":
          if (GateStatus) return GateStatus; //setGateStatus(GateStatus);
          break;
        case "GetPortStatus":
          if (PortStatus) return PortStatus; //setPortStatus(PortStatus);
          break;
        case "GetResponseTimes":
          if (parsedData.Data) return JSON.parse(parsedData.Data);
        case "GetHostTransactions":
          if (parsedData.Data) return JSON.parse(parsedData.Data);
        default:
          break;
      }
    } catch (err) {
      console.log(`Error in message parser: ${err} , ${data}`);
      return null;
    }
  };

  async function handleRefreshTransactions() {
    const data = await loadApiData("GetHostTransactions");
    if (data) {
      setTransactions(data);
      setApiStatus(true);
    }
  }

  async function handleRefreshHostResponseTimes() {
    const data = await loadApiData("GetResponseTimes");
    if (data) {
      setResponseTimes(data);
      setApiStatus(true);
    }
  }
  async function handleRefreshLuStatus() {
    const data = await loadApiData("GetLuStatus");
    if (data) {
      setLuStatus(data);
      setApiStatus(true);
    }
  }
  async function handleRefreshDanaStatus() {
    const data = await loadApiData("GetDanaStatus");
    if (data) {
      setDanaStatus(data);
      setApiStatus(true);
    }
  }
  async function handleRefreshPortStatus() {
    const data = await loadApiData("GetPortStatus");
    if (data) {
      setPortStatus(data);
      setApiStatus(true);
    }
  }
  async function handleRefreshGateStatus() {
    const data = await loadApiData("GetGateStatus");
    if (data) {
      setGateStatus(data);
      setApiStatus(true);
    }
  }
  async function handleRefreshPingStatus() {
    const data = await loadApiData("GetPingStatus");
    if (data) {
      setPingStatus(data);
      setApiStatus(true);
    }
  }

  function handelPlaying(newPlaying) {
    setPlaying(newPlaying);
  }
  return (
    <MainArea>
      <DrawerMenu
        DanaName={
          danaStatus.BankName + danaStatus.GateWayName !== ""
            ? danaStatus.BankName + "-" + danaStatus.GateWayName
            : "Disconnected"
        }
      >
        <div style={{ margin: "5px", display: "flex", flexDirection: "row" }}>
          <div style={{ width: "70%", margin: "5px" }}>
            <TransactionChart
              dataSet={transactions}
              handelFetch={(e) => handleRefreshTransactions()}
              handlePlaying={() => handelPlaying(!playing)}
              isPlaying={playing}
              chartLable={"Host"}
            />
          </div>
          <div style={{ width: "30%", margin: "5px" }}>
            <ResponseTimeChart
              dataSet={responseTimes}
              handleFetch={(e) => handleRefreshHostResponseTimes()}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "35%", margin: "8px" }}>
            <MyPieChart
              dataSet={luStatus}
              handelFetch={(e) => handleRefreshLuStatus()}
            />
          </div>
          <Card style={{ width: "25%", margin: "5px" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "center", margin: "1px" }}
            >
              Overall Status
            </Typography>
            <StatusElement
              label={"Gate Status"}
              value={gateStatus}
              handleFetch={(e) => handleRefreshGateStatus()}
            />
            <StatusElement
              label={"Host Ping"}
              value={pingStatus}
              handleFetch={(e) => handleRefreshPingStatus()}
            />
            <StatusElement
              label={"Host Telnet"}
              value={portStatus}
              handleFetch={(e) => handleRefreshPortStatus()}
            />
            <StatusElement
              label={`Thread Count: ${danaStatus.ThreadCount}`}
              value={danaStatus.ThreadCount}
              handleFetch={(e) => handleRefreshDanaStatus()}
            />
          </Card>
          <Card
            style={{
              width: "40%",
              marginBottom: "6px",
              marginTop: "5px",
              marginLeft: "5px",
            }}
          >
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
      {apiStatus ? <></> : <FirstLoading />}
    </MainArea>
  );
}

export default App;
