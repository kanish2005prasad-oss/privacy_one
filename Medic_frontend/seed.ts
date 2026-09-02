import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

import { initialState } from './src/context/reducer';

async function seed() {
  console.log("Seeding global state data to Supabase app_state table...");
  
  const res = await supabase.from('app_state').upsert({
    id: 'global-demo-state',
    data: initialState
  });

  if (res.error) {
    console.error("Error seeding state:", res.error);
  } else {
    console.log("State seeded successfully!");
  }
}

seed().catch(console.error);
