import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type Ctx = { params?: { id?: string } };

// Get an order by id
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
    .from("pedidos")
    .select("*, clientes(restaurante), productos(nombre)")
    .eq("id", id)
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

// Update an order by id
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

  //1. Get current order
  const { data: old, error: eOld } = await supabase
    .from("pedidos")
    .select("id, cliente_id, producto_id, cantidad")
    .eq("id", id)
    .single();
  if (eOld || !old)
    return NextResponse.json(
      { error: eOld?.message ?? "Pedido no encontrado" },
      { status: 404 }
    );

  //2. New values
  const newClient = b?.cliente_id ?? old.cliente_id;
  const newProduct = b?.producto_id ?? old.producto_id;
  const newCant =
    b?.cantidad != null ? Number(b.cantidad) : Number(old.cantidad);

  if (!newClient || !newProduct || !newCant) {
    return NextResponse.json(
      { error: "cliente_id, producto_id y cantidad son obligatorios" },
      { status: 400 }
    );
  }

  //3. New stock
  if (newProduct === old.producto_id) {
    const delta = newCant - Number(old.cantidad);
    if (delta !== 0) {
      if (delta > 0) {
        // we need extra stock
        const { data: prod, error: e1 } = await supabase
          .from("productos")
          .select("id, cantidad")
          .eq("id", newProduct)
          .single();
        if (e1)
          return NextResponse.json({ error: e1.message }, { status: 400 });
        if ((Number(prod?.cantidad) || 0) < delta) {
          return NextResponse.json({
            error: "Stock insuficiente para aumentar cantidad",
          });
        }
        const { error: e2 } = await supabase
          .from("productos")
          .update({ cantidad: Number(prod!.cantidad) - delta })
          .eq("id", newProduct);
        if (e2)
          return NextResponse.json({ error: e2.message }, { status: 400 });
      } else {
        // delta < 0 -> Return product to stock
        const returnStock = -delta;
        const { data: prod, error: e1 } = await supabase
          .from("productos")
          .select("id, cantidad")
          .eq("id", newProduct)
          .single();
        if (e1)
          return NextResponse.json({ error: e1.message }, { status: 400 });

        const { error: e2 } = await supabase
          .from("productos")
          .update({ cantidad: Number(prod!.cantidad) + returnStock })
          .eq("id", newProduct);
        if (e2)
          return NextResponse.json({ error: e2.message }, { status: 400 });
      }
    }
  } else {
    //Product changed
    // 1. We need to return the stock to the previous product
    const { data: prodOld, error: eOldProd } = await supabase
      .from("productos")
      .select("id, cantidad")
      .eq("id", old.producto_id)
      .single();
    if (eOldProd)
      return NextResponse.json({ error: eOldProd.message }, { status: 400 });

    const { error: eReturnStock } = await supabase
      .from("productos")
      .update({ cantidad: Number(prodOld!.cantidad) + Number(old.cantidad) })
      .eq("id", old.producto_id);

    if (eReturnStock)
      return NextResponse.json(
        { error: eReturnStock.message },
        { status: 400 }
      );

    // 2. Descount newCant to the new product
    const { data: prodNew, error: eNewProd } = await supabase
      .from("productos")
      .select("id, cantidad")
      .eq("id", newProduct)
      .single();
    if (eNewProd)
      return NextResponse.json({ error: eNewProd.message }, { status: 400 });

    if ((Number(prodNew?.cantidad) || 0) < newCant) {
      //Try to rollback
      await supabase
        .from("productos")
        .update({ cantidad: Number(prodOld!.cantidad) }) //Remains the old stock
        .eq("id", old.producto_id);

      return NextResponse.json(
        { error: "Stock insuficiente en el nuevo producto" },
        { status: 400 }
      );
    }

    const { error: eDescount } = await supabase
      .from("productos")
      .update({ cantidad: Number(prodNew!.cantidad) - newCant })
      .eq("id", newProduct);
    if (eDescount)
      return NextResponse.json({ error: eDescount.message }, { status: 400 });
  }
  // 4. Update the order
  const payload = {
    cliente_id: newClient,
    producto_id: newProduct,
    cantidad: newCant,
  };

  const { data, error } = await supabase
    .from("pedidos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

//Delete an order by id
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

  //1. Take the order
  const { data: ord, error: e1 } = await supabase
    .from("pedidos")
    .select("id, producto_id, cantidad")
    .eq("id", id)
    .single();
  if (e1 || !ord)
    return NextResponse.json(
      { error: e1?.message ?? "Pedido no encontrado" },
      { status: 404 }
    );

  //2. Recalculate stock
  const { data: prod, error: eProd } = await supabase
    .from("productos")
    .select("id, cantidad")
    .eq("id", ord.producto_id)
    .single();
  if (eProd)
    return NextResponse.json({ error: eProd.message }, { status: 400 });

  const { error: eRepone } = await supabase
    .from("productos")
    .update({ cantidad: Number(prod!.cantidad) + Number(ord.cantidad) })
    .eq("id", ord.producto_id);
  if (eRepone)
    return NextResponse.json({ error: eRepone.message }, { status: 400 });

  //3. Delete order
  const { error: eDel } = await supabase.from("pedidos").delete().eq("id", id);
  if (eDel) {
    //Try rollback
    await supabase
      .from("productos")
      .update({ cantidad: Number(prod!.cantidad) })
      .eq("id", ord.producto_id);
    return NextResponse.json({ error: eDel.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
