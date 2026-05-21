const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const root = __dirname;
const dbPath = path.join(root, "data", "db.json");
const port = Number(process.env.PORT || 4174);
const host = process.env.HOST || "0.0.0.0";
const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const sessions = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function hashPassword(password, salt) {
  return crypto.createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

function createUser(id, name, email, password, role) {
  const salt = crypto.randomBytes(12).toString("hex");
  return {
    id,
    name,
    email,
    role,
    salt,
    passwordHash: hashPassword(password, salt)
  };
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, clientId: user.clientId || null };
}

function seedDb() {
  const admin = createUser("u_admin", "Marc Ribeiro", "admin@treinai.app", "admin123", "admin");
  const marina = createUser("u_marina", "Marina Costa", "marina@treinai.app", "aluno123", "student");
  marina.clientId = 1;

  return {
    users: [admin, marina],
    clients: [
      {
        id: 1,
        coachId: admin.id,
        userId: marina.id,
        name: "Marina Costa",
        goal: "hipertrofia",
        level: "intermediario",
        adherence: 86,
        risk: "ok",
        next: "Aumentar carga",
        profile: {
          age: 32,
          weight: 68,
          height: 166,
          sex: "feminino",
          days: 4,
          sessionDuration: 55,
          equipment: "academia",
          limitations: "joelho sensivel",
          injuries: "tendinite patelar leve em 2024",
          medical: "sem medicamentos, pressao normal",
          preferences: "prefere maquinas e evita corrida",
          schedule: "treina segunda, terca, quinta e sabado",
          nutritionNotes: "Dificuldade em bater proteina no cafe da manha.",
          intensity: 7
        },
        plan: null
      }
    ]
  };
}

async function readDb() {
  try {
    return JSON.parse(await fs.readFile(dbPath, "utf8"));
  } catch {
    const db = seedDb();
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    return db;
  }
}

async function writeDb(db) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

function getAuth(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return sessions.get(token) || null;
}

function requireAuth(req, res, role) {
  const session = getAuth(req);
  if (!session) {
    sendJson(res, 401, { error: "Login necessario." });
    return null;
  }
  if (role && session.user.role !== role) {
    sendJson(res, 403, { error: "Acesso negado." });
    return null;
  }
  return session;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function buildPrompt(profile) {
  return [
    "Voce e um personal trainer brasileiro senior, cuidadoso, comercialmente claro e conservador com seguranca.",
    "Crie um plano autonomo vendavel para consultoria online.",
    "Nao faca diagnostico medico. Quando houver risco, recomende liberacao profissional antes de progredir.",
    "Responda apenas JSON valido, sem markdown, com as chaves: title, summary, weekly, rules, nutrition, metric, safety, message.",
    "weekly deve ser array de strings com os dias de treino.",
    "rules deve ser array de regras automaticas de progressao/regressao.",
    "safety deve ser array de alertas e adaptacoes.",
    "message deve ser uma mensagem curta para WhatsApp ao aluno.",
    "",
    `Perfil: ${JSON.stringify(profile)}`
  ].join("\n");
}

async function generateWithOpenAI(profile) {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      input: buildPrompt(profile),
      temperature: 0.5
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Falha ao gerar plano com IA.");
  }

  const text = data.output_text || data.output?.flatMap((item) => item.content || []).map((content) => content.text || "").join("") || "";
  return JSON.parse(text);
}

async function routeApi(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Metodo nao permitido." });
    return;
  }

  try {
    const profile = JSON.parse(await readBody(req));
    const plan = await generateWithOpenAI(profile);
    if (!plan) {
      sendJson(res, 200, { mode: "demo", plan: null });
      return;
    }
    sendJson(res, 200, { mode: "openai", model, plan });
  } catch (error) {
    const status = error.message.toLowerCase().includes("quota") ? 402 : 500;
    sendJson(res, status, { error: error.message });
  }
}

async function routeLogin(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Metodo nao permitido." });
    return;
  }

  const { email, password } = JSON.parse(await readBody(req));
  const db = await readDb();
  const normalizedEmail = String(email || "").toLowerCase();
  const legacyEmail = normalizedEmail.replace("@treinai.app", "@atlasfit.ai");
  const user = db.users.find((item) => {
    const itemEmail = item.email.toLowerCase();
    return itemEmail === normalizedEmail || itemEmail === legacyEmail;
  });

  if (!user || hashPassword(password || "", user.salt) !== user.passwordHash) {
    sendJson(res, 401, { error: "Email ou senha invalidos." });
    return;
  }

  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, { user: publicUser(user) });
  sendJson(res, 200, { token, user: publicUser(user) });
}

async function routeClients(req, res) {
  const session = requireAuth(req, res, "admin");
  if (!session) return;

  const db = await readDb();

  if (req.method === "GET") {
    sendJson(res, 200, { clients: db.clients.filter((client) => client.coachId === session.user.id) });
    return;
  }

  if (req.method === "POST") {
    const payload = JSON.parse(await readBody(req));
    const id = Date.now();
    const client = {
      id,
      coachId: session.user.id,
      userId: null,
      name: payload.name || `Novo aluno ${db.clients.length + 1}`,
      goal: payload.goal || "hipertrofia",
      level: payload.level || "iniciante",
      adherence: 100,
      risk: "ok",
      next: "Preencher avaliacao",
      profile: payload.profile || {},
      plan: null
    };
    db.clients.unshift(client);
    await writeDb(db);
    sendJson(res, 201, { client });
    return;
  }

  sendJson(res, 405, { error: "Metodo nao permitido." });
}

async function routeClient(req, res, id, action) {
  const session = requireAuth(req, res);
  if (!session) return;

  const db = await readDb();
  const client = db.clients.find((item) => item.id === Number(id));

  if (!client) {
    sendJson(res, 404, { error: "Aluno nao encontrado." });
    return;
  }

  const isAdminOwner = session.user.role === "admin" && client.coachId === session.user.id;
  const isStudentOwner = session.user.role === "student" && client.userId === session.user.id;

  if (!isAdminOwner && !isStudentOwner) {
    sendJson(res, 403, { error: "Acesso negado." });
    return;
  }

  if (req.method === "PUT" && action === "plan") {
    if (!isAdminOwner) {
      sendJson(res, 403, { error: "Apenas o personal pode alterar o plano." });
      return;
    }
    const payload = JSON.parse(await readBody(req));
    client.plan = payload.plan || null;
    await writeDb(db);
    sendJson(res, 200, { client });
    return;
  }

  if (req.method === "PUT") {
    if (!isAdminOwner) {
      sendJson(res, 403, { error: "Apenas o personal pode alterar cadastro." });
      return;
    }
    const payload = JSON.parse(await readBody(req));
    Object.assign(client, payload);
    await writeDb(db);
    sendJson(res, 200, { client });
    return;
  }

  if (req.method === "DELETE") {
    if (!isAdminOwner) {
      sendJson(res, 403, { error: "Apenas o personal pode excluir aluno." });
      return;
    }
    db.clients = db.clients.filter((item) => item.id !== Number(id));
    await writeDb(db);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET") {
    sendJson(res, 200, { client });
    return;
  }

  sendJson(res, 405, { error: "Metodo nao permitido." });
}

async function routeMe(req, res) {
  const session = requireAuth(req, res);
  if (!session) return;

  const db = await readDb();
  if (session.user.role === "student") {
    const client = db.clients.find((item) => item.userId === session.user.id);
    sendJson(res, 200, { user: session.user, client });
    return;
  }

  sendJson(res, 200, { user: session.user });
}

async function routeStatic(req, res) {
  const url = new URL(req.url, `http://localhost:${port}`);
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = http.createServer((req, res) => {
  if (req.url === "/api/plan") {
    routeApi(req, res);
    return;
  }
  if (req.url === "/api/login") {
    routeLogin(req, res);
    return;
  }
  if (req.url === "/api/me") {
    routeMe(req, res);
    return;
  }
  if (req.url === "/api/clients") {
    routeClients(req, res);
    return;
  }
  const clientMatch = req.url.match(/^\/api\/clients\/(\d+)(?:\/(plan))?$/);
  if (clientMatch) {
    routeClient(req, res, clientMatch[1], clientMatch[2]);
    return;
  }
  routeStatic(req, res);
});

server.listen(port, host, () => {
  const localUrl = host === "0.0.0.0" ? `http://127.0.0.1:${port}` : `http://${host}:${port}`;
  console.log(`TreinAI rodando em ${localUrl}`);
  console.log(process.env.OPENAI_API_KEY ? `IA real ativa com modelo ${model}` : "Sem OPENAI_API_KEY: usando demo local no navegador.");
});
