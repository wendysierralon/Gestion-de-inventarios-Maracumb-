"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
  const pathname = usePathname();
  const hide = pathname?.startsWith("/auth");
  if (hide) return null;

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-3">
        <nav className="flex gap-4 text-sm">
          <Link href="/productos" className="hover:underline">
            Productos
          </Link>
          <Link href="/pedidos" className="hover:underline">
            Pedidos
          </Link>
          <Link href="/clientes" className="hover:underline">
            Clientes
          </Link>
        </nav>
        <LogoutButton />
      </div>
    </header>
  );
}
