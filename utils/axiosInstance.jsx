import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // Ensure this matches your server.js port
    timeout: 10000, // Increased timeout for slower database queries
    withCredentials: true,
});

// Request Interceptor: Attach the token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        // MATCHING YOUR APP.JSX: Using "token" instead of "jwtToken"
        const token = localStorage.getItem("token"); 
        
        if (token) {
            // Standard format for Bearer tokens
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If the backend returns 401 (Unauthorized), the token might be expired
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized! Redirecting to login...");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/Login";
        }
        
        // CRITICAL: You must use Promise.reject so the calling function 
        // knows the request failed.
        return Promise.reject(error);
    }
);

export default axiosInstance;