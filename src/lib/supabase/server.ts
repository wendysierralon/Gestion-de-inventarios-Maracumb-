import { createClient } from "@supabase/supabase-js";

// Cliente para usar en el servidor (API routes o server actions)
export const supabaseServer = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
