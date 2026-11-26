/* px_social.js — «المتصفح»: the shared space of رحلة for the people the app is shared with.
   Questions and answers, photo and video posts with comments, friend requests, a profile photo, and private messages.
   A person's name always comes from the signed-in account and is never typed here, so nobody can use an alias.
   Private messages are encrypted on the device (ECDH P-256 + AES-GCM); only the two friends can read them.
   Shared collections (root): cmu profiles (doc id = account id), cmp posts, cmc comments, cmf friend links, cmd messages. */
(function(){
'use strict';
window.PXF=window.PXF||{};
window.PXF.social=function(X){
  var A=X.A,esc=X.esc,ar=X.ar,I=X.I,SA=!!window.__STANDALONE;
  if(!SA){X.need('cmu',true);X.need('cmp',true,{order:'c',limit:300});X.need('cmc',true,{order:'c',limit:2000});X.need('cmf',true);X.need('cmd',true,{order:'c',limit:1500});}
  var U=function(){return X.rcol('cmu');},P=function(){return X.rcol('cmp');},C=function(){return X.rcol('cmc');},F=function(){return X.rcol('cmf');},D=function(){return X.rcol('cmd');};
  var ST={v:'feed',f:'all',n:20,post:'',pair:'',who:'',del:'',delc:''},DR={},CP={k:'q',m:[],busy:false},KEYS=null,KP=null,PK={},DEC={},DECQ={},lastLoad=0,dirty=false,FOC='',sending=false,profDone=false,rT=null;
  var IC={
    globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 3.9 5.2 3.9 8.5s-1.3 6.1-3.9 8.5c-2.6-2.4-3.9-5.2-3.9-8.5s1.3-6.1 3.9-8.5z"/>',
    video:'<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3z"/>',
    userplus:'<circle cx="9.5" cy="8" r="3.5"/><path d="M3 20c.6-3.6 3.300-5.500 6.500-5.500s5.900 1.900 6.500 5.500M18.500 7v6M15.500 10h6"/>',
    ask:'<path d="M20.5 12a8 8 0 0 1-11.6 7.1L4 20.5l1.400-4.600A8 8 0 1 1 20.500 12z"/><path d="M9.800 9.600a2.300 2.300 0 0 1 4.500.700c0 1.500-2.200 1.900-2.200 3.300M12.100 16.300v.200"/>',
    crown:'<path d="M4 17.500h16M4.500 15l-1-7.500 5 3.500L12 5.500l3.500 5.500 5-3.500-1 7.500z"/>'
  };
  (function(){var s='<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';for(var k in IC)s+='<symbol id="i-'+k+'" viewBox="0 0 24 24">'+IC[k]+'</symbol>';document.body.insertAdjacentHTML('afterbegin',s+'</svg>');})();

  /* ---------- who, names, small helpers ---------- */
  function me(){return X.me.id;}
  function ready(){return !SA&&!!me()&&!!A.rawDb();}
  function canWrite(){return ready()&&A.canEdit();}
  /* who may remove other people's posts: the app's owner, or someone the owner made a manager */
  function isAdmin(){if(!A.canEdit())return false;if(A.ROLE.owner)return true;var t=X.rcol('team').get(me());return !!(t&&t.role==='admin');}
  function nm(id){return X.nm(id)||(id===me()?'أنت':'عضو');}
  function roleOf(id){var p=U().get(id);if((p&&p.own)||(id===me()&&A.ROLE.owner))return 'صاحب التطبيق';var t=X.rcol('team').get(id);return t&&t.role&&X.ROLES[t.role]?X.ROLES[t.role]:'';}
  function hue(id){var h=0;id=String(id);for(var i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))%360;return h;}
  function av(id,cls){var p=U().get(id),n=(X.nm(id)||'').trim();
    return '<span class="cav'+(cls?' '+cls:'')+'" style="--h:'+hue(id)+'">'+(p&&p.av?'<img alt="" src="'+X.assetUrl(p.av)+'">':n?esc(n.charAt(0)):I('users'))+'</span>';}
  function fmt(t){return esc(t).replace(/\n/g,'<br>');}
  function cw(n,one,two,few,many){n=+n||0;return n===1?one:n===2?two:ar(n)+' '+(n>=3&&n<=10?few:many);}
  function root(){return A.TOP()?X.layer:document.getElementById('view');}
  function typing(){var e=document.activeElement;return !!(e&&/^(INPUT|TEXTAREA)$/.test(e.tagName)&&e.type!=='file');}
  function pid(a,b){return [a,b].sort().join('__');}
  function rel(o){var f=F().get(pid(me(),o));return f?{st:f.st,mine:f.by===me()}:null;}
  function friends(){var m=me();return F().list(function(f){return f.st==='ok'&&(f.a===m||f.b===m);}).map(function(f){return f.a===m?f.b:f.a;});}
  function incoming(){var m=me();return F().list(function(f){return f.st==='req'&&f.by!==m&&(f.a===m||f.b===m);});}
  function members(){var ids={},m=me();U().list().forEach(function(p){ids[p.id]=1;});X.rcol('team').list().forEach(function(t){ids[t.id]=1;});delete ids[m];return Object.keys(ids);}
  function askNames(){var ids={};P().list().forEach(function(p){ids[p.by]=1;});C().list().forEach(function(c){ids[c.by]=1;});members().forEach(function(i){ids[i]=1;});if(me())ids[me()]=1;X.names(Object.keys(ids).filter(Boolean));}
  function readMap(){try{return JSON.parse(localStorage.getItem('px:cmr')||'{}')||{};}catch(e){return {};}}
  function markRead(p){var r=readMap();r[p]=Date.now();try{localStorage.setItem('px:cmr',JSON.stringify(r));}catch(e){}}
  function msgs(p){return D().list(function(x){return x.p===p;}).sort(function(a,b){return (a.c||0)-(b.c||0);});}
  function unread(p){var r=readMap()[p]||0,m=me();return D().list(function(x){return x.p===p&&x.by!==m&&(x.c||0)>r;}).length;}
  function unreadAll(){var n=0,m=me();friends().forEach(function(o){n+=unread(pid(m,o));});return n;}
  function badge(){A.tabBadge('social',ready()?incoming().length+unreadAll():0);}
  function posts(){var f=ST.f;return P().list(function(p){return f==='all'||(f==='q'?p.k==='q':!!(p.m&&p.m.length));}).sort(function(a,b){return (b.c||0)-(a.c||0);});}
  function cmts(id){return C().list(function(c){return c.p===id;}).sort(function(a,b){return (a.c||0)-(b.c||0);});}

  /* ---------- loading and gentle refresh ---------- */
  function loadAll(){return Promise.all([U(),P(),C(),F(),D()].map(function(s){return s.load().catch(function(){});}));}
  function refresh(force){if(!ready())return;if(!force&&Date.now()-lastLoad<20000)return;lastLoad=Date.now();loadAll().then(afterData);}
  function afterData(){badge();askNames();if(!profDone&&canWrite()){profDone=true;ensureProfile();}redrawMine();}
  /* redraw my screens only; while someone is typing, refresh just the list above the input */
  function redrawMine(){var t=A.TOP(),ty=t&&t.type||'';
    if(t&&!/^x-cm/.test(ty))return;if(!t&&A.TAB()!=='social')return;
    if(typing()){var bx;if(ty==='x-cmdm'&&(bx=document.getElementById('cmthread'))){bx.innerHTML=threadList();toBottom();return;}
      if(ty==='x-cmpost'&&(bx=document.getElementById('cmcmts'))){bx.innerHTML=cmtList(ST.post);return;}dirty=true;return;}
    dirty=false;A.redraw();}
  function soon(){clearTimeout(rT);rT=setTimeout(redrawMine,60);}
  function toBottom(){var s=X.layer.querySelector('.stage');if(s)s.scrollTop=s.scrollHeight;}
  function refocus(){if(!FOC)return;var e=root().querySelector('[data-cmd="'+FOC+'"]');if(e&&document.activeElement!==e){try{e.focus();var n=e.value.length;e.setSelectionRange(n,n);}catch(_){}}}
  document.addEventListener('input',function(e){var t=e.target,k=t&&t.getAttribute&&t.getAttribute('data-cmd');if(k!=null)DR[k]=t.value;});
  document.addEventListener('focusin',function(e){var t=e.target,k=t&&t.getAttribute&&t.getAttribute('data-cmd');FOC=k||'';});
  document.addEventListener('focusout',function(e){if(e.target&&e.target.isConnected)FOC='';if(dirty)setTimeout(function(){if(dirty&&!typing())redrawMine();},120);});
  document.addEventListener('keydown',function(e){var t=e.target,k=t&&t.getAttribute&&t.getAttribute('data-cmd');if(!k||e.key!=='Enter'||e.shiftKey||e.isComposing)return;
    if(k.indexOf('dm:')===0){e.preventDefault();sendDM();}});
  var tk=0;X.onTick(function(){tk++;var t=A.TOP(),ty=t&&t.type||'';
    if(ty==='x-cmdm'&&tk%8===0&&ready())D().load().then(function(){badge();soon();}).catch(function(){});
    else if(!t&&A.TAB()==='social'&&tk%30===0)refresh(true);});
  X.onSync(function(){badge();askNames();if(!profDone&&canWrite()){profDone=true;ensureProfile();}});

  /* ---------- keys: each account has one key pair; the private half stays in the account's own private storage ---------- */
  var EC={name:'ECDH',namedCurve:'P-256'};
  function hasCrypto(){return !!(window.crypto&&crypto.subtle&&window.TextEncoder);}
  function b64(buf){var s='',u=new Uint8Array(buf);for(var i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s);}
  function unb64(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}
  function ensureKeys(){
    if(KEYS)return Promise.resolve(KEYS);if(KP)return KP;
    if(!ready()||!hasCrypto())return Promise.reject({code:'nokeys'});
    var ref=A.rawDb().doc('data/users/'+me()+'/cmkeys');
    KP=Promise.resolve(ref.get()).then(function(sn){var d=sn&&sn.exists?sn.data():null;
      if(d&&d.priv&&d.pub)return crypto.subtle.importKey('jwk',d.priv,EC,false,['deriveKey']).then(function(k){return {priv:k,pub:d.pub};});
      return crypto.subtle.generateKey(EC,true,['deriveKey']).then(function(kp){
        return Promise.all([crypto.subtle.exportKey('jwk',kp.privateKey),crypto.subtle.exportKey('jwk',kp.publicKey)]).then(function(j){
          return Promise.resolve(ref.set({priv:j[0],pub:j[1],c:Date.now()})).then(function(){return {priv:kp.privateKey,pub:j[1]};});});});
    }).then(function(k){KEYS=k;return k;},function(e){KP=null;throw e;});
    return KP;}
  function ensureProfile(){if(!canWrite())return Promise.resolve();
    var mk=function(pk){var p=U().get(me())||{},own=!!A.ROLE.owner;if(p.c&&(!pk||p.pk===pk)&&!!p.own===own)return;var d=Object.assign({},p);delete d.id;if(pk)d.pk=pk;if(own)d.own=true;else delete d.own;if(!d.c)d.c=Date.now();return U().put(me(),d);};
    return ensureKeys().then(function(k){return mk(JSON.stringify(k.pub));},function(){return mk('');}).then(function(){soon();},function(){});}
  function pairKey(o){var p=U().get(o);if(!p||!p.pk)return Promise.reject({code:'nopk'});if(PK[o]&&PK[o].pk===p.pk)return PK[o].k;
    var pr=ensureKeys().then(function(k){return crypto.subtle.importKey('jwk',JSON.parse(p.pk),EC,false,[]).then(function(pub){
      return crypto.subtle.deriveKey({name:'ECDH',public:pub},k.priv,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);});});
    PK[o]={pk:p.pk,k:pr};pr.catch(function(){delete PK[o];});return pr;}
  function enc(o,text){return pairKey(o).then(function(key){var iv=crypto.getRandomValues(new Uint8Array(12));
    return crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,new TextEncoder().encode(text)).then(function(ct){return {iv:b64(iv.buffer),ct:b64(ct)};});});}
  function dec(o,m){if(DEC[m.id]!=null||DECQ[m.id])return;var p=U().get(o);if(!p||!p.pk||!hasCrypto())return;DECQ[m.id]=1;
    pairKey(o).then(function(key){return crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(m.iv)},key,unb64(m.ct));})
      .then(function(buf){DEC[m.id]=new TextDecoder().decode(buf);},function(){DEC[m.id]=false;})
      .then(function(){delete DECQ[m.id];soon();});}

  /* ---------- the feed: questions and posts ---------- */
  function media(m){if(!m||!m.length)return '';
    return '<div class="cmedia n'+Math.min(m.length,4)+'">'+m.map(function(x){return x.k==='v'?'<video controls playsinline preload="metadata" src="'+X.assetUrl(x.id)+'"></video>':'<button class="cimg" data-act="xcmimg" data-id="'+esc(x.id)+'" aria-label="كبّر الصورة"><img alt="صورة مرفقة" loading="lazy" src="'+X.assetUrl(x.id)+'"></button>';}).join('')+'</div>';}
  function who(id,ts,extra){return '<div class="chead"><button class="cwho" data-act="xcmwho" data-id="'+esc(id)+'">'+av(id)+'<span class="grow"><b>'+esc(nm(id))+'</b><span class="muted">'+(roleOf(id)?esc(roleOf(id))+' · ':'')+esc(X.ago(ts||0))+'</span></span></button>'+(extra||'')+'</div>';}
  function postCard(p,full){var n=cmts(p.id).length,q=p.k==='q',mine=p.by===me(),can=mine||isAdmin(),ask=ST.del===p.id;
    return '<article class="card cpost" id="cm-'+p.id+'">'+who(p.by,p.c,q?X.chip(I('ask')+' سؤال','q'):'')+
      (p.tx?'<p class="ctx">'+fmt(p.tx)+'</p>':'')+media(p.m)+
      (ask?'<div class="tip"><b>'+(q?'يُحذف السؤال وكل إجاباته.':'يُحذف المنشور وكل تعليقاته.')+'</b><div class="row"><button class="btn small" data-act="xcmdel" data-id="'+p.id+'" data-go="1">نعم، احذف</button><button class="btn small line" data-act="xcmdel" data-id="'+p.id+'" data-go="0">إلغاء</button></div></div>'
        :'<div class="row">'+(full?'':'<button class="btn small ghost grow" data-act="xcmopen" data-id="'+p.id+'">'+I('chat')+' '+(q?(n?cw(n,'إجابة واحدة','إجابتان','إجابات','إجابة'):'أجب عن السؤال'):(n?cw(n,'تعليق واحد','تعليقان','تعليقات','تعليقاً'):'علّق'))+'</button>')+
          (can&&A.canEdit()?'<button class="btn small line" data-act="xcmdel" data-id="'+p.id+'" aria-label="'+(q?'حذف السؤال':'حذف المنشور')+'">'+I('trash')+(full?' حذف':'')+'</button>':'')+'</div>')+'</article>';}
  function feed(){var h='',ps=posts(),k=X.kn();
    if(canWrite())h+='<div class="row"><button class="btn grow" data-act="xcmnew" data-k="q">'+I('ask')+' اطرح سؤالاً</button><button class="btn ghost grow" data-act="xcmnew" data-k="p">'+I('camera')+' انشر صورة أو فيديو</button></div>';
    else h+='<div class="tip">حسابك للمشاهدة فقط. اطلب من صاحب التطبيق صلاحية المشاركة لتنشر وتعلّق.</div>';
    h+='<div class="hscroll" role="group" aria-label="تصفية المنشورات">'+[['all','الكل'],['q','الأسئلة'],['m','الصور والفيديو']].map(function(o){return '<button class="pill" data-act="xcmf" data-v="'+o[0]+'" aria-pressed="'+(ST.f===o[0])+'">'+o[1]+'</button>';}).join('')+'</div>';
    if(!ps.length)return h+X.empty(ST.f==='q'?'لا أسئلة بعد.':ST.f==='m'?'لا صور ولا فيديو بعد.':'لا منشورات بعد.',canWrite()?'ابدأ أنت: اسأل الأخصائي سؤالاً، أو شارك لحظة جميلة من يوم '+esc(k)+'.':'');
    h+=ps.slice(0,ST.n).map(function(p){return postCard(p,false);}).join('');
    if(ps.length>ST.n)h+='<button class="btn line" data-act="xcmmore">اعرض المزيد</button>';
    return h;}
  X.on('xcmf',function(b,d){ST.f=d('v');ST.n=20;A.redraw();});
  X.on('xcmmore',function(){ST.n+=20;A.redraw();});
  X.on('xcmimg',function(b,d){var id=d('id');X.open('cmimg',function(){return X.page('الصورة','<img class="cfull" alt="صورة مرفقة" src="'+X.assetUrl(id)+'">');});});

  /* writing a question or a post */
  function composer(){var k=CP.k,h='';
    h+=X.seg('xcmkind',k,[['q','سؤال'],['p','منشور']]);
    h+=X.field(k==='q'?'سؤالك':'ماذا تريد أن تشارك؟',X.area('data-cmd="new" rows="5" maxlength="2000"',DR['new']||'',k==='q'?'مثل: كيف أعلّمه أن ينتظر دوره؟':'مثل: اليوم طلب الماء بالكلام وحده!'));
    if(CP.m.length)h+='<div class="cthumbs">'+CP.m.map(function(x,i){return '<div class="cth">'+(x.k==='v'?'<video muted playsinline preload="metadata" src="'+X.assetUrl(x.id)+'"></video>':'<img alt="" src="'+X.assetUrl(x.id)+'">')+'<button class="iconbtn" data-act="xcmrm" data-i="'+i+'" aria-label="أزل المرفق">'+I('x')+'</button></div>';}).join('')+'</div>';
    if(CP.m.length<4)h+='<div class="row"><label class="btn ghost grow">'+I('camera')+' صورة<input type="file" accept="image/*" data-xcmup="i"></label><label class="btn ghost grow">'+I('video')+' فيديو<input type="file" accept="video/*" data-xcmup="v"></label></div>';
    h+='<p class="muted">يُنشر باسم حسابك: <b>'+esc(nm(me()))+'</b>، ويراه كل من تشاركهم التطبيق. الفيديو حتى دقيقة ونصف.</p>';
    h+='<button class="btn big" data-act="xcmpub"'+(CP.busy?' disabled':'')+'>'+I('send')+' '+(k==='q'?'انشر السؤال':'انشر')+'</button>';
    return X.page(k==='q'?'سؤال جديد':'منشور جديد',h);}
  X.on('xcmnew',function(b,d){if(!canWrite())return;CP.k=d('k')==='p'?'p':'q';X.open('cmnew',composer,{after:refocus});});
  X.on('xcmkind',function(b,d){CP.k=d('v')==='p'?'p':'q';A.redraw();});
  X.on('xcmrm',function(b,d){var x=CP.m.splice(+d('i'),1)[0];A.redraw();if(x)X.assetsP().then(function(as){if(as)return as.delete(x.id);}).catch(function(){});});
  X.onChange(function(t){var k=t&&t.getAttribute&&t.getAttribute('data-xcmup');if(!k)return false;var f=t.files&&t.files[0];if(!f)return true;
    A.setBusy(k==='v'?'جارٍ رفع الفيديو…':'جارٍ رفع الصورة…');
    X.upAsset(f,k==='v'?{video:true}:{}).then(function(r){A.setBusy('');CP.m.push({k:k,id:r.id});A.redraw();},X.upErr);return true;});
  X.on('xcmpub',function(){if(!canWrite()||CP.busy)return;var tx=String(DR['new']||'').trim().slice(0,2000);
    if(!tx&&!CP.m.length){A.toast(CP.k==='q'?'اكتب سؤالك أولاً':'اكتب شيئاً أو أرفق صورة',1);return;}
    if(CP.k==='q'&&!tx){A.toast('اكتب سؤالك أولاً',1);return;}
    CP.busy=true;A.redraw();var doc={by:me(),k:CP.k,c:Date.now()};if(tx)doc.tx=tx;if(CP.m.length)doc.m=CP.m.slice();
    P().put(X.rid('p'),doc).then(function(){CP.busy=false;CP.m=[];DR['new']='';ST.f='all';A.closeOv();A.toast(doc.k==='q'?'نُشر سؤالك':'نُشر');A.redraw();},function(e){CP.busy=false;A.saveErr(e);A.redraw();});});
  X.on('xcmdel',function(b,d){var id=d('id'),go=d('go'),p=P().get(id);if(!p||!A.canEdit()||(p.by!==me()&&!isAdmin()))return;
    if(go==null||go===''){ST.del=id;A.redraw();return;}ST.del='';if(go!=='1'){A.redraw();return;}
    var jobs=cmts(id).map(function(c){return C().del(c.id);});jobs.push(P().del(id));
    (p.m||[]).forEach(function(x){X.assetsP().then(function(as){if(as)return as.delete(x.id);}).catch(function(){});});
    Promise.all(jobs).then(function(){if(X.top('cmpost'))A.closeOv();A.toast('حُذف');A.redraw();},function(e){A.saveErr(e);A.redraw();});});

  /* one post with its answers or comments */
  function cmtList(id){var p=P().get(id)||{},q=p.k==='q',cs=cmts(id);
    if(p.best)cs.sort(function(a,b){return (b.id===p.best)-(a.id===p.best);});
    if(!cs.length)return '<p class="muted">'+(q?'لا إجابات بعد. كن أول من يجيب.':'لا تعليقات بعد.')+'</p>';
    return cs.map(function(c){var mine=c.by===me(),best=p.best===c.id,ask=ST.delc===c.id;
      return '<div class="cmt'+(best?' best':'')+'">'+av(c.by,'sm')+'<div class="grow"><p class="cmh"><b>'+esc(nm(c.by))+'</b> <span class="muted">'+esc(X.ago(c.c||0))+'</span>'+(best?' '+X.chip(I('check')+' أفضل إجابة','good'):'')+'</p><p class="ctx">'+fmt(c.tx||'')+'</p>'+
        (ask?'<div class="row"><button class="btn small" data-act="xcmcdel" data-id="'+c.id+'" data-go="1">نعم، احذف</button><button class="btn small line" data-act="xcmcdel" data-id="'+c.id+'" data-go="0">إلغاء</button></div>'
          :'<div class="row fwrap">'+(q&&p.by===me()&&A.canEdit()?'<button class="btn small line" data-act="xcmbest" data-id="'+c.id+'">'+(best?'ألغِ الاختيار':I('check')+' أفضل إجابة')+'</button>':'')+((mine||isAdmin())&&A.canEdit()?'<button class="btn small line" data-act="xcmcdel" data-id="'+c.id+'" aria-label="حذف">'+I('trash')+'</button>':'')+'</div>')+'</div></div>';}).join('');}
  function postPage(){var p=P().get(ST.post);if(!p)return X.page('المنشور',X.empty('هذا المنشور حُذف.'));p=Object.assign({id:ST.post},p);var q=p.k==='q',key='c:'+p.id;
    return X.page(q?'سؤال':'منشور',postCard(p,true)+'<h2 class="sub2">'+(q?'الإجابات':'التعليقات')+'</h2><div id="cmcmts" class="cmts">'+cmtList(p.id)+'</div>',
      {foot:canWrite()?'<div class="cfoot"><textarea data-cmd="'+key+'" rows="1" maxlength="1500" placeholder="'+(q?'اكتب إجابتك…':'اكتب تعليقك…')+'" aria-label="'+(q?'إجابتك':'تعليقك')+'">'+esc(DR[key]||'')+'</textarea><button class="iconbtn send" data-act="xcmcsend" aria-label="إرسال">'+I('send')+'</button></div>':''});}
  X.on('xcmopen',function(b,d){ST.post=d('id');ST.delc='';X.open('cmpost',postPage,{after:refocus});});
  X.on('xcmcsend',function(){if(!canWrite()||sending)return;var id=ST.post,key='c:'+id,tx=String(DR[key]||'').trim().slice(0,1500);if(!tx||!P().get(id))return;sending=true;
    C().put(X.rid('c'),{p:id,by:me(),tx:tx,c:Date.now()}).then(function(){sending=false;DR[key]='';FOC='';A.redraw();},function(e){sending=false;A.saveErr(e);});});
  X.on('xcmcdel',function(b,d){var id=d('id'),go=d('go'),c=C().get(id);if(!c||!A.canEdit()||(c.by!==me()&&!isAdmin()))return;
    if(go==null||go===''){ST.delc=id;A.redraw();return;}ST.delc='';if(go!=='1'){A.redraw();return;}
    var p=P().get(c.p),jobs=[C().del(id)];if(p&&p.best===id)jobs.push(P().patch(c.p,{best:null}));
    Promise.all(jobs).then(function(){A.redraw();},function(e){A.saveErr(e);A.redraw();});});
  X.on('xcmbest',function(b,d){var p=P().get(ST.post);if(!p||p.by!==me()||!A.canEdit())return;P().patch(ST.post,{best:p.best===d('id')?null:d('id')}).then(function(){A.redraw();},A.saveErr);});

  /* ---------- friends ---------- */
  function frBtns(o){var r=rel(o);if(!A.canEdit())return '';
    if(!r)return '<button class="btn small" data-act="xcmfr" data-id="'+esc(o)+'" data-do="add">'+I('userplus')+' أضف صديقاً</button>';
    if(r.st==='req')return r.mine?X.chip('أُرسل الطلب','plain')+'<button class="btn small line" data-act="xcmfr" data-id="'+esc(o)+'" data-do="del">إلغاء</button>'
      :'<button class="btn small" data-act="xcmfr" data-id="'+esc(o)+'" data-do="ok">'+I('check')+' قبول</button><button class="btn small line" data-act="xcmfr" data-id="'+esc(o)+'" data-do="del">رفض</button>';
    return '<button class="btn small ghost" data-act="xcmdm" data-id="'+esc(o)+'">'+I('chat')+' رسالة</button>';}
  function person(o){return '<div class="li cpl"><button class="cwho grow" data-act="xcmwho" data-id="'+esc(o)+'">'+av(o)+'<span class="grow"><b>'+esc(nm(o))+'</b><span class="muted">'+esc(roleOf(o)||'عضو')+'</span></span></button><span class="row">'+frBtns(o)+'</span></div>';}
  function peopleV(){var all=members(),inc=incoming().map(function(f){return f.by;}),fr=friends(),rest=all.filter(function(o){return fr.indexOf(o)<0&&inc.indexOf(o)<0;}),h='';
    if(inc.length)h+='<div class="card"><h2>طلبات صداقة</h2><div class="list">'+inc.map(person).join('')+'</div></div>';
    h+='<div class="card"><h2>أصدقائي</h2>'+(fr.length?'<div class="list">'+fr.map(person).join('')+'</div>':'<p class="muted">لا أصدقاء بعد. أرسل طلب صداقة لأي عضو، وبعد قبوله تستطيعان تبادل الرسائل الخاصة.</p>')+'</div>';
    if(rest.length)h+='<div class="card"><h2>أعضاء آخرون</h2><div class="list">'+rest.map(person).join('')+'</div></div>';
    else if(!all.length)h+='<div class="card"><h2>أعضاء آخرون</h2><p class="muted">لا يوجد أعضاء آخرون بعد. يظهر هنا كل من تشاركه التطبيق من قائمة المشاركة في Claude بعد أن يفتحه، واسمه يأتي من حسابه.</p></div>';
    return h;}
  X.on('xcmfr',function(b,d){if(!canWrite())return;var o=d('id'),act=d('do'),p=pid(me(),o),f=F().get(p),job;
    if(act==='add'){if(f)return;job=F().put(p,{a:me(),b:o,by:me(),st:'req',c:Date.now()}).then(function(){A.toast('أُرسل طلب الصداقة');});}
    else if(act==='ok'){if(!f||f.st!=='req'||f.by===me())return;job=F().patch(p,{st:'ok',ok:Date.now()}).then(function(){A.toast('صرتما صديقين');});}
    else{if(!f)return;job=F().del(p);}
    job.then(function(){badge();A.redraw();},function(e){A.saveErr(e);A.redraw();});});
  function whoPage(){var o=ST.who,p=U().get(o)||{},r=rel(o),mine=P().list(function(x){return x.by===o;}).sort(function(a,b){return (b.c||0)-(a.c||0);}),h='';
    h+='<div class="card cprof">'+av(o,'lg')+'<h2>'+esc(nm(o))+'</h2><p class="muted">'+esc(roleOf(o)||'عضو')+'</p>'+(p.bio?'<p class="ctx">'+fmt(p.bio)+'</p>':'')+
      (o===me()?'':'<div class="row fwrap">'+frBtns(o)+(r&&r.st==='ok'&&A.canEdit()?'<button class="btn small line" data-act="xcmfr" data-id="'+esc(o)+'" data-do="del">إلغاء الصداقة</button>':'')+'</div>')+'</div>';
    h+='<h2 class="sub2">'+(mine.length?'منشوراته':'لا منشورات له بعد')+'</h2>'+mine.slice(0,10).map(function(x){return postCard(x,false);}).join('');
    return X.page(nm(o),h);}
  X.on('xcmwho',function(b,d){var o=d('id');if(!o)return;if(o===me()&&!A.TOP()){ST.v='me';A.redraw();return;}ST.who=o;X.open('cmwho',whoPage);});

  /* ---------- private messages between friends ---------- */
  function threadList(){var o=ST.pair,p=pid(me(),o),ms=msgs(p),pr=U().get(o);
    if(!ms.length)return '<p class="muted cnote">'+I('lock')+' الرسائل هنا مشفّرة: لا يقرؤها إلا أنت و'+esc(nm(o))+'.</p>';
    ms.forEach(function(m){dec(o,m);});
    return '<p class="muted cnote">'+I('lock')+' مشفّرة بينكما فقط</p>'+ms.map(function(m){var t=DEC[m.id],mine=m.by===me();
      return '<div class="bub'+(mine?' me':'')+'"><p>'+(t==null?(pr&&pr.pk?'…':'<span class="muted">تُفتح بعد أن يدخل صديقك المتصفح</span>'):t===false?'<span class="muted">تعذّر فتح هذه الرسالة على هذا الحساب</span>':fmt(t))+'</p><span class="bt">'+esc(X.timeTxt(m.c||0))+'</span></div>';}).join('');}
  function threadPage(){var o=ST.pair,p=pid(me(),o),r=rel(o),pr=U().get(o),key='dm:'+o,ok=r&&r.st==='ok'&&pr&&pr.pk&&hasCrypto();markRead(p);badge();
    var foot=!canWrite()?'':ok?'<div class="cfoot"><textarea data-cmd="'+esc(key)+'" rows="1" maxlength="2000" placeholder="اكتب رسالة…" aria-label="رسالتك">'+esc(DR[key]||'')+'</textarea><button class="iconbtn send" data-act="xcmsend" aria-label="إرسال">'+I('send')+'</button></div>'
      :'<div class="cfoot"><p class="muted">'+(!r||r.st!=='ok'?'الرسائل الخاصة بين الأصدقاء فقط.':!hasCrypto()?'هذا المتصفح لا يدعم تشفير الرسائل.':'يستقبل '+esc(nm(o))+' الرسائل بعد أن يفتح قسم المتصفح أول مرة.')+'</p></div>';
    return X.page(nm(o),'<div id="cmthread" class="cthread">'+threadList()+'</div>',{foot:foot,cls:'cdm'});}
  X.on('xcmdm',function(b,d){var o=d('id');if(!o)return;ST.pair=o;if(X.top('cmwho'))A.closeOv();X.open('cmdm',threadPage,{after:function(){toBottom();refocus();}});D().load().then(function(){badge();soon();}).catch(function(){});});
  function sendDM(){if(!canWrite()||sending)return;var o=ST.pair,key='dm:'+o,tx=String(DR[key]||'').trim().slice(0,2000);if(!tx)return;sending=true;var id=X.rid('m');
    enc(o,tx).then(function(e){return D().put(id,{p:pid(me(),o),by:me(),iv:e.iv,ct:e.ct,c:Date.now()});}).then(function(){sending=false;DEC[id]=tx;DR[key]='';var t=root().querySelector('[data-cmd="'+key+'"]');if(t)t.value='';
      var bx=document.getElementById('cmthread');if(bx){bx.innerHTML=threadList();toBottom();}markRead(pid(me(),o));},function(e){sending=false;if(e&&e.code==='nopk')A.toast('لم يفتح صديقك المتصفح بعد',1);else if(e&&e.code==='nokeys')A.toast('تعذّر تجهيز التشفير على هذا الجهاز',1);else A.saveErr(e);});}
  X.on('xcmsend',sendDM);
  function dmList(){var m=me(),fr=friends(),h='';
    if(!fr.length)return X.empty('لا محادثات بعد.','الرسائل الخاصة تكون بين الأصدقاء. أضف صديقاً من «الأصدقاء»، وبعد قبوله تبدأ المحادثة.');
    var rows=fr.map(function(o){var p=pid(m,o),ms=msgs(p),last=ms[ms.length-1];if(last)dec(o,last);return {o:o,last:last,ts:last?last.c||0:0,un:unread(p)};}).sort(function(a,b){return b.ts-a.ts;});
    h+='<div class="card"><div class="list">'+rows.map(function(r){var t=r.last?DEC[r.last.id]:null;
      return '<button class="li cpl" data-act="xcmdm" data-id="'+esc(r.o)+'">'+av(r.o)+'<span class="grow nm"><b>'+esc(nm(r.o))+'</b><span class="muted clast">'+(r.last?(r.last.by===m?'أنت: ':'')+(typeof t==='string'?esc(t.slice(0,60)):'رسالة'):'ابدأ المحادثة')+'</span></span>'+(r.un?'<i class="cun">'+ar(r.un)+'</i>':'<span class="muted">'+(r.ts?esc(X.ago(r.ts)):'')+'</span>')+'</button>';}).join('')+'</div></div>';
    return h+'<p class="muted cnote">'+I('lock')+' الرسائل مشفّرة على الجهاز: لا يقرؤها إلا الطرفان.</p>';}

  /* ---------- my account ---------- */
  function meV(){var p=U().get(me())||{},h='';
    h+='<div class="card cprof">'+av(me(),'lg')+'<h2>'+esc(nm(me()))+'</h2><p class="muted">'+esc(roleOf(me())||'عضو')+'</p>'+
      (canWrite()?'<div class="row fwrap"><label class="btn ghost">'+I('camera')+' '+(p.av?'غيّر الصورة':'ضع صورة شخصية')+'<input type="file" accept="image/*" data-xcmav="1"></label>'+(p.av?'<button class="btn line" data-act="xcmavdel">'+I('trash')+' أزل الصورة</button>':'')+'</div>':'')+'</div>';
    h+='<div class="tip"><b>الاسم من حسابك.</b> يظهر اسمك كما هو في حساب Claude الذي دخلت به، ولا يمكن كتابة اسم آخر هنا، فلا أحد يستطيع الدخول باسم مستعار.</div>';
    if(canWrite())h+='<div class="card"><h2>نبذة عنك</h2>'+X.area('data-cmd="bio" rows="3" maxlength="300" aria-label="نبذة عنك"',DR.bio!=null?DR.bio:(p.bio||''),'مثل: والد '+X.kn()+'، أو أخصائية تخاطب في المركز')+'<button class="btn small" data-act="xcmbio">'+I('check')+' احفظ النبذة</button></div>';
    var mine=P().list(function(x){return x.by===me();}).sort(function(a,b){return (b.c||0)-(a.c||0);});
    if(mine.length)h+='<h2 class="sub2">منشوراتي</h2>'+mine.slice(0,10).map(function(x){return postCard(x,false);}).join('');
    return h;}
  X.onChange(function(t){if(!t||!t.getAttribute||!t.getAttribute('data-xcmav'))return false;var f=t.files&&t.files[0];if(!f||!canWrite())return true;A.setBusy('جارٍ رفع الصورة…');
    var old=(U().get(me())||{}).av;
    X.upAsset(f).then(function(r){return U().patch(me(),{av:r.id});}).then(function(){A.setBusy('');A.toast('تم تحديث صورتك');A.redraw();if(old)X.assetsP().then(function(as){if(as)return as.delete(old);}).catch(function(){});},X.upErr);return true;});
  X.on('xcmavdel',function(){var old=(U().get(me())||{}).av;if(!old||!canWrite())return;U().patch(me(),{av:null}).then(function(){A.toast('أزيلت الصورة');A.redraw();X.assetsP().then(function(as){if(as)return as.delete(old);}).catch(function(){});},A.saveErr);});
  X.on('xcmbio',function(){if(!canWrite())return;var v=String(DR.bio!=null?DR.bio:((U().get(me())||{}).bio||'')).trim().slice(0,300);U().patch(me(),{bio:v||null}).then(function(){DR.bio=null;A.toast('تم الحفظ');A.redraw();},A.saveErr);});

  /* ---------- the section itself ---------- */
  function view(){var h=A.head('المتصفح','أسئلة وأجوبة، صور وفيديو، أصدقاء ورسائل خاصة بين من تشاركهم التطبيق.',false);
    if(SA)return h+'<div class="card"><h2>المتصفح يحتاج حسابات</h2><p>في المتصفح يسأل الأهل والأخصائيون ويجيبون، وينشرون الصور والفيديو ويعلّقون، ويضيف بعضهم بعضاً كأصدقاء ويتراسلون برسائل خاصة، وكل شخص باسم حسابه الحقيقي.</p><p class="muted">هذه النسخة تعمل على الجهاز وحده بلا حسابات ولا إنترنت، فلا يمكن أن تجمع أشخاصاً. المتصفح يعمل في نسخة التطبيق داخل Claude، حيث يدخل كل شخص بحسابه.</p><button class="btn line" data-act="xcmhide">'+I('eye')+' أخفِ هذا القسم من هذا الجهاز</button></div>';
    if(!A.rawDb()||!me())return h+(A.cloud()==='wait'?X.empty('جارٍ الاتصال…'):X.empty('سجّل الدخول لتستخدم المتصفح.','المتصفح يعمل بحسابات Claude: افتح التطبيق من حسابك وسيظهر اسمك تلقائياً.'));
    var rq=incoming().length,ur=unreadAll();
    h+=X.seg('xcmv',ST.v,[['feed','المنشورات'],['ppl','الأصدقاء'+(rq?' · '+ar(rq):'')],['dm','الرسائل'+(ur?' · '+ar(ur):'')],['me','حسابي']]);
    return h+(ST.v==='ppl'?peopleV():ST.v==='dm'?dmList():ST.v==='me'?meV():feed());}
  X.on('xcmv',function(b,d){ST.v=d('v');ST.del='';A.redraw();if(ST.v!=='feed')refresh(false);});
  X.on('xcmhide',function(){A.S().set.hideSocial=true;A.saveLocal();A.tabHide('social',true);A.toast('أُخفي القسم. تعيده من الإعدادات.');});
  X.on('xcmshow',function(){A.S().set.hideSocial=false;A.saveLocal();A.tabHide('social',false);A.closeOv();A.go('social');});
  X.inject('settings',function(){return A.S().set.hideSocial?'<div class="card"><h2>قسم المتصفح</h2><p class="muted">أخفيته من هذا الجهاز.</p><button class="btn small ghost" data-act="xcmshow">'+I('eye')+' أظهر قسم المتصفح</button></div>':'';});
  A.addTab('social',{label:'المتصفح',acc:'--good-ink',before:'progress',icon:IC.globe,view:view});
  if(A.S().set.hideSocial)A.tabHide('social',true);
  X.secOpen.social=function(){A.STACK().length=0;X.layer.innerHTML='';A.go('social');};
  X.onAfter('social',function(){refocus();refresh(false);});
  X.social={ensureKeys:ensureKeys,state:ST};
};
})();
