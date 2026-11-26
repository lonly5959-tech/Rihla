/* px_more.js — sections of رحلة:
   الأنشطة النمائية (verbal and non-verbal activities by developmental age, 0–20, across the ability areas; shown inside the أنشطة tab),
   الحصالة (its own tab: save stars, swap them for gifts or favorite activities),
   الخطط (its own tab: yearly → monthly → weekly plans with progress and prompt type, behind one password per person),
   and adding the schedule to the device calendar (standalone copy) so alerts arrive with the app closed. */
(function(){
'use strict';
window.PXF=window.PXF||{};
window.PXF.more=function(X){
  var A=X.A,esc=X.esc,ar=X.ar,I=X.I,L=window.ALIB||{bands:[],doms:[],senses:{},acts:[]};
  X.need('ppl',true);X.need('pln');X.need('plog',false,{order:'ts',limit:3000});

  var IC={
    brain:'<path d="M9.5 4.5A2.5 2.5 0 0 0 7 7a2.5 2.5 0 0 0-2.5 2.5c0 .9.4 1.6 1 2.1A2.7 2.7 0 0 0 5 13.5 2.5 2.5 0 0 0 7.5 16v.5A2.5 2.5 0 0 0 10 19h2V4.5z"/><path d="M14.5 4.5A2.5 2.5 0 0 1 17 7a2.5 2.5 0 0 1 2.5 2.5c0 .9-.4 1.6-1 2.1.3.5.5 1.2.5 1.9a2.5 2.5 0 0 1-2.5 2.5v.5A2.5 2.5 0 0 1 14 19h-2"/>',
    piggy:'<path d="M18.5 9.2c.9.3 1.5 1.1 1.5 2v1.6h-1.4a6 6 0 0 1-2.6 3.4V19h-2.3v-1.5h-3.4V19H8v-2.6A5.7 5.7 0 0 1 5 11.6C5 8.5 8 6 11.8 6c1.5 0 2.9.4 4 1.1L18.5 6z"/><path d="M10 6.2V4.5h3.5"/>',
    lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
    plan:'<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 14h7M8.5 18h4"/>',
    back:'<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/>',
    calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 7h7M8.5 11.5h.1M12 11.5h.1M15.5 11.5h.1M8.5 15h.1M12 15h.1M15.5 15h.1M8.5 18h.1M12 18h3.6"/>',
    ear:'<path d="M7 9a5 5 0 0 1 10 0c0 3-2.5 3.5-2.5 6.5a3 3 0 0 1-5.6 1.5"/><path d="M10 9.5a2 2 0 0 1 4 0c0 1-1 1.5-1.5 2.5"/>',
    scale:'<path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z"/>',
    clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.2 2"/>',
    flower:'<circle cx="12" cy="9" r="2.2"/><path d="M12 6.8V4M14.1 8.3l2.4-1.4M14.1 9.7l2.4 1.4M9.9 8.3L7.5 6.9M9.9 9.7l-2.4 1.4M12 11.2V21M12 16c-2.5 0-4-1.2-4.500-3M12 18c2.500 0 4-1.200 4.500-3"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.500 4.500"/>'
  };
  (function(){var s='<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';for(var k in IC)s+='<symbol id="i-'+k+'" viewBox="0 0 24 24">'+IC[k]+'</symbol>';document.body.insertAdjacentHTML('afterbegin',s+'</svg>');})();
  /* forms live either in the open sheet or, for the sections that are tabs, in the main view */
  function root(){return A.TOP()?X.layer:document.getElementById('view');}
  function q(sel){return root().querySelector(sel);}
  function val(sel){var e=q(sel);return e?String(e.value||'').trim():'';}
  function typing(){var e=document.activeElement;return !!(e&&/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName)&&e.type!=='file');}
  function toTab(id){A.STACK().length=0;X.layer.innerHTML='';A.go(id);}
  /* Arabic number agreement: 1, 2, 3–10, 11+ */
  function cw(n,one,two,few,many){n=+n||0;return n===1?one:n===2?two:ar(n)+' '+(n>=3&&n<=10?few:many);}
  function stars(n){return (+n||0)<=0?'لا نجوم بعد':cw(n,'نجمة واحدة','نجمتان','نجوم','نجمة');}
  function nAct(n){return n?cw(n,'نشاط واحد','نشاطان','أنشطة','نشاطاً'):'لا أنشطة';}

  /* =================== 1. the developmental activities library =================== */
  var BAND={},DOMI={},ACTS=[];
  L.bands.forEach(function(b,i){BAND[b[0]]={t:b[1],i:i};});
  L.doms.forEach(function(d,i){DOMI[d[0]]={t:d[1],d:d[2],c:d[3],i:i};});
  (function(){var cnt={};L.acts.forEach(function(r){var k=r[0]+r[1]+r[2];cnt[k]=(cnt[k]||0)+1;ACTS.push({id:k+cnt[k],dom:r[0],band:r[1],ty:r[2],t:r[3],h:r[4],m:r[5],s:r[6]||''});});})();
  var DIC={fr:'brain',qr:'calc',vs:'eye',kn:'book',wm:'layers',at:'target',co:'timer',cp:'ear',ef:'steps',ap:'hand',pe:'smile'};
  /* the kinds of perception, each shown by name */
  var SENSE=[['a','الإدراك السمعي','ear','--brand-ink','يميّز الأصوات ويحدد مصدرها ويتذكرها.'],['v','الإدراك البصري','eye','--sea','يميّز الأشكال والألوان والفروق الدقيقة بالنظر.'],
    ['t','الإدراك اللمسي','hand','--tang','يتعرف على الأشياء والملامس والحرارة باللمس.'],['k','الإدراك الحركي والجسدي','run','--good-ink','يحس بجسمه ووضع أطرافه وقوة حركته.'],
    ['b','التوازن (الدهليزي)','scale','--grape','يحافظ على توازنه ويتقبّل الحركة والدوران.'],['s','الإدراك المكاني','grid','--sun-ink','يدرك المواقع والاتجاهات والمسافات.'],
    ['m','إدراك الزمن','clock','--bad-ink','يحس بالوقت والترتيب والمدة.'],['o','الشم والتذوق','flower','--good-ink','يميّز الروائح والمذاقات ويتقبّل الجديد منها.']],SN={};
  SENSE.forEach(function(s){SN[s[0]]=s;});
  function actById(id){for(var i=0;i<ACTS.length;i++)if(ACTS[i].id===id)return ACTS[i];return null;}
  function ageBand(){var a=X.age(X.kid().dob);if(a==null)a=7;var cut=[1,2,3,4,5,6,9,12,15];for(var i=0;i<cut.length;i++)if(a<cut[i])return 'b'+i;return 'b9';}
  function prof(){var p=X.col('xset').get('alib');return (p&&p.bands)||{};}
  function bandFor(dom){var b=prof()[dom];return BAND[b]?b:ageBand();}
  function bandShift(b,d){var i=BAND[b].i+d;return (i<0||i>=L.bands.length)?null:L.bands[i][0];}
  function alLog(){var out=[],SD=A.S().days;for(var k in SD){var x=SD[k];if(x&&x.al)out=out.concat(x.al);}return out;}
  function tried(id){return alLog().filter(function(e){return e.a===id;}).length;}
  function triedToday(id){return X.dayItems(A.today(),'al').some(function(e){return e.a===id;});}
  var LB={dom:'',sense:'',band:'',ty:'',seed:0,go:'',q:''};
  function pick(dom,sense,band){return ACTS.filter(function(a){return (!dom||a.dom===dom)&&(!sense||a.s===sense)&&(!band||a.band===band)&&(!LB.ty||a.ty===LB.ty);});}
  function rnd(i){var x=Math.sin(+A.today().replace(/-/g,'')*0.0001+LB.seed*12.9898+i*78.233)*43758.5453;return x-Math.floor(x);}
  function suggest(){var groups=[['fr','qr','vs'],['at','co','wm','ef'],['pe','cp','kn','ap']],out=[];
    groups.forEach(function(g,gi){var dom=g[Math.floor(rnd(gi)*g.length)],pool=pick(dom,'',bandFor(dom));
      if(!pool.length)return;var fresh=pool.filter(function(a){return !triedToday(a.id);});out.push((fresh.length?fresh:pool)[Math.floor(rnd(gi+7)*(fresh.length||pool.length))]);});
    return out;}
  function norm(s){return String(s||'').replace(/[ً-ٰٟـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').toLowerCase();}
  /* a light stem so «مطابقة» also finds «يطابق», and «مكعبات» finds «مكعب» */
  function stem(w){var s=w.replace(/^ال/,'');if(s.length>4&&/^[ميتن]/.test(s))s=s.slice(1);if(s.length>4&&/ات$/.test(s))s=s.slice(0,-2);else if(s.length>3&&/[هي]$/.test(s))s=s.slice(0,-1);return s.length>=3?s:w;}
  function search(qs){var ws=norm(qs).split(/\s+/).filter(Boolean).map(stem);if(!ws.length)return [];
    return ACTS.filter(function(a){if(LB.ty&&a.ty!==LB.ty)return false;var t=norm(a.t+' '+a.h+' '+a.m+' '+DOMI[a.dom].t+(a.s&&SN[a.s]?' '+SN[a.s][1]:''));return ws.every(function(w){return t.indexOf(w)>=0;});});}
  function actCard(a){var dm=DOMI[a.dom],n=tried(a.id),td=triedToday(a.id),easier=bandShift(a.band,-1),harder=bandShift(a.band,1),col=a.s&&SN[a.s]?SN[a.s][3]:dm.c;
    return '<div class="card alc" id="al-'+a.id+'" style="--hc:var('+col+')"><div class="row between"><b class="alt">'+esc(a.t)+'</b>'+X.chip(a.ty==='v'?'لفظي':'غير لفظي',a.ty==='v'?'':'plain')+'</div>'+
      '<p class="alm">'+X.chip(esc(a.s&&SN[a.s]?SN[a.s][1]:dm.t),'dom')+X.chip(esc(BAND[a.band].t),'plain')+'</p>'+
      '<p>'+esc(a.h)+'</p><p class="muted">الأدوات: '+esc(a.m)+'</p><div class="row fwrap">'+
      (td?'<span class="chip good">'+I('check')+' جرّبناه اليوم</span>':'<button class="btn small" data-act="xaltry" data-id="'+a.id+'">'+I('check')+' جرّبناه اليوم</button>')+
      (n?X.chip('المرات: '+ar(n),'plain'):'')+
      (easier?'<button class="btn small line" data-act="xalnav" data-dom="'+a.dom+'" data-s="'+a.s+'" data-b="'+easier+'" data-go="'+a.ty+'">'+I('down')+' أسهل</button>':'')+
      (harder?'<button class="btn small line" data-act="xalnav" data-dom="'+a.dom+'" data-s="'+a.s+'" data-b="'+harder+'" data-go="'+a.ty+'">'+I('up')+' أصعب</button>':'')+'</div></div>';}
  function domTile(id,sense,t,ic,col,sub){return '<button class="htile al" data-act="xaldom" data-v="'+id+'" data-s="'+(sense||'')+'" style="--hc:var('+col+')"><span class="hic">'+I(ic)+'</span><span class="ht">'+esc(t)+'</span><span class="hs">'+sub+'</span></button>';}
  /* everything under the search box; redrawn alone while the parent types */
  function libList(){var k=X.kn(),dom=LB.dom,h='';
    if(LB.q){var res=search(LB.q);
      return '<p class="muted">'+(res.length?nAct(res.length)+' فيها «'+esc(LB.q)+'»'+(res.length>40?' · أول ٤٠':''):'لا نتيجة ل«'+esc(LB.q)+'». جرّب كلمة أخرى مثل: مكعبات، قصة، توازن.')+'</p>'+res.slice(0,40).map(actCard).join('');}
    if(!dom){
      var sg=suggest();
      h+='<div class="row between"><h2>اقتراح اليوم</h2><button class="btn small line" data-act="xalmix">'+I('reset')+' غيّرها</button></div><p class="muted">ثلاثة أنشطة من مجالات مختلفة على مستوى '+esc(k)+' الحالي.</p>'+sg.map(actCard).join('');
      h+='<h2 class="sub2">المجالات</h2><div class="hubgrid al">'+L.doms.filter(function(d){return d[0]!=='pe';}).map(function(d){return domTile(d[0],'',d[1],DIC[d[0]]||'brain',d[3],nAct(pick(d[0]).length));}).join('')+'</div>';
      h+='<h2 class="sub2">الإدراك بأنواعه</h2><div class="hubgrid al">'+SENSE.map(function(s){return domTile('pe',s[0],s[1],s[2],s[3],nAct(pick('pe',s[0]).length));}).join('')+'</div>';
      h+='<button class="btn ghost" data-act="xalprof">'+I('target')+' مستوى '+esc(k)+' في كل مجال</button>';
      return h;}
    var dm=DOMI[dom],sn=LB.sense&&SN[LB.sense],cur=LB.band||bandFor(dom),mine=bandFor(dom),list=pick(dom,LB.sense,cur);
    h+='<button class="btn small line" data-act="xaldom" data-v="">'+I('right')+' كل المجالات</button>';
    h+='<div class="card alhd" style="--hc:var('+(sn?sn[3]:dm.c)+')"><span class="hic">'+I(sn?sn[2]:(DIC[dom]||'brain'))+'</span><div class="grow"><h2>'+esc(sn?sn[1]:dm.t)+'</h2><p class="muted">'+esc(sn?sn[4]:dm.d)+' · '+nAct(pick(dom,LB.sense).length)+' في كل الأعمار</p></div></div>';
    h+='<p class="muted">العمر النمائي:</p><div class="hscroll" role="group" aria-label="العمر النمائي">'+L.bands.map(function(b){var n=pick(dom,LB.sense,b[0]).length;return '<button class="pill'+(b[0]===mine?' own':'')+'" data-act="xalband" data-v="'+b[0]+'" aria-pressed="'+(b[0]===cur)+'"'+(n?'':' disabled')+'>'+esc(b[1])+(b[0]===mine?' · '+esc(k):'')+'</button>';}).join('')+'</div>';
    h+=list.length?list.map(actCard).join(''):X.empty('لا توجد أنشطة بهذه التصفية في هذا العمر.','اختر عمراً آخر أو غيّر «لفظية / غير لفظية».');
    if(cur!==mine&&A.canEdit())h+='<button class="btn line" data-act="xalsetb" data-dom="'+dom+'" data-v="'+cur+'">'+I('target')+' اجعل «'+esc(BAND[cur].t)+'» مستوى '+esc(k)+' في '+esc(dm.t)+'</button>';
    return h;}
  function libBody(){var k=X.kn(),nv=ACTS.filter(function(a){return a.ty==='v';}).length,h='';
    h+='<div class="card alstat"><div class="alnum num">'+ar(ACTS.length)+'</div><div class="grow"><b>نشاطاً نمائياً ل'+esc(k)+'</b><p class="muted">'+ar(nv)+' لفظياً و'+ar(ACTS.length-nv)+' غير لفظي · '+ar(L.doms.length-1+SENSE.length)+' مجالاً · '+ar(L.bands.length)+' أعمار نمائية من الولادة إلى ٢٠ سنة</p></div></div>';
    h+='<label class="alsearch">'+I('search')+'<input type="search" data-xalq="1" value="'+esc(LB.q)+'" placeholder="ابحث عن نشاط: مكعبات، قصة، توازن…" aria-label="ابحث في الأنشطة" enterkeyhint="search"></label>';
    h+=X.seg('xalty',LB.ty||'all',[['all','الكل'],['n','غير لفظية'],['v','لفظية']]);
    h+='<div id="albody">'+libList()+'</div>';
    h+='<div class="tip">الأعمار هنا <b>نمائية</b>: ابدأ من مستوى '+esc(k)+' في كل مجال لا من عمره، وانتقل إلى «أصعب» بعد ثلاث محاولات ناجحة متتالية، وإلى «أسهل» إذا '+X.g('تعثّر','تعثّرت')+'. <b>الأنشطة اللفظية</b> تعتمد على فهم الكلام أو قوله، وإذا لم '+X.g('يتكلم','تتكلم')+' بعد فتقبّل الإجابة بالإشارة أو بصورة من «أطلب». <b>غير اللفظية</b> تُحل بالمطابقة والبناء والإشارة والحركة.</div>';
    return h;}
  function libAfter(){var r=root();if(LB.go){var e=document.getElementById('al-'+LB.go);LB.go='';if(e)try{e.scrollIntoView({block:'center'});}catch(_){}}
    [].forEach.call(r.querySelectorAll('.hscroll'),function(sc){var c=sc.querySelector('[aria-pressed="true"]');if(!c)return;var a=c.getBoundingClientRect(),R=sc.getBoundingClientRect();sc.scrollLeft+=(a.left+a.width/2)-(R.left+R.width/2);});}
  X.secOpen.alib=function(){X.open('alib',function(){return X.page('الأنشطة النمائية',libBody());},{after:libAfter});};
  /* the library sits inside the أنشطة section itself, beside the games */
  var GM={v:'lib'};try{GM.v=localStorage.getItem('px:gm')==='play'?'play':'lib';}catch(e){}
  (X.inj.gamesTop=X.inj.gamesTop||[]).unshift(function(){
    return '<div class="gmbox'+(GM.v==='lib'?' lib':'')+'">'+X.seg('xgm',GM.v,[['lib','الأنشطة النمائية · '+ar(ACTS.length)],['play','الألعاب وأقسام '+esc(X.kn())]])+(GM.v==='lib'?libBody():'')+'</div>';});
  X.onAfter('games',function(){if(GM.v==='lib')libAfter();});
  X.on('xgm',function(b,d){GM.v=d('v')==='play'?'play':'lib';try{localStorage.setItem('px:gm',GM.v);}catch(e){}A.redraw();});
  X.secOpen.alprof=function(){X.open('alprof',function(){var p=prof(),k=X.kn();
    return X.page('مستوى '+esc(k)+' في كل مجال','<p class="muted">اختر العمر النمائي الذي '+X.g('ينجح','تنجح')+' فيه '+esc(k)+' غالباً في كل مجال، لا عمره الحقيقي. المستويات تختلف من مجال لآخر، وهذا طبيعي.</p>'+
      L.doms.map(function(d){var b=p[d[0]]||'';return '<div class="card"><b>'+esc(d[1])+'</b><p class="muted">'+esc(d[2])+'</p>'+X.field('العمر النمائي','<select data-xalb="'+d[0]+'"'+(A.canEdit()?'':' disabled')+'><option value="">حسب العمر ('+esc(BAND[ageBand()].t)+')</option>'+L.bands.map(function(x){return '<option value="'+x[0]+'"'+(x[0]===b?' selected':'')+'>'+esc(x[1])+'</option>';}).join('')+'</select>')+'</div>';}).join(''));});};
  function setBand(dom,b){var bands=Object.assign({},prof());if(b)bands[dom]=b;else delete bands[dom];return X.col('xset').patch('alib',{bands:bands});}
  X.on('xalprof',function(){X.openSec('alprof');});
  X.on('xaldom',function(b,d){LB.dom=d('v');LB.sense=d('s')||'';LB.band='';LB.q='';A.redraw();var m=document.getElementById('main');if(m&&!A.TOP()){var g=document.querySelector('#view .gmbox');if(g)m.scrollTop=Math.max(0,g.offsetTop-8);}});
  X.on('xalband',function(b,d){LB.band=d('v');A.redraw();});
  X.on('xalty',function(b,d){LB.ty=d('v')==='all'?'':d('v');A.redraw();});
  X.on('xalmix',function(){LB.seed++;A.redraw();});
  X.on('xalnav',function(b,d){LB.dom=d('dom');LB.sense=d('s')||'';LB.band=d('b');LB.q='';var t=d('go');var a=pick(LB.dom,LB.sense,LB.band).filter(function(x){return x.ty===t;})[0];LB.go=a?a.id:'';A.redraw();});
  X.on('xaltry',function(b,d){X.log('al',{a:d('id')},200);A.toast('سُجّل: جرّبناه اليوم');A.redraw();});
  X.on('xalsetb',function(b,d){setBand(d('dom'),d('v')).then(function(){A.toast('تم تحديث المستوى');A.redraw();},A.saveErr);});
  X.on('xalopen',function(b,d){var a=actById(d('id'));if(!a)return;LB.dom=a.dom;LB.sense=a.s||'';LB.band=a.band;LB.ty='';LB.q='';LB.go=a.id;X.openSec('alib');});
  X.onChange(function(t){if(!t||!t.getAttribute||!t.getAttribute('data-xalb'))return false;setBand(t.getAttribute('data-xalb'),t.value).then(function(){A.toast('تم الحفظ');},A.saveErr);return true;});
  var qT=null;
  document.addEventListener('input',function(e){var t=e.target;if(!t||!t.getAttribute||!t.getAttribute('data-xalq'))return;LB.q=String(t.value||'').trim();clearTimeout(qT);
    qT=setTimeout(function(){var bx=root().querySelector('#albody');if(bx)bx.innerHTML=libList();},180);});

  /* =================== 2. الحصالة: the star piggy bank =================== */
  var RK=[['item','هدايا ومعززات'],['fav','أنشطة مفضلة'],['meal','اختيار الغداء'],['trip','رحلات']];
  function jarSVG(fr){fr=Math.max(0,Math.min(1,fr||0));var top=150-112*fr,coins='';
    for(var i=0;i<14;i++){var cy=146-(i%7)*16-Math.floor(i/7)*8,cx=34+(i*37)%54;if(cy<top+6)continue;coins+='<circle cx="'+cx+'" cy="'+cy+'" r="8" class="jc"/>';}
    return '<svg class="jar" viewBox="0 0 120 160" aria-hidden="true"><defs><clipPath id="jarclip"><path d="M26 42h68c6 0 10 4 10 10v84c0 10-8 18-18 18H34c-10 0-18-8-18-18V52c0-6 4-10 10-10z"/></clipPath></defs>'+
      '<g clip-path="url(#jarclip)"><rect x="10" y="'+top.toFixed(1)+'" width="100" height="'+(160-top).toFixed(1)+'" class="jf"/>'+coins+'</g>'+
      '<path d="M26 42h68c6 0 10 4 10 10v84c0 10-8 18-18 18H34c-10 0-18-8-18-18V52c0-6 4-10 10-10z" class="jo"/><rect x="32" y="24" width="56" height="18" rx="5" class="jl"/><rect x="50" y="29" width="20" height="4" rx="2" class="js"/></svg>';}
  function dayEarned(d){var n=0,SD=A.S().days;for(var k in SD){var x=SD[k];if(x&&x.date===d&&x.c&&x.c.tok)n+=x.c.tok;}return n;}
  function bankBody(){
    var S=A.S(),bal=A.tokBal(),r=A.target(),cost=r?(r.cost||5):0,k=X.kn(),seen=S.set.bankSeen,add=seen!=null&&bal>seen?Math.min(bal-seen,6):0,ed=A.canEdit()&&!S.set.lock,h='';
    if(seen!==bal){S.set.bankSeen=bal;A.saveLocal();}
    var drops='';for(var i=0;i<add;i++)drops+='<i class="coin" style="animation-delay:'+(i*0.22).toFixed(2)+'s">'+I('star')+'</i>';
    h+='<div class="card bankhero"><div class="jarwrap">'+jarSVG(r?bal/cost:bal/20)+drops+'</div><div class="grow"><div class="bal num" aria-label="'+esc(stars(bal))+'">'+I('star')+' '+ar(bal)+'</div>'+
      (r?'<p>'+X.g('هدفه','هدفها')+': <b>'+esc(r.t)+'</b></p><div class="pbar" role="progressbar" aria-valuenow="'+Math.min(bal,cost)+'" aria-valuemax="'+cost+'"><i style="width:'+Math.min(100,Math.round(100*bal/cost))+'%"></i></div><p class="muted">'+(bal>=cost?'اكتملت النجوم!':'باقي '+stars(cost-bal))+'</p>'+
        (bal>=cost?'<button class="btn big go" data-act="xbankgo">'+I('gift')+' استبدل الآن</button>':'')
       :'<p class="muted">'+(bal?'اضغط هدية أو نشاطاً تحت ليصير الهدف.':'تُجمع النجوم عند إنهاء أنشطة الجدول وجلسات النطق والألعاب. اختر هدفاً من تحت.')+'</p>')+'</div></div>';
    RK.forEach(function(kd){var rs=A.lib('rew').filter(function(x){return (x.kind||'item')===kd[0];});if(!rs.length)return;
      h+='<h2 class="sub2">'+kd[1]+'</h2><div class="grid rgrid">'+rs.map(function(x){var c=x.cost||5,ok=bal>=c;return '<button class="tile bk'+(ok?' ok':'')+(r&&r.id===x.id?' sel':'')+'" data-act="xbankpick" data-id="'+x.id+'">'+A.picHTML(x)+'<span class="w">'+esc(x.t)+'</span><span class="cost num">'+I('star')+' '+ar(c)+'</span></button>';}).join('')+'</div>';});
    var days=[];for(var j=6;j>=0;j--)days.push(A.addDays(A.today(),-j));var ev=days.map(dayEarned);
    h+='<div class="card"><h2>النجوم آخر ٧ أيام</h2>'+(ev.some(Boolean)?'<div class="chartbox">'+X.bars(days.map(function(d){return X.dateTxt(d,true);}),[{n:'نجوم',v:ev,c:X.C1}],{h:130,label:'النجوم يومياً'})+'</div>':X.empty('لم تُجمع نجوم هذا الأسبوع بعد.'))+'</div>';
    var hist=A.allHist().slice(0,8);
    if(hist.length)h+='<div class="card"><h2>آخر الاستبدالات</h2><div class="list">'+hist.map(function(x){return '<div class="li"><span class="muted" style="flex:none">'+esc(X.dateTxt(x.d,true))+'</span><span class="nm">'+esc(x.t)+(x.ch?': '+esc(x.ch):'')+'</span><span class="muted num">'+I('star')+' '+ar(x.c||0)+'</span></div>';}).join('')+'</div></div>';
    if(ed)h+='<div class="card"><h2>للوالدين</h2><div class="row"><button class="btn small ghost grow" data-act="xbankplus">'+I('plus')+' نجمة</button><button class="btn small line grow" data-act="xbankminus">− نجمة</button></div><button class="btn small line" data-act="olib" data-col="rew">'+I('edit')+' الهدايا والأنشطة المفضلة وأسعارها</button><p class="muted">النجوم تُجمع تلقائياً عند إنهاء أنشطة الجدول وجلسات النطق والألعاب، ويمكنك إعطاء نجمة يدوياً.</p></div>';
    return h;}
  A.addTab('bank',{label:'الحصالة',acc:'--sun-ink',before:'progress',icon:IC.piggy,view:function(){var k=X.kn();
    return A.head('الحصالة','نجوم '+esc(k)+': '+X.g('يجمعها ثم يستبدلها','تجمعها ثم تستبدلها')+' بهدية أو نشاط مفضل.',false)+bankBody();}});
  X.secOpen.bank=function(){toTab('bank');};
  X.on('xbankpick',function(b,d){var x=A.libGet('rew',d('id'));if(!x)return;var bal=A.tokBal(),c=x.cost||5;A.setTarget(x.id);
    if(bal>=c){A.openRedeem();return;}A.say(x.id);A.toast('صار '+X.g('هدفه','هدفها')+': '+x.t+' · باقي '+stars(c-bal));A.redraw();});
  X.on('xbankgo',function(){A.openRedeem();});
  X.on('xbankplus',function(){A.earn(1);A.toast('نجمة جديدة ل'+X.kn());A.redraw();});
  X.on('xbankminus',function(){if(!A.unearn())A.toast('لا توجد نجوم');A.redraw();});
  function bankBanner(){var bal=A.tokBal(),r=A.target(),c=r?(r.cost||5):0;
    return '<button class="card bankban" data-act="xsec" data-id="bank"><span class="jarmini">'+I('piggy')+'</span><span class="grow"><b>الحصالة · '+stars(bal)+'</b><br><span class="muted">'+(r?(bal>=c?'اكتملت نجوم «'+esc(r.t)+'»!':'الهدف: '+esc(r.t)+' · باقي '+stars(c-bal)):'استبدل النجوم بهدية أو نشاط مفضل')+'</span></span>'+I('left')+'</button>';}
  /* a one-time note about the new sections, so nobody has to hunt for them */
  var NEWV='n3';
  X.inject('todayTop',function(){var st=A.S().set;if(st.seenNew===NEWV||st.lock)return '';
    var items=[['games','الأنشطة النمائية · '+nAct(ACTS.length)],['bank','الحصالة'],['plans','الخطط'],['social','المتصفح']].filter(function(x){return A.hasTab(x[0]);});
    return '<div class="card newcard"><div class="row between"><h2>جديد في التطبيق</h2><button class="iconbtn" data-act="xnewok" aria-label="إخفاء هذه البطاقة">'+I('x')+'</button></div><p class="muted">أقسام جديدة مستقلة في الشريط السفلي، والأنشطة النمائية داخل «أنشطة». اضغط أي واحد لتفتحه:</p><div class="row fwrap">'+items.map(function(x){return '<button class="pill" data-act="xnewgo" data-id="'+x[0]+'">'+esc(x[1])+'</button>';}).join('')+'</div></div>';});
  X.on('xnewok',function(){A.S().set.seenNew=NEWV;A.saveLocal();A.redraw();});
  X.on('xnewgo',function(b,d){var id=d('id');if(id==='games'){GM.v='lib';LB.dom='';LB.sense='';LB.q='';}A.go(id);});
  X.inject('todayTop',bankBanner);

  /* =================== 3. adding the schedule to the device calendar (standalone copy) =================== */
  function icsEsc(s){return String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');}
  function icsFold(line){var enc=new TextEncoder(),out='',cur='',n=0;for(var i=0;i<line.length;i++){var ch=line.charAt(i),b=enc.encode(ch).length;if(n+b>73){out+=cur+'\r\n ';cur='';n=1;}cur+=ch;n+=b;}return out+cur;}
  function icsDT(d,hm,add){var p=hm.split(':'),x=new Date(d+'T00:00:00');x.setHours(+p[0],(+p[1])+(add||0),0,0);return x.getFullYear()+A.pad(x.getMonth()+1)+A.pad(x.getDate())+'T'+A.pad(x.getHours())+A.pad(x.getMinutes())+'00';}
  function buildIcs(nDays,rep){var now=new Date(),stamp=now.getUTCFullYear()+A.pad(now.getUTCMonth()+1)+A.pad(now.getUTCDate())+'T'+A.pad(now.getUTCHours())+A.pad(now.getUTCMinutes())+'00Z',k=X.kn(),n=0;
    var Lx=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Rihla//AR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:'+icsEsc('جدول '+k)];
    for(var i=0;i<nDays;i++){var d=A.addDays(A.today(),i);A.todayItems(d).forEach(function(it){if(!it.at)return;n++;
      Lx.push('BEGIN:VEVENT','UID:'+(rep?'w'+new Date(d+'T12:00:00').getDay():d)+'-'+it.id+'@rihla','DTSTAMP:'+stamp,'DTSTART:'+icsDT(d,it.at),'DTEND:'+icsDT(d,it.at,it.min||15));if(rep)Lx.push('RRULE:FREQ=WEEKLY');Lx.push('SUMMARY:'+icsEsc('⏰ '+it.a.t+' · '+k),
        'DESCRIPTION:'+icsEsc('من جدول '+k+' في رحلة. افتح التطبيق لترى صورة النشاط.'),'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+icsEsc('حان وقت: '+it.a.t),'TRIGGER:PT0M','END:VALARM','END:VEVENT');});}
    Lx.push('END:VCALENDAR');return {ics:Lx.map(icsFold).join('\r\n')+'\r\n',n:n};}
  X.on('xcal',function(b,d){var rep=d('rep')==='1',nd=rep?7:(+d('n')||1),o=buildIcs(nd,rep);if(!o.n){A.toast('لا توجد أنشطة لها وقت في الجدول. حدّد أوقاتها من «الجدول اليومي والأسبوعي».',1);return;}
    X.download('جدول-'+X.kn()+'-'+(rep?'أسبوعي':A.today())+'.ics',o.ics,'text/calendar');A.toast('اختر «حفظ في الملفات»، ثم افتح الملف واضغط «إضافة الكل» · '+ar(o.n)+' تنبيهاً'+(rep?' تتكرر كل أسبوع':''),1);});
  X.inject('orgTop',function(){
    if(!window.__STANDALONE)return '';
    return '<div class="card"><h2>التنبيه والتطبيق مقفل</h2><p class="muted">أضف الجدول لتقويم الجهاز مرة واحدة، فيصل تنبيه عند موعد كل نشاط حتى والتطبيق مقفل، ويتكرر كل أسبوع.</p><button class="btn ghost" data-act="xcal" data-rep="1">'+I('calendar')+' أضف الجدول الأسبوعي للتقويم</button><div class="row"><button class="btn small line grow" data-act="xcal" data-n="1">اليوم فقط</button><button class="btn small line grow" data-act="xcal" data-n="7">٧ أيام فقط</button></div><p class="muted">نصيحة: أنشئ في تطبيق التقويم تقويماً باسم «جدول '+esc(X.kn())+'» وأضف الأحداث إليه. إذا غيّرت الجدول لاحقاً احذف ذلك التقويم وأضفه من جديد.</p></div>';});

  /* =================== 4. الخطط: yearly → monthly → weekly, one password per person =================== */
  var PROLE={admin:'المدير',spec:'أخصائي',parent:'ولي أمر',teacher:'معلم',other:'آخر'};
  var PRH=[['fp','جسدي كامل'],['pp','جسدي جزئي'],['m','نمذجة'],['g','إشارة'],['vs','بصري'],['v','لفظي'],['i','مستقل']],PRL={};PRH.forEach(function(p,i){PRL[p[0]]={t:p[1],i:i};});
  var PDOM=[['tkh','التخاطب والتواصل','--brand-ink'],['ijt','الاجتماعي واللعب','--good-ink'],['mhr','المهارات والاستقلالية','--tang'],['aka','الأكاديمي والمعرفي','--grape'],['hrk','الحركي','--sea'],['hss','الحسي','--sun-ink'],['slk','السلوك','--bad-ink']],PDM={};PDOM.forEach(function(d){PDM[d[0]]=d;});
  var TPL={tkh:['يطلب ما يريده بكلمة أو صورة','يسمّي ٢٠ صورة مألوفة','ينفذ أمراً من خطوتين'],ijt:['يلتفت عند سماع اسمه','ينتظر دوره في لعبة مع شخص','يحيّي الآخرين بالكلمة أو الإشارة'],
    mhr:['يغسل يديه بالخطوات','يلبس ملابسه وحده','يأكل بالملعقة وحده'],aka:['يطابق الألوان والأشكال','يعدّ حتى ١٠ بالمطابقة','يتعرف على الحروف الهجائية'],
    hrk:['يمسك القلم بالقبضة الصحيحة','يقفز بالقدمين معاً','يرمي الكرة ويلتقطها'],hss:['يتقبّل لمس ملامس مختلفة','يجلس على الكرسي ١٠ دقائق','يتحمل الأصوات العالية بهدوء'],slk:['يطلب استراحة بدل الانفعال','يتبع الجدول المصوّر','يتقبّل كلمة «لا» بهدوء']};
  var DOM2LIB={tkh:['cp','kn'],ijt:['at','ef'],mhr:['ap'],aka:['fr','qr','vs','wm'],hrk:['pe'],hss:['pe'],slk:['ef','co']};
  var MON=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  var ITER=120000,IDLE=15*60000,WHO=null,PS={lv:'w',mo:'',wk:''},PG={who:'',pin:'',err:'',busy:false,nm:null},PP={reset:''},LG={g:'',tr:[]},PE={id:'',lv:'',up:'',del:false};
  function curMo(){return A.today().slice(0,7);}
  function addMo(mo,n){var y=+mo.slice(0,4),m=+mo.slice(5,7)-1+n;y+=Math.floor(m/12);m=((m%12)+12)%12;return y+'-'+A.pad(m+1);}
  function moLabel(mo){return MON[+mo.slice(5,7)-1]+' '+ar(mo.slice(0,4));}
  function wkStart(d){var x=new Date(d+'T00:00:00');x.setDate(x.getDate()-x.getDay());return X.dstr(x.getTime());}
  function wkLabel(wk){var e=A.addDays(wk,6),f=function(d){return ar(+d.slice(8,10))+' '+MON[+d.slice(5,7)-1];};return 'أسبوع '+f(wk)+' – '+f(e);}
  function weeksOf(mo){var out=[],d=mo+'-01';while(new Date(d+'T00:00:00').getDay()!==0)d=A.addDays(d,1);while(d.slice(0,7)===mo){out.push(d);d=A.addDays(d,7);}return out;}
  function monthsRange(g){var f=g.from||curMo(),n=g.months||12;return moLabel(f)+' – '+moLabel(addMo(f,n-1));}
  function newId(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
  function people(all){return X.rcol('ppl').list(function(p){return all||p.on!==false;}).sort(function(a,b){return (a.c||0)-(b.c||0);});}
  function admins(){return people().filter(function(p){return p.role==='admin';});}
  function b64(buf){var s='',u=new Uint8Array(buf);for(var i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s);}
  function newSalt(){var u=new Uint8Array(16);crypto.getRandomValues(u);return b64(u.buffer);}
  function hashPin(pin,salt,it){var enc=new TextEncoder(),sb=Uint8Array.from(atob(salt),function(c){return c.charCodeAt(0);});
    return crypto.subtle.importKey('raw',enc.encode(pin),'PBKDF2',false,['deriveBits']).then(function(key){return crypto.subtle.deriveBits({name:'PBKDF2',salt:sb,iterations:it,hash:'SHA-256'},key,256);}).then(b64);}
  function hasCrypto(){return !!(window.crypto&&crypto.subtle&&window.TextEncoder);}
  function pinOk(p){return /^\d{4,8}$/.test(p);}
  function savePerson(id,base,pin){var s=newSalt();return hashPin(pin,s,ITER).then(function(hh){var doc=Object.assign({},base,{s:s,h:hh,it:ITER});delete doc.id;return X.rcol('ppl').put(id,doc);});}
  function lockSt(){try{return JSON.parse(localStorage.getItem('px:plock')||'{}')||{};}catch(e){return {};}}
  function setLockSt(o){try{localStorage.setItem('px:plock',JSON.stringify(o));}catch(e){}}
  function unlocked(){return WHO&&WHO.until>Date.now();}
  function touchWho(){if(WHO)WHO.until=Date.now()+IDLE;}
  function canPlan(){return unlocked()&&A.canEdit()&&(WHO.role==='admin'||WHO.role==='spec');}
  function canLog(){return unlocked()&&A.canEdit();}
  function goals(f){return X.col('pln').list(f).sort(function(a,b){return (a.mo||a.wk||a.from||'').localeCompare(b.mo||b.wk||b.from||'')||(a.c||0)-(b.c||0);});}
  function kidsOf(id){return X.col('pln').list(function(g){return g.up===id;});}
  function desc(id,seen){seen=seen||{};if(seen[id])return [];seen[id]=1;var out=[id];kidsOf(id).forEach(function(k){out=out.concat(desc(k.id,seen));});return out;}
  function logsFor(g){var ids=g.lv==='w'?[g.id]:desc(g.id);return X.col('plog').list(function(l){return ids.indexOf(l.g)>=0;}).sort(function(a,b){return (a.ts||0)-(b.ts||0);});}
  function prog(g){var Lg=logsFor(g),n=(g.crit&&g.crit.n)||3,p=(g.crit&&g.crit.p)||80,last=Lg.slice(-n),avg=last.length?Math.round(last.reduce(function(s,l){return s+(l.pi||0);},0)/last.length):null;
    return {n:Lg.length,avg:avg,met:last.length>=n&&last.every(function(l){return (l.pi||0)>=p;}),last:Lg.slice(-8)};}
  function spark(list){if(!list.length)return '';return '<div class="spark" aria-hidden="true">'+list.map(function(l){var v=Math.max(4,l.pi||0);return '<i style="height:'+v+'%" title="'+ar(l.pi||0)+'٪"></i>';}).join('')+'</div>';}
  function suggestActs(dom,n){var ds=DOM2LIB[dom]||['fr'],out=[];ds.forEach(function(ld){var b=bandFor(ld);ACTS.forEach(function(a){if(a.dom===ld&&a.band===b)out.push(a.id);});});return out.slice(0,n||3);}
  function goalCard(g){var d=PDM[g.dom]||PDOM[0],pr=prog(g),can=canPlan(),ch=kidsOf(g.id).length;
    var meta=g.lv==='y'?monthsRange(g):g.lv==='m'?moLabel(g.mo||curMo()):wkLabel(g.wk||wkStart(A.today()));
    return '<div class="card plc" style="--hc:var('+d[2]+')"><div class="row between"><span class="chip dom">'+esc(d[1])+'</span>'+(g.st==='mast'||pr.met?X.chip(I('check')+' تحقق','good'):g.st==='hold'?X.chip('متوقف','warn'):'')+'</div>'+
      '<b class="plt">'+esc(g.t)+'</b><p class="muted">'+esc(meta)+' · المعيار '+ar((g.crit&&g.crit.p)||80)+'٪ في '+cw((g.crit&&g.crit.n)||3,'جلسة واحدة','جلستين','جلسات','جلسة')+(g.pr&&PRL[g.pr]?' · التلقين: '+esc(PRL[g.pr].t):'')+(g.lv==='y'&&g.base>0?' · البداية '+ar(g.base)+'٪':'')+(g.lv==='w'&&g.freq?' · '+cw(g.freq,'جلسة واحدة','جلستان','جلسات','جلسة')+' أسبوعياً':'')+'</p>'+
      '<div class="pbar"><i style="width:'+(pr.avg||0)+'%"></i></div><p class="muted">'+(pr.n?'الاستقلالية الآن '+ar(pr.avg)+'٪ · '+cw(pr.n,'جلسة واحدة مسجّلة','جلستان مسجّلتان','جلسات مسجّلة','جلسة مسجّلة'):'لا تسجيل بعد')+'</p>'+spark(pr.last)+
      (g.lv==='w'&&g.acts&&g.acts.length?'<p class="eyebrow">أنشطة مقترحة من المكتبة</p><div class="row fwrap">'+g.acts.map(function(id){var a=actById(id);return a?'<button class="pill" data-act="xalopen" data-id="'+id+'">'+esc(a.t)+'</button>':'';}).join('')+'</div>':'')+
      (g.note?'<p class="muted">'+esc(g.note)+'</p>':'')+'<div class="row fwrap">'+
      (canLog()?'<button class="btn small" data-act="xplog" data-id="'+g.id+'">'+I('pulse')+' سجّل جلسة</button>':'')+
      (can&&g.lv!=='w'?'<button class="btn small ghost" data-act="xpgen" data-id="'+g.id+'">'+I('calendar')+' '+(g.lv==='y'?(ch?'أكمل الأشهر':'ولّد الأشهر'):(ch?'أكمل الأسابيع':'ولّد الأسابيع'))+'</button>':'')+
      (can?'<button class="btn small line" data-act="xpedit" data-id="'+g.id+'">'+I('edit')+' تعديل</button>':'')+'</div></div>';}

  /* the gate: who is opening the plans, and their password. Only the app's owner creates the first (manager) password. */
  var plFresh=0;
  function isOwner(){return !!(window.__STANDALONE||A.ROLE.owner);}
  function gateBody(){var k=X.kn(),h='';
    if(!hasCrypto())return X.empty('هذا المتصفح لا يدعم الحماية بكلمة مرور.','افتح التطبيق في متصفح أحدث.');
    var ad=admins(),ls=lockSt(),wait=ls.until&&ls.until>Date.now()?Math.ceil((ls.until-Date.now())/1000):0;
    if(!ad.length){
      if(!isOwner())return X.empty('قسم الخطط لم يُفعَّل بعد.','يفعّله صاحب التطبيق بإعداد كلمة مروره، ثم يعطي كل شخص كلمة مرور خاصة.');
      return '<div class="card"><h2>'+I('key')+' كلمة مرور المدير</h2><p class="muted">أنت المدير. أنشئ كلمة مرورك الآن، ثم أضف الأم والأخصائيين وأعطِ كل شخص كلمة مرور خاصة به. لا أحد غيرك يستطيع إنشاء كلمات المرور أو تغييرها.</p>'+
        X.field('اسمك',X.input('data-xpf="nm"',PG.nm!=null?PG.nm:(X.me.id&&X.me.id!=='local'&&X.nm(X.me.id)?X.nm(X.me.id):''),'text','مثل: أبو '+k))+X.field('كلمة المرور (٤–٨ أرقام)',X.input('data-xpf="p1" inputmode="numeric" autocomplete="new-password"','','password'))+X.field('أعد كتابتها',X.input('data-xpf="p2" inputmode="numeric" autocomplete="new-password"','','password'))+
        (PG.err?'<p class="bad">'+esc(PG.err)+'</p>':'')+'<button class="btn big" data-act="xpsetup"'+(PG.busy?' disabled':'')+'>'+I('lock')+' أنشئ كلمة المرور</button></div>'+
        '<div class="tip">كلمات المرور لا تُحفظ كما هي: يُحفظ منها رمز مشفّر فقط. وهي قفل للخصوصية داخل التطبيق، فاختر أرقاماً لا يعرفها غيرك.</div>';}
    if(!PG.who)return '<div class="card"><h2>'+I('lock')+' الخطط محمية</h2><p class="muted">اختر اسمك ثم أدخل كلمة مرورك.</p><div class="list">'+people().map(function(p){return '<button class="li" data-act="xpwho" data-id="'+p.id+'"><span class="nm"><b>'+esc(p.nm||'')+'</b><br><span class="muted">'+esc(PROLE[p.role]||'')+'</span></span>'+I('left')+'</button>';}).join('')+'</div><p class="muted">ما تجد اسمك؟ اطلب من المدير أن يضيفك ويعطيك كلمة مرور.</p></div>';
    var who=X.rcol('ppl').get(PG.who)||{},dots='';for(var i=0;i<Math.max(4,PG.pin.length);i++)dots+='<i class="'+(i<PG.pin.length?'on':'')+'"></i>';
    var keys=['1','2','3','4','5','6','7','8','9','del','0','ok'];
    h+='<div class="pinbox"><p class="pinwho"><b>'+esc(who.nm||'')+'</b> · '+esc(PROLE[who.role]||'')+'</p><div class="pindots" aria-label="'+ar(PG.pin.length)+' أرقام">'+dots+'</div>'+
      (wait?'<p class="bad">محاولات كثيرة. انتظر '+ar(wait)+' ثانية.</p>':PG.err?'<p class="bad">'+esc(PG.err)+'</p>':'<p class="muted">أدخل كلمة مرورك</p>')+
      '<div class="pinpad">'+keys.map(function(k2){return k2==='del'?'<button class="pk" data-act="xpinkey" data-k="del" aria-label="احذف">'+I('back')+'</button>':k2==='ok'?'<button class="pk ok" data-act="xpinkey" data-k="ok" aria-label="دخول"'+(PG.busy||wait?' disabled':'')+'>'+I('check')+'</button>':'<button class="pk" data-act="xpinkey" data-k="'+k2+'">'+ar(k2)+'</button>';}).join('')+'</div>'+
      '<button class="btn small line" data-act="xpwho" data-id="">تغيير الاسم</button></div>';
    return h;}
  function plansView(){var k=X.kn();
    return A.head('الخطط','السنوية والشهرية والأسبوعية ل'+esc(k)+'، مع تسجيل التقدّم ونوع التلقين. لكل شخص كلمة مرور.',false)+(unlocked()?plansBody():gateBody());}
  A.addTab('plans',{label:'الخطط',acc:'--brand-ink',before:'progress',icon:IC.plan,view:plansView});
  X.secOpen.plans=function(){toTab('plans');};
  X.onAfter('plans',function(){if(unlocked())touchWho();if(Date.now()-plFresh<30000)return;plFresh=Date.now();
    Promise.all([X.rcol('ppl'),X.col('pln'),X.col('plog'),X.col('iep')].map(function(s){return s.load().catch(function(){});})).then(function(){if(A.TAB()==='plans'&&!A.TOP()&&!typing())A.render();});});
  X.on('xpwho',function(b,d){PG.who=d('id');PG.pin='';PG.err='';A.redraw();});
  X.on('xpinkey',function(b,d){var k2=d('k'),ls=lockSt();if(ls.until&&ls.until>Date.now())return;
    if(k2==='del'){PG.pin=PG.pin.slice(0,-1);PG.err='';A.redraw();return;}
    if(k2!=='ok'){if(PG.pin.length<8){PG.pin+=k2;PG.err='';}A.redraw();return;}
    var p=X.rcol('ppl').get(PG.who);if(!p||!PG.pin||PG.busy)return;PG.busy=true;A.redraw();
    hashPin(PG.pin,p.s,p.it||ITER).then(function(hh){PG.busy=false;
      if(hh===p.h&&p.on!==false){setLockSt({});WHO={id:PG.who,nm:p.nm,role:p.role,until:Date.now()+IDLE};PG.pin='';PG.who='';A.redraw();return;}
      var n=(ls.n||0)+1;setLockSt(n>=5?{n:0,until:Date.now()+60000}:{n:n});PG.pin='';PG.err='كلمة المرور غير صحيحة';A.redraw();},
      function(){PG.busy=false;PG.err='تعذّر التحقق';A.redraw();});});
  X.on('xpsetup',function(){var nm=val('[data-xpf="nm"]'),p1=val('[data-xpf="p1"]'),p2=val('[data-xpf="p2"]');
    PG.nm=nm;if(!nm){PG.err='اكتب اسمك';A.redraw();return;}if(!pinOk(p1)){PG.err='كلمة المرور من ٤ إلى ٨ أرقام';A.redraw();return;}if(p1!==p2){PG.err='الكلمتان غير متطابقتين';A.redraw();return;}
    if(!isOwner()||admins().length)return;PG.busy=true;PG.err='';A.redraw();var id=newId('p');
    savePerson(id,{nm:nm,role:'admin',on:true,c:Date.now(),by:nm},p1).then(function(){PG.busy=false;WHO={id:id,nm:nm,role:'admin',until:Date.now()+IDLE};PG.nm=null;A.redraw();A.toast('تم. أضف الآن من تريد من «الأشخاص وكلمات المرور»');},
      function(e){PG.busy=false;A.saveErr(e);A.redraw();});});

  /* the plans themselves */
  function plansBody(){
    if(!PS.mo)PS.mo=curMo();if(!PS.wk)PS.wk=wkStart(A.today());
    var k=X.kn(),lv=PS.lv,h='',can=canPlan();
    h+='<div class="card who"><div class="row"><span class="grow">'+I('lock')+' أنت: <b>'+esc(WHO.nm)+'</b> · '+esc(PROLE[WHO.role]||'')+'</span><button class="btn small line" data-act="xplock">قفل</button></div>'+
      (WHO.role==='admin'?'<button class="btn small ghost" data-act="xppl">'+I('key')+' الأشخاص وكلمات المرور</button>':'')+'</div>';
    h+=X.seg('xplv',lv,[['y','السنوية'],['m','الشهرية'],['w','الأسبوعية']]);
    if(lv==='y'){var ys=goals(function(g){return g.lv==='y';});
      h+='<p class="muted">الأهداف الكبيرة لسنة '+esc(k)+'. كل هدف يتوزع على الأشهر، وكل شهر على الأسابيع، مع تخفيف التلقين تدريجياً حتى الاستقلال.</p>';
      h+=ys.length?ys.map(goalCard).join(''):X.empty('لا توجد أهداف سنوية بعد.',can?'ابدأ من أهداف الخطة الفردية، أو من القوالب الجاهزة، أو أضف هدفاً بنفسك.':'يضيفها المدير أو الأخصائي.');
      if(can)h+='<div class="row fwrap"><button class="btn ghost" data-act="xpfromiep">'+I('target')+' من الخطة الفردية</button><button class="btn ghost" data-act="xptpl">'+I('layers')+' من القوالب</button><button class="btn line" data-act="xpnew" data-lv="y">'+I('plus')+' هدف سنوي</button></div>';}
    else if(lv==='m'){var ms=goals(function(g){return g.lv==='m'&&g.mo===PS.mo;});
      h+='<div class="navrow"><button class="iconbtn" data-act="xpmo" data-d="-1" aria-label="الشهر السابق">'+I('right')+'</button><b>'+esc(moLabel(PS.mo))+'</b><button class="iconbtn" data-act="xpmo" data-d="1" aria-label="الشهر التالي">'+I('left')+'</button></div>';
      h+=ms.length?ms.map(goalCard).join(''):X.empty('لا أهداف لهذا الشهر.',can?'افتح «السنوية» واضغط «ولّد الأشهر» على أي هدف، أو أضف هدفاً شهرياً.':'');
      if(can)h+='<button class="btn line" data-act="xpnew" data-lv="m">'+I('plus')+' هدف شهري</button>';}
    else{var ws=goals(function(g){return g.lv==='w'&&g.wk===PS.wk;});
      h+='<div class="navrow"><button class="iconbtn" data-act="xpwk" data-d="-7" aria-label="الأسبوع السابق">'+I('right')+'</button><b>'+esc(wkLabel(PS.wk))+'</b><button class="iconbtn" data-act="xpwk" data-d="7" aria-label="الأسبوع التالي">'+I('left')+'</button></div>';
      h+=ws.length?ws.map(goalCard).join(''):X.empty('لا أهداف لهذا الأسبوع.',can?'افتح «الشهرية» واضغط «ولّد الأسابيع»، أو أضف هدفاً أسبوعياً.':'');
      if(can)h+='<button class="btn line" data-act="xpnew" data-lv="w">'+I('plus')+' هدف أسبوعي</button>';}
    return h;}
  X.on('xplv',function(b,d){touchWho();PS.lv=d('v');A.redraw();});
  X.on('xpmo',function(b,d){touchWho();PS.mo=addMo(PS.mo,+d('d'));A.redraw();});
  X.on('xpwk',function(b,d){touchWho();PS.wk=A.addDays(PS.wk,+d('d'));A.redraw();});
  X.on('xplock',function(){WHO=null;PG.pin='';PG.err='';PG.who='';A.redraw();A.toast('تم قفل الخطط');});

  /* generating months from a yearly goal, and weeks from a monthly one */
  function genMonths(y){var n=y.months||12,from=y.from||curMo(),have={},base=Math.max(+y.base||0,Math.min(20,(y.crit&&y.crit.p)||80)),p=(y.crit&&y.crit.p)||80,sp=PRL[y.sp||'pp'].i,iI=PRL.i.i,jobs=[];
    kidsOf(y.id).forEach(function(c){have[c.mo]=1;});
    for(var i=0;i<n;i++){var mo=addMo(from,i);if(have[mo])continue;var f=(i+1)/n,pm=Math.min(100,Math.round((base+(p-base)*f)/5)*5),li=Math.min(iI,Math.round(sp+(iI-sp)*Math.min(1,f*1.15)));
      jobs.push(X.col('pln').put(newId('m'),{lv:'m',up:y.id,dom:y.dom,mo:mo,t:y.t,crit:{p:pm,n:(y.crit&&y.crit.n)||3},pr:PRH[li][0],st:'act',by:WHO.nm,c:Date.now()+i}));}
    return Promise.all(jobs).then(function(){return jobs.length;});}
  function liveWeeks(mo){var ws=weeksOf(mo),t=A.today(),f=ws.filter(function(w){return A.addDays(w,6)>=t;});return f.length?f:ws;}
  function genWeeks(m){var ws=liveWeeks(m.mo||curMo()),have={},p=(m.crit&&m.crit.p)||80,K=ws.length,jobs=[],acts=suggestActs(m.dom,4);
    kidsOf(m.id).forEach(function(c){have[c.wk]=1;});
    var y=X.col('pln').get(m.up),prev=X.col('pln').list(function(g){return g.lv==='m'&&g.up===m.up&&g.mo===addMo(m.mo,-1);})[0],pp=prev?((prev.crit&&prev.crit.p)||p):Math.max((y&&y.base!=null?+y.base||0:p-20),Math.min(20,p));
    ws.forEach(function(wk,k2){if(have[wk])return;var probe=k2===K-1,pk=Math.min(100,Math.round((pp+(p-pp)*(k2+1)/K)/5)*5);
      jobs.push(X.col('pln').put(newId('w'),{lv:'w',up:m.id,dom:m.dom,wk:wk,t:m.t+(probe?' · أسبوع تقييم':' · أسبوع تدريب '+ar(k2+1)),crit:{p:pk,n:probe?2:3},pr:m.pr,freq:3,acts:acts.length?[acts[k2%acts.length],acts[(k2+1)%acts.length]].filter(function(v,i,a){return a.indexOf(v)===i;}):[],st:'act',by:WHO.nm,c:Date.now()+k2}));});
    return Promise.all(jobs).then(function(){return jobs.length;});}
  X.on('xpgen',function(b,d){if(!canPlan())return;touchWho();var g=X.col('pln').get(d('id'));if(!g)return;g=Object.assign({id:d('id')},g);
    (g.lv==='y'?genMonths(g):genWeeks(g)).then(function(n){A.toast(n?'تم توليد '+(g.lv==='y'?cw(n,'شهر واحد','شهرين','أشهر','شهراً'):cw(n,'أسبوع واحد','أسبوعين','أسابيع','أسبوعاً')):'كلها موجودة');if(n){if(g.lv==='y'){PS.lv='m';PS.mo=g.from||curMo();}else{var lw=liveWeeks(g.mo),cwk=wkStart(A.today());PS.lv='w';PS.wk=lw.indexOf(cwk)>=0?cwk:(lw[0]||PS.wk);}}A.redraw();},A.saveErr);});
  X.on('xpfromiep',function(){if(!canPlan())return;touchWho();var have={};goals(function(g){return g.lv==='y'&&g.iep;}).forEach(function(g){have[g.iep]=1;});
    var src=X.col('iep').list(function(g){return g.st==='act'&&!have[g.id];});if(!src.length){A.toast('لا توجد أهداف نشطة جديدة في الخطة الفردية');return;}
    Promise.all(src.map(function(g,i){return X.col('pln').put(newId('y'),{lv:'y',iep:g.id,dom:PDM[g.dom]?g.dom:'tkh',t:g.t,base:g.base!=null?(+g.base||0):0,crit:{p:(g.crit&&g.crit.p)||80,n:(g.crit&&g.crit.n)||3},sp:'pp',pr:'i',from:curMo(),months:12,st:'act',by:WHO.nm,c:Date.now()+i});}))
      .then(function(){A.toast('أضيف '+ar(src.length)+' هدفاً سنوياً');A.redraw();},A.saveErr);});
  X.on('xptpl',function(){if(!canPlan())return;touchWho();X.open('ptpl',function(){return X.page('قوالب الأهداف','<p class="muted">اضغط «أضف» على أي هدف ليصير هدفاً سنوياً، ثم عدّل نصه ومعياره كما تريد.</p>'+PDOM.map(function(d){return '<div class="card" style="--hc:var('+d[2]+')"><h2>'+esc(d[1])+'</h2><div class="list">'+(TPL[d[0]]||[]).map(function(t,i){return '<div class="li"><span class="nm">'+esc(t)+'</span><button class="btn small" data-act="xptpladd" data-dom="'+d[0]+'" data-i="'+i+'">'+I('plus')+' أضف</button></div>';}).join('')+'</div></div>';}).join(''));});});
  X.on('xptpladd',function(b,d){if(!canPlan())return;var t=(TPL[d('dom')]||[])[+d('i')];if(!t)return;
    X.col('pln').put(newId('y'),{lv:'y',dom:d('dom'),t:t,base:0,crit:{p:80,n:3},sp:'pp',pr:'i',from:curMo(),months:12,st:'act',by:WHO.nm,c:Date.now()}).then(function(){A.toast('أضيف: '+t);},A.saveErr);});

  /* editing a goal */
  X.on('xpnew',function(b,d){if(!canPlan())return;touchWho();PE={id:'',lv:d('lv'),up:'',del:false};X.open('pledit',drawEdit);});
  X.on('xpedit',function(b,d){if(!canPlan())return;touchWho();var g=X.col('pln').get(d('id'));if(!g)return;PE={id:d('id'),lv:g.lv,up:g.up||'',del:false};X.open('pledit',drawEdit);});
  function opt(list,cur){return list.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===cur?' selected':'')+'>'+esc(o[1])+'</option>';}).join('');}
  function drawEdit(){var g=PE.id?(X.col('pln').get(PE.id)||{}):{lv:PE.lv,dom:'tkh',crit:{p:80,n:3},pr:PE.lv==='y'?'i':'pp',sp:'pp',from:curMo(),months:12,base:0,mo:PS.mo,wk:PS.wk,freq:3,st:'act'},lv=g.lv||PE.lv,h='';
    var ups=lv==='m'?goals(function(x){return x.lv==='y';}):lv==='w'?goals(function(x){return x.lv==='m';}):[];
    h+=X.field('الهدف',X.area('data-xpe="t" rows="3"',g.t||'','مثل: يطلب ما يريده بكلمة أو صورة'));
    h+=X.field('المجال','<select data-xpe="dom">'+opt(PDOM,g.dom)+'</select>');
    if(ups.length)h+=X.field(lv==='m'?'تابع للهدف السنوي':'تابع للهدف الشهري','<select data-xpe="up"><option value="">— بدون —</option>'+ups.map(function(u){return '<option value="'+u.id+'"'+(u.id===(g.up||PE.up)?' selected':'')+'>'+esc(u.t)+(u.mo?' · '+esc(moLabel(u.mo)):'')+'</option>';}).join('')+'</select>');
    if(lv==='y')h+='<div class="grid two">'+X.field('يبدأ من شهر',X.input('data-xpe="from"',g.from||curMo(),'month'))+X.field('عدد الأشهر',X.input('data-xpe="months" inputmode="numeric" min="1" max="24"',g.months||12,'number'))+X.field('الخط القاعدي ٪',X.input('data-xpe="base" inputmode="numeric" min="0" max="100"',g.base||0,'number'))+X.field('تلقين البداية','<select data-xpe="sp">'+opt(PRH,g.sp||'pp')+'</select>')+'</div>';
    if(lv==='m')h+=X.field('الشهر',X.input('data-xpe="mo"',g.mo||PS.mo,'month'));
    if(lv==='w')h+='<div class="grid two">'+X.field('أي يوم من الأسبوع',X.input('data-xpe="wk"',g.wk||PS.wk,'date'))+X.field('جلسات في الأسبوع',X.input('data-xpe="freq" inputmode="numeric" min="1" max="14"',g.freq||3,'number'))+'</div>';
    h+='<div class="grid two">'+X.field('المعيار ٪',X.input('data-xpe="p" inputmode="numeric" min="10" max="100"',(g.crit&&g.crit.p)||80,'number'))+X.field('في عدد جلسات',X.input('data-xpe="n" inputmode="numeric" min="1" max="10"',(g.crit&&g.crit.n)||3,'number'))+'</div>';
    h+=X.field('مستوى التلقين المستهدف','<select data-xpe="pr">'+opt(PRH,g.pr||'i')+'</select>');
    h+=X.field('الحالة','<select data-xpe="st">'+opt([['act','نشط'],['mast','تحقق'],['hold','متوقف']],g.st||'act')+'</select>');
    h+=X.field('ملاحظات',X.area('data-xpe="note" rows="2"',g.note||''));
    h+='<button class="btn big" data-act="xpesave">'+I('check')+' احفظ</button>';
    if(PE.id)h+=PE.del?'<div class="tip"><b>يحذف الهدف وكل ما تحته من أشهر وأسابيع وتسجيلاتها.</b><div class="row"><button class="btn small" data-act="xpedel" data-go="1">نعم، احذف</button><button class="btn small line" data-act="xpedel" data-go="0">إلغاء</button></div></div>':'<button class="btn line" data-act="xpedel">'+I('trash')+' احذف الهدف</button>';
    return X.page(PE.id?'تعديل الهدف':(lv==='y'?'هدف سنوي جديد':lv==='m'?'هدف شهري جديد':'هدف أسبوعي جديد'),h);}
  X.on('xpesave',function(){if(!canPlan())return;touchWho();var t=val('[data-xpe="t"]');if(!t){A.toast('اكتب نص الهدف',1);return;}
    var cur=PE.id?(X.col('pln').get(PE.id)||{}):{lv:PE.lv,c:Date.now(),by:WHO.nm},g=Object.assign({},cur),num=function(s,mn,mx,df){var v=parseInt(val(s),10);return isNaN(v)?df:Math.max(mn,Math.min(mx,v));};
    g.t=t;g.dom=val('[data-xpe="dom"]')||'tkh';if(q('[data-xpe="up"]'))g.up=val('[data-xpe="up"]')||null;
    g.crit={p:num('[data-xpe="p"]',10,100,80),n:num('[data-xpe="n"]',1,10,3)};g.pr=val('[data-xpe="pr"]')||'i';g.st=val('[data-xpe="st"]')||'act';g.note=val('[data-xpe="note"]')||null;
    if(g.lv==='y'){g.from=(val('[data-xpe="from"]')||curMo()).slice(0,7);g.months=num('[data-xpe="months"]',1,24,12);g.base=num('[data-xpe="base"]',0,100,0);g.sp=val('[data-xpe="sp"]')||'pp';}
    if(g.lv==='m')g.mo=(val('[data-xpe="mo"]')||PS.mo).slice(0,7);
    if(g.lv==='w'){g.wk=wkStart(val('[data-xpe="wk"]')||PS.wk);g.freq=num('[data-xpe="freq"]',1,14,3);}
    if(!g.up)delete g.up;if(!g.note)delete g.note;g.ed=WHO.nm;
    X.col('pln').put(PE.id||newId(g.lv),g).then(function(){A.closeOv();if(g.lv==='m')PS.mo=g.mo;if(g.lv==='w')PS.wk=g.wk;PS.lv=g.lv;A.toast('تم الحفظ');A.redraw();},A.saveErr);});
  X.on('xpedel',function(b,d){if(!canPlan()||!PE.id)return;var go=d('go');if(go===null||go===undefined||go===''){PE.del=true;A.redraw();return;}if(go!=='1'){PE.del=false;A.redraw();return;}
    var ids=desc(PE.id),logs=X.col('plog').list(function(l){return ids.indexOf(l.g)>=0;});
    Promise.all(ids.map(function(id){return X.col('pln').del(id);}).concat(logs.map(function(l){return X.col('plog').del(l.id);}))).then(function(){A.closeOv();A.toast('حُذف');A.redraw();},A.saveErr);});

  /* recording a session: each trial with its prompt type */
  X.on('xplog',function(b,d){if(!canLog())return;touchWho();LG={g:d('id'),tr:[]};X.open('plg',drawLog);});
  function drawLog(){var g=X.col('pln').get(LG.g);if(!g)return X.page('تسجيل','');var tr=LG.tr,n=tr.length,ind=tr.filter(function(x){return x==='i';}).length,ok=tr.filter(function(x){return x!=='x';}).length,h='';
    h+='<div class="card"><b>'+esc(g.t)+'</b><p class="muted">المعيار '+ar((g.crit&&g.crit.p)||80)+'٪'+(g.pr&&PRL[g.pr]?' · التلقين المستهدف: '+esc(PRL[g.pr].t):'')+'</p></div>';
    h+='<p class="eyebrow">سجّل كل محاولة بنوع التلقين الذي احتاجه</p><div class="prgrid">'+PRH.slice().reverse().map(function(p){return '<button class="btn pr pr-'+p[0]+'" data-act="xpltr" data-k="'+p[0]+'">'+(p[0]==='i'?I('check')+' ':'')+esc(p[1])+'</button>';}).join('')+'<button class="btn pr pr-x" data-act="xpltr" data-k="x">'+I('x')+' خطأ أو لا استجابة</button></div>';
    h+='<div class="card"><div class="trs">'+(n?tr.map(function(x){return '<span class="tr tr-'+x+'">'+esc(x==='x'?'✗':PRL[x].t)+'</span>';}).join(''):'<span class="muted">لا محاولات بعد</span>')+'</div>'+
      (n?'<p>المحاولات '+ar(n)+' · مستقل <b>'+ar(Math.round(100*ind/n))+'٪</b> · صحيح مع التلقين '+ar(Math.round(100*ok/n))+'٪</p><button class="btn small line" data-act="xpltr" data-k="undo">'+I('reset')+' تراجع عن آخر محاولة</button>':'')+'</div>';
    h+=X.field('ملاحظة',X.area('data-xplg="n" rows="2"','','ما الذي ساعد؟ ما الذي صعّب؟'));
    h+='<button class="btn big" data-act="xplsave"'+(n?'':' disabled')+'>'+I('check')+' احفظ الجلسة</button>';
    var past=X.col('plog').list(function(l){return l.g===LG.g;}).sort(function(a,b){return (b.ts||0)-(a.ts||0);}).slice(0,6);
    if(past.length)h+='<div class="card"><h2>آخر الجلسات</h2><div class="list">'+past.map(function(l){return '<div class="li"><span class="muted" style="flex:none">'+esc(X.dateTxt(l.d,true))+'</span><span class="nm">مستقل '+ar(l.pi||0)+'٪'+(l.pr&&PRL[l.pr]?' · '+esc(PRL[l.pr].t):'')+'</span><span class="muted">'+esc(l.by||'')+'</span></div>';}).join('')+'</div></div>';
    return X.page('تسجيل جلسة',h);}
  X.on('xpltr',function(b,d){touchWho();var k2=d('k');if(k2==='undo')LG.tr.pop();else if(LG.tr.length<40)LG.tr.push(k2);A.redraw();});
  X.on('xplsave',function(){if(!canLog()||!LG.tr.length)return;touchWho();var tr=LG.tr.slice(),n=tr.length,cnt={};tr.forEach(function(x){if(x!=='i'&&x!=='x')cnt[x]=(cnt[x]||0)+1;});
    var dom=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a];})[0]||(tr.indexOf('i')>=0?'i':'');
    var doc={g:LG.g,d:A.today(),tr:tr,pi:Math.round(100*tr.filter(function(x){return x==='i';}).length/n),pc:Math.round(100*tr.filter(function(x){return x!=='x';}).length/n),pr:dom,by:WHO.nm,pid:WHO.id,ts:Date.now()};
    var note=val('[data-xplg="n"]');if(note)doc.n=note;
    X.col('plog').put(newId('l'),doc).then(function(){A.closeOv();A.toast('حُفظت الجلسة · مستقل '+ar(doc.pi)+'٪');A.redraw();},A.saveErr);});

  /* people and passwords: only the admin adds people and sets or resets their passwords */
  X.on('xppl',function(){if(!unlocked()||WHO.role!=='admin')return;touchWho();PP={reset:'',err:''};X.open('ppl',drawPeople);});
  function drawPeople(){if(!unlocked()||WHO.role!=='admin')return X.page('الأشخاص','');var h='<p class="muted">كل شخص له كلمة مرور خاصة تعطيها له أنت. لا أحد غيرك يرى هذه الصفحة أو يغيّر كلمات المرور.</p><div class="list">';
    h+=people(true).map(function(p){var me=p.id===WHO.id;return '<div class="li pli"><span class="nm"><b>'+esc(p.nm||'')+'</b>'+(me?' (أنت)':'')+'<br><span class="muted">'+esc(PROLE[p.role]||'')+(p.on===false?' · موقوف':'')+'</span></span>'+
      '<button class="btn small ghost" data-act="xpreset" data-id="'+p.id+'">'+I('key')+' كلمة مرور</button>'+(me?'':'<button class="btn small line" data-act="xptog" data-id="'+p.id+'">'+(p.on===false?'تفعيل':'إيقاف')+'</button>')+'</div>'+
      (PP.reset===p.id?'<div class="card">'+X.field('كلمة المرور الجديدة لـ'+esc(p.nm||''),X.input('data-xpr="p1" inputmode="numeric" autocomplete="new-password"','','password'))+X.field('أعد كتابتها',X.input('data-xpr="p2" inputmode="numeric" autocomplete="new-password"','','password'))+'<button class="btn small" data-act="xpresetok" data-id="'+p.id+'">'+I('check')+' احفظ</button></div>':'');}).join('')+'</div>';
    h+='<div class="card"><h2>'+I('plus')+' إضافة شخص</h2>'+X.field('الاسم',X.input('data-xpa="nm"','','text','مثل: أم '+X.kn()))+X.field('الدور','<select data-xpa="role">'+opt([['parent','ولي أمر'],['spec','أخصائي'],['teacher','معلم'],['admin','مدير'],['other','آخر']],'parent')+'</select>')+
      X.field('كلمة المرور (٤–٨ أرقام)',X.input('data-xpa="p1" inputmode="numeric" autocomplete="new-password"','','password'))+X.field('أعد كتابتها',X.input('data-xpa="p2" inputmode="numeric" autocomplete="new-password"','','password'))+
      (PP.err?'<p class="bad">'+esc(PP.err)+'</p>':'')+'<button class="btn" data-act="xpadd">'+I('check')+' أضف</button><p class="muted">الأخصائي والمدير يعدّلان الخطط ويولّدانها، وولي الأمر والمعلم يسجّلان الجلسات.</p></div>';
    return X.page('الأشخاص وكلمات المرور',h);}
  X.on('xpadd',function(){if(!unlocked()||WHO.role!=='admin')return;touchWho();var nm=val('[data-xpa="nm"]'),role=val('[data-xpa="role"]')||'parent',p1=val('[data-xpa="p1"]'),p2=val('[data-xpa="p2"]');
    if(!nm){PP.err='اكتب الاسم';A.redraw();return;}if(!pinOk(p1)){PP.err='كلمة المرور من ٤ إلى ٨ أرقام';A.redraw();return;}if(p1!==p2){PP.err='الكلمتان غير متطابقتين';A.redraw();return;}
    PP.err='';savePerson(newId('p'),{nm:nm,role:role,on:true,c:Date.now(),by:WHO.nm},p1).then(function(){A.toast('أضيف '+nm+'. أعطه كلمة المرور بنفسك.');A.redraw();},A.saveErr);});
  X.on('xpreset',function(b,d){touchWho();PP.reset=PP.reset===d('id')?'':d('id');A.redraw();});
  X.on('xpresetok',function(b,d){if(!unlocked()||WHO.role!=='admin')return;var p=X.rcol('ppl').get(d('id')),p1=val('[data-xpr="p1"]'),p2=val('[data-xpr="p2"]');if(!p)return;
    if(!pinOk(p1)){A.toast('كلمة المرور من ٤ إلى ٨ أرقام',1);return;}if(p1!==p2){A.toast('الكلمتان غير متطابقتين',1);return;}
    savePerson(d('id'),Object.assign({},p,{rs:WHO.nm}),p1).then(function(){PP.reset='';A.toast('تم تغيير كلمة المرور');A.redraw();},A.saveErr);});
  X.on('xptog',function(b,d){if(!unlocked()||WHO.role!=='admin')return;var p=X.rcol('ppl').get(d('id'));if(!p||d('id')===WHO.id)return;
    X.rcol('ppl').patch(d('id'),{on:p.on===false}).then(function(){A.redraw();},A.saveErr);});


  X.ticks.push(function(){if(WHO&&WHO.until<=Date.now()){WHO=null;var t=A.TOP();if(t&&/^x-(pledit|plg|ppl|ptpl)$/.test(t.type||''))A.closeOv();if(A.TAB()==='plans'&&!A.TOP())A.render();}});
};
})();
