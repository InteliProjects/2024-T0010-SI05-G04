// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { useSetChain } from "@web3-onboard/react";
import React, { useMemo } from "react";
import { Client, createClient, Provider } from "urql";

import configFile from "./config.json";

// Carrega o arquivo JSON
const config: any = configFile;

// Hook personalizado para configurar o usuário GraphQL com base na cadeia blockchain conectada
const useGraphQL = () => {
    // Obtém a cadeia blockchain conectada usando o hook useSetChain
    const [{ connectedChain }] = useSetChain();
    // Utiliza useMemo para memorizar o usuáio e evitar recriações desnecessárias
    return useMemo<Client | null>(() => {
        // Verifica se há uma cadeia conectada
        if (!connectedChain) {
            return null;
        }
        let url = "";
        // Verifica se há uma URL GraphQL configurada para a cadeia conectada
        if(config[connectedChain.id]?.graphqlAPIURL) {
            url = `${config[connectedChain.id].graphqlAPIURL}/graphql`;
        } else {
            // Se não houver uma URL configurada, exibe um erro no console e retorna null
            console.error(`No GraphQL interface defined for chain ${connectedChain.id}`);
            return null;
        }
        // Se a URL não estiver definida, retorna null
        if (!url) {
            return null;
        }
        // Cria e retorna o usuário usando a URL configurada
        return createClient({ url });
    }, [connectedChain]);
};

// Componente GraphQLProvider que fornece o usuário para os componentes filhos
export const GraphQLProvider: any = (props: any) => {
    // Obtém o usuário usando o hook useGraphQL
    const client = useGraphQL();
    // Se o usuário não estiver disponível, retorna um elemento vazio
    if (!client) {
        return <div />;
    }
    // Se o usuário estiver disponível, fornece o cliente GraphQL usando o Provider do URQL
    return <Provider value={client}>{props.children}</Provider>;
};

