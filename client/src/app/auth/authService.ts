import Cookies from "js-cookie";

export const setToken = (token: string) => {
  Cookies.set("access_token", token, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const getToken = () => {
  return Cookies.get("access_token");
};

export const removeToken = () => {
  Cookies.remove("access_token");
};
