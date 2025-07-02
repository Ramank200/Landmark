import { logout } from "../redux/slices/userSlice";

export const authFetch = async (url, options = {}, dispatch) => {
  const response = await fetch(url, options);
  if (response.status === 401) {
    dispatch(logout());
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }
  return response;
};
