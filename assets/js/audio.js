// WebAudio engine (unchanged UX)
const AudioEngine = (() => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let enabled = true;
  function tone(freq, dur=0.15, type='sine', vol=0.25){
    if (!enabled) return;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type; osc.frequency.value = freq; gain.gain.value = vol;
    osc.connect(gain); gain.connect(ctx.destination);
    const now = ctx.currentTime; osc.start(now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur); osc.stop(now + dur);
  }
  function chord(freqs=[440,660,880], dur=.2){ freqs.forEach((f,i)=> setTimeout(()=> tone(f, dur, i%2?'triangle':'sine', .18), i*10)); }
  function setEnabled(v){ enabled = v; } function isEnabled(){ return enabled; }
  return { tone, chord, setEnabled, isEnabled, ctx };
})();
