"use client";
import { useEffect, useState } from "react";

type Opcion = {
  id: string;
  nombre: string;
  restaurante: string;
  cantidad?: number;
};

export default function NuevoPedidoPage() {
  const [clientes, setClientes] = useState<Opcion[]>([]);
  const [productos, setProductos] = useState<Opcion[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [cs, ps] = await Promise.all([
        fetch("/api/clientes").then((r) => r.json()),
        fetch("/api/productos").then((r) => r.json()),
      ]);
      setClientes(cs);
      setProductos(ps);
      if (cs[0]) setClienteId(cs[0].id);
      if (ps[0]) setProductoId(ps[0].id);
    })();
  }, []);

  async function submit() {
    setError(null);
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_id: clienteId,
        producto_id: productoId,
        cantidad,
      }),
    });
    if (res.ok) {
      window.location.href = "/pedidos";
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "No se pudo crear el pedido");
    }
  }

  const prod = productos.find((p) => p.id === productoId);

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-xl font-semibold">Nuevo Pedido</h1>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <label className="block text-sm">
        Cliente
        <select
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.restaurante}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        Producto
        <select
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
        >
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}(stock{p.cantidad})
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        Cantidad
        <input
          type="number"
          min={1}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        />
      </label>

      <div className="flex gap-2">
        <a href="/pedidos" className="rounded-lg border px-3 py-2 text-sm">
          Cancelar
        </a>
        <button
          onClick={submit}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white"
        >
          Crear pedido
        </button>
      </div>
      {prod && (
        <div className="text-xs text-gray-600">
          Stock disponible: {prod.cantidad}
        </div>
      )}
    </div>
  );
}
