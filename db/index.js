import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();  // Import the default export
const { Pool } = pkg; // Extract Pool from the imported package

const pool = new Pool({
    user: postgres,         // PostgreSQL username
    host: localhost,         // PostgreSQL host (usually 'localhost')
    database:localhost,     // PostgreSQL database name
    password: localhost, // PostgreSQL password
    port:localhost,                  // default port for PostgreSQL
});

export default pool;
