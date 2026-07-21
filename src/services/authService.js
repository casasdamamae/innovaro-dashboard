import api from "./api";
import { saveSession, clearSession } from "../models/session";

export async function login({ usuario, senha }) {
    const { data } = await api.post("/auth/login", {
        usuario,
        senha
    });

    saveSession(data);
    return data;
}

export function logout() {
    clearSession();
}
