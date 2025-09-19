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
