import axios from "axios";

// 注意：Vite / Expo / Next.js 各自的前缀不同
// Vite 默认只允许以 VITE_ 开头的变量暴露给前端
const request = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, // 如果是 Expo，用这个
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default request;
