import { createClient } from "redis";

async function main() {
    const redisClient = createClient();
    await redisClient.connect();
    while(true){
        const response = await redisClient.rPop("message" as string );
        if(response){
            
        }
    }
    
}