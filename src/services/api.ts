import axios from "axios";
import type { AxiosError } from "axios";
import {
    encerrarSessao,
    getAccessToken,
    getRefreshToken,
    saveSession
} from "../models/session";
import type { SessaoAuth } from "../models/types";

const api = axios.create({
    //baseURL: "https://innovaro-powerbi-api.onrender.com"
    baseURL: "http://localhost:3000"
});

let renovacaoEmAndamento: Promise<string> | null = null;

function renovarSessao() {
    if (!renovacaoEmAndamento) {
        renovacaoEmAndamento = executarRefresh().finally(() => {
            renovacaoEmAndamento = null;
        });
    }

    return renovacaoEmAndamento;
}

async function executarRefresh() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error("Refresh token ausente");
    }

    const { data } = await api.post<SessaoAuth>(
        "/auth/refresh",
        { refreshToken },
        { skipAuth: true }
    );

    if (!data?.accessToken) {
        throw new Error("Access token ausente na renovação");
    }

    saveSession(data);
    return data.accessToken;
}

function ehRotaDeAuth(url = "") {
    return url.includes("/auth/login") || url.includes("/auth/refresh");
}

function falhaDeAutenticacao(error: unknown) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;

    if (status === 401 || status === 403) return true;

    return (
        error instanceof Error &&
        (error.message === "Refresh token ausente" ||
            error.message === "Access token ausente na renovação")
    );
}

api.interceptors.request.use((config) => {
    if (config.skipAuth) return config;

    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (
            !originalRequest ||
            originalRequest.skipAuth ||
            ehRotaDeAuth(originalRequest.url)
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const accessToken = await renovarSessao();
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            if (falhaDeAutenticacao(refreshError)) {
                encerrarSessao();
            }

            return Promise.reject(refreshError);
        }
    }
);

export default api;
