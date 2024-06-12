# Cartesi frontend web

```
Cartesi Rollups version: 1.0.x
```

## Recursos

Com este projeto, você pode testar algumas interações com o projeto Cartesi Rollups:

1. Integração com Metamask
2. Enviar solicitações de inspeção de dados
3. Enviar Endereço DApp
4. Enviar entradas (usuários, transações, etc.)
5. Cálculo do preço médio das transações

## Arquivos relacionados ao Frontend e suas funções

|-> src <br>
    &emsp;|-> App.tsx: Inicializa a carteira Metamask e carrega a estrutura básica da página <br>
    &emsp;|-> GraphQl.tsx: Hook para consultar os dados referentes a rede blockchain conectada <br>
    &emsp;|-> index.tsx: Cria um root para a aplicação Frontend <br>
    &emsp;|-> Input.tsx: Componente responsável por realizar input de dados na rede blockchain <br>
    &emsp;|-> Inspect.tsx: Componente responsável pelo get e visualização dos dados <br>
    &emsp;|-> Network.tsx: Componente da Homepage que gerencia a conexão da carteira Metamask e da rede blockchain <br> 
    &emsp;|-> Notices.tsx: Componente que armazena e notifica todos os eventos da rede blockchain <br>
    &emsp;|-> useRollups.tsx: Realiza a conexão com os contratos rollups <br>
    &emsp;|-> style.css: Estilização dos componentes do frontend <br>

## Configuração

Edite src/config.json para definir os parâmetros e implantação de testnet, endereços de inspeção, graphql, rpc.

## Comandos para executar a aplicação localmente

No diretório do projeto, execute:

```shell
yarn
yarn codegen
```

para construir o aplicativo.

```shell
yarn start
```

Executa o aplicativo no modo de desenvolvimento.\
Abra: [http://localhost:3000](http://localhost:3000) para visualizá-lo no navegador.

