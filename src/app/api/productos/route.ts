import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("nombre");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const b = await req.json();
  if (!b?.nombre) {
    return NextResponse.json(
      { error: "El nombre es obligatorio" },
      { status: 400 }
    );
  }

  const payload = {
    nombre: String(b.nombre).trim(),
    cantidad: Number(b.cantidad ?? 0),
    unidad: b.unidad ?? null,
    valor_unitario: b.valor_unitario != null ? Number(b.valor_unitario) : null,
  };

  const { data, error } = await supabase
    .from("productos")
    .insert(payload)
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
