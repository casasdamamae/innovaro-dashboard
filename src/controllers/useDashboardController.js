import { useCallback, useEffect, useMemo, useState } from "react";
import {
    fetchDashboardResumo,
    fetchFornecedoresResumo,
    fetchLojasResumo,
    fetchSetoresResumo
} from "../services/dashboardService";
import { getStoredUser } from "../models/session";

export function useDashboardController() {
    const hoje = useMemo(() => new Date().toISOString().split("T")[0], []);

    const [inicio, setInicio] = useState(hoje);
    const [fim, setFim] = useState(hoje);
    const [loja, setLoja] = useState("TODAS");
    const [lojas, setLojas] = useState([]);
    const [fornecedor, setFornecedor] = useState("TODOS");
    const [fornecedores, setFornecedores] = useState([]);
    const [setor, setSetor] = useState("TODOS");
    const [setores, setSetores] = useState([]);

    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(false);
    const [graficoLoja, setGraficoLoja] = useState(null);

    const [usuariosAberto, setUsuariosAberto] = useState(false);
    const [metasAberto, setMetasAberto] = useState(false);
    const [metasVendedoresAberto, setMetasVendedoresAberto] = useState(false);

    const usuario = getStoredUser();

    const carregarListas = useCallback(async () => {
        try {
            const [lojasData, fornecedoresData, setoresData] = await Promise.all([
                fetchLojasResumo(),
                fetchFornecedoresResumo(),
                fetchSetoresResumo()
            ]);

            setLojas(lojasData);
            setFornecedores(fornecedoresData);
            setSetores(setoresData);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const atualizar = useCallback(async () => {
        setLoading(true);

        try {
            const data = await fetchDashboardResumo({
                inicio,
                fim,
                loja,
                fornecedor,
                setor
            });

            setDados(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [fim, fornecedor, inicio, loja, setor]);

    useEffect(() => {
        const timer = setTimeout(() => {
            void carregarListas();
        }, 0);

        return () => clearTimeout(timer);
    }, [carregarListas]);

    useEffect(() => {
        const timer = setTimeout(() => {
            void atualizar();
        }, 0);

        return () => clearTimeout(timer);
    }, [atualizar]);

    useEffect(() => {
        const intervalo = setInterval(() => {
            atualizar();
        }, 120000);

        return () => clearInterval(intervalo);
    }, [atualizar]);

    function registrarGraficoLoja(imagem) {
        setGraficoLoja(imagem);
    }

    function abrirUsuarios() {
        setUsuariosAberto(true);
    }

    function fecharUsuarios() {
        setUsuariosAberto(false);
    }

    function abrirMetas() {
        setMetasAberto(true);
    }

    function fecharMetas() {
        setMetasAberto(false);
    }

    function abrirMetasVendedores() {
        setMetasVendedoresAberto(true);
    }

    function fecharMetasVendedores() {
        setMetasVendedoresAberto(false);
    }

    return {
        dados,
        loading,
        usuario,
        inicio,
        fim,
        loja,
        lojas,
        fornecedor,
        fornecedores,
        setor,
        setores,
        graficoLoja,
        usuariosAberto,
        metasAberto,
        metasVendedoresAberto,
        setInicio,
        setFim,
        setLoja,
        setFornecedor,
        setSetor,
        atualizar,
        registrarGraficoLoja,
        abrirUsuarios,
        fecharUsuarios,
        abrirMetas,
        fecharMetas,
        abrirMetasVendedores,
        fecharMetasVendedores
    };
}
