import MainArea from "./components/main_area/MainArea";
import DrawerMenu from "./components/drawer_menu/DrawerMenu";
import TransactionChart from "./components/chart/TransactionChart";
import MyPieChart from "./components/chart/MyPieChart";
import { useEffect, useState } from "react";
import { Alert, LinearProgress, Snackbar } from "@mui/material";
import ResponseTimeChart from "./components/chart/ResponseTimeChart";
import ApiLoading from "./components/progress/ApiLoading";
import ServerStatus from "./components/status_element/ServerStatus";
import {
  getTokenFromSessionStorage,
  removeTokenFromSessionStorage,
  loadConfig,
  sendApiRequest,
} from "./services";
import {
  UserModel,
  ApiSnackModel,
  LuStatusModel,
  DanaStatusModel,
} from "./models";
import StatusStepper from "./components/stepper/StatusStepper";
import Login from "./Login";

let timer = null;
function App() {
  const [danaStatus, setDanaStatus] = useState(new DanaStatusModel());

  const [user, setUser] = useState(new UserModel());
  const [activeSteps, setActiveSteps] = useState(0);
  const [portStatus, setPortStatus] = useState(false);
  const [pingStatus, setPingStatus] = useState(false);
  const [gateStatus, setGateStatus] = useState(false);
  const [luStatus, setLuStatus] = useState(new LuStatusModel());
  const [responseTimes, setResponseTimes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [apiProgress, setApiProgress] = useState(0);
  const [apiStatus, setApiStatus] = useState(false);
  const [apiSnackState, setApiSnackState] = useState(new ApiSnackModel());

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
      if (apiUrl && tmpToken) {
        setUser({ userName: tmpToken.userName, userToken: tmpToken.token });
      }
    };
    getToken();
  }, [apiUrl]);

  useEffect(() => {
    const fetchApiAllEndPoints = async () => {
      if (user.userToken) {
        await getAllEndpointsData(true);
      }
    };
    fetchApiAllEndPoints();
  }, [user]);

  useEffect(() => {
    if (playing)
      timer = setInterval(() => {
        getAllEndpointsData();
      }, 30000);
    else clearTimeout(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [playing]);

  const getDanaStatus = async () => {
    const resp = await sendApiRequest("sendDanaStatusRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
      return;
    }

    if (resp.data) {
      setDanaStatus(resp.data.Data);
      const appTitle = danaStatus.BankName + "-" + danaStatus.GateWayName;
      document.title = "Dana Monitor -" + appTitle;
    } else document.title = "Dana Monitor - Disconnected";
  };

  const getLuStatus = async () => {
    const resp = await sendApiRequest("sendLuStatusRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
      return;
    }
    if (resp.data) setLuStatus(resp.data.Data);
  };

  const getPingStatus = async () => {
    const resp = await sendApiRequest("sendPingStatusRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) {
      setPingStatus(resp.data.Data.PingStatus);
      setActiveSteps(1);
    } else {
      setPingStatus(false);
      setActiveSteps(0);
    }
  };

  const getPortStatus = async () => {
    const resp = await sendApiRequest("sendPortStatusRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) {
      setPortStatus(resp.data.Data.PortStatus);
      setActiveSteps(2);
    } else {
      setPortStatus(false);
      setActiveSteps(1);
    }
  };

  const getGateStatus = async () => {
    const resp = await sendApiRequest("sendGateStatusRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) {
      setGateStatus(resp.data.Data.GateStatus);
      setActiveSteps(4);
    } else {
      setGateStatus(false);
      setActiveSteps(3);
    }
  };

  const getResponseTimes = async () => {
    const resp = await sendApiRequest(
      "sendResponseTimesRequest",
      user.userToken
    );
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) setResponseTimes(JSON.parse(resp.data.Data));
  };

  const getTransactions = async () => {
    const resp = await sendApiRequest(
      "sendHostTransactionRequest",
      user.userToken
    );
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) setTransactions(JSON.parse(resp.data.Data));
  };

  const getAllEndpointsData = async (firstUse = false) => {
    if (!firstUse) setApiProgress(15);
    setApiStatus(false);
    await getDanaStatus();

    if (!firstUse) setApiProgress(25);
    await getLuStatus();

    if (!firstUse) setApiProgress(35);
    await getPingStatus();

    if (!firstUse) setApiProgress(45);
    await getPortStatus();

    if (!firstUse) setApiProgress(55);
    await getGateStatus();

    if (!firstUse) setApiProgress(85);
    await getResponseTimes();

    if (!firstUse) setApiProgress(100);
    await getTransactions();

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
    setApiProgress(20);
    setApiStatus(false);
    await getTransactions();
    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleRefreshHostResponseTimes() {
    setApiProgress(45);
    setApiStatus(false);
    await getResponseTimes();
    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleRefreshLuStatus() {
    setApiProgress(30);
    setApiStatus(false);
    await getLuStatus();
    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleRefreshDanaStatus() {
    setApiProgress(45);
    setApiStatus(false);
    await getDanaStatus();
    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleRefreshPortStatus() {
    setApiProgress(45);
    setApiStatus(false);
    await getPortStatus();
    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleRefreshGateStatus() {
    setApiProgress(45);
    setApiStatus(false);
    await getGateStatus();
    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleRefreshPingStatus() {
    setApiProgress(45);
    setApiStatus(false);
    await getPingStatus();
    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleAddNewLuPack() {
    setApiProgress(45);
    setApiStatus(false);
    const resp = await sendApiRequest("sendAddLuPackRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `${resp.data.Data.Lucount} LU(s) successfully added to Dana.`,
      });
    } else {
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    }
    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleCloseDanaGate() {
    setApiProgress(45);
    setApiStatus(false);
    const resp = await sendApiRequest("sendCloseGateRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Dana open gate request successfully sent, Gate status: ${resp.data.Data.Gate}`,
      });
    } else {
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    }

    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleOpenDanaGate() {
    setApiProgress(45);
    setApiStatus(false);

    const resp = await sendApiRequest("sendOpenGateRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Dana close gate request successfully sent, Gate status: ${resp.data.Data.Gate}`,
      });
    } else {
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    }
    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleReconnectLUs() {
    setApiProgress(45);
    setApiStatus(false);

    const resp = await sendApiRequest("sendReconnectLuRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Reconnect LU request successfully sent.`,
      });
    } else {
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    }

    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleBackupDb() {
    setApiProgress(45);
    setApiStatus(false);
    const resp = await sendApiRequest("sendBackupDbRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Get backup request successfully sent.`,
      });
    } else {
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    }
    setApiStatus(true);
    setApiProgress(100);
  }

  async function handleRotateTable() {
    setApiProgress(45);
    setApiStatus(false);

    const resp = await sendApiRequest("sendRotateTableRequest", user.userToken);
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Get backup of transaction table request successfully sent.`,
      });
    } else {
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    }
  }

  async function handleBackupLogs() {
    setApiProgress(45);
    setApiStatus(false);

    const resp = await sendApiRequest(
      "sendBackupLogFileRequest",
      user.userToken
    );
    if (resp.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${resp.error}`,
        result: false,
      });
    }
    if (resp.data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Get backup of logfiles request successfully sent.`,
      });
    } else {
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    }

    setApiStatus(true);
    setApiProgress(100);
  }

  function handelPlaying(newPlaying) {
    setPlaying(newPlaying);
  }

  function handleCloseSnack() {
    setApiSnackState({ ...apiSnackState, showSnack: false });
  }

  function handelSignOut() {
    removeTokenFromSessionStorage();
    document.location.reload();
  }

  if (!user.userToken) return <Login setUser={setUser} />;
  else
    return (
      <MainArea>
        <DrawerMenu
          user={user.userName}
          handleCloseDanaGate={() => handleCloseDanaGate()}
          handleOpenDanaGate={() => handleOpenDanaGate()}
          handleRefreshPingStatus={() => handleRefreshPingStatus()}
          handleRefreshPortStatus={() => handleRefreshPortStatus()}
          handleRefreshGateStatus={() => handleRefreshGateStatus()}
          handleRefreshDanaStatus={() => handleRefreshDanaStatus()}
          handelSignOut={() => handelSignOut()}
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
