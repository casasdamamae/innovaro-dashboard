import axios from "axios";
import {
    clearSession,
    getAccessToken,
    getRefreshToken,
    setAccessToken
} from "../models/session";



const api = axios.create({
    //baseLocalURL: import.meta.env.VITE_BASE_URL_LOCAL
    baseURL: import.meta.env.VITE_BASE_URL

});

api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
        };
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest?.url === "/auth/refresh") {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();

                if (!refreshToken) {
                    clearSession();
                    return Promise.reject(error);
                }

                const resposta = await api.post("/auth/refresh", {
                    refreshToken
                });

                const accessToken = resposta.data.accessToken;
                setAccessToken(accessToken);

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${accessToken}`
                };

                return api(originalRequest);
            } catch (refreshError) {
                clearSession();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
