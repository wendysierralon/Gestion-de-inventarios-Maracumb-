"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

export default function ProductoDeleteForm({ id }: Props) {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const ok = confirm("Eliminar producto?");
    if (!ok) return;

    const r = await fetch(`/api/productos/${id}`, {
      method: "DELETE",
    });

    if (r.ok) {
      alert("Producto eliminado correctamente");
      router.refresh();
    } else {
      const j = await r.json().catch(() => ({}));
      alert(j?.error ?? "Error eliminando producto");
    }
  }

  return (
    <form className="inline" onSubmit={handleSubmit}>
      <button type="submit" className="text-red-600 hover:underline">
        Eliminar
      </button>
    </form>
  );
}
