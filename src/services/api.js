// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:3000"
// });

// const refreshToken = localStorage.getItem("refreshToken");

// const response = await api.post(
//     "/auth/refresh",
//     {
//         refreshToken
//     },
// );

// localStorage.setItem("token", response.data.accessToken);


// export default api;

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000"
});

// Adiciona automaticamente o Access Token em todas as requisições
api.interceptors.request.use((config) => {

    

    

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

// Quando receber 401 tenta renovar o Access Token
api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (originalRequest.url === "/auth/refresh") {

            return Promise.reject(error);

        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const refreshToken =
                    localStorage.getItem("refreshToken");

                const resposta = await axios.post(

                    "http://localhost:3000/auth/refresh",

                    {
                        refreshToken
                    }

                );

                localStorage.setItem(
                    "token",
                    resposta.data.accessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${resposta.data.accessToken}`;

                return api(originalRequest);

            } catch {

                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");

                //window.location.replace("/login");
                // window.location.href = "/";

            }

        }

        return Promise.reject(error);

    }

);

export default api;