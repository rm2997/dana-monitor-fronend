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
  static AddLuPack = new ApiMaps("/AddLuPack", true, "POST");
  static ResponseTimes = new ApiMaps("/GetResponseTimes", true);
  static HostTransaction = new ApiMaps("/GetHostTransactions", true);
  static PingStatus = new ApiMaps("/GetPingStatus", true);
  static PortStatus = new ApiMaps("/GetPortStatus", true);
  static DanaStatus = new ApiMaps("/GetDanaStatus", true);
  static GateStatus = new ApiMaps("/GetGateStatus", true);
  static BackupDb = new ApiMaps("/BackupDb", true, "POST");
  static RotateTable = new ApiMaps("/RotateTable", true, "POST");
  static BackupLogFile = new ApiMaps("/BackupLogFile", true, "POST");
  static ReconnectLu = new ApiMaps("/ReconnectLu", true, "POST");
  static OpenGate = new ApiMaps("/OpenGate", true, "POST");
  static CloseGate = new ApiMaps("/CloseGate", true, "POST");
  static ServicesStatus = new ApiMaps("", true);
}
