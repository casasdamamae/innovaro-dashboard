import { useState } from "react";
import { login, logout } from "../services/authService";
import type { Credenciais } from "../models/types";

export function useAuthController() {
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    async function entrar({ usuario, senha }: Credenciais) {
        setErro("");
        setLoading(true);

        try {
            await login({ usuario, senha });
            return true;
        } catch (error) {
            console.error(error);
            setErro("Usuário ou senha inválidos.");
            return false;
        } finally {
            setLoading(false);
        }
    }

    function sair() {
        logout();
    }

    return {
        erro,
        loading,
        entrar,
        sair
    };
}
