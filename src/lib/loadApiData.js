import axios from "axios";
import { fetchConfig } from "../config/config.js";

export async function loadApiData(apiAddress) {
  // const apiAddress=`${process.env.REACT_APP_API_URL}/GetDanaStatus`;

  try {
    const fullAddress = `${apiAddress}/GetDanaStatus`;
    console.log(`Waiting for API: ${fullAddress}`);
    const { data } = await axios.get(fullAddress).then((result) => result);
    return data;
  } catch (error) {
    console.log("Failed to load data from API: ", error.message);
  }
}
