import { next } from "@vercel/functions";

const PUBLIC_PATHS = new Set([
  "/login",
  "/login.html",
  "/api/login",
  "/api/logout",
  "/css/login.css",
  "/js/auth.js",
  "/js/login.js",
  "/assets/photos/main-couple-photo.jpg"
]);

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function hasValidSession(request) {
  const secret = process.env.AUTH_SECRET;
  const usernames = [
    process.env.ANNA_USERNAME,
    process.env.ASHWIN_USERNAME
  ].filter(Boolean).map((username) => username.trim().toLowerCase());

  if (!secret || usernames.length !== 2) return false;

  const cookie = request.headers.get("cookie") || "";
  const sessionCookie = cookie.split(";").map((part) => part.trim())
    .find((part) => part.startsWith("gf_session="));
  if (!sessionCookie) return false;

  const token = sessionCookie.slice("gf_session=".length);
  const [encodedPayload, encodedSignature, extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra !== undefined) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const signatureIsValid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(encodedPayload)
    );
    if (!signatureIsValid) return false;

    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload)));
    return usernames.includes(payload.username)
      && Number.isFinite(payload.expiresAt)
      && payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export default async function proxy(request) {
  const { pathname } = new URL(request.url);

  if (PUBLIC_PATHS.has(pathname)) {
    if ((pathname === "/login" || pathname === "/login.html")
      && await hasValidSession(request)) {
      return Response.redirect(new URL("/", request.url));
    }
    return next();
  }

  if (!process.env.AUTH_SECRET
    || !process.env.ANNA_USERNAME
    || !process.env.ASHWIN_USERNAME) {
    return new Response("Authentication is not configured.", { status: 503 });
  }

  if (await hasValidSession(request)) return next();

  if (pathname.startsWith("/api/")) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.redirect(new URL("/login.html", request.url));
}
