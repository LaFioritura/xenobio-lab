// main.js
// Inizializzazione del gioco e salvataggio automatico

import { bioform } from './state.js';

// Funzione di salvataggio automatico
function autoSave(bioform) {
  const snapshot = {
    time: Date.now(),
    species: bioform.species,
    containment: bioform.containment,
    coherence: bioform.coherence,
    cognition: bioform.cognition,
    entropy: bioform.entropy,
    mutations: bioform.mutations,
    evolutionStage: bioform.evolutionStage,
    neuralCore: bioform.neuralCore,
    metabolicCluster: bioform.metabolicCluster,
    structuralMatrix: bioform.structuralMatrix,
    legacyTrace: bioform.legacyTrace,
    asciiForm: bioform.asciiForm
  };
  localStorage.setItem("autosave", JSON.stringify(snapshot));
  console.log("🧬 Autosave completed");
}

// Timer per salvataggio automatico ogni 60 secondi
setInterval(() => {
  if (bioform && bioform.species) {
    autoSave(bioform);
  }
}, 60000);

// Caricamento automatico all’avvio
const saved = localStorage.getItem("autosave");
if (saved) {
  const restored = JSON.parse(saved);
  Object.assign(bioform, restored);
  console.log(`🧬 Autosave restored — Species: ${bioform.species}`);
}
function updateUptime() {
  const startTime = localStorage.getItem("startTime") || Date.now();
  localStorage.setItem("startTime", startTime);
  const now = Date.now();
  const diff = now - startTime;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  document.getElementById("uptime").textContent = `${hours}:${minutes.toString().padStart(2, '0')}`;
}

setInterval(updateUptime, 60000);
updateUptime();
// Salva stato
function saveExperimentState() {
  const state = {
    containment: currentContainment,
    coherence: currentCoherence,
    entropy: currentEntropy,
    mutations: currentMutations,
    metamorph: currentMetamorph,
    cognition: currentCognition,
    rp: currentRP,
    log: eventLog.slice(-50) // salva ultimi 50 eventi
  };
  localStorage.setItem("xenobioState", JSON.stringify(state));
}

// Carica stato
function loadExperimentState() {
  const saved = localStorage.getItem("xenobioState");
  if (saved) {
    const state = JSON.parse(saved);
    currentContainment = state.containment;
    currentCoherence = state.coherence;
    currentEntropy = state.entropy;
    currentMutations = state.mutations;
    currentMetamorph = state.metamorph;
    currentCognition = state.cognition;
    currentRP = state.rp;
    eventLog = state.log || [];
    logEvent("OK", "Saved experiment restored — Species: Gelatinous [E4EMDC]");
  } else {
    logEvent("OK", "Laboratory initialized — Species: Gelatinous [E4EMDC]");
  }
}

// Al caricamento
window.addEventListener("load", loadExperimentState);
// Ad ogni azione
setInterval(saveExperimentState, 5000); // salva ogni 5s

function endExperiment() {
  let score = 0;
  if (currentContainment >= 80) score += 30;
  if (currentRP >= 150) score += 30;
  if (currentMutations <= 2) score += 20;
  if (currentEntropy < 50) score += 20;

  let verdict = "FAILED";
  if (score >= 80) verdict = "SUCCESS";
  else if (score >= 60) verdict = "PARTIAL SUCCESS";

  logEvent("FINAL", `Experiment ${verdict} · Score: ${score}/100`);
  // Mostra badge o schermata finale
}
const achievements = [];

function unlockAchievement(name) {
  if (!achievements.includes(name)) {
    achievements.push(name);
    logEvent("OK", `Achievement unlocked: ${name}`);
  }
}
if (currentRP >= 150) unlockAchievement("RESEARCH BREAKTHROUGH");
if (currentMutations === 0) unlockAchievement("PURE SPECIMEN");
// Salva stato esperimento
function saveExperimentState() {
  const state = {
    containment: currentContainment,
    coherence: currentCoherence,
    entropy: currentEntropy,
    mutations: currentMutations,
    metamorph: currentMetamorph,
    cognition: currentCognition,
    rp: currentRP,
    log: eventLog.slice(-50)
  };
  localStorage.setItem("xenobioState", JSON.stringify(state));
}

// Carica stato esperimento
function loadExperimentState() {
  const saved = localStorage.getItem("xenobioState");
  if (saved) {
    const state = JSON.parse(saved);
    currentContainment = state.containment;
    currentCoherence = state.coherence;
    currentEntropy = state.entropy;
    currentMutations = state.mutations;
    currentMetamorph = state.metamorph;
    currentCognition = state.cognition;
    currentRP = state.rp;
    eventLog = state.log || [];
    logEvent("OK", "Saved experiment restored — Species: Gelatinous [E4EMDC]");
  } else {
    logEvent("OK", "Laboratory initialized — Species: Gelatinous [E4EMDC]");
  }
}

// Al caricamento
window.addEventListener("load", loadExperimentState);
// Salvataggio ogni 5s
setInterval(saveExperimentState, 5000);

// Sistema di punteggio finale
function endExperiment() {
  let score = 0;
  if (currentContainment >= 80) score += 30;
  if (currentRP >= 150) score += 30;
  if (currentMutations <= 2) score += 20;
  if (currentEntropy < 50) score += 20;

  let verdict = "FAILED";
  if (score >= 80) verdict = "SUCCESS";
  else if (score >= 60) verdict = "PARTIAL SUCCESS";

  logEvent("FINAL", `Experiment ${verdict} · Score: ${score}/100`);
}

// Achievement system
const achievements = [];

function unlockAchievement(name) {
  if (!achievements.includes(name)) {
    achievements.push(name);
    logEvent("OK", `Achievement unlocked: ${name}`);
  }
}

// Timer contenimento visivo
let containmentTimer = 180;
setInterval(() => {
  if (currentContainment >= 80) {
    containmentTimer--;
    if (containmentTimer === 0) {
      unlockAchievement("CONTAINMENT MASTER");
      endExperiment();
    }
  } else {
    containmentTimer = 180;
  }
}, 1000);
