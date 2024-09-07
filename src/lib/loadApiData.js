import axios from "axios";

export async function loadApiData(apiAddress) {
  try {
    if (!apiAddress) return;

    // const fullAddress = `http://dana-monitor-backend:4000/api/GetDanaStatus`;
    console.log(`Loaded from config.json : ${apiAddress}`);
    const fullAddress = `${apiAddress}/GetDanaStatus`;
    console.log(`Waiting for API: ${fullAddress}`);
    const { data } = await fetch(fullAddress)
      .then((result) => result)
      .catch((err) => {
        console.log(`Error fetching from API: ${err.message}`);
      });

    // const { data } = await axios
    //   .get(fullAddress)
    //   .then((result) => result)
    //   .catch((err) => {
    //     console.log(err);
    //   });
    return data;
  } catch (error) {
    console.log("Failed to load data from API: ", error.message);
  }
}
