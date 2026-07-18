import api from "./api";

export async function fetchMetasMensais({ ano, mes }) {
    const { data } = await api.get(`/metas?ano=${ano}&mes=${mes}`);
    return data;
}

export async function saveMetasMensais(metas) {
    const { data } = await api.post("/metas/salvar", metas);
    return data;
}

export async function fetchMetasVendedores({ ano, mes, loja }) {
    const { data } = await api.get(
        `/metas-vendedores?ano=${ano}&mes=${mes}&loja=${loja}`
    );
    return data;
}

export async function saveMetasVendedores(metas) {
    const { data } = await api.post("/metas-vendedores", metas);
    return data;
}
