import api from "./api";

export async function fetchUsuarios() {
    const { data } = await api.get("/usuarios");
    return data;
}

export async function createUsuario(payload) {
    const { data } = await api.post("/usuarios", payload);
    return data;
}

export async function deleteUsuario(id) {
    await api.delete(`/usuarios/${id}`);
}

export async function fetchLojas() {
    const { data } = await api.get("/lojas");
    return data;
}
