import { createClient } from '@supabase/supabase-js';

// Menggunakan variabel lingkungan yang diawali dengan VITE_
const supabaseUrl = 'https://rtbodpbrpyhskfdguqsw.supabase.co';
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Ym9kcGJycHloc2tmZGd1cXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzQ1Mzg0OCwiZXhwIjoyMDUzMDI5ODQ4fQ.4yu93TUTGtl8oTYQ3znl-7LTKhZCkJNWObbvB38EmbQ";

 const supabase = createClient(supabaseUrl, supabaseAnonKey);
 console.log('database connected')
export default supabase;

// off dulu nanti lanjut konfigurasi supbasenya sama lanjut bikin auth