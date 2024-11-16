import { createClient, } from "redis";
import { Engine } from "./trade/Engine";
import { configDotenv } from "dotenv";
configDotenv();


async function main() {
    const engine = new Engine(); 
    const redisClient = createClient();
    await redisClient.connect();
    console.log("connected to redis");
    // console.log(`snashot is ${process.env.WITH_SNAPSHOT}`);
    while (true) {
        const response = await redisClient.rPop("messages" as string)
        if (!response) {

        }  else {
            console.log(JSON.stringify(response));
            engine.process(JSON.parse(response));
        }        
    }

}

main();