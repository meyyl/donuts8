import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pzceujxdsbvrwltgpyas.supabase.co"; // 🔹 ganti
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Y2V1anhkc2J2cndsdGdweWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzgzNTYsImV4cCI6MjA3NzQxNDM1Nn0.ElbI0_0iVpmGhu3j_6x1cUVyuY5ID7CRRIt798RYcqg"; // 🔹 ganti

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
