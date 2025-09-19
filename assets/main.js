// main.js
// Inizializzazione del gioco e salvataggio automatico

import { bioform } from './state.js';

// === RANDOM CASES ===
const evolutionCases = [
  { name: "Neurogenic Bloom", effect: "+30 Cognition, unlocks Neural Echo" },
  { name: "Fractal Mutation", effect: "Symmetric mutations, unstable coherence" },
  { name: "Quantum Bloom", effect: "+2 Metamorph, RP bonus" },
  { name: "Empathic Resonance", effect: "Subject observes you, unlocks Echoform" },
  { name: "Molecular Self-Assembly", effect: "New evolutionary branch unlocked" }
];

const containmentCases = [
  { name: "Field Instability", effect: "Containment drops every 10s" },
  { name: "Polarity Inversion", effect: "Primary protocols disabled" },
  { name: "Symbiotic Contamination", effect: "Unpredictable mutations" },
  { name: "Energy Surge", effect: "-200 Funds, +20 RP" },
  { name: "Cognitive Escape", effect: "Subject attempts to breach containment" }
];

function assignRandomCases() {
  const evo = evolutionCases[Math.floor(Math.random() * evolutionCases.length)];
  const cont = containmentCases[Math.floor(Math.random() * containmentCases.length)];
  logEvent("EVENT", `Evolution Case: ${evo.name} — ${evo.effect}`);
  logEvent("EVENT", `Containment Case: ${cont.name} — ${cont.effect}`);
}

// === ADVANCED EVOLUTION ===
const advancedForms = [
  "Neuroform", "Fractal Entity", "Quantum Bloom", "Echoform", "Voidspawn"
];

function getAdvancedEvolution(metamorphLevel) {
  if (metamorphLevel <= 15) return null;
  const index = Math.floor((metamorphLevel - 16) / 3);
  const stage = (metamorphLevel - 16) % 3;
  const form = advancedForms[index % advancedForms.length];
  const stageName = ["Emergence", "Expansion", "Ascension"][stage];
  return `${form} — Stage: ${stageName}`;
}

// === BIOFORM VISUAL FX MUTANTE ===
function drawMutant(seed, entropy, mutations, metamorph, cognition, containment) {
  const ctx = document.getElementById("specimenFx")?.getContext("2d");
  if (!ctx || !seed) return;
  const hash = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const baseRadius = 40 + mutations * 2 - entropy / 10;
  const pulse = Math.sin(Date.now() / 500) * (cognition / 10);
  const opacity = containment / 100;

  ctx.clearRect(0, 0, 200, 200);
  ctx.beginPath();
  for (let i = 0; i < 360; i += 5) {
    const angle = i * Math.PI / 180;
    const r = baseRadius + Math.sin(hash * angle * 0.01) * (5 + metamorph) + pulse;
    const x = 100 + r * Math.cos(angle);
    const y = 100 + r * Math.sin(angle);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(${entropy * 2}, ${100 + mutations * 10}, ${255 - metamorph * 10}, ${opacity})`;
  ctx.fill();
}

// === ANIMAZIONE CONTINUA ===
let animationTick = 0;
function animateCreature() {
  animationTick += 0.05;
  drawMutant(
    bioform.species,
    bioform.entropy + Math.sin(animationTick) * 5,
    bioform.mutations,
    bioform.metamorph,
    bioform.cognition,
    bioform.containment
  );
  requestAnimationFrame(animateCreature);
}
animateCreature();

// === AUTOSAVE ===
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

setInterval(() => {
  if (bioform && bioform.species) {
    autoSave(bioform);
  }
}, 60000);

const saved = localStorage.getItem("autosave");
if (saved) {
  const restored = JSON.parse(saved);
  Object.assign(bioform, restored);
  console.log(`🧬 Autosave restored — Species: ${bioform.species}`);
}

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
    assignRandomCases();
  }
}

window.addEventListener("load", loadExperimentState);
setInterval(saveExperimentState, 5000);

// === VITALS + EVOLUZIONE VISIVA ===
function updateVitals() {
  bioform.entropy += Math.floor(Math.random() * 3) - 1;
  bioform.coherence += Math.floor(Math.random() * 2) - 1;
  bioform.containment += Math.floor(Math.random() * 2) - 1;

  bioform.entropy = Math.max(0, Math.min(100, bioform.entropy));
  bioform.coherence = Math.max(0, Math.min(100, bioform.coherence));
  bioform.containment = Math.max(0, Math.min(100, bioform.containment));

  logEvent("INFO", `Vitals updated — Entropy: ${bioform.entropy}, Coherence: ${bioform.coherence}, Containment: ${bioform.containment}`);

  const advancedState = getAdvancedEvolution(bioform.metamorph);
  if (advancedState) {
    logEvent("EVOLVE", `Advanced Evolution: ${advancedState}`);
  }

  drawMutant(
    bioform.species,
    bioform.entropy,
    bioform.mutations,
    bioform.metamorph,
    bioform.cognition,
    bioform.containment
  );
}

setInterval(updateVitals, 60000);
updateVitals();

