import React, { useState, useEffect } from "react";
import { useSetChain } from "@web3-onboard/react";
import configFile from "./config.json";

const config: any = configFile;

export const Mean: React.FC = () => {
    const [{ connectedChain }] = useSetChain();
    const [product_id, setProductId] = useState<string>("");
    const [meanPrice, setMeanPrice] = useState<string | null>(null); 
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (meanPrice !== null) {
            setError(""); // Limpa o erro quando um preço válido é obtido
        }
    }, [meanPrice]);

    const inspectCall = async () => {
        if (!connectedChain) {
            setError("No connected chain");
            return;
        }

        let apiURL = "";

        if (config[connectedChain.id]?.inspectAPIURL) {
            apiURL = `${config[connectedChain.id].inspectAPIURL}/inspect`;
        } else {
            setError(`No inspect interface defined for chain ${connectedChain.id}`);
            return;
        }

        try {
            const response = await fetch(`${apiURL}/mean/${product_id}`);
            const data = await response.json();

            if (data && data.reports && data.reports.length > 0) {
                const payloadHex = data.reports[0].payload;
                const payloadString = hexToAscii(payloadHex);
                
                if (payloadString.includes('nan')) {
                    setError("Não há registro desse produto.");
                    setMeanPrice(null);
                } else {
                    setMeanPrice(payloadString);
                }
            } else {
                setError("Não há registros desse produto.");
                setMeanPrice(null);
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Erro ao obter o preço médio do produto.");
            setMeanPrice(null);
        }
    };

    const hexToAscii = (hex: string): string => {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            const charCode = parseInt(hex.substr(i, 2), 16);
            str += String.fromCharCode(charCode);
        }
        return str;
    };

    return (
        <div>
            <div>
                <label htmlFor="product_id">Código GTIN do produto:</label>
                <input
                    type="text"
                    id="product_id"
                    name="product_id"
                    value={product_id}
                    onChange={(e) => setProductId(e.target.value)}
                />
                <button onClick={inspectCall} id="enviarmean">
                    Calcular Preço Médio
                </button>
            </div>
            {meanPrice !== null ? (
                <p id="precoMedio">Preço Médio Calculado: {meanPrice}</p>
            ) : (
                <p>{error}</p>
            )}
        </div>
    );
};
