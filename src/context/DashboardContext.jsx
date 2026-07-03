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

            const token = localStorage.getItem("token");

            const { data } = await api.get("/resumo/lojas", {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

            setLojas(data);

        } catch (erro) {

            console.error(erro);

        }

    }

    async function atualizar() {

        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            const { data } = await api.get("/resumo", {

                headers: {

                    Authorization: `Bearer ${token}`

                },

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

    // Atualização automática
    useEffect(() => {

        const intervalo = setInterval(() => {

            atualizar();

        }, 120000); // 2 minutos

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