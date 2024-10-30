import axios from "axios";
import { loadConfig } from "./configService";

const apiDictionary = new Map();
apiDictionary.set("sendLoginRequest", {
  apiAddress: "/auth/login",
  useToken: false,
  method: "POST",
});
apiDictionary.set("sendLuStatusRequest", {
  apiAddress: "/GetLuStatus",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendAddLuPackRequest", {
  apiAddress: "/GetLuPack",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendResponseTimesRequest", {
  apiAddress: "/GetResponseTimes",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendHostTransactionRequest", {
  apiAddress: "/GetHostTransactions",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendPingStatusRequest", {
  apiAddress: "/GetPingStatus",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendPortStatusRequest", {
  apiAddress: "/GetPortStatus",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendServicesStatusRequest", {
  apiAddress: "",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendDanaStatusRequest", {
  apiAddress: "/GetDanaStatus",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendGateStatusRequest", {
  apiAddress: "/GetGateStatus",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendBackupDbRequest", {
  apiAddress: "/BackupDb",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendRotateTableRequest", {
  apiAddress: "/RotateTable",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendBackupLogFileRequest", {
  apiAddress: "/BackupLogFile",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendReconnectLuRequest", {
  apiAddress: "/ReconnectLu",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendOpenGateRequest", {
  apiAddress: "/OpenGate",
  useToken: true,
  method: "GET",
});
apiDictionary.set("sendCloseGateRequest", {
  apiAddress: "/CloseGate",
  useToken: true,
  method: "GET",
});

// let accessToken = null;
// export const setAccessToken = (token) => {
//   accessToken = token;
// };
// export const sendLoginRequest = async (loginApiAddress, loginData) => {
//   return await sendApiRequest(loginApiAddress, "POST", false, loginData);
// };

// export const sendLuStatusRequest = async (luApiAddress) => {
//   const data = await sendApiRequest(luApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data;
// };

// export const sendAddLuPackRequest = async (newLuApiAddress) => {
//   const data = await sendApiRequest(newLuApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data.Lucount;
// };

// export const sendResponseTimesRequest = async (responseTimesApiAddress) => {
//   const data = await sendApiRequest(responseTimesApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return JSON.parse(parsedData.Data);
// };

// export const sendHostTransactionRequest = async (transactionApiAddress) => {
//   const data = await sendApiRequest(transactionApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return await JSON.parse(parsedData.Data);
// };

// export const sendPingStatusRequest = async (pingApiAddress) => {
//   const data = await sendApiRequest(pingApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data.PingStatus;
// };

// export const sendPortStatusRequest = async (portApiAddress) => {
//   const data = await sendApiRequest(portApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data.PortStatus;
// };

// export const sendServicesStatusRequest = async (servicesApiAddress) => {
//   const data = await sendApiRequest(servicesApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data;
// };

// export const sendDanaStatusRequest = async (danaApiAddress) => {
//   const data = await sendApiRequest(danaApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data;
// };

// export const sendGateStatusRequest = async (gateApiAddress) => {
//   const data = await sendApiRequest(gateApiAddress);
//   if (!data) return null;
//   const parsedData = JSON.parse(data.data);
//   return parsedData.Data.GateStatus;
// };

// export const sendBackupDbRequest = async (backupApiAddress) => {
//   const data = await sendApiRequest(backupApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data.DbBackup;
// };

// export const sendRotateTableRequest = async (rotateTableApiAddress) => {
//   const data = await sendApiRequest(rotateTableApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data.DbMainTable;
// };

// export const sendBackupLogFileRequest = async (backupLogApiAddress) => {
//   const data = await sendApiRequest(backupLogApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data.LoggerBackup;
// };

// export const sendReconnectLuRequest = async (reconnectLuApiAddress) => {
//   const data = await sendApiRequest(reconnectLuApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data.ReconnectLu;
// };

// export const sendOpenGateRequest = async (openGateApiAddress) => {
//   const data = await sendApiRequest(openGateApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data.Gate;
// };

// export const sendCloseGateRequest = async (closeGateApiAddress) => {
//   const data = await sendApiRequest(closeGateApiAddress);
//   if (!data) return null;
//   const parsedData = await JSON.parse(data.data);
//   return parsedData.Data.Gate;
// };

// export const sendApiRequest = async (
//   apiAddress,
//   method = "GET",
//   useToken = true,
//   data = null
// ) => {
//   try {
//     let config = {
//       method: method,
//       url: apiAddress,
//     };
//     if (method === "POST") {
//       config.maxBodyLength = "Infinity";
//       config.headers = { "Content-Type": "application/json" };
//       config.data = data;
//     }
//     if (useToken)
//       config.headers = {
//         Authorization: `Bearer ${accessToken}`,
//       };
//     console.log(config);
//     const response = await axios.request(config);
//     if (response.status === 401) return null;
//     return response;
//   } catch (error) {
//     console.log(
//       `axios request sender: ${error.message} ,Full address: ${apiAddress}`
//     );
//     return null;
//   }
// };
let baseUrl = "";
export const sendApiRequest = async (apiEndpoint, token, data = null) => {
  let retVal = {
    status: 0,
    data: "",
    error: "",
  };
  try {
    const endpointData = apiDictionary.get(apiEndpoint);
    if (!endpointData) {
      retVal.status = 404;
      retVal.error = "Couldn't find address to send request";
      return retVal;
    }
    if (baseUrl === "") {
      baseUrl = await loadConfig();
    }
    let config = {
      method: endpointData.method,
      url: baseUrl + endpointData.apiAddress,
    };
    if (config.method === "POST") {
      config.maxBodyLength = "Infinity";
      config.headers = { "Content-Type": "application/json" };
      config.data = data;
    }
    if (endpointData.useToken)
      config.headers = {
        Authorization: `Bearer ${token}`,
      };

    const response = await axios.request(config);
    console.log(response);
    try {
      retVal.data = JSON.parse(response.data);
    } catch {
      retVal.data = response.data;
    }

    retVal.status = response.status;
    retVal.error = "";
  } catch (error) {
    retVal.status = 404;
    retVal.error = error.message;
  }
  return retVal;
};
