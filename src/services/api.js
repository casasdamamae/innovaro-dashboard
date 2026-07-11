import axios from "axios";

const api = axios.create({
    baseURL: "https://innovaro-powerbi-api.onrender.com"
});

export default api;
