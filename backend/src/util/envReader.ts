import * as dotenv from 'dotenv';

interface EnvironmentSchema {
    MongoConnectionUri: string,
    SessionSecret: string,
    Port: number
}

export function readEnv() : EnvironmentSchema {
    dotenv.config();

    if (!process.env.MONGO_CONNECTION_URI) throw new Error("Mongo Connection URI Not Present or Improperly Set In Environment");
    if (!process.env.SESSION_SECRET) throw new Error("Session secret missing")
    if (!process.env.PORT) throw new Error("Port declaration missing")

    return {
        MongoConnectionUri: process.env.MONGO_CONNECTION_URI,
        SessionSecret: process.env.SESSION_SECRET,
        Port: parseInt(process.env.PORT)
    }
}
