# O código em questão foi baseado no repositório público:
# https://github.com/Mugen-Builders/inteli-cartesi/tree/main
# Ao longo do desenvolvimento do projeto serão feitas mais modificações e adptações
# Importando as bibliotecas necessárias para fazer as leituras do frontend
from os import environ
import logging
import requests
import numpy as np
import json
import traceback


# Define as requisições de uma transação
class Transaction:
    def __init__(self, _id: str, sender: str, receiver: str, product_id: str, price: int, timestamp: int, quantity: int):
        self.id = _id
        self.sender = sender
        self.receiver = receiver
        self.product_id = product_id
        self.price = price
        self.price_unit= price / quantity
        self.timestamp = timestamp
        self.quantity = quantity

    def to_dict(self):
        return {
            "id": self.id,
            "sender": self.sender,
            "receiver": self.receiver,
            "product_id": self.product_id,
            "price": self.price,
            "price_unit": self.price_unit,
            "quantity": self.quantity,
            "timestamp": self.timestamp
        }
    
    
# Dono do contrato hardcoded, uma vez que o dono seria apenas a Alliance
owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
# Listas para registrar as informações enviadas pelo frontend
confirmed_transactions = []
not_confirmed_transactions = []
users = []


logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)
rollup_server = environ.get(
    "ROLLUP_HTTP_SERVER_URL", "http://127.0.0.1:8080/rollup")
logger.info(f"HTTP rollup_server url is {rollup_server}")


# Funções para transformar os dados enviados pela blockchain que vem em hexa para string e outras utilidades
def str2hex(string):
    return binary2hex(str2binary(string))

def str2binary(string):
    return string.encode("utf-8")

def binary2hex(binary):
    return "0x" + binary.hex()

def hex2binary(hexstr):
    return bytes.fromhex(hexstr[2:])

def hex2str(hexstr):
    return hex2binary(hexstr).decode("utf-8")

# Funções de HTTP API
def send_notice(notice: str) -> None:
    send_post("notice", notice)

def send_report(report: str) -> None:
    send_post("report", report)

def send_post(endpoint, json_data) -> None:
    response = requests.post(rollup_server + f"/{endpoint}", json=json_data)
    logger.info(
        f"/{endpoint}: Received response status {response.status_code} body {response.content}")
def handle_advance(data):
    # Registra uma mensagem informando sobre a solicitação de avanço recebida e quem a enviou.
    logger.info(f"Receiving advance request with data {hex2str(data['payload'])} from {data['metadata']['msg_sender']}")
    # Converte os dados hexadecimais recebidos em uma string.
    binary = hex2str(data['payload'])
    # Converte a string binária em um objeto JSON.
    json_data = json.loads(binary)
    # Registra os dados JSON recebidos.
    logger.info(f"Received json data {json_data}")
    try:
        # Verifica o método da solicitação e realiza ações com base nele.
        if json_data["method"] == "addNewUser" and data["metadata"]["msg_sender"] == owner.lower():
            # Adiciona um novo usuário à lista de usuários.
            users.append(json_data["data"])
            # Envia um aviso sobre a adição do novo usuário.
            notice_payload = {"payload": str2hex(f'Add new user {data["payload"]} to the list of users')}
            send_notice(notice_payload)
            # Retorna "accept" para indicar que a solicitação foi aceita.
            return "accept"
        
        # Verifica o método em questão (Deletaer usuário) e em seguida
        elif json_data["method"] == "deleteUser" and data["metadata"]["msg_sender"] == owner.lower():
            users.remove(json_data["data"])
            notice_payload = {"payload": str2hex(f'Delete user {data["payload"]} from the list of users')}
            send_notice(notice_payload)
            return "accept"

        elif json_data["method"] == "addNewTransaction":
            # Cria uma nova transação e a adiciona à lista de transações não confirmadas.
            tx = Transaction(
                _id= json_data["data"]["id"],
                sender= data["metadata"]["msg_sender"],
                receiver= json_data["data"]["receiver"].lower(),
                product_id= json_data["data"]["product_id"],
                price= json_data["data"]["price"],
                timestamp= json_data["data"]["timestamp"],
                quantity= json_data["data"]["quantity"]
            )
            not_confirmed_transactions.append(tx)
            # Envia um aviso sobre a nova transação.
            notice_payload = {"payload": str2hex(f'Add new transaction {data["payload"]} to the list of not confirmed transactions')}
            send_notice(notice_payload)
            # Retorna "accept" para indicar que a solicitação foi aceita.
            return "accept"

        
        elif json_data['method'] == "validateTransaction":
            for transaction in not_confirmed_transactions:
                if str(transaction.id) == str(json_data["data"]):
                    if str(transaction.receiver) == str(data["metadata"]["msg_sender"]):
                        not_confirmed_transactions.remove(transaction)
                        confirmed_transactions.append(transaction)
                        notice_payload = {"payload": str2hex(f'Transaction {data["payload"]} confirmed')}
                        send_notice(notice_payload)
            return "accept"
        
    except Exception as e:
        msg = f"Error {e} processing data {data}"
        logger.error(f"{msg}\n{traceback.format_exc()}")
        send_report({"payload": str2hex(msg)})
        return "reject"
    

def handle_inspect(data):
    # Função para lidar com solicitações de inspeção
    logger.info(f"Received inspect request data {data}")
    # Converte a carga útil hexadecimal em uma string
    binary = hex2str(data['payload'])
    try:
        # Verifica se a solicitação é para obter dados de todos os usuários
        if binary == "users":
            # Se sim, reunir dados de todos os usuários
            users_data = ",".join(users)
            report_payload = {"all_users": f"{users_data}"}
            # Enviar relatório de volta após converter para hexadecimal
            send_report({"payload": str2hex(f'{report_payload}')})
            return "accept"
        
        # Verifica se a solicitação é para obter transações confirmadas
        if binary == "transactions/confirmed":
            # Se sim, reunir dados de todas as transações confirmadas
            confirmed_transactions_data = [transaction.to_dict() for transaction in confirmed_transactions]
            report_payload = {"confirmed_transactions": f"{confirmed_transactions_data}"}
            # Enviar relatório de volta após converter para hexadecimal
            send_report({"payload": str2hex(f'{report_payload}')})
            return "accept"
        
        # Verifica se a solicitação é para obter transações não confirmadas
        if binary == "transactions/not_confirmed":
            # Se sim, reunir dados de todas as transações não confirmadas
            not_confirmed_transactions_data = [transaction.to_dict() for transaction in not_confirmed_transactions]
            report_payload = {"not_confirmed_transactions": f"{not_confirmed_transactions_data}"}
            # Envia relatório de volta após converter para hexadecimal
            send_report({"payload": str2hex(f'{report_payload}')})
            return "accept"
        
        if binary.split('/')[0] == 'mean':
            product_id = binary.split('/')[1]
            transaction_by_product_id = [transaction.to_dict(
            ) for transaction in confirmed_transactions if transaction.product_id == product_id]
            prices_by_id = [entry['price_unit']
                            for entry in transaction_by_product_id]
            mean_price_by_product_id = np.mean(prices_by_id)
            report_payload = {"product_id": f"{product_id}",
                              "mean_price": f"{mean_price_by_product_id}"}
            send_report({"payload": str2hex(str(report_payload))})
            return "accept"
    
    except Exception as e:
        # Exceções, registrar e enviar um relatório de erro
        msg = f"Error {e} processing data {data}"
        logger.error(f"{msg}\n{traceback.format_exc()}")
        send_report({"payload": str2hex(msg)})
        return "reject"
    
# Mapeamento das funções de tratamento para diferentes tipos de solicitações
handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

# Configuração do loop principal da Cartesi
while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])
