async function getCliente(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/clientes/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("No se pudo cargar el cliente");
  return res.json();
}

import ClienteForm from "@/components/forms/ClienteForm";
type Params = { params: { id: string } };

export default async function EditarClientePage({ params }: Params) {
  const cliente = await getCliente(params.id);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Editar cliente</h1>
      <div className="rounded-xl border bg-white p-4">
        <ClienteForm mode="edit" initial={cliente} />
      </div>
    </div>
  );
}
