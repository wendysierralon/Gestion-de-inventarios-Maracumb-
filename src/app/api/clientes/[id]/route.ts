import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type Ctx = { params?: { id?: string } };

//Get a client by id
export async function GET(req: Request, ctx: Ctx) {
  let id = ctx?.params?.id;
  if (!id) {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    id = segments[segments.length - 1];
  }
  if (!id) {
    return NextResponse.json(
      { error: "Falta el id en la ruta" },
      { status: 400 }
    );
  }
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

//Update a client by id
export async function PUT(req: Request, ctx: Ctx) {
  let id = ctx?.params?.id;
  if (!id) {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    id = segments[segments.length - 1];
  }
  if (!id) {
    return NextResponse.json(
      { error: "Falta el id en la ruta" },
      { status: 400 }
    );
  }
  const supabase = supabaseServer();
  const b = await req.json();

  if (!b?.restaurante || !b?.nombre_propietario) {
    return NextResponse.json(
      { error: "Los campos restaurante y nombre propietario son obligatorios" },
      { status: 400 }
    );
  }
  const payload = {
    restaurante: String(b.restaurante).trim(),
    nombre_propietario: String(b.nombre_propietario).trim(),
    telefono: b.telefono ?? null,
    direccion: b.direccion ?? null,
    ciudad: b.ciudad ?? null,
  };
  const { data, error } = await supabase
    .from("clientes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
//Delete a client by id
export async function DELETE(req: Request, ctx: Ctx) {
  let id = ctx?.params?.id;
  if (!id) {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    id = segments[segments.length - 1];
  }
  if (!id) {
    return NextResponse.json(
      { error: "Falta el id en la ruta" },
      { status: 400 }
    );
  }
  const supabase = supabaseServer();
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
