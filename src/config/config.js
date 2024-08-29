export const fetchConfig = async () => {
  console.log("Hello from fetchConfig");
  try {
    const response = await fetch("/config.json");
    const data = await response.json();
    const environment = process.env.NODE_ENV || "development";
    return data[environment];
  } catch (error) {
    console.log(`Failed to load data from config file:${error}`);
  }
};
