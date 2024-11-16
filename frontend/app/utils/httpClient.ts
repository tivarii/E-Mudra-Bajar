import axios from "axios";
import { Depth, KLine, Ticker, Trade, OrderType } from "./types";


// const BASE_URL = "https://exchange-proxy.100xdevs.com/api/v1";
const BASE_URL = "http://localhost:3000/api/v1";

export async function getTicker(market: string): Promise<Ticker> {
    market="TATA";
    const tickers = await getTickers();
    console.log(tickers);
    const ticker = tickers.find(t => t.symbol === market);
    if (!ticker) {
        throw new Error(`No ticker found for ${market}`);
    }
    return ticker;
}

export async function getTickers(): Promise<Ticker[]> {
    const response = await axios.get(`${BASE_URL}/tickers`);
    return response.data;
}

export async function getMarkets(): Promise<Ticker[]> {
    const response = await axios.get(`${BASE_URL}/markets`);
    return response.data;
}


export async function getDepth(market: string): Promise<Depth> {
    market="TATA_INR";
    const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
    return response.data;
}
export async function getTrades(market: string): Promise<Trade[]> {
    market="TATA";
    const response = await axios.get(`${BASE_URL}/trades?symbol=${market}`);
    return response.data;
}

export async function getKlines(market: string, interval: string, startTime: number, endTime: number): Promise<KLine[]> {
    market="TATA";
    const response = await axios.get(`${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
    const data: KLine[] = response.data;
    
    return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function orderRoute(quantity: string, price: string, side: "buy" | "sell"):Promise<any> {
    const output = {
        market: "TATA_INR",
        price: price,
        quantity: quantity,
        side: side,
        userId: (Math.random()>0.5)?"1":"5"
    }
    const response = await axios.post(`${BASE_URL}/order`,output);
    console.log(response.data);
    return response.data;
}