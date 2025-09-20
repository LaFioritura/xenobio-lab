// main.js
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

// === FORME GEOMETRICHE CICLICHE ===
const baseForms = ["rhombus", "rectangle", "circle", "orbital", "infinity"];
const cycleColors = ["hsl(120, 70%, 50%)", "hsl(0, 100%, 50%)", "hsl(55, 100%, 50%)", "hsl(280, 100%, 60%)"];

function getVisualForm(metamorphLevel) {
  const index = metamorphLevel % baseForms.length;
  const cycle = Math.floor(metamorphLevel / baseForms.length);
  const shape = baseForms[index];
  const color = cycleColors[cycle % cycleColors.length];
  const distortion = cycle * 0.1;
  return { shape, color, distortion, cycle };
}

// === CURSOR TRACKING ===
let cursorX = 100;
let cursorY = 100;

document.addEventListener("mousemove", (e) => {
  const rect = document.getElementById("specimenFx")?.getBoundingClientRect();
  if (!rect) return;
  cursorX = e.clientX - rect.left;
  cursorY = e.clientY - rect.top;
});

// === BIOFORM VISUAL FX MUTANTE ===
function drawMutant(seed, entropy, mutations, metamorph, cognition, containment) {
  if (metamorph < 45) return;

  const canvas = document.getElementById("specimenFx");
  const ctx = canvas?.getContext("2d");
  if (!ctx || !seed) return;

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

  const hash = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pulse = Math.sin(Date.now() / 500) * (cognition / 10);
  const opacity = containment / 100;

  let offsetX = centerX;
  let offsetY = centerY;
  if (cognition > 60) {
    offsetX += (cursorX - centerX) * 0.1;
    offsetY += (cursorY - centerY) * 0.1;
  }

  const { color, distortion } = getVisualForm(metamorph);
  const baseRadius = 40 + mutations * 2 - entropy / 10 + distortion * 20;

  ctx.fillStyle = color;
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  for (let i = 0; i < 360; i += 5) {
    const angle = i * Math.PI / 180;
    const r = baseRadius + Math.sin(hash * angle * 0.01) * (5 + metamorph) + pulse;
    const x = offsetX + r * Math.cos(angle);
    const y = offsetY + r * Math.sin(angle);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
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

  // Rimuove il limite a metamorph
  if (bioform.metamorph > 9999) bioform.metamorph = 0;

  const { shape, color, distortion, cycle } = getVisualForm(bioform.metamorph);
  const bioformElement = document.getElementById("bioform");

  bioformElement.style.opacity = bioform.metamorph < 45 ? "1" : "0";
  bioformElement.style.backgroundColor = color;
  bioformElement.style.transform = `scale(${1 + distortion}) rotate(${distortion * 30}deg)`;
  bioformElement.style.borderRadius = shape === "circle" || shape === "orbital" ? "50%" : "0";
  bioformElement.style.boxShadow = `0 0 ${10 + cycle * 5}px ${color}`;

  logEvent("EVOLVE", `Form: ${shape} · Cycle ${cycle + 1}`);
}

setInterval(updateVitals, 60000);
updateVitals();
