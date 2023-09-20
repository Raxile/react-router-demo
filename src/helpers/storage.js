const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USER_INFO = "user_info";

const storage = {
  getAccessToken: () => {
    const token = window.localStorage.getItem(ACCESS_TOKEN);
    return token ? JSON.parse(token) : undefined;
  },
  setAccessToken: (accessToken) => {
    window.localStorage.setItem(ACCESS_TOKEN, JSON.stringify(accessToken));
  },
  getRefreshToken: () => {
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN);
    return refreshToken ? JSON.parse(refreshToken) : undefined;
  },
  setRefreshToken: (refreshToken) => {
    window.localStorage.setItem(REFRESH_TOKEN, JSON.stringify(refreshToken));
  },
  getUserInfo: () => {
    const user = window.localStorage.getItem(USER_INFO);
    return user ? JSON.parse(user) : undefined;
  },
  setUserInfo: (userData) => {
    window.localStorage.setItem(USER_INFO, JSON.stringify(userData));
  },
  userLogoutAction: () => {
    window.localStorage.removeItem(USER_INFO);
    window.localStorage.removeItem(ACCESS_TOKEN);
    window.localStorage.removeItem(REFRESH_TOKEN);
  },
};

export default storage;
