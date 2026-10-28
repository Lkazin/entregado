const SUPABASE_URL = 'https://nrdbporbyujwtgnpiejz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZGJwb3JieXVqd3RnbnBpZWp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzE3NjI1MiwiZXhwIjoyMTA4NzUyMjUyfQ.14LuRaZIPmmRCyHz9uD6PiTajpH0ap5vGphW2_d0YrA';

async function testEndpoints() {
  const endpoints = [
    '/pg/v1/query',
    '/pg/query',
    '/rest/v1/rpc/exec_sql',
    '/database/query'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${SUPABASE_URL}${ep}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ query: 'SELECT 1;' })
      });
      console.log(ep, res.status, await res.text());
    } catch (e) {
      console.log(ep, 'Error:', e.message);
    }
  }
}

testEndpoints();
