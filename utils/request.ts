import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

console.log("✅ Base URL (runtime):", BASE_URL);

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default request;
