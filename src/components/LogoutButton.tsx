"use client";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

export default function LogoutButton() {
  async function logout() {
    try {
      await fetch("/api/session-logout", { method: "POST" });
      await signOut(firebaseAuth);
    } finally {
      window.location.href = "/auth/login";
    }
  }
  return (
    <button
      onClick={logout}
      className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
    >
      Cerrar sesión
    </button>
  );
}
