import { type } from "@testing-library/user-event/dist/type";
import axios from "axios";

export async function loadApiData(apiAddress) {
  try {
    if (!apiAddress) return;

    const fullAddress = `${apiAddress}/GetDanaStatus`;
    console.log(`Waiting for API: ${fullAddress}`);

    const { data } = await axios({
      method: "get",
      url: fullAddress,
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then((result) => result);
    return data;
  } catch (error) {
    console.log("Failed to load data from API: ", error.message);
  }
}
