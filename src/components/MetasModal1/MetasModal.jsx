import { useEffect, useState } from "react";
import api from "../../services/api";
import "./MetasModal.css";

export default function MetasModal({ aberto, fechar }) {

    const [metas, setMetas] = useState([]);

    async function carregar() {

        try {

            const token = localStorage.getItem("token");

            const { data } = await api.get("/metas", {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

            setMetas(data);

        } catch (erro) {

            console.error(erro);

        }

    }

    useEffect(() => {

        if (aberto) {

            carregar();

        }

    }, [aberto]);

    if (!aberto) return null;

    return (

        <div className="usuarios-overlay">

            <div className="usuarios-modal">

                <div className="usuarios-topo">

                    <h2>🎯 Metas por Loja</h2>

                    <button onClick={fechar}>✖</button>

                </div>

                <table>

                    <thead>

                        <tr>

                            <th>Loja</th>
                            <th>Meta Mensal</th>
                            <th>Sábado</th>
                            <th>Domingo</th>
                            <th>Feriados</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            metas.map((m) => (

                                <tr key={m.id}>

                                    <td>{m.loja}</td>

                                    <td>

                                        <input
                                            defaultValue={m.meta_mensal}
                                        />

                                    </td>

                                    <td>

                                        <input
                                            type="checkbox"
                                            defaultChecked={m.abre_sabado}
                                        />

                                    </td>

                                    <td>

                                        <input
                                            type="checkbox"
                                            defaultChecked={m.abre_domingo}
                                        />

                                    </td>

                                    <td>

                                        <input
                                            type="number"
                                            defaultValue={m.feriados}
                                        />

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}