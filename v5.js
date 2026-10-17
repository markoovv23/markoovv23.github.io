/* =========================================================================
   САД ПРОГРЕССА — v5.js
   Слой v5: дизайн главной, премиум-хаб, дух сада, все премиум-функции.
   ВАЖНО: подключается ПОСЛЕ v4.js.
   ========================================================================= */

/* ---------- 0. Состояние премиум-слоя ---------- */
S.pm = Object.assign(
  { mem:[], falls:[], log:[],
    sp:{ k:'spirit', name:'Лучик', ch:'kind', vo:'soft', gl:'#9ff5d0' },
    rem:{ on:0, min:30 }, voice:0, ad:1, q:{} },
  S.pm || {}
);

/* ---------- 1. Иконки v5 ---------- */
const XP = {
  fog:   '<path d="M7 17a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8a4.5 4.5 0 0 1 .5 9z" fill="currentColor" fill-opacity=".2"/><path d="M5 21h6M13 21h6"/>',
  noise: '<path d="M2 7q2.5-3 5 0t5 0 5 0 5 0M2 12q2.5-3 5 0t5 0 5 0 5 0M2 17q2.5-3 5 0t5 0 5 0 5 0"/>',
  calm:  '<path d="M5 19C4 10 10 4 20 4c0 10-6 16-13 15z" fill="currentColor" fill-opacity=".2"/><path d="M5 19c3-5 6-8 11-11"/>',
  res:   '<circle cx="12" cy="12" r="4.5" fill="currentColor" fill-opacity=".25"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  plus:  '<path d="M12 5v14M5 12h14"/>',
  spark: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="currentColor" fill-opacity=".25"/>',
  mic:   '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'
};
const xi = (n, s=24) => `<svg class="xic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${XP[n]}</svg>`;
IC.spirit = '<path d="M12 3c4 2 6 6 5 10-1 4-3 6-5 8-2-2-4-4-5-8-1-4 1-8 5-10z"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/>';

/* ---------- 2. Дух: справочники, уровни, речь ---------- */
const P1 = () => sub() ? true : (toast('Это функция Премиума'), openPremium(), false);
const SPK = { fairy:'Феечка', gnome:'Гномик', fox:'Лисёнок', owl:'Сова', spirit:'Дух леса', dragon:'Дракон' };
const SPC = { kind:'Добрый', wise:'Мудрый', play:'Озорной', calm:'Спокойный' };
const SPV = { soft:['Мягкий',1.25,.9], deep:['Низкий',.7,.85], bright:['Звонкий',1.6,1] };
const GLC = ['#9ff5d0','#ffd23f','#ff9ed1','#8fdcff','#c9b3ff','#ffb27a'];

const lvl = () => 1 + Math.floor(Math.sqrt(S.done*2 + S.pm.log.length/2));
const spArt  = (k = S.pm.sp.k) => `<svg viewBox="0 0 100 100">${AVS[k][2]()}</svg>`;
const spHTML = (c='', s) => {
  const p = S.pm.sp, L = lvl();
  return `<div class="sprt ${c}" style="--gc:${p.gl};--sz:${s || 60+Math.min(L,12)*4}px">
    <div class="aura"></div><div class="sbody">${spArt()}</div>
    ${L>=3 ? '<i class="crn">✦</i>' : ''}
  </div>`;
};
function spSay(){
  const p = S.pm, st = p.sp;
  const td = new Date().toDateString();
  const dn = p.log.filter(x => new Date(x).toDateString() == td).length;
  const fl = p.falls.filter(f => Date.now()-f.t < 3*864e5).length;
  const h = {}; p.log.forEach(x => { const k = new Date(x).getHours(); h[k] = (h[k]||0)+1; });
  const b = Object.keys(h).sort((x,y) => h[y]-h[x])[0];
  let t =
    S.mood == 'fog'   ? 'Ты в тумане. Один микро-шаг. Я рядом.' :
    S.mood == 'noise' ? 'Много шума. Давай тише: одно дело или дыхание вместе.' :
    fl > 1            ? 'Срывы бывают у всех. Начнём с самого маленького. Я с тобой.' :
    dn >= 3           ? `Уже ${dn} шагов сегодня. Я сияю вместе с тобой!` :
    S.mood == 'res'   ? 'Ты в ресурсе. Самое время для чего-то важного!' :
    b != null         ? `Тебе лучше всего идётся около ${b}:00. Попробуем один шаг?` :
                        'Давай начнём с маленького. Я рядом.';
  const pre = { kind:'', wise:'Знаешь, ', play:'Эй! ', calm:'Тихо… ' }[st.ch];
  return pre ? pre + t[0].toLowerCase() + t.slice(1) : t;
}
function say(t){
  try {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(t), v = SPV[S.pm.sp.vo];
    u.lang = 'ru-RU'; u.pitch = v[1]; u.rate = v[2];
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch(e) {}
}
function react(m){
  document.querySelectorAll('.sprt').forEach(e => {
    e.classList.remove('rx'); void e.offsetWidth; e.classList.add('rx');
  });
  if (m && S.pm.voice && sub()) say(m);
}
document.addEventListener('click', e => {
  const s = e.target.closest('.garden .sprt'); if (!s) return;
  const g = s.closest('.garden');
  const a = g.getBoundingClientRect(), r = s.getBoundingClientRect();
  const t = spSay();
  g.querySelectorAll('.sbub').forEach(x => x.remove());
  const b = document.createElement('div');
  b.className = 'sbub'; b.textContent = t;
  b.style.left = Math.min(a.width-100, Math.max(100, r.left + r.width/2 - a.left)) + 'px';
  b.style.top  = (r.top - a.top) + 'px';
  g.appendChild(b); setTimeout(() => b.remove(), 4500);
  react(t);
});

/* ---------- 3. Главная: дизайн из файла 2 ---------- */
const moodChips2 = () => Object.keys(MOODS).map(k =>
  `<button class="mc chip ${S.mood==k?'on':''}" data-k="${k}" onclick="setMood('${k}')">${xi(k,30)}${MOODS[k].n}</button>`
).join('');

tasksS = function(){
  return `<div class="hm fresh">
    <div class="hh">
      <div>${avatar(S.user,58)}</div>
      <div class="hg"><h1>Привет, ${esc(S.user.nick)}</h1><small id="tip">${MOODS[S.mood].tip}</small></div>
      <div class="dew gl">${dropI()}${S.dew}</div>
      <div id="tree" class="tbox" onclick="go('garden')" title="Мой сад"><div class="art">${ART[bestTree()]()}</div></div>
    </div>
    <div class="gl"><b>Как ты сейчас?</b> <small>Можно менять в течение дня</small><div class="xch">${moodChips2()}</div></div>
    ${sub() ? `<div class="gl sps"><div>${spHTML('mini',54)}</div><div><small>${esc(S.pm.sp.name)} говорит</small><div id="sps2" class="sayt">${esc(spSay())}</div></div></div>` : ''}
    <div id="msgs" class="msgs">${chatHTML()}</div>
    <button class="sign" onclick="$('#ci').focus()">${xi('plus')}Новая задача</button>
    <div class="cin">
      <input id="ci" placeholder="Напиши задачу — разобью на шаги" maxlength="120" onkeydown="if(event.key=='Enter')sendTask()">
      <button class="btn" id="mic" onclick="micOn()" aria-label="Голос">${xi('mic',22)}</button>
      <button class="btn go" onclick="sendTask()" aria-label="Отправить">${I(IC.send)}</button>
    </div>
    <button class="prem" onclick="go('spirit')">${xi('spark')}Дух сада и Премиум</button>
  </div>`;
};

/* ---------- 4. Обёртки setMood / tabbar / garden / openPremium ---------- */
const _sm5 = setMood;
setMood = function(k){
  _sm5(k);
  document.body.className = 'xm-'+k + (tab=='tasks'?' hm-on':'');
  const e = $('#sps2'); if (e) e.textContent = spSay();
  react();
};
tabbar = function(){
  const T = [['tasks','Чат'],['garden','Сад'],['spirit','Дух'],['shop','Магазин'],['nb','Соседи'],['me','Профиль']];
  return `<nav class="tabs">${T.map(([k,n]) =>
    `<button class="tab ${tab==k?'on':''}" onclick="go('${k}')">${I(IC[k])}${n}</button>`
  ).join('')}</nav>`;
};
const _g5 = gardenS;
gardenS = function(){
  const h = _g5();
  return sub() ? h.replace('<div class="abs haze">', spHTML('') + '<div class="abs haze">') : h;
};
const _op5 = openPremium;
openPremium = function(){
  _op5();
  const e = document.querySelector('#ov .pm h1');
  if (e) e.insertAdjacentHTML('afterend', `<div class="card" style="background:linear-gradient(135deg,#fff3c9,#ffe0f0)">
    <b>Что даёт Премиум</b>
    ${FT.map(f => `<div style="margin-top:8px">• <b>${f[1]}</b> — <small>${f[2]}</small></div>`).join('')}
    <div style="margin-top:8px">• <b>Свой Дух сада</b> — <small>живёт в саду, чувствует состояние и растёт с тобой.</small></div>
  </div>`);
};

/* ---------- 5. Окна ---------- */
const xc = () => { const o = $('#xo'); o && o.remove(); };
const xh = t => `<div class="row"><h2>${t}</h2><button class="btn sm sec" onclick="xc()">Закрыть</button></div>`;
function xm(h){
  xc();
  const o = document.createElement('div');
  o.className = 'xov'; o.id = 'xo';
  o.onclick = e => { if (e.target === o) xc(); };
  o.innerHTML = `<div class="xb2">${h}</div>`;
  document.body.appendChild(o);
}
const tg = (k,f) => { S.pm[k] = S.pm[k] ? 0 : 1; save(); f(); };
const cb = (on, l, fn) => `<button class="btn sm ${on?'':'sec'}" onclick="${fn}">${l}: ${on?'вкл':'выкл'}</button>`;

/* ---------- 6. Премиум-функции ---------- */

/* 6.1 Голосовой ввод */
function micOn(){
  if (!P1()) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return toast('Голосовой ввод не поддерживается в этом браузере');
  const r = new SR(), m = $('#mic');
  r.lang = 'ru-RU';
  r.onresult = e => { $('#ci').value = e.results[0][0].transcript; };
  r.onend    = () => m && m.classList.remove('rec');
  r.onerror  = () => toast('Не расслышал(а). Попробуй ещё раз');
  m.classList.add('rec');
  try { r.start(); } catch(e) {}
}

/* 6.2 Чат-компаньон */
function companion(){
  const p = S.pm, l = p.mem.slice(-1)[0];
  const a = ['Слышу тебя. Это правда непросто.'];
  if (l) a.push(`Помню, недавно ты брался(лась) за «${l.t}». Начать уже было шагом.`);
  if (S.done) a.push(`Закрытых задач у тебя уже ${S.done}. Это не исчезает.`);
  if (p.falls.length) a.push('Срывы в дневнике — это данные, а не приговор.');
  a.push('Выберем один микро-шаг или подышим вместе? Кнопка «Пауза» в карточке задачи.');
  return a.join(' ');
}
function adapt(){
  const t = S.tasks[S.tasks.length-1];
  if (!t || !t.s || t.ad || S.pm.ad === 0) return '';
  t.ad = 1;
  const m = S.mood;
  const h = S.pm.falls.filter(f => Date.now()-f.t < 7*864e5).length;
  let o = '';
  if (m == 'fog' || h >= 2) {
    t.s.forEach(x => x.w = Math.max(1, x.w-1));
    t.s.unshift({ t:'Сделай один медленный вдох', w:1, d:0, k:0 });
    o = 'Сделал шаги мягче и добавил вдох в начало. ';
  }
  if (m == 'noise' && t.s.length > 4) { t.s.splice(4); o = 'Оставил только 4 шага, чтобы было тише. '; }
  if (m == 'res') { t.s.push({ t:'Бонус: сделай ещё одну часть сверх плана', w:3, d:0, k:0 }); o = 'Ты в ресурсе, поэтому добавил бонусный шаг. '; }
  return o;
}
const _stk = sendTask;
sendTask = async function(){
  const el = $('#ci'), v = el.value.trim(); if (!v) return;
  if (sub() && /тяжело|не могу|устал|плохо|срыв|сорвал|тревож|страшно|ничего не получается|выгор/i.test(v)) {
    el.value = '';
    const n0 = S.chat.length, t = companion();
    S.chat.push({ r:'u', t:v }, { r:'b', t });
    save(); paintChat(n0, 1); react(t);
    return;
  }
  await _stk();
  if (!sub()) return;
  const p = S.pm, pv = p.mem.slice(-1)[0], ad = adapt();
  p.mem.push({ t:v, d:Date.now() }); p.mem = p.mem.slice(-40);
  const m = ad
    + (pv ? `Помню, раньше ты брался(лась) за «${pv.t}». ` : '')
    + (S.done ? `Закрыто задач: ${S.done}. Справимся и с этой.` : '');
  const n0 = S.chat.length;
  if (m) S.chat.push({ r:'b', t:m.trim() });
  save(); paintChat(n0-1, 1);
  const t = S.tasks[S.tasks.length-1];
  react(p.voice && t && t.s[0] ? 'Вот шаги. Начнём с первого: ' + t.s[0].t : 0);
};
const _sd5 = stepDone;
stepDone = function(id, i, b){
  const was = tk(id).s[i].d;
  _sd5(id, i, b);
  if (was || !sub()) return;
  S.pm.log.push(Date.now()); save();
  const t = tk(id), nx = t.s.find(x => !x.d && !x.k);
  const pr = ['Отлично, шаг сделан!','Ты молодец. Ещё один маленький шаг.','Вот так, спокойно и верно.'][Math.random()*3|0];
  react(pr + (nx ? ' Дальше: ' + nx.t : ' Задача закончена. Гордись собой!'));
};
function xChat(){
  const p = S.pm;
  xm(xh('Чат-компаньон') + `<p>Чат помнит твои задачи, успехи и срывы и отвечает точнее. В памяти: задач ${p.mem.length}, шагов ${p.log.length}, записей в дневнике ${p.falls.length}.</p><p><small>Напиши в чате «мне тяжело» — отвечу не по шаблону. Микрофон рядом с полем ввода — голосовой ввод.</small></p><button class="btn sm sec" onclick="S.pm.mem=[];save();xChat()">Забыть мои прошлые задачи</button>`);
}

/* 6.3 Адаптивные задачи */
function xAdapt(){
  xm(xh('Адаптивные задачи') + `<p>Новые задачи подстраиваются: в тумане и после срывов шаги мягче и начинаются с вдоха; в шуме — короче; в ресурсе — добавляется бонусный шаг.</p>${cb(S.pm.ad !== 0,'Подстройка','S.pm.ad=S.pm.ad===0?1:0;save();xAdapt()')}`);
}

/* 6.4 Мягкие напоминания */
let lastAct = Date.now();
['pointerdown','keydown'].forEach(e => addEventListener(e, () => lastAct = Date.now()));
const gentle = () => S.mood == 'fog' || S.mood == 'noise'
  ? 'Слышу, что сейчас непросто. Посидим вместе? Один крошечный шаг, и я рядом.'
  : 'Привет. Если захочется, один маленький шаг ждёт. Без спешки.';
setInterval(() => {
  const r = S.pm.rem;
  if (!sub() || !r.on || Date.now()-lastAct < r.min*6e4 || !S.tasks.some(x => !x.d)) return;
  lastAct = Date.now();
  const m = gentle();
  toast(m);
  try { Notification.permission == 'granted' && new Notification('Сад Прогресса', { body:m }); } catch(e) {}
  if (S.pm.voice) say(m);
}, 30000);
function xRem(){
  const r = S.pm.rem;
  xm(xh('Мягкие напоминания') + `<p>Никаких «ты не сделал». Если ты молчишь, я мягко спрошу, как дела, с учётом настроения.</p>${cb(r.on,'Напоминания',"S.pm.rem.on=S.pm.rem.on?0:1;save();try{Notification.requestPermission()}catch(e){}xRem()")}<h3>Если тебя нет</h3><div class="chips">${[15,30,60].map(m => `<button class="mc ${r.min==m?'on':''}" style="background:#f4f0ff" onclick="S.pm.rem.min=${m};save();xRem()">${m} мин</button>`).join('')}</div><button class="btn sm sec" onclick="toast(gentle())">Показать пример</button>`);
}

/* 6.5 Дневник срывов */
const TRG = ['Усталость','Шум и отвлечения','Тревога','Перфекционизм','Скука','Не знал(а), с чего начать'];
let ftr = -1;
function fallAnalysis(){
  const f = S.pm.falls;
  if (f.length < 2) return 'Пока мало записей. Когда их станет 3–4, покажу, что повторяется. Это не оценка, а карта.';
  const c = fn => {
    const o = {};
    f.forEach(x => { const k = fn(x); o[k] = (o[k]||0)+1; });
    return Object.entries(o).sort((a,b) => b[1]-a[1])[0];
  };
  const tr = c(x => TRG[x.tr]);
  const hr = c(x => { const h = new Date(x.t).getHours(); return h<12 ? 'утром' : h<18 ? 'днём' : 'вечером'; });
  return `Чаще всего это бывает ${hr[0]} (${hr[1]} из ${f.length}), главный фактор: «${tr[0].toLowerCase()}». Это закономерность, а не слабость. Можно ставить лёгкие шаги на другое время и заранее снижать этот фактор.`;
}
function xFall(){
  xm(xh('Дневник срывов') + `<small>Здесь нет «плохо». Только наблюдения, чтобы тебе было легче.</small><h3>Что было рядом?</h3><div class="chips">${TRG.map((t,i) => `<button class="mc ${ftr==i?'on':''}" style="background:#f4f0ff" onclick="ftr=${i};xFall()">${t}</button>`).join('')}</div><input id="fn" placeholder="Что произошло? (по желанию)" maxlength="100"><button class="btn sm" style="margin-top:8px" onclick="fAdd()">Записать</button><div class="card"><b>Что я вижу</b><p>${fallAnalysis()}</p></div>` + S.pm.falls.slice(-5).reverse().map(x => `<div class="task"><span>${new Date(x.t).toLocaleString('ru',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})} · ${TRG[x.tr]}${x.n?' — '+esc(x.n):''}</span></div>`).join(''));
}
function fAdd(){
  if (ftr < 0) return toast('Выбери, что было рядом');
  S.pm.falls.push({ t:Date.now(), tr:ftr, n:$('#fn').value.trim() });
  ftr = -1; save();
  toast('Записано. Это нормально. Ты здесь, и это главное.');
  xFall();
}

/* 6.6 Совместные задачи */
let SH = null, shTi, BC = null;
try {
  BC = new BroadcastChannel('sad-co');
  BC.onmessage = e => {
    if (SH && e.data.t == SH.t) { SH.fx = e.data.me; SH.real = 1; shPaint(); }
  };
} catch(e) {}
function xSh(){ xm(xh('Вместе с другом') + '<div id="shb"></div>'); shPaint(); }
function shPaint(){
  const b = $('#shb'); if (!b) return;
  if (!SH) {
    const f = S.friends.length ? S.friends : Object.keys(DB);
    b.innerHTML = `<p>Выбери друга и общую задачу из 5 шагов. Вы видите прогресс друг друга сразу.</p>
      <input id="sht" placeholder="Общая задача" maxlength="60" style="margin-bottom:8px">
      <select id="shf" style="width:100%;padding:12px;border-radius:16px;border:2px solid #e5defa;margin-bottom:8px">${f.map(n => `<option>${n}</option>`).join('')}</select>
      <button class="btn" onclick="shStart()">Начать вместе</button>
      <p><small>В демо шаги друга имитируются. Открой файл во второй вкладке и начни ту же задачу: тогда шаги придут по-настоящему.</small></p>`;
    return;
  }
  const bar = (n,v) => `<div class="row" style="margin-top:8px"><b>${n}</b><small>${v}/${SH.n}</small></div><div class="bar"><i style="width:${v/SH.n*100}%"></i></div>`;
  b.innerHTML = `<h3>${esc(SH.t)}</h3>${bar('Ты', SH.me)}${bar('@'+SH.f+(SH.real?' (живой)':''), SH.fx)}
    <div class="gbar">
      <button class="btn" onclick="shStep()" ${SH.me>=SH.n?'disabled':''}>Мой шаг</button>
      <button class="btn sm ghost" onclick="SH=null;clearInterval(shTi);shPaint()">Закончить</button>
    </div>
    <small>${SH.me>=SH.n && SH.fx>=SH.n ? 'Вы сделали это вместе!' : 'Идём в своём темпе.'}</small>`;
}
function shStart(){
  const t = $('#sht').value.trim(); if (!t) return toast('Напиши задачу');
  SH = { t, f:$('#shf').value, n:5, me:0, fx:0, real:0 };
  clearInterval(shTi);
  shTi = setInterval(() => {
    if (SH && !SH.real && SH.fx < SH.n && Math.random() < .5) { SH.fx++; shPaint(); }
  }, 6000);
  shPaint();
}
function shStep(){
  if (SH.me >= SH.n) return;
  SH.me++; S.dew += 2; save();
  BC && BC.postMessage({ t:SH.t, me:SH.me });
  react(); shPaint();
  if (SH.me >= SH.n) toast('Твоя часть готова. +2 капельки за каждый шаг');
}

/* 6.7 Голос «Рядом» */
function xVoice(){
  xm(xh('Голос «Рядом»') + `<p>Дух сада комментирует голосом: читает первый шаг, хвалит после каждого и называет следующий. Голос — тот, что выбран для Духа.</p>${cb(S.pm.voice,'Голос',"S.pm.voice=S.pm.voice?0:1;save();xVoice()")}<div class="chips">${Object.keys(SPV).map(k => `<button class="mc ${S.pm.sp.vo==k?'on':''}" style="background:#f4f0ff" onclick="S.pm.sp.vo='${k}';save();xVoice()">${SPV[k][0]}</button>`).join('')}</div><button class="btn sm sec" onclick="say('Я рядом. Давай сделаем один маленький шаг.')">Послушать</button>`);
}

/* 6.8 Глубокий ИИ-разбор */
async function askT(p){
  try {
    if (AI_URL) return await (await fetch(AI_URL, {
      method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ prompt:p })
    })).text();
    if (window.claude && claude.complete) return await Promise.race([claude.complete(p), new Promise((_,j) => setTimeout(j,15000))]);
  } catch(e) {}
  return null;
}
function deepLocal(t){
  const h = t.s.filter(x => x.w >= 4).map(x => '«'+x.t+'»').slice(0,2).join(' и ');
  return `Почему трудно: в «${t.t}» ${t.s.length} шагов${h ? ', самые тяжёлые — '+h : ''}. Обычно сложно не само дело, а старт: нет понятного первого движения и сразу много решений.

Как обойти: делай только первый шаг и ставь таймер на 2 минуты; заранее подготовь всё нужное, чтобы не выбирать; тяжёлые шаги дроби кнопкой «Помоги разобрать»; после трудного шага отдыхай. Остановиться тоже можно.`;
}
function xDeep(){
  const T = S.tasks.filter(t => t.s);
  xm(xh('ИИ-разбор задач') + (T.length
    ? '<small>Выбери задачу из чата.</small>' + T.map(t => `<div class="task"><span>${esc(t.t)}</span><button class="btn sm" onclick="deep(${t.id})">Разобрать</button></div>`).join('')
    : '<p>Сначала добавь задачу в чате.</p>') + '<div id="dp" class="card" style="display:none;white-space:pre-wrap"></div>');
}
async function deep(id){
  const t = tk(id), e = $('#dp');
  e.style.display = 'block'; e.textContent = 'Думаю…';
  const a = await askT(`Задача: «${t.t}». Шаги: ${t.s.map(x => x.t).join('; ')}. Объясни по-русски мягко и коротко (до 120 слов): почему такая задача может быть тяжёлой психологически и как её обойти. Без давления.`);
  e.textContent = a ? String(a).trim() : deepLocal(t);
}

/* 6.9 Экспорт */
const dl = (n, tx, ty) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([tx], { type:ty }));
  a.download = n; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 999);
};
const exItems = () => S.tasks.filter(t => !t.d).flatMap(t => t.s ? t.s.filter(x => !x.d && !x.k).map(x => [t.t, x.t]) : [[t.t, '']]);
function exGo(k){
  const it = exItems();
  if (!it.length) return toast('Нет невыполненных задач');
  const q = s => '"' + String(s).replace(/"/g, '""') + '"';
  if (k == 'ics') {
    let d = new Date(); d.setMinutes(0,0,0); d = +d + 36e5;
    const f = x => new Date(x).toISOString().replace(/[-:]/g,'').slice(0,15) + 'Z';
    const c = s => s.replace(/[,;\n]/g, ' ');
    dl('sad-progressa.ics',
      'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Sad Progressa//RU\r\n'
      + it.map(([t,s], i) => `BEGIN:VEVENT\r\nUID:sad${Date.now()}${i}@sad\r\nDTSTAMP:${f(Date.now())}\r\nDTSTART:${f(d+i*18e5)}\r\nDTEND:${f(d+i*18e5+9e5)}\r\nSUMMARY:${c(s||t)}\r\nDESCRIPTION:${c(t)}\r\nEND:VEVENT\r\n`).join('')
      + 'END:VCALENDAR',
      'text/calendar');
  } else if (k == 'todo') {
    dl('todoist.csv',
      'TYPE,CONTENT,PRIORITY,INDENT\n'
      + S.tasks.filter(t => !t.d).flatMap(t => [
          `task,${q(t.t)},4,1`,
          ...(t.s||[]).filter(x => !x.d && !x.k).map(x => `task,${q(x.t)},4,2`)
        ]).join('\n'),
      'text/csv');
  } else {
    dl('notion.csv',
      'Name,Task,Status\n'
      + it.map(([t,s]) => `${q(s||t)},${q(t)},Not started`).join('\n'),
      'text/csv');
  }
  toast('Файл готов. Загляни в загрузки');
}
function xEx(){
  xm(xh('Экспорт в жизнь') + `<p>Выгрузка невыполненных шагов (${exItems().length}).</p><div class="gbar"><button class="btn sm" onclick="exGo('ics')">Календарь (.ics)</button><button class="btn sm" onclick="exGo('todo')">Todoist (CSV)</button><button class="btn sm" onclick="exGo('notion')">Notion (CSV)</button></div><small>.ics открывается в Google, Apple и Outlook календарях. В Todoist и Notion файл импортируется через «Импорт».</small>`);
}

/* 6.10 Квесты месяца */
const QN = ['Ночь снежинок','Свечи в сугробах','Пробуждение ручьёв','Праздник сакуры','Майский цветень','Лето светлячков','Радужный дождь','Золотые колосья','Ярмарка тыкв','Лес в янтаре','Туманный месяц','Звёздный год'];
const QR = ['crystal','wisteria','arch','pond','stonelamp','rabbit'];
function qData(){
  const d = new Date(), mk = d.getFullYear() + '-' + d.getMonth();
  const q = S.pm.q[mk] || (S.pm.q[mk] = { a:S.done, b:S.pm.log.length, c:S.pm.falls.length, cl:{} });
  return {
    mk, q, n:QN[d.getMonth()], r:QR[d.getMonth()%6],
    L:[
      ['Закрыть 3 задачи', S.done - q.a,               3, 20],
      ['Сделать 10 шагов', S.pm.log.length - q.b,      10,25],
      ['Сделать запись в дневнике', S.pm.falls.length - q.c, 1, 15]
    ]
  };
}
function xQ(){
  const { mk, q, n, r, L } = qData(), d = new Date();
  const left = Math.ceil((new Date(d.getFullYear(), d.getMonth()+1, 1) - d)/864e5);
  const all = L.every((x,i) => q.cl[i]);
  xm(xh('Квест месяца') + `<h3>${n}</h3><small>До конца события: ${left} дн. Новое появится в следующем месяце.</small>` + L.map(([t,v,m,rw], i) => `<div class="card"><div class="row"><b>${t}</b><small>${Math.min(v,m)}/${m}</small></div><div class="bar"><i style="width:${Math.min(100, v/m*100)}%"></i></div>${q.cl[i] ? '<small>Награда получена</small>' : `<button class="btn sm" style="margin-top:8px;${v>=m?'':'opacity:.5'}" ${v>=m?'':'disabled'} onclick="qC('${mk}',${i},${rw})">Забрать ${rw} капелек</button>`}</div>`).join('') + `<div class="card"><b>Награда месяца: ${IT[r][0]}</b><br>${q.cl.f ? '<small>Уже в саду</small>' : `<button class="btn sm" style="margin-top:8px;${all?'':'opacity:.5'}" ${all?'':'disabled'} onclick="qF('${mk}')">Посадить в сад</button>`}</div>`);
}
function qC(mk, i, rw){ S.pm.q[mk].cl[i] = 1; S.dew += rw; save(); toast('+'+rw+' капелек'); xQ(); }
function qF(mk){
  const k = qData().r;
  S.pm.q[mk].cl.f = 1;
  S.items.push({ id:S.nid++, t:k, x:50, y:85 });
  save(); toast(IT[k][0]+' в саду'); xQ();
}

/* ---------- 7. Хаб премиум-функций ---------- */
const FT = [
  ['chat',  'Глубокий чат-компаньон', 'Помнит задачи, срывы, успехи. Голосовой ввод.', xChat],
  ['adapt', 'Адаптивные задачи',       'Шаги подстраиваются под настроение и опыт.',    xAdapt],
  ['rem',   'Мягкие напоминания',     'Без давления: «Посидим вместе?»',               xRem],
  ['fall',  'Дневник срывов',         'Без осуждения, с анализом причин.',             xFall],
  ['sh',    'Задачи с друзьями',      'Делай задачу вместе с другом.',                 xSh],
  ['voice', 'Голос «Рядом»',          'Комментирует голосом выполнение шагов.',        xVoice],
  ['deep',  'Глубокий ИИ-разбор',     'Почему задача сложная и как её обойти.',        xDeep],
  ['ex',    'Экспорт',                'Календарь, Notion, Todoist.',                   xEx],
  ['q',     'Квесты месяца',          'Особое событие раз в месяц.',                   xQ]
];
const ft  = i => { if (P1()) FT[i][3](); };
const spS = (k,v) => { S.pm.sp[k] = v; save(); render(); };

const hubHTML = () => `<h3>Премиум-функции</h3><div class="grid">${FT.map(([k,n,d], i) => `<div class="pc"><span class="tag ${sub()?'fr':''}">${sub()?'Включено':'Премиум'}</span><b>${n}</b><span class="ds">${d}</span><button class="btn sm" onclick="ft(${i})">Открыть</button></div>`).join('')}</div>`;
const cr = (o, k, f = v => v) => Object.keys(o).map(i => `<button class="mc ${S.pm.sp[k]==i?'on':''}" style="background:#f4f0ff" onclick="spS('${k}','${i}')">${f(o[i])}</button>`).join('');
function spTalk(){ const t = spSay(); $('#sps').textContent = t; react(t); }

/* ---------- 8. Экран Духа ---------- */
function spiritS(){
  const p = S.pm.sp, L = lvl();
  const v = S.done*2 + S.pm.log.length/2;
  const a = (L-1)**2, pr = Math.round((v-a)/(L*L-a)*100);
  if (!sub()) return `<h1>Дух сада</h1>
    <div class="card" style="text-align:center">
      <div class="sprBig" style="--gc:#9ff5d0">${spArt('spirit')}</div>
      <b>Свой Дух-помощник</b>
      <p><small>Живёт в саду, чувствует твоё состояние, советует мягко и растёт вместе с тобой. Облик, характер, голос и свечение настраиваются.</small></p>
      <button class="btn" onclick="openPremium()">Открыть в Премиуме</button>
    </div>
    ${hubHTML()}`;
  return `<div class="row"><h1>Дух сада</h1>${dewPill()}</div>
    <div class="card" style="text-align:center">
      <div class="sprBig" style="--gc:${p.gl}">${spArt()}${L>=3?'<i class="crn">✦</i>':''}</div>
      <h2>${esc(p.name)}</h2>
      <small>${SPK[p.k]} · ${SPC[p.ch]} · уровень ${L}</small>
      <div class="bar"><i style="width:${pr}%"></i></div>
      <small>Сильнее с каждой задачей и шагом</small>
      <div class="bub" id="sps" style="margin:12px auto 0">${esc(spSay())}</div>
      <div class="gbar" style="justify-content:center">
        <button class="btn sm" onclick="spTalk()">Совет</button>
        <button class="btn sm sec" onclick="go('garden')">В сад</button>
      </div>
    </div>
    <div class="card"><b>Настройка Духа</b>
      <input value="${esc(p.name)}" maxlength="14" onchange="S.pm.sp.name=this.value.trim()||'Лучик';save();render()" style="margin:8px 0">
      <small>Облик</small><div class="chips">${cr(SPK,'k')}</div>
      <small>Характер</small><div class="chips">${cr(SPC,'ch')}</div>
      <small>Голос</small><div class="chips">${cr(SPV,'vo',v => v[0])}</div>
      <small>Свечение</small><div class="sw2">${GLC.map(c => `<button class="${c==p.gl?'on':''}" onclick="spS('gl','${c}')"><i style="display:block;width:30px;height:30px;border-radius:50%;background:${c};box-shadow:0 0 12px ${c}"></i></button>`).join('')}</div>
    </div>
    ${hubHTML()}`;
}

/* ---------- 9. Финальный render ---------- */
const _r5 = render;
render = function(){
  document.body.className = 'xm-' + S.mood + (S.user && tab == 'tasks' ? ' hm-on' : '');
  if (S.user && tab == 'spirit') {
    applyMood(root, S.mood);
    const y = scrollY;
    $('#app').innerHTML = `<main class="scr">${spiritS()}</main>${tabbar()}`;
    scrollTo(0, y);
    return;
  }
  _r5();
};
render();