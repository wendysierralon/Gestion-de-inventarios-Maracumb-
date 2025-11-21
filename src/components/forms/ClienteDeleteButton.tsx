"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

export default function ClienteDeleteButton({ id }: Props) {
  const router = useRouter();

  async function handleClick() {
    const ok = confirm("Eliminar cliente?");
    if (!ok) return;

    const r = await fetch(`/api/clientes/${id}`, {
      method: "DELETE",
    });

    if (r.ok) {
      alert("Cliente eliminado correctamente");
      router.refresh();
    } else {
      const j = await r.json().catch(() => ({}));
      alert(j?.error ?? "Error eliminando cliente");
    }
  }
  return (
    <button
      type="button"
      className="text-red-600 hover:underline"
      onClick={handleClick}
    >
      Eliminar
    </button>
  );
}
