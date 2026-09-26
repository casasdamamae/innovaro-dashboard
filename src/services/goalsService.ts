import api from "./api";
import type { MetaMensalForm, MetaMensalSalva, MetaVendedorForm, MetaVendedorSalva } from "../models/types";

export async function fetchMetasMensais({ ano, mes }: { ano: number; mes: number }) {
    const { data } = await api.get<MetaMensalSalva[]>(`/metas?ano=${ano}&mes=${mes}`);
    return data;
}

export async function saveMetasMensais(metas: MetaMensalForm[]) {
    const { data } = await api.post("/metas/salvar", metas);
    return data;
}

export async function fetchMetasVendedores({
    ano,
    mes,
    loja
}: {
    ano: number;
    mes: number;
    loja: string;
}) {
    const { data } = await api.get<MetaVendedorSalva[]>(
        `/metas-vendedores?ano=${ano}&mes=${mes}&loja=${loja}`
    );
    return data;
}

export async function saveMetasVendedores(metas: MetaVendedorForm[]) {
    const { data } = await api.post("/metas-vendedores", metas);
    return data;
}
