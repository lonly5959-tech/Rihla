/* px_core.js — shared core for the extension sections of رحلة:
   per-child data stores, children and team roles, the sections hub, the NCAEP practices library,
   practice chips on every section, privacy and consent, the safety card, charts and media helpers.
   Feature files register into window.PXF; the main app calls window.PXM with its internal API. */
(function(){
'use strict';
window.PXF=window.PXF||{};
window.PXM=window.PXM||[];
window.PXM.push(function(A){
  var X={A:A,acts:{},chg:[],ticks:[],syncs:[],inj:{},texts:[],after:{},secOpen:{},hubTiles:[],actTiles:[],needs:[]};
  var esc=A.esc,ar=A.ar,layer=document.getElementById('layer');
  X.esc=esc;X.ar=ar;X.layer=layer;
  var I=function(n,c){return A.I_(n,c);};X.I=I;
  X.on=function(n,f){X.acts[n]=f;};
  X.onChange=function(f){X.chg.push(f);};
  X.onTick=function(f){X.ticks.push(f);};
  X.onSync=function(f){X.syncs.push(f);};
  X.inject=function(n,f){(X.inj[n]=X.inj[n]||[]).push(f);};
  X.onText=function(f){X.texts.push(f);};
  X.onAfter=function(tab,f){(X.after[tab]=X.after[tab]||[]).push(f);};
  X.rid=function(p){return (p||'')+Date.now().toString(36)+A.rid(3);};
  X.pct=function(a,b){return b?Math.round(a*100/b):0;};
  X.today=A.today;

  /* ---------- icons used by the extension ---------- */
  var ICONS={
    heart:'<path d="M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z"/>',
    book:'<path d="M3 5.6c3-1.6 6-1.6 9 0v14c-3-1.6-6-1.6-9 0zM21 5.6c-3-1.6-6-1.6-9 0v14c3-1.6 6-1.6 9 0z"/>',
    users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16.6 14.6c2.6.1 4.4 1.8 4.9 4.9"/>',
    drop:'<path d="M12 3.5s-6 6.6-6 10.8a6 6 0 0 0 12 0C18 10.1 12 3.5 12 3.5z"/>',
    shield:'<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    pulse:'<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
    zap:'<path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12z"/>',
    chat:'<path d="M20.5 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 20.5 12z"/>',
    doc:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    cap:'<path d="M2.5 9L12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.5c1.5 1.6 3.4 2.5 5.5 2.5s4-.9 5.5-2.5V11M21.5 9v5"/>',
    moon:'<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
    layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 16.5l9 5 9-5"/>',
    kid:'<circle cx="12" cy="6.5" r="3"/><path d="M8.5 21v-5.5L6 12l3-2h6l3 2-2.5 3.5V21"/>',
    hand:'<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 10.5v-6a1.5 1.5 0 0 1 3 0v6M14 10.5V6.2a1.5 1.5 0 0 1 3 0V12M17 10a1.5 1.5 0 0 1 3 0v4.2a6.8 6.8 0 0 1-6.8 6.8h-.9a6.4 6.4 0 0 1-5.3-2.8L4.2 15.6a1.5 1.5 0 0 1 2.4-1.8L8 15.3"/>',
    wind:'<path d="M3 9h11a3 3 0 1 0-3-3M3 15h14a3 3 0 1 1-3 3M3 12h7"/>',
    trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    download:'<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 20h14"/>',
    print:'<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/>',
    left:'<path d="M15 6l-6 6 6 6"/>',
    right:'<path d="M9 6l6 6-6 6"/>',
    phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    swap:'<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
    music:'<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    run:'<circle cx="14.5" cy="4.5" r="2"/><path d="M7 21l3.2-6.2L13 17v4M5.5 11.2L9 8.4l4.2.9 2.6 3 3.2.9M10.2 14.8L11.5 9"/>',
    eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.4"/>',
    link:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    smile:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0M9 9.6v.3M15 9.6v.3"/>',
    grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
    send:'<path d="M20.5 3.5L10 14M20.5 3.5l-6.5 17-4-6.5-6.5-4z"/>',
    flag:'<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>'
  };
  (function(){var s='<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
    for(var k in ICONS)s+='<symbol id="i-'+k+'" viewBox="0 0 24 24">'+ICONS[k]+'</symbol>';
    document.body.insertAdjacentHTML('afterbegin',s+'</svg>');})();

  /* ---------- data: per-child collections and shared (root) collections ---------- */
  var STO={};
  function makeStore(name,root,opt){
    var scope=root?'root':A.KID(),key=scope+':'+name;
    if(STO[key])return STO[key];
    if(!opt){var nd=X.needs.filter(function(q){return q.n===name&&q.r===!!root;})[0];opt=(nd&&nd.o)||{};}var lk='px:'+key,m={};
    try{var raw=localStorage.getItem(lk);if(raw)m=JSON.parse(raw)||{};}catch(e){}
    var q={},s={name:name,root:!!root,m:m,loaded:false};
    s.save=function(){try{localStorage.setItem(lk,JSON.stringify(s.m));}catch(e){}};
    s.get=function(id){return s.m[id]||null;};
    s.list=function(f){var out=[];for(var k in s.m){var v=s.m[k];if(v&&(!f||f(v,k)))out.push(Object.assign({},v,{id:k}));}return out;};
    s.h=function(){return root?A.rawDb():A.db();};
    function chain(id,run){var p=(q[id]||Promise.resolve()).then(run,run);q[id]=p.catch(function(){});return p;}
    s.put=function(id,doc){
      if(!A.canEdit())return Promise.reject({code:'ro'});
      var d=JSON.parse(JSON.stringify(doc||{}));delete d.id;d.u=Date.now();
      var prev=s.m[id];s.m[id]=d;s.save();
      var h=s.h();if(!h)return Promise.resolve(d);
      return chain(id,function(){return A.dbTry(function(){return h.doc(name+'/'+id).set(d);});}).then(function(){return d;},function(e){if(s.m[id]===d){if(prev)s.m[id]=prev;else delete s.m[id];s.save();}throw e;});
    };
    s.patch=function(id,part){var cur=Object.assign({},s.m[id]||{});for(var k in part){var v=part[k];if(v===undefined||v===null||v==='')delete cur[k];else cur[k]=v;}return s.put(id,cur);};
    s.del=function(id){
      if(!A.canEdit())return Promise.reject({code:'ro'});
      var prev=s.m[id];delete s.m[id];s.save();var h=s.h();if(!h)return Promise.resolve();
      return chain(id,function(){return A.dbTry(function(){return h.doc(name+'/'+id).delete();});}).catch(function(e){if(prev){s.m[id]=prev;s.save();}throw e;});
    };
    s.load=function(){var h=s.h();if(!h)return Promise.resolve(false);var c=h.collection(name);if(opt.order)c=c.orderBy(opt.order,'desc');
      return c.limit(opt.limit||1000).get().then(function(r){var nm={};r.docs.forEach(function(doc){var v=doc.data();if(v)nm[doc.id]=v;});s.m=nm;s.loaded=true;s.save();return true;});};
    STO[key]=s;return s;
  }
  X.col=function(name,opt){return makeStore(name,false,opt);};
  X.rcol=function(name,opt){return makeStore(name,true,opt);};
  /* stores loaded after every cloud sync; per-child ones follow the current child */
  X.need=function(name,root,opt){X.needs.push({n:name,r:!!root,o:opt||{}});};
  X.need('kids',true);X.need('team',true);X.need('cfg',true);
  X.loadAll=function(){
    var ps=X.needs.map(function(n){var s=n.r?X.rcol(n.n,n.o):X.col(n.n,n.o);return s.load().catch(function(){return false;});});
    return Promise.all(ps);
  };
  /* refresh a few collections when a screen opens, then redraw it if it is still open */
  X.fresh=function(list,type){Promise.all(list.map(function(n){var s=n.charAt(0)==='@'?X.rcol(n.slice(1)):X.col(n);return s.load().catch(function(){});})).then(function(){if(!type||X.top(type))A.redraw();});};
  X.save=function(p,msg){return p.then(function(){if(msg)A.toast(msg);A.redraw();},function(e){A.saveErr(e);A.redraw();});};

  /* ---------- day logs (the app's own per-device day documents) ---------- */
  X.dayItems=function(d,key){var out=[],SD=A.S().days;for(var k in SD){var x=SD[k];if(x&&x.date===d&&x[key])out=out.concat(x[key]);}return out;};
  X.rangeItems=function(from,to,key){var out=[],SD=A.S().days;for(var k in SD){var x=SD[k];if(x&&x.date>=from&&x.date<=to&&x[key])x[key].forEach(function(it){out.push(Object.assign({d:x.date,who:x.who},it));});}return out;};
  X.rangeCount=function(from,to,ck){var n=0,SD=A.S().days;for(var k in SD){var x=SD[k];if(x&&x.date>=from&&x.date<=to&&x.c)n+=x.c[ck]||0;}return n;};
  X.dayCount=function(d,ck){return A.aggDay(d).c[ck]||0;};
  X.log=function(key,item,max){var d=A.today(),x=A.mutDay(d);x[key]=x[key]||[];item.ts=item.ts||Date.now();x[key].push(item);if(x[key].length>(max||60))x[key]=x[key].slice(-(max||60));A.touch(d);return item;};
  X.unlog=function(key,ts){var d=A.today(),x=A.mutDay(d);if(!x[key])return false;var n=x[key].length;x[key]=x[key].filter(function(it){return it.ts!==ts;});if(x[key].length!==n){A.touch(d);return true;}return false;};
  X.cnt=function(ck,n){var d=A.today(),x=A.mutDay(d);x.c[ck]=Math.max(0,(x.c[ck]||0)+(n==null?1:n));A.touch(d);};
  X.days=function(n,end){var out=[],e=end||A.today();for(var i=n-1;i>=0;i--)out.push(A.addDays(e,-i));return out;};
  X.star=function(why){A.earn(1);if(!A.S().set.calm)A.toast((why?why+' · ':'')+'نجمة جديدة ل'+X.kn());};

  /* ---------- children ---------- */
  var DEFKID={name:window.__DEFNAME||'بطلنا',g:'m'};
  X.kids=function(){var m=X.rcol('kids').m,out=[];if(!m.main)out.push(Object.assign({id:'main'},DEFKID));
    Object.keys(m).forEach(function(k){if(!m[k].del)out.push(Object.assign({},m[k],{id:k}));});
    out.sort(function(a,b){return a.id==='main'?-1:b.id==='main'?1:(a.c||0)-(b.c||0);});return out;};
  X.kid=function(id){id=id||A.KID();var k=X.rcol('kids').get(id);if(k&&!k.del)return Object.assign({id:id},k);return id==='main'?Object.assign({id:'main'},DEFKID):{id:id,name:'طفل',g:'m'};};
  X.kn=function(){return X.kid().name||'الطفل';};
  X.isF=function(){return X.kid().g==='f';};
  X.g=function(m,f){return X.isF()?f:m;};
  X.age=function(dob){if(!dob)return null;var b=new Date(dob+'T12:00:00'),n=new Date(),y=n.getFullYear()-b.getFullYear();if(n.getMonth()<b.getMonth()||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate()))y--;return y>=0&&y<40?y:null;};
  function pushKid(){var k=X.kid();A.setKidInfo({name:k.name||DEFKID.name,g:k.g||'m',dob:k.dob||'',country:k.country||''});}
  X.pushKid=pushKid;
  X.kidPhoto=function(k,cls){k=k||X.kid();return '<span class="kav'+(cls?' '+cls:'')+'">'+(k.photo?'<img alt="" src="'+X.assetUrl(k.photo)+'">':I('kid'))+'</span>';};

  /* ---------- who is using the app, and their role ---------- */
  X.me={id:null};var NAMES={},NAMEQ={};X.allNames=function(){return NAMES;};
  var ROLES={admin:'مدير',spec:'أخصائي',parent:'ولي أمر',view:'مشاهد'};X.ROLES=ROLES;
  var PERM={admin:'*',spec:'iep sess beh note rep lib train sleep child vm sto toil emo play team',parent:'note beh child train sleep vm sto toil emo play sessHome',view:'lib'};
  X.center=function(){return X.rcol('cfg').get('center')||{};};
  X.role=function(){
    if(!A.canEdit())return 'view';
    var t=X.me.id&&X.rcol('team').get(X.me.id);if(t&&t.role&&ROLES[t.role])return t.role;
    if(A.ROLE.owner)return 'admin';
    if(X.center().strict)return A.S().set.who==='th'?'spec':'parent';
    return 'admin';
  };
  X.can=function(p){var s=PERM[X.role()];return s==='*'||(' '+s+' ').indexOf(' '+p+' ')>=0;};
  X.kidsVisible=function(){var all=X.kids();if(X.role()==='admin')return all;var t=X.me.id&&X.rcol('team').get(X.me.id);
    if(t&&t.kids&&t.kids.length)return all.filter(function(k){return t.kids.indexOf(k.id)>=0;});return X.center().strict?all.filter(function(k){return k.id===A.KID();}):all;};
  X.nm=function(id){var p=NAMES[id];return (p&&p.name)||'';};
  X.whoLabel=function(it){var n=it&&it.by?X.nm(it.by):'';var w=it&&it.who?(A.WHO[it.who]||it.who):'';return n||w||'';};
  X.names=function(ids){
    if(!X.user||!X.user.profiles)return;ids=ids.filter(function(id){return id&&!NAMES[id]&&!NAMEQ[id];});if(!ids.length)return;
    ids.forEach(function(id){NAMEQ[id]=1;});
    Promise.resolve(X.user.profiles(ids.slice(0,60))).then(function(ps){var any=false;Object.keys(ps||{}).forEach(function(id){NAMES[id]=ps[id];any=true;});if(any)A.redraw();}).catch(function(){});
  };
  function initUser(n){
    if(!window.claude||!window.claude.use){if(n>0)setTimeout(function(){initUser(n-1);},900);return;}
    Promise.resolve(window.claude.use('user')).then(function(u){if(!u)return;X.user=u;
      return Promise.resolve(u.id?u.id():null).then(function(id){X.me.id=id||null;if(id)X.names([id]);});}).catch(function(){});
  }
  initUser(5);
  function presence(){
    if(window.__STANDALONE||!X.me.id||!A.canEdit())return;var T=X.rcol('team'),t=T.get(X.me.id);
    if(!t||(Date.now()-(t.seen||0))>864e5){var d=Object.assign({},t||{});d.seen=Date.now();if(!t)d.since=Date.now();T.put(X.me.id,d).catch(function(){});}
  }

  /* ---------- page shell, navigation and small UI pieces ---------- */
  X.page=function(title,body,opt){opt=opt||{};
    return '<div class="overlay px'+(opt.cls?' '+opt.cls:'')+'" role="dialog" aria-label="'+esc(title)+'"><header><button class="iconbtn" data-act="close" aria-label="رجوع">'+I('x')+'</button><span class="ttl">'+esc(title)+'</span>'+(opt.right||'')+'</header><div class="stage" style="align-items:stretch"><div class="inner wide">'+body+'</div></div>'+(opt.foot||'')+'</div>';};
  X.open=function(type,render,st){st=st||{};st.type='x-'+type;st.draw=function(){layer.innerHTML=render.call(this,this);if(this.after)this.after(layer);};A.openOv(st);return st;};
  X.top=function(type){var t=A.TOP();return t&&t.type==='x-'+type?t:null;};
  X.chip=function(t,cls){return '<span class="chip'+(cls?' '+cls:'')+'">'+t+'</span>';};
  X.seg=function(act,val,opts,extra){return '<div class="seg" style="grid-template-columns:repeat('+opts.length+',1fr)" role="group">'+opts.map(function(o){return '<button data-act="'+act+'" data-v="'+o[0]+'"'+(extra||'')+' aria-pressed="'+(String(val)===String(o[0]))+'">'+o[1]+'</button>';}).join('')+'</div>';};
  X.field=function(label,inner){return '<label class="fld"><span>'+label+'</span>'+inner+'</label>';};
  X.input=function(attr,val,type,ph){return '<input '+attr+(type?' type="'+type+'"':'')+' value="'+esc(val==null?'':val)+'"'+(ph?' placeholder="'+esc(ph)+'"':'')+'>';};
  X.area=function(attr,val,ph){return '<textarea '+attr+(ph?' placeholder="'+esc(ph)+'"':'')+'>'+esc(val||'')+'</textarea>';};
  X.empty=function(t,sub){return '<div class="pxempty">'+(sub?'<b>'+t+'</b><p class="muted">'+sub+'</p>':'<p class="muted">'+t+'</p>')+'</div>';};
  X.dateTxt=function(d,short){return A.niceDate(d,short);};
  X.timeTxt=function(ts){var x=new Date(ts);return A.fmtHM(A.pad(x.getHours())+':'+A.pad(x.getMinutes()));};
  X.dstr=function(ts){var x=new Date(ts);return x.getFullYear()+'-'+A.pad(x.getMonth()+1)+'-'+A.pad(x.getDate());};
  X.ago=function(ts){var m=Math.round((Date.now()-ts)/60000);if(m<1)return 'الآن';if(m<60)return 'قبل '+ar(m)+' د';var h=Math.round(m/60);if(h<24)return 'قبل '+ar(h)+' س';return X.dateTxt(X.dstr(ts),true);};
  X.tile=function(t){return '<button class="htile" data-act="xsec" data-id="'+t.id+'" style="--hc:var('+(t.col||'--brand-ink')+')"><span class="hic">'+I(t.ic)+'</span><span class="ht">'+esc(t.t)+'</span>'+(t.sub?'<span class="hs">'+t.sub()+'</span>':'')+(t.badge&&t.badge()?'<i class="hb">'+t.badge()+'</i>':'')+'</button>';};
  X.openSec=function(id){var f=X.secOpen[id];if(f){f();return true;}
    if(['today','sounds','board','games','org','progress'].indexOf(id)>=0){A.STACK().length=0;layer.innerHTML='';A.go(id);return true;}return false;};
  X.on('xsec',function(b,d){X.openSec(d('id'));});
  /* record or upload a voice for any extension card (reuses the app's own media pipeline) */
  X.voiceBtns=function(id,small){if(!A.canEdit())return '';var c=small?' small':'';
    return '<div class="row"><label class="btn'+c+' grow">'+I('mic')+' سجّل بصوتك<input type="file" accept="video/*" capture="user" data-up="a" data-id="'+id+'"></label><label class="btn ghost'+c+' grow">'+I('folder')+' ملف صوتي<input type="file" accept="audio/*,.m4a,.mp3,.wav,.aac" data-up="a" data-id="'+id+'"></label></div>'+
      (A.hasA(id)?'<div class="row"><button class="btn line small grow" data-act="xplay" data-id="'+id+'">'+I('play')+' اسمع تسجيلك</button><button class="btn danger small" data-act="xdelrec" data-id="'+id+'">'+I('trash')+' احذف</button></div>':'');};
  X.photoBtns=function(id,small){if(!A.canEdit())return '';return '<div class="row"><label class="btn ghost'+(small?' small':'')+' grow">'+I('camera')+' صورتكم<input type="file" accept="image/*" data-up="p" data-id="'+id+'"></label>'+(A.ptr(id,'p')?'<button class="btn danger small" data-act="xdelpic" data-id="'+id+'">'+I('trash')+'</button>':'')+'</div>';};
  X.on('xplay',function(b,d){if(!A.say(d('id')))A.toast('لا يوجد صوت لهذه البطاقة بعد');});
  X.on('xdelrec',function(b,d){A.setBusy('جارٍ الحذف…');A.delMedia('a',d('id')).then(function(){A.setBusy('');A.redraw();A.toast('حُذف التسجيل');},function(e){A.setBusy('');A.saveErr(e);});});
  X.on('xdelpic',function(b,d){A.setBusy('جارٍ الحذف…');A.delMedia('p',d('id')).then(function(){A.setBusy('');A.redraw();A.toast('حُذفت الصورة');},function(e){A.setBusy('');A.saveErr(e);});});
  /* speak a card: own recording, app voice, or the device voice when chosen */
  X.say=function(id,slow){return A.say(id,slow);};

  /* ---------- assets (videos, child photos, attachments) and downloads ---------- */
  var ASSETS=null,DL=null;
  X.assetsP=function(){if(ASSETS)return Promise.resolve(ASSETS);if(!window.claude||!window.claude.use)return Promise.resolve(null);return Promise.resolve(window.claude.use('assets')).then(function(a){ASSETS=a||null;return ASSETS;},function(){return null;});};
  X.assetUrl=function(id){return (window.__BLOBBASE||'/_blob/')+id;};
  X.canUpload=function(){return A.canEdit();};
  X.upAsset=function(file,o){o=o||{};
    return X.assetsP().then(function(as){if(!as)throw {code:'noassets'};
      var p=Promise.resolve(file);
      if(/^video\//.test(file.type||'')||o.video)p=X.fitVideo(file);
      else if(/^image\//.test(file.type||'')&&!o.raw)p=A.processImage(file).then(function(r){return r.blob;});
      return p.then(function(bl){if(bl.size>20*1048576)throw {code:'big'};return as.upload(bl);});});
  };
  /* keep phone videos small: short clips upload as they are, long or heavy ones are re-encoded at 640px */
  X.fitVideo=function(file){
    return new Promise(function(res,rej){
      var v=document.createElement('video'),url=URL.createObjectURL(file);v.muted=true;v.playsInline=true;v.preload='metadata';v.src=url;
      var fail=function(code){try{URL.revokeObjectURL(url);}catch(e){}rej({code:code});};
      v.onerror=function(){if(file.size<=18*1048576){try{URL.revokeObjectURL(url);}catch(e){}res(file);}else fail('vformat');};
      v.onloadedmetadata=function(){
        var dur=v.duration||0;if(dur>90)return fail('vlong');
        if(file.size<=18*1048576){try{URL.revokeObjectURL(url);}catch(e){}return res(file);}
        if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return fail('big');
        var w=v.videoWidth||640,h=v.videoHeight||360,s=Math.min(1,640/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*s/2)*2;c.height=Math.round(h*s/2)*2;
        var g=c.getContext('2d'),st=c.captureStream(24),mt=['video/mp4','video/webm;codecs=vp8','video/webm'].filter(function(t){return MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t);})[0];
        try{var AC=window.AudioContext||window.webkitAudioContext,ac=new AC(),src=ac.createMediaElementSource(v),dst=ac.createMediaStreamDestination();src.connect(dst);dst.stream.getAudioTracks().forEach(function(t){st.addTrack(t);});v.muted=false;}catch(e){}
        var rec,chunks=[];try{rec=new MediaRecorder(st,mt?{mimeType:mt,videoBitsPerSecond:900000}:{videoBitsPerSecond:900000});}catch(e){return fail('big');}
        rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
        rec.onstop=function(){try{URL.revokeObjectURL(url);}catch(e){}var b=new Blob(chunks,{type:(mt||'video/webm').split(';')[0]});if(!b.size)return rej({code:'vformat'});res(b);};
        var draw=function(){if(v.ended||v.paused){if(rec.state!=='inactive')rec.stop();return;}g.drawImage(v,0,0,c.width,c.height);requestAnimationFrame(draw);};
        v.onended=function(){if(rec.state!=='inactive')rec.stop();};
        rec.start(500);v.play().then(draw,function(){fail('vformat');});
      };
    });
  };
  X.upErr=function(e){var m={noassets:'رفع الملفات متاح لمن يملك صلاحية التعديل وبعد تسجيل الدخول.',big:'الملف كبير جداً. صوّر مقطعاً أقصر، نحو ١٠ ثوانٍ.',vlong:'الفيديو أطول من دقيقة ونصف. اختر مقطعاً أقصر.',vformat:'لم أستطع قراءة هذا الفيديو. جرّب تصويره من جديد.'};A.setBusy('');A.toast(m[e&&e.code]||A.errText(e),1);};
  X.dlP=function(){if(DL)return Promise.resolve(DL);if(!window.claude||!window.claude.use)return Promise.resolve(null);return Promise.resolve(window.claude.use('downloads')).then(function(d){DL=d||null;return DL;},function(){return null;});};
  X.download=function(filename,data,mime){
    return X.dlP().then(function(dl){
      if(dl)return dl.save({filename:filename,data:data}).then(function(){A.toast('تم حفظ الملف');},function(e){if(e&&e.code!=='declined'&&e.code!=='cancelled')A.toast('لم يُحفظ الملف',1);});
      A.toast('التنزيل غير متاح هنا. افتح التطبيق من claude.ai بعد تسجيل الدخول.',1);
    });
  };

  /* ---------- charts: thin marks, recessive axes, one hue per series ---------- */
  X.bars=function(cats,series,o){o=o||{};var W=o.w||320,H=o.h||150,P=24,B=22,n=cats.length,mx=o.max||0;
    series.forEach(function(s){s.v.forEach(function(v,i){var t=o.stack?series.reduce(function(a,q){return a+(q.v[i]||0);},0):v;if(t>mx)mx=t;});});mx=mx||1;
    var cw=(W-P-4)/n,bw=Math.max(4,Math.min(26,(o.stack?cw:cw/series.length)-4)),y=function(v){return H-B-(v/mx)*(H-B-10);};
    var g='<svg viewBox="0 0 '+W+' '+H+'" class="pxchart" role="img" aria-label="'+esc(o.label||'')+'">';
    [0,.5,1].forEach(function(f){var yy=y(mx*f);g+='<line x1="'+P+'" x2="'+W+'" y1="'+yy+'" y2="'+yy+'" class="gl"/><text x="'+(P-4)+'" y="'+(yy+4)+'" text-anchor="end">'+ar(Math.round(mx*f))+'</text>';});
    cats.forEach(function(c,i){var x0=P+i*cw+(cw-(o.stack?bw:bw*series.length+2*(series.length-1)))/2,acc=0;
      series.forEach(function(s,j){var v=s.v[i]||0;if(!v){if(!o.stack)x0+=bw+2;return;}
        var top=o.stack?y(acc+v):y(v),bot=o.stack?y(acc):H-B,hgt=Math.max(1,bot-top-(o.stack&&acc?2:0)),xx=o.stack?x0:x0;
        g+='<path class="mk" fill="'+s.c+'" d="'+rbar(xx,top,bw,hgt,!o.stack||j===series.length-1||!series.slice(j+1).some(function(q){return q.v[i];}))+'"><title>'+esc(c+': '+(s.n?s.n+' ':'')+ar(v))+'</title></path>';
        if(o.stack)acc+=v;else x0+=bw+2;});
      if(o.labels!==false&&(n<=10||i%Math.ceil(n/8)===0||i===n-1))g+='<text x="'+(P+i*cw+cw/2)+'" y="'+(H-6)+'" text-anchor="middle">'+esc(c)+'</text>';});
    return g+'</svg>';};
  function rbar(x,y,w,h,round){var r=round?Math.min(4,w/2,h):0;return 'M'+x+' '+(y+h)+'V'+(y+r)+(r?'Q'+x+' '+y+' '+(x+r)+' '+y:'')+'H'+(x+w-r)+(r?'Q'+(x+w)+' '+y+' '+(x+w)+' '+(y+r):'')+'V'+(y+h)+'Z';}
  X.line=function(cats,series,o){o=o||{};var W=o.w||320,H=o.h||160,P=30,B=22,n=Math.max(cats.length,2),mx=o.max||100;
    var x=function(i){return P+6+(n===1?0:i*(W-P-16)/(n-1));},y=function(v){return H-B-(v/mx)*(H-B-12);};
    var g='<svg viewBox="0 0 '+W+' '+H+'" class="pxchart" role="img" aria-label="'+esc(o.label||'')+'">';
    [0,50,100].forEach(function(f){var v=mx*f/100,yy=y(v);g+='<line x1="'+P+'" x2="'+W+'" y1="'+yy+'" y2="'+yy+'" class="gl"/><text x="'+(P-4)+'" y="'+(yy+4)+'" text-anchor="end">'+ar(Math.round(v))+(o.pct?'٪':'')+'</text>';});
    if(o.goal!=null){var gy=y(o.goal);g+='<line x1="'+P+'" x2="'+W+'" y1="'+gy+'" y2="'+gy+'" class="goal"/><text x="'+W+'" y="'+(gy-4)+'" text-anchor="end" class="gt">المعيار '+ar(o.goal)+(o.pct?'٪':'')+'</text>';}
    series.forEach(function(s){var pts=[];s.v.forEach(function(v,i){if(v!=null)pts.push([x(i),y(v),v,i]);});if(!pts.length)return;
      g+='<polyline fill="none" stroke="'+s.c+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="'+pts.map(function(p){return p[0]+','+p[1];}).join(' ')+'"/>';
      pts.forEach(function(p){g+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="'+s.c+'" stroke="var(--surface)" stroke-width="2"><title>'+esc(cats[p[3]]+': '+(s.n?s.n+' ':'')+ar(p[2])+(o.pct?'٪':''))+'</title></circle>';});
      var l=pts[pts.length-1];g+='<text x="'+Math.min(W-2,l[0]+2)+'" y="'+(l[1]-8)+'" text-anchor="end" class="vl">'+ar(l[2])+(o.pct?'٪':'')+'</text>';});
    cats.forEach(function(c,i){if(cats.length<=8||i%Math.ceil(cats.length/7)===0||i===cats.length-1)g+='<text x="'+x(i)+'" y="'+(H-6)+'" text-anchor="middle">'+esc(c)+'</text>';});
    return g+'</svg>';};
  X.legend=function(items){return '<div class="legend">'+items.map(function(it){return '<span><i style="background:'+it[1]+'"></i>'+esc(it[0])+'</span>';}).join('')+'</div>';};
  X.C1='var(--c1)';X.C2='var(--c2)';

  /* ---------- NCAEP practices: chips, practice sheet, library ---------- */
  var EB={};(window.EBP||[]).forEach(function(e){EB[e.id]=e;});
  X.ebp=function(id){return EB[id]||null;};
  X.ebpAll=function(){return window.EBP||[];};
  X.chips=function(sec,ids){var S=window.EBPSEC&&EBPSEC[sec];ids=ids||(S&&S.e)||[];if(!ids.length)return '';
    return '<div class="ebprow" aria-label="الممارسات المثبتة في هذا القسم"><span class="ebplbl">'+I('layers')+' مبني على</span>'+ids.map(function(id){var e=EB[id];return e?'<button class="ebp'+(e.lvl==='sup'?' sup':'')+'" data-act="xebp" data-id="'+id+'" data-sec="'+(sec||'')+'">'+esc(e.ar)+'</button>':'';}).join('')+'</div>';};
  function secsOf(id){var out=[];Object.keys(window.EBPSEC||{}).forEach(function(k){var s=EBPSEC[k];if(s.e.indexOf(id)>=0)out.push(k);});return out;}
  X.coverage=function(){var inApp={},sup={};Object.keys(EBPSEC).forEach(function(k){EBPSEC[k].e.forEach(function(id){var e=EB[id];if(!e)return;if(e.lvl==='sup')sup[id]=1;else inApp[id]=1;});});
    X.ebpAll().forEach(function(e){if(e.lvl==='sup')sup[e.id]=1;});return {inApp:Object.keys(inApp).length,sup:Object.keys(sup).length,total:X.ebpAll().length};};
  X.on('xebp',function(b,d){openEbp(d('id'),d('sec'));});
  function openEbp(id,sec){var e=EB[id];if(!e)return;
    X.open('ebp',function(){var S=sec&&EBPSEC[sec],ap=S&&S.ap&&S.ap[id],secs=secsOf(id);
      var h='<div class="card ebpcard"><div class="row between top"><div class="grow"><h1 class="ebph">'+esc(e.ar)+'</h1><p class="muted" dir="ltr" style="text-align:right">'+esc(e.en)+' · '+esc(e.id)+'</p></div>'+X.chip(EBPCAT[e.cat]||'','plain')+'</div>'+
        '<p class="lead">'+esc(e.def)+'</p>'+(e.lvl==='sup'?'<div class="tip"><b>بإشراف الأخصائي.</b> التطبيق يقدّم الإرشاد والتسجيل، والتطبيق نفسه بخطة من الأخصائي.</div>':'')+'</div>';
      if(ap)h+='<div class="card"><h2>في قسم «'+esc(S.n)+'»</h2><p>'+esc(ap)+'</p></div>';
      h+='<div class="card"><h2>كيف تطبّقها</h2><ol>'+e.how.map(function(s){return '<li>'+esc(s)+'</li>';}).join('')+'</ol></div>';
      h+='<div class="card voice"><h2>'+I('heart')+' في البيت</h2><p>'+esc(e.home)+'</p></div>';
      if(secs.length)h+='<div class="card"><h2>أين تجدها في التطبيق</h2><div class="chips">'+secs.filter(function(k){return k!=='lib';}).map(function(k){return '<button class="pill" data-act="xsec" data-id="'+k+'">'+esc(EBPSEC[k].n)+'</button>';}).join('')+'</div></div>';
      h+='<p class="muted src">المصدر: '+esc(EBPSRC.cite)+' <a href="'+EBPSRC.afirm+'" target="_blank" rel="noopener">وحدات AFIRM التدريبية '+I('link')+'</a></p>';
      return X.page(e.ar,h);});}
  X.openEbp=openEbp;
  var LIBF={c:''};
  X.secOpen.lib=function(){X.open('lib',function(){var cv=X.coverage(),list=X.ebpAll().filter(function(e){return !LIBF.c||e.cat===LIBF.c;});
    var h='<div class="card hero"><p class="eyebrow">مراجعة NCAEP الأمريكية ٢٠٢٠</p><h1>'+ar(cv.total)+' ممارسة مثبتة</h1><p>حلّلت المراجعة ٩٧٢ دراسة بين ١٩٩٠ و٢٠١٧. كل قسم في التطبيق مبني على واحدة منها أو أكثر.</p>'+
      '<div class="tiles">'+A.st(ar(cv.inApp),'يطبّقها التطبيق مباشرة')+A.st(ar(cv.sup),'يدعمها لأخصائي يطبّقها')+'</div></div>';
    h+='<div class="kchips">'+[['','الكل']].concat(Object.keys(EBPCAT).map(function(k){return [k,EBPCAT[k]];})).map(function(o){return '<button class="pill" data-act="xlibf" data-v="'+o[0]+'" aria-pressed="'+(LIBF.c===o[0])+'">'+esc(o[1])+'</button>';}).join('')+'</div>';
    h+='<div class="card"><div class="list">'+list.map(function(e){var n=secsOf(e.id).filter(function(k){return k!=='lib';}).length;
      return '<button class="li" data-act="xebp" data-id="'+e.id+'"><span class="ecode" dir="ltr">'+esc(e.id)+'</span><span class="nm">'+esc(e.ar)+'<br><span class="muted">'+esc(EBPCAT[e.cat]||'')+(n?' · في '+ar(n)+' '+(n>2&&n<11?'أقسام':'قسم'):'')+'</span></span>'+(e.lvl==='sup'?X.chip('بإشراف','warn'):X.chip('في التطبيق','good'))+'</button>';}).join('')+'</div></div>';
    h+='<p class="muted src">'+esc(EBPSRC.cite)+' <a href="'+EBPSRC.report+'" target="_blank" rel="noopener">التقرير الكامل '+I('link')+'</a></p>';
    return X.page('مكتبة الممارسات المثبتة',h);});};
  X.on('xlibf',function(b,d){LIBF.c=d('v');A.redraw();});

  /* ---------- hub on the follow-up tab, activities on the activities tab ---------- */
  X.hubTile=function(t){X.hubTiles.push(t);};
  X.actTile=function(t){X.actTiles.push(t);};
  function kidCard(){var k=X.kid(),age=X.age(k.dob),vis=X.kidsVisible(),r=X.role();
    return '<div class="card kidcard"><div class="row">'+X.kidPhoto(k)+'<div class="grow"><b class="kn">'+esc(k.name||'')+'</b><br><span class="muted">'+(age!=null?ar(age)+' '+(age>2&&age<11?'سنوات':'سنة')+' · ':'')+'أنت: '+(X.me.id&&X.nm(X.me.id)?esc(X.nm(X.me.id))+' · ':'')+ROLES[r]+'</span></div>'+
      (vis.length>1?'<button class="btn small ghost" data-act="xkidpick">'+I('swap')+' طفل آخر</button>':'')+'</div></div>';}
  X.inject('progressTop',function(){
    var tiles=X.hubTiles.filter(function(t){return !t.perm||X.can(t.perm);});
    return kidCard()+'<div class="hubhead"><h2>أدوات الأسرة والأخصائي</h2><p class="muted">كل أداة مبنية على ممارسات NCAEP المثبتة.</p></div><div class="hubgrid">'+tiles.map(X.tile).join('')+'</div><h2 class="sub2">التقدم هذا الأسبوع</h2>';});
  X.inject('gamesTop',function(){var tiles=X.actTiles.filter(function(t){return !t.perm||X.can(t.perm);});return '<div class="hubgrid act">'+tiles.map(X.tile).join('')+'</div><h2 class="sub2">ألعاب الفهم</h2>';});
  X.on('xkidpick',function(){X.open('kidpick',function(){var vis=X.kidsVisible(),cur=A.KID();
    return X.page('اختر الطفل','<div class="card"><div class="list">'+vis.map(function(k){var age=X.age(k.dob);return '<button class="li" data-act="xkidgo" data-id="'+k.id+'">'+X.kidPhoto(k,'sm')+'<span class="nm">'+esc(k.name||'')+(age!=null?'<br><span class="muted">'+ar(age)+' '+(age>2&&age<11?'سنوات':'سنة')+'</span>':'')+'</span>'+(k.id===cur?X.chip('الحالي','good'):'')+'</button>';}).join('')+'</div></div>'+
      (X.role()==='admin'?'<button class="btn ghost" data-act="xsec" data-id="kids">'+I('plus')+' أضف طفلاً أو عدّل الفريق</button>':''));});});
  X.on('xkidgo',function(b,d){var id=d('id');if(id===A.KID()){A.closeOv();return;}A.switchKid(id);pushKid();A.toast('تم الانتقال إلى '+X.kn());});

  /* ---------- children, team and center ---------- */
  X.hubTile({id:'kids',t:'الأطفال والفريق',ic:'users',col:'--grape',sub:function(){var n=X.kids().length,m=X.rcol('team').list().length;return ar(n)+' '+(n>2&&n<11?'أطفال':'طفل')+(m?' · '+ar(m)+' في الفريق':'');}});
  X.secOpen.kids=function(){X.open('kids',function(){var r=X.role(),admin=r==='admin',c=X.center(),T=X.rcol('team').list();X.names(T.map(function(t){return t.id;}));
    var h='<div class="card"><div class="row between"><h2>الأطفال</h2>'+(admin?'<button class="btn small" data-act="xkided" data-id="">'+I('plus')+' طفل</button>':'')+'</div><div class="list">'+
      X.kidsVisible().map(function(k){var age=X.age(k.dob);return '<div class="li">'+X.kidPhoto(k,'sm')+'<span class="nm">'+esc(k.name||'')+'<br><span class="muted">'+(age!=null?ar(age)+' '+(age>2&&age<11?'سنوات':'سنة')+' · ':'')+(k.cons?'موافقة مسجّلة':'بلا موافقة مسجّلة')+'</span></span>'+(k.id===A.KID()?X.chip('الحالي','good'):'<button class="btn small ghost" data-act="xkidgo" data-id="'+k.id+'">افتح</button>')+(admin||X.can('child')?'<button class="iconbtn sm" data-act="xkided" data-id="'+k.id+'" aria-label="تعديل">'+I('edit')+'</button>':'')+'</div>';}).join('')+'</div></div>';
    if(!window.__STANDALONE){h+='<div class="card"><h2>الفريق</h2><p class="muted">كل من يفتح التطبيق بحسابه يظهر هنا. '+(admin?'حدّد دور كل شخص والأطفال الذين يراهم.':'المدير يحدد الأدوار.')+'</p>';
    if(!T.length)h+='<p class="muted">لم يفتح أحد التطبيق بحسابه بعد.</p>';
    else h+='<div class="list">'+T.sort(function(a,b){return (b.seen||0)-(a.seen||0);}).map(function(t){var nm=X.nm(t.id)||(t.id===X.me.id?'أنت':'عضو'),rl=t.role||'';
      return '<div class="tm"><div class="row"><span class="kav sm">'+I('users')+'</span><span class="nm grow"><b>'+esc(nm)+'</b>'+(t.id===X.me.id?' '+X.chip('أنت','plain'):'')+'<br><span class="muted">آخر دخول '+X.ago(t.seen||t.u||Date.now())+'</span></span></div>'+
        (admin?X.seg('xrole',rl||'auto',[['auto','تلقائي'],['admin','مدير'],['spec','أخصائي'],['parent','ولي أمر'],['view','مشاهد']],' data-id="'+t.id+'"')+
          '<div class="chips">'+X.kids().map(function(k){var on=(t.kids||[]).indexOf(k.id)>=0;return '<button class="pill sm" data-act="xtkid" data-id="'+t.id+'" data-k="'+k.id+'" aria-pressed="'+on+'">'+esc(k.name)+'</button>';}).join('')+'</div><p class="muted">بلا اختيار: يرى '+(c.strict?'الطفل الحالي فقط':'كل الأطفال')+'.</p>':'<p class="muted">الدور: '+(ROLES[rl]||'تلقائي')+'</p>')+'</div>';}).join('')+'</div>';
    h+='</div>';}
    h+='<div class="card"><h2>المركز</h2>'+(admin?X.field('اسم المركز أو الأسرة',X.input('data-xcfg="name"',c.name||'',null,'مثال: مركز الأمل للاحتياجات الخاصة'))+X.field('المدينة',X.input('data-xcfg="city"',c.city||''))+X.field('رقم التواصل',X.input('data-xcfg="phone"',c.phone||'','tel'))+
      '<button class="toggle" data-act="xstrict" aria-pressed="'+(!!c.strict)+'">'+(c.strict?I('check')+' ':'')+'وضع المركز: الأدوار مقيّدة</button><p class="muted">'+(c.strict?'كل عضو جديد يبدأ ولي أمر أو أخصائي حسب اختياره في الإعدادات، ولا يرى إلا الأطفال المرتبطين به.':'وضع الأسرة: كل من يملك صلاحية التعديل مدير، ويرى كل شيء. شغّل وضع المركز عند استخدام التطبيق مع عدة أسر.')+'</p>':'<p>'+esc(c.name||'لم يُحدَّد اسم بعد')+'</p>')+'</div>';
    if(!window.__STANDALONE)h+='<div class="tip"><b>عن الصلاحيات:</b> الدعوة والمشاركة تُضبط من claude.ai (زر Share). الأدوار هنا تنظّم ما يظهر لكل شخص داخل التطبيق. للبيع لعدة مراكز يلزم خادم مستقل بصلاحيات مفروضة على البيانات نفسها.</div>';
    h+='<button class="btn line" data-act="xsec" data-id="priv">'+I('shield')+' الخصوصية والموافقة</button>';
    return X.page('الأطفال والفريق',h);});X.fresh(['@team','@kids'],'kids');};
  X.on('xrole',function(b,d){var v=d('v'),id=d('id');X.save(X.rcol('team').patch(id,{role:v==='auto'?null:v}),'حُفظ الدور');});
  X.on('xtkid',function(b,d){var T=X.rcol('team'),t=T.get(d('id'))||{},ks=(t.kids||[]).slice(),i=ks.indexOf(d('k'));if(i>=0)ks.splice(i,1);else ks.push(d('k'));X.save(T.patch(d('id'),{kids:ks.length?ks:null}));});
  X.on('xstrict',function(){var c=X.center();X.save(X.rcol('cfg').put('center',Object.assign({},c,{strict:!c.strict})));});
  X.onChange(function(t){var k=t.getAttribute('data-xcfg');if(!k)return false;var c=X.center(),o=Object.assign({},c);o[k]=t.value.trim().slice(0,120);X.save(X.rcol('cfg').put('center',o),'حُفظ');return true;});

  /* child profile editor: profile, voice dialect, safety card, consent */
  var KE=null;
  X.on('xkided',function(b,d){var id=d('id')||'',k=id?X.kid(id):{name:'',g:'m'};
    KE={id:id,k:JSON.parse(JSON.stringify(k)),ok:!!k.cons,ask:false};delete KE.k.id;
    X.open('kided',function(){var k=KE.k,isNew=!KE.id,s=k.safe||{},ph=(s.ph||[{},{}]);
      var h='<div class="card"><h2>بيانات الطفل</h2>'+X.field('الاسم',X.input('data-xk="name"',k.name||''))+'<p class="muted">الجنس، لتُكتب العبارات بصيغته:</p>'+X.seg('xkg',k.g||'m',[['m','ولد'],['f','بنت']])+
        X.field('تاريخ الميلاد',X.input('data-xk="dob"',k.dob||'','date'))+X.field('البلد (لعبارة «أنا من…»)',X.input('data-xk="country"',k.country||'',null,'مثال: السعودية'))+
        (KE.id?'<div class="row top">'+X.kidPhoto(Object.assign({id:KE.id},k))+'<div class="col grow"><label class="btn ghost small">'+I('camera')+' صورة الطفل<input type="file" accept="image/*" data-xup="kidphoto"></label><p class="muted">تظهر في بطاقة الأمان واختيار الطفل.</p></div></div>':'')+'</div>';
      h+='<div class="card"><h2>'+I('shield')+' بطاقة الأمان</h2><p class="muted">تُعرض في الأماكن العامة أو عند الضياع.</p>'+
        X.field('السطر الأول',X.input('data-xs="l1"',s.l1!=null?s.l1:defLine1(k)))+X.field('السطر الثاني',X.input('data-xs="l2"',s.l2!=null?s.l2:'قد لا أرد عند مناداتي. تكلّم معي بهدوء.'))+
        '<div class="row">'+X.field('الاسم',X.input('data-xp="n0"',ph[0].n||'',null,'بابا'))+X.field('الرقم',X.input('data-xp="p0"',ph[0].p||'','tel'))+'</div>'+
        '<div class="row">'+X.field('الاسم',X.input('data-xp="n1"',ph[1].n||'',null,'ماما'))+X.field('الرقم',X.input('data-xp="p1"',ph[1].p||'','tel'))+'</div>'+
        X.field('كيف يهدأ',X.input('data-xs="calm"',s.calm||'',null,'مثال: يحب الضغط على يديه والهدوء'))+X.field('حساسية أو ملاحظة مهمة',X.input('data-xs="note"',s.note||''))+'</div>';
      if(isNew||!k.cons)h+='<div class="card"><h2>موافقة ولي الأمر</h2><button class="toggle" data-act="xkcons" aria-pressed="'+KE.ok+'">'+(KE.ok?I('check')+' ':'')+'أوافق على حفظ بيانات الطفل التعليمية والسلوكية والصحية في هذا التطبيق لغرض المتابعة، وأعرف أنني أستطيع تصديرها أو طلب حذفها.</button></div>';
      else h+='<p class="muted">الموافقة مسجّلة في '+esc(X.dateTxt(X.dstr(k.cons.at),true))+'.</p>';
      h+='<button class="btn big" data-act="xksave">'+(isNew?'أضف الطفل':'احفظ')+'</button>';
      if(KE.id&&KE.id!=='main'&&X.role()==='admin')h+=KE.ask?'<div class="card"><p>حذف الطفل يخفيه من القائمة. بياناته تبقى محفوظة حتى تحذفها من «الخصوصية».</p><div class="row"><button class="btn danger grow" data-act="xkdel" data-go="1">نعم، احذف</button><button class="btn line grow" data-act="xkdel" data-go="0">إلغاء</button></div></div>':'<button class="btn danger" data-act="xkdel">احذف الطفل</button>';
      return X.page(isNew?'طفل جديد':'بيانات '+(k.name||''),h);});});
  function defLine1(k){return 'أنا '+(k.g==='f'?'طفلة':'طفل')+' عندي توحد، وأتواصل بالصور.';}
  X.defLine1=defLine1;
  X.onChange(function(t){if(!KE||!X.top('kided'))return false;var a;
    if((a=t.getAttribute('data-xk'))){KE.k[a]=t.value.trim().slice(0,80);return true;}
    if((a=t.getAttribute('data-xs'))){KE.k.safe=KE.k.safe||{};KE.k.safe[a]=t.value.trim().slice(0,160);return true;}
    if((a=t.getAttribute('data-xp'))){KE.k.safe=KE.k.safe||{};var ph=KE.k.safe.ph=(KE.k.safe.ph||[{},{}]),i=+a.slice(1);ph[i]=ph[i]||{};ph[i][a.charAt(0)]=t.value.trim().slice(0,40);return true;}
    if(t.getAttribute('data-xup')==='kidphoto'){var f=t.files&&t.files[0];if(!f)return true;A.setBusy('جارٍ حفظ الصورة…');X.upAsset(f).then(function(r){KE.k.photo=r.id;A.setBusy('');A.redraw();},X.upErr);try{t.value='';}catch(e){}return true;}
    return false;});
  X.on('xkg',function(b,d){KE.k.g=d('v');A.redraw();});
  X.on('xkcons',function(){KE.ok=!KE.ok;A.redraw();});
  X.on('xksave',function(){var k=KE.k;if(!k.name){A.toast('اكتب اسم الطفل',1);return;}if(!KE.id&&!KE.ok){A.toast('موافقة ولي الأمر مطلوبة لإضافة طفل',1);return;}
    if(KE.ok&&!k.cons)k.cons={at:Date.now(),by:X.me.id||'',who:A.S().set.who||''};
    var id=KE.id||X.rid('k');if(!KE.id)k.c=Date.now();
    X.rcol('kids').put(id,k).then(function(){A.closeOv();if(id===A.KID())pushKid();A.toast(KE.id?'حُفظت البيانات':'أُضيف الطفل. افتحه من «طفل آخر».');A.redraw();},function(e){A.saveErr(e);});});
  X.on('xkdel',function(b,d){if(d('go')==='0'){KE.ask=false;A.redraw();return;}if(d('go')!=='1'){KE.ask=true;A.redraw();return;}
    X.rcol('kids').patch(KE.id,{del:Date.now()}).then(function(){A.closeOv();A.toast('حُذف الطفل من القائمة');A.redraw();},A.saveErr);});

  /* privacy, consent, export */
  X.secOpen.priv=function(){X.open('priv',function(){var k=X.kid(),admin=X.role()==='admin';
    var h='<div class="card"><h2>ماذا يحفظ التطبيق؟</h2><ul><li>بيانات تعليمية: البطاقات والأصوات والصور والجداول ونتائج الجلسات والخطة.</li><li>بيانات سلوكية وصحية: سجل السلوك والنوم والأكل والحمام والدواء.</li><li>تُحفظ داخل هذا التطبيق في حساب Claude، ولا تراها إلا الحسابات التي شاركتَ التطبيق معها.</li></ul></div>';
    h+='<div class="card"><h2>الموافقة</h2><p>'+(k.cons?'موافقة ولي الأمر مسجّلة لـ'+esc(k.name)+' في '+esc(X.dateTxt(X.dstr(k.cons.at),true))+'.':'لا توجد موافقة مسجّلة لـ'+esc(k.name)+' بعد.')+'</p>'+(!k.cons&&X.can('child')?'<button class="btn" data-act="xkided" data-id="'+k.id+'">سجّل الموافقة</button>':'')+'</div>';
    h+='<div class="card"><h2>بياناتك ملكك</h2><p class="muted">نزّل نسخة كاملة من بيانات الطفل الحالي بصيغة JSON.</p><button class="btn ghost" data-act="xexport">'+I('download')+' صدّر بيانات '+esc(k.name)+'</button></div>';
    h+='<div class="card"><h2>قبل الطرح التجاري</h2><ul><li>بيانات الأطفال الصحية «حساسة» في نظام حماية البيانات الشخصية السعودي وفي قانون حماية البيانات المصري ولائحته التنفيذية (نوفمبر ٢٠٢٥)، وتحتاج موافقة صريحة من ولي الأمر.</li><li>التطبيق أداة تعليمية تنظيمية تدعم خطة الأخصائي، ولا يشخّص ولا يعالج التوحد، فلا يُقدَّم بعبارات علاجية.</li><li>راجع محامياً مختصاً في الخصوصية قبل الإطلاق.</li></ul></div>';
    return X.page('الخصوصية والموافقة',h);});};
  X.on('xexport',function(){var k=X.kid(),out={child:k,exported:new Date().toISOString(),days:A.S().days,cards:A.OV(),org:A.ORG()};
    X.needs.forEach(function(n){if(!n.r)out[n.n]=X.col(n.n).m;});
    X.download('بيانات-'+(k.name||'طفل')+'-'+A.today()+'.json',JSON.stringify(out,null,1),'application/json');});

  /* ---------- moving data between devices: one private file carries recordings, photos, cards, plan and progress ---------- */
  var MOVE={busy:false,ready:null,file:null,ask:null};
  var KCOLS=['days','ov','aud','pic','meds','act','food','rew','plan','meal','tokl','tok','beh','iep','note','rep','sess','sto','train','vm','xset'],RCOLS=['kids','team','cfg'];
  function rawList(h,path){return h.collection(path).limit(5000).get().then(function(r){return r.docs.map(function(d){return [d.id,d.data()];});},function(){return [];});}
  X.buildMove=function(){
    var h=A.rawDb();if(!h)return Promise.reject({code:'ro'});
    var kids=X.kids(),out={app:'rihla',v:1,at:new Date().toISOString(),from:window.__STANDALONE?'device':'claude',docs:{},assets:{},vx:{},names:{}},jobs=[];
    RCOLS.forEach(function(c){jobs.push(rawList(h,c).then(function(L){L.forEach(function(x){if(x[1])out.docs[c+'/'+x[0]]=x[1];});}));});
    kids.forEach(function(k){var pre=k.id==='main'?'':'k/'+k.id+'/';KCOLS.forEach(function(c){jobs.push(rawList(h,pre+c).then(function(L){L.forEach(function(x){if(x[1])out.docs[pre+c+'/'+x[0]]=x[1];});}));});});
    return Promise.all(jobs).then(function(){
      /* the main child may live only in the built-in defaults: write it down (as the oldest version) so the other device shows the same child */
      if(!out.docs['kids/main']){var mk=X.kid('main'),d={};Object.keys(mk).forEach(function(key){if(key!=='id')d[key]=mk[key];});d.u=1;out.docs['kids/main']=d;}
      var NM=X.allNames();Object.keys(NM).forEach(function(id){if(NM[id]&&NM[id].name)out.names[id]={name:NM[id].name};});
      /* app-voice clips that say a child's name travel in the file, never on a public link */
      var names=kids.map(function(k){return k.name;}).filter(function(n){return n&&n.length>1;}),V=window.VOICES||{},K=window.VKEY||{},vj=[];
      ['sa','eg'].forEach(function(d){var vd=V[d]||{};Object.keys(vd).forEach(function(id){var t=vd[id];if(!K[id]||!names.some(function(n){return String(t).indexOf(n)>=0;}))return;
        vj.push(A.vchunk(d,K[id][0]).then(function(c){var b=c&&c[K[id][1]];if(b){(out.vx[d]=out.vx[d]||{})[id]={t:t,b64:b};}},function(){}));});});
      return Promise.all(vj);
    }).then(function(){
      return X.assetsP().then(function(as){if(!as||!as.list)return;return Promise.resolve(as.list()).then(function(r){var L=(r&&r.assets)||[];
        return L.reduce(function(p,a){var id=a.id||a.opaque_id;if(!id)return p;return p.then(function(){return fetch(X.assetUrl(id)).then(function(res){if(!res.ok)throw 0;return res.blob();})
          .then(function(b){return A.blobB64(b).then(function(s){out.assets[id]={type:b.type||a.contentType||a.type||'',b64:s};});}).catch(function(){});});},Promise.resolve());});}).catch(function(){});
    }).then(function(){return out;});
  };
  X.importMove=function(p){
    var h=A.rawDb();if(!h||!A.canEdit())return Promise.reject({code:'ro'});
    var map={},aids=Object.keys(p.assets||{}),pa=Promise.resolve();
    if(aids.length){
      if(window.__localPutAsset)pa=Promise.all(aids.map(function(id){var a=p.assets[id];return window.__localPutAsset(id,A.b64blob(a.b64,a.type||'application/octet-stream'));}));
      else pa=X.assetsP().then(function(as){if(!as)return;return aids.reduce(function(q,id){return q.then(function(){var a=p.assets[id];
        return Promise.resolve(as.upload(A.b64blob(a.b64,a.type||'application/octet-stream'))).then(function(r){if(r&&r.id&&r.id!==id)map[id]=r.id;}).catch(function(){});});},Promise.resolve());});
    }
    return pa.then(function(){
      var docs=p.docs||{};if(Object.keys(map).length){var s=JSON.stringify(docs);Object.keys(map).forEach(function(o){s=s.split(o).join(map[o]);});docs=JSON.parse(s);}
      var list=Object.keys(docs).filter(function(k){return /^[A-Za-z0-9_~\-\/.:]+$/.test(k)&&docs[k]&&typeof docs[k]==='object';}),n=0,i=0;
      /* merge: when both sides hold the same thing, the newer one stays; nothing is deleted */
      function one(path){var inc=docs[path];return h.doc(path).get().then(function(sn){var cur=sn&&sn.exists?sn.data():null;if(cur&&(cur.u||0)>(inc.u||0))return;n++;return h.doc(path).set(inc);});}
      return new Promise(function(res,rej){var act=0,bad=null;(function nx(){if(bad)return;if(i>=list.length&&!act){res(n);return;}
        while(act<6&&i<list.length){act++;one(list[i++]).then(function(){act--;nx();},function(e){bad=e;rej(e);});}})();});
    }).then(function(n){
      if(p.names&&window.__localNames)window.__localNames(p.names);
      if(p.vx&&window.__localPutVx)return window.__localPutVx(p.vx).then(function(){return n;});return n;});
  };
  X.secOpen.move=function(){X.open('move',function(){var SA=!!window.__STANDALONE,admin=X.role()==='admin',R=MOVE.ready;
    var h='<div class="card"><h2>'+(SA?'نسخة احتياطية أو نقل لجهاز آخر':'نقل إلى الآيباد أو جهاز آخر')+'</h2><p class="muted">ملف واحد يحمل كل شيء: التسجيلات والصور والبطاقات والخطة والجلسات والتقدّم'+(X.kids().length>1?' لكل الأطفال':'')+'. انقله بـ AirDrop أو احفظه في «الملفات». لا يُرفع إلى أي موقع.</p>'+
      (R?'<p><b>الملف جاهز:</b> '+esc(R.name)+' · '+esc(R.kb)+'</p><div class="row"><button class="btn grow" data-act="xmoves">'+I('download')+' احفظ الملف أو أرسله</button><button class="btn ghost" data-act="xmovex">'+I('swap')+' جهّزه من جديد</button></div>'
        :'<button class="btn" data-act="xmovex"'+(MOVE.busy?' disabled':'')+'>'+I('download')+' '+(MOVE.busy==='x'?'جارٍ التجهيز…':'جهّز ملف النقل')+'</button>')+'</div>';
    h+='<div class="card"><h2>استيراد من ملف</h2>'+(A.canEdit()&&admin?
      (MOVE.ask?'<p><b>يُدمج محتوى الملف مع ما على هذا الجهاز.</b> إذا وُجدت نسختان من الشيء نفسه تبقى الأحدث، ولا يُحذف شيء.</p><p class="muted">'+esc(MOVE.ask.name)+' · '+ar(MOVE.ask.n)+' عنصراً'+(MOVE.ask.at?' · جُهّز '+esc(MOVE.ask.at):'')+'</p><div class="row"><button class="btn grow" data-act="xmovei" data-go="1">'+I('check')+' استورد الآن</button><button class="btn ghost" data-act="xmovei" data-go="0">إلغاء</button></div>'
        :'<p class="muted">اختر ملف النقل الذي جهّزته من الجهاز الآخر.</p><label class="btn ghost">'+I('folder')+' اختر الملف<input type="file" accept=".json,application/json" data-ximport="1"></label>')
      :'<p class="muted">الاستيراد لمن يملك صلاحية المدير.</p>')+'</div>';
    if(SA)h+='<div class="tip"><b>مهم:</b> بيانات هذه النسخة محفوظة على هذا الجهاز وحده. إذا حذفت التطبيق من الشاشة الرئيسية تُحذف معه، فجهّز ملف نقل كل فترة واحفظه في «الملفات».</div>';
    return X.page('نقل البيانات',h);});};
  X.on('xmovex',function(){if(MOVE.busy)return;MOVE.busy='x';MOVE.ready=null;A.redraw();
    X.buildMove().then(function(out){var json=JSON.stringify(out),k=X.kid('main');
      MOVE.ready={name:'رحلة-'+(k.name||'طفل')+'-'+A.today()+'.json',json:json,kb:(json.length>1048576?(json.length/1048576).toFixed(1)+' ميجا':Math.max(1,Math.round(json.length/1024))+' ك.ب')};
      MOVE.busy=false;A.redraw();},function(e){MOVE.busy=false;A.saveErr(e);A.redraw();});});
  X.on('xmoves',function(){var R=MOVE.ready;if(R)X.download(R.name,R.json,'application/json');});
  X.onChange(function(t){if(!t||!t.getAttribute||!t.getAttribute('data-ximport'))return false;var f=t.files&&t.files[0];if(!f)return true;
    var rd=new FileReader();rd.onload=function(){try{var p=JSON.parse(String(rd.result));if(!p||p.app!=='rihla'||!p.docs)throw 0;
      MOVE.file=p;MOVE.ask={name:f.name,n:Object.keys(p.docs).length,at:p.at&&!isNaN(Date.parse(p.at))?X.dateTxt(X.dstr(Date.parse(p.at)),true):''};A.redraw();}
      catch(e){A.toast('هذا ليس ملف نقل من رحلة',1);}};rd.onerror=function(){A.toast('تعذّرت قراءة الملف',1);};rd.readAsText(f);return true;});
  X.on('xmovei',function(b,d){if(d('go')!=='1'){MOVE.ask=null;MOVE.file=null;A.redraw();return;}var p=MOVE.file;if(!p||MOVE.busy)return;MOVE.busy='i';A.setBusy('جارٍ الاستيراد…');
    X.importMove(p).then(function(n){MOVE.busy=false;MOVE.ask=null;MOVE.file=null;return A.resync().then(function(){A.setBusy('');A.toast('اكتمل النقل · '+ar(n)+' عنصراً');A.redraw();});},
      function(e){MOVE.busy=false;A.setBusy('');A.saveErr(e);A.redraw();});});

  /* safety card */
  X.secOpen.safe=function(){X.open('safe',function(){var k=X.kid(),s=k.safe||{},ph=(s.ph||[]).filter(function(p){return p&&p.p;});
    var h='<div class="safecard"><div class="schead">'+X.kidPhoto(k,'lg')+'<div><p class="eyebrow">'+I('shield')+' بطاقة أمان</p><h1>'+esc(k.name||'')+'</h1></div></div>'+
      '<p class="sl">'+esc(s.l1!=null&&s.l1?s.l1:defLine1(k))+'</p><p class="sl2">'+esc(s.l2!=null?s.l2:'قد لا أرد عند مناداتي. تكلّم معي بهدوء.')+'</p>'+
      (ph.length?'<div class="sph">'+ph.map(function(p){return '<a class="btn big" href="tel:'+esc(p.p.replace(/[^0-9+]/g,''))+'">'+I('phone')+' '+esc(p.n||'اتصل')+' · <span dir="ltr">'+esc(p.p)+'</span></a>';}).join('')+'</div>':'<p class="muted">أضف رقم ولي الأمر من «تعديل».</p>')+
      (s.calm?'<p><b>كيف أهدأ:</b> '+esc(s.calm)+'</p>':'')+(s.note?'<p><b>مهم:</b> '+esc(s.note)+'</p>':'')+'</div>';
    h+='<p class="muted">نصيحة: التقط صورة لهذه الشاشة واحفظها في جوالك أو اطبعها في محفظته.</p>'+X.chips('safe');
    return X.page('بطاقة الأمان',h,{cls:'safe',right:X.can('child')?'<button class="iconbtn" data-act="xkided" data-id="'+k.id+'" aria-label="تعديل البطاقة">'+I('edit')+'</button>':''});});};

  /* ---------- hooks the main app calls ---------- */
  Object.keys(window.PXF).forEach(function(k){try{window.PXF[k](X);}catch(e){if(window.console)console.error('px feature',k,e);}});
  pushKid();
  var TABSEC={today:'today',sounds:'sounds',board:'board',games:'games',org:'org',progress:'progress'};
  function injectHTML(name,arg){var fs=X.inj[name];if(!fs)return '';var out='';fs.forEach(function(f){try{out+=f(arg)||'';}catch(e){if(window.console)console.error(e);}});return out;}
  return {
    X:X,
    click:function(a,b,d,Tp){var f=X.acts[a];if(!f)return false;try{f(b,d,Tp);}catch(e){if(window.console)console.error(e);A.toast('حدث خطأ غير متوقع',1);}return true;},
    change:function(t){for(var i=0;i<X.chg.length;i++){try{if(X.chg[i](t))return true;}catch(e){if(window.console)console.error(e);}}return false;},
    html:injectHTML,
    afterRender:function(tab,view){
      var first=view.firstElementChild,sec=TABSEC[tab];
      if(first&&sec&&!A.isEdit()){first.insertAdjacentHTML('afterend',X.chips(sec)+injectHTML(tab+'Top'));}
      (X.after[tab]||[]).forEach(function(f){try{f(view);}catch(e){if(window.console)console.error(e);}});
    },
    synced:function(){X.loadAll().then(function(){presence();pushKid();X.syncs.forEach(function(f){try{f();}catch(e){}});var t=A.TOP();if(t&&t.type&&t.type.indexOf('x-')===0)A.redraw();else if(!t)A.render();});},
    tick:function(){X.ticks.forEach(function(f){try{f();}catch(e){}});},
    text:function(id){if(!id||id.charCodeAt(0)!==120)return null;for(var i=0;i<X.texts.length;i++){var t=X.texts[i](id);if(t!=null)return t;}return null;}
  };
});
})();
