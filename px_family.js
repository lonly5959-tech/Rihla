/* px_family.js — family sections: parent training lessons (PII) tied to the NCAEP practices,
   sleep and selective-eating log (ABI, R, VS), the practices library tile, and the practice settings
   that upgrade the existing speech section (time delay TD, behavioral momentum BMI). */
(function(){
'use strict';
window.PXF=window.PXF||{};
window.PXF.family=function(X){
  var A=X.A,esc=X.esc,ar=X.ar,I=X.I;
  X.need('train');

  /* ---------- parent training ---------- */
  var LESSONS=[
    {id:'rein',t:'التعزيز الذي ينجح',e:['R','DR'],sec:'org',c:['التعزيز شيء يحبه الطفل يأتي مباشرة بعد السلوك، فيزيد احتمال أن يكرره.','اعرف ما يحبه فعلاً اليوم: دعه يختار بين شيئين قبل أن تبدأ.','أعطه خلال ثانيتين أو ثلاث من السلوك، مع مدح يسمّي السلوك: «شاطر، طلبت بالكلمة».','عزّز كل مرة في البداية، وحين تثبت المهارة عزّز أحياناً.'],
      tr:'اختر سلوكاً واحداً اليوم، مثل الطلب بالكلمة، وعزّزه في كل مرة.',ck:['عرفت ما يحبه قبل البدء','أعطيته المعزز فوراً','مدحت السلوك نفسه بالاسم']},
    {id:'prompt',t:'المساعدة ثم سحبها',e:['PP'],sec:'board',c:['المساعدة توصله للإجابة الصحيحة: كلمة، أو إشارة، أو نموذج، أو مساعدة باليد.','استخدم أقل مساعدة تنجحه، لا أكثر.','اسحبها تدريجياً: من اليد إلى الإشارة إلى الانتظار.','تكرار «قل… قل…» يعلّمه انتظار التلقين. قلها مرة واحدة ثم انتظر.'],
      tr:'في كل طلب اليوم أعطه أول صوت فقط بدل الكلمة كاملة.',ck:['بدأت بأقل مساعدة','انتظرت قبل أن أساعد','لم أكرر التعليمة أكثر من مرة']},
    {id:'wait',t:'قاعدة الخمس ثوانٍ',e:['TD','NI'],sec:'sounds',c:['اعرض الشيء الذي يريده وانتظر خمس ثوانٍ بصمت وأنت تنظر إليه بترقب.','إن لم يطلب، قل الكلمة مرة واحدة فقط.','إن حاول ولو بأول صوت، أعطه الشيء فوراً.','زد الانتظار تدريجياً مع الأيام. هذا هو «التأخير الزمني».'],
      tr:'طبّقها ثلاث مرات اليوم وقت الأكل أو اللعب.',ck:['انتظرت خمس ثوانٍ كاملة','قلت الكلمة مرة واحدة','أعطيته الشيء فور المحاولة']},
    {id:'visual',t:'الجدول المصوّر والانتقالات',e:['VS','ABI'],sec:'org',c:['الطفل يفهم ما يراه أسهل مما يسمعه. الصورة تخبره ماذا الآن وماذا بعد.','افتح جدول اليوم أمامه وأشر إلى الصورة قبل كل انتقال.','نبّهه قبل الانتقال بخمس دقائق ثم بدقيقة، مع المؤقت المرئي.','«أولاً… ثم…»: أولاً النشاط الصعب، ثم الشيء الذي يحبه.'],
      tr:'استخدم الجدول المصوّر لثلاثة انتقالات اليوم.',ck:['أريته الصورة قبل الانتقال','استخدمت المؤقت','قلت «أولاً… ثم…»']},
    {id:'task',t:'تقسيم المهمة إلى خطوات',e:['TA','VM'],sec:'vm',c:['المهارة الطويلة مثل غسل اليدين تُقسم إلى خطوات صغيرة بالترتيب.','صورة لكل خطوة، وفيديو قصير إن أمكن.','ساعده في الخطوة الصعبة فقط، واتركه يكمل الباقي وحده.','بعض الأطفال يتعلمون أسرع إذا بدأت بآخر خطوة ثم أضفت ما قبلها.'],
      tr:'صوّر خطوات نشاط واحد اليوم بالفيديو.',ck:['قسّمت النشاط إلى خطوات','ساعدت في الصعبة فقط','مدحته عند كل خطوة']},
    {id:'meltdown',t:'عند نوبة الغضب',e:['FBA','FCT','DR'],sec:'beh',c:['الأمان أولاً: أبعد ما يؤذيه، وخفّف الكلام والضوضاء.','لا تحاول التعليم أثناء النوبة. انتظر حتى يهدأ.','لا تعطه ما يريد بسبب النوبة نفسها، حتى لا تصبح طريقته.','بعد أن يهدأ سجّل: ماذا حدث قبلها؟ وماذا حدث بعدها؟ النمط يكشف السبب.','علّمه في الأوقات الهادئة بديلاً يوصله لما يريد: «أبي راحة» أو صورة الشيء.'],
      tr:'سجّل كل نوبة هذا الأسبوع في سجل السلوك.',ck:['حافظت على أمانه','لم أعطه ما يريد بسبب النوبة','سجّلت ما قبلها وما بعدها']},
    {id:'fct',t:'علّمه يطلب بدل البكاء',e:['FCT','AAC'],sec:'emo',c:['كثير من السلوك الصعب طريقة للتواصل: «أبي أوقف»، «أبي هذا»، «انتبه لي».','اختر بديلاً سهلاً: كلمة أو صورة أو إشارة.','قدّم البديل قبل أن يبدأ السلوك الصعب، ولبِّه فوراً في البداية.','بطاقة «أبي راحة» في كل شاشة من التطبيق. كلما ضغطها أعطه الراحة وامدحه.'],
      tr:'ذكّره ببطاقة الراحة قبل نشاط صعب، ولبِّها كلما طلبها.',ck:['عرضت البطاقة قبل النشاط الصعب','لبّيت طلبه فوراً','مدحته لأنه طلب']},
    {id:'natural',t:'التعليم في المواقف اليومية',e:['NI'],sec:'today',c:['أفضل وقت للتعلم هو الموقف الحقيقي: الأكل واللبس واللعب.','اتبع اهتمامه: إلى ماذا ينظر؟ ماذا يريد؟','ضع الشيء قريباً منه وبعيداً عن يده، وانتظر طلبه.','المكافأة هي الشيء نفسه: يطلب العصير فيأخذ العصير.'],
      tr:'اصنع ثلاث فرص طلب في روتين اليوم.',ck:['اتبعت اهتمامه','صنعت فرصة للطلب','أعطيته الشيء نفسه مكافأة']},
    {id:'stories',t:'القصص الاجتماعية قبل المواقف الجديدة',e:['SN','ABI'],sec:'stories',c:['القصة الاجتماعية تخبره بما سيحدث قبل أن يحدث، فيقل خوفه من المجهول.','اكتبها بصيغة «أنا»، بجمل قصيرة وصورة لكل صفحة.','صوّر المكان الحقيقي وسجّلها بصوتك.','اقرأها عدة أيام قبل الموقف، ومرة أخيرة قبله مباشرة.'],
      tr:'اختر موقفاً قادماً واقرأ قصته اليوم.',ck:['اخترت موقفاً قادماً','استخدمت صوراً حقيقية','قرأتها قبل الموقف']},
    {id:'peers',t:'اللعب بالدور مع الإخوة',e:['PBII','SST'],sec:'play',c:['الإخوة أفضل معلمين للعب. علّم الأخ ثلاثة أشياء: اجذب انتباهه، اعرض اللعب، امدحه.','ابدأ بلعبة بسيطة بالدور: كورة أو مكعبات.','استخدم «دوري ودورك» في التطبيق ليعرف متى دوره ومتى ينتظر.','تدخّل عند الحاجة فقط، ودع الأخ يقود.'],
      tr:'خمس دقائق «دوري ودورك» مع أخيه اليوم.',ck:['شرحت للأخ دوره','استخدمنا مؤشر الدور','تدخلت عند الحاجة فقط']},
    {id:'move',t:'الحركة قبل الجلوس',e:['EXM'],sec:'emo',c:['الحركة المنظمة قبل التعلم تحسّن الانتباه والهدوء عند كثير من الأطفال.','خمس إلى عشر دقائق: قفز، مشي الدب، دفع الجدار.','استخدم استراحات الحركة في ركن الهدوء بمؤقتها.','لاحظ: هل جلس أفضل بعد الحركة؟'],
      tr:'جرّب استراحة حركة قبل الجلسة اليوم.',ck:['تحرّك قبل الجلسة','استخدمنا المؤقت','لاحظت أثرها على جلوسه']},
    {id:'sleepfood',t:'النوم والأكل الانتقائي',e:['ABI','R','VS'],sec:'sleep',c:['روتين نوم ثابت كل ليلة بالصور: استحمام، بيجامة، أسنان، قصة، إطفاء النور.','شاشة أقل قبل النوم بساعة، ونفس الموعد يومياً.','الطعام الجديد يحتاج تعرّضاً متكرراً بلا ضغط: نظر، ثم لمس، ثم شم، ثم تذوق.','كل خطوة تجربة تستحق نجمة. سجّلها في «النوم والأكل».'],
      tr:'سجّل نوم الليلة وتجربة طعام جديد واحدة.',ck:['ثبّتنا روتين النوم','عرضت طعاماً جديداً بلا ضغط','سجّلت التجربة']}
  ];
  var LBY={};LESSONS.forEach(function(l){LBY[l.id]=l;});
  function lp(id){return X.col('train').get(id)||{};}
  function myDone(id){var p=lp(id),k=X.me.id||A.S().set.dev;return !!(p.done&&p.done[k]);}
  X.hubTile({id:'train',o:7,t:'تدريب الأهل',ic:'cap',col:'--good-ink',perm:'',sub:function(){var n=LESSONS.filter(function(l){return myDone(l.id);}).length;return ar(n)+' من '+ar(LESSONS.length)+' دروس';}});
  X.secOpen.train=function(){X.open('train',function(){var n=LESSONS.filter(function(l){return myDone(l.id);}).length;
    var h=X.chips('train')+'<div class="card hero"><p class="eyebrow">دروس قصيرة، نحو ٣ دقائق</p><h1>'+ar(n)+' من '+ar(LESSONS.length)+'</h1><p>كل درس مبني على ممارسة مثبتة، ومعه مهمة واحدة تطبقها في البيت اليوم.</p><div class="bar"><i style="width:'+X.pct(n,LESSONS.length)+'%"></i></div></div><div class="list card">'+
      LESSONS.map(function(l,i){var d=myDone(l.id);return '<button class="li" data-act="xlesson" data-id="'+l.id+'"><span class="lnum'+(d?' done':'')+'">'+(d?I('check'):ar(i+1))+'</span><span class="nm">'+esc(l.t)+'<br><span class="muted">'+l.e.map(function(e){var x=X.ebp(e);return x?esc(x.ar):'';}).join('، ')+'</span></span>'+I('left')+'</button>';}).join('')+'</div>';
    return X.page('تدريب الأهل',h);});};
  var LS2=null;
  X.on('xlesson',function(b,d){LS2={id:d('id'),i:0,ck:{}};X.open('lesson',drawLesson);});
  function drawLesson(){var l=LBY[LS2.id],p=lp(l.id),n=l.c.length,canV=A.canEdit()&&X.can('lib');
    if(LS2.i<n){return X.page(l.t,'<div class="card lcard"><p class="eyebrow">'+ar(LS2.i+1)+' من '+ar(n)+'</p><p class="lead">'+esc(l.c[LS2.i])+'</p></div>'+(LS2.i===0&&p.v?'<video class="vmv" src="'+X.assetUrl(p.v)+'" controls playsinline></video>':'')+
      '<div class="row"><button class="btn line" data-act="xlgo" data-d="-1"'+(LS2.i?'':' disabled')+'>'+I('right')+' السابق</button><button class="btn grow" data-act="xlgo" data-d="1">التالي '+I('left')+'</button></div>'+X.chips('train',l.e));}
    var h='<div class="card voice"><h2>'+I('heart')+' مهمة اليوم</h2><p>'+esc(l.tr)+'</p>'+(l.sec?'<button class="btn small" data-act="xsec" data-id="'+l.sec+'">'+I('play')+' افتح القسم</button>':'')+'</div>';
    h+='<div class="card"><h2>بعد التطبيق: هل فعلت هذا؟</h2>'+l.ck.map(function(c,i){return '<button class="toggle" data-act="xlck" data-i="'+i+'" aria-pressed="'+(!!LS2.ck[i])+'">'+(LS2.ck[i]?I('check')+' ':'')+esc(c)+'</button>';}).join('')+'</div>';
    h+='<button class="btn big done" data-act="xldone">'+I('check')+' أنهيت الدرس</button>';
    if(canV)h+='<div class="card"><h2>فيديو من المركز</h2><p class="muted">يستطيع الأخصائي إرفاق فيديو قصير يشرح الدرس بلهجتكم.</p>'+(p.v?'<p class="muted">مرفق فيديو.</p>':'')+'<label class="btn ghost small">'+I('video')+' '+(p.v?'استبدل الفيديو':'أرفق فيديو')+'<input type="file" accept="video/*" data-xup="lesson"></label></div>';
    return X.page(l.t,h);}
  X.on('xlgo',function(b,d){LS2.i=Math.max(0,LS2.i+(+d('d')));A.redraw();});
  X.on('xlck',function(b,d){var i=+d('i');LS2.ck[i]=!LS2.ck[i];A.redraw();});
  X.on('xldone',function(){var p=Object.assign({},lp(LS2.id)),k=X.me.id||A.S().set.dev;p.done=Object.assign({},p.done||{});p.done[k]=Date.now();p.fid=Object.assign({},p.fid||{});p.fid[k]=Object.keys(LS2.ck).filter(function(i){return LS2.ck[i];}).length;
    X.col('train').put(LS2.id,p).then(function(){A.closeOv();A.toast('أحسنت! الدرس مكتمل');A.redraw();},A.saveErr);});
  X.onChange(function(t){if(t.getAttribute('data-xup')!=='lesson')return false;var f=t.files&&t.files[0];if(!f||!LS2)return true;A.setBusy('جارٍ رفع الفيديو…');
    X.upAsset(f,{video:true}).then(function(r){return X.col('train').put(LS2.id,Object.assign({},lp(LS2.id),{v:r.id}));}).then(function(){A.setBusy('');A.redraw();A.toast('أُرفق الفيديو');},X.upErr);try{t.value='';}catch(e){}return true;});

  /* ---------- sleep and selective eating ---------- */
  function minsOf(hm){if(!hm||hm.indexOf(':')<0)return null;var p=hm.split(':');return (+p[0])*60+(+p[1]);}
  function sleepHours(s){var a=minsOf(s.on||s.bed),b=minsOf(s.wake);if(a==null||b==null)return null;var d=b-a;if(d<=0)d+=1440;d-=(s.wk||0)*10;return Math.round(d/6)/10;}
  X.sleepHours=sleepHours;
  var FL=[[1,'نظر إليه'],[2,'لمسه'],[3,'شمّه'],[4,'تذوّقه'],[5,'أكل لقمة'],[6,'أكل كمية']];
  X.hubTile({id:'sleep',o:5,t:'النوم والأكل',ic:'moon',col:'--sea',perm:'',sub:function(){var s=X.dayItems(A.today(),'slp');var last=s[s.length-1],h=last&&sleepHours(last);return h?'نام ليلة أمس '+ar(h)+' ساعة':'سجل النوم وتجربة الأطعمة';}});
  X.secOpen.sleep=function(){X.open('sleep',drawSleep,{tab:'s'});};
  var SL=null;
  function drawSleep(){var T=this,can=X.can('sleep');
    var h=X.chips('sleep')+X.seg('xsltab',T.tab,[['s','النوم'],['f','الأكل الانتقائي']]);
    if(T.tab==='s'){var today=X.dayItems(A.today(),'slp'),last=today[today.length-1];SL=SL||{bed:(last&&last.bed)||'21:00',on:(last&&last.on)||'',wake:(last&&last.wake)||'06:30',wk:(last&&last.wk)||0,q:(last&&last.q)||2};
      if(can)h+='<div class="card"><h2>نوم ليلة أمس</h2><div class="row">'+X.field('دخل السرير',X.input('data-xsl="bed"',SL.bed,'time'))+X.field('نام فعلاً',X.input('data-xsl="on"',SL.on,'time'))+X.field('صحي',X.input('data-xsl="wake"',SL.wake,'time'))+'</div>'+
        '<p class="muted">كم مرة صحي في الليل؟</p>'+X.seg('xslk',SL.wk,[[0,'٠'],[1,'١'],[2,'٢'],[3,'٣'],[4,'+٤']],' data-k="wk"')+'<p class="muted">كيف كان النوم؟</p>'+X.seg('xslk',SL.q,[[1,'متقطع'],[2,'متوسط'],[3,'هادئ']],' data-k="q"')+
        '<button class="btn" data-act="xslsave">'+I('check')+' '+(last?'حدّث تسجيل اليوم':'احفظ')+'</button></div>';
      var days=X.days(14),hrs=days.map(function(d){var s=X.dayItems(d,'slp');return s.length?sleepHours(s[s.length-1])||0:0;});
      if(hrs.some(Boolean)){var vals=hrs.filter(Boolean);h+='<div class="card"><h2>ساعات النوم، آخر أسبوعين</h2><p class="muted">المتوسط '+ar(Math.round(vals.reduce(function(a,b){return a+b;},0)*10/vals.length)/10)+' ساعة</p><div class="chartbox">'+X.bars(days.map(function(d){return X.dateTxt(d,true);}),[{n:'ساعات',v:hrs,c:X.C1}],{label:'ساعات النوم'})+'</div></div>';}
      h+='<details class="card"><summary>روتين نوم يساعد</summary><ul><li>الموعد نفسه كل ليلة، حتى في الإجازة.</li><li>روتين مصوّر: استحمام، بيجامة، أسنان، قصة، إطفاء النور. موجود في «التنظيم».</li><li>لا شاشات قبل النوم بساعة، وإضاءة خافتة.</li><li>إذا استمر الأرق أو الاستيقاظ الليلي كثيراً، راجعوا طبيب الأطفال.</li></ul></details>';}
    else{var all=X.rangeItems(A.addDays(A.today(),-60),A.today(),'ft'),by={};all.forEach(function(x){var k=x.f||('n:'+x.n);var o=by[k]=by[k]||{k:k,f:x.f,n:x.n,best:0,cnt:0,last:''};o.cnt++;if(x.l>o.best)o.best=x.l;if(x.d>o.last)o.last=x.d;});
      var list=Object.keys(by).map(function(k){return by[k];}),ok=list.filter(function(o){return o.best>=6;}),trial=list.filter(function(o){return o.best<6;});
      h+='<div class="card"><h2>سلم تجربة الطعام</h2><p class="muted">بلا ضغط: كل خطوة نجاح. التذوق وما بعده يعطيه نجمة.</p><div class="ladderf">'+FL.map(function(l){return '<span><b class="num">'+ar(l[0])+'</b>'+esc(l[1])+'</span>';}).join('')+'</div>'+(can?'<button class="btn" data-act="xftnew">'+I('plus')+' سجّل تجربة طعام</button>':'')+'</div>';
      var ms=A.mealSlots(A.today());if(ms.length)h+='<div class="card"><h2>وجبات اليوم</h2><div class="list">'+ms.map(function(m){return '<div class="li"><span class="nm">'+esc(m.n||'وجبة')+'</span><span class="muted">'+(m.f||[]).map(function(fid){var f=A.libGet('food',fid);return f?esc(f.t):'';}).join('، ')+'</span></div>';}).join('')+'</div><button class="btn small ghost" data-act="xmeals">'+I('food')+' افتح جدول الطعام</button></div>';
      function nm(o){var f=o.f&&A.libGet('food',o.f);return f?f.t:(o.n||'طعام');}
      if(trial.length)h+='<div class="card"><h2>تحت التجربة</h2><div class="list">'+trial.sort(function(a,b){return b.last.localeCompare(a.last);}).map(function(o){return '<div class="li"><span class="nm">'+esc(nm(o))+'<br><span class="muted">'+ar(o.cnt)+' تجارب · أعلى خطوة: '+esc(FL[o.best-1][1])+'</span></span><span class="fl"><i style="width:'+X.pct(o.best,6)+'%"></i></span></div>';}).join('')+'</div></div>';
      if(ok.length)h+='<div class="card"><h2>صار يأكله</h2><div class="chips">'+ok.map(function(o){return X.chip(esc(nm(o)),'good');}).join('')+'</div></div>';
      if(!list.length)h+=X.empty('لا تجارب بعد','اختر طعاماً واحداً جديداً هذا الأسبوع، واعرضه بجانب طعامه المفضل بلا ضغط.');}
    return X.page('النوم والأكل',h);}
  X.on('xsltab',function(b,d){var T=X.top('sleep');if(T){T.tab=d('v');A.redraw();}});
  X.on('xslk',function(b,d){SL[d('k')]=+d('v');A.redraw();});
  X.on('xmeals',function(){A.openMeals();});
  X.onChange(function(t){var k=t.getAttribute('data-xsl');if(!k||!SL)return false;SL[k]=t.value;return true;});
  X.on('xslsave',function(){var x=A.mutDay(A.today()),doc={bed:SL.bed,on:SL.on,wake:SL.wake,wk:SL.wk,q:SL.q,ts:Date.now()};x.slp=[doc];A.touch(A.today());var hh=sleepHours(doc);A.toast(hh?'سُجّل: '+ar(hh)+' ساعة نوم':'سُجّل');A.redraw();});
  var FT=null;
  X.on('xftnew',function(){FT={f:'',n:'',l:1};X.open('ftnew',function(){var foods=A.lib('food').filter(function(f){return !f.hide;});
    return X.page('تجربة طعام','<div class="card"><h2>أي طعام؟</h2><div class="grid">'+foods.map(function(f){return '<button class="tile'+(FT.f===f.id?' sel':'')+'" data-act="xftf" data-id="'+f.id+'">'+A.picHTML(f)+'<span class="w">'+esc(f.t)+'</span></button>';}).join('')+'</div>'+X.field('أو اكتب اسمه',X.input('data-xft="n"',FT.n,null,'مثال: جزر'))+'</div>'+
      '<div class="card"><h2>إلى أين وصل؟</h2><div class="chips">'+FL.map(function(l){return '<button class="pill" data-act="xftl" data-v="'+l[0]+'" aria-pressed="'+(FT.l===l[0])+'">'+ar(l[0])+' · '+esc(l[1])+'</button>';}).join('')+'</div></div><button class="btn big" data-act="xftsave">'+I('check')+' احفظ</button>');});});
  X.on('xftf',function(b,d){FT.f=FT.f===d('id')?'':d('id');A.redraw();});
  X.on('xftl',function(b,d){FT.l=+d('v');A.redraw();});
  X.onChange(function(t){if(t.getAttribute('data-xft')!=='n'||!FT)return false;FT.n=t.value.trim().slice(0,40);return true;});
  X.on('xftsave',function(){var inp=document.querySelector('[data-xft="n"]');if(inp)FT.n=inp.value.trim().slice(0,40);if(!FT.f&&!FT.n){A.toast('اختر الطعام أو اكتب اسمه',1);return;}
    X.log('ft',{f:FT.f,n:FT.n,l:FT.l},40);if(FT.l>=4)X.star('جرّب طعاماً جديداً');else A.toast('سُجّلت التجربة');A.closeOv();A.redraw();});

  /* ---------- practices library tile ---------- */
  X.hubTile({id:'lib',o:8,t:'مكتبة الممارسات',ic:'layers',col:'--brand-ink',perm:'',sub:function(){return '٢٨ ممارسة من مراجعة NCAEP';}});
  X.hubTiles.sort(function(a,b){return (a.o||9)-(b.o||9);});

  /* ---------- upgrade the speech section: time delay, momentum, model-lead-test ---------- */
  X.inject('soundsTop',function(){var s=A.S().set;
    return '<details class="card pxset"><summary>'+I('layers')+' طريقة التدريب حسب الممارسات المثبتة</summary>'+
      '<p class="muted"><b>التأخير الزمني:</b> لا يُسمَع النموذج فوراً. ينتظر التطبيق ثوانيَ ليجرّب '+X.g('الطفل','الطفلة')+' القول بنفسه، ثم يقول الكلمة.</p>'+X.seg('xtd',+s.td||0,[[0,'فوراً'],[3,'٣ ثوانٍ'],[5,'٥ ثوانٍ']])+
      '<button class="toggle" data-act="xbmi" aria-pressed="'+(!!s.bmi)+'">'+(s.bmi?I('check')+' ':'')+'زخم السلوك: تبدأ كلمات اليوم بكلمتين يتقنهما</button>'+
      '<p class="muted">في كل بطاقة تجد «أنا أقول، معاً، دورك» من التعليم المباشر: نموذج، ثم أداء مشترك، ثم دوره وحده.</p></details>';});
  X.on('xtd',function(b,d){A.S().set.td=+d('v');A.saveLocal();A.render();A.toast(+d('v')?'سينتظر '+ar(+d('v'))+' ثوانٍ قبل النموذج':'النموذج يُسمع فوراً');});
  X.on('xbmi',function(){var s=A.S().set;s.bmi=!s.bmi;A.S().plan=null;A.saveLocal();A.render();A.toast(s.bmi?'جلسة اليوم تبدأ بكلمتين يتقنهما':'أُوقف زخم السلوك');});

  /* ---------- settings: child, team, safety ---------- */
  X.inject('settings',function(){var k=X.kid();
    return '<div class="card"><h2>'+esc(k.name||'')+' والفريق</h2><p class="muted">بيانات '+X.g('الطفل','الطفلة')+'، بطاقة الأمان، الأطفال الآخرون، أدوار الفريق، والخصوصية.</p><div class="row"><button class="btn grow" data-act="xsec" data-id="kids">'+I('users')+' الأطفال والفريق</button><button class="btn ghost grow" data-act="xsec" data-id="safe">'+I('shield')+' بطاقة الأمان</button></div><button class="btn line" data-act="xsec" data-id="move">'+I('swap')+' '+(window.__STANDALONE?'نقل البيانات والنسخ الاحتياطي':'نقل إلى الآيباد أو جهاز آخر')+'</button></div>';});
};
})();
