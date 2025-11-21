"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Cliente = {
  id: string;
  restaurante: string;
  nombre_propietario: string;
  telefono?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
};

export default function ClienteForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: Cliente;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    restaurante: initial?.restaurante ?? "",
    nombre_propietario: initial?.nombre_propietario ?? "",
    telefono: initial?.telefono ?? "",
    direccion: initial?.direccion ?? "",
    ciudad: initial?.ciudad ?? "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        restaurante: initial.restaurante ?? "",
        nombre_propietario: initial.nombre_propietario ?? "",
        telefono: initial.telefono ?? "",
        direccion: initial.direccion ?? "",
        ciudad: initial.ciudad ?? "",
      });
    }
  }, [initial]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.restaurante || !form.nombre_propietario) {
      alert("Restaurante y nombre del propietario son obligatorios");
      return;
    }

    setSaving(true);

    const payload = {
      restaurante: form.restaurante.trim(),
      nombre_propietario: form.nombre_propietario.trim(),
      telefono: form.telefono || null,
      direccion: form.direccion || null,
      ciudad: form.ciudad || null,
    };
    const url =
      mode === "create" ? "/api/clientes" : `/api/clientes/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (r.ok) {
      if (mode === "create") {
        alert("Cliente creado correctamente");
        router.refresh();
        setForm({
          restaurante: "",
          nombre_propietario: "",
          telefono: "",
          direccion: "",
          ciudad: "",
        });
      } else {
        alert("Cliente actualizado correctamente");
        router.push("/clientes");
        router.refresh();
      }
    } else {
      const j = await r.json().catch(() => ({}));
      alert(j?.error ?? "Error guardando cliente");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Restaurante"
        value={form.restaurante}
        onChange={(e) => setForm({ ...form, restaurante: e.target.value })}
        required
      />
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Nombre propietario"
        value={form.nombre_propietario}
        onChange={(e) =>
          setForm({ ...form, nombre_propietario: e.target.value })
        }
        required
      />
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
      />
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Dirección"
        value={form.direccion}
        onChange={(e) => setForm({ ...form, direccion: e.target.value })}
      />
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Ciudad"
        value={form.ciudad}
        onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
      />
      <div className="md:col-span-3">
        <button
          className="rounded-lg bg-black px-3 py-2 text-sm text-white"
          disabled={saving}
        >
          {saving
            ? "Guardando..."
            : mode === "create"
            ? "Crear"
            : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
