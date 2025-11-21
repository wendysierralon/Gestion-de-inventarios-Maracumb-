import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

//Get orders
export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("pedidos")
    .select(
      `
    id,
    fecha,
    cantidad,
    clientes (
      restaurante
    ),
    productos (
      nombre
    )
  `
    )
    .order("fecha", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { cliente_id, producto_id, cantidad } = await req.json();

  if (!cliente_id || !producto_id || !cantidad) {
    return NextResponse.json(
      { error: "cliente_id, producto_id y cantidad son obligatorios" },
      { status: 400 }
    );
  }

  //Read current product's stock
  const { data: prod, error: e1 } = await supabase
    .from("productos")
    .select("id, cantidad")
    .eq("id", producto_id)
    .single();
  if (e1) return NextResponse.json({ error: e1.message }, { status: 400 });

  if ((Number(prod?.cantidad) || 0) < Number(cantidad)) {
    return NextResponse.json({ error: "stock insuficiente" }, { status: 400 });
  }

  // Subtract stock
  const newStock = Number(prod!.cantidad) - Number(cantidad);
  const { error: e2 } = await supabase
    .from("productos")
    .update({ cantidad: newStock })
    .eq("id", producto_id);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 400 });

  //Create order
  const { data: pedido, error: e3 } = await supabase
    .from("pedidos")
    .insert({ cliente_id, producto_id, cantidad })
    .select()
    .single();

  if (e3) return NextResponse.json({ error: e3.message }, { status: 400 });
  return NextResponse.json(pedido, { status: 201 });
}
