// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;
contract ChainSync {

  // Mapeamento para verificar se um endereço é um usuário registrado
  mapping(address => bool) public users;
  // Endereço do proprietário do contrato
  address public owner;
  // Estrutura para representar uma transação
  struct Transaction {
    bytes32 seller;        // Hash do vendedor
    bytes32 buyer;         // Hash do comprador
    uint256 productId;     // Identificador do produto
    uint256 price;         // Preço do produto
    uint256 quantity;      // Quantidade do produto
    string timestamp;      // Carimbo de data e hora da transação
  }

  // Lista de transações registradas
  Transaction[] private transactions;
  // Construtor do contrato, é executado ao fazer o deploy
  constructor() {
    owner = msg.sender;   // O criador do contrato é o proprietário inicial
  }

  // Função para registrar um novo usuário no contrato
  function registerUser(address _user) public {
    require(msg.sender == owner, "Apenas o proprietario pode registrar usuarios");
    users[_user] = true;  // Marcar o usuário como registrado
  }

  // Função para registrar uma nova transação
  function registerTransaction(bytes32 _seller, bytes32 _buyer, uint256 _productId, uint256 _price, uint256 _quantity, string memory _timestamp) external returns (bool) {
    require(users[msg.sender], "Somente usuarios podem registrar transacoes");
    require(_seller != _buyer, "O comprador e o vendedor nao podem ser a mesma pessoa");
    Transaction memory transaction = Transaction({
        seller: _seller,
        buyer: _buyer,
        productId: _productId,
        price: _price,
        quantity: _quantity,
        timestamp: _timestamp
    });
    transactions.push(transaction);  // Adicionar a transação à lista de transações
    return true;
  }

  // Função para obter todas as transações registradas
  function getAllTransactions() external view returns (Transaction[] memory) {
    require(users[msg.sender], "Somente usuarios podem visualizar as transacoes");
    return transactions;  // Retornar a lista de transações
  }
  
  // Função para converter um endereço em sua representação hash
  function addressToHash(address _address) public pure returns (bytes32){
    return keccak256(abi.encodePacked(_address));
  }
}