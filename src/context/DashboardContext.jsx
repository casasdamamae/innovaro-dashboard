import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {

    const hoje = new Date().toISOString().split("T")[0];

    const [inicio, setInicio] = useState(hoje);
    const [fim, setFim] = useState(hoje);

    const [loja, setLoja] = useState("TODAS");
    const [lojas, setLojas] = useState([]);

    const [dados, setDados] = useState(null);

    const [loading, setLoading] = useState(false);

    async function carregarLojas() {

        try {

            const { data } = await api.get("/resumo/lojas");

            setLojas(data);

        } catch (erro) {

            console.error(erro);

        }

    }

    async function atualizar() {

        setLoading(true);

        try {

            const { data } = await api.get("/resumo", {

                params: {

                    inicio,
                    fim,
                    loja

                }

            });

            setDados(data);

        } catch (erro) {

            console.error(erro);

        }

        setLoading(false);

    }

    // Carrega as lojas apenas uma vez
    useEffect(() => {

        carregarLojas();

    }, []);

    // Atualiza ao trocar filtros
    useEffect(() => {

        atualizar();

    }, [inicio, fim, loja]);

    // Atualização automática a cada 30 segundos
    useEffect(() => {

        const intervalo = setInterval(() => {

            atualizar();

        }, 60000);

        return () => clearInterval(intervalo);

    }, [inicio, fim, loja]);

    return (

        <DashboardContext.Provider

            value={{

                dados,
                loading,

                inicio,
                fim,

                loja,
                lojas,

                setInicio,
                setFim,
                setLoja,

                atualizar

            }}

        >

            {children}

        </DashboardContext.Provider>

    );

}

export function useDashboard() {

    return useContext(DashboardContext);

}