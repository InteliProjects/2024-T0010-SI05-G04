// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { FC, useState } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "./config.json";
import React from "react";
import "../src/style.css";
import logo from "../src/img/Logo.png";

const config: any = configFile;

// Componente funcional Network que não recebe props
export const Network: FC = () => {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet(); // Hooks para gerenciar a conexão e desconexão da carteira
    const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();  // Hooks para gerenciar a seleção e configuração da cadeia blockchain
    const [exibirModal, setExibirModal] = useState(false); // Estado para controlar a exibição do modal

    const alternarModal = () => setExibirModal(!exibirModal); // Função para alternar a visibilidade do modal

    return (    
        <div>
            {!wallet && (
                <div id="home">
                    {/* Exibe a logo da Cartesi */}
                    <img
                        src={logo}
                        id="logo"
                        alt="Logo da Cartesi"
                    />
                    <button id="connect" onClick={() => connect()}>
                        {connecting ? "Conectando..." : "Conectar carteira"}
                    </button>
                    {/* Botão para exibir o modal */}
                    <button id="ajuda" onClick={alternarModal}>Ajuda?</button>
                </div>
            )}  

            {wallet && (
                <div>
                    <label id="switch">Switch chain</label>
                    {settingChain ? (
                        <span>Switching chain...</span>
                    ) : (
                        // Verifica se a cadeia selecionada está definida na configuração
                        <select id="select"
                            onChange={({ target: { value } }) => {
                                if (config[value] !== undefined) {
                                    setChain({ chainId: value })
                                } else {
                                    alert("No deploy on this chain")
                                }
                            }}
                            value={connectedChain?.id}
                        >
                            {/* Mapeia as cadeias disponíveis para seleção */}
                            {chains.map(({ id, label }) => (
                                <option key={id} value={id}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    )}
                    {/* Botão para desconectar a carteira */}
                    <button id="disconnect" onClick={() => disconnect(wallet)}>
                        Desconectar carteira
                    </button>
                </div>
            )}

            {/* Modal */}
            {/* Modal */}
            {exibirModal && (
                <div className="popup-backdrop">
                    <div className="popup-content">
                        <h2>Por que você precisa de uma carteira Metamask?</h2>
                        <p>Uma carteira Metamask é essencial para interagir com nossa plataforma baseada em blockchain por três razões principais:</p>
                        <ul>
                            <p id="topico"><strong>1. Segurança:</strong></p>
                                <li>Mantenha o controle total de seus fundos em sua própria carteira, não em um servidor centralizado.</li>
                            <p id="topico"><strong>2. Interoperabilidade com a Web3:</strong></p>
                                <li>Facilita a interação segura com aplicativos e sites baseados em blockchain.</li>
                            <p id="topico"><strong>3. Facilidade de uso:</strong></p>
                                <li>Configuração simples e transações fáceis com criptomoedas e tokens.</li>
                        </ul>
                        <p id="final">Para começar, basta baixar a extensão Metamask, criar sua conta e você estará pronto para usar nossa plataforma com segurança e facilidade. Adquira sua carteira Metamask <a href="https://metamask.io/" target="_blank">aqui!</a></p>
                        <button id="modal-botao"onClick={alternarModal}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
};
