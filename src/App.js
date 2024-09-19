import MainArea from "./components/main_area/MainArea";
import DrawerMenu from "./components/drawer_menu/DrawerMenu";
import TransactionChart from "./components/chart/TransactionChart";
import MyPieChart from "./components/chart/MyPieChart";
import { useEffect, useState } from "react";
import { Alert, Card, LinearProgress, Snackbar } from "@mui/material";
import ResponseTimeChart from "./components/chart/ResponseTimeChart";
import ApiLoading from "./components/progress/ApiLoading";
import OverallStatus from "./components/status_element/OverallStatus";
import ServerStatus from "./components/status_element/ServerStatus";
import { loadConfig } from "./services/configService";
import { loadApiData } from "./services/apiService";
import StatusStepper from "./components/stepper/StatusStepper";

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
  const [transactions, setTransactions] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [apiProgress, setApiProgress] = useState(0);
  const [apiStatus, setApiStatus] = useState(false);
  const [apiSnackState, setApiSnackState] = useState({
    showSnack: false,
    message: "init",
    result: false,
  });

  useEffect(() => {
    const loadConfigFromFile = async () => {
      const data = await loadConfig();
      setApiUrl(data);
    };
    loadConfigFromFile();
  }, []);

  useEffect(() => {
    getAllEndpointsData(true);
  }, [apiUrl]);

  useEffect(() => {
    if (playing)
      timer = setInterval(() => {
        getAllEndpointsData();
      }, 30000);
    else clearTimeout(timer);
  }, [playing, apiUrl]);

  const initDanaMonitor = async function () {
    setDanaStatus({
      GateWayName: "",
      BankName: "",
      HostIP: "",
      ThreadCount: 0,
      DiskSpace: 0,
      CpuUsage: 0,
      MemoryUsage: 0,
    });
    setPortStatus(false);
    setPingStatus(false);
    setGateStatus(false);
    setLuStatus({
      AllLUCount: 0,
      FailedLUCount: 0,
      AvailableLUCount: 0,
    });
    setApiProgress(0);
    setApiStatus(false);
  };
  const getAllEndpointsData = async (firstUse = false) => {
    if (!firstUse) setApiProgress(1);
    setApiStatus(false);

    let data = await loadApiData(apiUrl, "GetDanaStatus", danaStatus);
    if (data) setDanaStatus(data);

    if (!firstUse) setApiProgress(15);
    data = await loadApiData(apiUrl, "GetLuStatus", luStatus);
    if (data) setLuStatus(data);

    if (!firstUse) setApiProgress(30);
    data = await loadApiData(apiUrl, "GetPortStatus");
    if (data) setPortStatus(data);

    if (!firstUse) setApiProgress(35);
    data = await loadApiData(apiUrl, "GetPingStatus");
    if (data) setPingStatus(data);

    if (!firstUse) setApiProgress(45);
    data = await loadApiData(apiUrl, "GetGateStatus");
    if (data) setGateStatus(data);

    if (!firstUse) setApiProgress(60);
    data = await loadApiData(apiUrl, "GetResponseTimes");
    if (data) setResponseTimes(data);

    if (!firstUse) setApiProgress(100);
    data = await loadApiData(apiUrl, "GetHostTransactions");
    if (data) setTransactions(data);

    setApiProgress(0);
    setApiStatus(true);
    if (!firstUse)
      setApiSnackState({
        showSnack: true,
        message: "Getting information from API successfully compeleted",
      });
  };
  async function handleRefreshTransactions() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "GetHostTransactions");
    setApiProgress(75);
    if (data) {
      setTransactions(data);
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Dana transactions series successfully received.`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Can't get data from API`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleRefreshHostResponseTimes() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "GetResponseTimes");
    setApiProgress(75);
    if (data) {
      setResponseTimes(data);
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Response times series successfully received.`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Can't get data from API`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleRefreshLuStatus() {
    setApiProgress(30);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "GetLuStatus", luStatus);
    setApiProgress(85);
    if (data) {
      setLuStatus(data);
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Dana LU status successfully received`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Can't get data from API`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleRefreshDanaStatus() {
    setApiProgress(45);
    setApiStatus(false);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "GetDanaStatus", danaStatus);
    setApiProgress(65);
    if (data) {
      setDanaStatus(data);
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Dana overall status successfully received`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Can't get data from API`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleRefreshPortStatus() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "GetPortStatus");
    setApiProgress(85);
    if (data !== null && data !== undefined) {
      setPortStatus(data);
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Mainframe telnet status successfully received, port status: ${data}`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Can't get data from API`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleRefreshGateStatus() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "GetGateStatus");
    setApiProgress(75);
    if (data !== null && data !== undefined) {
      setGateStatus(data);
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Dana gate status successfully received, gate status: ${data}`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Can't get data from API`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleRefreshPingStatus() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "GetPingStatus");
    setApiProgress(75);
    if (data) {
      setPingStatus(data);
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Mainframe ping status successfully received, ping status: ${data}`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Can't get data from API`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleAddNewLuPack() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "GetLuPack");
    if (data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `${data} LU(s) successfully added to Dana.`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleCloseDanaGate() {
    setApiProgress(45);
    setApiStatus(false);

    const data = await loadApiData(apiUrl, "CloseGate");
    if (data) {
      setGateStatus(false);
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Dana open gate request successfully sent, Gate status: ${data}`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleOpenDanaGate() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "OpenGate");
    if (data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Dana close gate request successfully sent, Gate status: ${data}`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleReconnectLUs() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "ReconnectLu");
    if (data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Reconnect LU request successfully sent.`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleBackupDb() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "BackupDb");
    if (data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Get backup request successfully sent.`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleRotateTable() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "RotateTable");
    if (data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Get backup of transaction table request successfully sent.`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  async function handleBackupLogs() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await loadApiData(apiUrl, "BackupLogFile");
    if (data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Get backup of logfiles request successfully sent.`,
      });
    } else
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    setApiStatus(true);
    setApiProgress(100);
  }
  function handelPlaying(newPlaying) {
    setPlaying(newPlaying);
  }
  function handleCloseSnack() {
    setApiSnackState({ showSnack: false, message: "" });
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
        {apiProgress > 0 && apiStatus === false ? (
          <div
            style={{
              marginLeft: "10px",
              marginRight: "12px",
              marginBottom: "-10px",
            }}
          >
            <LinearProgress
              variant="determinate"
              color="success"
              value={apiProgress}
            />
          </div>
        ) : (
          <></>
        )}
        <div>
          <div style={{ margin: "5px", display: "flex", flexDirection: "row" }}>
            <div style={{ width: "70%", margin: "5px" }}>
              <TransactionChart
                dataSet={transactions}
                handelFetch={(e) => handleRefreshTransactions()}
                handlePlaying={() => handelPlaying(!playing)}
                isPlaying={playing}
                chartLable={"Host"}
                fetchIsActive={!apiStatus}
              />
            </div>
            <div style={{ width: "30%", margin: "5px" }}>
              <ResponseTimeChart
                dataSet={responseTimes}
                handleFetch={(e) => handleRefreshHostResponseTimes()}
                fetchIsActive={!apiStatus}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ width: "25%", margin: "8px" }}>
              <MyPieChart
                dataSet={luStatus}
                handleFetch={(e) => handleRefreshLuStatus()}
                fetchIsActive={!apiStatus}
                handleGetLuPack={(e) => handleAddNewLuPack()}
                handleReconnectLUs={(e) => handleReconnectLUs()}
              />
            </div>
            <div style={{ width: "20%", margin: "8px" }}>
              <OverallStatus
                portStatus={portStatus}
                gateStatus={gateStatus}
                pingStatus={pingStatus}
                threadCount={danaStatus.ThreadCount}
                handleRefreshPortStatus={handleRefreshPortStatus}
                handleRefreshGateStatus={handleRefreshGateStatus}
                handleRefreshPingStatus={handleRefreshPingStatus}
                handleRefreshDanaStatus={handleRefreshDanaStatus}
                fetchIsActive={!apiStatus}
                handleCloseDanaGate={handleCloseDanaGate}
                handleOpenDanaGate={handleOpenDanaGate}
              ></OverallStatus>
            </div>
            <div style={{ width: "30%", margin: "8px" }}>
              <ServerStatus
                handleBackupDb={handleBackupDb}
                handleBackupLogs={handleBackupLogs}
                handleRotateTable={handleRotateTable}
                fetchIsActive={!apiStatus}
                memoryUsage={danaStatus.MemoryUsage}
                cpuUsage={danaStatus.CpuUsage}
                diskSpace={danaStatus.DiskSpace}
              ></ServerStatus>
            </div>
            <div style={{ width: "25%", margin: "auto" }}>
              <StatusStepper />
            </div>
          </div>
          <div style={{ width: "90%", display: "block" }}>
            <Snackbar
              autoHideDuration={6000}
              open={apiSnackState.showSnack}
              onClose={handleCloseSnack}
            >
              <Alert
                severity={apiSnackState.result ? "success" : "error"}
                variant="filled"
                sx={{ width: "100%" }}
                onClose={handleCloseSnack}
              >
                {apiSnackState.message}
              </Alert>
            </Snackbar>
          </div>
        </div>
      </DrawerMenu>
      {apiStatus === false && apiProgress === 0 ? (
        <ApiLoading progress={apiProgress} />
      ) : (
        <></>
      )}
    </MainArea>
  );
}

export default App;
