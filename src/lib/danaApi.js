export const loadApiData = async (apiUrl) => {
  try {
    if (apiUrl === "") {
      console.log("API Address is not loaded yet!");
      return;
    }
    console.log(`Sending request to API: ${apiUrl}/GetDanaStatus`);
    const response = await fetch(`${apiUrl}/GetDanaStatus`);
    if (!response.ok) {
      console.log("Failed to load API data!");
      return;
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(`Failed to load API data: ${err}`);
  }
};
