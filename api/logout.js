export default function logout(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.writeHead(405, { "Cache-Control": "no-store" });
    return res.end();
  }

  res.writeHead(204, {
    "Cache-Control": "no-store",
    "Set-Cookie": "gf_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
  });
  res.end();
}
