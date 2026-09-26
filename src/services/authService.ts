import api from "./api";
import { saveSession, clearSession } from "../models/session";
import type { Credenciais, SessaoAuth } from "../models/types";

export async function login({ usuario, senha }: Credenciais) {
    const { data } = await api.post<SessaoAuth>("/auth/login", {
        usuario,
        senha
    });

    saveSession(data);
    return data;
}

export function logout() {
    clearSession();
}
