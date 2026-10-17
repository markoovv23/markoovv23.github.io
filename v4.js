/* =========================================================================
   САД ПРОГРЕССА — v4.js
   Слой v4: чат, капли, пауза, аватары, магазин, drag-drop духа.
   ВАЖНО: подключается ПОСЛЕ core.js и переопределяет часть его функций.
   ========================================================================= */

/* ---------- 1. Константы и состояние v4 ---------- */
const AI_URL = ''; // POST {prompt} -> JSON [{t,w}]
const SZ  = n => n<=4 ? 'sm' : n<=6 ? 'md' : 'lg';
const dsz = { sm:12, md:18, lg:28 };

let shown  = S.dew;
let flying = 0;
let curAv  = null;
let oba    = 'gnome';
let bti, rounds = 0, lt, lf;

const SPR = '<svg viewBox="0 0 24 24"><path d="M12 21v-9M12 13c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2-5-6-5 0 3 2 5 6 5z" fill="#5fc66a"/></svg>';
IC.send = '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>';

/* ---------- 2. Новые предметы (v4) ---------- */
Object.assign(ART, {
  crystal: () => V(
    '<defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eefcff"/><stop offset=".5" stop-color="#a5dcff"/><stop offset="1" stop-color="#b79cff"/></linearGradient></defs>'
    + C(50,44,40,'#cfe9ff','opacity=".25" class="pulse"')
    + R(46,62,8,34,'#a99ccf',3)
    + [
        ['M50 6L65 36L50 68L35 36Z', 1],
        ['M24 26L40 44L28 70L12 46Z', .85],
        ['M76 26L88 46L72 70L60 44Z', .85]
      ].map(([d,o]) => P(d,'url(#cg)',`opacity="${o}" stroke="#fff" stroke-width="1" stroke-opacity=".7"`)).join('')
    + L('M50 6V68M35 36H65','#fff',.8,'opacity=".6"')
    + C(44,22,2.2,'#fff','class="tw"')
    + C(72,40,1.8,'#fff','class="tw"')
    + C(20,40,1.8,'#fff','class="tw"')
  ),
  wisteria: () => V(
    P('M46 96C48 70 44 56 50 40L56 40C54 60 58 76 56 96Z','#8d6a54')
    + E(50,30,40,16,'#7cc28a')
    + E(28,36,18,9,'#6bb37b') + E(74,36,18,9,'#6bb37b')
    + [[22,40],[36,44],[50,46],[64,44],[78,40]].map(([x,y],i) =>
        `<g class="sw" style="transform-origin:${x}px ${y}px;animation-delay:-${i*.5}s">`
        + [0,1,2,3,4].map(k => E(x+(k%2?2:-2), y+k*7, 4-k*.5, 3.4-k*.3, ['#c9b3ff','#b79cff','#d8c6ff'][k%3])).join('')
        + '</g>').join('')
  ),
  arch: () => V(
    L('M16 96V44Q16 8 50 8Q84 8 84 44V96','#f3ead8',6)
    + L('M16 96V44Q16 8 50 8Q84 8 84 44V96','#d9c7a6',1.4)
    + [[16,70],[18,46],[28,22],[50,10],[72,22],[82,46],[84,70]].map(([x,y],i) =>
        E(x+7,y+3,5,2.4,'#6fc47a')
        + C(x,y,6.5,['#ffb3d1','#fff','#ffd1e3'][i%3])
        + C(x,y,2,'#ffd23f')).join('')
  ),
  pond: () => V(
    E(50,74,46,19,'#9bd9f5')
    + E(50,72,40,15,'#7cc6ea','opacity=".7"')
    + [[30,72,10],[56,78,12],[70,68,8]].map(([x,y,r]) =>
        E(x,y,r,r*.42,'#7fcf85')
        + C(x,y-r*.25,r*.28,'#ffc2dd')
        + C(x,y-r*.25,r*.1,'#ffd23f')).join('')
    + L('M18 74Q28 70 38 74M60 66Q70 62 80 66','#fff',1.1,'class="wj" opacity=".7"')
    + L('M84 70V44M89 72V50','#6fb86f',2)
    + E(84,42,2,5,'#8b6b4a') + E(89,48,2,5,'#8b6b4a')
  ),
  stonelamp: () => V(
    R(30,90,40,6,'#b9b4c8',3)
    + R(43,60,14,30,'#cfcadb',3)
    + R(34,48,32,14,'#d9d4e6',4)
    + C(50,55,13,'#ffe9a0','opacity=".28" class="pulse"')
    + R(41,51,18,8,'#ffe9a0',2,'class="tw"')
    + P('M22 48L50 24L78 48Z','#b1abc4')
    + C(50,20,4,'#cfcadb')
    + R(36,62,28,4,'#b9b4c8',2)
  ),
  rabbit: () => V(
    E(38,22,6,17,'#fff') + E(62,22,6,17,'#fff')
    + E(38,24,3,12,'#ffc4d6') + E(62,24,3,12,'#ffc4d6')
    + E(50,76,26,20,'#fff') + E(50,80,22,12,'#ece6fa','opacity=".6"')
    + C(78,82,7,'#fff') + C(50,50,19,'#fff')
    + C(42,48,2.4,'#2b2750') + C(58,48,2.4,'#2b2750')
    + P('M47 54h6l-3 3.4Z','#ff8fb1')
    + C(36,54,3.4,'#ffc4d6','opacity=".6"')
    + C(64,54,3.4,'#ffc4d6','opacity=".6"')
  )
});
Object.assign(IT, {
  crystal:   ['Хрустальное дерево','tree',1,120,55,'Кристальные ветви переливаются голубым и сиреневым.'],
  wisteria:  ['Глициния','tree',1,125,60,'Свисающие гроздья сирени мягко качаются.'],
  arch:      ['Цветочная арка','dc',1,110,45,'Арка, увитая розами и нежной зеленью.'],
  pond:      ['Пруд с кувшинками','dc',1,120,50,'Тихая вода, лилии и камыши.'],
  stonelamp: ['Каменный фонарь','dc',1,70,35,'Тёплый огонёк внутри резного камня.'],
  rabbit:    ['Ушастик','an',1,55,40,'Пушистый белый зайчик с розовыми ушками.']
});
Object.keys(IT).forEach(k => { if (IT[k][2]) IT[k][4] *= 3; }); // премиум стоит дорого

/* ---------- 3. Аватары ---------- */
const ey = (y=52,c='#2b2750',s=2.7) => C(40,y,s,c) + C(60,y,s,c);
const sm = y => L(`M44 ${y}q6 5 12 0`,'#2b2750',1.8);
const ch = y => C(33,y,3.5,'#ff8fae','opacity=".45"') + C(67,y,3.5,'#ff8fae','opacity=".45"');
const AVS = {
  gnome:   ['Гномик',0,  () => C(50,58,17,'#ffd7b5') + P('M33 60Q50 100 67 60Q50 67 33 60Z','#fff') + ey(54) + C(50,60,3.2,'#ff9b8a') + ch(60) + P('M28 48Q50 -4 72 48Q50 55 28 48Z','#e8383d') + C(50,36,3,'#fff','opacity=".7"')],
  fairy:   ['Феечка',0, () => E(24,48,11,18,'#d7ecff','opacity=".9"') + E(76,48,11,18,'#d7ecff','opacity=".9"') + C(50,50,22,'#ffb347') + C(50,56,17,'#ffe3cb') + P('M30 50Q50 28 70 50Q50 40 30 50Z','#ffb347') + ey(56) + sm(63) + ch(62) + C(66,34,5,'#ff7eb6') + C(66,34,2,'#ffd23f')],
  hare:    ['Заяц',0,   () => E(38,24,7,21,'#fff') + E(62,24,7,21,'#fff') + E(38,26,3.4,15,'#ffc4d6') + E(62,26,3.4,15,'#ffc4d6') + E(50,62,22,20,'#fff') + ey(58) + P('M46.5 63h7l-3.5 4Z','#ff8fb1') + L('M50 67v3','#ff8fb1',1.4) + ch(66)],
  kitten:  ['Котёнок',0,() => P('M28 44L30 18L46 32Z','#ffa24d') + P('M72 44L70 18L54 32Z','#ffa24d') + P('M32 38L33 25L42 33Z','#ffc4d6') + P('M68 38L67 25L58 33Z','#ffc4d6') + C(50,56,23,'#ffa24d') + E(50,64,11,8,'#fff2e0') + ey(52,'#3a7d2c',3.2) + P('M47 59h6l-3 3.4Z','#ff6b8a') + L('M38 60h-10M38 63l-9 3M62 60h10M62 63l9 3','#fff',1.2) + L('M42 34v5M50 32v5M58 34v5','#d97a30',2)],
  leaf:    ['Листик',0, () => P('M50 8C84 26 86 66 50 92C14 66 16 26 50 8Z','#86dc74') + P('M50 8C70 30 70 70 50 92C30 70 30 30 50 8Z','#a6ec92','opacity=".6"') + L('M50 18V86','#5cbd55',1.6) + ey(54) + sm(62) + ch(60)],
  fox:     ['Лисёнок',160, () => P('M22 46L26 14L46 30Z','#ff7a2e') + P('M78 46L74 14L54 30Z','#ff7a2e') + P('M29 38L29 22L40 31Z','#3a2a22') + P('M71 38L71 22L60 31Z','#3a2a22') + P('M16 56Q50 16 84 56Q72 90 50 90Q28 90 16 56Z','#ff7a2e') + P('M30 62Q50 52 70 62Q62 90 50 90Q38 90 30 62Z','#fff') + ey(54,'#2b1a10',3) + C(50,72,3.6,'#2b1a10')],
  owl:     ['Сова в очках',220, () => P('M26 40L30 16L44 28Z','#8b6b4a') + P('M74 40L70 16L56 28Z','#8b6b4a') + C(50,56,31,'#9c7a56') + E(50,68,18,17,'#ecd9b0') + C(38,50,11,'#fff') + C(62,50,11,'#fff') + C(38,50,5,'#2b2750') + C(62,50,5,'#2b2750') + C(40,48,1.6,'#fff') + C(64,48,1.6,'#fff') + C(38,50,12.5,'none','stroke="#e8b23a" stroke-width="1.8"') + C(62,50,12.5,'none','stroke="#e8b23a" stroke-width="1.8"') + P('M46 60h8l-4 8Z','#ffb13b')],
  spirit:  ['Дух сада',300, () => C(50,52,40,'#9ff5d0','opacity=".25" class="pulse"') + P('M50 10C78 20 84 52 74 76Q62 94 50 88Q38 94 26 76C16 52 22 20 50 10Z','#a8f0d4','opacity=".92"') + P('M50 12C60 20 66 40 60 60C70 40 64 24 50 12Z','#d8fff0','opacity=".7"') + C(40,50,4,'#1d6b55') + C(60,50,4,'#1d6b55') + C(41,49,1.4,'#fff') + C(61,49,1.4,'#fff') + L('M44 62q6 4 12 0','#1d6b55',1.8) + P('M42 20q-10-8-16 0q8 8 16 0Z','#6fd68a') + P('M58 20q10-8 16 0q-8 8-16 0Z','#6fd68a') + C(24,40,2,'#fff','class="tw"') + C(78,64,2.4,'#fff','class="tw"') + C(30,76,1.8,'#fff','class="tw"')],
  dragon:  ['Мини-дракон',320, () => P('M26 36L22 12L42 26Z','#ffd23f') + P('M74 36L78 12L58 26Z','#ffd23f') + P('M8 46Q22 36 28 54Q14 58 8 46Z','#b88cff') + P('M92 46Q78 36 72 54Q86 58 92 46Z','#b88cff') + C(50,54,27,'#5ad17a') + P('M44 28l6-9 6 9Z','#3bb05c') + E(50,68,16,12,'#8fe8a4') + C(44,67,2,'#2b6b3a') + C(56,67,2,'#2b6b3a') + C(40,48,5,'#fff') + C(60,48,5,'#fff') + C(41,48,2.6,'#2b2750') + C(61,48,2.6,'#2b2750') + L('M44 74q6 3 12 0','#2b6b3a',1.6)],
  gardener:['Садовник',180, () => P('M30 92Q50 72 70 92Z','#4aa3df') + C(50,58,19,'#ffd7b5') + ey(57) + sm(65) + ch(64) + E(50,42,38,9,'#e9c77a') + P('M32 42Q50 6 68 42Z','#f3d78e') + R(33,36,34,5,'#ff7eb6',2) + C(66,35,4,'#fff') + C(66,35,1.6,'#ffd23f')],
  elf:     ['Эльф',240, () => P('M22 52L6 38L34 46Z','#ffd7b5') + P('M78 52L94 38L66 46Z','#ffd7b5') + P('M22 56Q20 14 50 12Q80 14 78 56Q72 30 50 30Q28 30 22 56Z','#f2e6a0') + C(50,54,18,'#ffe3cb') + P('M32 50Q50 26 68 50Q50 38 32 50Z','#f2e6a0') + ey(55,'#2f6f4a') + sm(63) + ch(62) + P('M32 92Q50 76 68 92Z','#4aa36f')],
  deer:    ['Олень',260, () => L('M36 32L26 8M31 20L20 14M64 32L74 8M69 20L80 14','#8a5a3a',3) + E(24,40,8,5,'#c98a52') + E(76,40,8,5,'#c98a52') + P('M30 34Q50 26 70 34Q72 68 50 92Q28 68 30 34Z','#d29a62') + C(40,42,1.8,'#fff') + C(58,40,1.8,'#fff') + C(50,46,1.8,'#fff') + ey(54,'#2b1a10') + E(50,78,10,9,'#f6e7d2') + E(50,82,5.5,4,'#3a2a22')],
  squirrel:['Белочка',170, () => P('M62 84Q100 62 86 22Q72 40 70 62Z','#d9762a') + P('M32 38L30 14L46 28Z','#c96a22') + P('M68 38L70 14L54 28Z','#c96a22') + C(50,56,24,'#d9762a') + E(50,67,12,10,'#fff0dc') + ey(52,'#2b1a10',3) + C(50,63,2.8,'#2b1a10') + ch(62) + L('M44 71q6 4 12 0','#2b1a10',1.4)],
  hedge:   ['Ёжик',150, () => P('M6 64L12 40L19 54L26 30L34 46L42 24L50 42L58 24L66 46L74 30L81 54L88 40L94 64Z','#5d4332') + E(50,66,25,22,'#f0d2b0') + C(30,52,5,'#f0d2b0') + C(70,52,5,'#f0d2b0') + ey(62,'#2b1a10',2.8) + C(50,75,4,'#2b1a10') + ch(71)]
};

const ring = (n,f) => [...Array(n)].map((_,i) => {
  const a = i/n*6.283, x = 50+44.5*Math.cos(a), y = 50+44.5*Math.sin(a);
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(a*57.3+90).toFixed(0)}) scale(${i%2?1.25:.9})" class="tw" style="animation-delay:-${(i*.41%2.4).toFixed(2)}s">${f}</g>`;
}).join('');

const FRS = {
  none:    ['Без обводки',0,'#fff',''],
  leaves:  ['Листики',320,'#7ee08a', ring(16, E(0,0,4.4,1.9,'#8df09a') + L('M-3.4 0H3.4','#3fae5a',.6))],
  flowers: ['Цветочки',340,'#ffa6cf', ring(14, [[0,-2.4],[2.4,0],[0,2.4],[-2.4,0]].map(([x,y]) => C(x,y,1.9,'#ffc2dd')).join('') + C(0,0,1.3,'#ffd23f'))],
  stars:   ['Звёздочки',360,'#ffe66d', ring(14, P('M0-4.2L1.2-1.2L4.2 0L1.2 1.2L0 4.2L-1.2 1.2L-4.2 0L-1.2-1.2Z','#fff3a0'))],
  sparks:  ['Искры',380,'#fff6a0', ring(18, L('M-3 0H3M0-3V3','#fff',.9) + C(0,0,1.1,'#ffe66d'))],
  butter:  ['Бабочки',420,'#ff9bdc', ring(10, E(-2.5,-1.5,2.7,2,'#ff8ad0') + E(2.5,-1.5,2.7,2,'#ff8ad0') + E(-2,1.8,2,1.6,'#b88cff') + E(2,1.8,2,1.6,'#b88cff') + R(-.4,-2,.8,5,'#4a3b6b'))],
  crystals:['Кристаллы',440,'#8fdcff', ring(12, P('M0-4.8L2.7 0L0 4.8L-2.7 0Z','#aee6ff','stroke="#fff" stroke-width=".5"'))],
  twigs:   ['Веточки',300,'#c8f59a', ring(12, L('M-4.5 0Q0-3.2 4.5 0','#c49a68',1.2) + C(-4.5,0,1.1,'#8df09a') + C(4.5,0,1.1,'#8df09a'))]
};
const BGS = {
  none:   ['Нежный фон',0],
  sunset: ['Закат',380],
  forest: ['Лес',400],
  night:  ['Звёздное небо',420],
  meadow: ['Цветущий луг',440],
  water:  ['Водопад',480]
};
const CAT = { av:AVS, fr:FRS, bg:BGS };

function avatar(u, s=64){
  const a = AVS[u.av] || AVS.gnome;
  const f = FRS[u.fr] || FRS.none;
  return `<div class="av2" style="width:${s}px;height:${s}px;--gc:${f[2]}">
    <div class="abg ${u.bg && u.bg!='none' ? 'bg-'+u.bg : ''}"></div>
    <svg class="afig" viewBox="0 0 100 100">${a[2]()}</svg>
    ${f[3] ? `<svg class="afr" viewBox="0 0 100 100">${f[3]}</svg>` : ''}
  </div>`;
}

/* друзья: у каждого свой аватар */
Object.keys(DB).forEach((n,i) => {
  const u = DB[n];
  u.av = ['fox','owl','dragon','deer','spirit','gardener'][i%6];
  u.fr = Object.keys(FRS)[1+i%7];
  u.bg = Object.keys(BGS)[1+i%5];
});

/* ---------- 4. Миграция состояния ---------- */
S.chat  = S.chat  || [];
S.own   = S.own   || {};
S.gifts = S.gifts || {};
if (S.user && !S.user.av) Object.assign(S.user, { av:'gnome', fr:'none', bg:'none' });
if (!S.chat.length) S.chat.push({ r:'b', t:'Привет! Напиши любую задачу — я разобью её на маленькие шаги именно под неё. За каждый шаг ты получишь капельки для своего дерева.' });

/* ---------- 5. Нейронка: разбиение на шаги ---------- */
const KB = [
  [/алгебр|геометр|математ|физик|хими|уроки|домашк|контрольн|биолог|истори|литератур/,['Открой тетрадь~1','Возьми ручку~1','Прочитай задание~2','Посмотри пример~2','Попробуй решить первую строчку~4','Проверь, сошёлся ли ответ~3']],
  [/посуд|тарел|кастрюл/,['Подойди к раковине~1','Включи воду~1','Возьми тарелку~1','Нанеси средство~2','Помой одну тарелку~4','Смой пену и поставь сушиться~3']],
  [/отч[её]т|доклад|реферат|эссе|статью|курсов|презентац/,['Открой ноутбук~1','Создай документ~1','Напиши заголовок~2','Напиши первую строчку~4','Допиши абзац — пусть неидеально~4']],
  [/убор|комнат|порядок|пыл|пылесос/,['Возьми мусорный пакет~1','Собери всё, что лежит не на месте~2','Разложи вещи по местам~3','Протри одну поверхность~3','Оглядись — стало лучше~1']],
  [/стир|бель|одежд/,['Собери грязную одежду~1','Отнеси к стиральной машине~1','Загрузи вещи~2','Добавь порошок~2','Выбери режим и нажми «Старт»~3']],
  [/готов|ужин|обед|завтрак|суп|салат/,['Помой руки~1','Достань продукты~1','Достань посуду~1','Подготовь и нарежь основу~3','Начни готовить~4','Попробуй и выключи плиту~2']],
  [/трениров|зарядк|спорт|побегать|йог|бег/,['Надень удобную одежду~1','Налей воды~1','Расстели коврик~1','Сделай разминку на 2 минуты~3','Сделай первый подход~5']],
  [/позвон|письм|ответить|написать .*(другу|маме|коллег)/,['Открой чат или почту~1','Найди контакт~1','Придумай, что хочешь сказать, одним предложением~2','Напиши или набери первую фразу~4','Отправь или нажми вызов~3']],
  [/душ|помыться|зуб|умыть/,['Возьми полотенце~1','Иди в ванную~1','Включи воду~1','Помойся~3','Вытрись и оденься~1']],
  [/магазин|купить|покупк/,['Напиши список~2','Оденься~1','Возьми сумку и кошелёк~1','Дойди до магазина~3','Найди первый пункт из списка~3']],
  [/англ|язык|слов|учить/,['Открой учебник или приложение~1','Выбери пять слов~2','Прочитай их вслух~2','Запиши каждое по разу~3','Составь одну фразу~4']]
];
function localSteps(t){
  const s = t.toLowerCase();
  let a = (KB.find(([r]) => r.test(s)) || [])[1];
  if (!a) {
    a = [
      'Реши, где ты этим займёшься~1',
      `Подготовь всё нужное для «${t}»~1`,
      'Возьми или открой то, с чем будешь работать~2',
      'Сделай самое первое действие~3',
      'Продолжай ещё две минуты~4',
      'Посмотри, что уже получилось~2'
    ];
    if (s.split(/\s+/).length > 5) a.splice(5,0,'Сделай следующую часть~4');
  }
  return a.map(x => {
    const m = x.match(/^(.*)~(\d)$/);
    return { t:m[1], w:+m[2] };
  });
}
const microSplit = x => [
  { t:`Просто посмотри на это и вдохни: «${x.t}»`, w:1 },
  { t:'Сделай самое маленькое движение в эту сторону', w:1 },
  { t:`Теперь сделай: «${x.t}»`, w:Math.max(2, x.w-1) }
];
async function ask(p){
  try {
    let r;
    if (AI_URL) r = await (await fetch(AI_URL, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ prompt:p })
    })).text();
    else if (window.claude && claude.complete) r = await Promise.race([claude.complete(p), new Promise((_,j) => setTimeout(j,15000))]);
    else return null;

    const a = JSON.parse(String(r).replace(/```json|```/g,'').trim());
    return Array.isArray(a) && a.length
      ? a.slice(0,10).map(x => ({ t:String(x.t).slice(0,90), w:Math.min(5,Math.max(1,+x.w||1)) }))
      : null;
  } catch(e) { return null; }
}

/* ---------- 6. Чат ---------- */
const tk = id => S.tasks.find(t => t.id == id);
function taskCard(t){
  const n  = t.s.length, sz = SZ(n), ci = t.s.findIndex(x => !x.d && !x.k);
  const pr = Math.round(t.s.filter(x => x.d || x.k).length / n * 100);
  return `<div class="tcard ${t.d?'fin':''}">
    <div class="row"><b>${esc(t.t)}</b><span class="tag">${n} шагов</span></div>
    <div class="bar"><i style="width:${pr}%"></i></div>
    ${t.s.map((x,i) => `<div class="st ${x.d?'done':x.k?'skip':i==ci?'cur':''}">
      <div class="sh"><i class="n">${x.d?'✓':x.k?'–':i+1}</i><span>${esc(x.t)}</span><em class="dw">${dropI(dsz[sz]*.8|0)}${x.w}</em></div>
      ${i==ci ? `<div class="sb">
        <button class="btn sm" onclick="stepDone(${t.id},${i},this)">Сделал(а)</button>
        <button class="btn sm sec" onclick="stepHelp(${t.id},${i})">Помоги разобрать</button>
        <button class="btn sm sec" onclick="pauseB()">Пауза</button>
        <button class="btn sm ghost" onclick="stepSkip(${t.id},${i})">Пропустить шаг</button>
      </div>` : ''}
    </div>`).join('')}
  </div>`;
}
const chatHTML = nk => S.chat.map((m,i) => {
  const c  = `msg ${m.r=='u'?'u':'b'}${i>=nk?' new':''}`;
  const bt = `<i class="bot">${SPR}</i>`;
  if (m.r == 'task')   return `<div class="${c}">${bt}${taskCard(tk(m.id))}</div>`;
  if (m.r == 'typing') return `<div class="${c}">${bt}<div class="bub typing"><u></u><u></u><u></u></div></div>`;
  return m.r == 'u'
    ? `<div class="${c}"><div class="bub">${esc(m.t)}</div></div>`
    : `<div class="${c}">${bt}<div class="bub">${esc(m.t)}</div></div>`;
}).join('');
function paintChat(nk, sc){
  const m = $('#msgs'); if (!m) return;
  m.innerHTML = chatHTML(nk);
  if (sc) setTimeout(() => m.lastElementChild && m.lastElementChild.scrollIntoView({ behavior:'smooth', block:'center' }), 60);
}
const bestTree = () => (S.items.filter(i => IT[i.t][1]=='tree').pop() || { t:'oak' }).t;

function tasksS(){
  return `<section class="hero">
      <div class="row">
        <div><small style="color:#4a4570">Привет, ${esc(S.user.nick)}</small><h1>Что сегодня?</h1></div>
        <div class="row" style="gap:10px">
          ${dewPill()}
          <div id="tree" class="tbox" onclick="go('garden')" title="Мой сад"><div class="art">${ART[bestTree()]()}</div></div>
        </div>
      </div>
      <div class="chips">${moodChips()}</div>
      <p id="tip" class="tip">${MOODS[S.mood].tip}</p>
    </section>
    <div id="msgs" class="msgs">${chatHTML()}</div>
    <div class="cin">
      <input id="ci" placeholder="Напиши задачу — разобью на шаги" maxlength="120" onkeydown="if(event.key=='Enter')sendTask()">
      <button class="btn" onclick="sendTask()" aria-label="Отправить">${I(IC.send)}</button>
    </div>`;
}
async function sendTask(){
  const el = $('#ci'), v = el.value.trim(); if (!v) return;
  el.value = '';
  const n0 = S.chat.length;
  S.chat.push({ r:'u', t:v }, { r:'typing' });
  paintChat(n0, 1);

  const [a] = await Promise.all([
    ask(`Разбей задачу на 4–8 очень маленьких конкретных шагов именно под неё (не шаблонно), по-русски, в повелительном наклонении. Ответь только JSON [{"t":"шаг","w":1-5}], где w — сложность шага: 1 лёгкий, 2–3 средний, 4–5 сложный. Задача: ${v}`),
    new Promise(r => setTimeout(r, 1100))
  ]);
  const st = a || localSteps(v);
  const id = S.nid++, n1 = S.chat.length - 1;
  S.chat = S.chat.filter(m => m.r != 'typing');
  S.tasks.push({ id, t:v, d:0, s:st.map(x => ({ ...x, d:0, k:0 })) });
  S.chat.push(
    { r:'b', t:`Разобрал на ${st.length} шагов. Начни с первого — он совсем лёгкий.` },
    { r:'task', id }
  );
  save(); paintChat(n1, 1);
}
function fin(t){
  if (t.d || t.s.some(x => !x.d && !x.k)) return false;
  t.d = 1; S.done++; S.dew += 2;
  S.chat.push({ r:'b', t:`Задача «${t.t}» готова. Ты большой молодец! Лови бонусные капельки.` });
  return true;
}
function stepDone(id, i, b){
  const t = tk(id), x = t.s[i]; if (x.d) return;
  const rc = b.getBoundingClientRect(), n0 = S.chat.length;
  x.d = 1; S.dew += x.w;
  flyDrops(rc, x.w, SZ(t.s.length));
  if (fin(t)) setTimeout(() => flyDrops(rc, 2, 'lg'), 800);
  save(); paintChat(n0);
}
function stepSkip(id, i){
  const t = tk(id), n0 = S.chat.length;
  t.s[i].k = 1; fin(t); save(); paintChat(n0);
}
async function stepHelp(id, i){
  const t = tk(id), x = t.s[i], n0 = S.chat.length;
  S.chat.push({ r:'b', t:'Давай разберём этот шаг ещё мельче…' }, { r:'typing' });
  paintChat(n0, 1);

  const [a] = await Promise.all([
    ask(`Разбей один шаг «${x.t}» (из задачи «${t.t}») на 2–3 ещё более мелких шага. Только JSON [{"t":"шаг","w":1-3}].`),
    new Promise(r => setTimeout(r, 900))
  ]);
  S.chat = S.chat.filter(m => m.r != 'typing');
  t.s.splice(t.s.indexOf(x), 1, ...(a || microSplit(x)).map(y => ({ ...y, d:0, k:0 })));
  save(); paintChat();
}

/* ---------- 7. Капли к дереву ---------- */
const syncDew = () => document.querySelectorAll('.dew').forEach(e => e.innerHTML = dropI() + shown);
function flyDrops(rc, w, sz){
  const t = $('#tree');
  const b = t ? t.getBoundingClientRect() : { left:innerWidth/2, top:70, width:0, height:0 };
  const x0 = rc.left + rc.width/2, y0 = rc.top + rc.height/2;
  const x1 = b.left + b.width/2, y1 = b.top + b.height*.45;
  for (let k=0; k<w; k++){
    const d = document.createElement('div');
    d.className = 'fd ' + sz;
    d.innerHTML = dropI(dsz[sz]);
    document.body.appendChild(d);
    flying++;
    const j = (k - w/2) * 20;
    const an = d.animate([
      { transform:`translate(${x0}px,${y0}px) scale(.4)`, opacity:0 },
      { transform:`translate(${x0+(x1-x0)*.3+j}px,${y0-70-k*6}px) scale(1.2)`, opacity:1, offset:.3 },
      { transform:`translate(${x1}px,${y1}px) scale(.5)`, opacity:.9 }
    ], { duration:1100+k*90, delay:k*120, easing:'cubic-bezier(.45,.05,.2,1)', fill:'both' });
    an.onfinish = () => {
      d.remove(); flying--; shown++;
      if (flying == 0) shown = S.dew;
      syncDew();
      const tb = $('#tree');
      if (tb) { tb.classList.add('pop'); setTimeout(() => tb.classList.remove('pop'), 420); }
    };
  }
}

/* ---------- 8. Пауза (дыхательный круг) ---------- */
function pauseB(){
  if ($('#br')) return;
  const o = document.createElement('div');
  o.id = 'br';
  o.innerHTML = `<div>
    <div class="bc"></div>
    <span id="bt">Вдох…</span>
    <h2 style="margin:10px 0 6px;color:#3b3380">Дыши вместе со мной.<br>Вдох... Выдох...</h2>
    <p id="bn" style="color:var(--mut);min-height:22px;margin:0 0 14px">Четыре секунды вдох, четыре секунды выдох.</p>
    <div class="gbar" style="justify-content:center">
      <button class="btn" onclick="brEnd()">Продолжить</button>
      <button class="btn sec" onclick="brMore()">Отдохнуть ещё</button>
    </div>
  </div>`;
  document.body.appendChild(o);
  requestAnimationFrame(() => o.classList.add('on'));
  let ph = 0; rounds = 0;
  bti = setInterval(() => { ph ^= 1; $('#bt').textContent = ph ? 'Выдох…' : 'Вдох…'; }, 4000);
}
function brMore(){ rounds++; $('#bn').textContent = 'Побудь здесь, сколько нужно. Я подожду. Кругов: ' + rounds; toast('Отдыхаем дальше'); }
function brEnd(){ clearInterval(bti); const o = $('#br'); o.classList.remove('on'); setTimeout(() => o.remove(), 700); }

/* ---------- 9. Магазин v4 (аватарки/обводки/фоны) ---------- */
function cosGrid(k){
  return `<div class="grid">${Object.entries(CAT[k]).map(([id,d]) => {
    const own = !d[1] || S.own[k+':'+id];
    const on  = (S.user[k] || 'none') == id;
    const u   = S.user;
    const pv  = avatar(k=='av' ? { av:id } : k=='fr' ? { av:u.av, fr:id } : { av:u.av, bg:id }, 96);
    return `<div class="pc ${d[1]?'rare':''}">
      <span class="tag ${d[1]?'':'fr'}">${d[1]?'Премиум':'Бесплатно'}</span>
      <div class="pa" style="align-items:center">${pv}</div>
      <b>${d[0]}</b>
      <div class="row">
        <span class="price">${own ? '' : dropI(15)+d[1]}</span>
        <button class="btn sm ${on?'sec':''}" onclick="pick('${k}','${id}')">${on?'Надето':own?'Надеть':sub()?'Купить':'Премиум'}</button>
      </div>
    </div>`;
  }).join('')}</div>`;
}
function pick(k, id){
  const d = CAT[k][id], key = k+':'+id;
  if (d[1] && !S.own[key]){
    if (!sub()) return openPremium();
    if (S.dew < d[1]) return toast('Не хватает капелек. Выполняй шаги в чате.');
    S.dew -= d[1]; S.own[key] = 1; toast(d[0]+' теперь твоё');
  }
  S.user[k] = id; save(); render();
}
function shopS(){
  const cos = ['av','fr','bg'].includes(pf);
  const fl  = pf=='all' ? Object.keys(IT) : ids(0,pf).concat(ids(1,pf));
  const F = [['all','Всё'],['tree','Семена'],['dc','Украшения'],['an','Животные'],['av','Аватарки'],['fr','Обводки'],['bg','Фоны']];
  return `<div class="row"><h1>Магазин</h1>${dewPill()}</div>
    <div class="chips">${F.map(([k,n]) => `<button class="mc ${pf==k?'on':''}" style="background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.06)" onclick="pf='${k}';render()">${n}</button>`).join('')}</div>
    ${sub() ? '' : `<div class="card row" style="background:linear-gradient(135deg,#fff3c9,#ffe0f0)"><div><b>Редкие виды и премиум-оформление</b><br><small>3 дня бесплатно</small></div><button class="btn sm" onclick="openPremium()">Смотреть</button></div>`}
    ${cos
      ? cosGrid(pf)
      : `<h3>Обычные</h3><div class="grid">${fl.filter(k => !IT[k][2]).map(k => card(k,0,1)).join('')}</div>
         <h3>Премиум</h3><div class="grid">${fl.filter(k =>  IT[k][2]).map(k => card(k,1,1)).join('')}</div>`}`;
}

/* ---------- 10. Профиль v4 ---------- */
const optRow = k => `<div class="orow">${Object.entries(CAT[k])
  .filter(([id,d]) => !d[1] || S.own[k+':'+id])
  .map(([id]) => `<button class="${(S.user[k]||'none')==id?'on':''}" onclick="pick('${k}','${id}')">${avatar(
    k=='av' ? { av:id } : k=='fr' ? { av:S.user.av, fr:id } : { av:S.user.av, bg:id }, 54
  )}</button>`).join('')}</div>`;
function meS(){
  const ts = S.items.filter(i => IT[i.t][1]=='tree').length;
  return `<h1>Профиль</h1>
    <div class="card" style="text-align:center">
      <div style="display:grid;place-items:center">${avatar(S.user,112)}</div>
      <h2 style="margin-top:8px">@${esc(S.user.nick)}</h2>
      <small>${S.user.age} лет</small>
      <h3>Аватарка</h3>${optRow('av')}
      <h3>Обводка</h3>${optRow('fr')}
      <h3>Фон</h3>${optRow('bg')}
      <button class="btn sm sec" style="margin-top:12px" onclick="pf='av';go('shop')">Ещё в магазине</button>
    </div>
    <div class="stats">
      <div class="stat"><b>${S.done}</b><small>задач</small></div>
      <div class="stat"><b>${ts}</b><small>деревьев</small></div>
      <div class="stat"><b>${S.dew}</b><small>капелек</small></div>
    </div>
    <div class="card"><b>Подписка</b>
      <p><small>${sub() ? 'Премиум активен: 3 дня бесплатно, далее 399 ₽/мес.' : 'Бесплатный план. Премиум: 3 дня бесплатно, далее 399 ₽/мес.'}</small></p>
      <div style="display:flex;gap:8px">
        ${sub() ? `<button class="cancel" onclick="cancelSub()">Отменить подписку</button>` : `<button class="btn" onclick="openPremium()">Оформить Премиум</button>`}
      </div>
    </div>`;
}

/* ---------- 11. Соседи v4 ---------- */
function row(n){
  const u = DB[n];
  return `<div class="fr" onclick="openF('${n}')">${avatar(u,52)}
    <div class="nm"><b>@${n}</b><small>${MOODS[u.mood].n}</small></div>
    ${S.friends.includes(n)
      ? `<button class="btn sm sec">Сад</button>`
      : `<button class="btn sm" onclick="event.stopPropagation();addF('${n}')">Добавить</button>`}
  </div>`;
}
function friendS(){
  const u = DB[fr], w = S.watered[fr] || 0;
  curAv = u;
  const sc = scene(u.it.map((a,i) => ({ id:i, t:a[0], x:a[1], y:a[2] })), 'ro');
  curAv = null;
  return `<div class="row">
      <button class="btn sm sec" onclick="fr=null;render()">${I(IC.back,18)} Назад</button>
      <div class="row" style="gap:8px">${avatar(u,48)}<b>@${fr}</b></div>
    </div>
    <div id="fg">${sc}</div>
    <div class="gbar">
      <button class="btn" onclick="water('${fr}')">${dropI(16)} Полить</button>
      <small id="wc">Ты полил(а) этот сад: ${w} раз · подарено капелек: ${S.gifts[fr]||0}</small>
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
const _w = water;
water = n => {
  S.gifts[n] = (S.gifts[n] || 0) + 3;
  _w(n);
  $('#wc').textContent = 'Ты полил(а) этот сад: ' + S.watered[n] + ' раз · подарено капелек: ' + S.gifts[n];
  toast('@'+n+' получил(а) 3 капельки');
};

/* ---------- 12. Обёртки сцены / таббара / garden ---------- */
const _sc = scene;
scene = function(i, c){
  const h = _sc(i, c);
  return curAv
    ? h.replace('<div class="abs stars">', `<div class="gav">${avatar(curAv,76)}</div><div class="abs stars">`)
    : h;
};
const _gs = gardenS;
gardenS = function(){ curAv = S.user; const h = _gs(); curAv = null; return h; };
const _tb = tabbar;
tabbar = () => _tb().replace('Задачи', 'Чат');

/* ---------- 13. Онбординг v4 ---------- */
function onboard(){
  $('#app').innerHTML = `<div class="ob"><div class="card">
    <h1>Сад Прогресса</h1>
    <p style="color:var(--mut)">Придумай свой уникальный ник — по нему друзья найдут тебя и смогут заглянуть в твой сад.</p>
    <input id="nk" placeholder="Ник (3–16 символов)" maxlength="16" style="margin-bottom:8px">
    <input id="ag" type="number" placeholder="Возраст" min="5" max="99" style="margin-bottom:8px">
    <small>Аватарка</small>
    <div class="orow" style="justify-content:center">${Object.entries(AVS).filter(([,d]) => !d[1]).map(([id]) =>
      `<button class="${id==oba?'on':''}" onclick="oba='${id}';document.querySelectorAll('.orow button').forEach(b=>b.classList.toggle('on',b===this))">${avatar({av:id},58)}</button>`).join('')}</div>
    <div class="err" id="er"></div>
    <button class="btn" style="width:100%" onclick="reg()">Начать</button>
  </div></div>`;
}
function reg(){
  const n = $('#nk').value.trim(), a = +$('#ag').value, e = $('#er');
  if (!/^[a-zA-Z0-9_а-яА-ЯёЁ]{3,16}$/.test(n)) return e.textContent = 'Ник: 3–16 символов, буквы, цифры, подчёркивание.';
  if (DB[n.toLowerCase()]) return e.textContent = 'Этот ник уже занят.';
  if (!(a>=5 && a<=99)) return e.textContent = 'Укажи возраст.';
  S.user = { nick:n, age:a, c:COLS[0], av:oba, fr:'none', bg:'none' };
  save(); render();
}

/* ---------- 14. Плавный render ---------- */
const _rd = render;
render = function(){
  if (flying == 0) shown = S.dew;
  const same = lt === tab && lf === fr;
  _rd();
  const m = $('.scr');
  if (m && same) { m.classList.add('nf'); m.style.animation = 'none'; }
  lt = tab; lf = fr;
  document.querySelectorAll('.grid>*,.fr,.stat').forEach((e,i) => e.style.animationDelay = Math.min(i,14)*45+'ms');
};
render();