async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/productos`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("No se pudo cargar productos");
  return res.json();
}

import ProductoForm from "@/components/forms/ProductoForm";
import ProductoDeleteForm from "@/components/forms/ProductDeleteForm";

export default async function ProductoPage() {
  const productos = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
      </div>
      <div className="flex items-center justify-between ">
        <h2 className="mb-3 text-sm font-medium">
          Crea, edita y elimina productos y su stock.
        </h2>
      </div>

      {/* Crear producto */}
      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-3 text-sm font-medium">Nuevo producto</h2>
        <ProductoForm mode="create" />
      </div>

      {/*Tabla*/}
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-right">Stock</th>
              <th className="px-3 py-2">Unidad</th>
              <th className="px-3 py-2 text-right">Valor unitario</th>
              <th className="px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{p.nombre}</td>
                <td className="px-3 py-2 text-right">{p.cantidad}</td>
                <td className="px-3 py-2 text-right">{p.unidad ?? "-"}</td>
                <td className="px-3 py-2 text-right">
                  {p.valor_unitario != null
                    ? `$${Number(p.valor_unitario).toLocaleString()}`
                    : "-"}
                </td>
                <td className="px-3 px-2 text-right">
                  <a
                    href={`/productos/${p.id}/editar`}
                    className="mr-2 text-blue-600 hover:underline"
                  >
                    Editar
                  </a>
                  <ProductoDeleteForm id={p.id} />
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                  Sin productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
