import axios from "axios";

const BASE_URL = "http://localhost:3000";
const TOTAL_BIDS = 30;
const TOTAL_ASK = 30;
const MARKET = "TATA_INR";
const USER_ID = "5";

async function main() {
    const price = 1000 + Math.random() * 10;
    const openOrders = await axios.get(`${BASE_URL}/api/v1/order/open?userId=${Math.random()<0.5?"5":"1"}&market=${MARKET}`);

    const totalBids = openOrders.data.filter((o: any) => o.side === "buy").length;
    const totalAsks = openOrders.data.filter((o: any) => o.side === "sell").length;

    const cancelledBids = await cancelBidsMoreThan(openOrders.data, price);
    const cancelledAsks = await cancelAsksLessThan(openOrders.data, price);


    let bidsToAdd = TOTAL_BIDS - totalBids - cancelledBids;
    let asksToAdd = TOTAL_ASK - totalAsks - cancelledAsks;

    // console.log(`ask : ${asksToAdd} \n bids: ${bidsToAdd}`)
    while(bidsToAdd > 0 || asksToAdd > 0) {
        console.log(`ask : ${asksToAdd} \n bids: ${bidsToAdd}`)
        if (bidsToAdd > 0) {
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: (price - Math.random() * 1).toFixed(1).toString(),
                quantity: "1",
                side: "buy",
                userId: Math.random()<0.5?"5":"1"
            });
            bidsToAdd--;
        }
        if (asksToAdd > 0) {
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: (price + Math.random() * 1).toFixed(1).toString(),
                quantity: "1",
                side: "sell",
                userId: Math.random()<0.5?"5":"1"
            });
            asksToAdd--;
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("calling");
}

async function cancelBidsMoreThan(openOrders: any[], price: number) {
    let promises: any[] = [];
    for(let i=0;i<openOrders.length;i++){
        const o=openOrders[i];
        if (o.side === "buy" && (o.price > price || Math.random() < 0.5)) {
            promises.push(axios.delete(`${BASE_URL}/api/v1/order`, {
                data: {
                    orderId: o.orderId,
                    market: MARKET
                }
            }));
            break;
        }
    }
    await Promise.all(promises);
    return promises.length;
}

async function cancelAsksLessThan(openOrders: any[], price: number) {
    let promises: any[] = [];
    for(let i=0;i<openOrders.length;i++){
        const o=openOrders[i];
        if (o.side === "sell" && (o.price < price || Math.random() < 0.5)) {
            promises.push(axios.delete(`${BASE_URL}/api/v1/order`, {
                data: {
                    orderId: o.orderId,
                    market: MARKET
                }
            }));
            break;
        }
    }
    await Promise.all(promises);
    return promises.length;
}

setInterval(()=>{
    main();
},1000*2);
