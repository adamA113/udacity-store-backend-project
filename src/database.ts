import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
    POSTGRES_TEST_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    ENV,
} = process.env;

let client;

if (ENV === 'test') {
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        port: parseInt(POSTGRES_PORT || "5432"),
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    })
}

if (ENV === 'dev') {
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        port: parseInt(POSTGRES_PORT || "5432"),
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    })
}

export default client;