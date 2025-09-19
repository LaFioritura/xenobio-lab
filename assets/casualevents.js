// 🧬 Lista estesa di eventi casuali
const events = [
  "Unexpected mutation detected. Entropy +10.",
  "Subject emits unidentified cognitive signals.",
  "Containment field destabilized. CR -5.",
  "Attempted communication failed. Subject remains incoherent.",
  "Biological anomaly detected in neural core.",
  "Neural spike registered. Cognition +5.",
  "Temporal echo detected. Reality distortion possible.",
  "Subject emits low-frequency pulses. Monitoring advised.",
  "Unstable protein synthesis observed.",
  "Bioform exhibits recursive behavior. Anomaly logged.",
  "Containment breach simulation triggered.",
  "Subject mimics researcher speech patterns.",
  "Synthetic tissue regeneration exceeded threshold.",
  "Quantum resonance anomaly detected.",
  "Subject enters passive stasis unexpectedly.",
  "Cognitive loop detected. Memory recursion active.",
  "Bioform emits pheromones with unknown effect.",
  "Entropy field stabilizing. CR +3.",
  "Subject attempts unauthorized neural override.",
  "Ambient radiation spike. Shielding compromised.",
  "Subject transmits encrypted signal. Decoding failed.",
  "Neural lattice restructuring in progress.",
  "Containment gel viscosity dropped below safe levels.",
  "Subject heartbeat syncs with lab systems.",
  "Unscheduled dream-state activation.",
  "Bioform mimics researcher biometric signature.",
  "Temporal displacement logged. Subject out of phase.",
  "Subject emits harmonic pulse. Audio systems disrupted.",
  "Containment field flickers. Visual distortion noted.",
  "Subject stares directly into camera. Duration: 47s.",
  "Unknown glyphs appear on chamber walls.",
  "Subject vocalizes in extinct dialect. Recording saved.",
  "Energy drain detected. Backup systems engaged.",
  "Subject requests termination. Request denied.",
  "Neural feedback loop destabilizing. Intervention required.",
  "Bioform emits signal matching deep-space probe.",
  "Subject's shadow moves independently.",
  "Containment logs overwritten. Source unknown.",
  "Subject levitates briefly. No explanation available.",
  "Chamber temperature drops 12°C in 3 seconds.",
  "Subject emits laughter. No mouth detected."
];

// 🧪 Funzione per mostrare un evento nel pannello
function showEvent() {
  const log = document.getElementById("log-panel");
  if (!log) return;

  const entry = document.createElement("span");
  entry.textContent = `🧬 ${events[Math.floor(Math.random() * events.length)]} `;
  entry.style.fontFamily = "'Share Tech Mono', monospace";
  entry.style.marginRight = "24px";
  log.appendChild(entry);

  // Scorrimento automatico verso destra
  log.scrollLeft = log.scrollWidth;
}

// 🔄 Mostra subito un evento all’avvio
showEvent();

// ⏱️ Imposta intervallo di 60 secondi per nuovi eventi
setInterval(showEvent, 60000);


