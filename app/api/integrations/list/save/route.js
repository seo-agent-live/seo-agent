import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export async function POST(req) {
  const { type, config, connected } = await req.json();
  try {
    const { data: existing } = await supabase.from('integrations').select('id').eq('type', type).single();
    if (existing) {
      await supabase.from('integrations').update({ config, connected }).eq('type', type);
    } else {
      await supabase.from('integrations').insert({ type, config, connected });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}