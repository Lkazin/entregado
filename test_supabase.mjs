import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nrdbporbyujwtgnpiejz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZGJwb3JieXVqd3RnbnBpZWp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzE3NjI1MiwiZXhwIjoyMTA4NzUyMjUyfQ.14LuRaZIPmmRCyHz9uD6PiTajpH0ap5vGphW2_d0YrA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log('Testing connection to Supabase...');
  
  // Test querying orders table
  const { data: orders, error: ordersErr } = await supabase.from('orders').select('*').limit(5);
  console.log('Orders query result:', { orders, error: ordersErr?.message || ordersErr?.code });

  // Test querying motoboys table
  const { data: motoboys, error: motoboysErr } = await supabase.from('motoboys').select('*').limit(5);
  console.log('Motoboys query result:', { motoboys, error: motoboysErr?.message || motoboysErr?.code });
}

test().catch(console.error);
