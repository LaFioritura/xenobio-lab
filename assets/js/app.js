(function(){'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const SURVIVAL_TIPS=[
 "Monitor containment — breach events are irreversible.",
 "Research points unlock game-changing technologies.",
 "Offline time accelerates decay — check regularly.",
 "High Cognition enables advanced interactions.",
 "Emergency protocols can save critical failures.",
 "Entropy ≥ 90% risks a reality cascade.",
 "Balance all vitals to reach metamorphosis.",
 "Equipment grants passive benefits and automation."
];

const BIOFORM_STAGES=[
 {stage:1,char:'●',name:'Primordial Bioform'},
 {stage:2,char:'◉',name:'Coherent Structure'},
 {stage:3,char:'⬢',name:'Adaptive Entity'},
 {stage:4,char:'◈',name:'Metamorphic Being'},
 {stage:5,char:'⬟',name:'Transcendent Form'},
 {stage:6,char:'◊',name:'Reality Manipulator'},
 {stage:7,char:'⟡',name:'Universal Constant'},
 {stage:8,char:'∞',name:'[CLASSIFIED]'}
];

const SPECIES_LIB=[
  {name:'Aetheric', glyphs:['∙','◦','○','◍','◎','◉','✦','✺'], mod:{containment:1.0, coherence:1.0, entropy:0.9, cognition:1.1, metamorph:1.05}},
  {name:'Chitinous', glyphs:['·','⟡','⬢','⬣','⬡','⬢','⟐','⟑'], mod:{containment:1.1, coherence:0.95, entropy:1.0, cognition:0.95, metamorph:1.0}},
  {name:'Gelatinous', glyphs:['•','◉','◎','◍','◌','◓','◑','◕'], mod:{containment:0.95, coherence:1.1, entropy:0.95, cognition:1.0, metamorph:1.05}},
  {name:'Lithic', glyphs:['▢','▣','⬔','⬓','⬕','⬘','⬙','⬚'], mod:{containment:1.15, coherence:1.05, entropy:1.05, cognition:0.9, metamorph:0.95}},
  {name:'Plasmid', glyphs:['∙','∴','∷','⋮','⋱','⋰','⋯','∞'], mod:{containment:0.95, coherence:1.0, entropy:0.85, cognition:1.1, metamorph:1.1}},
  {name:'Nebular', glyphs:['·','*','✶','✷','✸','✹','✺','✵'], mod:{containment:1.0, coherence:1.05, entropy:0.95, cognition:1.0, metamorph:1.0}},
  {name:'Fractal', glyphs:['·','◴','◵','◶','◷','⟲','⟳','∞'], mod:{containment:1.0, coherence:1.0, entropy:1.0, cognition:1.05, metamorph:1.08}}
];
function randSeedString(){ const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s=''; for(let i=0;i<6;i++) s+=chars[Math.floor(Math.random()*chars.length)]; return s; }
function genSpecies(){
  const pick = SPECIES_LIB[Math.floor(Math.random()*SPECIES_LIB.length)];
  const seed = randSeedString();
  // Slight per-seed wobble on mods (±10%)
  const wobble=(x)=> Number((x * (0.9 + Math.random()*0.2)).toFixed(2));
  const mod={
    containment: wobble(pick.mod.containment),
    coherence:   wobble(pick.mod.coherence),
    entropy:     wobble(pick.mod.entropy),
    cognition:   wobble(pick.mod.cognition),
    metamorph:   wobble(pick.mod.metamorph),
  };
  return { name: pick.name, seed, glyphs: pick.glyphs, mod };
}
function ensureSpecies(){
  if(!state.species){ state.species = genSpecies(); }
  // Sync starting glyph with current stage
  const st = Math.max(1, Math.min(8, state.bioform.stage||1));
  const glyph = (state.species?.glyphs?.[st-1]) || BIOFORM_STAGES[st-1].char;
  state.bioform.form = glyph;
}

const ACHIEVEMENTS=[
 {id:'first_contact',name:'FIRST CONTACT',desc:'Establish initial bioform interaction',reward:75},
 {id:'containment_expert',name:'CONTAINMENT EXPERT',desc:'Hold 100% containment for 300s',reward:150},
 {id:'research_pioneer',name:'RESEARCH PIONEER',desc:'Accumulate 200 research points',reward:300},
];

const STORE_ITEMS={
 field_generator:{name:'CONTAINMENT FIELD GENERATOR',price:150,desc:'Auto-stabilizes when Containment < 20%.'},
 neural_amplifier:{name:'NEURAL ACTIVITY AMPLIFIER',price:250,desc:'+30 Cognition on use.'},
 entropy_regulator:{name:'ENTROPY REGULATION MATRIX',price:400,desc:'Reduces entropy over time (passive).'},
 deep_scanner:{name:'QUANTUM RESONANCE SCANNER',price:600,desc:'Unlocks hidden properties.'},
 emergency_sys:{name:'EMERGENCY CONTAINMENT SYSTEM',price:180,desc:'Single-use breach prevention.'},
 stasis_pod:{name:'TEMPORAL STASIS POD',price:800,desc:'Slows decay by 75% while offline.'},
};

const RESEARCH_COSTS={ biomechanics:75, quantum_biology:150, consciousness_mapping:250 };

const PROMOS=[
 {title:'FLASH SALE',text:'Containment Field Generator – Limited Stock!',discount:'-30%',item:'field_generator',factor:0.7},
 {title:'R&D SPECIAL',text:'Neural Amplifier Bundle',discount:'-25%',item:'neural_amplifier',factor:0.75},
 {title:'EMERGENCY',text:'Entropy Regulator — Crisis Prevention',discount:'-40%',item:'entropy_regulator',factor:0.6},
];

const DEFAULT={
 bioform:{ containment:100,coherence:75,metamorphosis:0,mutations:1,cognition:25,entropy:15, stage:1,form:'●',age:0,interactions:0 },
 facility:{ credits:1500,research:0,inventory:{},achievements:[],researchUnlocked:[],equipment:{}, agencyDebt:0 },
 session:{ startTime:Date.now(),lastUpdate:Date.now(),lastInteraction:Date.now(), loop:null,decayRate:1.0,threat:'MINIMAL',offlineTime:0, tickMs:1000,saveEvery:10,introShown:false,gdprAccepted:false,fx:true,haptics:true, lastGrant:0,grantCooldownSec:90,lastStipend:0 },
 quests: []
};

let state=load()||structuredClone(DEFAULT);

// ---------- Utils ----------
function save(){ if(!state.session.gdprAccepted) return; localStorage.setItem('bioformExperiment_v10x', JSON.stringify(state)); }
let saveTicker=0;
function fmt(n){return n.toString().padStart(2,'0');}
function ts(){const d=new Date();return `${fmt(d.getHours())}:${fmt(d.getMinutes())}:${fmt(d.getSeconds())}`;}
function log(message,kind='info'){ const el=document.createElement('div'); el.className='log-entry'; el.innerHTML=`<span class="log-ts">${ts()}</span><span class="badge ${kind==='error'?'err':kind}">${kind.toUpperCase()}</span><span>${message}</span>`; $('#log').appendChild(el); const logEl=$('#log'); logEl.scrollTop=logEl.scrollHeight; while(logEl.children.length>150) logEl.removeChild(logEl.firstChild); }
function toast(msg,type){ const t=document.createElement('div'); t.className=`toast${type==='error'?' err':''}`; t.textContent=msg; $('#toasts').appendChild(t); if(type==='error') AudioEngine.tone(180,.2,'square',.28); else AudioEngine.tone(660,.15,'sine',.22); setTimeout(()=>t.remove(),2800); }
function setThreat(v){ state.session.threat=v; $('#uiThreat').textContent=v; $('#chipThreat').textContent=v; }
function haptic(ms=20){ if(state.session.haptics && navigator.vibrate) navigator.vibrate(ms); }
function load(){ try{ const s=localStorage.getItem('bioformExperiment_v10x'); return s?JSON.parse(s):null; }catch(e){ return null; } }

// ---------- UI Binds ----------
function bindTabs(){ $$('.tab').forEach(btn=> btn.addEventListener('click', e=>{ $$('.tab').forEach(b=>b.classList.remove('is-active')); e.currentTarget.classList.add('is-active'); const id=e.currentTarget.dataset.target; $$('.panel').forEach(p=>p.classList.remove('is-active')); $('#'+id).classList.add('is-active'); AudioEngine.tone(1100,.08); if(id==='tab-store') updateGrantUI(); })); }
function bindHeader(){ $('#btnAudio').addEventListener('click', ()=>{ const on=!AudioEngine.isEnabled(); AudioEngine.setEnabled(on); $('#btnAudio').textContent=`Audio: ${on?'ON':'OFF'}`; if(on) AudioEngine.chord([660,880,990],.15); haptic(); }); $('#btnCompact').addEventListener('click', ()=>{ const root=document.documentElement; const on=!root.classList.contains('kit-compact'); root.classList.toggle('kit-compact',on); $('#btnCompact').textContent=`Compact: ${on?'ON':'OFF'}`; haptic(); }); $('#btnReset').addEventListener('click', ()=>{ if(!confirm('Reset experiment? This will erase local progress.')) return; state=structuredClone(DEFAULT); state.species=genSpecies(); ensureSpecies(); save(); renderAll(); startLoop(true); log(`New experiment initialized — Species: ${state.species.name} [${state.species.seed}]`,'ok'); AudioEngine.chord([440,660,880],.25); }); }
function bindPanels(){
  // Protocols
  $('#tab-protocols').addEventListener('click', e=>{ const b=e.target.closest('.btn'); if(!b||!b.dataset.action) return; execProtocol(b.dataset.action, Number(b.dataset.cost||0)); });
  // Unified Store listener (Buy/Use + Agency buttons)
  $('#tab-store').addEventListener('click', e=>{
    const t=e.target;
    if(t.classList.contains('grant')){ requestMicrogrant(); return; }
    if(t.classList.contains('publish')){ publishFindings(); return; }
    const itemEl=t.closest('.store-item'); if(!itemEl) return;
    const id=itemEl.dataset.id, price=Number(itemEl.dataset.price);
    if(t.classList.contains('buy')) buyItem(id, price);
    if(t.classList.contains('use')) useItem(id);
  });
  // Research
  $('#tab-research').addEventListener('click', e=>{ const card=e.target.closest('.store-item.research'); if(!card) return; if(e.target.classList.contains('research-buy')) doResearch(card.dataset.id); });
  // Quests
  $('#tab-quests').addEventListener('click', e=>{ const el=e.target.closest('[data-accept]'); if(!el) return; acceptQuest(el.dataset.accept); });
  // Settings
  $('#inpTick').addEventListener('change', e=>{ state.session.tickMs=Math.max(250,Number(e.target.value)); startLoop(true); toast('Tick rate updated'); });
  $('#inpSave').addEventListener('change', e=>{ state.session.saveEvery=Math.max(5,Number(e.target.value)); toast('Save interval updated'); });
  $('#inpFx').addEventListener('change', e=> state.session.fx=e.target.checked);
  $('#inpHaptics').addEventListener('change', e=> state.session.haptics=e.target.checked);
  // Modals
  $$('.modal [data-close]').forEach(b=> b.addEventListener('click', closeModals));
  $('#btnRestart').addEventListener('click', ()=>{ closeModals(); $('#btnReset').click(); });
  $('#btnIntroOk').addEventListener('click', ()=>{ state.session.introShown=true; closeModals(); });
}
function closeModals(){ $$('.modal').forEach(m=> m.style.display='none'); }
function showIntroIfNeeded(){ if(!state.session.introShown) $('#modalIntro').style.display='flex'; }
function showGdprIfNeeded(){ if(!state.session.gdprAccepted){ $('#gdpr').classList.remove('hidden'); $('#gdprAccept').onclick=()=>{ state.session.gdprAccepted=true; $('#gdpr').classList.add('hidden'); save(); initAfterConsent(); }; $('#gdprDecline').onclick=()=>{ document.body.innerHTML='<div style="padding:20px;color:#fff;background:#000">Experiment aborted — storage consent required.</div>'; }; } else initAfterConsent(); }
function initAfterConsent(){ restoreIfAny(); ensureSpecies(); renderAll(); bindKeyboard(); startLoop(); rotateTip(); schedulePromo(); refreshQuests(true); log(`Laboratory initialized — Species: ${state.species.name} [${state.species.seed}]`,'ok'); AudioEngine.tone(440,.2); updateGrantUI(); }

// ---------- Persistence & Offline Decay ----------
function restoreIfAny(){ try{ const s=localStorage.getItem('bioformExperiment_v10x'); if(!s) return; const saved=JSON.parse(s); const offline=Date.now()-(saved.session?.lastUpdate||Date.now()); if(offline>60_000) applyOfflineDecay(offline, saved); state=saved; state.session.lastUpdate=Date.now(); if(!state.species){ state.species=genSpecies(); } ensureSpecies(); log(`Saved experiment restored — Species: ${state.species.name} [${state.species.seed}]`,'ok'); AudioEngine.tone(660,.18); }catch(e){ log('Data corruption detected — fresh experiment started','error'); }}
function applyOfflineDecay(ms,s){ const h=ms/3_600_000; let mul=1; if(h>48){ s.bioform.containment=0; return; } else if(h>24) mul=5; else if(h>6) mul=3; else if(h>1) mul=1.5; const d=h*mul; s.bioform.containment=Math.max(0,s.bioform.containment-d*2); s.bioform.coherence=Math.max(0,s.bioform.coherence-d*1.5); s.bioform.entropy=Math.min(100,s.bioform.entropy+d*1); log(`Offline decay applied: ${h.toFixed(1)}h ×${mul}`,'warn'); }

// ---------- Loop ----------
function startLoop(restart=false){ if(restart&&state.session.loop) clearInterval(state.session.loop); if(state.session.loop) clearInterval(state.session.loop); state.session.loop=setInterval(tick, state.session.tickMs); }
function tick(){ const now=Date.now(); const dt=(now-state.session.lastUpdate)/1000; state.session.lastUpdate=now; const df=dt*state.session.decayRate;
  // Passive gear
  if(state.facility.equipment['field_generator'] && state.bioform.containment<20){ state.bioform.containment=Math.min(100,state.bioform.containment+0.6); }
  if(state.facility.equipment['entropy_regulator']){ state.bioform.entropy=Math.max(0,state.bioform.entropy-0.05); }
  // Natural change
  state.bioform.containment=Math.max(0,state.bioform.containment-(0.12*df)*(state.species?.mod?.containment||1));
  state.bioform.coherence=Math.max(0,state.bioform.coherence-(0.08*df)*(state.species?.mod?.coherence||1));
  state.bioform.entropy=Math.min(100,state.bioform.entropy+(0.03*df)*(state.species?.mod?.entropy||1));
  updateThreat(); updateUptime(); state.bioform.age=now-state.session.startTime;
  // Randoms
  if(Math.random()<0.002) randomEvent();
  if(Math.random()<0.001) showPromo();
  if(Math.random()<0.004) rotateTip();
  // Save
  saveTicker+=dt; if(saveTicker>=state.session.saveEvery){ save(); saveTicker=0; }
  // End conditions
  checkEnd();
  // Emergency stipend — immediate when credits reach 0 (debounce ~1s)
  if(state.facility.credits<=0 && (Date.now()-state.session.lastStipend)>1000){
    const stipend=120; state.facility.credits+=stipend; state.session.lastStipend=Date.now();
    state.bioform.entropy=Math.min(100,state.bioform.entropy+2);
    log(`Research Agency emergency stipend: +${stipend} CR`,'warn'); toast(`EMERGENCY STIPEND +${stipend} CR`);
  }
  // Render
  renderVitals();
}
function updateThreat(){ const c=state.bioform.containment, e=state.bioform.entropy; let t='MINIMAL'; if(c<15||e>85) t='CRITICAL'; else if(c<30||e>70) t='HIGH'; else if(c<50||e>50) t='MODERATE'; else if(c<70||e>30) t='LOW'; setThreat(t); }
function updateUptime(){ const sec=Math.floor((Date.now()-state.session.startTime)/1000); $('#uiUptime').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`; }
function checkEnd(){ let cause=null; if(state.bioform.containment<=0) cause='CONTAINMENT BREACH — Field integrity compromised'; else if(state.bioform.entropy>=100) cause='REALITY CASCADE — Entropy threshold exceeded'; else if(state.bioform.coherence<=0) cause='BIOFORM DISSOLUTION — Structural coherence lost'; if(cause){ clearInterval(state.session.loop); localStorage.removeItem('bioformExperiment_v10x'); $('#deathMsg').textContent=`Cause: ${cause}`; $('#modalDeath').style.display='flex'; toast('PERMADEATH','error'); AudioEngine.tone(150,1.2,'sawtooth',.45); log(`EXPERIMENT TERMINATED: ${cause}`,'error'); }}

// ---------- Render ----------
function renderVitals(){ const b=state.bioform;
  const set=(id,val)=>{$(id).textContent=Math.floor(val);};
  set('#vContainment',b.containment); set('#vCoherence',b.coherence); set('#vMetamorph',b.metamorphosis); $('#vMutations').textContent=b.mutations; set('#vCognition',b.cognition); set('#vEntropy',b.entropy);
  $('#barContainment').style.width=`${b.containment}%`; $('#barCoherence').style.width=`${b.coherence}%`; $('#barMetamorph').style.width=`${b.metamorphosis}%`; $('#barMutations').style.width=`${Math.min(b.mutations*8,100)}%`; $('#barCognition').style.width=`${b.cognition}%`; $('#barEntropy').style.width=`${b.entropy}%`;
  colorize('#barContainment',b.containment); colorize('#barCoherence',b.coherence); colorize('#barEntropy',100-b.entropy);
  $('#uiFunds').textContent=state.facility.credits; $('#uiResearch').textContent=state.facility.research; $('#uiResearchPoints').textContent=state.facility.research; $('#bioform').textContent=b.form;
}
function colorize(sel,val){ const el=$(sel); el.classList.remove('critical','warn','ok'); if(val<20) el.classList.add('critical'); else if(val<40) el.classList.add('warn'); else if(val>80) el.classList.add('ok'); }
function renderAll(){ renderVitals(); renderQuests(); }

// ---------- Protocols ----------
function execProtocol(id,cost){
  if(state.facility.credits<cost){ toast('Insufficient funding','error'); AudioEngine.tone(200,.18,'square'); return; }
  state.facility.credits-=cost; state.bioform.interactions++; state.session.lastInteraction=Date.now(); haptic();
  switch(id){
    case'stabilize': state.bioform.containment=Math.min(100,state.bioform.containment+25); AudioEngine.tone(660,.2); log('Containment stabilized','ok'); toast('CONTAINMENT STABILIZED'); break;
    case'monitor':{ const g=8+Math.floor(state.bioform.cognition/12); state.facility.research+=g; state.bioform.cognition=Math.min(100,state.bioform.cognition+3*(state.species?.mod?.cognition||1)); AudioEngine.tone(800,.18); log(`Monitoring complete — +${g} RP`,'ok'); toast(`+${g} RESEARCH`); break; }
    case'analyze':{ const g=12+Math.floor(Math.random()*8); state.facility.research+=g; AudioEngine.tone(1000,.16); log(`Analysis complete — Quantum coherence ${(Math.random()*100).toFixed(2)}%`,'info'); toast(`ANALYSIS +${g} RP`); break; }
    case'reinforce': state.bioform.containment=Math.min(100,state.bioform.containment+40); AudioEngine.tone(580,.22); log('Isolation barriers reinforced','ok'); toast('REINFORCED'); break;
    case'stimulate': state.bioform.cognition=Math.min(100,state.bioform.cognition+18); state.bioform.metamorphosis=Math.min(100,state.bioform.metamorphosis+12*(state.species?.mod?.metamorph||1)); state.bioform.containment=Math.max(0,state.bioform.containment-15); AudioEngine.tone(1200,.22,'triangle'); log('Neural stimulation applied','warn'); toast('BIOFORM STIMULATED'); break;
    case'stress_test': if(Math.random()<0.35){ state.bioform.containment=Math.max(0,state.bioform.containment-25); state.bioform.entropy=Math.min(100,state.bioform.entropy+20); AudioEngine.tone(300,.5,'sawtooth'); log('Stress test failure — containment compromised','error'); toast('TEST FAILED','error'); } else { const evo=15+Math.floor(Math.random()*20); state.bioform.metamorphosis=Math.min(100,state.bioform.metamorphosis+Math.round(evo*(state.species?.mod?.metamorph||1))); state.facility.research+=20; AudioEngine.tone(1400,.28); log('Stress test successful — evolutionary data acquired','ok'); toast(`TEST SUCCESS +${evo} METAMORPH`);} break;
    case'induce_mutation': state.bioform.mutations+=1; state.bioform.entropy=Math.min(100,state.bioform.entropy+8); AudioEngine.tone(900,.22,'triangle'); log('Mutation induced','warn'); toast('MUTATION +1'); break;
    case'force_metamorph': state.bioform.metamorphosis=Math.min(100,state.bioform.metamorphosis+Math.round(35*(state.species?.mod?.metamorph||1))); state.bioform.containment=Math.max(0,state.bioform.containment-20); state.bioform.entropy=Math.min(100,state.bioform.entropy+10); AudioEngine.tone(1250,.24,'sawtooth'); log('Forced metamorphosis applied','warn'); toast('FORCE APPLIED'); break;
    case'deep_scan': if(!state.facility.equipment['deep_scanner']){ toast('Requires Quantum Resonance Scanner','error'); break; } { const bonus=40+Math.floor(Math.random()*25); state.facility.research+=bonus; AudioEngine.chord([900,1100,1300],.2); log(`Deep scan complete — +${bonus} RP`,'ok'); toast(`DEEP SCAN +${bonus} RP`); } break;
    case'neural_interface': { const cog=10+Math.floor(Math.random()*10); state.bioform.cognition=Math.min(100,state.bioform.cognition+cog); AudioEngine.tone(1000,.25,'sine'); log('Neural link established','ok'); toast(`NEURAL LINK +${cog} COG`);} break;
    case'extract_samples': { const cr=120+Math.floor(Math.random()*80); state.facility.credits+=cr; state.bioform.coherence=Math.max(0,state.bioform.coherence-10); AudioEngine.tone(520,.2,'triangle'); log(`Samples extracted — +${cr} CR`,'info'); toast(`+${cr} CREDITS`);} break;
    case'emergency_protocol': state.bioform.containment=Math.min(100,state.bioform.containment+60); state.bioform.coherence=Math.min(100,state.bioform.coherence+40); state.bioform.entropy=Math.max(0,state.bioform.entropy-30); AudioEngine.tone(550,.9,'sine',.3); log('Emergency containment activated','ok'); toast('EMERGENCY ACTIVE'); break;
  }
  evolveIfNeeded(); unlockAchievements(); renderVitals();
}
function evolveIfNeeded(){ if(state.bioform.metamorphosis>=100 && state.bioform.stage<8){ state.bioform.stage++; state.bioform.metamorphosis=0; const s=BIOFORM_STAGES.find(x=>x.stage===state.bioform.stage); if(s){ state.bioform.form=s.char; state.bioform.containment=Math.min(100,state.bioform.containment+30); state.bioform.coherence=100; state.facility.credits+=300; state.facility.research+=75; AudioEngine.tone(1800,1.2,'triangle',.28); log(`METAMORPHOSIS: ${s.name}`,'ok'); toast(`EVOLUTION: ${s.name}`);} } }
function unlockAchievements(){ ACHIEVEMENTS.forEach(a=>{ if(state.facility.achievements.includes(a.id)) return; let ok=false; if(a.id==='first_contact') ok=state.bioform.interactions>=1; if(a.id==='containment_expert') ok=state.bioform.containment>=100; if(a.id==='research_pioneer') ok=state.facility.research>=200; if(ok){ state.facility.achievements.push(a.id); state.facility.credits+=a.reward; $('#achBody').innerHTML=`<div><strong>${a.name}</strong><div class="muted">${a.desc}</div><div class="muted">Reward: ${a.reward} CR</div></div>`; $('#modalAchievement').style.display='flex'; AudioEngine.tone(1760,.5); log(`Achievement unlocked: ${a.name}`,'ok'); toast(`ACHIEVEMENT: ${a.name}`);} }); }

// ---------- Interactions ----------
$('#bioform').addEventListener('click', ()=>{ state.bioform.coherence=Math.min(100,state.bioform.coherence+8); state.bioform.interactions++; state.session.lastInteraction=Date.now(); const lines=['Bioform exhibits recognition patterns','EM field fluctuations detected','Neural activity spikes in response','Minimal behavioral response recorded']; log(lines[Math.floor(Math.random()*lines.length)],'info'); AudioEngine.tone(880+Math.random()*440,.18); if(Math.random()<0.15){ state.facility.research+=2; toast('+2 RESEARCH'); } unlockAchievements(); haptic(); });

// ---------- Store & Agency ----------
function currentPromo(){ const el=$('#promoBanner'); return el.classList.contains('hidden')?null:el.dataset.item; }
function priceWithPromo(id,base){ const active=currentPromo(); if(!active||active!==id) return base; const p=PROMOS.find(x=>x.item===id); return Math.floor(base*(p?.factor||1)); }
function buyItem(id,base){ const price=priceWithPromo(id,base); if(state.facility.credits<price){ toast('Insufficient funding','error'); AudioEngine.tone(200,.18,'square'); return; } state.facility.credits-=price; (state.facility.inventory[id] ||= 0); state.facility.inventory[id]++; if(id==='entropy_regulator'||id==='field_generator'){ state.facility.equipment[id]=true; } log(`Acquired: ${STORE_ITEMS[id].name} (${price} CR)`,'ok'); toast(`ACQUIRED: ${STORE_ITEMS[id].name}`); AudioEngine.tone(1320,.2); renderVitals(); }
function useItem(id){ const c=state.facility.inventory[id]||0; if(!c){ toast('Not in inventory','error'); return; } switch(id){ case'neural_amplifier': state.bioform.cognition=Math.min(100,state.bioform.cognition+30); break; case'emergency_sys': state.bioform.containment=Math.min(100,state.bioform.containment+50); state.bioform.entropy=Math.max(0,state.bioform.entropy-15); break; case'stasis_pod': state.session.decayRate*=0.25; break; case'deep_scanner': log('Deep-scanner calibrated. DEEP SCAN now yields bonuses.','info'); state.facility.equipment['deep_scanner']=true; break; case'field_generator': case'entropy_regulator': state.facility.equipment[id]=true; break; } state.facility.inventory[id]--; toast(`USED: ${STORE_ITEMS[id].name}`); AudioEngine.chord([900,700],.16); renderVitals(); }

// Agency Funding
function grantReadyIn(){ const now=Date.now(); if(state.facility.credits<=0) return 0; const left=Math.max(0,(state.session.lastGrant+state.session.grantCooldownSec*1000)-now); return Math.ceil(left/1000); }
function updateGrantUI(){ const el=$('#grantCooldownText'); if(!el) return; const low=state.facility.credits<=0; const sec=grantReadyIn(); el.textContent= low? 'Ready (low funds)' : (sec>0? `Next microgrant in ${sec}s` : 'Ready'); const btn=document.querySelector('#tab-store .btn.grant'); if(btn) btn.disabled=false; }
setInterval(updateGrantUI, 500);
function requestMicrogrant(){ const sec=grantReadyIn(); const low=state.facility.credits<=0; if(sec>0 && !low){ toast(`Grant unavailable — ${sec}s`,'error'); return; } const amount=180; state.facility.credits+=amount; state.facility.agencyDebt+=Math.ceil(amount*0.1); state.bioform.entropy=Math.min(100,state.bioform.entropy+3); state.session.lastGrant=Date.now(); log(`Research Agency microgrant issued: +${amount} CR`,'ok'); toast(`MICROGRANT +${amount} CR`); AudioEngine.chord([700,900],.18); renderVitals(); updateGrantUI(); }
function publishFindings(){ const costRP=50,rewardCR=200; if(state.facility.research<costRP){ toast('Not enough RP to publish','error'); return; } state.facility.research-=costRP; state.facility.credits+=rewardCR; state.bioform.coherence=Math.max(0,state.bioform.coherence-3); log(`Published data package: -${costRP} RP / +${rewardCR} CR`,'info'); toast(`PUBLISHED: +${rewardCR} CR`); AudioEngine.tone(520,.2,'triangle'); renderVitals(); updateGrantUI(); }

// ---------- Research ----------
function doResearch(id){ const cost=RESEARCH_COSTS[id]; if(state.facility.research<cost){ toast('Insufficient RP','error'); return; } if(state.facility.researchUnlocked.includes(id)){ toast('Already researched'); return; } state.facility.research-=cost; state.facility.researchUnlocked.push(id); if(id==='biomechanics'){ state.session.decayRate*=0.85; } log(`Research completed: ${id.replace('_',' ').toUpperCase()}`,'ok'); toast(`RESEARCH: ${id.toUpperCase()}`); AudioEngine.tone(2200,.35); renderVitals(); }

// ---------- Events & Promo ----------
function randomEvent(){ const ev=[ {name:'QUANTUM FLUX',fx:()=>{state.bioform.entropy+=20; log('Quantum flux — field destabilized','warn');}}, {name:'CONSCIOUSNESS SURGE',fx:()=>{state.bioform.cognition+=30; state.bioform.metamorphosis+=15; log('Spontaneous consciousness expansion','warn');}}, {name:'FUNDING ALLOCATION',fx:()=>{const f=200+Math.floor(Math.random()*300); state.facility.credits+=f; log(`Emergency funding +${f} CR`,'ok');}} ]; const pick=ev[Math.floor(Math.random()*ev.length)]; pick.fx(); AudioEngine.tone(400+Math.random()*300,.5,'sawtooth',.22); toast(`EVENT: ${pick.name}`); }
function schedulePromo(){ setInterval(()=>{ if(Math.random()<.25) showPromo(); },15000); }
function showPromo(){ const p=PROMOS[Math.floor(Math.random()*PROMOS.length)]; $('#promoTitle').textContent=p.title; $('#promoBody').textContent=p.text; $('#promoDiscount').textContent=p.discount; const el=$('#promoBanner'); el.dataset.item=p.item; el.classList.remove('hidden'); setTimeout(()=> el.classList.add('hidden'),15000); }

// ---------- Tips ----------
function rotateTip(){ $('#tipText').textContent=SURVIVAL_TIPS[Math.floor(Math.random()*SURVIVAL_TIPS.length)]; }

// ---------- Quests (infinite, stable) ----------
function newQuest(){
  const stg=state.bioform.stage||1; const diffMul=1+(stg-1)*0.15; const rand=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
  const types=[];
  types.push(()=>{ const target=rand(70,90),duration=rand(90,180); const cr=Math.floor((100+target)*0.8*diffMul), rp=Math.floor((40+duration/3)*0.7*diffMul); return {id:'q_hold_'+Date.now()+rand(1,9999),name:'Hold the Line',desc:`Maintain Containment ≥ ${target}% for ${duration}s`,reward:{cr,rp},cond:()=>state.bioform.containment>=target,duration,time:duration}; });
  types.push(()=>{ const amount=rand(60,120),duration=rand(120,240); const cr=Math.floor((120+amount)*0.9*diffMul), rp=Math.floor((60+amount/2)*0.8*diffMul); return {id:'q_rp_'+Date.now()+rand(1,9999),name:'Rapid Insights',desc:`Gain ${amount} RP within ${duration}s`,reward:{cr,rp},cond:()=>true,target:'rp',amount,duration,time:duration}; });
  types.push(()=>{ const cap=rand(20,35),duration=rand(120,240); const cr=Math.floor((110+(35-cap)*6)*diffMul), rp=Math.floor((50+duration/3)*0.8*diffMul); return {id:'q_entropy_'+Date.now()+rand(1,9999),name:'Cold Vacuum',desc:`Keep Entropy ≤ ${cap} for ${duration}s`,reward:{cr,rp},cond:()=>state.bioform.entropy<=cap,duration,time:duration}; });
  types.push(()=>{ const amount=rand(15,40); const cr=Math.floor((80+amount*4)*diffMul), rp=Math.floor((30+amount*2)*diffMul); return {id:'q_click_'+Date.now()+rand(1,9999),name:'Establish Rapport',desc:`Interact with the Bioform ${amount}×`,reward:{cr,rp},cond:()=>true,target:'interactions',amount}; });
  return types[rand(0,types.length-1)]();
}
function makeQuests(n=3){ const out=[]; for(let i=0;i<n;i++) out.push(newQuest()); return out; }
function refreshQuests(initial=false){ const N=3; if(initial||!state.quests.length){ state.quests=makeQuests(N); } else { if(state.quests.length<N){ while(state.quests.length<N) state.quests.push(newQuest()); } else if(Math.random()<0.33){ state.quests.splice(Math.floor(Math.random()*state.quests.length),1,newQuest()); } } renderQuests(); }
function renderQuests(){ const box=$('#questList'); box.innerHTML=''; state.quests.forEach(q=>{ const el=document.createElement('div'); el.className='quest'; el.innerHTML=`<div class="quest-row"><div class="quest-name">${q.name}</div><div class="quest-meta">${q.time?`Time: ${q.time}s`:' '} — Reward: ${q.reward.cr} CR / ${q.reward.rp} RP</div></div><div class="quest-meta">${q.desc}</div><div class="quest-row"><div class="quest-meta">Progress: <span>${q.progress||0}</span>${q.amount?'/'+q.amount:''}</div>${q.accepted?'<span class="badge ok">ACTIVE</span>':`<button class="btn tiny" data-accept="${q.id}">Accept</button>`}</div>`; box.appendChild(el); }); }
function replaceQuest(q){ const i=state.quests.findIndex(x=>x.id===q.id); if(i>=0){ if(q.timer) clearInterval(q.timer); state.quests.splice(i,1,newQuest()); renderQuests(); } }
function failQuest(q){ toast('Quest failed','error'); log(`Quest failed: ${q.name}`,'error'); replaceQuest(q); }
function reward(q){ state.facility.credits+=q.reward.cr; state.facility.research+=q.reward.rp; toast(`QUEST COMPLETE: ${q.name}`); log(`Quest completed: ${q.name} — +${q.reward.cr} CR / +${q.reward.rp} RP`,'ok'); AudioEngine.chord([900,1200,1500],.22); replaceQuest(q); }
function acceptQuest(id){ const q=state.quests.find(x=>x.id===id); if(!q) return; q.accepted=true; if(q.time>0){ q.timer=setInterval(()=>{ if(q.cond()) q.progressTime=(q.progressTime||0)+1; q.time-=1; if(q.time<=0){ clearInterval(q.timer); if((q.progressTime||0)>=(q.duration||0)) reward(q); else failQuest(q); } renderQuests(); },1000); } log(`Quest accepted: ${q.name}`,'info'); toast('QUEST ACCEPTED'); renderQuests(); }
// Non-timer progress tracking
setInterval(()=>{ state.quests.forEach(q=>{ if(!q.accepted) return; if(q.target==='rp'){ q.baseRP ??= state.facility.research; q.progress=Math.max(0,state.facility.research - q.baseRP); if(q.amount && q.progress>=q.amount){ reward(q); } } if(q.target==='interactions'){ q.baseInt ??= state.bioform.interactions; q.progress=Math.max(0,state.bioform.interactions - q.baseInt); if(q.amount && q.progress>=q.amount){ reward(q); } } }); }, 1000);

// ---------- Particles ----------
const canvas=$('#specimenFx'), ctx=canvas.getContext('2d');
function resizeCanvas(){ const r=canvas.getBoundingClientRect(); canvas.width=r.width; canvas.height=r.height; }
resizeCanvas(); window.addEventListener('resize', resizeCanvas);
let particles=[]; function spawnParticles(n=4){ if(!state.session.fx) return; const w=canvas.width,h=canvas.height; for(let i=0;i<n;i++) particles.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.6,vy:(Math.random()-0.5)*0.6,a:1}); }
function drawParticles(){ if(!state.session.fx) return; ctx.clearRect(0,0,canvas.width,canvas.height); ctx.strokeStyle='rgba(0,255,65,0.4)'; particles.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x,p.y,1.5,0,Math.PI*2); ctx.stroke(); p.x+=p.vx; p.y+=p.vy; p.a-=0.006; }); particles=particles.filter(p=>p.a>0); requestAnimationFrame(drawParticles); }
spawnParticles(30); drawParticles(); setInterval(()=>spawnParticles(3),800);

// ---------- Keyboard & startup ----------
function bindKeyboard(){ document.addEventListener('keydown', e=>{ if(e.ctrlKey||e.metaKey||e.target.tagName==='INPUT') return; const k=e.key.toLowerCase(); if(k==='s'){e.preventDefault(); execProtocol('stabilize',25);} else if(k==='m'){e.preventDefault(); execProtocol('monitor',10);} else if(k==='a'){e.preventDefault(); execProtocol('analyze',15);} else if(k==='r'){e.preventDefault(); execProtocol('reinforce',50);} else if(k==='t'){e.preventDefault(); execProtocol('stimulate',30);} else if(k==='x'){e.preventDefault(); execProtocol('stress_test',40);} else if(k===' '){e.preventDefault(); $('#bioform').click();} else if(k==='escape'){ closeModals(); } }); document.addEventListener('click', ()=>{ if(AudioEngine.ctx.state==='suspended') AudioEngine.ctx.resume(); }); window.addEventListener('beforeunload', (e)=>{ if(state.session.loop && state.bioform.containment>0){ e.preventDefault(); e.returnValue='Bioform containment will be lost. Continue anyway?'; } }); }
function showIntroSoon(){ setTimeout(()=>showIntroIfNeeded(), 400); }
bindTabs(); bindHeader(); bindPanels(); showIntroSoon(); showGdprIfNeeded();
})();