"use client"

import { useEffect,useState } from "react"
import { Ticker } from "../utils/types"


export const Markets =()=>{
    const [tickers,setTickers] = useState<Ticker[]>();
    useEffect(()=>{
        getTickers.then((m)=> setTickers(m));
    },[]);
}