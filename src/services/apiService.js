import axios from "axios";
export const sendLoginRequest = async (loginApiAddress, loginData) => {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${loginApiAddress}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: loginData,
  };
  return await sendApiRequest(config);
};

export const sendLuStatusRequest = async (luApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${luApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data;
};

export const sendAddLuPackRequest = async (newLuApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${newLuApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data.Lucount;
};

export const sendResponseTimesRequest = async (
  responseTimesApiAddress,
  token
) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${responseTimesApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return JSON.parse(parsedData.Data);
};

export const sendHostTransactionRequest = async (
  transactionApiAddress,
  token
) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${transactionApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return await JSON.parse(parsedData.Data);
};

export const sendPingStatusRequest = async (pingApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${pingApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data.PingStatus;
};

export const sendPortStatusRequest = async (portApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${portApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data.PortStatus;
};

export const sendServicesStatusRequest = async (servicesApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${servicesApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data;
};

export const sendDanaStatusRequest = async (danaApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${danaApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data;
};

export const sendGateStatusRequest = async (gateApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${gateApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = JSON.parse(data.data);
  return parsedData.Data.GateStatus;
};

export const sendBackupDbRequest = async (backupApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${backupApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data.DbBackup;
};

export const sendRotateTableRequest = async (rotateTableApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${rotateTableApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data.DbMainTable;
};

export const sendBackupLogFileRequest = async (backupLogApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${backupLogApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data.LoggerBackup;
};

export const sendReconnectLuRequest = async (reconnectLuApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${reconnectLuApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data.ReconnectLu;
};

export const sendOpenGateRequest = async (openGateApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${openGateApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data;
};

export const sendCloseGateRequest = async (closeGateApiAddress, token) => {
  const config = {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${closeGateApiAddress}`,
  };
  const data = await sendApiRequest(config);
  if (!data) return null;
  const parsedData = await JSON.parse(data.data);
  return parsedData.Data;
};

export const sendApiRequest = async (apiConfig) => {
  try {
    const response = await axios.request(apiConfig);
    return response;
  } catch (error) {
    console.log(
      `axios request sender: ${error.message} ,Full address: ${apiConfig.url}`
    );
    return null;
  }
};

export const loadApiData = async (apiUrl, apiSubject, ...status) => {
  try {
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
    console.log(`rest argument is : ${status}`);
    const retval = await parseReceivedData(result, apiSubject, {
      ...status,
    }).then((data) => data);
    console.log(retval);
    return retval;
  } catch (err) {
    console.log(`Failed to load API data: ${err}`);
  }
};

const parseReceivedData = async (data, apiSubject, ...status) => {
  try {
    console.log(`Rest argument in parser is: ${status}`);
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
        const { danaStatus } = status;
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
        const { luStatus } = status;
        const tmpLuStatus = { ...luStatus };
        console.log(`current lu status: ${tmpLuStatus}`);
        if (AllLUCount) tmpLuStatus.AllLUCount = AllLUCount;
        if (FailedLUCount) tmpLuStatus.FailedLUCount = FailedLUCount;
        if (AvailableLUCount) tmpLuStatus.AvailableLUCount = AvailableLUCount;
        return { ...tmpLuStatus };
      case "GetPingStatus":
        if (PingStatus) return PingStatus;
        break;
      case "GetGateStatus":
        console.log(`current gate status: ${GateStatus}`);
        if (GateStatus !== null && GateStatus !== undefined) return GateStatus;
        break;
      case "GetPortStatus":
        console.log(`current port status: ${PortStatus}`);
        if (PortStatus !== null && PortStatus !== undefined) return PortStatus;
        break;
      case "OpenGate":
        if (parsedData.Data) return parsedData.Data.Gate;
        break;
      case "CloseGate":
        if (parsedData.Data) return parsedData.Data.Gate;
        break;
      case "ReconnectLu":
        if (parsedData.Data) return parsedData.Data.ReconnectLu;
        break;
      case "GetLuPack":
        if (parsedData.Data) return parsedData.Data.Lucount;
        break;
      case "BackupDb":
        if (parsedData.Data) return parsedData.Data.DbBackup;
        break;
      case "RotateTable":
        if (parsedData.Data) return parsedData.Data.DbMainTable;
        break;
      case "BackupLogFile":
        if (parsedData.Data) return parsedData.Data.LoggerBackup;
        break;
      case "GetResponseTimes":
        if (parsedData.Data) return JSON.parse(parsedData.Data);
        break;
      case "GetHostTransactions":
        if (parsedData.Data) return JSON.parse(parsedData.Data);
        break;
      default:
        return null;
    }
  } catch (err) {
    console.log(`Error in message parser: ${err} , ${data}`);
    return null;
  }
};
