async function getPedidos() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/pedidos`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("No se pudo cargar pedidos");
  return res.json();
}

export default async function PedidosPage() {
  const pedidos = await getPedidos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pedidos</h1>
        <a
          href="/pedidos/nuevo"
          className="rounded-lg border bg-white px-3 py-2 text-sm hover: bg-gray-50"
        >
          Nuevo
        </a>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="mb-3 text-sm font-medium">
          Crea pedidos de los productos existentes y asignalos a un cliente.
          Estos pedidos serán descontados de tu stock.
        </h2>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Fecha</th>
              <th className="px-3 py-2 text-left">Cliente</th>
              <th className="px-3 py-2 text-left">Producto</th>
              <th className="px-3 py-2 text-left">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">
                  {new Date(p.fecha).toLocaleString()}
                </td>
                <td className="px-3 py-2">{p.clientes?.restaurante ?? "-"}</td>
                <td className="px-3 py-2">{p.productos?.nombre ?? "-"}</td>
                <td className="px-3 py-2 text-right">{p.cantidad}</td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                  Sin pedidos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
