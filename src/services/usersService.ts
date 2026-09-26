import api from "./api";
import type {
    AtualizarUsuario,
    Loja,
    NovoUsuario,
    PaginaUsuarios,
    UsuarioAdmin
} from "../models/types";

export const LIMITE_USUARIOS = 15;

export async function fetchUsuarios(pagina = 1, limite = LIMITE_USUARIOS) {
    const { data } = await api.get<PaginaUsuarios>("/usuarios", {
        params: { pagina, limite }
    });
    return data;
}

export async function createUsuario(payload: NovoUsuario) {
    const { data } = await api.post<UsuarioAdmin>("/usuarios", payload);
    return data;
}

export async function updateUsuario(id: string | number, payload: AtualizarUsuario) {
    const { data } = await api.put(`/usuarios/${id}`, payload);
    return data;
}

export async function deleteUsuario(id: string | number) {
    await api.delete(`/usuarios/${id}`);
}

export async function fetchLojas() {
    const { data } = await api.get<Loja[]>("/lojas");
    return data;
}
