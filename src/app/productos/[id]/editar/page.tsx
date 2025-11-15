async function getProduct(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/productos/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("No se pudo cargar el producto");
  return res.json();
}

import ProductoForm from "@/components/forms/ProductoForm";

type Params = { params: { id: string } };

export default async function EditarProductoPage({ params }: Params) {
  const producto = await getProduct(params.id);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Editar producto</h1>
      <div className="rounded-xl border bg-white p-4">
        <ProductoForm mode="edit" initial={producto} />
      </div>
    </div>
  );
}
