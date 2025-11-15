import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

const FIVE_DAYS = 60 * 60 * 24 * 5 * 1000;

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Falta idToken" }, { status: 400 });
    }

    //Create cookie of session based on the ID token
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: FIVE_DAYS,
    });

    //Cookie HHTP-only, secure, SameSite=Lax
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: "session",
      value: sessionCookie,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: FIVE_DAYS / 1000,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Error al crear sesión" },
      { status: 400 }
    );
  }
}
