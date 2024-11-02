export const setTokenToSessionStorage = async (user) => {
  sessionStorage.setItem("danaMonitorUser", JSON.stringify(user));
  console.log(user);
};

export const getTokenFromSessionStorage = async () => {
  const user = sessionStorage.getItem("danaMonitorUser");
  return JSON.parse(user);
};

export const removeTokenFromSessionStorage = async () => {
  sessionStorage.removeItem("danaMonitorUser");
};
