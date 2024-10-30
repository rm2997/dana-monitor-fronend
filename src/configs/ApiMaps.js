export class ApiMaps {
  endPoint = "";
  useToken = false;
  apiMethod = "POST";
  constructor(endpoint, usetoken, method = "GET") {
    this.endPoint = endpoint;
    this.useToken = usetoken;
    this.apiMethod = method;
  }

  static LoginRequest = new ApiMaps("/auth/login", false, "POST");
  static LuStatus = new ApiMaps("/GetLuStatus", true);
  static AddLuPack = new ApiMaps("/GetLuPack", true);
  static ResponseTimes = new ApiMaps("/GetResponseTimes", true);
  static HostTransaction = new ApiMaps("/GetHostTransactions", true);
  static PingStatus = new ApiMaps("/GetPingStatus", true);
  static PortStatus = new ApiMaps("/GetPortStatus", true);
  static DanaStatus = new ApiMaps("/GetDanaStatus", true);
  static GateStatus = new ApiMaps("/GetGateStatus", true);
  static BackupDb = new ApiMaps("/BackupDb", true);
  static RotateTable = new ApiMaps("/RotateTable", true);
  static BackupLogFile = new ApiMaps("/BackupLogFile", true);
  static ReconnectLu = new ApiMaps("/ReconnectLu", true);
  static OpenGate = new ApiMaps("/OpenGate", true);
  static CloseGate = new ApiMaps("/CloseGate", true);
  static ServicesStatus = new ApiMaps("", true);
}
