import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();  // Import the default export
const { Pool } = pkg; // Extract Pool from the imported package

const pool = new Pool({
     user: 'postgres.ppeuyexhesyvgovpcsbc',  // Your database username
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',  // Host URL
     database: 'postgres',  // Database name
  password: 'irfan2004',  // Replace with your actual password
  port: 6543,  // Port number                // default port for PostgreSQL
});

export default pool;
