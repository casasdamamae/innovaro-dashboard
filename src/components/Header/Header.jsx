import "./Header.css";

import { FaUsers, FaSignOutAlt } from "react-icons/fa";

import { useDashboard } from "../../context/DashboardContext";

export default function Header() {

    const {

        inicio,
        fim,
        loja,
        lojas,

        setInicio,
        setFim,
        setLoja,

        atualizar

    } = useDashboard();

    const usuario = JSON.parse(localStorage.getItem("usuario"));
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

    function sair() {

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.reload();

    }

    return (

        <header className="header">

            <div className="header-top">

                <div className="logo">

                    🏠 Casas da Mamãe Analytics

                </div>

                <div className="header-info">

                    <span>

                        👤 {usuario?.usuario || "Admin"}

                    </span>

                    <strong>

                        {new Date().toLocaleTimeString("pt-BR")}

                    </strong>

                </div>

            </div>

            <div className="header-filtros">

                <div className="campo">

                    <label>Data Inicial</label>

                    <input
                        type="date"
                        value={inicio}
                        onChange={(e)=>setInicio(e.target.value)}
                    />

                </div>

                <div className="campo">

                    <label>Data Final</label>

                    <input
                        type="date"
                        value={fim}
                        onChange={(e)=>setFim(e.target.value)}
                    />

                </div>

                <div className="campo">

                    <label>Loja</label>

                    <select
                        value={loja}
                        onChange={(e)=>setLoja(e.target.value)}
                    >

                        {

                            lojas.map((item)=>(

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
                    <button onClick={abrirUsuarios}>

                        <FaUsers />

                        &nbsp;Usuários

                    </button>
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