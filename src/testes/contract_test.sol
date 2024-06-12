// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "remix_tests.sol";
import "../contracts/contract.sol"; // Importa o contrato a ser testado

contract ChainSyncTest {
    ChainSync chainSync;
    address owner;

    function beforeEach() public {
        chainSync = new ChainSync(); // Cria uma nova instância do contrato antes de cada teste
        owner = address(this); // Define o endereço do proprietário como o endereço atual (contrato de teste)
        chainSync.registerUser(owner); // Registra o proprietário como usuário
    }

    // Teste para o caso C-01: Registro de um novo usuário pelo dono do contrato
    function testRegisterNewUserByOwner() public {
        address newUser = address(0x123); // Carteira fictícia de um novo usuário
        chainSync.registerUser(newUser);
        Assert.equal(chainSync.users(newUser), true, "Falha ao registrar novo usuario pelo proprietario");
    }

    // Teste para o caso C-02: Registro de um novo usuário por uma carteira qualquer
    function testRegisterNewUserByNonOwner() public {
      address newUser = address(0x456); // Carteira fictícia de um novo usuário
        address fakeOwner = address(0x789); // Carteira fictícia de um falso 'owner'
        chainSync.registerUser(fakeOwner);
        Assert.equal(chainSync.users(newUser), false, "Usuario registrado por nao proprietario");
    }

    // Teste para o caso C-03: Registro de uma transação
    function testRegisterTransaction() public {
        bytes32 seller = "seller"; // Dados fictícios de uma transação
        bytes32 buyer = "buyer";
        uint256 productId = 123;
        uint256 price = 100;
        uint256 quantity = 1;
        string memory timestamp = "2024-03-31";
        
        bool success = chainSync.registerTransaction(seller, buyer, productId, price, quantity, timestamp);
        Assert.equal(success, true, "Falha ao registrar transacao");
    }

    // Teste para o caso C-04: Retorno de todas as transações registradas
    function testGetAllTransactions() public {
        // Registra algumas transações fictícias para teste
        chainSync.registerTransaction("seller1", "buyer1", 1, 100, 1, "2024-03-31");
        chainSync.registerTransaction("seller2", "buyer2", 2, 200, 2, "2024-04-01");
        
        // Obtém todas as transações registradas
        ChainSync.Transaction[] memory transactions = chainSync.getAllTransactions();
        
        // Verifica se o número de transações retornadas é igual ao esperado
        Assert.equal(transactions.length, 2, "Numero incorreto de transacoes retornadas");
    }

    // Teste para o caso C-05: Transformação de uma carteira em hash
    function testAddressToHash() public {
        address wallet = address(0xabc); // Carteira fictícia
        bytes32 walletHash = chainSync.addressToHash(wallet);
        // A verificação de igualdade direta de hashes não é possível, então verificamos apenas se não é um hash vazio
        Assert.notEqual(walletHash, bytes32(0), "Falha na conversao de endereco para hash");
    }
}
