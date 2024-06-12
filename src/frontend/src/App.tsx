// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.


// Importação para composição do front-end
import { FC } from "react";
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import { useState } from "react";
import { GraphQLProvider } from "./GraphQL";
import { Notices } from "./Notices";
import { Input } from "./Input";
import { Network } from "./Network";
import {Mean} from "./Mean"
import configFile from "./config.json";
import { Inspect } from "./Inspect";

// Carrega as configurações do arquivo JSON
const config: any = configFile;

// Inicializa a carteira MetaMask
const injected: any = injectedModule();
init({
    wallets: [injected], // Configura a carteira MetaMask
    chains: Object.entries(config).map(([k, v]: [string, any], i) => ({id: k, token: v.token, label: v.label, rpcUrl: v.rpcUrl})), // Configura as redes blockchain
    appMetadata: {
        name: "Cartesi Rollups Test DApp",
        icon: "<svg><svg/>",
        description: "Demo app for Cartesi Rollups",
        recommendedInjectedWallets: [
            { name: "MetaMask", url: "https://metamask.io" }, // Carteira recomendada é a MetaMask e a única disponível no momento
        ],
    },
});

// Componente principal do aplicativo
const App: FC = () => {
    // Estado para armazenar o endereço da Dapp
    const [dappAddress, setDappAddress] = useState<string>("0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C");
    const [inputDados, setInputDados] = useState(false);
    const [inspecionarElementos, setInspecionarElementos] = useState(false);
    const [media, setMedia] = useState(false);
    const [notificacao, setNotificacao] = useState(false);
    const [show, setShow] = useState({
        inputDados: false,
        inspecionarElementos:false,
        media:false,
        notificacao:false
    })

    function handleSetShow(componentName:any){
        setShow({
            inputDados: componentName === "inputDados" ? true : false,
            inspecionarElementos: componentName === "inspecionarElementos" ? true : false,
            media: componentName === "media" ? true : false,
            notificacao: componentName === "notificacao" ? true : false,
        })
    }

    return (
        <div>
            {/* Componente para exibir as informações na página */}
            <div>
                
                <Network />
                <GraphQLProvider>
                <header id="modal-header">
                    <button id="head" onClick={() => handleSetShow("inputDados")}>Input Dados</button>
                    <button id="head" onClick={() => handleSetShow("inspecionarElementos")}>Inspecionar Elementos</button>
                    <button id="head" onClick={() => handleSetShow("media")}>Média dos Produtos</button>
                    <button id="head" onClick={() => handleSetShow("notificacao")}>Notificações</button>
                </header>
        
                    {/* Componente inspect serve para visualizar informações, como por exemplo, usuários, transações, etc... */}
                    
                    {/* Componente Input serve para inserir dados na Dapp por meio de json */}
                    <div style={{display: "flex", alignItems:"center", justifyContent:"center"}}>
                        {
                            show.inputDados ? (
                                <div className="modal-content">
                                        <h2 id="input">Input de dados</h2>
                                        <Input dappAddress={dappAddress} />
                                </div>) : null
                        }
                        {
                            show.inspecionarElementos ? (
                                <div className="modal-content">
                                    <h2 id="inspect">Inspecionar dados</h2>
                                    <Inspect />
                                </div>) : null
                        }
                        {
                            show.media ? (
                                <div className="modal-content">
                                    {/* Componente Mean serve para calcular a média de preço de um produto */}
                                    <h2 id="mean">Média de preço</h2>
                                    <Mean />
                                </div>) : null
                        }
                        {
                            show.notificacao ? (
                                <div className="modal-content">
                                    {/* Componente para exibir avisos/notificações referente a todos os eventos que ocorreram na  Dapp */}
                                    <h2 id="notices">Notificações de eventos</h2>
                                    <Notices />
                                </div>) : null
                        }
                    </div>
                </GraphQLProvider>
            </div>
        </div>
    );
}; 
 

export default App;