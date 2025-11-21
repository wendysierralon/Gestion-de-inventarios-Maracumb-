import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id?: String }> };

// Get a product by id
export async function GET(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// Update a product by id
export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  if (!id || id === "undefined") {
    return NextResponse.json(
      { error: "ID inválido en la ruta" },
      { status: 400 }
    );
  }
  const supabase = supabaseServer();
  const b = await req.json();

  if (!b?.nombre)
    return NextResponse.json(
      { error: "El campo nombre es obligatorio" },
      { status: 400 }
    );

  const payload = {
    nombre: String(b.nombre).trim(),
    cantidad: Number(b.cantidad ?? 0),
    unidad: b.unidad ?? null,
    valor_unitario: b.valor_unitario != null ? Number(b.valor_unitario) : null,
  };

  const { data, error } = await supabase
    .from("productos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// Delete a product by id
export async function DELETE(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!id || id === "undefined") {
    return NextResponse.json(
      { error: "ID inválido en la ruta" },
      { status: 400 }
    );
  }
  const supabase = supabaseServer();
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
