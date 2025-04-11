import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
        console.log("✅ Set Authorization Header:", api.defaults.headers.common["Authorization"]); // 🔍 Debug
    } else {
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
    }
};

// ✅ 页面刷新时恢复 `token`
if (typeof window !== "undefined") {
    const token = localStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }
}