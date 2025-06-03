import { Pool } from 'pg';
const connectionString = 'postgres://postgres:secret@localhost:5432/ecomm?sslmode=disable'
const pool = new Pool({
    connectionString,
    max: 10,
});

export const getDbConnection = async () => {
    return pool.connect();
};