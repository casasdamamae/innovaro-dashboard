import "./Header.css";

import { useState, useEffect } from "react";


import {
    FaUsers,
    FaBullseye,
    FaSignOutAlt
} from "react-icons/fa";

import { useDashboard } from "../../context/DashboardContext";

export default function Header() {

    const {

        inicio,
        fim,
        loja,
        lojas,

        fornecedor,
        fornecedores,

        setInicio,
        setFim,
        setLoja,
        setFornecedor,

        atualizar

    } = useDashboard();

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const [horaAtual, setHoraAtual] = useState(
    new Date().toLocaleTimeString("pt-BR"));
    useEffect(() => {
    const intervalo = setInterval(() => {
        setHoraAtual(new Date().toLocaleTimeString("pt-BR"));
    }, 1000);

    return () => clearInterval(intervalo);
}, []);

    const ehAdmin = usuario?.nivel === "ADMIN";

    function telaCheia() {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();

        } else {

            document.exitFullscreen();

        }

    }

    function abrirUsuarios() {

        window.dispatchEvent(new Event("abrirUsuarios"));

    }

    function abrirMetas() {

    window.dispatchEvent(new Event("abrirMetas"));

    }

    function sair() {

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.reload();

    }

    return (

        <header className="header">

            <div className="header-top">

                <div className="logo">

                    <img
                        src="/logo-casas.png"
                        alt="Casas da Mamãe"
                        className="logo-casas"
                    />

                    <div className="divisor"></div>

                    <img
                        src="/logo-melhor.png"
                        alt="Melhor das Casas"
                        className="logo-melhor"
                    />

                </div>

                <div className="header-info">

                    <span>

                        👤 {usuario?.usuario || "Admin"}

                    </span>

                    <strong>

                        {horaAtual}

                    </strong>

                </div>

            </div>

            <div className="header-filtros">

                <div className="campo">

                    <label>Data Inicial</label>

                    <input
                        type="date"
                        value={inicio}
                        onChange={(e) => setInicio(e.target.value)}
                    />

                </div>

                <div className="campo">

                    <label>Data Final</label>

                    <input
                        type="date"
                        value={fim}
                        onChange={(e) => setFim(e.target.value)}
                    />

                </div>

                <div className="campo">

                    <label>Loja</label>

                    <select
                        value={loja}
                        onChange={(e) => setLoja(e.target.value)}
                    >

                        {

                            lojas.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >

                                    {item.nome}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div className="campo">

                     <label>Fornecedor</label>

                     <select
                         value={fornecedor}
                         onChange={(e) => setFornecedor(e.target.value)}
                     >

                         {

                             fornecedores.map((item) => (

                                 <option
                                    key={item.id}
                                    value={item.id}
                                >

                                    {item.nome}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div className="botoes-header">

                    <button onClick={atualizar}>

                        🔄 Atualizar

                    </button>

{

    ehAdmin && (

        <>

            <button onClick={abrirUsuarios}>

                <FaUsers />

                &nbsp;Usuários

            </button>

            <button onClick={abrirMetas}>

                <FaBullseye />

                &nbsp;Metas

            </button>

        </>

    )

}

                    <button
                        className="btn-fullscreen"
                        onClick={telaCheia}
                    >

                        📺 Tela Cheia

                    </button>

                    <button onClick={sair}>

                        <FaSignOutAlt />

                        &nbsp;Sair

                    </button>

                </div>

            </div>

        </header>

    );

}