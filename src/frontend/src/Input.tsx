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
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { useWallets } from "@web3-onboard/react";
import "../src/style.css";

interface IInputPropos {
    dappAddress: string; // Interface definindo a propriedade dappAddress como uma string
}
// Componente funcional de Input de usuário, transações, etc.
export const Input: React.FC<IInputPropos> = (propos) => {
    const rollups = useRollups(propos.dappAddress);
    //const [connectedWallet] = useWallets();
        //connectedWallet.provider

    //const provider = new ethers.providers.Web3Provider(connectedWallet.provider);

    const [formData, setFormData] = useState({
        method: '',
        addressToSend: '',
        _id: '',
        input: '',
        hexInput: false,
        receiver: '',
        product_id: '',
        price: '',
        timestamp: '',
        quantity: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: inputValue });
    };

    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, method: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let jsonData;
    
        if (formData.method === 'addNewUser') {
            jsonData = {
                method: 'addNewUser',
                data: formData.addressToSend
            };

        } else if (formData.method === 'deleteUser') {
            jsonData = {
                method: 'deleteUser',
                data: formData.addressToSend
            };

        } else if (formData.method === 'addNewTransaction') {
            jsonData = {
                method: 'addNewTransaction',
                data: {
                    receiver: formData.receiver,
                    _id: formData._id,
                    product_id: formData.product_id,
                    price: parseFloat(formData.price),
                    timestamp: (formData.timestamp),
                    quantity: parseFloat(formData.quantity)
                }
            };

        } else if (formData.method === 'validateTransaction') {
            jsonData = {
                method: 'validateTransaction',
                data: formData._id,
            };
        }
        
        // Recebe JSON e converte para string
        // Convertendo o objeto JSON para uma string antes de passá-lo para addInput
        const jsonString = JSON.stringify(jsonData);
        console.log(jsonString);
        addInput(jsonString);
    };

    const addInput = async (str: string) => {
        if (rollups) {
            try {
                let payload = ethers.utils.toUtf8Bytes(str);
                if (formData.hexInput) {
                    payload = ethers.utils.arrayify(str);
                }
                await rollups.inputContract.addInput(propos.dappAddress, payload);
            } catch (e) {
                console.log(`${e}`);
            }
        }
    };

    return (
        <div id="form">
            <form onSubmit={handleSubmit}>
                <label htmlFor="method">Selecione a ação:</label>
                <select id="method" name="method" value={formData.method} onChange={handleMethodChange}>
                    <option value="">Selecione...</option>
                    <option value="addNewUser">Adicionar Novo Usuário</option>
                    <option value="deleteUser">Deletar Usuário</option>
                    <option value="addNewTransaction">Adicionar Nova Transação</option>
                    <option value="validateTransaction">Validar Transação</option>
                </select><br />

                {formData.method === 'addNewUser' && (
                    <div id="usuario">
                        <label htmlFor="addressToSend">Carteira do novo usuário:</label>
                        <input
                            type="text"
                            id="inputUsuario"
                            name="addressToSend"
                            value={formData.addressToSend}
                            onChange={handleInputChange}
                        />
                        <br />
                    </div>
                )}

                {formData.method === 'deleteUser' && (
                    <div id="usuario">
                        <label htmlFor="addressToSend">Carteira do novo usuário:</label>
                        <input
                            type="text"
                            id="inputUsuario"
                            name="addressToSend"
                            value={formData.addressToSend}
                            onChange={handleInputChange}
                        />
                        <br />
                    </div>
                )}

                {formData.method === 'validateTransaction' && (
                    <div id="usuario">
                        <label htmlFor="_id">Id  da transação:</label>
                        <input
                            type="text"
                            id="validateTransaction"
                            name="validateTransaction"
                            value={formData._id}
                            onChange={handleInputChange}
                        />
                        <br />
                    </div>
                )}

                {formData.method === 'addNewTransaction' && (
                    <div id="transacao">
                        <label htmlFor="receiver">Carteira do receptor:</label>
                        <input
                            type="text"
                            id="receiver"
                            name="receiver"
                            value={formData.receiver}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="_id">Id da transação:</label>
                        <input
                            type="text"
                            id="_id"
                            name="_id"
                            value={formData._id}
                            onChange={handleInputChange}
                        />
                        <br />
                        
                        <label htmlFor="product_id">Código <a href="https://www.gs1br.org/codigos-e-padroes/padroes-de-identificacao/gtin-identificacao-de-produtos" id="linkGTIN">GTIN</a> do Produto:</label>
                        <input 
                            placeholder="123"
                            type="unit256"
                            id="product_id"
                            name="product_id"
                            value={formData.product_id}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="price">Preço:</label>
                        <input 
                            placeholder="123"
                            type="unit256"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                        />
                        <br />


                        <label htmlFor="quantity">Quantidade:</label>
                        <input 
                            placeholder="123"
                            type="unit256"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="timestamp">Data:</label>
                        <input 
                            placeholder="xx/xx/xxxx"
                            type="unit256"
                            id="timestamp"
                            name="timestamp"
                            value={formData.timestamp}
                            onChange={handleInputChange}
                        />
                    </div>
                )}

                <button id="enviarInput" type="submit" disabled={!rollups}>Enviar</button>
            </form>
        </div>
    );
};
