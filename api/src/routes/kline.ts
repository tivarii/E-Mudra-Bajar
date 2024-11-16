import { Client } from 'pg';
import { Request, Response, Router } from "express";

const pgClient = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
});
pgClient.connect();

export const klineRouter = Router();

interface KlineQueryParams {
    market?: string;
    interval?: '1m' | '1h' | '1w';
    startTime?: string;
    endTime?: string;
}
const handler = async (req:any,res:any) => {
    const { interval, startTime, endTime } = req.query;
    

    // Validate query parameters
    if (!interval || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const start = new Date(Number(startTime) * 1000);
    const end = new Date(Number(endTime) * 1000);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Invalid start or end time' });
    }

    // Table mapping based on interval
    const tableMap: Record<string, string> = {
        '1m': 'klines_1m',
        '1h': 'klines_1h',
        '1w': 'klines_1w',
    };

    const tableName = tableMap[interval];
    if (!tableName) {
        return res.status(400).json({ error: 'Invalid interval' });
    }

    const query = `SELECT * FROM ${tableName} WHERE bucket >= $1 AND bucket <= $2`;

    try {
        const result = await pgClient.query(query, [start, end]);
        
        // Map result rows to a structured response
        const response = result.rows.map(row => ({
            close: row.close,
            end: row.bucket,
            high: row.high,
            low: row.low,
            open: row.open,
            quoteVolume: row.quoteVolume,
            start: row.start,
            trades: row.trades,
            volume: row.volume,
        }));

        res.json(response);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
klineRouter.get("/",handler );