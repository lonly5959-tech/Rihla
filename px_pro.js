/* px_pro.js — the center and specialist layer:
   individual plan (IEP) with mastery criteria and chosen NCAEP practices, session data by prompt level (DTT, PP, TD),
   behavior log with functional analysis (FBA → FCT, DR, ABI…), communication notebook with homework (PII),
   and a printable monthly report. */
(function(){
'use strict';
window.PXF=window.PXF||{};
window.PXF.pro=function(X){
  var A=X.A,esc=X.esc,ar=X.ar,I=X.I;
  X.need('iep');X.need('sess',false,{order:'ts',limit:2000});X.need('beh',false,{order:'ts',limit:2000});X.need('note',false,{order:'ts',limit:1000});X.need('rep');
  var DOM=[['tkh','التخاطب والتواصل','--brand-ink'],['ijt','الاجتماعي واللعب','--good-ink'],['mhr','المهارات والاستقلالية','--tang'],['aka','الأكاديمي','--grape'],['hrk','الحركي','--sea'],['hss','الحسي','--sun-ink'],['slk','السلوك','--bad-ink']];
  var DOMBY={};DOM.forEach(function(d){DOMBY[d[0]]=d;});
  var GST={prop:['مقترح','plain'],act:['نشط',''],mast:['متقن','good'],hold:['متوقف','warn']};
  var PL=[['i','مستقل','good'],['v','لفظية','pv'],['g','إشارة','pg'],['m','نمذجة','pm'],['p','جسدية','pp'],['x','خطأ أو لا استجابة','bad']];
  var PLBY={};PL.forEach(function(p){PLBY[p[0]]=p;});
  var LINKS=[['sounds','النطق'],['board','أطلب'],['games','أنشطة'],['org','التنظيم'],['emo','المشاعر والهدوء'],['stories','القصص'],['play','اللعب مع الآخرين'],['toil','الحمام'],['vm','الفيديو'],['beh','سجل السلوك']];
  var LINKBY={};LINKS.forEach(function(l){LINKBY[l[0]]=l[1];});

  /* ---------- goals ---------- */
  function goals(f){return X.col('iep').list(function(g){return !g.del&&(!f||f(g));}).sort(function(a,b){return (DOM.map(function(d){return d[0];}).indexOf(a.dom)-DOM.map(function(d){return d[0];}).indexOf(b.dom))||((a.c||0)-(b.c||0));});}
  function sessOf(gid){return X.col('sess').list(function(s){return s.g===gid;}).sort(function(a,b){return a.ts-b.ts;});}
  function crit(g){var c=g.crit||{};return {p:c.p||80,n:c.n||3};}
  function mastery(g){var s=sessOf(g.id),c=crit(g),last=s.slice(-c.n),ok=last.filter(function(x){return (x.pi||0)>=c.p;}).length;return {ok:ok,need:c.n,met:last.length>=c.n&&ok===c.n,last:s[s.length-1]||null,n:s.length};}
  X.goals=goals;X.sessOf=sessOf;X.mastery=mastery;X.DOMBY=DOMBY;
  X.hubTile({id:'iep',o:1,t:'الخطة الفردية',ic:'target',col:'--brand-ink',perm:'',sub:function(){var a=goals(function(g){return g.st==='act';}).length,p=goals(function(g){return g.st==='prop';}).length,m=goals(function(g){return g.st==='mast';}).length;return (a||p||m)?ar(a)+' نشط'+(p?' · '+ar(p)+' مقترح':'')+(m?' · '+ar(m)+' متقن':''):'أهداف قابلة للقياس';}});
  X.secOpen.iep=function(){X.open('iep',drawIep,{dom:''});X.fresh(['iep','sess'],'iep');};
  function goalCard(g){var m=mastery(g),st=GST[g.st||'act'],last=m.last,dm=DOMBY[g.dom]||DOM[0];
    return '<button class="goal" data-act="xgoal" data-id="'+g.id+'" style="--hc:var('+dm[2]+')"><span class="gdom">'+esc(dm[1])+'</span><b class="gt">'+esc(g.t)+'</b><span class="gmeta">'+X.chip(st[0],st[1])+
      (last?' <span class="muted num">آخر جلسة '+ar(last.pi||0)+'٪ مستقل</span>':' <span class="muted">لا جلسات بعد</span>')+(g.st==='act'&&m.n?' <span class="muted num">· '+ar(m.ok)+' من '+ar(m.need)+' للإتقان</span>':'')+'</span>'+(m.met&&g.st==='act'?'<i class="hb">'+I('flag')+'</i>':'')+'</button>';}
  function drawIep(){var T=this,can=X.can('iep'),gs=goals(function(g){return !T.dom||g.dom===T.dom;});
    var h=X.chips('iep')+'<div class="kchips"><button class="pill" data-act="xiepdom" data-v="" aria-pressed="'+(!T.dom)+'">الكل</button>'+DOM.map(function(d){var n=goals(function(g){return g.dom===d[0];}).length;return n||T.dom===d[0]?'<button class="pill" data-act="xiepdom" data-v="'+d[0]+'" aria-pressed="'+(T.dom===d[0])+'">'+esc(d[1])+' <span class="num">'+ar(n)+'</span></button>':'';}).join('')+'</div>';
    if(!goals().length)h+=X.empty('لا توجد أهداف بعد','كل هدف يُكتب بصيغة واحدة: السلوك + الموقف + مستوى المساعدة + معيار الإتقان + خط الأساس. واختر له الممارسات المثبتة التي ستُستخدم.');
    var prop=gs.filter(function(g){return g.st==='prop';});if(prop.length)h+='<div class="tip"><b>'+ar(prop.length)+' أهداف مقترحة</b> تنتظر مراجعة الأخصائي واعتمادها.</div>';
    DOM.forEach(function(d){var list=gs.filter(function(g){return g.dom===d[0];});if(!list.length)return;h+='<h2 class="sub2">'+esc(d[1])+'</h2><div class="goals">'+list.map(goalCard).join('')+'</div>';});
    if(can)h+='<button class="btn big" data-act="xgoaled" data-id="">'+I('plus')+' هدف جديد</button>';
    return X.page('الخطة الفردية',h);}
  X.on('xiepdom',function(b,d){var T=X.top('iep');if(T){T.dom=d('v');A.redraw();}});
  X.on('xgoal',function(b,d){X.open('goal',drawGoal,{id:d('id')});});
  function drawGoal(){var g=X.col('iep').get(this.id);if(!g)return X.page('هدف',X.empty('حُذف هذا الهدف'));g=Object.assign({id:this.id},g);
    var m=mastery(g),c=crit(g),S=sessOf(g.id),dm=DOMBY[g.dom]||DOM[0],st=GST[g.st||'act'],can=X.can('iep'),canS=X.can('sess')||X.can('sessHome');
    var h='<div class="card"><div class="row between"><span class="gdom" style="--hc:var('+dm[2]+')">'+esc(dm[1])+'</span>'+X.chip(st[0],st[1])+'</div><p class="lead">'+esc(g.t)+'</p>'+
      '<div class="kv"><span>خط الأساس</span><b>'+esc(g.base||'لم يُكتب')+'</b><span>معيار الإتقان</span><b>'+ar(c.p)+'٪ استقلالية في '+ar(c.n)+' جلسات متتالية</b>'+(g.due?'<span>الموعد</span><b>'+esc(X.dateTxt(g.due,true))+'</b>':'')+'<span>سلم المساعدة</span><b>'+(g.pr==='mtl'?'من الأكثر إلى الأقل':'من الأقل إلى الأكثر')+(g.td?' · تأخير '+ar(g.td)+' ث':'')+'</b></div>'+
      (g.note?'<p class="muted">'+esc(g.note)+'</p>':'')+'</div>';
    if(m.met&&g.st==='act')h+='<div class="card mastered"><h2>'+I('flag')+' تحقق معيار الإتقان</h2><p>آخر '+ar(c.n)+' جلسات فوق '+ar(c.p)+'٪. انقل الهدف إلى «متقن» وابدأ جلسات صيانة أسبوعية، وجرّبه مع شخص آخر وفي مكان آخر للتعميم.</p>'+(can?'<button class="btn done" data-act="xgst" data-v="mast">علّمه متقناً</button>':'')+'</div>';
    if(g.ebp&&g.ebp.length)h+='<div class="card"><h2>الممارسات المستخدمة</h2>'+X.chips('iep',g.ebp)+'</div>';
    if(g.links&&g.links.length)h+='<div class="card"><h2>تدرّبوا عليه في التطبيق</h2><div class="chips">'+g.links.map(function(l){return '<button class="pill" data-act="xsec" data-id="'+l+'">'+esc(LINKBY[l]||l)+'</button>';}).join('')+'</div></div>';
    if(S.length){var cats=S.slice(-12).map(function(s){return X.dateTxt(s.d,true);});
      h+='<div class="card"><h2>المنحنى</h2>'+X.legend([['مستقل',X.C1],['صحيح بأي مساعدة',X.C2]])+'<div class="chartbox">'+X.line(cats,[{n:'مستقل',v:S.slice(-12).map(function(s){return s.pi||0;}),c:X.C1},{n:'بأي مساعدة',v:S.slice(-12).map(function(s){return s.pc||0;}),c:X.C2}],{pct:true,goal:c.p,label:'نسبة الاستقلالية عبر الجلسات'})+'</div>'+
        '<div class="list">'+S.slice(-8).reverse().map(function(s){return '<div class="li"><span class="muted" style="flex:none">'+esc(X.dateTxt(s.d,true))+'</span><span class="nm">'+ar(s.n)+' محاولات'+(s.loc==='h'?' · في البيت':'')+(X.whoLabel(s)?' · '+esc(X.whoLabel(s)):'')+'</span><span class="chip num'+((s.pi||0)>=c.p?' good':'')+'">'+ar(s.pi||0)+'٪</span></div>';}).join('')+'</div></div>';}
    else h+=X.empty('لا جلسات مسجلة بعد','ابدأ جلسة وسجّل كل محاولة بمستوى المساعدة الذي احتاجه.');
    if(canS)h+='<button class="btn big" data-act="xsessgo" data-id="'+g.id+'">'+I('pulse')+' ابدأ جلسة</button>';
    if(can){h+='<div class="row"><button class="btn line grow" data-act="xgoaled" data-id="'+g.id+'">'+I('edit')+' عدّل</button>';
      h+=(g.st==='prop'?'<button class="btn done grow" data-act="xgst" data-v="act">اعتمد الهدف</button>':g.st==='hold'||g.st==='mast'?'<button class="btn ghost grow" data-act="xgst" data-v="act">أعد تفعيله</button>':'<button class="btn ghost grow" data-act="xgst" data-v="hold">أوقفه مؤقتاً</button>')+'</div>';}
    return X.page('هدف: '+(dm[1]),h);}
  X.on('xgst',function(b,d){var T=X.top('goal');if(!T)return;var v=d('v'),p={st:v};if(v==='mast')p.mastAt=Date.now();X.save(X.col('iep').patch(T.id,p),v==='mast'?'مبروك! أصبح الهدف متقناً':'حُفظ');if(v==='mast')A.cheer();});
  /* goal editor */
  var GE=null;
  X.on('xgoaled',function(b,d){var id=d('id'),g=id?X.col('iep').get(id):null;
    GE=g?JSON.parse(JSON.stringify(Object.assign({id:id},g))):{id:'',dom:(X.top('iep')&&X.top('iep').dom)||'tkh',t:'',base:'',crit:{p:80,n:3},ebp:[],pr:'ltm',td:0,links:[],st:'act'};
    X.open('goaled',function(){var e=GE,c=crit(e);
      var h='<div class="card"><h2>المجال</h2><div class="chips">'+DOM.map(function(d){return '<button class="pill" data-act="xged" data-k="dom" data-v="'+d[0]+'" aria-pressed="'+(e.dom===d[0])+'">'+esc(d[1])+'</button>';}).join('')+'</div>'+
        X.field('الهدف: السلوك + الموقف + مستوى المساعدة',X.area('data-xge="t"',e.t,'مثال: يطلب '+X.kn()+' الشيء الذي يريده بكلمة أو بطاقة دون نموذج لفظي كامل، في موقف الحاجة الحقيقي'))+
        X.field('خط الأساس (أين هو الآن؟)',X.input('data-xge="base"',e.base,null,'مثال: ٢ من ١٠ بتلقين لفظي كامل'))+'</div>';
      h+='<div class="card"><h2>معيار الإتقان</h2><p class="muted">نسبة المحاولات المستقلة:</p>'+X.seg('xgecp',c.p,[[70,'٧٠٪'],[80,'٨٠٪'],[90,'٩٠٪'],[100,'١٠٠٪']])+'<p class="muted">في جلسات متتالية عددها:</p>'+X.seg('xgecn',c.n,[[2,'٢'],[3,'٣'],[4,'٤'],[5,'٥']])+X.field('الموعد المستهدف',X.input('data-xge="due"',e.due||'','date'))+'</div>';
      h+='<div class="card"><h2>المساعدة</h2>'+X.seg('xged',e.pr,[['ltm','من الأقل إلى الأكثر'],['mtl','من الأكثر إلى الأقل']],' data-k="pr"')+'<p class="muted">التأخير الزمني قبل المساعدة:</p>'+X.seg('xged',e.td||0,[[0,'بلا'],[2,'٢ ث'],[3,'٣ ث'],[5,'٥ ث']],' data-k="td"')+'</div>';
      h+='<div class="card"><h2>الممارسات المثبتة المستخدمة</h2><p class="muted">اختر ممارسة أو أكثر من مراجعة NCAEP.</p>'+Object.keys(EBPCAT).map(function(cat){var list=X.ebpAll().filter(function(x){return x.cat===cat;});return '<p class="eyebrow">'+esc(EBPCAT[cat])+'</p><div class="chips">'+list.map(function(x){return '<button class="pill sm" data-act="xgeebp" data-id="'+x.id+'" aria-pressed="'+(e.ebp.indexOf(x.id)>=0)+'">'+esc(x.ar)+'</button>';}).join('')+'</div>';}).join('')+'</div>';
      h+='<div class="card"><h2>أين يُتدرَّب عليه في التطبيق؟</h2><div class="chips">'+LINKS.map(function(l){return '<button class="pill sm" data-act="xgelink" data-id="'+l[0]+'" aria-pressed="'+(e.links.indexOf(l[0])>=0)+'">'+esc(l[1])+'</button>';}).join('')+'</div>'+X.field('ملاحظة للفريق',X.area('data-xge="note"',e.note||''))+'</div>';
      h+='<button class="btn big" data-act="xgesave">احفظ الهدف</button>';
      if(e.id)h+=GE.ask?'<div class="card"><p>حذف الهدف يخفيه مع جلساته من الخطة.</p><div class="row"><button class="btn danger grow" data-act="xgedel" data-go="1">احذف</button><button class="btn line grow" data-act="xgedel" data-go="0">إلغاء</button></div></div>':'<button class="btn danger" data-act="xgedel">احذف الهدف</button>';
      return X.page(e.id?'تعديل الهدف':'هدف جديد',h);});});
  X.onChange(function(t){if(!GE||!X.top('goaled'))return false;var k=t.getAttribute('data-xge');if(!k)return false;GE[k]=t.value.trim().slice(0,k==='t'?400:200);return true;});
  X.on('xged',function(b,d){var k=d('k'),v=d('v');GE[k]=k==='td'?+v:v;A.redraw();});
  X.on('xgecp',function(b,d){GE.crit=Object.assign({},crit(GE),{p:+d('v')});A.redraw();});
  X.on('xgecn',function(b,d){GE.crit=Object.assign({},crit(GE),{n:+d('v')});A.redraw();});
  X.on('xgeebp',function(b,d){var i=GE.ebp.indexOf(d('id'));if(i>=0)GE.ebp.splice(i,1);else GE.ebp.push(d('id'));A.redraw();});
  X.on('xgelink',function(b,d){var i=GE.links.indexOf(d('id'));if(i>=0)GE.links.splice(i,1);else GE.links.push(d('id'));A.redraw();});
  X.on('xgesave',function(){var e=GE;if(!e.t){A.toast('اكتب نص الهدف',1);return;}var id=e.id||X.rid('g'),doc=Object.assign({},e);delete doc.id;delete doc.ask;if(!e.id){doc.c=Date.now();doc.by=X.me.id||'';}
    X.col('iep').put(id,doc).then(function(){A.closeOv();A.toast('حُفظ الهدف');A.redraw();},A.saveErr);});
  X.on('xgedel',function(b,d){if(d('go')==='0'){GE.ask=false;A.redraw();return;}if(d('go')!=='1'){GE.ask=true;A.redraw();return;}
    X.col('iep').patch(GE.id,{del:Date.now()}).then(function(){A.STACK().length=Math.max(1,A.STACK().length-1);A.closeOv();A.toast('حُذف الهدف');},A.saveErr);});

  /* ---------- session data: trial by trial with prompt levels ---------- */
  X.hubTile({id:'sess',o:2,t:'تسجيل الجلسات',ic:'pulse',col:'--sea',perm:'',sub:function(){var w=A.addDays(A.today(),-6),n=X.col('sess').list(function(s){return s.d>=w;}).length;return n?ar(n)+' جلسة هذا الأسبوع':'محاولة بمحاولة ومستوى المساعدة';}});
  X.secOpen.sess=function(){X.open('sesspick',function(){var gs=goals(function(g){return g.st==='act'||g.st==='prop';});
    var h=X.chips('sess')+(gs.length?'<p class="muted">اختر الهدف الذي تتدرّبون عليه الآن.</p><div class="goals">'+gs.map(function(g){return goalCard(g).replace('data-act="xgoal"','data-act="xsessgo"');}).join('')+'</div>':X.empty('لا توجد أهداف نشطة','أضف أهداف الخطة الفردية أولاً، ثم سجّل الجلسات عليها.')+(X.can('iep')?'<button class="btn" data-act="xsec" data-id="iep">افتح الخطة الفردية</button>':''));
    var rec=X.col('sess').list().sort(function(a,b){return b.ts-a.ts;}).slice(0,8);
    if(rec.length)h+='<div class="card"><h2>آخر الجلسات</h2><div class="list">'+rec.map(function(s){var g=X.col('iep').get(s.g);return '<div class="li"><span class="muted" style="flex:none">'+esc(X.dateTxt(s.d,true))+'</span><span class="nm">'+esc(g?g.t:'هدف محذوف')+'</span><span class="chip num">'+ar(s.pi||0)+'٪</span></div>';}).join('')+'</div></div>';
    return X.page('تسجيل الجلسات',h);});};
  X.on('xsessgo',function(b,d){var g=X.col('iep').get(d('id'));if(!g)return;var home=!X.can('sess');X.open('sess',drawSess,{gid:d('id'),tr:[],t0:Date.now(),tdAt:0,loc:home?'h':'c',end:false,note:''});});
  function drawSess(){var Ss=this,g=Object.assign({id:Ss.gid},X.col('iep').get(Ss.gid)||{}),c=crit(g),n=Ss.tr.length,ind=Ss.tr.filter(function(x){return x==='i';}).length,cor=Ss.tr.filter(function(x){return x!=='x';}).length;
    if(Ss.end){var h='<div class="card"><h2>ملخص الجلسة</h2><div class="tiles">'+A.st(ar(n),'محاولة')+A.st(ar(X.pct(ind,n))+'٪','استقلالية')+A.st(ar(X.pct(cor,n))+'٪','صحيح بأي مساعدة')+A.st(n?ar(X.pct(Ss.tr.filter(function(x){return x==='x';}).length,n))+'٪':'—','خطأ')+'</div>'+
      '<div class="pdist">'+PL.map(function(p){var k=Ss.tr.filter(function(x){return x===p[0];}).length;return k?'<span class="pdl '+p[2]+'">'+esc(p[1])+' '+ar(k)+'</span>':'';}).join('')+'</div>'+
      (X.can('sess')?'<p class="muted">مكان الجلسة:</p>'+X.seg('xsloc',Ss.loc,[['c','المركز'],['h','البيت']]):'')+X.field('ملاحظة',X.area('data-xsn="1"',Ss.note,'ما الذي ساعده؟ ما الذي صعب عليه؟'))+'</div><button class="btn big done" data-act="xssave">'+I('check')+' احفظ الجلسة</button><button class="btn line" data-act="xsback">رجوع للمحاولات</button>';
      return X.page(g.t||'جلسة',h);}
    var tdOn=+g.td>0,ebp=g.ebp||[];
    var h='<div class="sgoal"><b>'+esc(g.t||'')+'</b><span class="muted">المعيار '+ar(c.p)+'٪ مستقل</span></div>';
    if(ebp.indexOf('BMI')>=0)h+='<div class="tip"><b>زخم السلوك:</b> قدّم طلبين أو ثلاثة سهلة قبل المحاولة.</div>';
    if(tdOn)h+='<div class="tdbox"><button class="btn ghost" data-act="xstd">'+I('timer')+' قدّمت التعليمة: انتظر '+ar(g.td)+' ث</button><span class="tdring num" id="tdring">'+(Ss.tdAt?ar(Math.max(0,Math.ceil((Ss.tdAt-Date.now())/1000))):'')+'</span></div>';
    h+='<div class="trials">'+PL.map(function(p){return '<button class="trb '+p[2]+'" data-act="xstrial" data-v="'+p[0]+'">'+(p[0]==='i'?I('check')+' ':p[0]==='x'?I('x')+' ':'')+esc(p[1])+'</button>';}).join('')+'</div>';
    h+='<div class="tstrip" aria-label="المحاولات">'+(n?Ss.tr.map(function(x,i){return '<span class="td '+PLBY[x][2]+'" title="'+esc(PLBY[x][1])+'">'+ar(i+1)+'</span>';}).join(''):'<span class="muted">سجّل نتيجة كل محاولة بالمستوى الذي احتاجه.</span>')+'</div>';
    h+='<div class="tiles">'+A.st(ar(n),'محاولة')+A.st(n?ar(X.pct(ind,n))+'٪':'—','مستقل')+'</div>';
    h+='<div class="row">'+(n?'<button class="btn line grow" data-act="xsundo">'+I('reset')+' تراجع</button>':'')+'<button class="btn grow" data-act="xsend"'+(n?'':' disabled')+'>إنهاء الجلسة</button></div>';
    h+='<details class="how"><summary>مستويات المساعدة</summary><p><b>مستقل</b> أجاب وحده. <b>لفظية</b> أعطيته كلمة أو أول صوت. <b>إشارة</b> أشرت أو نظرت للإجابة. <b>نمذجة</b> أدّيتها أمامه. <b>جسدية</b> ساعدته بيدك.</p></details>';
    return X.page('جلسة',h,{right:'<span class="chip plain num">'+A.fmtDur(Date.now()-Ss.t0)+'</span>'});}
  X.on('xstrial',function(b,d){var Ss=X.top('sess');if(!Ss)return;Ss.tr.push(d('v'));Ss.tdAt=0;if(d('v')!=='x'&&!A.S().set.calm&&d('v')==='i')A.cheer();A.redraw();});
  X.on('xsundo',function(){var Ss=X.top('sess');if(Ss){Ss.tr.pop();A.redraw();}});
  X.on('xstd',function(){var Ss=X.top('sess');if(!Ss)return;var g=X.col('iep').get(Ss.gid)||{};Ss.tdAt=Date.now()+(+g.td||3)*1000;A.redraw();});
  X.on('xsend',function(){var Ss=X.top('sess');if(Ss&&Ss.tr.length){Ss.end=true;A.redraw();}});
  X.on('xsback',function(){var Ss=X.top('sess');if(Ss){Ss.end=false;A.redraw();}});
  X.on('xsloc',function(b,d){var Ss=X.top('sess');if(Ss){Ss.loc=d('v');A.redraw();}});
  X.onChange(function(t){if(!t.getAttribute('data-xsn'))return false;var Ss=X.top('sess');if(Ss)Ss.note=t.value.slice(0,400);return true;});
  X.on('xssave',function(){var Ss=X.top('sess');if(!Ss)return;var n=Ss.tr.length,ind=Ss.tr.filter(function(x){return x==='i';}).length,cor=Ss.tr.filter(function(x){return x!=='x';}).length;
    var doc={g:Ss.gid,d:A.today(),ts:Date.now(),tr:Ss.tr.join(''),n:n,pi:X.pct(ind,n),pc:X.pct(cor,n),loc:Ss.loc,note:Ss.note||'',by:X.me.id||'',who:A.S().set.who||'',dur:Math.round((Date.now()-Ss.t0)/1000)};
    X.col('sess').put(X.rid('s'),doc).then(function(){var g=Object.assign({id:Ss.gid},X.col('iep').get(Ss.gid)||{}),m=mastery(g);A.closeOv();A.toast(m.met&&g.st==='act'?'حُفظت الجلسة. تحقق معيار الإتقان!':'حُفظت الجلسة');A.redraw();},A.saveErr);});
  X.onTick(function(){var Ss=X.top('sess');if(!Ss)return;var el=document.getElementById('tdring');if(Ss.tdAt&&el){var left=Math.ceil((Ss.tdAt-Date.now())/1000);el.textContent=left>0?ar(left):'ساعده الآن';if(left<=0&&!Ss.tdBeeped){Ss.tdBeeped=true;}}if(!Ss.tdAt)Ss.tdBeeped=false;});

  /* ---------- behavior log + functional analysis ---------- */
  var BEH=[['tantrum','نوبة غضب أو بكاء'],['scream','صراخ'],['hit','ضرب'],['bite','عض'],['throw','رمي أشياء'],['self','إيذاء نفسه'],['run','هروب'],['stim','حركات متكررة'],['refuse','رفض'],['pull','سحب اليد'],['mouth','وضع أشياء في الفم'],['other','أخرى']];
  var ANT=[['demand','طُلب منه شيء'],['end','انتهى شيء يحبه'],['deny','مُنع من شيء'],['wait','انتظار'],['noise','ضوضاء أو زحمة'],['change','تغيير في الروتين'],['alone','وحده بلا انتباه'],['tired','تعب أو جوع'],['unk','غير واضح']];
  var CON=[['escape','ترك المهمة'],['give','أخذ ما يريد'],['attn','اهتمام وكلام'],['calm','تهدئة أو حضن'],['ignore','تجاهل مخطط'],['redirect','إعادة توجيه'],['none','لا شيء خاص']];
  var NM=function(L){var m={};L.forEach(function(x){m[x[0]]=x[1];});return m;};var BEHN=NM(BEH),ANTN=NM(ANT),CONN=NM(CON);
  var FN={esc:['الهروب من مهمة أو موقف',['FCT','ABI','BMI','DR','EXT'],[['علّمه «أبي راحة» وأعطه الراحة فوراً حين يطلبها. البطاقة موجودة في كل شاشة.','emo'],['قسّم المهمة وابدأ بمهام سهلة قبل الصعبة.',''],['اعرض «أولاً… ثم…» والجدول المصوّر قبل الطلب.','org'],['عزّز العمل والطلب المناسب، ولا تدع السلوك يُنهي المهمة.',''],['عدم إنهاء المهمة بسبب السلوك (الإطفاء) لا يُطبَّق إلا بخطة الأخصائي.','']]],
    tan:['الحصول على شيء يريده',['FCT','AAC','VS','ABI','DR'],[['علّمه طلب الشيء بالكلمة أو الصورة من «أطلب»، ولبِّ الطلب المناسب.','board'],['نبّهه قبل انتهاء ما يحبه بمؤقت مرئي.','org'],['درّبه على الانتظار تدريجياً: ثوانٍ ثم دقائق، مع نجمة.',''],['لا تعطه الشيء بعد السلوك مباشرة؛ أعطه بعد طلب مناسب.','']]],
    att:['جذب الانتباه',['DR','ABI','FCT','EXT'],[['أعطه انتباهاً كثيراً وهو هادئ أو يلعب، كل بضع دقائق.',''],['علّمه طريقة مناسبة يطلب بها الانتباه: «بابا تعال» أو ربتة.','board'],['قلّل الكلام والنظر أثناء السلوك نفسه، بخطة من الأخصائي.',''],['امدح السلوك البديل بوضوح فور حدوثه.','']]],
    sen:['إحساس داخلي',['RIR','EXM','ABI','DR','ASI'],[['استراحات حركة منتظمة قبل الأنشطة الطويلة.','emo'],['وفّر بديلاً يعطي الإحساس نفسه بشكل آمن، بالتنسيق مع أخصائي العلاج الوظيفي.',''],['عند بداية السلوك وجّهه بلطف إلى نشاط بديل.',''],['عزّز فترات غياب السلوك بنجمة.','']]],
    unk:['غير واضحة بعد',['FBA'],[['سجّل عشر مرات أو أكثر بتفاصيل «قبل» و«بعد»، ثم راجع التحليل مع الأخصائي.','']]]};
  function fnOf(e){var s={esc:0,tan:0,att:0,sen:0};if(['demand','change','noise'].indexOf(e.a)>=0)s.esc+=2;if(e.c==='escape')s.esc+=2;if(['deny','end','wait'].indexOf(e.a)>=0)s.tan+=2;if(e.c==='give')s.tan+=2;
    if(e.a==='alone')s.att+=2;if(e.c==='attn'||e.c==='calm')s.att+=1;if(e.b==='stim'||e.b==='mouth')s.sen+=2;if(e.a==='unk'&&(e.c==='none'||e.c==='ignore'))s.sen+=1;
    var best='unk',bv=0;['esc','tan','att','sen'].forEach(function(k){if(s[k]>bv){bv=s[k];best=k;}});return best;}
  X.fnOf=fnOf;X.FN=FN;
  function behs(from,to){return X.col('beh').list(function(e){return !e.del&&(!from||e.d>=from)&&(!to||e.d<=to);}).sort(function(a,b){return b.ts-a.ts;});}
  X.behs=behs;X.BEHN=BEHN;X.ANTN=ANTN;
  X.hubTile({id:'beh',o:3,t:'سجل السلوك',ic:'zap',col:'--bad-ink',perm:'',sub:function(){var n=behs(A.addDays(A.today(),-6)).length;return n?ar(n)+' مرة هذا الأسبوع':'قبل · سلوك · بعد';}});
  X.secOpen.beh=function(){X.open('beh',drawBeh,{days:14});X.fresh(['beh'],'beh');};
  function bars(rows,tot){return '<div class="hbars">'+rows.map(function(r){return '<div class="hbar"><span class="hl">'+esc(r[0])+'</span><span class="ht"><i style="width:'+Math.max(4,X.pct(r[1],tot))+'%"></i></span><b class="num">'+ar(r[1])+'</b></div>';}).join('')+'</div>';}
  function countBy(list,k,names){var m={};list.forEach(function(e){var v=e[k]||'';m[v]=(m[v]||0)+1;});return Object.keys(m).map(function(x){return [names[x]||x||'غير محدد',m[x],x];}).sort(function(a,b){return b[1]-a[1];});}
  function drawBeh(){var T=this,from=A.addDays(A.today(),-(T.days-1)),L=behs(from),can=X.can('beh');
    var h=X.chips('beh')+(can?'<button class="btn big" data-act="xbehadd">'+I('plus')+' سجّل سلوكاً الآن</button>':'')+X.seg('xbehdays',T.days,[[7,'٧ أيام'],[14,'١٤ يوماً'],[30,'٣٠ يوماً']]);
    if(!L.length)return X.page('سجل السلوك',h+X.empty('لا تسجيلات في هذه الفترة','سجّل كل مرة: ماذا حدث قبل السلوك، والسلوك نفسه، وماذا حدث بعده. بعد عشرة تسجيلات يظهر نمط واضح.'));
    var ints=L.filter(function(e){return e.int;}),durs=L.filter(function(e){return e.dur;});
    h+='<div class="tiles">'+A.st(ar(L.length),'مرة')+A.st(ar(Math.round(L.length*10/T.days)/10),'في اليوم')+A.st(ints.length?ar(Math.round(ints.reduce(function(a,e){return a+e.int;},0)*10/ints.length)/10)+' / ٥':'—','متوسط الشدة')+A.st(durs.length?ar(Math.round(durs.reduce(function(a,e){return a+e.dur;},0)/durs.length))+' د':'—','متوسط المدة')+'</div>';
    var days=X.days(T.days),cnt=days.map(function(d){return L.filter(function(e){return e.d===d;}).length;});
    h+='<div class="card"><h2>عدد المرات يومياً</h2><div class="chartbox">'+X.bars(days.map(function(d){return X.dateTxt(d,true);}),[{n:'مرات',v:cnt,c:X.C2}],{label:'عدد مرات السلوك يومياً'})+'</div></div>';
    var fns=countBy(L.map(function(e){return {f:e.fn||fnOf(e)};}),'f',{esc:'هروب',tan:'شيء يريده',att:'انتباه',sen:'إحساس',unk:'غير واضحة'}),top=fns[0]&&fns[0][2],F=FN[top]||FN.unk;
    h+='<div class="card fncard"><p class="eyebrow">الوظيفة المحتملة الأكثر تكراراً</p><h2>'+esc(F[0])+'</h2>'+bars(fns,L.length)+'<p class="muted">تحليل مبدئي من الأنماط المسجّلة، يساعد الأخصائي ولا يغني عن تقييم وظيفي كامل.</p></div>';
    h+='<div class="card"><h2>ماذا نجرّب؟</h2>'+X.chips('beh',F[1])+'<ul class="strat">'+F[2].map(function(s){return '<li>'+esc(s[0])+(s[1]?' <button class="btn small ghost" data-act="xsec" data-id="'+s[1]+'">افتح</button>':'')+'</li>';}).join('')+'</ul></div>';
    h+='<div class="card"><h2>السلوك</h2>'+bars(countBy(L,'b',BEHN),L.length)+'</div><div class="card"><h2>ماذا حدث قبله؟</h2>'+bars(countBy(L,'a',ANTN),L.length)+'</div><div class="card"><h2>ماذا حدث بعده؟</h2>'+bars(countBy(L,'c',CONN),L.length)+'</div>';
    var blk=[['٦–٩ ص',6,9],['٩–١٢',9,12],['١٢–٣ م',12,15],['٣–٦',15,18],['٦–٩ م',18,21],['ليلاً',21,30]];
    h+='<div class="card"><h2>وقت حدوثه</h2>'+bars(blk.map(function(b){return [b[0],L.filter(function(e){var hr=new Date(e.ts).getHours();if(hr<6)hr+=24;return hr>=b[1]&&hr<b[2];}).length];}),L.length)+'</div>';
    h+='<div class="card"><h2>آخر التسجيلات</h2><div class="list">'+L.slice(0,15).map(function(e){return '<div class="li top"><span class="muted" style="flex:none;min-width:64px">'+esc(X.dateTxt(e.d,true))+'<br>'+esc(X.timeTxt(e.ts))+'</span><span class="nm"><b>'+esc(BEHN[e.b]||e.bt||'سلوك')+'</b>'+(e.int?' · شدة '+ar(e.int):'')+(e.dur?' · '+ar(e.dur)+' د':'')+'<br><span class="muted">قبل: '+esc(ANTN[e.a]||'—')+' · بعد: '+esc(CONN[e.c]||'—')+'</span>'+(e.note?'<br><span class="muted">'+esc(e.note)+'</span>':'')+'</span>'+(can?'<button class="iconbtn sm" data-act="xbehdel" data-id="'+e.id+'" aria-label="احذف">'+I('trash')+'</button>':'')+'</div>';}).join('')+'</div></div>';
    return X.page('سجل السلوك',h);}
  X.on('xbehdays',function(b,d){var T=X.top('beh');if(T){T.days=+d('v');A.redraw();}});
  X.on('xbehdel',function(b,d){X.save(X.col('beh').patch(d('id'),{del:Date.now()}),'حُذف التسجيل');});
  var BE=null;
  X.on('xbehadd',function(){var n=new Date();BE={b:'',a:'',c:'',int:3,dur:0,loc:'h',note:'',hm:A.pad(n.getHours())+':'+A.pad(n.getMinutes()),d:A.today()};
    X.open('behadd',function(){var e=BE;function chips(k,L){return '<div class="chips">'+L.map(function(x){return '<button class="pill sm" data-act="xbe" data-k="'+k+'" data-v="'+x[0]+'" aria-pressed="'+(e[k]===x[0])+'">'+esc(x[1])+'</button>';}).join('')+'</div>';}
      var h='<div class="card"><h2>السلوك</h2>'+chips('b',BEH)+(e.b==='other'?X.field('اكتبه',X.input('data-xbe="bt"',e.bt||'')):'')+'</div>';
      h+='<div class="card"><h2>قبله مباشرة</h2>'+chips('a',ANT)+'</div><div class="card"><h2>بعده مباشرة</h2>'+chips('c',CON)+'</div>';
      h+='<div class="card"><h2>الشدة</h2>'+X.seg('xbe',e.int,[[1,'١'],[2,'٢'],[3,'٣'],[4,'٤'],[5,'٥']],' data-k="int"')+'<p class="muted">١ خفيف · ٥ شديد جداً</p><h2>المدة</h2>'+X.seg('xbe',e.dur,[[1,'دقيقة'],[3,'٣ د'],[5,'٥ د'],[10,'١٠ د'],[20,'+٢٠']],' data-k="dur"')+
        '<h2>المكان</h2>'+X.seg('xbe',e.loc,[['h','البيت'],['c','المركز'],['o','خارجاً']],' data-k="loc"')+'<div class="row">'+X.field('الوقت',X.input('data-xbe="hm"',e.hm,'time'))+X.field('اليوم',X.input('data-xbe="d"',e.d,'date'))+'</div>'+X.field('ملاحظة',X.area('data-xbe="note"',e.note,'ما الذي ساعده على الهدوء؟'))+'</div>';
      if(e.a&&e.c){var F=FN[fnOf(e)];h+='<div class="tip"><b>الوظيفة المحتملة:</b> '+esc(F[0])+'.</div>';}
      h+='<button class="btn big" data-act="xbesave">احفظ</button>';
      return X.page('تسجيل سلوك',h);});});
  X.on('xbe',function(b,d){var k=d('k'),v=d('v');BE[k]=(k==='int'||k==='dur')?+v:v;A.redraw();});
  X.onChange(function(t){if(!BE||!X.top('behadd'))return false;var k=t.getAttribute('data-xbe');if(!k)return false;BE[k]=t.value.slice(0,300);return true;});
  X.on('xbesave',function(){var e=BE;if(!e.b){A.toast('اختر السلوك',1);return;}var ts=A.hm2ms(e.d||A.today(),e.hm||'12:00')||Date.now();
    var doc={ts:ts,d:e.d||A.today(),b:e.b,a:e.a||'unk',c:e.c||'none',int:e.int,dur:e.dur,loc:e.loc,note:e.note||'',by:X.me.id||'',who:A.S().set.who||''};if(e.bt)doc.bt=e.bt;doc.fn=fnOf(doc);
    X.col('beh').put(X.rid('b'),doc).then(function(){A.closeOv();A.toast('سُجّل السلوك');A.redraw();},A.saveErr);});

  /* ---------- communication notebook + homework ---------- */
  var KIND={msg:['رسالة',''],hw:['واجب منزلي','warn'],day:['تدريب اليوم','good']};
  function notes(){return X.col('note').list(function(n){return !n.del&&!n.re;}).sort(function(a,b){return b.ts-a.ts;});}
  function replies(id){return X.col('note').list(function(n){return !n.del&&n.re===id;}).sort(function(a,b){return a.ts-b.ts;});}
  function openHw(){return notes().filter(function(n){return n.k==='hw'&&!n.done;});}
  X.openHw=openHw;
  function lastRead(){return +(A.S().set['nr_'+A.KID()]||0);}
  function unread(){var lr=lastRead();return X.col('note').list(function(n){return !n.del&&n.ts>lr&&(!X.me.id||n.by!==X.me.id);}).length;}
  X.hubTile({id:'note',o:4,t:'دفتر التواصل',ic:'chat',col:'--grape',perm:'',badge:function(){var u=unread();return u?ar(u):'';},sub:function(){var hw=openHw().length;return hw?ar(hw)+' واجب لم يُنجز':'رسائل وواجبات بين البيت والمركز';}});
  X.secOpen.note=function(){X.open('note',drawNote,{k:X.can('iep')?'day':'msg',tx:'',hwt:'',hwsec:'',media:[],reply:'',rtx:''});A.S().set['nr_'+A.KID()]=Date.now();A.saveLocal();X.fresh(['note'],'note');};
  function mediaHTML(m){return (m||[]).map(function(x){var u=X.assetUrl(x.a);return x.t==='video'?'<video class="nmv" src="'+u+'" controls playsinline preload="metadata"></video>':x.t==='audio'?'<audio src="'+u+'" controls preload="none"></audio>':'<img class="nmi" alt="" src="'+u+'">';}).join('');}
  function drawNote(){var T=this,list=notes(),can=X.can('note');X.names(list.map(function(n){return n.by;}).filter(Boolean));
    var h=X.chips('note');
    if(can){h+='<div class="card compose">'+X.seg('xnk',T.k,(X.can('iep')?[['day','تدريب اليوم'],['hw','واجب منزلي'],['msg','رسالة']]:[['msg','رسالة من البيت']]))+
      (T.k==='hw'?X.field('عنوان الواجب',X.input('data-xn="hwt"',T.hwt,null,'مثال: اطلب العصير بكلمة «أبي» ٣ مرات'))+'<p class="muted">يُتدرَّب عليه في:</p><div class="chips">'+LINKS.slice(0,9).map(function(l){return '<button class="pill sm" data-act="xnsec" data-v="'+l[0]+'" aria-pressed="'+(T.hwsec===l[0])+'">'+esc(l[1])+'</button>';}).join('')+'</div>':'')+
      X.area('data-xn="tx"',T.tx,T.k==='day'?'ماذا تدرّبنا اليوم؟ كيف كان أداؤه؟':T.k==='hw'?'كيف يطبّقه الأهل في البيت؟ خطوات قصيرة':'ماذا حدث في البيت؟ سؤال للأخصائي؟')+
      (T.media.length?'<div class="nmedia">'+mediaHTML(T.media)+'</div>':'')+
      '<div class="row"><label class="btn small ghost">'+I('camera')+' صورة أو فيديو<input type="file" accept="image/*,video/*" data-xup="note"></label><label class="btn small ghost">'+I('mic')+' صوت<input type="file" accept="audio/*,video/*" capture="user" data-xup="notea"></label><button class="btn small grow" data-act="xnsend">'+I('send')+' أرسل</button></div></div>';}
    if(!list.length)h+=X.empty('الدفتر فارغ','الأخصائي يكتب هنا تدريب اليوم والواجب المنزلي، والأهل يردون بما حدث في البيت.');
    list.forEach(function(n){var K=KIND[n.k]||KIND.msg,rs=replies(n.id),mine=X.me.id&&n.by===X.me.id;
      h+='<div class="card note'+(n.k==='hw'?' hw':'')+'"><div class="row between"><span class="row"><b>'+esc(X.whoLabel(n)||'عضو')+'</b>'+X.chip(K[0],K[1])+'</span><span class="muted">'+esc(X.ago(n.ts))+'</span></div>'+
        (n.hw&&n.hw.t?'<h3>'+esc(n.hw.t)+'</h3>':'')+(n.tx?'<p class="ntx">'+esc(n.tx)+'</p>':'')+'<div class="nmedia">'+mediaHTML(n.m)+'</div>'+
        (n.k==='hw'?(n.hw&&n.hw.sec?'<button class="btn small ghost" data-act="xsec" data-id="'+n.hw.sec+'">'+I('play')+' افتح '+esc(LINKBY[n.hw.sec]||'')+'</button>':'')+(n.done?'<div class="hwdone">'+I('check')+' أُنجز '+esc(X.ago(n.done.ts))+(n.done.r?' · '+['','صعب','مقبول','ممتاز'][n.done.r]:'')+(n.done.tx?' · '+esc(n.done.tx):'')+'</div>':(can?'<button class="btn small done" data-act="xnhw" data-id="'+n.id+'">'+I('check')+' أنجزناه</button>':'')):'')+
        (rs.length?'<div class="nrep">'+rs.map(function(r){return '<div class="nr"><b>'+esc(X.whoLabel(r)||'عضو')+'</b> <span class="muted">'+esc(X.ago(r.ts))+'</span><p>'+esc(r.tx||'')+'</p>'+mediaHTML(r.m)+'</div>';}).join('')+'</div>':'')+
        (can?(T.reply===n.id?'<div class="row">'+X.input('data-xn="rtx" class="nri"',T.rtx,null,'اكتب ردك')+'<button class="btn small" data-act="xnreply" data-id="'+n.id+'">'+I('send')+'</button></div>':'<div class="row"><button class="btn small line" data-act="xnr" data-id="'+n.id+'">ردّ</button>'+(mine?'<button class="iconbtn sm" data-act="xndel" data-id="'+n.id+'" aria-label="احذف">'+I('trash')+'</button>':'')+'</div>'):'')+'</div>';});
    return X.page('دفتر التواصل',h);}
  X.on('xnk',function(b,d){var T=X.top('note');if(T){T.k=d('v');A.redraw();}});
  X.on('xnsec',function(b,d){var T=X.top('note');if(T){T.hwsec=T.hwsec===d('v')?'':d('v');A.redraw();}});
  X.on('xnr',function(b,d){var T=X.top('note');if(T){T.reply=d('id');T.rtx='';A.redraw();}});
  X.onChange(function(t){var k=t.getAttribute('data-xn');if(!k)return false;var T=X.top('note');if(T)T[k]=t.value.slice(0,1200);return true;});
  X.onChange(function(t){var k=t.getAttribute('data-xup');if(k!=='note'&&k!=='notea')return false;var f=t.files&&t.files[0],T=X.top('note');if(!f||!T)return true;
    var isA=k==='notea';A.setBusy(isA?'جارٍ تجهيز التسجيل…':'جارٍ رفع الملف…');
    var p=isA?A.processAudio(f).then(function(r){return X.assetsP().then(function(as){if(!as)throw {code:'noassets'};return as.upload(r.blob);});}):X.upAsset(f);
    p.then(function(r){T.media.push({a:r.id,t:isA?'audio':(/^video\//.test(f.type||'')?'video':'image')});A.setBusy('');A.redraw();},X.upErr);try{t.value='';}catch(e){}return true;});
  X.on('xnsend',function(){var T=X.top('note');if(!T)return;var ta=document.querySelector('[data-xn="tx"]');if(ta)T.tx=ta.value.slice(0,1200);var ht=document.querySelector('[data-xn="hwt"]');if(ht)T.hwt=ht.value.slice(0,120);
    if(!T.tx&&!T.media.length&&!T.hwt){A.toast('اكتب رسالة أو أرفق ملفاً',1);return;}
    var doc={ts:Date.now(),k:T.k,tx:T.tx.trim(),m:T.media,by:X.me.id||'',who:A.S().set.who||'',role:X.role()};if(T.k==='hw')doc.hw={t:T.hwt.trim()||'واجب منزلي',sec:T.hwsec||''};
    X.col('note').put(X.rid('n'),doc).then(function(){T.tx='';T.hwt='';T.media=[];T.hwsec='';A.S().set['nr_'+A.KID()]=Date.now();A.saveLocal();A.toast('أُرسل');A.redraw();},A.saveErr);});
  X.on('xnreply',function(b,d){var T=X.top('note');if(!T)return;var inp=document.querySelector('[data-xn="rtx"]');var tx=(inp?inp.value:T.rtx||'').trim();if(!tx){A.toast('اكتب الرد',1);return;}
    X.col('note').put(X.rid('n'),{ts:Date.now(),re:d('id'),tx:tx.slice(0,800),by:X.me.id||'',who:A.S().set.who||'',role:X.role()}).then(function(){T.reply='';T.rtx='';A.S().set['nr_'+A.KID()]=Date.now();A.saveLocal();A.redraw();},A.saveErr);});
  X.on('xndel',function(b,d){X.save(X.col('note').patch(d('id'),{del:Date.now()}),'حُذفت الرسالة');});
  var HD=null;
  X.on('xnhw',function(b,d){HD={id:d('id'),r:3,tx:''};X.open('hwdone',function(){var n=X.col('note').get(HD.id)||{};
    return X.page('أنجزنا الواجب','<div class="card"><h2>'+esc((n.hw&&n.hw.t)||'الواجب')+'</h2><p class="muted">كيف كان؟</p>'+X.seg('xhdr',HD.r,[[1,'صعب'],[2,'مقبول'],[3,'ممتاز']])+X.field('ماذا حدث؟',X.area('data-xhd="1"',HD.tx,'مثال: طلب العصير مرتين بكلمة «أبي»'))+'</div><button class="toggle" data-act="xhdstar" aria-pressed="'+(HD.star!==false)+'">'+(HD.star!==false?I('check')+' ':'')+'نجمة ل'+esc(X.kn())+'</button><button class="btn big done" data-act="xhdsave">'+I('check')+' احفظ</button>');});});
  X.on('xhdr',function(b,d){HD.r=+d('v');A.redraw();});
  X.on('xhdstar',function(){HD.star=HD.star===false;A.redraw();});
  X.onChange(function(t){if(!t.getAttribute('data-xhd')||!HD)return false;HD.tx=t.value.slice(0,400);return true;});
  X.on('xhdsave',function(){var ta=document.querySelector('[data-xhd]');if(ta)HD.tx=ta.value.slice(0,400);X.col('note').patch(HD.id,{done:{ts:Date.now(),by:X.me.id||'',who:A.S().set.who||'',r:HD.r,tx:HD.tx}}).then(function(){if(HD.star!==false)X.star('أنجز الواجب');A.closeOv();A.redraw();},A.saveErr);});
  X.inject('todayTop',function(){var hw=openHw();if(!hw.length)return '';var n=hw[0];
    return '<div class="card hwtoday"><div class="row"><span class="hic" style="--hc:var(--grape)">'+I('chat')+'</span><div class="grow"><p class="eyebrow">واجب اليوم من الأخصائي</p><b>'+esc((n.hw&&n.hw.t)||'واجب منزلي')+'</b>'+(n.tx?'<p class="muted">'+esc(n.tx.slice(0,120))+(n.tx.length>120?'…':'')+'</p>':'')+'</div></div><div class="row">'+(n.hw&&n.hw.sec?'<button class="btn small ghost grow" data-act="xsec" data-id="'+n.hw.sec+'">'+I('play')+' ابدأ</button>':'')+(X.can('note')?'<button class="btn small done grow" data-act="xnhw" data-id="'+n.id+'">'+I('check')+' أنجزناه</button>':'')+'<button class="btn small line" data-act="xsec" data-id="note">الدفتر'+(hw.length>1?' ('+ar(hw.length)+')':'')+'</button></div></div>';});

  /* ---------- monthly report ---------- */
  X.need('rep');
  X.hubTile({id:'rep',o:6,t:'التقرير الشهري',ic:'doc',col:'--tang',perm:'',sub:function(){return 'ملخص الشهر للأسرة والمركز';}});
  X.secOpen.rep=function(){var d=new Date();X.open('rep',drawRep,{y:d.getFullYear(),m:d.getMonth()+1});};
  function monthRange(y,m){var a=y+'-'+A.pad(m)+'-01',e=new Date(y,m,0).getDate(),b=y+'-'+A.pad(m)+'-'+A.pad(e);return [a,b,e];}
  var MON=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  function repData(y,m){var r=monthRange(y,m),from=r[0],to=r[1],SD=A.S().days,days={},c={};
    Object.keys(SD).forEach(function(k){var x=SD[k];if(!x||!x.date||x.date<from||x.date>to)return;var has=Object.keys(x.t||{}).length||(x.s||[]).length||Object.keys(x.c||{}).length;if(has)days[x.date]=1;for(var q in (x.c||{}))c[q]=(c[q]||0)+(x.c[q]||0);});
    var att=0;Object.keys(SD).forEach(function(k){var x=SD[k];if(!x||!x.date||x.date<from||x.date>to)return;Object.keys(x.t||{}).forEach(function(id){if(id.indexOf('g:')!==0)att+=A.sum(x.t[id]);});});
    var gr=0,gw=0;Object.keys(SD).forEach(function(k){var x=SD[k];if(!x||!x.date||x.date<from||x.date>to)return;Object.keys(x.t||{}).forEach(function(id){if(id.indexOf('g:')===0){gr+=x.t[id][0]||0;gw+=x.t[id][1]||0;}});});
    var toi=X.rangeItems(from,to,'toi'),tok=toi.filter(function(l){return l.r==='ok'||l.r==='self';}).length,tac=toi.filter(function(l){return l.r==='acc';}).length;
    var S=X.col('sess').list(function(s){return s.d>=from&&s.d<=to;}),B=behs(from,to),N=notes().filter(function(n){var d=X.dstr(n.ts);return d>=from&&d<=to;}),hw=N.filter(function(n){return n.k==='hw';});
    var slp=X.rangeItems(from,to,'slp'),hrs=slp.map(function(s){return X.sleepHours?X.sleepHours(s):null;}).filter(function(v){return v!=null;});
    return {from:from,to:to,nd:r[2],days:Object.keys(days).length,c:c,att:att,gr:gr,gw:gw,tok:tok,tac:tac,S:S,B:B,N:N,hw:hw,hwDone:hw.filter(function(n){return n.done;}).length,stories:X.rangeItems(from,to,'sr').length,play:X.rangeItems(from,to,'pl').length,slp:slp,hrs:hrs,ft:X.rangeItems(from,to,'ft')};}
  function repBody(R,y,m,forFile){var k=X.kid(),age=X.age(k.dob),cen=X.center(),D=repData(y,m),gs=goals(function(g){return g.st!=='prop';}),used={};
    var h='<div class="rephead"><div><p class="eyebrow">'+esc(cen.name||'رحلة '+(k.name||''))+'</p><h1>التقرير الشهري · '+MON[m-1]+' '+ar(y)+'</h1><p class="muted">'+esc(k.name||'')+(age!=null?' · '+ar(age)+' '+(age>2&&age<11?'سنوات':'سنة'):'')+(X.me.id&&X.nm(X.me.id)?' · أعدّه: '+esc(X.nm(X.me.id)):'')+'</p></div></div>';
    h+='<div class="tiles rep">'+A.st(ar(D.days),'يوم تدريب')+A.st(ar(D.att),'محاولة نطق')+A.st((D.gr+D.gw)?ar(X.pct(D.gr,D.gr+D.gw))+'٪':'—','دقة الألعاب')+A.st(ar(D.c.tok||0),'نجمة')+A.st(ar(D.c.brk||0),'طلب راحة')+A.st(ar(D.S.length),'جلسة مسجلة')+A.st(ar(D.B.length),'سلوك مسجل')+A.st(D.hw.length?ar(D.hwDone)+' / '+ar(D.hw.length):'—','واجبات منجزة')+'</div>';
    h+='<h2 class="rh">أهداف الخطة الفردية</h2>';
    if(!gs.length)h+='<p class="muted">لا توجد أهداف معتمدة بعد.</p>';
    else{h+='<div class="tscroll"><table class="rtable"><thead><tr><th>المجال</th><th>الهدف</th><th>خط الأساس</th><th>جلسات الشهر</th><th>آخر نسبة</th><th>الحالة</th></tr></thead><tbody>'+gs.map(function(g){var ss=D.S.filter(function(s){return s.g===g.id;}).sort(function(a,b){return a.ts-b.ts;}),last=ss[ss.length-1];(g.ebp||[]).forEach(function(e){used[e]=1;});
        return '<tr><td>'+esc((DOMBY[g.dom]||DOM[0])[1])+'</td><td>'+esc(g.t)+'</td><td>'+esc(g.base||'—')+'</td><td class="num">'+ar(ss.length)+'</td><td class="num">'+(last?ar(last.pi||0)+'٪':'—')+'</td><td>'+(GST[g.st||'act']||GST.act)[0]+'</td></tr>';}).join('')+'</tbody></table></div>';
      gs.forEach(function(g){var ss=D.S.filter(function(s){return s.g===g.id;}).sort(function(a,b){return a.ts-b.ts;});if(ss.length<2)return;h+='<div class="rgoal"><b>'+esc(g.t.slice(0,90))+(g.t.length>90?'…':'')+'</b>'+X.line(ss.map(function(s){return X.dateTxt(s.d,true);}),[{n:'مستقل',v:ss.map(function(s){return s.pi||0;}),c:forFile?'#2465D0':X.C1}],{pct:true,goal:crit(g).p,h:130,label:'منحنى الهدف'})+'</div>';});}
    h+='<h2 class="rh">التواصل والطلب</h2><p>طلب بالكلام '+X.g('لحاله','لحالها')+': <b class="num">'+ar(D.c.spont||0)+'</b> · بعد سؤال أو تلقين: <b class="num">'+ar(D.c.asked||0)+'</b> · سحب اليد: <b class="num">'+ar(D.c.pull||0)+'</b> · ضغطات لوحة «أطلب»: <b class="num">'+ar(D.c.board||0)+'</b></p>';
    if(D.B.length){var fns={};D.B.forEach(function(e){var f=e.fn||fnOf(e);fns[f]=(fns[f]||0)+1;});var top=Object.keys(fns).sort(function(a,b){return fns[b]-fns[a];})[0];
      h+='<h2 class="rh">السلوك</h2><p>'+ar(D.B.length)+' مرة هذا الشهر. الوظيفة المحتملة الأكثر تكراراً: <b>'+esc(FN[top][0])+'</b>.</p>';FN[top][1].forEach(function(e){used[e]=1;});
      var days=[],cnt=[];for(var i=1;i<=D.nd;i++){var dd=y+'-'+A.pad(m)+'-'+A.pad(i);days.push(ar(i));cnt.push(D.B.filter(function(e){return e.d===dd;}).length);}
      h+=X.bars(days,[{n:'مرات',v:cnt,c:forFile?'#B85600':X.C2}],{h:120,label:'السلوك يومياً'});}
    if(D.tok+D.tac)h+='<h2 class="rh">تدريب الحمام</h2><p>نجاح: <b class="num">'+ar(D.tok)+'</b> · حوادث: <b class="num">'+ar(D.tac)+'</b> · نسبة النجاح: <b class="num">'+ar(X.pct(D.tok,D.tok+D.tac))+'٪</b></p>';
    if(D.hrs.length)h+='<h2 class="rh">النوم</h2><p>متوسط النوم: <b class="num">'+ar(Math.round(D.hrs.reduce(function(a,b){return a+b;},0)*10/D.hrs.length)/10)+'</b> ساعة في '+ar(D.hrs.length)+' ليلة مسجلة.</p>';
    if(D.ft.length)h+='<p>تجارب أطعمة جديدة: <b class="num">'+ar(D.ft.length)+'</b>.</p>';
    if(D.c.brk)used.FCT=1;if(D.stories)used.SN=1;if(D.play)used.PBII=1;if(D.att)used.DTT=1;if(D.c.tok)used.R=1;if(D.days)used.VS=1;if(D.hw.length)used.PII=1;if(D.B.length)used.FBA=1;
    var ue=Object.keys(used).map(X.ebp).filter(Boolean);
    if(ue.length)h+='<h2 class="rh">الممارسات المثبتة المستخدمة هذا الشهر</h2><p>'+ue.map(function(e){return esc(e.ar);}).join('، ')+'.</p>';
    var rn=X.col('rep').get(y+'-'+A.pad(m))||{};
    h+='<h2 class="rh">ملاحظات الأخصائي وتوصياته</h2>'+(forFile?'<p>'+esc(rn.sum||'—').replace(/\n/g,'<br>')+'</p>':(X.can('rep')?X.area('data-xrep="1" class="noprint-border"',rn.sum||'','اكتب ملخص الشهر وتوصيات الشهر القادم'):'<p>'+esc(rn.sum||'لم تُكتب بعد.')+'</p>'));
    h+='<p class="muted src">أداة تعليمية تنظيمية تدعم خطة الأخصائي ولا تشخّص ولا تعالج. الممارسات حسب '+esc(EBPSRC.cite)+'</p>';
    return h;}
  X.repBody=repBody;
  function drawRep(){var R=this;
    var h='<div class="row noprint"><button class="iconbtn" data-act="xrepm" data-d="-1" aria-label="الشهر السابق">'+I('right')+'</button><b class="grow" style="text-align:center">'+MON[R.m-1]+' '+ar(R.y)+'</b><button class="iconbtn" data-act="xrepm" data-d="1" aria-label="الشهر التالي">'+I('left')+'</button></div>';
    h+='<div class="report" id="report">'+repBody(R,R.y,R.m,false)+'</div>';
    h+='<button class="btn big noprint" data-act="xrepdl">'+I('download')+' نزّل التقرير</button><p class="muted noprint">يُحفظ ملفاً تفتحه في المتصفح، ثم تطبعه أو تحفظه PDF من قائمة المشاركة وترسله للأسرة أو المركز.</p>';
    return X.page('التقرير الشهري',h,{cls:'repov'});}
  X.on('xrepm',function(b,d){var R=X.top('rep');if(!R)return;R.m+=+d('d');if(R.m<1){R.m=12;R.y--;}if(R.m>12){R.m=1;R.y++;}A.redraw();});
  X.onChange(function(t){if(!t.getAttribute('data-xrep'))return false;var R=X.top('rep');if(!R)return true;X.col('rep').put(R.y+'-'+A.pad(R.m),{sum:t.value.slice(0,3000),by:X.me.id||''}).then(function(){A.toast('حُفظت الملاحظات');},A.saveErr);return true;});
  X.on('xrepdl',function(){var R=X.top('rep');if(!R)return;var k=X.kid();
    var css='body{font-family:-apple-system,"SF Arabic","IBM Plex Sans Arabic",Tahoma,sans-serif;direction:rtl;color:#1C2333;max-width:820px;margin:24px auto;padding:0 16px;line-height:1.6}h1{font-size:24px;margin:4px 0}h2{font-size:18px;margin:22px 0 8px;border-bottom:2px solid #E4E8EF;padding-bottom:4px}.eyebrow{color:#5B6577;font-weight:700;margin:0}.muted{color:#5B6577;font-size:13px}.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.stat{border:1px solid #E4E8EF;border-radius:12px;padding:10px}.stat .v{font-size:22px;font-weight:800}.stat .l{font-size:12px;color:#5B6577}table{width:100%;border-collapse:collapse;font-size:13px}th,td{border:1px solid #E4E8EF;padding:6px;text-align:right;vertical-align:top}th{background:#F3F5F9}svg{width:100%;height:auto}svg text{font-size:10px;fill:#5B6577}.gl{stroke:#E4E8EF}.goal{stroke:#1E8546;stroke-dasharray:4 4}.gt,.vl{fill:#1C2333}.rgoal{margin:10px 0}@media print{body{margin:0}h2{break-after:avoid}table,.rgoal{break-inside:avoid}}';
    var html='<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>التقرير الشهري '+esc(k.name||'')+'</title><style>'+css+'</style></head><body>'+repBody(R,R.y,R.m,true)+'</body></html>';
    X.download('تقرير-'+(k.name||'الطفل')+'-'+R.y+'-'+A.pad(R.m)+'.html',html,'text/html');});
};
})();
