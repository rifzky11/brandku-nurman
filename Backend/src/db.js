const { createClient } = require('@supabase/supabase-js');
const postgres = require('postgres');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const databaseUrl = process.env.DATABASE_URL;

// Inisialisasi Supabase JS Client
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Inisialisasi PostgreSQL Client (postgres.js)
let sql = null;
if (databaseUrl) {
  sql = postgres(databaseUrl, {
    ssl: 'require',
  });
}

module.exports = {
  supabase,
  sql,
};
