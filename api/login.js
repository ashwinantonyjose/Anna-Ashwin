import crypto from "node:crypto";

function hash(value) {
  return crypto.createHash("sha256").update(value).digest();
}

function credentialsMatch(input, expected) {
  return crypto.timingSafeEqual(hash(input), hash(expected));
}

function respond(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    ...headers
  });
  res.end(JSON.stringify(body));
}

export default function login(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { message: "Method not allowed." });
  }

  const {
    ANNA_USERNAME,
    ANNA_PASSWORD,
    ASHWIN_USERNAME,
    ASHWIN_PASSWORD,
    AUTH_SECRET
  } = process.env;

  if (!ANNA_USERNAME || !ANNA_PASSWORD || !ASHWIN_USERNAME
    || !ASHWIN_PASSWORD || !AUTH_SECRET || AUTH_SECRET.length < 32) {
    console.error("Login is unavailable because authentication environment variables are missing or invalid.");
    return respond(res, 503, { message: "Login is not configured. Contact the site owner." });
  }

  const body = req.body;
  if (!body || typeof body !== "object"
    || typeof body.username !== "string"
    || typeof body.password !== "string") {
    return respond(res, 400, { message: "Enter a username and password." });
  }

  const username = body.username.trim().toLowerCase();
  const password = body.password;
  const accounts = [
    { username: ANNA_USERNAME.trim().toLowerCase(), password: ANNA_PASSWORD },
    { username: ASHWIN_USERNAME.trim().toLowerCase(), password: ASHWIN_PASSWORD }
  ];
  const account = accounts.find((candidate) =>
    credentialsMatch(username, candidate.username)
    && credentialsMatch(password, candidate.password)
  );

  if (!account) {
    return respond(res, 401, { message: "Invalid username or password." });
  }

  const maxAge = body.rememberMe === true ? 7 * 24 * 60 * 60 : 12 * 60 * 60;
  const payload = Buffer.from(JSON.stringify({
    username: account.username,
    expiresAt: Date.now() + maxAge * 1000
  })).toString("base64url");
  const signature = crypto.createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");
  const cookieAttributes = [
    `gf_session=${payload}.${signature}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax"
  ];
  if (body.rememberMe === true) cookieAttributes.push(`Max-Age=${maxAge}`);

  return respond(res, 200, { success: true }, { "Set-Cookie": cookieAttributes.join("; ") });
}
