async function getClients() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/clientes`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("No se pudo cargar clientes");
  return res.json();
}

import ClienteForm from "@/components/forms/ClienteForm";

export default async function ClientesPage() {
  const clientes = await getClients();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Clientes</h1>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-3 text-sm font-medium">Nuevo cliente</h2>
        <ClienteForm mode="create" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Restaurante</th>
              <th className="px-3 py-2 text-left">Propietario</th>
              <th className="px-3 py-2 text-left">Teléfono</th>
              <th className="px-3 py-2 text-left">Ciudad</th>
              <th className="px-3 py-2 text-left">Dirección</th>
              <th className="px-3 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.restaurante}</td>
                <td className="px-3 py-2">{c.nombre_propietario}</td>
                <td className="px-3 py-2">{c.telefono ?? "-"}</td>
                <td className="px-3 py-2">{c.ciudad ?? "-"}</td>
                <td className="px-3 py-2">{c.direccion ?? "-"}</td>
                <td className="px-3 py-2 text-right">
                  <a
                    href={`/clientes/${c.id}/editar`}
                    className="mr-2 text-blue-600 hover:underline"
                  >
                    Editar
                  </a>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={async () => {
                      if (!confirm("Eliminar cliente?")) return;
                      const r = await fetch(`/api/clientes/${c.id}`, {
                        method: "DELETE}",
                      });
                      if (r.ok) location.reload();
                      else alert("No se pudo eliminar");
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                  Sin clientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
