/* =========================================================================
   САД ПРОГРЕССА — core.js
   Ядро: утилиты, данные, состояние, сад, экраны, премиум, онбординг.
   ВАЖНО: этот файл должен подключаться ПЕРВЫМ.
   ========================================================================= */

/* ---------- 1. Утилиты ---------- */
const $ = s => document.querySelector(s);
const root = document.documentElement;

const esc = s => String(s).replace(/[&<>"]/g, c => (
  { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]
));

/* ---------- SVG-хелперы ---------- */
const C = (x,y,r,f,o='')            => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${o}/>`;
const R = (x,y,w,h,f,rx=0,o='')     => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${o}/>`;
const E = (x,y,rx,ry,f,o='')        => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${o}/>`;
const P = (d,f,o='')                => `<path d="${d}" fill="${f}" ${o}/>`;
const L = (d,s,w=3,o='')            => `<path d="${d}" fill="none" stroke="${s}" stroke-width="${w}" stroke-linecap="round" ${o}/>`;
const V = i                         => `<svg viewBox="0 0 100 100" width="100%" height="100%">${i}</svg>`;

/* ---------- Примитивы деревьев ---------- */
const TR = R(44,50,12,46,'#8a5a3a',4);
const crown = (c1,c2,c3) => C(50,36,26,c1) + C(30,50,17,c2||c1) + C(70,50,17,c3||c1);
const coin  = (x,y) => C(x,y,5.5,'#ffd23f','stroke="#d99a00" stroke-width="1.5"') + C(x-1.5,y-1.5,1.6,'#fff8c0');
const apple = (x,y) => C(x,y,7.5,'#ff3b4e') + C(x-2.5,y-2.5,2,'#ffb0b8') + R(x-.8,y-10,1.6,4,'#6b3a1a');
const petal = (x,y,d) => E(x,y,3.5,2,'#ffd1e3',`class="pet" style="animation-delay:-${d}s"`);
const bird  = (x,y) => C(x,y,8,'#fff6a0','opacity=".3" class="bird"') + C(x,y,3.2,'#fff6a0','class="bird"');

/* ---------- Библиотека SVG-рисунков ---------- */
const ART = {
  oak:    () => V(TR + crown('#3fa84a') + C(42,28,9,'#6fd06f','opacity=".55"')),
  birch:  () => V(
    R(45,40,10,56,'#f4f1ea',4)
    + R(46,56,6,2,'#444') + R(49,70,6,2,'#444') + R(46,82,5,2,'#444')
    + E(50,28,22,26,'#9ddc5f') + E(34,42,12,16,'#86cf4c') + E(66,42,12,16,'#86cf4c')
  ),
  maple:  () => V(TR + crown('#ff7a3d','#e8543a','#ffb02e')),
  sakura: () => V(
    R(44,50,12,46,'#7d5048',4)
    + crown('#ffb3d1','#ffc6dd','#ff9fc4')
    + C(40,30,9,'#ffd9e8','opacity=".6"')
    + petal(22,40,0) + petal(70,34,1.2) + petal(48,46,2.1) + petal(82,48,.6) + petal(34,56,2.8)
  ),
  baobab: () => V(
    P('M34 96C40 72 36 56 38 46L62 46C64 56 60 72 66 96Z','#a8714a')
    + P('M42 96C44 74 42 60 44 50','none','stroke="#8a5a3a" stroke-width="2"')
    + E(50,34,42,16,'#4fae4a') + E(26,40,16,9,'#3f9a46') + E(74,40,16,9,'#3f9a46')
    + bird(28,26) + bird(62,22) + bird(78,34)
  ),
  money:  () => V(
    TR + crown('#3fa84a')
    + coin(38,28) + coin(58,24) + coin(48,42) + coin(72,46) + coin(28,50) + coin(60,58)
  ),
  glow:   () => V(
    '<defs><radialGradient id="gg"><stop offset="0" stop-color="#fffbd0"/><stop offset=".55" stop-color="#7ff0d0"/><stop offset="1" stop-color="#2fb8a0"/></radialGradient></defs>'
    + C(50,40,44,'#bfffe8','opacity=".28" class="pulse"')
    + R(44,50,12,46,'#6d5a8a',4)
    + crown('url(#gg)')
    + C(40,30,3,'#fff','class="tw"')
    + C(62,44,2.5,'#fff','class="tw"')
    + C(34,52,2.5,'#fff','class="tw"')
  ),
  giant:  () => V(
    R(39,28,22,68,'#7a4e30',7)
    + C(50,24,30,'#2f9a45') + C(24,40,18,'#2f9a45') + C(76,40,18,'#2f9a45')
    + C(40,16,9,'#52bb62','opacity=".6"')
    + E(54,62,5,4,'#c46a2b') + C(58,58,3.2,'#c46a2b') + E(48,62,3,6,'#d98a4a')
    + E(30,38,4.5,3.5,'#c46a2b') + C(34,35,3,'#c46a2b')
  ),
  fruit:  () => V(TR + crown('#3fa84a') + apple(36,30) + apple(60,38) + apple(46,52) + apple(72,54) + apple(26,50)),
  fence:  () => V(
    R(8,60,84,5,'#d9a066',2) + R(8,76,84,5,'#d9a066',2)
    + [12,34,56,78].map(x => R(x,52,8,42,'#c58a50',2)).join('')
  ),
  bench:  () => V(
    R(12,38,76,9,'#c58a50',3) + R(12,56,76,9,'#b9783f',3)
    + R(18,64,6,28,'#8a5a3a',2) + R(76,64,6,28,'#8a5a3a',2)
    + R(18,44,5,14,'#8a5a3a') + R(77,44,5,14,'#8a5a3a')
  ),
  bush:   () => V(
    C(28,70,20,'#3f9f4f') + C(55,62,24,'#4cb55c') + C(76,72,18,'#3f9f4f')
    + C(45,52,3,'#ff7eb6') + C(64,58,3,'#ffd23f') + C(30,62,2.5,'#ff7eb6')
  ),
  carved: () => V(
    [10,34,58,82].map(x => P(`M${x} 96V56l5-10 5 10v40Z`,'#e8b27a') + C(x+5,43,3,'#ffd23f')).join('')
    + P('M8 66h84v4q-8 16-16 0q-8 16-16 0q-8 16-16 0q-8 16-16 0q-8 16-16 0Z','#f1c892')
    + R(8,62,84,5,'#f5d4a6',2)
  ),
  bridge: () => V(
    L('M4 76Q50 34 96 76','#6b5b95',10)
    + L('M4 76Q50 34 96 76','#8f7fc0',3)
    + L('M6 56Q50 14 94 56','#3b3556',3)
    + [18,30,42,58,70,82].map(x => `<line x1="${x}" y1="${x<50?76-(x-4)*.6:76-(96-x)*.6}" x2="${x}" y2="${x<50?58-(x-6)*.6-0:58-(94-x)*.6}" stroke="#3b3556" stroke-width="2"/>`).join('')
    + R(2,76,8,20,'#6b5b95',2) + R(90,76,8,20,'#6b5b95',2)
    + C(50,22,3,'#ffd23f')
  ),
  gazebo: () => V(
    P('M8 42L50 12L92 42Z','#ff8fb1') + P('M8 42h84v4H8Z','#e2648c')
    + R(14,46,6,44,'#f6eee0') + R(47,46,6,44,'#f6eee0') + R(80,46,6,44,'#f6eee0')
    + R(8,88,84,7,'#d8c3a5',2)
    + C(50,10,3.5,'#ffd23f')
    + C(33,54,3.5,'#ffe08a','class="tw"') + C(67,54,3.5,'#ffe08a','class="tw"')
  ),
  fountain: () => V(
    P('M10 80h80l-8 15H18Z','#b8c4de') + E(50,80,40,7,'#8fd8ff')
    + R(46,48,8,32,'#cfd8ee') + E(50,49,18,5,'#b8c4de')
    + L('M50 46Q40 22 28 46','#7fd3ff',3,'class="wj"')
    + L('M50 46Q60 22 72 46','#7fd3ff',3,'class="wj"')
    + L('M50 46V22','#7fd3ff',3,'class="wj"')
    + C(50,20,3,'#bfe8ff')
  ),
  gnome:  () => V(
    R(40,90,8,5,'#5a3a2a',2) + R(52,90,8,5,'#5a3a2a',2)
    + E(50,78,17,16,'#3b7ddd') + C(50,60,10,'#ffd7b5')
    + P('M40 62Q50 90 60 62Z','#fff')
    + P('M37 58Q50 4 63 58Z','#e8383d')
    + C(50,63,3,'#ff9b8a') + C(46,58,1.5,'#222') + C(54,58,1.5,'#222')
  ),
  lanterns: () => V(
    R(3,18,4,78,'#6b5b95',2) + R(93,18,4,78,'#6b5b95',2)
    + L('M5 22Q50 50 95 22','#6b5b95',2)
    + [[27,38],[50,42],[73,38]].map(([x,y]) => C(x,y,12,'#ffe27a','opacity=".3" class="tw"') + C(x,y,6,'#ffe27a','class="tw"') + R(x-1.5,y-10,3,5,'#6b5b95')).join('')
  ),
  swing:  () => V(
    L('M12 95L30 14M88 95L70 14','#8a5a3a',5) + R(24,10,52,6,'#8a5a3a',3)
    + `<g class="sw">${L('M40 17V62M60 17V62','#c9a77a',2) + R(34,62,32,6,'#ff8fb1',3)}</g>`
  ),
  hedgehog: () => V(
    E(46,66,38,28,'#7a5a46')
    + [[22,52],[32,42],[44,38],[56,40],[66,46],[74,56],[26,66],[40,58],[56,58]].map(([x,y]) => C(x,y,5,'#5d4332')).join('')
    + P('M60 62Q90 64 94 80Q72 88 58 80Z','#f0d2b0')
    + C(82,72,2.6,'#222') + C(93,79,3.2,'#222')
    + R(30,88,8,6,'#5d4332',2) + R(56,88,8,6,'#5d4332',2)
  ),
  butterfly: () => V(
    `<g class="wg">${E(32,42,20,24,'#ff8ad0') + E(68,42,20,24,'#ff8ad0') + E(36,68,13,14,'#b88cff') + E(64,68,13,14,'#b88cff') + C(30,40,5,'#fff','opacity=".6"') + C(70,40,5,'#fff','opacity=".6"')}</g>`
    + R(48,30,4,48,'#4a3b6b',2)
    + L('M50 32Q44 20 40 18M50 32Q56 20 60 18','#4a3b6b',2)
  ),
  owl:    () => V(
    E(50,64,26,32,'#8b6b4a') + E(50,72,17,22,'#e8d2a8')
    + P('M28 34l8 12-13 2Z','#6d5238') + P('M72 34l-8 12 13 2Z','#6d5238')
    + C(40,48,11,'#fff') + C(60,48,11,'#fff')
    + C(40,48,5,'#222') + C(60,48,5,'#222')
    + C(41.5,46.5,1.6,'#fff') + C(61.5,46.5,1.6,'#fff')
    + L('M29 48a11 11 0 1022 0a11 11 0 10-22 0M49 48a11 11 0 1022 0a11 11 0 10-22 0M50 48h0','#444',1.6)
    + P('M46 54l4 9 4-9Z','#ffb13b')
    + L('M30 38l8 2M70 38l-8 2','#5a4228',2)
    + R(38,92,8,4,'#ffb13b',2) + R(54,92,8,4,'#ffb13b',2)
  ),
  fireflies: () => V(
    C(50,50,44,'#fff6a0','opacity=".25" class="tw"')
    + `<g class="wg">${E(32,44,18,22,'#ffe66d') + E(68,44,18,22,'#ffe66d') + E(36,68,12,13,'#9bf6ff') + E(64,68,12,13,'#9bf6ff')}</g>`
    + R(48,34,4,44,'#5a4a2a',2)
    + C(50,80,5,'#fff6a0','class="tw"')
    + C(20,20,2.5,'#fff6a0','class="tw"')
    + C(82,26,2.5,'#fff6a0','class="tw"')
  ),
  cat:    () => V(
    L('M72 80Q98 70 90 44','#ff9d4d',8)
    + E(48,74,26,22,'#ff9d4d') + E(48,80,14,14,'#fff2e0')
    + C(48,44,19,'#ff9d4d')
    + P('M32 34l2-20 14 11Z','#ff9d4d') + P('M64 34l-2-20-14 11Z','#ff9d4d')
    + C(41,44,3.2,'#3a7d2c') + C(55,44,3.2,'#3a7d2c')
    + P('M46 51h4l-2 3Z','#ff6b8a')
    + L('M30 50h-12M30 54l-11 3M66 50h12M66 54l11 3','#fff',1.3)
    + L('M40 28v6M48 26v6M56 28v6','#d97a30',2)
  ),
  deer:   () => V(
    R(28,76,5,20,'#a86d3c',2) + R(38,78,5,18,'#a86d3c',2)
    + R(58,78,5,18,'#a86d3c',2) + R(68,76,5,20,'#a86d3c',2)
    + E(48,66,28,16,'#c98a52')
    + P('M64 60L72 32L82 36L78 66Z','#c98a52')
    + E(82,32,11,8,'#c98a52') + C(88,32,2,'#222')
    + L('M78 26L70 6M74 14L64 10M82 24L88 6M86 14L94 10','#6b4a2f',2.5)
    + C(36,62,2.2,'#fff') + C(48,58,2.2,'#fff') + C(56,68,2.2,'#fff') + C(42,70,2.2,'#fff')
    + P('M20 62q-4 4 0 8Z','#fff')
  ),
  fox:    () => V(
    P('M26 70Q-2 52 8 86Q22 90 32 78Z','#ff7a2e')
    + P('M10 80Q8 86 14 88Q22 88 22 84Z','#fff')
    + E(48,72,26,18,'#ff7a2e')
    + R(34,84,6,12,'#3a2a22',2) + R(54,84,6,12,'#3a2a22',2)
    + P('M52 32l2-18 12 12Z','#ff7a2e') + P('M80 32l-2-18-12 12Z','#ff7a2e')
    + C(66,46,15,'#ff7a2e') + E(66,54,9,7,'#fff')
    + C(66,51,2.8,'#222') + C(60,42,2,'#222') + C(73,42,2,'#222')
  ),
  dragon: () => V(
    P('M34 52Q10 16 6 48Q20 44 28 60Z','#b88cff','class="wg" style="transform-origin:34px 54px"')
    + P('M26 78Q2 80 10 94Q20 88 32 86Z','#5ad17a')
    + E(46,66,25,22,'#5ad17a') + E(50,74,12,15,'#d9ffb8')
    + [34,44,54].map(x => P(`M${x} 46l4-8 4 8Z`,'#3bb05c')).join('')
    + C(72,44,15,'#5ad17a') + E(84,50,8,6,'#7be59a')
    + P('M66 32l-3-14 9 8Z','#ffd23f')
    + C(75,41,3.2,'#222')
    + P('M90 52q12-6 8 4q-3 5-8 1Z','#ffa23b','class="tw"')
    + R(38,84,8,10,'#3bb05c',3) + R(56,84,8,10,'#3bb05c',3)
  )
};

/* ---------- Каталог предметов ---------- */
// [name, kind, premium(0/1), size, price, desc]
const IT = {
  oak:      ['Дуб','tree',0,100,10,'Крепкий и надёжный. Обычное дерево без особых свойств.'],
  birch:    ['Берёза','tree',0,90,10,'Светлый ствол, нежная листва. Простое, но приятное.'],
  maple:    ['Клён','tree',0,100,10,'Яркая осенняя листва. Базовое дерево.'],
  sakura:   ['Сакура','tree',1,115,40,'Розовая крона и непрерывно падающие лепестки.'],
  baobab:   ['Баобаб','tree',1,130,45,'Толстый ствол-великан. В ветвях живут светящиеся птицы.'],
  money:    ['Денежное дерево','tree',1,105,45,'Листья-монеты поблёскивают золотом. На удачу.'],
  glow:     ['Светящееся дерево','tree',1,110,50,'Светится изнутри мягким мятным светом, дышит и мерцает.'],
  giant:    ['Дерево-великан','tree',1,150,55,'Огромная крона, на которой живут рыжие белки.'],
  fruit:    ['Плодовое дерево-гигант','tree',1,120,50,'Яблоки размером с голову. Сочные и яркие.'],
  fence:    ['Простой забор','dc',0,90,6,'Невысокий деревянный забор.'],
  bench:    ['Лавочка','dc',0,80,6,'Место, чтобы посидеть и выдохнуть.'],
  bush:     ['Кустик','dc',0,60,6,'Зелёный куст с цветочками. Под ним прячутся ёжики.'],
  carved:   ['Резной забор','dc',1,100,30,'Узорные балясины с золотыми навершиями.'],
  bridge:   ['Кованый мостик','dc',1,120,35,'Изящный изогнутый мостик с коваными перилами.'],
  gazebo:   ['Беседка','dc',1,115,40,'Уютная беседка с тёплыми огоньками внутри.'],
  fountain: ['Фонтан','dc',1,100,40,'Струи воды искрятся и журчат.'],
  gnome:    ['Статуя гнома','dc',1,60,30,'Весёлый гном в красном колпаке охраняет сад.'],
  lanterns: ['Светящиеся фонарики','dc',1,120,30,'Гирлянда тёплых фонариков, мерцают вечером.'],
  swing:    ['Качели','dc',1,90,35,'Качели, которые мягко покачиваются на ветру.'],
  hedgehog: ['Ёжик','an',0,50,8,'Милый ёжик. Любит прятаться под кустом.'],
  butterfly:['Бабочка','an',0,38,8,'Садится на дерево или цветок, машет крыльями.'],
  owl:      ['Сова-философ','an',1,70,35,'Мудрая сова в очках. Смотрит и размышляет.'],
  fireflies:['Бабочки-светлячки','an',1,60,35,'Крылья светятся золотом и мерцают, особенно вечером.'],
  cat:      ['Кот','an',1,65,35,'Рыжий кот. Греется на солнышке, хвост подрагивает.'],
  deer:     ['Олень','an',1,95,40,'Благородный олень с ветвистыми рогами.'],
  fox:      ['Лисёнок','an',1,65,35,'Любопытный лисёнок с пушистым хвостом.'],
  dragon:   ['Мини-дракон','an',1,75,45,'Крошечный добрый дракон с волшебными крыльями.']
};
const KIND = { tree:'Деревья', dc:'Украшения', an:'Животные' };
const ids = (p,k) => Object.keys(IT).filter(i => IT[i][2]==p && (!k || IT[i][1]==k));

/* ---------- Настроения ---------- */
const MOODS = {
  fog:   { n:'Туман в голове',  s1:'#cfc6e8', s2:'#e8e2f4', g1:'#b9b6d8', g2:'#a09ec8', h:'#aaa6cf', sp:2.6, sun:.5,  haze:.5,  tip:'Всё в порядке, мы не торопимся. Одного маленького шага достаточно.' },
  noise: { n:'Слишком много шума', s1:'#3f5a82', s2:'#8aa6c6', g1:'#4f8f80', g2:'#3b7466', h:'#4a8088', sp:2,   sun:.2,  haze:.08, tip:'Тихо. Выбери одну самую лёгкую задачу или просто отдохни.' },
  calm:  { n:'Спокойное утро',  s1:'#7ec8f5', s2:'#d6f0ff', g1:'#8fdc6b', g2:'#6cc455', h:'#7fd36a', sp:1.2, sun:1,   haze:0,   tip:'Доброе утро. Начни с самого простого дела.' },
  res:   { n:'Я в ресурсе',     s1:'#ff9ed1', s2:'#c9b8ff', g1:'#7be495', g2:'#47d27c', h:'#9be7a0', sp:.6,  sun:1.25,haze:0,   tip:'Отличный момент! Самое время взяться за важное.' }
};
function applyMood(el,k){
  const m = MOODS[k], s = el.style;
  ['s1','s2','g1','g2','h','sp','sun','haze'].forEach(p => s.setProperty('--'+p, m[p]));
  if (el === root) root.dataset.mood = k;
}
const tod  = () => { const h = new Date().getHours(); return h>=22||h<5 ? 'night' : (h>=19||h<7 ? 'dusk' : 'day'); };
const TODN = { day:'День', dusk:'Вечер или рассвет', night:'Ночь' };

/* ---------- Состояние ---------- */
let S = (() => { try { return JSON.parse(localStorage.getItem('sp3')); } catch(e) { return null; } })()
     || {
          user:null, tasks:[], dew:30, mood:'calm',
          items:[
            { id:1, t:'oak',     x:30, y:80 },
            { id:2, t:'bush',    x:64, y:90 },
            { id:3, t:'hedgehog',x:76, y:96 }
          ],
          nid:10, sub:null, friends:['luna_fox','sakura_mi'], watered:{}, done:0
        };
const save = () => { try { localStorage.setItem('sp3', JSON.stringify(S)); } catch(e) {} };

/* ---------- Фейковые соседи ---------- */
const DB = {
  luna_fox:   { age:24, c:'#ff9d4d', mood:'res',   t:41, d:6,  it:[['sakura',24,82],['oak',72,80],['fox',48,96],['lanterns',50,68],['butterfly',34,58],['fountain',56,90],['bench',86,94]] },
  sakura_mi:  { age:19, c:'#ff7eb6', mood:'calm',  t:28, d:3,  it:[['sakura',30,80],['sakura',66,84],['cat',50,96],['gazebo',50,70],['bush',84,94],['butterfly',20,50]] },
  mint_owl:   { age:31, c:'#2fd1a5', mood:'fog',   t:55, d:9,  it:[['glow',30,82],['owl',58,70],['baobab',72,86],['hedgehog',40,96],['fireflies',50,50]] },
  sunny_day:  { age:16, c:'#ffd23f', mood:'res',   t:12, d:2,  it:[['fruit',28,82],['birch',64,80],['swing',82,90],['bench',46,94],['butterfly',60,56]] },
  kot_ivan:   { age:27, c:'#7c5cff', mood:'noise', t:33, d:5,  it:[['giant',34,88],['deer',68,92],['bridge',60,78],['maple',86,80],['cat',16,96]] },
  drakosha:   { age:22, c:'#5ad17a', mood:'calm',  t:67, d:12, it:[['money',24,80],['dragon',56,92],['gnome',78,94],['carved',46,98],['oak',84,78]] }
};
const sub = () => S.sub && !S.sub.canceled;

/* ---------- Глобальные переменные вкладок ---------- */
let tab = 'tasks', fr = null, sel = null, pf = 'all';

/* ---------- Иконки ---------- */
const I = (p,s=24,f='none') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${f}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const IC = {
  tasks:  '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  garden: '<circle cx="12" cy="9" r="6"/><path d="M12 15v6M9 21h6"/>',
  shop:   '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 016 0"/>',
  nb:     '<circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M15 15c3 0 6 1 6 5"/>',
  me:     '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7"/>',
  back:   '<path d="M15 5l-7 7 7 7"/>',
  plus:   '<path d="M12 5v14M5 12h14"/>',
  del:    '<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',
  lock:   '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  check:  '<path d="M5 12l5 5L20 7"/>'
};
const dropI = (s=18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2c4 5 7 8 7 12a7 7 0 01-14 0c0-4 3-7 7-12z" fill="#4fc3f7"/><path d="M9 14a3 3 0 003 3" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
const av = (c,s=44) => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="${c}"/><circle cx="24" cy="21" r="9" fill="#fff" opacity=".92"/><circle cx="20.5" cy="20" r="1.6" fill="#2b2750"/><circle cx="27.5" cy="20" r="1.6" fill="#2b2750"/><path d="M20 24.5q4 3.5 8 0" stroke="#2b2750" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M10 44c1-8 7-10 14-10s13 2 14 10" fill="#fff" opacity=".85"/></svg>`;
const COLS = ['#7c5cff','#ff7eb6','#2fd1a5','#ffb347','#4fc3f7','#ff6b6b'];

function toast(t){ const e = $('#toast'); e.textContent = t; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 2200); }

/* ---------- Сад: рендер и drag ---------- */
function itemHTML(it, w){
  const d = IT[it.t];
  return `<div class="it ${d[1]=='tree'?'tree':d[1]}" data-id="${it.id}" style="left:${it.x}%;top:${it.y}%;width:${d[3]}px;height:${d[3]}px;z-index:${Math.round(it.y*10)}"><div class="art">${ART[it.t]()}</div></div>`;
}
function scene(items, cls=''){
  const r = Math.random;
  let g='', f='', ff='', b='';
  for (let i=0;i<55;i++) g  += `<i class="bl" style="left:${r()*100}%;top:${50+r()*48}%;height:${9+r()*11}px;animation-delay:-${r()*4}s"></i>`;
  for (let i=0;i<9;i++)  f  += `<i class="fl" style="left:${r()*100}%;--d:${9+r()*8}s;animation-delay:-${r()*12}s"></i>`;
  for (let i=0;i<9;i++)  ff += `<i class="ff" style="left:${5+r()*90}%;top:${40+r()*50}%;animation-delay:-${r()*3}s"></i>`;
  for (let i=0;i<6;i++)  b  += `<div class="fb ${i>3?'x':''}" style="top:${18+r()*40}%;--d:${16+i*3}s;animation-delay:-${i*4}s">${ART.butterfly()}</div>`;
  const cl = (t,w,d,del) => `<svg class="abs cloud" style="top:${t}%;--d:${d}s;animation-delay:-${del}s" width="${w}" height="${w*.5}" viewBox="0 0 120 60"><ellipse cx="40" cy="38" rx="32" ry="16" fill="#fff"/><ellipse cx="70" cy="30" rx="30" ry="22" fill="#fff"/><ellipse cx="94" cy="40" rx="22" ry="13" fill="#fff"/></svg>`;
  return `<div class="garden ${cls}" data-tod="${tod()}">
    <div class="abs stars"></div><div class="abs moon"></div>
    <div class="abs sun">
      <svg viewBox="0 0 100 100"><g stroke="#ffe27a" stroke-width="4" stroke-linecap="round">${[...Array(12)].map((_,i)=>`<line x1="50" y1="4" x2="50" y2="14" transform="rotate(${i*30} 50 50)"/>`).join('')}</g></svg>
      <div class="core"></div>
    </div>
    <div class="abs glint" style="left:48%;top:14%;width:34px;height:34px"></div>
    <div class="abs glint" style="left:36%;top:26%;width:20px;height:20px;animation-delay:-1.4s"></div>
    <div class="abs glint" style="left:24%;top:38%;width:12px;height:12px;animation-delay:-2.6s"></div>
    ${cl(8,110,70,0)}${cl(20,80,95,30)}${cl(4,70,120,60)}
    <svg class="abs hill" viewBox="0 0 400 80" preserveAspectRatio="none"><path d="M0 50Q60 0 130 36T270 28T400 40V80H0Z" fill="var(--h)" opacity=".75"/></svg>
    <div class="abs ground"></div>
    <svg class="abs" style="left:0;right:0;top:56%;height:13%;width:100%" viewBox="0 0 400 60" preserveAspectRatio="none">
      <path d="M-10 30C80 0 160 60 240 30S380 0 420 30V46C340 76 260 16 180 46S40 70-10 46Z" fill="#7fd3ff" opacity=".88"/>
      <path class="stm" d="M0 34C80 6 160 56 240 34S360 10 410 34" stroke="#fff" stroke-width="2" fill="none" stroke-dasharray="14 18" opacity=".8"/>
    </svg>
    ${g}${f}${ff}${items.map(itemHTML).join('')}${b}
    <div class="abs haze"></div><div class="abs tod"></div>
  </div>`;
}
function initDrag(el){
  const mark = () => {
    el.querySelectorAll('.it').forEach(n => n.classList.toggle('sel', n.dataset.id == sel));
    const rb = $('#rm'); if (rb) rb.style.display = sel ? '' : 'none';
  };
  el.querySelectorAll('.it').forEach(n => n.addEventListener('pointerdown', e => {
    e.preventDefault();
    const g = el.getBoundingClientRect();
    const it = S.items.find(i => i.id == n.dataset.id); if (!it) return;
    sel = it.id; mark();
    const sx = e.clientX, sy = e.clientY, ox = it.x, oy = it.y;
    let tx = ox, ty = oy, cx = ox, cy = oy, raf;
    n.classList.add('drag'); n.setPointerCapture(e.pointerId);
    const pl = () => { n.style.left = cx+'%'; n.style.top = cy+'%'; };
    const loop = () => { cx += (tx-cx)*.3; cy += (ty-cy)*.3; pl(); raf = requestAnimationFrame(loop); }; loop();
    const mv = ev => { tx = Math.min(96, Math.max(4,  ox + (ev.clientX-sx)/g.width*100)); ty = Math.min(99, Math.max(30, oy + (ev.clientY-sy)/g.height*100)); };
    const up = () => {
      cancelAnimationFrame(raf); cx = tx; cy = ty; pl();
      it.x = tx; it.y = ty;
      n.style.zIndex = Math.round(ty*10);
      n.classList.remove('drag');
      n.removeEventListener('pointermove', mv);
      n.removeEventListener('pointerup', up);
      n.removeEventListener('pointercancel', up);
      save();
    };
    n.addEventListener('pointermove', mv);
    n.addEventListener('pointerup', up);
    n.addEventListener('pointercancel', up);
  }));
  el.addEventListener('pointerdown', e => { if (!e.target.closest('.it')) { sel = null; mark(); } });
  mark();
}
function removeSel(){ if (!sel) return; S.items = S.items.filter(i => i.id != sel); sel = null; save(); toast('Убрано из сада'); render(); }

/* ---------- Общий UI ---------- */
const dewPill = () => `<div class="dew">${dropI()}${S.dew}</div>`;
const moodChips = () => Object.keys(MOODS).map(k => `<button class="mc ${S.mood==k?'on':''}" data-k="${k}" onclick="setMood('${k}')">${MOODS[k].n}</button>`).join('');
function setMood(k){
  S.mood = k; save(); applyMood(root, k);
  document.querySelectorAll('.mc').forEach(b => b.classList.toggle('on', b.dataset.k == k));
  const t = $('#tip'); if (t) t.textContent = MOODS[k].tip;
}
function tabbar(){
  const T = [['tasks','Задачи'],['garden','Сад'],['shop','Магазин'],['nb','Соседи'],['me','Профиль']];
  return `<nav class="tabs">${T.map(([k,n]) => `<button class="tab ${tab==k?'on':''}" onclick="go('${k}')">${I(IC[k])}${n}</button>`).join('')}</nav>`;
}
function go(t){ tab = t; fr = null; sel = null; render(); }

/* ---------- Экран: Задачи ---------- */
function tasksS(){
  const t = S.tasks, d = t.filter(x => x.d).length, cur = t.find(x => !x.d);
  const p = t.length ? Math.round(d/t.length*100) : 0;
  return `<section class="hero">
      <div class="row"><div><small style="color:#4a4570">Привет, ${esc(S.user.nick)}</small><h1>Что сегодня?</h1></div>${dewPill()}</div>
      <div class="chips">${moodChips()}</div>
      <p id="tip" class="tip">${MOODS[S.mood].tip}</p>
    </section>
    <div class="card now">
      <small>${cur ? 'Сейчас — один маленький шаг' : 'Всё сделано'}</small>
      <h2>${cur ? esc(cur.t) : 'Можно отдохнуть или заглянуть в сад'}</h2>
      ${cur ? `<button class="btn" onclick="tgl(${cur.id})">Готово</button>` : `<button class="btn sec" onclick="go('garden')">Открыть сад</button>`}
      <div class="bar"><i style="width:${p}%"></i></div>
      <small>${d} из ${t.length} выполнено</small>
    </div>
    <div class="add">
      <input id="ti" placeholder="Новая задача" maxlength="80" onkeydown="if(event.key=='Enter')addT()">
      <button class="btn" onclick="addT()" aria-label="Добавить">${I(IC.plus)}</button>
    </div>
    ${t.map(x => `<div class="task ${x.d?'d':''}">
        <button class="ck" onclick="tgl(${x.id})" aria-label="Готово">${x.d ? I(IC.check,16).replace('currentColor','#fff') : ''}</button>
        <span>${esc(x.t)}</span>
        <button class="ic" onclick="delT(${x.id})" aria-label="Удалить">${I(IC.del,20)}</button>
      </div>`).join('')}`;
}
function addT(){ const v = $('#ti').value.trim(); if (!v) return; S.tasks.push({ id:S.nid++, t:v, d:0 }); save(); render(); }
function tgl(id){
  const x = S.tasks.find(t => t.id == id);
  x.d = x.d ? 0 : 1;
  if (x.d) { S.dew += 5; S.done++; toast('+5 росинок. Сад растёт.'); }
  else S.dew = Math.max(0, S.dew - 5);
  save(); render();
}
function delT(id){ S.tasks = S.tasks.filter(t => t.id != id); save(); render(); }

/* ---------- Экран: Сад ---------- */
function gardenS(){
  return `<div class="row">
      <div><h1>Мой сад</h1><small>${TODN[tod()]} · перетаскивай всё, что есть в саду</small></div>
      ${dewPill()}
    </div>
    ${scene(S.items)}
    <div class="gbar">
      <div class="chips" style="margin:0">${moodChips()}</div>
      <button id="rm" class="btn sm sec" style="display:none" onclick="removeSel()">Убрать выбранное</button>
    </div>
    <p id="tip" class="tip" style="color:var(--mut)">${MOODS[S.mood].tip}</p>`;
}

/* ---------- Магазин ---------- */
function card(k, rare, shop){
  const d = IT[k];
  return `<div class="pc ${rare?'rare':''}">
      <span class="tag ${rare?'':'fr'}">${rare?'Редкое':'Обычное'}</span>
      <div class="pa"><div class="art">${ART[k]()}</div></div>
      <b>${d[0]}</b>
      <span class="ds">${d[5]}</span>
      ${shop ? `<div class="row"><span class="price">${dropI(15)}${d[4]}</span><button class="btn sm" onclick="buy('${k}')">${d[2]&&!sub()?'Премиум':'Посадить'}</button></div>` : ''}
    </div>`;
}
function shopS(){
  const fl = pf == 'all' ? Object.keys(IT) : ids(0,pf).concat(ids(1,pf));
  const F = [['all','Всё'],['tree','Семена'],['dc','Украшения'],['an','Животные']];
  return `<div class="row"><h1>Магазин</h1>${dewPill()}</div>
    <div class="chips">${F.map(([k,n]) => `<button class="mc ${pf==k?'on':''}" style="background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.06)" onclick="pf='${k}';render()">${n}</button>`).join('')}</div>
    ${sub() ? '' : `<div class="card row" style="background:linear-gradient(135deg,#fff3c9,#ffe0f0)"><div><b>Редкие виды</b><br><small>Сакура, дракон, фонтан и другие. 3 дня бесплатно</small></div><button class="btn sm" onclick="openPremium()">Смотреть</button></div>`}
    <h3>Обычные</h3><div class="grid">${fl.filter(k => !IT[k][2]).map(k => card(k,0,1)).join('')}</div>
    <h3>Премиум</h3><div class="grid">${fl.filter(k =>  IT[k][2]).map(k => card(k,1,1)).join('')}</div>`;
}
function buy(k){
  const d = IT[k];
  if (d[2] && !sub()) return openPremium();
  if (S.dew < d[4]) return toast('Не хватает росинок. Выполни задачи.');
  S.dew -= d[4];
  S.items.push({ id:S.nid++, t:k, x:15+Math.random()*70, y:70+Math.random()*25 });
  save(); toast(d[0]+' появился в саду'); render();
}

/* ---------- Соседи ---------- */
function nbS(){
  if (fr) return friendS();
  return `<h1>Соседи</h1>
    <div class="add">
      <input id="sq" placeholder="Поиск по нику" onkeydown="if(event.key=='Enter')srch()">
      <button class="btn" onclick="srch()" aria-label="Найти">${I(IC.search)}</button>
    </div>
    <div id="sr"></div>
    <h3>Мои друзья</h3>
    ${S.friends.length ? S.friends.map(n => row(n,1)).join('') : '<p><small>Пока никого. Найди друга по нику.</small></p>'}`;
}
function row(n, isF){
  const u = DB[n];
  return `<div class="fr">${av(u.c)}
      <div class="nm"><b>@${n}</b><small>${MOODS[u.mood].n}</small></div>
      ${isF
        ? `<button class="btn sm" onclick="openF('${n}')">Сад</button>`
        : (S.friends.includes(n)
            ? `<button class="btn sm sec" onclick="openF('${n}')">Открыть</button>`
            : `<button class="btn sm" onclick="addF('${n}')">Добавить</button>`)}
    </div>`;
}
function srch(){
  const q = $('#sq').value.trim().toLowerCase().replace(/^@/,'');
  const r = Object.keys(DB).filter(n => q && n.includes(q));
  $('#sr').innerHTML = r.length
    ? r.map(n => row(n,0)).join('')
    : `<p><small>${q?'Такого ника нет. Проверь написание.':'Введи ник друга.'}</small></p>`;
}
function addF(n){ if (!S.friends.includes(n)) S.friends.push(n); save(); toast('@'+n+' теперь твой сосед'); render(); }
function openF(n){ fr = n; render(); }
function friendS(){
  const u = DB[fr], w = S.watered[fr] || 0;
  return `<div class="row">
      <button class="btn sm sec" onclick="fr=null;render()">${I(IC.back,18)} Назад</button>
      <div class="row" style="gap:8px">${av(u.c,34)}<b>@${fr}</b></div>
    </div>
    <div id="fg">${scene(u.it.map((a,i)=>({ id:i, t:a[0], x:a[1], y:a[2] })), 'ro')}</div>
    <div class="gbar">
      <button class="btn" onclick="water('${fr}')">Полить</button>
      <small id="wc">Ты полил(а) этот сад: ${w} раз</small>
    </div>
    <div class="card" style="margin-top:10px">
      <div class="row"><b>Настроение</b><span class="tag fr" style="background:#efeaff;color:var(--pri)">${MOODS[u.mood].n}</span></div>
      <div class="stats">
        <div class="stat"><b>${u.t}</b><small>задач</small></div>
        <div class="stat"><b>${u.d}</b><small>дней подряд</small></div>
        <div class="stat"><b>${u.it.length}</b><small>в саду</small></div>
      </div>
    </div>`;
}
function water(n){
  const g = $('#fg .garden');
  for (let i=0;i<16;i++){
    const d = document.createElement('i');
    d.className = 'drop';
    d.style.left = (Math.random()*100)+'%';
    d.style.animationDelay = (Math.random()*.6)+'s';
    g.appendChild(d);
    setTimeout(() => d.remove(), 2200);
  }
  S.watered[n] = (S.watered[n] || 0) + 1; save();
  $('#wc').textContent = 'Ты полил(а) этот сад: ' + S.watered[n] + ' раз';
  toast('@'+n+' получил росинки');
}

/* ---------- Профиль ---------- */
function meS(){
  const ns = S.items.length, ts = S.items.filter(i => IT[i.t][1]=='tree').length;
  return `<h1>Профиль</h1>
    <div class="card" style="text-align:center">
      ${av(S.user.c,84)}
      <h2 style="margin-top:8px">@${esc(S.user.nick)}</h2>
      <small>${S.user.age} лет</small>
      <div class="sw2" style="justify-content:center">${COLS.map(c => `<button class="${c==S.user.c?'on':''}" onclick="S.user.c='${c}';save();render()">${av(c,34)}</button>`).join('')}</div>
    </div>
    <div class="stats">
      <div class="stat"><b>${S.done}</b><small>задач</small></div>
      <div class="stat"><b>${ts}</b><small>деревьев</small></div>
      <div class="stat"><b>${S.dew}</b><small>росинок</small></div>
    </div>
    <div class="card"><b>Подписка</b>
      <p><small>${sub() ? 'Премиум активен: 3 дня бесплатно, далее 399 ₽/мес.' : 'Бесплатный план. Премиум: 3 дня бесплатно, далее 399 ₽/мес.'}</small></p>
      <div style="display:flex;gap:8px">
        ${sub() ? `<button class="cancel" onclick="cancelSub()">Отменить подписку</button>` : `<button class="btn" onclick="openPremium()">Оформить Премиум</button>`}
      </div>
    </div>`;
}

/* ---------- Премиум ---------- */
function openPremium(){
  const grp = p => ['tree','dc','an'].map(k => `<h3>${KIND[k]}</h3><div class="grid">${ids(p,k).map(i => card(i,p)).join('')}</div>`).join('');
  $('#ov').innerHTML = `<div class="ov"><div class="pm">
      <div class="row"><button class="btn sm sec" onclick="closeOv()">${I(IC.back,18)} Закрыть</button><span class="tag">Премиум</span></div>
      <h1 style="margin-top:14px">Редкие виды для твоего сада</h1>
      <p style="color:var(--mut)">Слева направо: что есть у всех — и что открывает Премиум.</p>
      <div class="blk free">Обычный · бесплатно</div>${grp(0)}
      <div class="blk gold">Премиум · редкое</div>${grp(1)}
    </div>
    <div class="pbar"><div class="in">
      ${sub()
        ? `<button class="glow" style="animation:none;opacity:.7" disabled>Премиум активен</button><button class="cancel" onclick="cancelSub()">Отменить</button>`
        : `<button class="glow" onclick="subscribe()">Оформить Премиум</button><button class="cancel" onclick="closeOv()">Отменить</button>`}
    </div><small>3 дня бесплатно, далее 399 ₽/мес. Отменить можно в любой момент.</small></div>
  </div>`;
}
const closeOv = () => { $('#ov').innerHTML = ''; };
function subscribe(){ S.sub = { start:Date.now(), canceled:false }; save(); closeOv(); toast('Премиум открыт: 3 дня бесплатно'); render(); }
function cancelSub(){ S.sub && (S.sub.canceled = true); save(); closeOv(); toast('Подписка отменена'); render(); }

/* ---------- Онбординг ---------- */
let obc = COLS[0];
function onboard(){
  $('#app').innerHTML = `<div class="ob"><div class="card">
      <h1>Сад Прогресса</h1>
      <p style="color:var(--mut)">Мягкий помощник: задачи растят твой сад. Придумай ник — по нему тебя найдут друзья.</p>
      <input id="nk" placeholder="Ник (3–16 символов)" maxlength="16" style="margin-bottom:8px">
      <input id="ag" type="number" placeholder="Возраст" min="5" max="99" style="margin-bottom:8px">
      <small>Аватар</small>
      <div class="sw2">${COLS.map(c => `<button class="${c==obc?'on':''}" onclick="obc='${c}';onboard()">${av(c,38)}</button>`).join('')}</div>
      <div class="err" id="er"></div>
      <button class="btn" style="width:100%" onclick="reg()">Начать</button>
    </div></div>`;
}
function reg(){
  const n = $('#nk').value.trim(), a = +$('#ag').value, e = $('#er');
  if (!/^[a-zA-Z0-9_а-яА-ЯёЁ]{3,16}$/.test(n)) return e.textContent = 'Ник: 3–16 символов, буквы, цифры, подчёркивание.';
  if (DB[n.toLowerCase()]) return e.textContent = 'Этот ник уже занят.';
  if (!(a>=5 && a<=99)) return e.textContent = 'Укажи возраст.';
  S.user = { nick:n, age:a, c:obc }; save(); render();
}

/* ---------- Главный render ---------- */
function render(){
  if (!S.user) return onboard();
  applyMood(root, S.mood);
  const m = { tasks:tasksS, garden:gardenS, shop:shopS, nb:nbS, me:meS }[tab];
  const y = scrollY;
  $('#app').innerHTML = `<main class="scr">${m()}</main>${tabbar()}`;
  scrollTo(0, y);
  if (tab == 'garden') initDrag($('#app .garden'));
  if (tab == 'nb' && fr) { const g = $('#fg .garden'); applyMood(g, DB[fr].mood); }
}
setInterval(() => document.querySelectorAll('.garden').forEach(g => g.dataset.tod = tod()), 60000);