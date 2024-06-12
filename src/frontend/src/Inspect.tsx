// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React, { useState } from "react";
import { useSetChain } from "@web3-onboard/react";
import { ethers } from "ethers";
// import { useRollups } from "./useRollups";
import "../src/style.css";

import configFile from "./config.json";

// Configuração que armazena os detalhes da página
const config: any = configFile; 

// Componente funcional Inspect que permite a visualização dos dados
export const Inspect: React.FC = () => {
    const [{ connectedChain }] = useSetChain(); // Hook que obtém informações sobre a cadeia blockchain conectada
    const inspectCall = async (str: string) => { // Função assíncrona para realizar a chamada do Inspect
        let payload = str;
        // Se hexData estiver ativado, converte a carga útil em bytes hexadecimais
        if (hexData) {
            const uint8array = ethers.utils.arrayify(str);
            payload = new TextDecoder().decode(uint8array);
        }
        if (!connectedChain){
            return;
        }
        
        let apiURL= ""

        // Verifica se há uma URL de inspeção definida para a cadeia conectada
        if(config[connectedChain.id]?.inspectAPIURL) {
            apiURL = `${config[connectedChain.id].inspectAPIURL}/inspect`;
        } else {
            console.error(`No inspect interface defined for chain ${connectedChain.id}`);
            return;
        }
        
        let fetchData: Promise<Response>;
        // Verifica se a inspeção deve ser feita via POST ou GET
        if (postData) {
            const payloadBlob = new TextEncoder().encode(payload);
            fetchData = fetch(`${apiURL}`, { method: 'POST', body: payloadBlob });
        } else {
            fetchData = fetch(`${apiURL}/${payload}`);
        }
        // Faz a chamada à API de inspeção e atualiza os estados com os resultados
        fetchData
            .then(response => response.json())
            .then(data => {
                setReports(data.reports);
                setMetadata({metadata:data.metadata, status: data.status, exception_payload: data.exception_payload});
            });
    };
    const [inspectData, setInspectData] = useState<string>(""); 
    const [reports, setReports] = useState<string[]>([]); 
    const [metadata, setMetadata] = useState<any>({}); 
    const [hexData, setHexData] = useState<boolean>(false);
    const [postData, setPostData] = useState<boolean>(false); 

    // Retorna o JSX que representa o componente Inspect
    return (
        <div>
            {/* Campo de entrada para os dados de inspeção */}
            <div id="divinspect">
                <input id="inspectinput"
                    type="text"
                    value={inspectData}
                    onChange={(e) => setInspectData(e.target.value)}
                />
                {/* Botão para iniciar a chamada de inspeção */}
                <button id="enviarinspect" onClick={() => inspectCall(inspectData)}>
                    Enviar
                </button>
            </div>
    
            {/* Tabela para exibir os metadados e status da inspeção */}
            <table id="table">
                <thead>
                    <tr>
                        <th>Índice</th>
                        <th>Índice de entrada atual</th>
                        <th>Status</th>
                        <th>Carga útil</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {/* Exibe os metadados e status da inspeção */}
                        <td>{metadata.metadata ? metadata.metadata.active_epoch_index : ""}</td>
                        <td>{metadata.metadata ? metadata.metadata.current_input_index : ""}</td>
                        <td>{metadata.status}</td>
                        <td>{metadata.exception_payload ? ethers.utils.toUtf8String(metadata.exception_payload): ""}</td>
                    </tr>
                </tbody>
            </table>
    
            {/* Tabela para exibir os relatórios resultantes da inspeção */}
            <table id="table2">
                <tbody>
                    {/* Verifica se não há relatórios */}
                    {reports?.length === 0 && (
                        <tr>
                            <td colSpan={4}>Sem dados</td>
                        </tr>
                    )}
                    {/* Mapeia e exibe os relatórios */}
                    {reports?.map((n: any) => (
                        <tr key={`${n.payload}`}>
                            <td>{ethers.utils.toUtf8String(n.payload)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};  