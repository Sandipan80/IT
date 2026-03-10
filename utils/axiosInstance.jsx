import axios from "axios";
const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
   timeout:3000,
   withCredentials:true,
})
axiosInstance.interceptors.request.use(
(config)=>{
    const jwtToken = localStorage.getItem("jwtToken");
    console.log("jwtToken in axiosInstance", jwtToken);
    if(jwtToken){
        config.headers.authorization = `Bearer ${jwtToken}`;
    }
    return config;
}
)
axiosInstance.interceptors.response.use(
(response)=>{
    console.log("response in axiosInstance", response);
    return response;
},
(error)=>{
    console.log("error in axiosInstance", error?.response);
    return error;
}
)
export default axiosInstance;