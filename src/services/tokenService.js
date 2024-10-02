import Cookies from "js-cookie";

export const getTokenFromCookie = async () => {
  const token = Cookies.get("token");
  if (token) {
    return token;
  }
  return null;
};

export const setTokenToCookie = async (token) => {
  const date = new Date();

  const result = Cookies.set("token", token, {
    expires: date.getMinutes() + 2,
    secure: true,
  });
  return result;
};
