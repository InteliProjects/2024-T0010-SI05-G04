// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React from "react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { createRoot } from 'react-dom/client'; // Importa a função createRoot de ReactDOM para criar a raiz da aplicação

// Obtém o elemento do DOM onde a aplicação será renderizada
const container = document.getElementById('root');

// Cria um root para a aplicação, utilizando o elemento obtido
const root = createRoot(container!); // O operador "!" é usado para garantir que o elemento container não seja nulo

// Renderiza o componente na raiz da aplicação
root.render(
    <React.StrictMode> {/* Ativa o modo estrito do React para identificar potenciais problemas */}
        <App /> {/* Renderiza o componente principal da aplicação */}
    </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
