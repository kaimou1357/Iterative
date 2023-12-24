const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://www.goiterative.com/api";
const SOCKET_IO_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://www.goiterative.com";
const BASE_URL = SOCKET_IO_URL;

export { API_BASE_URL, SOCKET_IO_URL, BASE_URL };
