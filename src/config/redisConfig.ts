import Redis from "ioredis";
import log from "../config/logger";

const connetReddis = () => {
  try {
    if (process.env.REDIS_URL) {
      const redis_client = new Redis(process.env.REDIS_URL);
      console.log(redis_client)
      return redis_client;
    }else{
        return "error in REDIS_URL env variable"
    }
  } catch (ex) {
    log.error(`Exception connecting the reddis server ex:${ex}`);
    throw new Error("Error connecting reddis server");
  }
};

//@ts-ignore
export const reddis= new Redis(connetReddis());
