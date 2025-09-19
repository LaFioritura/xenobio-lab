const events = [
  "Unexpected mutation detected. Entropy +10.",
  "Subject emits unidentified cognitive signals.",
  "Containment field destabilized. CR -5.",
  "Attempted communication failed. Subject remains incoherent.",
  "Biological anomaly detected in neural core."
];

function showEvent() {
  const log = document.getElementById("log-panel");
  const entry = document.createElement("p");
  entry.textContent = `🧬 ${events[Math.floor(Math.random() * events.length)]}`;
  log.appendChild(entry);
}

setInterval(showEvent, 60000); // ogni 60 secondi
