const state = {
  plan: null,
  activeClientId: 1,
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

function enterApp(viewId = "planner") {
  $("#publicLanding")?.classList.add("is-hidden");
  $("#appShell")?.classList.remove("is-hidden");
  setView(viewId);
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
  $("#limitations").value = profile.limitations || "";
  $("#injuries").value = profile.injuries || "";
  $("#medical").value = profile.medical || "";
  $("#preferences").value = profile.preferences || "";
  $("#schedule").value = profile.schedule || "";
  $("#nutritionNotes").value = profile.nutritionNotes || "";
  $("#intensity").value = profile.intensity || 7;
  $("#intensityValue").textContent = $("#intensity").value;
}

function saveFormToClient() {
  const client = activeClient();
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
  enterApp(viewId);
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

  return {
    title: `${data.name}: plano de ${data.goal}`,
    summary: `${data.level} com ${data.days} dias por semana, usando ${data.equipment}.`,
    weekly: template.split.slice(0, data.days),
    nutrition: template.nutrition,
    rules: [
      duration,
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
  `;
  renderReport();
}

function renderReport() {
  const plan = state.plan || buildPlan(getFormData());
  const profile = getFormData();
  const bmi = profile.height ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : "-";

  $("#reportSheet").innerHTML = `
    <div class="report-header">
      <span>AtlasFit AI</span>
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
  `;
}

function reportText() {
  const plan = state.plan || buildPlan(getFormData());
  const profile = getFormData();
  return [
    `ATLASFIT AI - DOSSIE DO ALUNO`,
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
    saveFormToClient();
    renderPlan(state.plan);
    status.textContent = data.mode === "openai" ? "IA real" : "Demo local";
    showToast(data.mode === "openai" ? "Plano criado com IA real." : "Sem chave: usei o motor demo local.");
  } catch (error) {
    state.plan = fallback;
    activeClient().plan = state.plan;
    saveFormToClient();
    renderPlan(state.plan);
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
        <div><strong>${exercise.name}</strong><span>${exercise.prescription}</span></div>
        <strong>${exercise.load}</strong>
        <button class="icon-button complete-exercise" type="button" aria-label="Concluir exercicio" title="Concluir exercicio" data-index="${index}">
          <span data-icon="check"></span>
        </button>
      </article>
    `)
    .join("");
  lucide.createIcons();
}

function renderClients() {
  $("#clientTable").innerHTML = state.clients
    .map((client) => `
      <article class="client-row ${client.id === state.activeClientId ? "selected-client" : ""}">
        <div><strong>${client.name}</strong><span>${client.goal}</span></div>
        <span>${client.adherence}% aderencia</span>
        <span class="pill ${client.risk === "high" ? "risk-high" : "risk-ok"}">${client.risk === "high" ? "Risco" : "Estavel"}</span>
        <span>${client.next}</span>
        <button class="ghost-button open-client" type="button" data-id="${client.id}">
          <span data-icon="file-check"></span>
          Dossie
        </button>
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
  link.download = "plano-atlasfit-ai.txt";
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
  renderClients();
  fillFormFromClient(activeClient());
  state.plan = activeClient().plan || buildPlan(getFormData());
  activeClient().plan = state.plan;
  renderPlan(state.plan);
  renderReport();
  calculateAdjustment();

  $$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));

  $("#startAssessment")?.addEventListener("click", () => enterApp("planner"));
  $("#openPanel")?.addEventListener("click", () => enterApp("dashboard"));

  $("#intensity").addEventListener("input", (event) => {
    $("#intensityValue").textContent = event.target.value;
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

  $("#addClient").addEventListener("click", () => {
    const id = Date.now();
    const count = state.clients.length + 1;
    state.clients.unshift({
      id,
      name: `Novo aluno ${count}`,
      goal: "hipertrofia",
      level: "iniciante",
      adherence: 100,
      risk: "ok",
      next: "Preencher anamnese",
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
      },
      plan: null
    });
    selectClient(id, "planner");
    showToast("Novo aluno criado. Preencha a anamnese.");
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

  lucide.createIcons();
}

init();
