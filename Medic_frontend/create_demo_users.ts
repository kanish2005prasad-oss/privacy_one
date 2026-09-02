import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const demoUsers = [
  {
    email: 'patient@demo.com',
    password: 'Password123!',
    data: { full_name: 'Alex Mercer (Patient)', role: 'patient' }
  },
  {
    email: 'doctor@demo.com',
    password: 'Password123!',
    data: { full_name: 'Dr. Sarah Chen, MD', role: 'doctor', organization: 'Metro General Hospital', license_number: 'MD-94821' }
  },
  {
    email: 'pharmacy@demo.com',
    password: 'Password123!',
    data: { full_name: 'David Hayes, RPh', role: 'pharmacy', organization: 'CVS Caremark Central', license_number: 'RPH-30219' }
  }
];

async function createDemoUsers() {
  console.log("Creating demo users in Supabase...");
  for (const u of demoUsers) {
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
      options: { data: u.data }
    });
    if (error) {
      console.log(`User ${u.email}:`, error.message);
    } else {
      console.log(`User ${u.email} created / verified: ID =`, data.user?.id);
    }
  }
}

createDemoUsers().catch(console.error);
