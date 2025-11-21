"use client";
import React, { useState } from "react";
import { firebaseAuth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sp = useSearchParams();
  const router = useRouter();
  const redirect = sp.get("redirect") || "/productos"; //This page will be reload when the user login the app

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      //Authentication with firebase (client)
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, pass);
      const idToken = await cred.user.getIdToken();

      //Create cookie of session in the server
      const r = await fetch("/api/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!r.ok) {
        const j = await r.json();
        throw new Error(j?.error || "No se pudo crear la sesión");
      }
      //Redirect to the app
      router.replace(redirect);
    } catch (e: any) {
      setErr(e?.message ?? "Error de autenticación");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl border text-center">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Maracumbé Logo"
            width={100}
            height={100}
            className="rounded-md mx-auto"
          />
        </div>
        <h1 className="text-lg font-semibold text-gray-800">
          Sistema de gestión de pedidos
        </h1>
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl border"
        >
          <h1 className="text-xl font-semibold">Iniciar sesión</h1>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm"
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="w-full rounded-lg bg-black text-white px-3 py-2 text-sm"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
