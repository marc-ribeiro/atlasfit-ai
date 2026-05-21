const state = {
  plan: null,
  activeClientId: 1,
  mode: "admin",
  token: localStorage.getItem("treinai_token") || "",
  user: null,
  loginTarget: "admin",
  clients: [
    {
      id: 1,
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
    },
    {
      id: 2,
      name: "Rafael Lima",
      goal: "emagrecimento",
      level: "iniciante",
      adherence: 62,
      risk: "high",
      next: "Contato humano",
      profile: {
        age: 38,
        weight: 94,
        height: 178,
        sex: "masculino",
        days: 3,
        sessionDuration: 45,
        equipment: "academia",
        limitations: "lombar sensivel",
        injuries: "dor lombar recorrente",
        medical: "liberado para exercicio leve",
        preferences: "nao gosta de esteira",
        schedule: "treina a noite",
        nutritionNotes: "Belisca a tarde e come fora.",
        intensity: 5
      },
      plan: null
    },
    {
      id: 3,
      name: "Bianca Torres",
      goal: "recomposicao",
      level: "intermediario",
      adherence: 91,
      risk: "ok",
      next: "Manter plano",
      profile: {
        age: 29,
        weight: 61,
        height: 162,
        sex: "feminino",
        days: 5,
        sessionDuration: 50,
        equipment: "halteres",
        limitations: "",
        injuries: "",
        medical: "sem restricoes",
        preferences: "gosta de treinos densos",
        schedule: "manha",
        nutritionNotes: "Boa rotina alimentar.",
        intensity: 8
      },
      plan: null
    }
  ],
  exercises: [
    { name: "Leg press 45", prescription: "4 x 10, RIR 2", load: "90 kg" },
    { name: "Levantamento terra romeno", prescription: "3 x 8, RIR 2", load: "54 kg" },
    { name: "Mesa flexora", prescription: "3 x 12, pausa 1s", load: "38 kg" },
    { name: "Panturrilha em pe", prescription: "4 x 12", load: "42 kg" }
  ]
};

const exerciseLibrary = {
  "Leg press 45": {
    image: "exercise-leg-press.svg",
    muscle: "pernas",
    equipment: "Maquina",
    level: "Iniciante a avancado",
    cues: ["Pes no meio da plataforma", "Joelhos acompanham a linha dos pes", "Desca controlando sem tirar o quadril do banco"],
    steps: ["Ajuste o banco para manter lombar apoiada.", "Empurre a plataforma sem travar os joelhos.", "Desca ate onde consegue manter quadril no banco."],
    live: "Pensa em empurrar o chao para longe. Controle a descida por 2 segundos e suba forte sem perder alinhamento.",
    mistakes: ["Juntar os joelhos", "Tirar o quadril do banco", "Descer rapido demais"],
    substitutes: ["Agachamento goblet", "Cadeira extensora", "Hack machine"],
    caution: "Evite travar totalmente os joelhos no topo."
  },
  "Levantamento terra romeno": {
    image: "exercise-rdl.svg",
    muscle: "pernas",
    equipment: "Barra ou halteres",
    level: "Intermediario",
    cues: ["Coluna neutra", "Quadril vai para tras", "Barra perto das pernas"],
    steps: ["Segure a carga na frente do corpo.", "Leve o quadril para tras como se fechasse uma porta.", "Sinta alongar posterior e volte contraindo gluteos."],
    live: "Nao e agachar. O joelho dobra pouco e o quadril faz quase todo o movimento. Mantem a carga raspando nas pernas.",
    mistakes: ["Arredondar lombar", "Afastar a barra do corpo", "Dobrar demais os joelhos"],
    substitutes: ["Stiff com halteres", "Hip thrust", "Mesa flexora"],
    caution: "Pare a descida quando perder postura ou sentir lombar."
  },
  "Mesa flexora": {
    image: "exercise-leg-curl.svg",
    muscle: "pernas",
    equipment: "Maquina",
    level: "Todos",
    cues: ["Quadril colado no banco", "Suba controlando", "Segure 1 segundo no pico"],
    steps: ["Ajuste o rolo acima do calcanhar.", "Flexione os joelhos ate sentir posterior contrair.", "Volte devagar sem bater os pesos."],
    live: "Segura um segundo la em cima. Se precisar jogar o quadril, a carga esta alta demais.",
    mistakes: ["Levantar quadril", "Soltar a volta", "Encurtar amplitude"],
    substitutes: ["Flexora sentado", "Flexora unilateral", "RDL leve"],
    caution: "Nao use impulso no final da repeticao."
  },
  "Panturrilha em pe": {
    image: "exercise-calf-raise.svg",
    muscle: "pernas",
    equipment: "Maquina ou peso corporal",
    level: "Todos",
    cues: ["Suba o maximo possivel", "Pause no topo", "Desca ate alongar"],
    steps: ["Apoie a ponta dos pes com seguranca.", "Suba ate contrair bem a panturrilha.", "Desca devagar ate alongar."],
    live: "Nao pula. Sobe, pausa, desce. A panturrilha responde muito melhor com controle total.",
    mistakes: ["Fazer rapido demais", "Pouca amplitude", "Virar os tornozelos para fora"],
    substitutes: ["Panturrilha sentado", "Panturrilha no leg press", "Panturrilha unilateral"],
    caution: "Mantenha tornozelos alinhados."
  }
};

const equipmentHelp = {
  academia: "Academia completa: maquinas, cabos, barras, halteres, bancos, leg press, puxadores e cardio.",
  halteres: "Halteres e banco: pares de halteres, banco reto/inclinado e colchonete. Sem depender de maquinas.",
  casa: "Casa com acessorios: elasticos, colchonete, cadeira firme, mochila com carga, step ou peso improvisado.",
  "peso-corporal": "Sem equipamento: apenas peso do corpo, usando agachamentos, flexoes, prancha, mobilidade e cardio local."
};

function updateEquipmentHelp(value = $("#equipment")?.value || "academia") {
  const text = equipmentHelp[value] || equipmentHelp.academia;
  $("#equipmentHelp").textContent = text;
  $("#equipmentInfo").setAttribute("data-tooltip", text);
  $("#equipmentInfo").setAttribute("aria-label", text);
}

const librarySeeds = [
  ["Agachamento livre", "pernas", "Barra", "Avancado", ["Pes firmes no chao", "Tronco estavel", "Joelhos acompanham os pes"], "Desce como se sentasse entre os calcanhares. Mantem peito aberto e sobe empurrando o chao."],
  ["Agachamento goblet", "pernas", "Halter", "Iniciante", ["Segure o halter junto ao peito", "Cotovelos apontam para baixo", "Controle a descida"], "O peso na frente ajuda seu tronco. Usa ele como guia e nao deixa o joelho cair para dentro."],
  ["Cadeira extensora", "pernas", "Maquina", "Todos", ["Ajuste o eixo no joelho", "Suba controlando", "Pause no topo"], "Estica o joelho e aperta a frente da coxa. Volta devagar, sem deixar o peso bater."],
  ["Hip thrust", "pernas", "Barra ou maquina", "Intermediario", ["Queixo levemente baixo", "Costelas fechadas", "Contraia gluteos no topo"], "Sobe pensando em enrolar o quadril. Se sentir lombar, reduz amplitude e ajusta postura."],
  ["Supino reto", "peito", "Barra", "Intermediario", ["Escapulas encaixadas", "Pes firmes", "Barra desce no meio do peito"], "Controla a barra ate o peito e empurra para cima sem perder o ombro encaixado."],
  ["Supino com halteres", "peito", "Halteres", "Intermediario", ["Punhos alinhados", "Cotovelos a 45 graus", "Desca com controle"], "Pensa em abracar o movimento. Halteres descem com controle e sobem juntos."],
  ["Flexao de bracos", "peito", "Peso corporal", "Todos", ["Corpo em linha", "Maos abaixo dos ombros", "Peito vai ao chao"], "Trava abdomen e gluteos. Se perder a linha do corpo, use apoio mais alto."],
  ["Crucifixo maquina", "peito", "Maquina", "Todos", ["Ombros baixos", "Cotovelos semiflexionados", "Feche sem bater"], "Fecha como se abracasse alguem. Sente o peito, nao o pescoço."],
  ["Puxada frente", "costas", "Maquina", "Todos", ["Peito aberto", "Cotovelos descem", "Nao puxe com biceps"], "Traz a barra para a parte alta do peito. Primeiro desce as escapulas, depois os cotovelos."],
  ["Remada baixa", "costas", "Maquina", "Todos", ["Coluna alta", "Cotovelos para tras", "Pausa no final"], "Puxa os cotovelos para o bolso de tras. Nao joga o tronco para roubar."],
  ["Remada unilateral", "costas", "Halter", "Intermediario", ["Apoio firme", "Coluna neutra", "Puxe com cotovelo"], "Imagina ligar o cotovelo ao quadril. Sobe a carga sem girar o tronco."],
  ["Barra fixa assistida", "costas", "Maquina ou elastico", "Intermediario", ["Pegada firme", "Peito sobe", "Desca controlando"], "Nao pense em subir o queixo. Pense em trazer o peito ate a barra."],
  ["Desenvolvimento halteres", "ombros", "Halteres", "Intermediario", ["Punhos alinhados", "Abdomen firme", "Nao arqueie lombar"], "Empurra os halteres para cima como se fechasse uma janela acima da cabeca."],
  ["Elevacao lateral", "ombros", "Halteres", "Todos", ["Cotovelos levemente dobrados", "Suba ate linha do ombro", "Controle a volta"], "Leva os cotovelos para os lados, nao as maos. Peso leve e movimento limpo."],
  ["Face pull", "ombros", "Cabo", "Todos", ["Corda na altura do rosto", "Cotovelos abertos", "Aperte parte alta das costas"], "Puxa a corda para o rosto e separa as pontas. Excelente para postura."],
  ["Rosca direta", "bracos", "Barra", "Todos", ["Cotovelos parados", "Punhos neutros", "Sem balancar"], "Sobe a barra com o biceps. Se o corpo balanca, diminui a carga."],
  ["Rosca alternada", "bracos", "Halteres", "Todos", ["Ombros baixos", "Gire a palma ao subir", "Controle a descida"], "Sobe uma mao por vez e espreme no topo. A descida tambem conta."],
  ["Triceps corda", "bracos", "Cabo", "Todos", ["Cotovelos fixos", "Abra a corda no final", "Postura alta"], "Empurra para baixo e abre a corda no final como se rasgasse uma folha."],
  ["Triceps testa", "bracos", "Barra ou halteres", "Intermediario", ["Cotovelos apontam para cima", "Desca controlado", "Nao abra demais"], "Move so o antebraco. O braco fica quase parado como uma dobradica."],
  ["Prancha", "core", "Peso corporal", "Todos", ["Costelas fechadas", "Gluteos contraidos", "Pes firmes"], "Pensa em aproximar costelas e quadril. Se lombar afundar, encerra a serie."],
  ["Dead bug", "core", "Peso corporal", "Iniciante", ["Lombar no chao", "Movimento lento", "Respire controlando"], "Move braco e perna opostos sem deixar a lombar sair do chao."],
  ["Abdominal cabo", "core", "Cabo", "Intermediario", ["Quadril parado", "Enrole a coluna", "Controle a volta"], "Nao puxe com o braco. Enrola o tronco como se fechasse um zíper."],
  ["Esteira caminhada inclinada", "cardio", "Esteira", "Todos", ["Postura alta", "Passada constante", "Respiracao nasal se possivel"], "Ritmo em que voce consegue falar frases curtas. Isso e zona 2."],
  ["Bike ergometrica", "cardio", "Bike", "Todos", ["Joelho alinhado", "Cadencia fluida", "Sem travar ombros"], "Pedala redondo. Se a coxa queima demais cedo, reduz carga e mantem constancia."]
].forEach(([name, muscle, equipment, level, cues, live]) => {
  if (!exerciseLibrary[name]) {
    exerciseLibrary[name] = {
      image: "logo.svg",
      muscle,
      equipment,
      level,
      cues,
      steps: cues,
      live,
      mistakes: ["Executar rapido demais", "Perder postura", "Usar carga antes de dominar tecnica"],
      substitutes: ["Variante em maquina", "Variante com halteres", "Peso corporal assistido"],
      caution: "Interrompa se houver dor articular, tontura ou falta de ar incomum."
    };
  }
});

function exerciseMedia(exercise, label = "Ver tecnica") {
  const info = exerciseLibrary[exercise.name] || {};
  return `
    <img class="exercise-thumb" src="${info.image || "logo.svg"}" alt="${exercise.name}" />
    <div>
      <strong>${exercise.name}</strong>
      <span>${exercise.prescription}</span>
      <details class="exercise-details">
        <summary>${label}</summary>
        <ul>${(info.cues || []).map((cue) => `<li>${cue}</li>`).join("")}</ul>
        <p>${info.caution || ""}</p>
      </details>
    </div>
  `;
}

function exerciseVisualCards(label = "Como fazer") {
  return state.exercises.map((exercise) => `
    <article class="exercise-item plan-exercise-card">
      ${exerciseMedia(exercise, label)}
      <strong>${exercise.load}</strong>
    </article>
  `).join("");
}

const templates = {
  hipertrofia: {
    split: ["Upper tecnico", "Lower forca", "Push hipertrofia", "Pull + posterior", "Mobilidade ativa"],
    nutrition: "Superavit leve, 1,8 g/kg de proteina, carbo alto nos dias de perna.",
    metric: "Carga total semanal e fotos quinzenais."
  },
  emagrecimento: {
    split: ["Full body A", "Cardio zona 2", "Full body B", "Intervalado curto", "Mobilidade"],
    nutrition: "Deficit moderado, proteina alta, 25 a 35 g de fibra por dia.",
    metric: "Media de peso de 7 dias, cintura e aderencia."
  },
  condicionamento: {
    split: ["Forca base", "Metabolico curto", "Cardio continuo", "Core + mobilidade", "Intervalado"],
    nutrition: "Manutencao calorica, hidratacao e carbo antes dos treinos intensos.",
    metric: "Frequencia cardiaca, RPE e tempo de recuperacao."
  },
  recomposicao: {
    split: ["Upper", "Lower", "Full body denso", "Cardio zona 2", "Mobilidade"],
    nutrition: "Proteina alta, calorias em manutencao e distribuicao simples por refeicao.",
    metric: "Medidas, performance e fotos a cada 14 dias."
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Falha na requisicao.");
  return data;
}

async function loginWithCredentials(email, password) {
  const data = await api("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  state.token = data.token;
  state.user = data.user;
  localStorage.setItem("treinai_token", data.token);
  await loadSession(data.user.role);
}

function showLogin(role) {
  state.loginTarget = role;
  $("#publicLanding")?.classList.add("login-open");
  $("#loginPanel").classList.remove("is-hidden");
  $("#loginTitle").textContent = role === "student" ? "Entrar como aluno" : "Entrar como admin";
  $("#loginHint").textContent = role === "student" ? "Acesse seus treinos e check-ins." : "Gerencie alunos, planos e dossies.";
  $("#loginEmail").value = role === "student" ? "marina@treinai.app" : "admin@treinai.app";
  $("#loginPassword").value = role === "student" ? "aluno123" : "admin123";
  history.replaceState(null, "", role === "student" ? "#aluno" : "#admin");
  $("#loginEmail").focus();
}

async function loadSession(preferredMode = "admin") {
  const data = await api("/api/me");
  state.user = data.user;

  if (data.user.role === "student") {
    state.clients = data.client ? [data.client] : [];
    state.activeClientId = data.client?.id || null;
    if (data.client) {
      fillFormFromClient(data.client);
      state.plan = data.client.plan || buildPlan(getFormData());
      data.client.plan = state.plan;
      renderPlan(state.plan);
      renderStudentPortal();
    }
    enterApp("student", "student");
    return;
  }

  const clientsData = await api("/api/clients");
  state.clients = clientsData.clients;
  state.activeClientId = state.clients[0]?.id || null;
  if (activeClient()) {
    fillFormFromClient(activeClient());
    state.plan = activeClient().plan || buildPlan(getFormData());
    activeClient().plan = state.plan;
    renderPlan(state.plan);
  }
  renderClients();
  enterApp(preferredMode === "student" ? "student" : "dashboard", "admin");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function setView(viewId) {
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
}

function enterApp(viewId = "planner", mode = "admin") {
  state.mode = mode;
  $("#publicLanding")?.classList.add("is-hidden");
  $("#appShell")?.classList.remove("is-hidden");
  document.body.dataset.mode = mode;
  $("#topTitle").textContent = mode === "student" ? "Portal do aluno" : "Operacao diaria do personal digital";
  $$(".nav-item").forEach((button) => {
    const adminOnly = ["dashboard", "planner", "clients", "business", "delivery"].includes(button.dataset.view);
    button.classList.toggle("admin-only", adminOnly);
  });
  renderStudentPortal();
  setView(viewId);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function exitApp() {
  state.token = "";
  state.user = null;
  localStorage.removeItem("treinai_token");
  $("#appShell")?.classList.add("is-hidden");
  $("#publicLanding")?.classList.remove("is-hidden");
  $("#publicLanding")?.classList.remove("login-open");
  $("#loginPanel")?.classList.add("is-hidden");
  document.body.dataset.mode = "";
  history.replaceState(null, "", window.location.pathname);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function activeClient() {
  return state.clients.find((client) => client.id === state.activeClientId) || state.clients[0];
}

function fillFormFromClient(client) {
  const profile = client.profile || {};
  $("#studentName").value = client.name || "";
  $("#age").value = profile.age || 30;
  $("#weight").value = profile.weight || 70;
  $("#height").value = profile.height || 170;
  $("#sex").value = profile.sex || "nao informado";
  $("#goal").value = client.goal || "hipertrofia";
  $("#level").value = client.level || "intermediario";
  $("#days").value = profile.days || 4;
  $("#sessionDuration").value = profile.sessionDuration || 50;
  $("#equipment").value = profile.equipment || "academia";
  updateEquipmentHelp();
  $("#limitations").value = profile.limitations || "";
  $("#injuries").value = profile.injuries || "";
  $("#medical").value = profile.medical || "";
  $("#preferences").value = profile.preferences || "";
  $("#schedule").value = profile.schedule || "";
  $("#nutritionNotes").value = profile.nutritionNotes || "";
  $("#intensity").value = profile.intensity || 7;
  $("#intensityValue").textContent = $("#intensity").value;
}

async function saveFormToClient() {
  const client = activeClient();
  if (!client) return;
  const data = getFormData();
  client.name = data.name;
  client.goal = data.goal;
  client.level = data.level;
  client.profile = {
    age: data.age,
    weight: data.weight,
    height: data.height,
    sex: data.sex,
    days: data.days,
    sessionDuration: data.sessionDuration,
    equipment: data.equipment,
    limitations: data.limitations,
    injuries: data.injuries,
    medical: data.medical,
    preferences: data.preferences,
    schedule: data.schedule,
    nutritionNotes: data.nutritionNotes,
    intensity: data.intensity
  };
  renderClients();
  if (state.token && state.user?.role === "admin") {
    await api(`/api/clients/${client.id}`, {
      method: "PUT",
      body: JSON.stringify(client)
    });
  }
}

function selectClient(clientId, viewId = "delivery") {
  state.activeClientId = clientId;
  const client = activeClient();
  fillFormFromClient(client);
  state.plan = client.plan || buildPlan(getFormData());
  client.plan = state.plan;
  renderPlan(state.plan);
  renderReport();
  renderClients();
  enterApp(viewId, state.mode);
}

async function savePlanToClient() {
  const client = activeClient();
  if (!client || !state.token || state.user?.role !== "admin") return;
  client.plan = state.plan;
  await api(`/api/clients/${client.id}/plan`, {
    method: "PUT",
    body: JSON.stringify({ plan: state.plan })
  });
}

function getFormData() {
  return {
    name: $("#studentName").value.trim() || "Aluno",
    age: Number($("#age").value),
    weight: Number($("#weight").value),
    height: Number($("#height").value),
    sex: $("#sex").value,
    goal: $("#goal").value,
    level: $("#level").value,
    days: Number($("#days").value),
    sessionDuration: Number($("#sessionDuration").value),
    equipment: $("#equipment").value,
    limitations: $("#limitations").value.trim(),
    injuries: $("#injuries").value.trim(),
    medical: $("#medical").value.trim(),
    preferences: $("#preferences").value.trim(),
    schedule: $("#schedule").value.trim(),
    nutritionNotes: $("#nutritionNotes").value.trim(),
    intensity: Number($("#intensity").value),
    checkin: {
      energy: Number($("#energy")?.value || 6),
      sleep: Number($("#sleep")?.value || 7),
      soreness: Number($("#soreness")?.value || 4)
    }
  };
}

function buildPlan(data) {
  const template = templates[data.goal];
  const volume = data.level === "iniciante" ? "8 a 10 series por grupo" : data.level === "avancado" ? "14 a 18 series por grupo" : "10 a 14 series por grupo";
  const deload = data.intensity >= 8 ? "Deload preventivo na semana 5" : "Deload apenas se check-ins cairem";
  const restriction = data.limitations ? `Adaptar exercicios que irritem ${data.limitations}.` : "Sem restricoes relatadas.";
  const injury = data.injuries ? `Historico informado: ${data.injuries}. Evitar progressao agressiva se houver dor.` : "Sem lesoes historicas informadas.";
  const duration = data.sessionDuration ? `Treinos desenhados para ${data.sessionDuration} minutos.` : "Treinos de 45 a 60 minutos.";
  const equipmentRule = equipmentHelp[data.equipment] || "Equipamento informado sera usado para adaptar exercicios.";

  return {
    title: `${data.name}: plano de ${data.goal}`,
    summary: `${data.level} com ${data.days} dias por semana, usando ${data.equipment}.`,
    weekly: template.split.slice(0, data.days),
    nutrition: template.nutrition,
    rules: [
      duration,
      equipmentRule,
      `Volume inicial: ${volume}.`,
      `Intensidade: RIR 2 na maioria das series, RIR 1 no ultimo exercicio seguro.`,
      `${deload}.`,
      restriction,
      injury,
      "A IA reajusta carga quando aderencia >= 80%, sono >= 6 e dor <= 6."
    ],
    metric: template.metric,
    safety: [
      "Dor articular acima de 4/10 interrompe o exercicio e troca por variante sem dor.",
      "Sintomas como tontura, falta de ar incomum ou dor no peito exigem pausa e avaliacao profissional.",
      data.medical ? `Ponto de saude declarado: ${data.medical}.` : "Sem condicao de saude declarada."
    ],
    message: `${data.name}, seu plano foi ajustado para ${data.days} dias/semana. Hoje foque em tecnica, RIR 2 e me envie energia, sono e dor muscular no fim do treino.`
  };
}

function renderPlan(plan) {
  $("#planOutput").innerHTML = `
    <article class="plan-block">
      <strong>${plan.title}</strong>
      <p>${plan.summary || "Plano personalizado por anamnese e check-in."}</p>
      <ul>${plan.weekly.map((day, index) => `<li>Dia ${index + 1}: ${day}</li>`).join("")}</ul>
    </article>
    <article class="plan-block">
      <strong>Regras automaticas</strong>
      <ul>${plan.rules.map((rule) => `<li>${rule}</li>`).join("")}</ul>
    </article>
    <article class="plan-block">
      <strong>Seguranca e adaptacoes</strong>
      <ul>${(plan.safety || []).map((rule) => `<li>${rule}</li>`).join("")}</ul>
    </article>
    <article class="plan-block">
      <strong>Nutricao orientativa</strong>
      <ul><li>${plan.nutrition}</li><li>Metrica principal: ${plan.metric}</li></ul>
    </article>
    <article class="plan-block">
      <strong>Mensagem pronta</strong>
      <p>${plan.message || "Plano pronto para envio ao aluno."}</p>
    </article>
    <article class="plan-block">
      <strong>Exercicios guiados</strong>
      <div class="guided-exercises">${exerciseVisualCards("Ver tecnica")}</div>
    </article>
  `;
  renderReport();
}

function renderReport() {
  const plan = state.plan || buildPlan(getFormData());
  const profile = getFormData();
  const bmi = profile.height ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : "-";

  $("#reportSheet").innerHTML = `
    <div class="report-header">
      <span>TreinAI</span>
      <strong>${profile.name}</strong>
      <p>${plan.title}</p>
    </div>
    <div class="report-grid">
      <div><span>Objetivo</span><strong>${profile.goal}</strong></div>
      <div><span>Nivel</span><strong>${profile.level}</strong></div>
      <div><span>Treinos</span><strong>${profile.days}x/sem</strong></div>
      <div><span>IMC ref.</span><strong>${bmi}</strong></div>
    </div>
    <div class="report-section">
      <strong>Resumo executivo</strong>
      <p>${plan.summary || "Plano personalizado com base na anamnese, rotina e check-ins."}</p>
    </div>
    <div class="report-section">
      <strong>Plano semanal</strong>
      <ul>${plan.weekly.map((day, index) => `<li>Dia ${index + 1}: ${day}</li>`).join("")}</ul>
    </div>
    <div class="report-section">
      <strong>Regras de ajuste automatico</strong>
      <ul>${plan.rules.slice(0, 5).map((rule) => `<li>${rule}</li>`).join("")}</ul>
    </div>
    <div class="report-section">
      <strong>Mensagem para o aluno</strong>
      <p>${plan.message}</p>
    </div>
    <div class="report-section">
      <strong>Exercicios com guia visual</strong>
      <div class="guided-exercises">${exerciseVisualCards("Como executar")}</div>
    </div>
  `;
}

function renderStudentPortal() {
  const client = activeClient();
  const plan = client.plan || state.plan || buildPlan(getFormData());
  client.plan = plan;

  $("#studentNameTitle").textContent = client.name;
  $("#studentSummary").textContent = `${client.goal} | ${client.level} | ${client.profile?.days || 4} treinos por semana`;
  $("#studentWorkout").innerHTML = state.exercises
    .map((exercise) => `
      <article class="exercise-item student-exercise">
        ${exerciseMedia(exercise, "Como fazer")}
        <strong>${exercise.load}</strong>
        <button class="icon-button complete-exercise" type="button" aria-label="Concluir exercicio" title="Concluir exercicio">
          <span data-icon="check"></span>
        </button>
      </article>
    `)
    .join("");
  $("#studentPlan").innerHTML = `
    <article class="plan-block">
      <strong>${plan.title}</strong>
      <p>${plan.summary || "Plano personalizado para esta semana."}</p>
      <ul>${plan.weekly.map((day, index) => `<li>Dia ${index + 1}: ${day}</li>`).join("")}</ul>
    </article>
    <article class="plan-block">
      <strong>Orientacoes</strong>
      <ul>${plan.rules.slice(0, 4).map((rule) => `<li>${rule}</li>`).join("")}</ul>
    </article>
    <article class="plan-block">
      <strong>Guia visual</strong>
      <div class="guided-exercises">${exerciseVisualCards("Como fazer")}</div>
    </article>
  `;
  lucide.createIcons();
}

function submitStudentCheckin() {
  const energy = Number($("#studentEnergy").value);
  const sleep = Number($("#studentSleep").value);
  const soreness = Number($("#studentSoreness").value);
  const readiness = Math.round((energy * 0.45 + sleep * 0.35 + (10 - soreness) * 0.2) * 10);
  const feedback = readiness >= 75
    ? "Check-in recebido. Hoje voce pode progredir com controle e manter RIR 2."
    : readiness >= 55
      ? "Check-in recebido. Mantenha as cargas e reduza uma serie se sentir queda tecnica."
      : "Check-in recebido. Hoje priorize treino leve, mobilidade e informe o personal se houver dor.";
  $("#studentFeedback").textContent = `${feedback} Readiness: ${readiness}%.`;
  showToast("Check-in enviado.");
}

function reportText() {
  const plan = state.plan || buildPlan(getFormData());
  const profile = getFormData();
  return [
    `TREINAI - DOSSIE DO ALUNO`,
    "",
    `Aluno: ${profile.name}`,
    `Objetivo: ${profile.goal}`,
    `Nivel: ${profile.level}`,
    `Frequencia: ${profile.days}x por semana`,
    "",
    "Resumo:",
    plan.summary || "Plano personalizado com base na anamnese.",
    "",
    "Plano semanal:",
    ...plan.weekly.map((day, index) => `${index + 1}. ${day}`),
    "",
    "Regras automaticas:",
    ...plan.rules.map((rule) => `- ${rule}`),
    "",
    "Seguranca:",
    ...(plan.safety || []).map((rule) => `- ${rule}`),
    "",
    `Nutricao: ${plan.nutrition}`,
    `Metrica: ${plan.metric}`,
    "",
    `Mensagem: ${plan.message || ""}`
  ].join("\n");
}

function normalizeAiPlan(plan, fallback) {
  return {
    title: plan.title || fallback.title,
    summary: plan.summary || fallback.summary,
    weekly: Array.isArray(plan.weekly) && plan.weekly.length ? plan.weekly : fallback.weekly,
    rules: Array.isArray(plan.rules) && plan.rules.length ? plan.rules : fallback.rules,
    nutrition: plan.nutrition || fallback.nutrition,
    metric: plan.metric || fallback.metric,
    safety: Array.isArray(plan.safety) && plan.safety.length ? plan.safety : fallback.safety,
    message: plan.message || fallback.message
  };
}

async function createPlanWithAi() {
  const profile = getFormData();
  const fallback = buildPlan(profile);
  const status = $("#aiStatus");

  status.textContent = "Gerando...";
  $("#planOutput").classList.add("loading");

  try {
    const response = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Falha ao chamar IA.");
    }

    state.plan = data.plan ? normalizeAiPlan(data.plan, fallback) : fallback;
    activeClient().plan = state.plan;
    await saveFormToClient();
    await savePlanToClient();
    renderPlan(state.plan);
    renderStudentPortal();
    status.textContent = data.mode === "openai" ? "IA real" : "Demo local";
    showToast(data.mode === "openai" ? "Plano criado com IA real." : "Sem chave: usei o motor demo local.");
  } catch (error) {
    state.plan = fallback;
    activeClient().plan = state.plan;
    await saveFormToClient();
    await savePlanToClient();
    renderPlan(state.plan);
    renderStudentPortal();
    status.textContent = "IA indisponivel";
    showToast(`IA indisponivel: ${error.message}`);
  } finally {
    $("#planOutput").classList.remove("loading");
  }
}

function renderTimeline() {
  const items = [
    ["07:30", "Check-in Marina", "Sono bom, aumentar supino em 2 kg.", "ok"],
    ["10:00", "Alerta Rafael", "Aderencia baixa por 3 dias, enviar mensagem curta.", "high"],
    ["15:20", "Revisao Bianca", "Manter calorias e trocar cardio por zona 2.", "ok"]
  ];

  $("#timeline").innerHTML = items
    .map(([time, title, text, risk]) => `
      <article class="timeline-item">
        <time>${time}</time>
        <div><strong>${title}</strong><p>${text}</p></div>
        <span class="pill ${risk === "high" ? "risk-high" : "risk-ok"}">${risk === "high" ? "Atencao" : "Auto"}</span>
      </article>
    `)
    .join("");
}

function renderExercises() {
  $("#exerciseList").innerHTML = state.exercises
    .map((exercise, index) => `
      <article class="exercise-item">
        ${exerciseMedia(exercise)}
        <strong>${exercise.load}</strong>
        <button class="icon-button complete-exercise" type="button" aria-label="Concluir exercicio" title="Concluir exercicio" data-index="${index}">
          <span data-icon="check"></span>
        </button>
      </article>
    `)
    .join("");
  lucide.createIcons();
}

function renderExerciseLibrary() {
  const search = ($("#exerciseSearch")?.value || "").toLowerCase();
  const muscle = $("#muscleFilter")?.value || "todos";
  const entries = Object.entries(exerciseLibrary)
    .filter(([name, info]) => {
      const haystack = [name, info.muscle, info.equipment, info.level, ...(info.cues || [])].join(" ").toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesMuscle = muscle === "todos" || info.muscle === muscle;
      return matchesSearch && matchesMuscle;
    })
    .sort(([a], [b]) => a.localeCompare(b));

  $("#exerciseLibraryGrid").innerHTML = entries.map(([name, info]) => `
    <article class="library-card">
      <img src="${info.image || "logo.svg"}" alt="${name}" />
      <div class="library-card-body">
        <div class="library-title">
          <div>
            <strong>${name}</strong>
            <span>${info.muscle} | ${info.equipment} | ${info.level}</span>
          </div>
        </div>
        <div class="coach-script">
          <span>Coach ao vivo</span>
          <p>${info.live}</p>
        </div>
        <div class="library-columns">
          <div>
            <b>Passo a passo</b>
            <ol>${(info.steps || info.cues || []).map((step) => `<li>${step}</li>`).join("")}</ol>
          </div>
          <div>
            <b>Evite</b>
            <ul>${(info.mistakes || []).map((mistake) => `<li>${mistake}</li>`).join("")}</ul>
          </div>
        </div>
        <div class="substitution-row">
          ${(info.substitutes || []).map((item) => `<span>${item}</span>`).join("")}
        </div>
        <p class="safety-note">${info.caution}</p>
      </div>
    </article>
  `).join("");
}

function renderClients() {
  $("#clientTable").innerHTML = state.clients
    .map((client) => `
      <article class="client-row ${client.id === state.activeClientId ? "selected-client" : ""}">
        <div><strong>${client.name}</strong><span>${client.goal}</span></div>
        <span>${client.adherence}% aderencia</span>
        <span class="pill ${client.risk === "high" ? "risk-high" : "risk-ok"}">${client.risk === "high" ? "Risco" : "Estavel"}</span>
        <span>${client.next}</span>
        <div class="client-actions">
          <button class="ghost-button open-client" type="button" data-id="${client.id}">
            <span data-icon="file-check"></span>
            Dossie
          </button>
          <button class="icon-button delete-client" type="button" data-id="${client.id}" aria-label="Excluir aluno" title="Excluir aluno">
            <span data-icon="trash-2"></span>
          </button>
        </div>
      </article>
    `)
    .join("");
  lucide.createIcons();
}

function calculateAdjustment() {
  const energy = Number($("#energy").value);
  const sleep = Number($("#sleep").value);
  const soreness = Number($("#soreness").value);
  const readiness = Math.round((energy * 0.45 + sleep * 0.35 + (10 - soreness) * 0.2) * 10);
  let message = `Readiness ${readiness}%. `;

  if (readiness >= 75) {
    message += "Aumente 2,5% a 5% nas cargas principais e mantenha o volume previsto.";
  } else if (readiness >= 55) {
    message += "Mantenha carga, reduza uma serie acessoria e preserve tecnica.";
  } else {
    message += "Troque por sessao regenerativa, corte 30% do volume e priorize mobilidade.";
  }

  $("#adjustmentBox").textContent = message;
  $("#decisionMetric").textContent = readiness >= 75 ? "Progredir" : readiness >= 55 ? "Manter" : "Regenerar";
}

function exportPlan() {
  if (!state.plan) {
    showToast("Gere um plano primeiro.");
    return;
  }

  const content = [
    state.plan.title,
    "",
    "Semana:",
    ...state.plan.weekly.map((day, index) => `${index + 1}. ${day}`),
    "",
    "Regras:",
    ...state.plan.rules.map((rule) => `- ${rule}`),
    "",
    "Seguranca:",
    ...(state.plan.safety || []).map((rule) => `- ${rule}`),
    "",
    `Nutricao: ${state.plan.nutrition}`,
    `Metrica: ${state.plan.metric}`,
    "",
    `Mensagem: ${state.plan.message || ""}`
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "plano-treinai.txt";
  link.click();
  URL.revokeObjectURL(url);
}

function copyText(text, success) {
  navigator.clipboard.writeText(text).then(
    () => showToast(success),
    () => showToast("Nao consegui acessar a area de transferencia.")
  );
}

function init() {
  renderTimeline();
  renderExercises();
  renderExerciseLibrary();
  renderClients();
  updateEquipmentHelp();
  if (activeClient()) {
    fillFormFromClient(activeClient());
    state.plan = activeClient().plan || buildPlan(getFormData());
    activeClient().plan = state.plan;
    renderPlan(state.plan);
    renderReport();
  }
  calculateAdjustment();

  $$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));

  $("#startAssessment")?.addEventListener("click", () => showLogin("admin"));
  $("#openPanel")?.addEventListener("click", () => showLogin("admin"));
  $("#openStudent")?.addEventListener("click", () => showLogin("student"));
  $("#loginPanel")?.addEventListener("submit", (event) => {
    event.preventDefault();
    loginWithCredentials($("#loginEmail").value, $("#loginPassword").value)
      .then(() => {
        if (state.user?.role === "admin" && state.loginTarget === "admin") setView("planner");
      })
      .catch((error) => showToast(error.message));
  });
  $("#backHome")?.addEventListener("click", exitApp);
  $("#studentCheckin")?.addEventListener("click", submitStudentCheckin);
  $("#exerciseSearch")?.addEventListener("input", renderExerciseLibrary);
  $("#muscleFilter")?.addEventListener("change", renderExerciseLibrary);

  $("#intensity").addEventListener("input", (event) => {
    $("#intensityValue").textContent = event.target.value;
  });

  $("#equipment").addEventListener("change", (event) => {
    updateEquipmentHelp(event.target.value);
  });

  $("#planForm").addEventListener("submit", (event) => {
    event.preventDefault();
    createPlanWithAi();
  });

  $("#generateQuick").addEventListener("click", () => {
    setView("planner");
    createPlanWithAi();
  });

  $("#runAdjustment").addEventListener("click", () => {
    calculateAdjustment();
    showToast("Treino recalculado.");
  });

  $("#applyInsight").addEventListener("click", () => {
    $("#coachTitle").textContent = "Ajuste aplicado";
    $("#coachInsight").textContent = "Volume reduzido em quadriceps, progressao mantida no supino e mensagem de check-in preparada para o aluno.";
    showToast("Ajuste salvo na rotina do aluno.");
  });

  $("#copyMessage").addEventListener("click", () => {
    copyText("Marina, seu check-in foi bom. Hoje vamos subir o supino em 2 kg e manter RIR 2. Me envie energia, sono e dor muscular depois do treino.", "Mensagem copiada.");
  });

  $("#copyOffer").addEventListener("click", () => {
    copyText($("#offerText").value, "Oferta copiada.");
  });

  $("#copyReport").addEventListener("click", () => {
    copyText(reportText(), "Dossie copiado.");
  });

  $("#exportPlan").addEventListener("click", exportPlan);

  $("#addClient").addEventListener("click", async () => {
    const count = state.clients.length + 1;
    const payload = {
      name: `Novo aluno ${count}`,
      goal: "hipertrofia",
      level: "iniciante",
      profile: {
        age: 30,
        weight: 70,
        height: 170,
        sex: "nao informado",
        days: 3,
        sessionDuration: 45,
        equipment: "academia",
        limitations: "",
        injuries: "",
        medical: "",
        preferences: "",
        schedule: "",
        nutritionNotes: "",
        intensity: 6
      }
    };
    try {
      const data = await api("/api/clients", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      state.clients.unshift(data.client);
      selectClient(data.client.id, "planner");
      showToast("Novo aluno criado. Preencha a avaliacao.");
    } catch (error) {
      showToast(error.message);
    }
  });

  $("#resetDemo").addEventListener("click", () => {
    window.location.reload();
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".complete-exercise");
    if (!button) return;
    button.closest(".exercise-item").style.opacity = "0.55";
    showToast("Exercicio marcado como concluido.");
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".open-client");
    if (!button) return;
    selectClient(Number(button.dataset.id), "delivery");
    showToast("Dossie do aluno aberto.");
  });

  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".delete-client");
    if (!button) return;
    const id = Number(button.dataset.id);
    const client = state.clients.find((item) => item.id === id);
    if (!client) return;
    const confirmed = window.confirm(`Excluir ${client.name}? Esta acao nao pode ser desfeita.`);
    if (!confirmed) return;

    try {
      await api(`/api/clients/${id}`, { method: "DELETE" });
      state.clients = state.clients.filter((item) => item.id !== id);
      state.activeClientId = state.clients[0]?.id || null;
      if (activeClient()) {
        fillFormFromClient(activeClient());
        state.plan = activeClient().plan || buildPlan(getFormData());
        renderPlan(state.plan);
      }
      renderClients();
      showToast("Aluno excluido.");
    } catch (error) {
      showToast(error.message);
    }
  });

  if (window.location.hash === "#aluno") {
    showLogin("student");
  } else if (window.location.hash === "#admin") {
    showLogin("admin");
  }

  lucide.createIcons();
}

init();
