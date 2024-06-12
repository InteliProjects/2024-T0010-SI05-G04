// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { ethers } from "ethers";
import React from "react";
import { useNoticesQuery } from "./generated/graphql";
import "../src/style.css";

type Notice = {
    id: string; // Identificador da notificação
    index: number; // Índice da notificação
    input: any, //{index: number; epoch: {index: number; }
    payload: string; // Carga útil da notificação
};

// Componente funcional Notices
export const Notices: React.FC = () => { 
    const [result,reexecuteQuery] = useNoticesQuery(); // Hook para obter as notificações e a função para reexecutar a query
    const { data, fetching, error } = result; // Desestruturação dos dados obtidos do hook

    // Verifica se os dados estão sendo buscados, caso positivo, exibe "Loading..."
    if (fetching) return <p>Loading...</p>;
    // Verifica se ocorreu um erro durante a busca, caso positivo, exibe a mensagem de erro
    if (error) return <p>Oh no... {error.message}</p>;

    // Verifica se não há dados ou se não há notificações, caso sim, exibe uma mensagem indicando a ausência de notificações
    if (!data || !data.notices) return <p>No notices</p>;

    // Mapeia os dados das notificações para o formato definido pelo tipo Notice
    const notices: Notice[] = data.notices.edges.map((node: any) => {
        const n = node.node;
        let inputPayload = n?.input.payload;
        // Converte a carga útil da entrada para uma string legível
        if (inputPayload) {
            try {
                inputPayload = ethers.utils.toUtf8String(inputPayload);
            } catch (e) {
                inputPayload = inputPayload + " (hex)";
            }
        } else {
            inputPayload = "(empty)";
        }
        let payload = n?.payload;
        // Converte a carga útil da notificação para uma string legível
        if (payload) {
            try {
                payload = ethers.utils.toUtf8String(payload);
            } catch (e) {
                payload = payload + " (hex)";
            }
        } else {
            payload = "(empty)";
        }
        return {
            id: `${n?.id}`, // Identificador da notificação
            index: parseInt(n?.index), // Índice da notificação
            payload: `${payload}`, // Carga útil da notificação
            input: n ? {index:n.input.index,payload: inputPayload} : {}, // Informações sobre a entrada associada à notificação
        };
    }).sort((b: any, a: any) => { // Ordena as notificações com base no índice da entrada e da notificação
        if (a.input.index === b.input.index) {
            return b.index - a.index;
        } else {
            return b.input.index - a.input.index;
        }
    });

    // Retorna o JSX que representa o componente Notices
    return (
        <div id="divnotices" >
            {/* Botão para recarregar as notificações */}
            <button id="recarregar2" onClick={() => reexecuteQuery({ requestPolicy: 'network-only' })}>
                Recarregar
            </button>
            {/* Tabela para exibir as notificações */}
            <table>
                <thead>
                    <tr>
                        <th>Input Index</th>
                        <th>Notice Index</th>
                        <th>Payload</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Verifica se não há notificações, caso positivo, exibe uma mensagem indicando a ausência de notificações */}
                    {notices.length === 0 && (
                        <tr>
                            <td colSpan={4}>no notices</td>
                        </tr>
                    )}
                    {/* Mapeia e exibe as notificações */}
                    {notices.map((n: any) => (
                        <tr key={`${n.input.index}-${n.index}`}>
                            <td >{n.input.index}</td> {/* Exibe o índice da entrada associada à notificação */}
                            <td >{n.index}</td> {/* Exibe o índice da notificação */}
                            {/* <td>{n.input.payload}</td> */}
                            <td style={{ maxWidth: '950px', whiteSpace:"normal", border: '1px solid #A5C3FF', borderRadius:"10px",padding: '1vh'}}>{n.payload}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};    