export const loadConfig = async () => {
  try {
    const response = await fetch("/config.json");
    if (!response.ok) {
      throw new Error("Failed to fetch config file");
    }
    const data = await response.json();
    const environment = process.env.NODE_ENV || "development";
    console.log(
      `ApiUrl loaded successfully : ${data[environment].REACT_APP_API_URL}`
    );
    return data[environment].REACT_APP_API_URL;
  } catch (err) {
    console.log(`Error caught: ${err}`);
  }
};
