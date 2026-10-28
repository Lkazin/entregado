import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nrdbporbyujwtgnpiejz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZGJwb3JieXVqd3RnbnBpZWp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzE3NjI1MiwiZXhwIjoyMTA4NzUyMjUyfQ.14LuRaZIPmmRCyHz9uD6PiTajpH0ap5vGphW2_d0YrA';

async function checkSql() {
  // Test 1: fetch /pg endpoint or /rest/v1
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    }
  });
  console.log('Rest root status:', res.status);
  const data = await res.json();
  console.log('Available OpenAPI definitions/tables:', Object.keys(data?.definitions || {}));
}

checkSql().catch(console.error);
