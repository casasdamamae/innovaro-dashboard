import api from "./api";
import type { Loja, NovoUsuario, UsuarioAdmin } from "../models/types";

export async function fetchUsuarios() {
    const { data } = await api.get<UsuarioAdmin[]>("/usuarios");
    return data;
}

export async function createUsuario(payload: NovoUsuario) {
    const { data } = await api.post<UsuarioAdmin>("/usuarios", payload);
    return data;
}

export async function deleteUsuario(id: string | number) {
    await api.delete(`/usuarios/${id}`);
}

export async function fetchLojas() {
    const { data } = await api.get<Loja[]>("/lojas");
    return data;
}
