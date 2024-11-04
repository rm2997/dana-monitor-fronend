import { useState } from "react";
import { ApiResultModel } from "../models";
import axios from "axios";
import { loadConfig } from "../services";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  //   const [returnValue, setReturnValue] = useState(new ApiResultModel());
  let baseUrl = "";
  const fetchData = async (mapConfig, token = "", data = null) => {
    setLoading(true);
    if (baseUrl === "") {
      baseUrl = await loadConfig();
    }

    const retVal = new ApiResultModel();
    try {
      let config = {
        method: mapConfig.apiMethod,
        url: baseUrl + mapConfig.endPoint,
      };
      if (mapConfig.apiMethod === "POST") {
        config.maxBodyLength = "Infinity";
        config.headers = { "Content-Type": "application/json" };
        config.data = data;
      }
      if (mapConfig.useToken)
        config.headers = {
          Authorization: `Bearer ${token}`,
        };

      const resp = await axios.request(config);
      try {
        retVal.data = JSON.parse(resp.data);
      } catch {
        retVal.data = resp.data;
      }
      retVal.status = resp.status;
      retVal.error = resp.statusText;
    } catch (axiosError) {
      retVal.data = "";
      retVal.status = axiosError.response.status;
      retVal.error = axiosError.message;
    } finally {
      setLoading(false);
    }

    return retVal;
  };
  return { loading, fetchData };
};

export default useFetch;
