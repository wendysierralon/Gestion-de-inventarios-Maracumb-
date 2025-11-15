import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

//Get clients
export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("fecha_creacion", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

//Create clients
export async function POST(req: Request) {
  const supabase = supabaseServer();
  const body = await req.json();
  if (!body?.restaurante || !body?.nombre_propietario) {
    return NextResponse.json(
      {
        error:
          "Los campos 'restaurante' y 'nombre propietario' son obligatorios.",
      },
      { status: 400 }
    );
  }

  const payload = {
    restaurante: String(body.restaurante).trim(),
    nombre_propietario: String(body.nombre_propietario).trim(),
    telefono: body.telefono ?? null,
    ciudad: body.ciudad ?? null,
    direccion: body.direccion ?? null,
  };

  const { data, error } = await supabase
    .from("clientes")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
