import MainArea from "./components/main_area/MainArea";
import DrawerMenu from "./components/drawer_menu/DrawerMenu";
import TransactionChart from "./components/chart/TransactionChart";
import MyPieChart from "./components/chart/MyPieChart";
import { useEffect, useState } from "react";
import { Alert, LinearProgress, Snackbar } from "@mui/material";
import ResponseTimeChart from "./components/chart/ResponseTimeChart";
import ApiLoading from "./components/progress/ApiLoading";
import ServerStatus from "./components/status_element/ServerStatus";
import { loadConfig } from "./services/configService";
import {
  sendBackupDbRequest,
  sendDanaStatusRequest,
  sendGateStatusRequest,
  sendHostTransactionRequest,
  sendLuStatusRequest,
  sendPingStatusRequest,
  sendPortStatusRequest,
  sendResponseTimesRequest,
  sendCloseGateRequest,
  sendBackupLogFileRequest,
  sendAddLuPackRequest,
  sendOpenGateRequest,
  sendReconnectLuRequest,
  sendRotateTableRequest,
} from "./services/apiService";
import StatusStepper from "./components/stepper/StatusStepper";
import {
  getTokenFromCookie,
  getTokenFromSessionStorage,
} from "./services/tokenService";
import Login from "./Login";

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

  const [token, setToken] = useState(null);
  const [activeSteps, setActiveSteps] = useState(0);
  const [portStatus, setPortStatus] = useState(false);
  const [pingStatus, setPingStatus] = useState(false);
  const [gateStatus, setGateStatus] = useState(false);
  const [luStatus, setLuStatus] = useState({
    AllLUCount: 0,
    FailedLUCount: 0,
    AvailableLUCount: 0,
  });
  const [responseTimes, setResponseTimes] = useState([]);
  const [transactions, setTransactions] = useState([]);
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
    const getToken = async () => {
      const tmpToken = await getTokenFromSessionStorage();
      if (apiUrl) setToken(tmpToken);
    };
    getToken();
  }, [apiUrl]);

  useEffect(() => {
    const fetchApiAllEndPoints = async () => {
      if (token) {
        await getAllEndpointsData(true);
      }
    };
    fetchApiAllEndPoints();
  }, [token]);

  useEffect(() => {
    if (playing)
      timer = setInterval(() => {
        getAllEndpointsData();
      }, 30000);
    else clearTimeout(timer);
  }, [playing]);

  const getAllEndpointsData = async (firstUse = false) => {
    if (!firstUse) setApiProgress(15);
    setApiStatus(false);

    let data = await sendDanaStatusRequest(`${apiUrl}/GetDanaStatus`, token);
    if (data) {
      setDanaStatus(data);
      const appTitle = danaStatus.BankName + "-" + danaStatus.GateWayName;
      document.title = "Dana Monitor -" + appTitle;
    } else document.title = "Dana Monitor - Disconnected";

    if (!firstUse) setApiProgress(25);
    data = await sendLuStatusRequest(`${apiUrl}/GetLuStatus`, token);
    if (data) setLuStatus(data);

    if (!firstUse) setApiProgress(35);
    data = await sendPingStatusRequest(`${apiUrl}/GetPingStatus`, token);
    if (data) setPingStatus(data);
    if (pingStatus) setActiveSteps(1);
    else setActiveSteps(0);

    if (!firstUse) setApiProgress(55);
    data = await sendPortStatusRequest(`${apiUrl}/GetPortStatus`, token);
    if (data) setPortStatus(data);
    if (portStatus) setActiveSteps(2);
    else setActiveSteps(1);

    if (!firstUse) setApiProgress(65);
    data = await sendGateStatusRequest(`${apiUrl}/GetGateStatus`, token);
    if (data) setGateStatus(data);
    if (gateStatus) setActiveSteps(4);
    else setActiveSteps(3);

    if (!firstUse) setApiProgress(85);
    data = await sendResponseTimesRequest(`${apiUrl}/GetResponseTimes`, token);
    if (data) setResponseTimes(data);
    console.log(responseTimes);

    if (!firstUse) setApiProgress(100);
    data = await sendHostTransactionRequest(
      `${apiUrl}/GetHostTransactions`,
      token
    );
    if (data) setTransactions(data);
    console.log(transactions);

    setApiProgress(0);
    setApiStatus(true);

    if (!firstUse)
      setApiSnackState({
        showSnack: true,
        message: "Getting information from API successfully compeleted",
        result: true,
      });
  };

  async function handleRefreshTransactions() {
    setApiProgress(45);
    setApiStatus(false);
    const data = await sendHostTransactionRequest(
      `${apiUrl}/GetHostTransactions`,
      token
    );
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
    const data = await sendResponseTimesRequest(
      `${apiUrl}/GetResponseTimes`,
      token
    );
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
    const data = await sendLuStatusRequest(`${apiUrl}/GetLuStatus`, token);
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
    const data = await sendDanaStatusRequest(`${apiUrl}/GetDanaStatus`, token);
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
    const data = await sendPortStatusRequest(`${apiUrl}/GetPortStatus`, token);
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
    //const data = await loadApiData(apiUrl, "GetGateStatus");
    const data = await sendGateStatusRequest(`${apiUrl}/GetGateStatus`, token);
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
    const data = await sendPingStatusRequest(`${apiUrl}/GetPingStatus`, token);
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
    const data = await sendAddLuPackRequest(`${apiUrl}/GetLuPack`, token);
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
    const data = await sendCloseGateRequest(`${apiUrl}/CloseGate`, token);
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
    const data = await sendOpenGateRequest(`${apiUrl}/OpenGate`, token);
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
    const data = await sendReconnectLuRequest(`${apiUrl}/ReconnectLu`, token);
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
    const data = await sendBackupDbRequest(`${apiUrl}/BackupDb`, token);
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
    const data = await sendRotateTableRequest(`${apiUrl}/RotateTable`, token);
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
    const data = await sendBackupLogFileRequest(
      `${apiUrl}/BackupLogFile`,
      token
    );
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
  if (!token) return <Login setToken={setToken} apiAddress={apiUrl} />;
  else
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
                marginBottom: "5px",
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
          <div style={{ marginBottom: "10px" }}>
            <StatusStepper activeStep={activeSteps} />
          </div>
          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "65%",
                marginRight: "10px",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <TransactionChart
                  dataSet={transactions}
                  handelFetch={(e) => handleRefreshTransactions()}
                  handlePlaying={() => handelPlaying(!playing)}
                  isPlaying={playing}
                  chartLable={"Host"}
                  fetchIsActive={!apiStatus}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <ResponseTimeChart
                  dataSet={responseTimes}
                  handleFetch={(e) => handleRefreshHostResponseTimes()}
                  fetchIsActive={!apiStatus}
                />
              </div>
            </div>
            <div
              style={{
                width: "35%",
                marginLeft: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <MyPieChart
                  dataSet={luStatus}
                  handleFetch={(e) => handleRefreshLuStatus()}
                  fetchIsActive={!apiStatus}
                  handleGetLuPack={(e) => handleAddNewLuPack()}
                  handleReconnectLUs={(e) => handleReconnectLUs()}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
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
              {/* <div style={{ marginTop: "7px" }}>
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
            </div> */}
            </div>
          </div>
        </DrawerMenu>
        <Snackbar
          autoHideDuration={6000}
          open={apiSnackState.showSnack}
          onClose={handleCloseSnack}
        >
          <Alert
            severity={apiSnackState.result ? "success" : "error"}
            variant="filled"
            onClose={handleCloseSnack}
          >
            {apiSnackState.message}
          </Alert>
        </Snackbar>
        {apiStatus === false && apiProgress === 0 ? (
          <ApiLoading progress={apiProgress} />
        ) : (
          <></>
        )}
      </MainArea>
    );
}

export default App;
