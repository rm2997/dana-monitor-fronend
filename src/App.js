import MainArea from "./components/main_area/MainArea";
import DrawerMenu from "./components/drawer_menu/DrawerMenu";
import TransactionChart from "./components/chart/TransactionChart";
import MyPieChart from "./components/chart/MyPieChart";
import { useEffect, useState } from "react";
import { Alert, Box, LinearProgress, Snackbar } from "@mui/material";
import ResponseTimeChart from "./components/chart/ResponseTimeChart";
import FullScreenLoading from "./components/progress/FullScreenLoading";
import ServerStatus from "./components/status_element/ServerStatus";
import {
  getTokenFromSessionStorage,
  removeTokenFromSessionStorage,
  loadConfig,
} from "./services";
import {
  UserModel,
  ApiSnackModel,
  LuStatusModel,
  DanaStatusModel,
} from "./models";
import StatusStepper from "./components/stepper/StatusStepper";
import Login from "./Login";
import { ApiMaps } from "./configs";
import useFetch from "./hooks/UseFetch";
import TopSideLoading from "./components/progress/TopSideLoading";
import CustomSnackbar from "./components/dialog/CustomSnackbar";

function App() {
  const [danaStatus, setDanaStatus] = useState(new DanaStatusModel());
  const [timeProgress, setTimeProgress] = useState(1);
  const [user, setUser] = useState(new UserModel());
  const [activeSteps, setActiveSteps] = useState(0);
  const [portStatus, setPortStatus] = useState(false);
  const [pingStatus, setPingStatus] = useState(false);
  const [gateStatus, setGateStatus] = useState(false);
  const [luStatus, setLuStatus] = useState(new LuStatusModel());
  const [responseTimes, setResponseTimes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [playing, setPlaying] = useState(true);
  const [apiUrl, setApiUrl] = useState("");
  const [apiProgress, setApiProgress] = useState(0);
  const [apiSnackState, setApiSnackState] = useState(new ApiSnackModel());
  const { loading, fetchData } = useFetch();

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
        setUser({ ...tmpToken });
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
    if (playing === false) setTimeProgress(0);

    if (timeProgress > 59) {
      getAllEndpointsData();
      setTimeProgress(0);
    }
  }, [playing, timeProgress]);

  useEffect(() => {
    if (danaStatus.BankName) {
      const appTitle = danaStatus.BankName + "-" + danaStatus.GateWayName;
      document.title = "Dana Monitor -" + appTitle;
    } else document.title = "Dana Monitor - Disconnected";
  }, [danaStatus]);

  const checkApiError = async (response) => {
    console.log("Check Api return value:");
    console.log(response);
    if (response.status >= 400) {
      setApiSnackState({
        showSnack: true,
        message: `Error in fetching data, ${response.error}`,
        result: false,
      });
    }
    if (response.status === 401) {
      //handelSignOut();
      console.log(response);
    }
  };

  const getDanaStatus = async () => {
    const returnValue = await fetchData(ApiMaps.DanaStatus, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) setDanaStatus(returnValue.data.Data);
  };

  const getLuStatus = async () => {
    const returnValue = await fetchData(ApiMaps.LuStatus, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) setLuStatus(returnValue.data.Data);
  };

  const getPingStatus = async () => {
    const returnValue = await fetchData(ApiMaps.PingStatus, user.userToken);
    checkApiError(returnValue);

    if (returnValue.data) {
      setPingStatus(returnValue.data.Data.PingStatus);
    } else {
      setPingStatus(false);
    }
  };

  const getPortStatus = async () => {
    const returnValue = await fetchData(ApiMaps.PortStatus, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) {
      setPortStatus(returnValue.data.Data.PortStatus);
    } else {
      setPortStatus(false);
    }
  };

  const getGateStatus = async () => {
    const returnValue = await fetchData(ApiMaps.GateStatus, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) {
      setGateStatus(returnValue.data.Data.GateStatus);
    } else {
      setGateStatus(false);
    }
  };

  const getResponseTimes = async () => {
    const returnValue = await fetchData(ApiMaps.ResponseTimes, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) setResponseTimes(JSON.parse(returnValue.data.Data));
  };

  const getTransactions = async () => {
    const returnValue = await fetchData(
      ApiMaps.HostTransaction,
      user.userToken
    );
    checkApiError(returnValue);
    if (returnValue.data) setTransactions(JSON.parse(returnValue.data.Data));
  };

  const getAllEndpointsData = async (firstUse = false) => {
    if (!firstUse) setApiProgress(15);
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

    setActiveSteps(0);
    if (pingStatus) setActiveSteps(1);
    if (portStatus) setActiveSteps(2);
    if (gateStatus) setActiveSteps(4);
  };

  async function handleRefreshTransactions() {
    setApiProgress(20);
    await getTransactions();
    setApiProgress(100);
  }

  async function handleRefreshHostResponseTimes() {
    setApiProgress(45);
    await getResponseTimes();
    setApiProgress(100);
  }

  async function handleRefreshLuStatus() {
    setApiProgress(30);
    await getLuStatus();
    setApiProgress(100);
  }

  async function handleRefreshDanaStatus() {
    setApiProgress(45);
    await getDanaStatus();
    setApiProgress(100);
  }

  async function handleRefreshPortStatus() {
    setApiProgress(45);
    await getPortStatus();
    setApiProgress(100);
  }

  async function handleRefreshGateStatus() {
    setApiProgress(45);
    await getGateStatus();
    setApiProgress(100);
  }

  async function handleRefreshPingStatus() {
    setApiProgress(45);
    await getPingStatus();
    setApiProgress(100);
  }

  async function handleAddNewLuPack() {
    setApiProgress(45);
    const returnValue = await fetchData(ApiMaps.AddLuPack, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `${returnValue.data.Data.Lucount} LU(s) successfully added to Dana.`,
      });
    } else {
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    }

    setApiProgress(100);
  }

  async function handleCloseDanaGate() {
    setApiProgress(45);

    const returnValue = await fetchData(ApiMaps.CloseGate, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Dana open gate request successfully sent, Gate status: ${returnValue.data.Data.Gate}`,
      });
    } else {
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    }
    setApiProgress(100);
  }

  async function handleOpenDanaGate() {
    setApiProgress(45);

    const returnValue = await fetchData(ApiMaps.OpenGate, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) {
      setApiSnackState({
        result: true,
        showSnack: true,
        message: `Dana close gate request successfully sent, Gate status: ${returnValue.data.Data.Gate}`,
      });
    } else {
      setApiSnackState({
        result: false,
        showSnack: true,
        message: `Couldn't get data from API.`,
      });
    }
    setApiProgress(100);
  }

  async function handleReconnectLUs() {
    setApiProgress(45);
    const returnValue = await fetchData(ApiMaps.ReconnectLu, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) {
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
    setApiProgress(100);
  }

  async function handleBackupDb() {
    setApiProgress(45);

    const returnValue = await fetchData(ApiMaps.BackupDb, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) {
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

    setApiProgress(100);
  }

  async function handleRotateTable() {
    setApiProgress(45);

    const returnValue = await fetchData(ApiMaps.BackupDb, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) {
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
    const returnValue = await fetchData(ApiMaps.BackupLogFile, user.userToken);
    checkApiError(returnValue);
    if (returnValue.data) {
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
          DanaName={document.title}
        />
        <Box sx={{ marginLeft: "100px", marginRight: "20px" }}>
          <TopSideLoading
            isShowing={apiProgress > 0 && loading}
            progressValue={apiProgress}
          />
          <Box style={{ marginBottom: "10px" }}>
            <StatusStepper activeStep={activeSteps} />
          </Box>
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
                  fetchIsActive={loading}
                  timeProgress={timeProgress}
                  setTimeProgress={setTimeProgress}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <ResponseTimeChart
                  dataSet={responseTimes}
                  handleFetch={(e) => handleRefreshHostResponseTimes()}
                  fetchIsActive={loading}
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
                  fetchIsActive={loading}
                  handleGetLuPack={(e) => handleAddNewLuPack()}
                  handleReconnectLUs={(e) => handleReconnectLUs()}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <ServerStatus
                  handleBackupDb={handleBackupDb}
                  handleBackupLogs={handleBackupLogs}
                  handleRotateTable={handleRotateTable}
                  fetchIsActive={loading}
                  memoryUsage={danaStatus.MemoryUsage}
                  cpuUsage={danaStatus.CpuUsage}
                  diskSpace={danaStatus.DiskSpace}
                ></ServerStatus>
              </div>
            </div>
          </div>
        </Box>
        <CustomSnackbar
          open={apiSnackState.showSnack}
          closeSnackFunc={handleCloseSnack}
          state={apiSnackState.result}
          message={apiSnackState.message}
        />
        <FullScreenLoading isShowing={loading === true && apiProgress === 0} />
      </MainArea>
    );
}

export default App;
