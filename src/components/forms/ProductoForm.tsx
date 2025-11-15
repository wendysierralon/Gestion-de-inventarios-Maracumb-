"use client";
import React, { useState, useEffect } from "react";

type Props = {
  mode: "create" | "edit";
  initial?: {
    id: string;
    nombre: string;
    cantidad: number;
    unidad?: string | null;
    valor_unitario?: number | null;
  };
};

export default function ProductoForm({ mode, initial }: Props) {
  const [form, setForm] = useState({
    nombre: initial?.nombre ?? "",
    cantidad: initial?.cantidad ?? 0,
    unidad: initial?.unidad ?? "",
    valor_unitario: initial?.valor_unitario ?? 0,
  });
  useEffect(() => {
    if (initial) {
      setForm({
        nombre: initial.nombre ?? "",
        cantidad: initial.cantidad ?? 0,
        unidad: initial.unidad ?? "",
        valor_unitario: initial.valor_unitario ?? 0,
      });
    }
  }, [initial]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      nombre: form.nombre.trim(),
      cantidad: Number(form.cantidad),
      unidad: form.unidad || null,
      valor_unitario:
        form.valor_unitario === null ? null : Number(form.valor_unitario),
    };

    const url =
      mode === "create" ? "/api/productos" : `/api/productos/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      if (mode === "create")
        setForm({ nombre: "", cantidad: 0, unidad: "", valor_unitario: 0 });
      location.reload();
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j?.error ?? "Error guardando producto");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-4">
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Nombre"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        required
      />
      <input
        className="rounded-lg border px-3 py-2"
        type="number"
        placeholder="Cantidad"
        value={form.cantidad}
        onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })}
      />
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Unidad"
        value={form.unidad}
        onChange={(e) => setForm({ ...form, unidad: e.target.value })}
      />
      <input
        className="rounded-lg border px-3 py-2"
        type="number"
        placeholder="Valor unitario"
        value={form.valor_unitario ?? 0}
        onChange={(e) =>
          setForm({ ...form, valor_unitario: Number(e.target.value) })
        }
      />
      <div className="md:col-span-4">
        <button className="rounded-lg bg-black px-3 py-2 text-sm text-white">
          {mode === "create" ? "Crear" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
