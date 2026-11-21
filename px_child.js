/* px_child.js — the child's new sections, each built on NCAEP practices:
   emotions & calm with the «أبي راحة» break card (CBIS, FCT, EXM, MMI, SM, DR), social stories (SN),
   video modeling (VM), toilet training (PP, R, TA), and playing with others (PBII, SST, MD, NI). */
(function(){
'use strict';
window.PXF=window.PXF||{};
window.PXF.child=function(X){
  var A=X.A,esc=X.esc,ar=X.ar,I=X.I;
  X.need('xset');X.need('sto');X.need('vm');
  function cfg(id,def){return Object.assign({},def,X.col('xset').get(id)||{});}
  function setCfg(id,patch,msg){var cur=Object.assign({},X.col('xset').get(id)||{},patch);return X.save(X.col('xset').put(id,cur),msg);}
  X.cfg=cfg;X.setCfg=setCfg;
  function gt(s){return String(s||'').replace(/\{([^{}|]*)\|([^{}]*)\}/g,function(m,a,b){return X.g(a,b);}).replace(/\{اسم\}/g,X.kn());}
  X.gt=gt;
  function item(id,t,e){return {id:id,t:t,e:e,nb:A.OV()[id]&&A.OV()[id].nb?1:0};}

  /* ---------- default photos ---------- */
  var XIMG={xe_happy:'emo_happy',xe_sad:'emo_sad',xe_scared:'emo_scared',xe_angry:'emo_angry',xe_tired:'emo_tired',xe_surprised:'emo_surprised',xe_calm:'emo_calm',
    xc_break:'calm_break',xc_breathe:'calm_breathe',xc_count:'calm_count',xc_water:'water',xc_hug:'hug',xc_move:'move_jump',xc_quiet:'calm_quiet',xc_squeeze:'calm_squeeze',xc_music:'song',
    xm_jump:'move_jump',xm_push:'move_push',xm_bear:'move_bear',xm_stretch:'move_stretch',xm_march:'move_march',
    xi_clap:'imit_clap',xi_head:'imit_head',xi_wave:'bye',xi_jump:'move_jump',xi_stomp:'imit_stomp',xi_up:'move_stretch',
    xp_turn:'play_turn',xp_imit:'imit_clap',xp_ja:'play_ja',xp_song:'play_song',xt_toilet:'toilet'};
  var SIMG={doc:'st_doc',barber:'st_bar',trip:'st_trip',eid:'st_eid',school:'st_sch'};
  /* until the family records them: «أبي راحة» is spoken from the app clips «أبي» + «الراحة», and the toilet reminder from «الحمام» */
  if(A.PARTS){if(!A.PARTS.xc_break)A.PARTS.xc_break=['w_want','sa_rest'];if(!A.PARTS.xt_toilet)A.PARTS.xt_toilet=['sa_toilet'];if(!A.PARTS.xc_hug)A.PARTS.xc_hug=['r_hug'];}
  window.BIMG=window.BIMG||{};
  Object.keys(XIMG).forEach(function(k){if(!BIMG[k])BIMG[k]=XIMG[k];});
  Object.keys(SIMG).forEach(function(s){for(var i=1;i<=5;i++)if(!BIMG['xs_'+s+'_'+i])BIMG['xs_'+s+'_'+i]=SIMG[s]+'_'+i;});

  /* ---------- vocab ---------- */
  var FEEL=[['xe_happy','فرحان','فرحانة','😀'],['xe_sad','زعلان','زعلانة','😢'],['xe_scared','خايف','خايفة','😨'],['xe_angry','معصّب','معصّبة','😠'],['xe_tired','تعبان','تعبانة','🥱'],['xe_surprised','متفاجئ','متفاجئة','😮'],['xe_calm','هادي','هادية','😌']];
  var FEELBY={};FEEL.forEach(function(f){FEELBY[f[0]]=f;});
  var SCALE=[[1,'مرتاح','مرتاحة','sc1'],[2,'بخير','بخير','sc2'],[3,'متضايق','متضايقة','sc3'],[4,'زعلان مرة','زعلانة مرة','sc4'],[5,'معصّب جداً','معصّبة جداً','sc5']];
  var CALM=[['xc_break','أبي راحة','✋'],['xc_breathe','أتنفس ببطء','🌬️'],['xc_count','أعدّ للعشرة','🔢'],['xc_water','أشرب ميه','💧'],['xc_hug','حضن','🤗'],['xc_move','أتحرك شوي','🏃'],['xc_quiet','مكان هادي','🎧'],['xc_squeeze','أضغط الكرة','🔵'],['xc_music','أسمع أغنية','🎵']];
  var CALMBY={};CALM.forEach(function(c){CALMBY[c[0]]=c;});
  var MOVE=[['xm_jump','اقفز عشر مرات','اقفزي عشر مرات','🦘',20],['xm_push','ادفع الجدار بقوة','ادفعي الجدار بقوة','🧱',15],['xm_bear','امشِ مثل الدب','امشي مثل الدب','🐻',20],['xm_stretch','مدّ يديك لفوق','مدّي يديك لفوق','🙆',15],['xm_march','امشِ مثل الجندي','امشي مثل الجندي','🥁',20]];
  var MOVEBY={};MOVE.forEach(function(m){MOVEBY[m[0]]=m;});
  var IMIT=[['xi_clap','صفّق','صفّقي','👏'],['xi_head','المس راسك','المسي راسك','🙆'],['xi_wave','لوّح بيدك','لوّحي بيدك','👋'],['xi_jump','اقفز','اقفزي','🦘'],['xi_stomp','دق برجلك','دقي برجلك','🦶'],['xi_up','ارفع يديك','ارفعي يديك','🙌']];
  var IMITBY={};IMIT.forEach(function(m){IMITBY[m[0]]=m;});
  if(A.PARTS)FEEL.concat(MOVE,IMIT).forEach(function(x){var id=x[0];if(Object.prototype.hasOwnProperty.call(A.PARTS,id))return;
    Object.defineProperty(A.PARTS,id,{configurable:true,enumerable:true,get:function(){return X.isF()?[id+'_f']:undefined;}});});
  X.onText(function(id){
    if(/_f$/.test(id)){var b=id.slice(0,-2),src=FEELBY[b]||MOVEBY[b]||IMITBY[b];var ob=A.OV()[b];if(src)return (!X.isF()||(ob&&(ob.t||ob.say)))?'':src[2];}
    var o=A.OV()[id];if(o&&o.t)return o.t;
    if(FEELBY[id])return X.g(FEELBY[id][1],FEELBY[id][2]);if(CALMBY[id])return CALMBY[id][1];if(MOVEBY[id])return X.g(MOVEBY[id][1],MOVEBY[id][2]);if(IMITBY[id])return X.g(IMITBY[id][1],IMITBY[id][2]);
    if(id==='xz_brkend')return 'خلصت الراحة';
    if(id==='xt_toilet')return 'وقت الحمام';if(id==='xp_your')return 'دورك';
    if(id.indexOf('xs_')===0)return pageText(id);
    if(/^xp_song[123]$/.test(id)){var s=(cfg('play',{}).songs||[])[+id.slice(-1)-1];return (s&&s.t)||'أغنية';}
    if(id.indexOf('xq_')===0){var f=FEELBY['xe_'+id.slice(3)];return f?'وين الوجه ال'+f[1]+'؟':null;}
    return null;});

  /* ======================= EMOTIONS & CALM ======================= */
  var EMO_DEF={plan:['xc_break','xc_breathe','xc_hug'],brk:2,star:true};
  function emo(){return cfg('emo',EMO_DEF);}
  X.actTile({id:'emo',t:'المشاعر والهدوء',ic:'heart',col:'--bad-ink',perm:'emo',sub:function(){var n=X.dayCount(A.today(),'brk');return n?'طلب الراحة اليوم: '+ar(n):'ميزان المشاعر وركن الهدوء';}});
  X.secOpen.emo=function(){X.open('emo',drawEmo);};
  function scaleHTML(act){return '<div class="fscale" role="group" aria-label="ميزان المشاعر">'+SCALE.map(function(s){return '<button class="fs '+s[3]+'" data-act="'+act+'" data-v="'+s[0]+'"><b class="num">'+ar(s[0])+'</b><span>'+X.g(s[1],s[2])+'</span></button>';}).join('')+'</div>';}
  function drawEmo(){
    var d=A.today(),em=X.dayItems(d,'em'),brk=X.dayCount(d,'brk'),acc=A.gameAcc('emo',7),c=emo(),adult=A.canEdit()&&!A.S().set.lock;
    var h=X.chips('emo')+'<div class="card"><h2>كيف تحس الآن؟</h2>'+scaleHTML('xemlvl')+'<p class="muted">اختيار '+X.g('الطفل','الطفلة')+' لشعوره بنفسه تدريب على الإدارة الذاتية. من ٣ وفوق تظهر خطة الهدوء.</p></div>';
    h+='<div class="hubgrid act">'+[
      {id:'corner',t:'ركن الهدوء',ic:'wind',col:'--sea'},{id:'feel',t:'بطاقات المشاعر',ic:'smile',col:'--tang'},{id:'emogame',t:'لعبة المشاعر',ic:'grid',col:'--grape'},{id:'brk',t:'أبي راحة',ic:'hand',col:'--bad-ink'}
    ].map(function(t){return '<button class="htile" data-act="xemgo" data-id="'+t.id+'" style="--hc:var('+t.col+')"><span class="hic">'+I(t.ic)+'</span><span class="ht">'+t.t+'</span></button>';}).join('')+'</div>';
    h+='<div class="tiles">'+A.st(ar(brk),'طلب راحة اليوم')+A.st(acc.p==null?'—':ar(acc.p)+'٪','لعبة المشاعر، ٧ أيام')+'</div>';
    if(em.length){var last=em.filter(function(x){return x.v;}).slice(-6);if(last.length)h+='<div class="card"><h2>مشاعر اليوم</h2><div class="emrow">'+last.map(function(x){var s=SCALE[x.v-1];return '<span class="emdot '+s[3]+'" title="'+esc(X.g(s[1],s[2]))+'">'+ar(x.v)+'<i>'+esc(X.timeTxt(x.ts))+'</i></span>';}).join('')+'</div></div>';}
    h+='<div class="card"><h2>خطة الهدوء</h2><p class="muted">ثلاث خطوات متفق عليها تظهر له بالترتيب عندما يتضايق. تدرّبوا عليها وهو هادئ.</p><div class="plan">'+c.plan.map(function(id,i){var x=CALMBY[id];return x?'<div class="pstep"><span class="pn">'+ar(i+1)+'</span><span class="mini">'+A.picHTML(item(id,x[1],x[2]))+'</span><b>'+esc(x[1])+'</b></div>':'';}).join('')+'</div>'+(adult?'<button class="btn small ghost" data-act="xemplan">'+I('edit')+' غيّر الخطة والإعدادات</button>':'')+'</div>';
    return X.page('المشاعر والهدوء',h);
  }
  X.on('xemgo',function(b,d){var id=d('id');if(id==='brk')doBreak('emo');else if(id==='corner')openCorner(false);else if(id==='feel')X.open('feel',drawFeel);else if(id==='emogame')openEmoGame();});
  X.on('xemlvl',function(b,d){var v=+d('v');X.log('em',{v:v},40);if(v>=3){openCalmPlan(v);}else{A.cheer();A.toast(X.g('شاطر','شاطرة')+'! سعيدين إنك '+X.g(SCALE[v-1][1],SCALE[v-1][2]));A.redraw();}});
  function openCalmPlan(v){X.open('calmplan',function(){var c=emo();
    return X.page('خطة الهدوء','<div class="end"><p class="eyebrow">'+esc(X.g(SCALE[v-1][1],SCALE[v-1][2]))+'؟ نسوي هذا:</p><div class="plan big">'+c.plan.map(function(id,i){var x=CALMBY[id];return x?'<button class="pstep" data-act="xcalmdo" data-id="'+id+'"><span class="pn">'+ar(i+1)+'</span><span class="pic sm">'+A.picHTML(item(id,x[1],x[2]))+'</span><b>'+esc(x[1])+'</b></button>':'';}).join('')+'</div><p class="muted">اضغط الخطوة لتبدأ. خطوة واحدة في كل مرة.</p></div>');});}
  X.on('xcalmdo',function(b,d){var id=d('id');A.say(id);
    if(id==='xc_break')doBreak('plan');else if(id==='xc_breathe')openCorner(false,'breathe');else if(id==='xc_count')openCorner(false,'count');else if(id==='xc_move')openCorner(false,'move');else if(id==='xc_music'||id==='xc_quiet')openCorner(false,'sound');
    else{X.cnt('calm');A.toast(CALMBY[id][1]);}});
  X.on('xemplan',function(){X.open('emoset',function(){var c=emo();
    var h='<div class="card"><h2>خطوات الخطة</h2><p class="muted">اختر حتى أربع خطوات بالترتيب. اضغط مرة للإضافة ومرة للإزالة.</p><div class="grid">'+CALM.map(function(x){var i=c.plan.indexOf(x[0]);return '<button class="tile'+(i>=0?' sel':'')+'" data-act="xemp" data-id="'+x[0]+'">'+(i>=0?'<i class="bd rec">'+ar(i+1)+'</i>':'')+A.picHTML(item(x[0],x[1],x[2]))+'<span class="w">'+esc(x[1])+'</span></button>';}).join('')+'</div></div>';
    h+='<div class="card"><h2>بطاقة «أبي راحة»</h2><p class="muted">مدة الراحة عند ضغطها:</p>'+X.seg('xembrk',c.brk,[[1,'دقيقة'],[2,'دقيقتان'],[3,'٣ د'],[5,'٥ د']])+
      '<button class="toggle" data-act="xemstar" aria-pressed="'+(!!c.star)+'">'+(c.star?I('check')+' ':'')+'نجمة عند طلب الراحة بدل البكاء أو الرمي (تعزيز تفاضلي)</button>'+
      '<p class="muted">سجّل «أبي راحة» بصوتك ليسمعها '+X.g('بصوت يعرفه','بصوت تعرفه')+':</p>'+X.voiceBtns('xc_break',true)+'</div>';
    h+='<div class="card"><h2>أصوات وصور البطاقات</h2><p class="muted">صوّر وجه '+esc(X.kn())+' الحقيقي لكل شعور، وسجّل الكلمات بصوتكم.</p><div class="list">'+FEEL.concat(CALM.slice(1)).map(function(x){var t=FEELBY[x[0]]?X.g(x[1],x[2]):x[1];return '<button class="li" data-act="xcard" data-id="'+x[0]+'"><span class="mini">'+A.picHTML(item(x[0],t,x[3]||x[2]))+'</span><span class="nm">'+esc(t)+'</span>'+(A.hasA(x[0])?X.chip('مسجّل','good'):'')+I('left')+'</button>';}).join('')+'</div></div>';
    return X.page('إعدادات المشاعر والهدوء',h);});});
  X.on('xemp',function(b,d){var c=emo(),p=c.plan.slice(),i=p.indexOf(d('id'));if(i>=0)p.splice(i,1);else{if(p.length>=4){A.toast('أربع خطوات كحد أقصى',1);return;}p.push(d('id'));}if(!p.length){A.toast('اترك خطوة واحدة على الأقل',1);return;}setCfg('emo',{plan:p});});
  X.on('xembrk',function(b,d){setCfg('emo',{brk:+d('v')});});
  X.on('xemstar',function(){setCfg('emo',{star:!emo().star});});
  /* one card editor for every extension card: photo + voice */
  X.on('xcard',function(b,d){var id=d('id');X.open('card',function(){var t=A.ctext?A.ctext(id):id,f=FEELBY[id]||CALMBY[id]||MOVEBY[id]||IMITBY[id],e=f?(f.length>=4?f[3]:f[2]):'';
    return X.page('بطاقة: '+t,'<div class="card"><div class="row top"><div class="pic sm">'+A.picHTML(item(id,t,e))+'</div><div class="col grow">'+X.photoBtns(id,true)+'</div></div></div><div class="card"><h2>الصوت</h2>'+(A.hasA(id)?'<p class="muted">مسجّل بصوتكم.</p>':'<p class="muted">بلا تسجيل: تُقال بصوت الجهاز إن اخترتموه في الإعدادات، أو تقولها أنت.</p>')+X.voiceBtns(id)+'</div>');});});

  /* ---- break card: FCT + optional DRA star + timed calm corner ---- */
  function doBreak(from){var c=emo();A.say('xc_break');X.cnt('brk');X.log('brk',{f:from||''},30);if(c.star!==false)X.star('طلبت الراحة بالبطاقة');openCorner(true);}
  X.doBreak=doBreak;
  X.on('xbrk',function(){doBreak(A.TOP()?A.TOP().type:'board');});
  X.inject('brk',function(){return '<button class="brkbtn" data-act="xbrk" aria-label="أبي راحة">'+I('hand')+'<span>راحة</span></button>';});
  X.onAfter('board',function(view){if(A.isEdit())return;var g=view.querySelector('.grid.board');if(!g)return;
    g.insertAdjacentHTML('beforeend','<button class="tile fx brktile" data-act="xbrk">'+A.picHTML(item('xc_break','أبي راحة','✋'))+'<span class="w">أبي راحة</span></button>');});

  /* ---- calm corner: breathing, counting, movement breaks, calm sound ---- */
  var CO=null,NZ=null;
  function openCorner(isBrk,tab){var c=emo();CO=X.open('corner',drawCorner,{tab:tab||(isBrk?'breathe':'breathe'),brk:!!isBrk,ends:isBrk?Date.now()+c.brk*60000:0,t0:Date.now(),cnt:10,mv:null,mvEnd:0,doneBrk:false});X.cnt('calm');}
  function drawCorner(){var C=this,h='';
    var tabs=[['breathe','تنفّس'],['count','عدّ'],['move','حركة'],['sound','صوت هادئ']];
    h+='<div class="seg" style="grid-template-columns:repeat(4,1fr)">'+tabs.map(function(t){return '<button data-act="xcotab" data-v="'+t[0]+'" aria-pressed="'+(C.tab===t[0])+'">'+t[1]+'</button>';}).join('')+'</div>';
    if(C.doneBrk)h+='<div class="end"><div class="bigem">'+I('check')+'</div><h1>خلصت الراحة</h1><p class="muted">'+X.g('نرجع للنشاط؟ امدحه لأنه طلب الراحة بالكلمة.','نرجع للنشاط؟ امدحها لأنها طلبت الراحة بالكلمة.')+'</p><button class="btn big" data-act="close">نرجع</button><button class="btn line" data-act="xcomore">دقيقة كمان</button></div>';
    else if(C.tab==='breathe')h+='<div class="breath"><div class="orb"><span id="brtx">شهيق</span></div><p class="muted" id="brn">نتنفس ببطء مع الدائرة</p></div>';
    else if(C.tab==='count'){h+='<div class="countd"><div class="cnum num" id="cnum">'+ar(C.cnt)+'</div><div class="cdots" id="cdots">'+[10,9,8,7,6,5,4,3,2,1].map(function(i){return '<i class="'+(i>C.cnt?'on':'')+'"></i>';}).join('')+'</div><button class="btn ghost" data-act="xcocount">من جديد</button></div>';}
    else if(C.tab==='move'){
      if(C.mv){var m=MOVEBY[C.mv],mt=X.g(m[1],m[2]);h+='<div class="end"><button class="pic" data-act="xplay" data-id="'+m[0]+'">'+A.picHTML(item(m[0],mt,m[3]))+'</button><h1>'+esc(mt)+'</h1><div class="cnum num" id="mvt">'+ar(Math.max(0,Math.ceil((C.mvEnd-Date.now())/1000)))+'</div><button class="btn line" data-act="xcomv" data-id="">حركة أخرى</button></div>';}
      else h+='<p class="muted">اختاروا حركة. كل حركة لها مؤقت قصير.</p><div class="grid">'+MOVE.map(function(m){var mt=X.g(m[1],m[2]);return '<button class="tile" data-act="xcomv" data-id="'+m[0]+'">'+A.picHTML(item(m[0],mt,m[3]))+'<span class="w">'+esc(mt)+'</span></button>';}).join('')+'</div>';}
    else{h+='<div class="card"><h2>'+I('wind')+' صوت هادئ</h2><p class="muted">ضوضاء بنية ناعمة تساعد بعض الأطفال على الهدوء. ابدأ بصوت منخفض.</p><button class="btn big '+(NZ?'done':'')+'" data-act="xconz">'+(NZ?I('pause')+' أوقف الصوت':I('play')+' شغّل الصوت الهادئ')+'</button></div>'+
      '<div class="card"><h2>'+I('music')+' أغنية بصوتكم</h2><p class="muted">أغنية يحبها '+esc(X.kn())+' أو تهويدة بصوت ماما أو بابا.</p>'+(A.hasA('xc_music')?'<button class="btn" data-act="xplay" data-id="xc_music">'+I('play')+' شغّل الأغنية</button>':'')+X.voiceBtns('xc_music',true)+'</div>';}
    var right=C.brk&&!C.doneBrk?'<span class="chip num" id="cobrk">'+A.fmtDur(Math.max(0,C.ends-Date.now()))+'</span>':'';
    return X.page(C.brk?'وقت الراحة':'ركن الهدوء',h,{cls:'corner',right:right});}
  X.on('xcotab',function(b,d){var C=X.top('corner');if(!C)return;C.tab=d('v');C.t0=Date.now();C.mv=null;A.redraw();});
  X.on('xcocount',function(){var C=X.top('corner');if(C){C.cnt=10;C.cntAt=Date.now();A.redraw();}});
  X.on('xcomv',function(b,d){var C=X.top('corner');if(!C)return;var id=d('id');C.mv=id||null;if(id){C.mvEnd=Date.now()+MOVEBY[id][4]*1000;A.say(id);}A.redraw();});
  X.on('xcomore',function(){var C=X.top('corner');if(!C)return;C.doneBrk=false;C.ends=Date.now()+60000;A.redraw();});
  X.on('xconz',function(){if(NZ)noiseOff();else noiseOn();A.redraw();});
  function noiseOn(){try{var AC=window.AudioContext||window.webkitAudioContext,ac=new AC(),n=ac.sampleRate*3,b=ac.createBuffer(1,n,ac.sampleRate),dd=b.getChannelData(0),last=0;
    for(var i=0;i<n;i++){var w=Math.random()*2-1;last=(last+0.02*w)/1.02;dd[i]=last*3.2;}var s=ac.createBufferSource();s.buffer=b;s.loop=true;var g=ac.createGain();g.gain.value=0.3;s.connect(g);g.connect(ac.destination);s.start();NZ={ac:ac,s:s};}catch(e){NZ=null;A.toast('الصوت غير متاح على هذا الجهاز',1);}}
  function noiseOff(){if(NZ){try{NZ.s.stop();NZ.ac.close();}catch(e){}NZ=null;}}
  var lastCount=0;
  X.onTick(function(){
    var inStack=A.STACK().some(function(o){return o.type==='x-corner';});if(!inStack){if(NZ)noiseOff();return;}
    var C=X.top('corner');if(!C)return;var now=Date.now();
    if(C.brk&&!C.doneBrk){var el=document.getElementById('cobrk');if(el)el.textContent=A.fmtDur(Math.max(0,C.ends-now));if(now>=C.ends){C.doneBrk=true;noiseOff();A.ring('xz_brkend');A.redraw();return;}}
    if(C.tab==='breathe'){var ph=((now-C.t0)/1000)%8,tx=document.getElementById('brtx'),bn=document.getElementById('brn');if(tx)tx.textContent=ph<4?'شهيق':'زفير';if(bn)bn.textContent='نَفَس رقم '+ar(Math.floor((now-C.t0)/8000)+1);}
    if(C.tab==='count'&&C.cnt>1&&now-(C.cntAt||C.t0)>1200&&now-lastCount>1100){lastCount=now;C.cnt--;C.cntAt=now;var cn=document.getElementById('cnum');if(cn)cn.textContent=ar(C.cnt);var ds=document.querySelectorAll('#cdots i');for(var i=0;i<ds.length;i++)ds[i].className=(10-i)>C.cnt?'on':'';}
    if(C.tab==='move'&&C.mv){var left=Math.ceil((C.mvEnd-now)/1000),mt=document.getElementById('mvt');if(mt)mt.textContent=ar(Math.max(0,left));if(left<=0){C.mv=null;A.cheer();A.redraw();}}
  });

  /* ---- feelings cards and the emotion game (SST, DTT) ---- */
  function drawFeel(){var adult=A.canEdit()&&!A.S().set.lock;
    return X.page('بطاقات المشاعر',X.chips('emo',['SST','VS','MD'])+'<p class="muted">اضغط الوجه ليسمع الكلمة، وسمِّ شعورك أنت أيضاً في المواقف: «أنا فرحان لأننا رحنا الحديقة».</p><div class="grid two">'+
      FEEL.map(function(f){var t=X.g(f[1],f[2]);return '<button class="tile" data-act="xfeel" data-id="'+f[0]+'">'+A.picHTML(item(f[0],t,f[3]))+'<span class="w">'+esc(t)+'</span></button>';}).join('')+'</div>'+(adult?'<button class="btn line" data-act="xemplan">'+I('camera')+' صور وأصوات البطاقات</button>':''));}
  X.on('xfeel',function(b,d){var id=d('id');if(!A.say(id))A.toast(A.ctext(id));X.log('em',{f:id},40);});
  function makeEmoQ(G,prev){var t=G.pool[Math.floor(Math.random()*G.pool.length)];if(prev&&prev.t===t&&G.pool.length>1)t=G.pool[(G.pool.indexOf(t)+1)%G.pool.length];
    var k=Math.min(Math.max(2,+A.S().set.choices||3),G.pool.length),opts=[t];A.shuffle(G.pool.filter(function(x){return x!==t;})).slice(0,k-1).forEach(function(x){opts.push(x);});
    return {t:t,opts:A.shuffle(opts),wrong:{}};}
  function speakQ(G){setTimeout(function(){if(X.top('emogame')===G&&G.q){if(!A.say('xq_'+G.q.t.slice(3))&&A.S().set.voice==='device')A.speakDev(A.ctext('xq_'+G.q.t.slice(3)));}},250);}
  function openEmoGame(){var pool=FEEL.slice(0,4).map(function(f){return f[0];});if(A.gameAcc('emo',14).p>=80)pool=FEEL.map(function(f){return f[0];});
    var G={pool:pool,i:0,n:6,ok:0,miss:0};G.q=makeEmoQ(G,null);X.open('emogame',drawEmoGame,G);speakQ(G);}
  function nextEmoQ(G){if(G.i>=G.n){G.q=null;G.done=true;A.redraw();if(G.ok>=4)X.star('لعبة المشاعر');return;}
    G.q=makeEmoQ(G,G.q);G.miss=0;A.redraw();speakQ(G);}
  function drawEmoGame(){var G=this;
    if(G.done)return X.page('لعبة المشاعر','<div class="end"><div class="bigem">'+I('star')+'</div><h1>'+ar(G.ok)+' من '+ar(G.n)+'</h1><p class="muted">'+(G.ok>=4?'أحسنتم!':'نعيدها بعد قليل مع تلميح أكثر.')+'</p><button class="btn big" data-act="xemagain">جولة جديدة</button><button class="btn line" data-act="close">تم</button></div>');
    var q=G.q,f=FEELBY[q.t];
    return X.page('لعبة المشاعر','<div class="prompt"><span class="q">وين الوجه ال'+esc(f[1])+'؟</span><button class="iconbtn" data-act="xemq" aria-label="أعد السؤال">'+I('speaker')+'</button></div><div class="opts c2">'+
      q.opts.map(function(id,i){var x=FEELBY[id];return '<button class="opt'+(q.wrong[id]?' no':'')+(G.miss>=2&&id===q.t?' hint':'')+'" data-act="xemopt" data-id="'+id+'">'+A.picHTML(item(id,X.g(x[1],x[2]),x[3]))+'</button>';}).join('')+'</div><p class="muted">سؤال '+ar(G.i+1)+' من '+ar(G.n)+'</p>');}
  X.on('xemq',function(){var G=X.top('emogame');if(G&&G.q&&!A.say('xq_'+G.q.t.slice(3))&&A.S().set.voice==='device')A.speakDev(A.ctext('xq_'+G.q.t.slice(3)));});
  X.on('xemagain',function(){var G=X.top('emogame');if(!G)return;G.done=false;G.i=0;G.ok=0;nextEmoQ(G);});
  X.on('xemopt',function(b,d){var G=X.top('emogame');if(!G||!G.q||G.lock)return;var id=d('id');
    if(id===G.q.t){A.logGame('emo',G.q.t,G.miss?1:0);if(!G.miss)G.ok++;G.lock=true;A.say(id);A.cheer();b.classList.add('ok');setTimeout(function(){G.lock=false;G.i++;nextEmoQ(G);},1100);}
    else{G.miss++;G.q.wrong[id]=1;A.redraw();}});

  /* ======================= SOCIAL STORIES ======================= */
  var STO=[
    {id:'doc',t:'زيارة الدكتور',e:'🩺',p:['أحياناً أروح للدكتور عشان أبقى بصحة. أول شي أجلس في غرفة الانتظار، وأقدر ألعب شوي.','الممرضة تقيس طولي ووزني. أوقف مستقيم مثل الشجرة.','الدكتور يسمع صوت قلبي بالسماعة. السماعة باردة شوي وما تعوّر.','ممكن يشوف فمي بضوء صغير. أفتح فمي وأقول: آآه.','لما نخلص أقول: مع السلامة. بابا وماما فخورين فيني.']},
    {id:'barber',t:'قص الشعر',e:'💈',p:['شعري طال، فبنروح للحلاق.','أجلس على الكرسي. الحلاق يحط علي قماشة كبيرة.','الماكينة تسوي صوت «ززز». الصوت عالي شوي، وما تعوّر.','أقدر أمسك لعبتي وأنا {جالس|جالسة}. إذا تعبت أقول: أبي راحة.','لما نخلص أشوف شعري في المراية. صار شكلي {مرتب|مرتبة}!']},
    {id:'trip',t:'السفر بالطيارة',e:'✈️',p:['بنسافر بالطيارة. نروح للمطار.','في المطار ناس كثير وأصوات. أمسك يد ماما أو بابا طول الوقت.','نحط الشنطة في صندوق صغير، ونمشي من البوابة.','ننتظر شوي. أقدر أشوف الطيارات من الشباك.','في الطيارة أجلس في كرسيي وألبس الحزام. إذا حسيت بأذني، أشرب ماء.']},
    {id:'eid',t:'زيارة العيد',e:'🌙',p:['اليوم عيد! ألبس ملابس العيد الجديدة.','نزور بيت جدي وجدتي. البيت مزيّن وفيه حلويات.','الناس يسلّمون علي. أسلّم بيدي وأقول: عيدكم مبارك.','ممكن يعطوني عيدية. أقول: شكراً.','إذا صار المكان مزعج، أطلب نروح مكان هادي شوي. هذا عادي.']},
    {id:'school',t:'أول يوم في المدرسة',e:'🎒',p:['اليوم أروح للمدرسة. أشيل شنطتي.','في المدرسة فصل فيه طاولات وألوان. المعلمة تساعدني.','أجلس على طاولتي. نرسم ونلعب ونتعلم.','إذا احتجت شي أرفع يدي وأطلب من المعلمة.','آخر اليوم ماما أو بابا يجون ياخذوني للبيت.']}
  ];
  var STOBY={};STO.forEach(function(s){STOBY[s.id]=s;});
  function story(id){var o=X.col('sto').get(id);if(o&&!o.del)return {id:id,t:o.t,e:o.e||'📖',pages:(o.pages||[]).slice(),own:true,builtin:!!STOBY[id]};
    var b=STOBY[id];if(!b)return null;return {id:id,t:b.t,e:b.e,pages:b.p.map(function(tx,i){return {id:'xs_'+id+'_'+(i+1),tx:tx};}),own:false,builtin:true};}
  function stories(){var out=[];STO.forEach(function(s){var o=X.col('sto').get(s.id);if(!(o&&o.del))out.push(story(s.id));});
    X.col('sto').list(function(v,k){return !STOBY[k]&&!v.del;}).sort(function(a,b){return (a.c||0)-(b.c||0);}).forEach(function(v){out.push(story(v.id));});return out;}
  function pageText(pid){var m=/^xs_(.+)_([^_]+)$/.exec(pid);if(!m)return null;var s=story(m[1]);if(!s)return null;for(var i=0;i<s.pages.length;i++)if(s.pages[i].id===pid)return gt(s.pages[i].tx);return null;}
  X.actTile({id:'stories',t:'القصص الاجتماعية',ic:'book',col:'--grape',perm:'sto',sub:function(){var n=X.rangeItems(A.addDays(A.today(),-6),A.today(),'sr').length;return n?'قُرئت '+ar(n)+' مرة هذا الأسبوع':ar(stories().length)+' قصص جاهزة';}});
  X.secOpen.stories=function(){X.open('stories',function(){var reads={};X.rangeItems(A.addDays(A.today(),-6),A.today(),'sr').forEach(function(r){reads[r.s]=(reads[r.s]||0)+1;});var adult=A.canEdit()&&!A.S().set.lock;
    var h=X.chips('stories')+'<p class="muted">اقرأ القصة أياماً قبل الموقف، ومرة أخيرة قبله مباشرة. بدّل الصور بصور المكان الحقيقي وسجّلها بصوتكم.</p><div class="grid two">'+
      stories().map(function(s){var p=s.pages[0];return '<button class="tile story" data-act="xstread" data-id="'+s.id+'">'+(p?A.picHTML(item(p.id,s.t,s.e)):'<span class="e">'+esc(s.e)+'</span>')+'<span class="w">'+esc(s.t)+'</span>'+(reads[s.id]?'<i class="bd rec">'+ar(reads[s.id])+'×</i>':'')+'</button>';}).join('')+
      (adult?'<button class="tile add" data-act="xstnew">'+I('plus')+'<span class="w">قصة جديدة</span></button>':'')+'</div>';
    return X.page('القصص الاجتماعية',h);});};
  X.on('xstread',function(b,d){var s=story(d('id'));if(!s||!s.pages.length){A.toast('القصة بلا صفحات بعد',1);return;}var R=X.open('story',drawStory,{sid:s.id,i:0});setTimeout(function(){if(X.top('story')===R)sayPage(R);},300);});
  function sayPage(R){var s=story(R.sid),p=s&&s.pages[R.i];if(!p)return;if(!A.say(p.id)&&A.S().set.voice!=='device')return;}
  function drawStory(){var R=this,s=story(R.sid),n=s.pages.length,adult=A.canEdit()&&!A.S().set.lock;
    if(R.i>=n)return X.page(s.t,'<div class="end"><div class="bigem">'+I('book')+'</div><h1>خلصنا القصة</h1><p class="muted">اقرأوها مرة ثانية قبل الموقف.</p><button class="btn big" data-act="close">تم</button><button class="btn line" data-act="xstgo" data-v="0">من البداية</button></div>');
    var p=s.pages[R.i];
    return X.page(s.t,'<div class="spage"><div class="pic">'+A.picHTML(item(p.id,gt(p.tx),s.e))+'</div><p class="stx">'+esc(gt(p.tx))+'</p></div>'+
      '<div class="row snav"><button class="btn line" data-act="xstgo" data-v="'+(R.i-1)+'"'+(R.i?'':' disabled')+'>'+I('right')+' السابقة</button><button class="btn ghost" data-act="xstsay">'+I('speaker')+' اسمع</button><button class="btn" data-act="xstgo" data-v="'+(R.i+1)+'">'+(R.i===n-1?'النهاية':'التالية')+' '+I('left')+'</button></div><p class="muted" style="text-align:center">صفحة '+ar(R.i+1)+' من '+ar(n)+'</p>',
      {right:adult?'<button class="iconbtn" data-act="xsted" data-id="'+s.id+'" aria-label="عدّل القصة">'+I('edit')+'</button>':''});}
  X.on('xstgo',function(b,d){var R=X.top('story');if(!R)return;var s=story(R.sid),v=+d('v');if(v<0)return;R.i=v;if(v>=s.pages.length){X.log('sr',{s:R.sid},20);X.cnt('sto');if(!A.S().set.calm)A.cheer();}A.redraw();if(v<s.pages.length)sayPage(R);});
  X.on('xstsay',function(){var R=X.top('story');if(!R)return;var s=story(R.sid),p=s.pages[R.i];if(!A.say(p.id))A.toast('سجّل الصفحة بصوتك من زر التعديل، أو اقرأها له');});
  /* story editor */
  var SE=null;
  X.on('xstnew',function(){SE={id:X.rid('u'),t:'قصة جديدة',e:'📖',pages:[],isNew:true};SE.pages.push({id:'xs_'+SE.id+'_'+X.rid(),tx:'أنا {اسم}. اليوم '});openStEd();});
  X.on('xsted',function(b,d){var s=story(d('id'));SE={id:s.id,t:s.t,e:s.e,pages:s.pages.map(function(p){return {id:p.id,tx:p.tx};}),builtin:s.builtin,own:s.own};openStEd();});
  function openStEd(){X.open('sted',function(){
    var h='<div class="card">'+X.field('عنوان القصة',X.input('data-xse="t"',SE.t))+'<p class="muted">اكتب بصيغة «أنا». أغلب الجمل تصف ما يحدث، وقليل منها يوجّه. اكتب {اسم} ليظهر اسم '+X.g('الطفل','الطفلة')+'.</p></div>';
    SE.pages.forEach(function(p,i){h+='<div class="card spe"><div class="row between"><b>صفحة '+ar(i+1)+'</b><span class="row"><button class="iconbtn sm" data-act="xsemv" data-i="'+i+'" data-d="-1" aria-label="قدّم"'+(i?'':' disabled')+'>'+I('up')+'</button><button class="iconbtn sm" data-act="xsemv" data-i="'+i+'" data-d="1" aria-label="أخّر"'+(i<SE.pages.length-1?'':' disabled')+'>'+I('down')+'</button><button class="iconbtn sm" data-act="xsedel" data-i="'+i+'" aria-label="احذف الصفحة">'+I('trash')+'</button></span></div>'+
      '<div class="row top"><div class="pic sm">'+A.picHTML(item(p.id,'',SE.e))+'</div><div class="col grow">'+X.area('data-xsp="'+i+'"',p.tx)+X.photoBtns(p.id,true)+'</div></div>'+(SE.isNew?'':X.voiceBtns(p.id,true))+'</div>';});
    h+='<button class="btn ghost" data-act="xseadd">'+I('plus')+' أضف صفحة</button><button class="btn big" data-act="xsesave">احفظ القصة</button>';
    if(!SE.isNew)h+=SE.builtin?(SE.own?'<button class="btn line" data-act="xsereset">أرجع القصة الأصلية</button>':''):'<button class="btn danger" data-act="xsedelete">احذف القصة</button>';
    if(SE.isNew)h+='<p class="muted">بعد الحفظ تستطيع تسجيل كل صفحة بصوتك.</p>';
    return X.page(SE.isNew?'قصة جديدة':'تعديل: '+SE.t,h);});}
  X.onChange(function(t){if(!SE||!X.top('sted'))return false;var a=t.getAttribute('data-xse'),pi=t.getAttribute('data-xsp');if(a){SE[a]=t.value.trim().slice(0,60);return true;}if(pi!=null){SE.pages[+pi].tx=t.value.trim().slice(0,240);return true;}return false;});
  X.on('xseadd',function(){SE.pages.push({id:'xs_'+SE.id+'_'+X.rid(),tx:''});A.redraw();});
  X.on('xsedel',function(b,d){if(SE.pages.length<2){A.toast('القصة تحتاج صفحة واحدة على الأقل',1);return;}SE.pages.splice(+d('i'),1);A.redraw();});
  X.on('xsemv',function(b,d){var i=+d('i'),j=i+(+d('d'));if(j<0||j>=SE.pages.length)return;var t=SE.pages[i];SE.pages[i]=SE.pages[j];SE.pages[j]=t;A.redraw();});
  X.on('xsesave',function(){var doc={t:SE.t||'قصة',e:SE.e,pages:SE.pages.filter(function(p){return p.tx;})};if(!doc.pages.length){A.toast('اكتب نص صفحة واحدة على الأقل',1);return;}
    if(SE.isNew)doc.c=Date.now();X.col('sto').put(SE.id,doc).then(function(){var wasNew=SE.isNew;SE.isNew=false;SE.own=true;A.toast('حُفظت القصة');if(wasNew)A.redraw();else{A.closeOv();A.redraw();}},A.saveErr);});
  X.on('xsereset',function(){X.col('sto').del(SE.id).then(function(){A.closeOv();A.toast('عادت القصة الأصلية');A.redraw();},A.saveErr);});
  X.on('xsedelete',function(){X.col('sto').put(SE.id,{del:Date.now()}).then(function(){A.STACK().length=Math.max(0,A.STACK().length-2);A.closeOv();X.secOpen.stories();A.toast('حُذفت القصة');},A.saveErr);});

  /* ======================= VIDEO MODELING ======================= */
  function vmOf(id){var v=X.col('vm').get(id);return v&&v.a?v:null;}
  X.vmOf=vmOf;
  X.actTile({id:'vm',t:'النمذجة بالفيديو',ic:'video',col:'--brand-ink',perm:'vm',sub:function(){var n=X.col('vm').list(function(v){return v.a;}).length;return n?ar(n)+' فيديو':'صوّروا خطوات الأنشطة';}});
  X.secOpen.vm=function(){X.open('vm',function(){var adult=A.canEdit()&&!A.S().set.lock,acts=A.lib('act').filter(function(a){return !a.hide;});
    var h=X.chips('vm')+'<div class="tip"><b>كيف تصوّر؟</b> فيديو قصير لكل خطوة، نحو خمس ثوانٍ، من زاوية نظر '+X.g('الطفل','الطفلة')+' إن أمكن، بلا كلام كثير. يظهر الفيديو في شاشة الخطوات وقت الخطوة نفسها.</div>';
    acts.forEach(function(a){var st=A.actSteps(a),has=st.filter(function(s){return vmOf(s.id);}).length;
      h+='<details class="card vmact"'+(has?' open':'')+'><summary><span class="mini">'+A.picHTML(a)+'</span> '+esc(a.t)+' <span class="muted num">'+ar(has)+' من '+ar(st.length)+'</span></summary><div class="list">'+st.map(function(s){var v=vmOf(s.id);
        return '<div class="li"><span class="mini">'+A.picHTML(s)+'</span><span class="nm">'+esc(s.t)+'</span>'+(v?'<button class="btn small" data-act="xvmplay" data-id="'+s.id+'">'+I('play')+' شاهد</button>'+(adult?'<button class="iconbtn sm" data-act="xvmdel" data-id="'+s.id+'" aria-label="احذف الفيديو">'+I('trash')+'</button>':''):(adult?'<label class="btn small ghost">'+I('video')+' صوّر<input type="file" accept="video/*" capture="environment" data-xup="vm" data-id="'+s.id+'"></label>':'<span class="muted">بلا فيديو</span>'))+'</div>';}).join('')+'</div></details>';});
    var cus=X.col('vm').list(function(v,k){return k.indexOf('vx_')===0&&v.a;});
    h+='<div class="card"><h2>فيديوهات مهارات أخرى</h2><p class="muted">مثل: كيف أسلّم، كيف ألعب بالكرة مع صاحبي، كيف أنتظر دوري.</p>'+(cus.length?'<div class="list">'+cus.map(function(v){return '<div class="li"><span class="nm">'+esc(v.t||'مهارة')+'</span><button class="btn small" data-act="xvmplay" data-id="'+v.id+'">'+I('play')+' شاهد</button>'+(adult?'<button class="iconbtn sm" data-act="xvmdel" data-id="'+v.id+'" aria-label="احذف">'+I('trash')+'</button>':'')+'</div>';}).join('')+'</div>':'')+
      (adult?X.field('اسم المهارة',X.input('id="vxname"','',null,'مثال: كيف أسلّم على الضيف'))+'<label class="btn ghost">'+I('video')+' اختر فيديو أو صوّر<input type="file" accept="video/*" data-xup="vmx"></label>':'')+'</div>';
    return X.page('النمذجة بالفيديو',h);});};
  X.onChange(function(t){var k=t.getAttribute('data-xup');if(k!=='vm'&&k!=='vmx')return false;var f=t.files&&t.files[0];if(!f)return true;
    var id=k==='vm'?t.getAttribute('data-id'):'vx_'+X.rid(),title=k==='vmx'?((document.getElementById('vxname')||{}).value||'مهارة').trim().slice(0,60):'';
    A.setBusy('جارٍ تجهيز الفيديو ورفعه…');
    X.upAsset(f,{video:true}).then(function(r){var doc={a:r.id,sz:r.sizeBytes||0,mime:r.contentType||'',by:X.me.id||'',who:A.S().set.who||''};if(title)doc.t=title;return X.col('vm').put(id,doc);})
      .then(function(){A.setBusy('');A.redraw();A.toast('حُفظ الفيديو');},X.upErr);try{t.value='';}catch(e){}return true;});
  X.on('xvmdel',function(b,d){var id=d('id'),v=vmOf(id);X.col('vm').del(id).then(function(){A.redraw();A.toast('حُذف الفيديو');if(v)X.assetsP().then(function(as){if(as&&as.delete)as.delete(v.a).catch(function(){});});},A.saveErr);});
  X.on('xvmplay',function(b,d){openVideo(d('id'));});
  function openVideo(id){var v=vmOf(id);if(!v)return;var t=v.t||A.ctext(id)||'';X.open('vmplay',function(){return X.page(t,'<video class="vmv" src="'+X.assetUrl(v.a)+'" controls autoplay playsinline></video><p class="muted">شاهدوه معاً، ثم دعه يؤدي الخطوة. ساعده فقط عند الحاجة.</p>'+X.chips('vm',['VM','MD']));});}
  X.openVideo=openVideo;
  X.inject('stepVideo',function(stepId){return vmOf(stepId)?'<button class="btn go" data-act="xvmplay" data-id="'+stepId+'">'+I('video')+' شاهد الفيديو أولاً</button>':'';});

  /* ======================= TOILET TRAINING ======================= */
  var TOI_DEF={on:false,every:60,from:'08:00',to:'20:00',star:true};
  function toi(){return cfg('toil',TOI_DEF);}
  var TR={ok:['نجح في الحمام','good'],self:['طلب بنفسه','good'],try:['جلس بلا نتيجة','plain'],acc:['حادث','warn']};
  function toiNext(){var c=toi();if(!c.on)return null;var d=A.today(),from=A.hm2ms(d,c.from),to=A.hm2ms(d,c.to),S=A.S().set,last=0;
    X.dayItems(d,'toi').forEach(function(l){if(l.ts>last)last=l.ts;});
    var ack=(S.toiAck&&X.dstr(S.toiAck)===d)?S.toiAck:0,base=Math.max(last,ack),nx=base?base+c.every*60000:from;
    if(S.toiSnooze&&S.toiSnooze>nx)nx=S.toiSnooze;if(nx<from)nx=from;return nx>to?null:nx;}
  X.toiNext=toiNext;
  X.actTile({id:'toil',t:'تدريب الحمام',ic:'drop',col:'--sea',perm:'toil',sub:function(){var c=toi();if(!c.on)return 'تذكير ومتابعة ونجمة';var n=toiNext();return n?'التذكير التالي '+X.timeTxt(n):'انتهت مواعيد اليوم';}});
  X.secOpen.toil=function(){X.open('toil',drawToil);};
  function drawToil(){var c=toi(),d=A.today(),L=X.dayItems(d,'toi'),cnt={ok:0,self:0,try:0,acc:0},adult=A.canEdit()&&!A.S().set.lock;L.forEach(function(l){cnt[l.r]=(cnt[l.r]||0)+1;});
    var nx=toiNext(),h=X.chips('toilet');
    h+='<div class="card"><div class="row between"><h2>اليوم</h2>'+(c.on?X.chip(nx?(nx<=Date.now()?'حان وقت الحمام':'التالي '+X.timeTxt(nx)):'انتهت مواعيد اليوم',nx&&nx<=Date.now()?'warn':'plain'):X.chip('التذكير متوقف','plain'))+'</div>'+
      '<div class="tiles">'+A.st(ar(cnt.ok+cnt.self),'نجاح')+A.st(ar(cnt.acc),'حادث')+A.st(ar(cnt.self),'طلب بنفسه')+A.st(ar(cnt.try),'جلس بلا نتيجة')+'</div>'+
      '<div class="toilog">'+['ok','self','try','acc'].map(function(r){return '<button class="tl '+r+'" data-act="xtoi" data-r="'+r+'">'+(r==='ok'?I('check'):r==='self'?I('star'):r==='try'?I('clock'):I('drop'))+'<span>'+TR[r][0]+'</span></button>';}).join('')+'</div>'+
      (L.length?'<button class="btn small line" data-act="xtoiundo">'+I('reset')+' تراجع عن آخر تسجيل</button>':'')+
      '<button class="btn" data-act="xtoisteps">'+I('steps')+' افتح خطوات الحمام المصوّرة</button></div>';
    var days=X.days(14),ok=days.map(function(x){return X.dayItems(x,'toi').filter(function(l){return l.r==='ok'||l.r==='self';}).length;}),ac=days.map(function(x){return X.dayItems(x,'toi').filter(function(l){return l.r==='acc';}).length;});
    if(ok.concat(ac).some(Boolean))h+='<div class="card"><h2>آخر أسبوعين</h2>'+X.legend([['نجاح','var(--good)'],['حادث','var(--bad)']])+'<div class="chartbox">'+X.bars(days.map(function(x){return X.dateTxt(x,true);}),[{n:'نجاح',v:ok,c:'var(--good)'},{n:'حادث',v:ac,c:'var(--bad)'}],{stack:true,label:'نجاح وحوادث الحمام'})+'</div></div>';
    if(adult)h+='<div class="card"><h2>التذكير</h2><button class="toggle" data-act="xtoion" aria-pressed="'+(!!c.on)+'">'+(c.on?I('check')+' ':'')+'تذكير بمواعيد ثابتة</button>'+
      '<p class="muted">كل:</p>'+X.seg('xtoievery',c.every,[[30,'٣٠ د'],[45,'٤٥ د'],[60,'ساعة'],[90,'١٫٥ س'],[120,'ساعتان']])+
      '<div class="row">'+X.field('من',X.input('data-xtoi="from"',c.from,'time'))+X.field('إلى',X.input('data-xtoi="to"',c.to,'time'))+'</div>'+
      '<button class="toggle" data-act="xtoistar" aria-pressed="'+(!!c.star)+'">'+(c.star?I('check')+' ':'')+'نجمة فورية عند النجاح أو الطلب الذاتي</button></div>';
    h+='<details class="card"><summary>كيف ننجح في تدريب الحمام؟</summary><ul><li>مواعيد ثابتة في البداية (كل ساعة مثلاً)، ثم نباعدها مع النجاح.</li><li>خطوات مصوّرة على باب الحمام، وفيديو للخطوات إن أمكن.</li><li>نجمة ومدح فوري عند النجاح، ومدح أكبر عند الطلب بنفسه.</li><li>الحادث لا يُعاقب عليه: نظّف بهدوء وسجّله فقط.</li><li>علّمه كلمة أو بطاقة «أبي حمام» ولبِّها فوراً.</li></ul></details>';
    return X.page('تدريب الحمام',h);}
  X.on('xtoi',function(b,d){var r=d('r');X.log('toi',{r:r},40);var c=toi();if((r==='ok'||r==='self')&&c.star!==false)X.star(r==='self'?'طلب الحمام بنفسه':'نجح في الحمام');else A.toast('سُجّل: '+TR[r][0]);A.S().set.toiSnooze=0;A.saveLocal();A.redraw();});
  X.on('xtoiundo',function(){var L=X.dayItems(A.today(),'toi'),mine=(A.mutDay(A.today()).toi||[]);var last=mine[mine.length-1];if(!last){A.toast('آخر تسجيل كان من جهاز آخر',1);return;}X.unlog('toi',last.ts);A.toast('تم التراجع');A.redraw();});
  X.on('xtoisteps',function(){if(A.libGet('act','sa_toilet'))A.openSteps('sa_toilet');else A.toast('أضف نشاط «الحمام» من التنظيم',1);});
  X.on('xtoion',function(){setCfg('toil',{on:!toi().on});});
  X.on('xtoievery',function(b,d){setCfg('toil',{every:+d('v')});});
  X.on('xtoistar',function(){setCfg('toil',{star:!toi().star});});
  X.onChange(function(t){var k=t.getAttribute('data-xtoi');if(!k)return false;var p={};p[k]=t.value||TOI_DEF[k];setCfg('toil',p);return true;});
  var lastToiCheck=0;
  X.onTick(function(){var now=Date.now();if(now-lastToiCheck<15000)return;lastToiCheck=now;
    var nx=toiNext(),S=A.S().set;if(!nx||now<nx||A.TOP()||document.visibilityState!=='visible'||(S.toiAlert||0)>=nx)return;
    S.toiAlert=now;A.saveLocal();X.open('toialert',function(){return '<div class="overlay" role="dialog" aria-label="وقت الحمام"><header><button class="iconbtn" data-act="close" aria-label="إغلاق">'+I('x')+'</button><span class="ttl">تذكير</span></header><div class="stage"><div class="inner end"><p class="eyebrow">حان</p><button class="pic" data-act="xplay" data-id="xt_toilet">'+A.picHTML(item('xt_toilet','وقت الحمام','🚽'))+'</button><h1>وقت الحمام</h1><button class="btn big" data-act="xtoigo">'+I('play')+' يلّا نروح</button><button class="btn line" data-act="xtoisnz">بعد ١٠ دقائق</button></div></div></div>';});
    A.say('xt_toilet');});
  X.on('xtoigo',function(){var S=A.S().set;S.toiAck=Date.now();A.saveLocal();A.closeOv();if(A.libGet('act','sa_toilet'))A.openSteps('sa_toilet');});
  X.on('xtoisnz',function(){var S=A.S().set;S.toiSnooze=Date.now()+600000;A.saveLocal();A.closeOv();});

  /* ======================= PLAYING WITH OTHERS ======================= */
  var PLAY_DEF={partner:'mom',n:5,songs:[{t:''},{t:''},{t:''}]};
  function pcfg(){return cfg('play',PLAY_DEF);}
  function partners(){return [['mom','ماما'],['dad','بابا'],['sib',X.g('أخوه','أخوها')],['sis',X.g('أخته','أختها')],['friend',X.g('صاحبه','صاحبتها')]];}
  function partnerName(k){var p=partners().filter(function(x){return x[0]===k;})[0];return p?p[1]:'ماما';}
  X.actTile({id:'play',t:'اللعب مع الآخرين',ic:'users',col:'--good-ink',perm:'play',sub:function(){var n=X.rangeItems(A.addDays(A.today(),-6),A.today(),'pl').length;return n?ar(n)+' جولة هذا الأسبوع':'الدور، التقليد، الانتباه المشترك';}});
  X.secOpen.play=function(){X.open('play',function(){var from=A.addDays(A.today(),-6),L=X.rangeItems(from,A.today(),'pl'),turns=0,im=[0,0],ja=0;
    L.forEach(function(l){if(l.g==='turn')turns+=l.n||0;if(l.g==='imit'){im[0]+=l.ok||0;im[1]+=(l.ok||0)+(l.help||0)+(l.no||0);}if(l.g==='ja'&&l.r)ja++;});
    var G=[{id:'turn',t:'دوري ودورك',s:'تبادل الأدوار مع أي لعبة حقيقية',e:'xp_turn'},{id:'imit',t:'قلّدني',s:'حركة يقلّدها بعدك',e:'xp_imit'},{id:'ja',t:'شوف وين',s:'الانتباه المشترك: النظر والإشارة',e:'xp_ja'},{id:'song',t:'أكمل الأغنية',s:'توقف قبل آخر كلمة وانتظر',e:'xp_song'}];
    var h=X.chips('play')+'<p class="muted">ألعاب لطفل مع شخص، لا لطفل وحده أمام الشاشة. ابدأ بخمس دقائق، ودع الأخ أو القرين يقود وأنت تساعد عند الحاجة فقط.</p><div class="grid two">'+
      G.map(function(g){return '<button class="tile" data-act="xplgo" data-id="'+g.id+'">'+A.picHTML(item(g.e,g.t,''))+'<span class="w">'+g.t+'</span><span class="muted">'+g.s+'</span></button>';}).join('')+'</div>';
    h+='<div class="tiles">'+A.st(ar(turns),'دوراً هذا الأسبوع')+A.st(im[1]?ar(X.pct(im[0],im[1]))+'٪':'—','تقليد مستقل')+'</div>';
    if(ja)h+='<p class="muted">نجاح في الانتباه المشترك هذا الأسبوع: '+ar(ja)+'.</p>';
    return X.page('اللعب مع الآخرين',h);});};
  X.on('xplgo',function(b,d){var id=d('id');if(id==='turn')openTurn();else if(id==='imit')openImit();else if(id==='ja')openJA();else openSong();});
  /* turn taking */
  function openTurn(){X.open('turn',drawTurn,{turn:'kid',kid:0,par:0,goal:pcfg().n||5,starred:false});}
  function drawTurn(){var T=this,c=pcfg(),pn=partnerName(c.partner),kidT=T.turn==='kid',k=X.kid();
    var h='<div class="kchips">'+partners().map(function(p){return '<button class="pill" data-act="xpartner" data-v="'+p[0]+'" aria-pressed="'+(c.partner===p[0])+'">'+p[1]+'</button>';}).join('')+'</div>';
    h+='<div class="turns"><div class="tside'+(kidT?' on':'')+'">'+X.kidPhoto(k,'lg')+'<b>'+esc(k.name||'')+'</b>'+(kidT?'<span class="tnow">دورك</span>':'<span class="twait">'+I('hand')+' انتظر</span>')+'</div>'+
      '<div class="tside'+(!kidT?' on':'')+'"><span class="kav lg">'+I('users')+'</span><b>'+esc(pn)+'</b>'+(!kidT?'<span class="tnow">دور '+esc(pn)+'</span>':'<span class="twait">'+I('hand')+' '+X.g('ينتظر','تنتظر')+'</span>')+'</div></div>';
    h+='<button class="btn big go" data-act="xturn">'+I('swap')+' '+(kidT?'خلصت دوري':'خلص دور '+esc(pn))+'</button>';
    h+='<div class="stars" aria-label="أدوار '+esc(k.name||'')+'">'+Array.apply(null,{length:T.goal}).map(function(_,i){return '<span class="st'+(i<T.kid?' on':'')+'">'+I('star')+'</span>';}).join('')+'</div>';
    h+='<p class="muted" style="text-align:center">'+ar(T.kid)+' من '+ar(T.goal)+' أدوار. اختاروا لعبة حقيقية: كورة، مكعبات، بازل.</p><button class="btn line" data-act="xturnend">إنهاء الجولة</button>';
    return X.page('دوري ودورك',h,{right:X.chip(ar(T.kid+T.par)+' دور','plain')});}
  X.on('xpartner',function(b,d){setCfg('play',{partner:d('v')});});
  X.on('xturn',function(){var T=X.top('turn');if(!T)return;if(T.turn==='kid'){T.kid++;T.turn='par';A.cheer();}else{T.par++;T.turn='kid';if(!A.say('xp_your')&&A.S().set.voice==='device')A.speakDev('دورك');}
    if(T.kid>=T.goal&&!T.starred){T.starred=true;X.star('لعب بالدور');}A.redraw();});
  X.on('xturnend',function(){var T=X.top('turn');if(T&&(T.kid||T.par))X.log('pl',{g:'turn',n:T.kid,p:pcfg().partner},40);A.closeOv();A.redraw();});
  /* imitation */
  function openImit(){X.open('imit',drawImit,{list:A.shuffle(IMIT.map(function(m){return m[0];})),i:0,res:{ok:0,help:0,no:0}});}
  function drawImit(){var M=this;if(M.i>=M.list.length){return X.page('قلّدني','<div class="end"><div class="bigem">'+I('star')+'</div><h1>قلّد '+ar(M.res.ok)+' '+X.g('وحده','وحدها')+'</h1><p class="muted">بمساعدة '+ar(M.res.help)+' · لم '+X.g('يقلّد','تقلّد')+' '+ar(M.res.no)+'</p><button class="btn big" data-act="close">تم</button></div>');}
    var id=M.list[M.i],m=IMITBY[id],mt=X.g(m[1],m[2]);
    return X.page('قلّدني','<div class="end"><button class="pic" data-act="xplay" data-id="'+id+'">'+A.picHTML(item(id,mt,m[3]))+'</button><h1>'+esc(mt)+'</h1><p class="muted">١ اجذب انتباهه. ٢ قل «سوّ مثلي» وأدِّ الحركة. ٣ انتظر خمس ثوانٍ.</p></div><div class="rate"><p>كيف قلّد؟</p><button class="r0" data-act="ximres" data-r="ok">قلّد '+X.g('وحده','وحدها')+'</button><button class="r1" data-act="ximres" data-r="help">بمساعدة</button><button class="r3" data-act="ximres" data-r="no" style="grid-column:1/-1">ما قلّد</button></div>',{right:'<span class="muted num">'+ar(M.i+1)+' / '+ar(M.list.length)+'</span>'});}
  X.on('ximres',function(b,d){var M=X.top('imit');if(!M)return;var r=d('r');M.res[r]++;A.logGame('imit',M.list[M.i],r==='ok'?0:1);if(r==='ok')A.cheer();M.i++;if(M.i>=M.list.length){X.log('pl',{g:'imit',ok:M.res.ok,help:M.res.help,no:M.res.no},40);if(M.res.ok>=4)X.star('التقليد');}A.redraw();});
  /* joint attention coaching */
  var JA=['ارفع لعبة يحبها بجانب عينيك، وانتظر أن ينظر إليك، ثم أعطه اللعبة فوراً.','أشّر على شيء ممتع في الغرفة وقل: «شوف!»، وانتظر أن ينظر إليه.','اسأله: «وين الكورة؟» ودعه يشير إليها بإصبعه. ساعده بتحريك يده إن لزم ثم خفّف المساعدة.','عندما يشير هو إلى شيء، انظر إليه معه وسمِّه بكلمة واحدة: «طيارة!»','قلّد ما يفعله في اللعب، وانتظر أن يلاحظك وينظر إليك، ثم ابتسم وكمّل اللعب.'];
  function openJA(){X.open('ja',function(){var S=this;if(S.i>=JA.length)return X.page('شوف وين','<div class="end"><div class="bigem">'+I('eye')+'</div><h1>خلصت البطاقات</h1><p class="muted">كرّروها في اللعب الحر خلال اليوم.</p><button class="btn big" data-act="close">تم</button></div>');
    return X.page('شوف وين','<div class="card jacard"><p class="eyebrow">بطاقة '+ar(S.i+1)+' من '+ar(JA.length)+' · للكبير</p><p class="lead">'+esc(X.g(JA[S.i],JA[S.i].replace(/يحبها/g,'تحبها').replace(/ينظر/g,'تنظر').replace(/أعطه/g,'أعطها').replace(/اسأله/g,'اسألها').replace(/دعه/g,'دعها').replace(/يشير/g,'تشير').replace(/إصبعه/g,'إصبعها').replace(/يده/g,'يدها').replace(/هو /g,'هي ').replace(/يفعله/g,'تفعله').replace(/يلاحظك/g,'تلاحظك').replace(/معه/g,'معها')))+'</p></div><div class="row"><button class="btn done grow" data-act="xjares" data-r="1">'+I('check')+' نجحت</button><button class="btn line grow" data-act="xjares" data-r="0">نحاول لاحقاً</button></div>'+X.chips('play',['NI','PBII','MD']));},{i:0});}
  X.on('xjares',function(b,d){var S=X.top('ja');if(!S)return;X.log('pl',{g:'ja',k:S.i,r:+d('r')},40);if(d('r')==='1')A.cheer();S.i++;A.redraw();});
  /* complete the song */
  function openSong(){X.open('song',function(){var c=pcfg(),songs=c.songs||PLAY_DEF.songs,adult=A.canEdit()&&!A.S().set.lock;
    var h='<div class="card"><p class="lead">غنِّ أغنية يحبها، وتوقف قبل آخر كلمة في المقطع، وانظر إليه بترقب خمس ثوانٍ. أي صوت منه يُعد محاولة: امدحه وكمّل الأغنية.</p></div>';
    [0,1,2].forEach(function(i){var id='xp_song'+(i+1),s=songs[i]||{t:''};h+='<div class="card"><div class="row between"><b>'+esc(s.t||'أغنية '+ar(i+1))+'</b>'+(A.hasA(id)?'<button class="btn small" data-act="xplay" data-id="'+id+'">'+I('play')+' شغّل</button>':'')+'</div>'+(adult?X.field('اسم الأغنية',X.input('data-xsong="'+i+'"',s.t||''))+X.voiceBtns(id,true):'')+'</div>';});
    h+='<div class="row"><button class="btn done grow" data-act="xsongres" data-r="1">'+I('check')+' أكمل الكلمة</button><button class="btn line grow" data-act="xsongres" data-r="0">حاول</button></div>';
    return X.page('أكمل الأغنية',X.chips('play',['MMI','TD','NI'])+h);});}
  X.onChange(function(t){var i=t.getAttribute('data-xsong');if(i==null)return false;var c=pcfg(),s=(c.songs||PLAY_DEF.songs).map(function(x){return Object.assign({},x);});s[+i]={t:t.value.trim().slice(0,40)};setCfg('play',{songs:s});return true;});
  X.on('xsongres',function(b,d){X.log('pl',{g:'song',r:+d('r')},40);if(d('r')==='1')A.cheer();A.toast('سُجّلت المحاولة');});

  /* ======================= TODAY: quick feelings + toilet ======================= */
  X.inject('todayTop',function(){var h='';
    h+='<div class="card qfeel"><div class="row between"><h2>كيف يحس '+esc(X.kn())+' الآن؟</h2><button class="btn small ghost" data-act="xsec" data-id="emo">'+I('heart')+' المشاعر</button></div>'+scaleHTML('xemlvl')+'</div>';
    var c=toi();if(c.on){var nx=toiNext();h+='<div class="card toitoday"><div class="row"><span class="hic" style="--hc:var(--sea)">'+I('drop')+'</span><div class="grow"><b>تدريب الحمام</b><br><span class="muted">'+(nx?(nx<=Date.now()?'حان الوقت الآن':'التذكير التالي '+X.timeTxt(nx)):'انتهت مواعيد اليوم')+'</span></div><button class="btn small" data-act="xsec" data-id="toil">سجّل</button></div></div>';}
    return h;});
};
})();
