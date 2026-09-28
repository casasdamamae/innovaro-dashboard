import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
    fetchDashboardResumo,
    fetchFornecedoresResumo,
    fetchLojasResumo,
    fetchSetoresResumo,
    fetchStatus
} from "../services/dashboardService";
import { ordenarLojas } from "../models/nomeLoja";
import { getStoredUser } from "../models/session";
import { marcadorStatus } from "../models/status";
import type { OpcaoFiltro, Resumo, UsuarioSessao } from "../models/types";

const INTERVALO_STATUS_MS = 120000;

export type DashboardController = {
    dados: Resumo | null;
    isInitialLoading: boolean;
    isRefreshing: boolean;
    erroInicial: boolean;
    usuario: UsuarioSessao | null;
    inicio: string;
    fim: string;
    loja: string;
    lojas: OpcaoFiltro[];
    fornecedor: string;
    fornecedores: OpcaoFiltro[];
    setor: string;
    setores: OpcaoFiltro[];
    graficoLoja: string | null;
    setInicio: Dispatch<SetStateAction<string>>;
    setFim: Dispatch<SetStateAction<string>>;
    setLoja: Dispatch<SetStateAction<string>>;
    setFornecedor: Dispatch<SetStateAction<string>>;
    setSetor: Dispatch<SetStateAction<string>>;
    atualizar: () => Promise<void>;
    registrarGraficoLoja: (imagem: string) => void;
};

export function useDashboardController(): DashboardController {
    const hoje = useMemo(() => new Date().toISOString().split("T")[0], []);

    const [inicio, setInicio] = useState(hoje);
    const [fim, setFim] = useState(hoje);
    const [loja, setLoja] = useState("TODAS");
    const [lojas, setLojas] = useState<OpcaoFiltro[]>([]);
    const [fornecedor, setFornecedor] = useState("TODOS");
    const [fornecedores, setFornecedores] = useState<OpcaoFiltro[]>([]);
    const [setor, setSetor] = useState("TODOS");
    const [setores, setSetores] = useState<OpcaoFiltro[]>([]);

    const [dados, setDados] = useState<Resumo | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [erroInicial, setErroInicial] = useState(false);
    const [graficoLoja, setGraficoLoja] = useState<string | null>(null);

    const dadosRef = useRef<Resumo | null>(null);
    const marcadorRef = useRef<string | null>(null);
    const requestSeq = useRef(0);

    const usuario = getStoredUser();
    const isInitialLoading = dados === null && !erroInicial;

    const carregarListas = useCallback(async () => {
        try {
            const [lojasData, fornecedoresData, setoresData] = await Promise.all([
                fetchLojasResumo(),
                fetchFornecedoresResumo(),
                fetchSetoresResumo()
            ]);

            setLojas(ordenarLojas(lojasData));
            setFornecedores(fornecedoresData);
            setSetores(setoresData);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const atualizar = useCallback(async () => {
        const id = ++requestSeq.current;
        const tinhaDados = dadosRef.current !== null;

        if (tinhaDados) {
            setIsRefreshing(true);
        } else {
            setErroInicial(false);
        }

        try {
            const data = await fetchDashboardResumo({
                inicio,
                fim,
                loja,
                fornecedor,
                setor
            });

            if (id !== requestSeq.current) return;

            dadosRef.current = data;
            setDados(data);
            setErroInicial(false);

            const marcador = marcadorStatus(data?.status);

            if (marcador) {
                marcadorRef.current = marcador;
            }
        } catch (error) {
            if (id !== requestSeq.current) return;

            console.error(error);

            if (!tinhaDados && dadosRef.current === null) {
                setErroInicial(true);
            }
        } finally {
            if (id === requestSeq.current) {
                setIsRefreshing(false);
            }
        }
    }, [fim, fornecedor, inicio, loja, setor]);

    const sincronizarSeMudou = useCallback(async () => {
        try {
            const status = await fetchStatus();
            const marcador = marcadorStatus(status?.dados);

            if (!marcador) return;

            if (marcadorRef.current === null) {
                marcadorRef.current = marcador;
                return;
            }

            if (marcador !== marcadorRef.current) {
                await atualizar();
            }
        } catch (error) {
            console.error(error);
        }
    }, [atualizar]);

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
            void sincronizarSeMudou();
        }, INTERVALO_STATUS_MS);

        return () => clearInterval(intervalo);
    }, [sincronizarSeMudou]);

    const registrarGraficoLoja = useCallback((imagem: string) => {
        setGraficoLoja(imagem);
    }, []);

    return {
        dados,
        isInitialLoading,
        isRefreshing,
        erroInicial,
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
        setInicio,
        setFim,
        setLoja,
        setFornecedor,
        setSetor,
        atualizar,
        registrarGraficoLoja
    };
}
