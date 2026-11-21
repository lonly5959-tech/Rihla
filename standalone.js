/* standalone.js — runs رحلة on its own device with no account and no connection.
   It stands in for the hosting platform: the database, the files store and downloads all live on this device
   (IndexedDB), and sw.js keeps the whole app available offline. Loaded before every other script. */
(function(){
'use strict';
window.__STANDALONE=true;window.__NEUTRAL=true;window.__DEFNAME='بطلنا';window.__BLOBBASE='_blob/';
var DBN='rihla-local',dbp=null;
function open(){
  if(dbp)return dbp;
  dbp=new Promise(function(res,rej){
    var r=indexedDB.open(DBN,1);
    r.onupgradeneeded=function(){var d=r.result;['docs','blobs','vx'].forEach(function(s){if(!d.objectStoreNames.contains(s))d.createObjectStore(s);});};
    r.onsuccess=function(){var d=r.result;d.onversionchange=function(){d.close();dbp=null;};res(d);};
    r.onerror=function(){dbp=null;rej(r.error||new Error('idb'));};
    r.onblocked=function(){dbp=null;rej(new Error('blocked'));};
  });
  return dbp;
}
/* one request in its own transaction; resolves with the request's result once the transaction has committed */
function req(store,mode,fn){return open().then(function(d){return new Promise(function(res,rej){
  var t=d.transaction(store,mode),r=fn(t.objectStore(store));
  t.oncomplete=function(){res(r&&'result' in r?r.result:undefined);};
  t.onerror=t.onabort=function(){rej(t.error||new Error('idb'));};});});}
function clone(o){return o==null?o:JSON.parse(JSON.stringify(o));}
function snap(id,d){return {id:id,exists:d!=null,data:function(){return d==null?undefined:clone(d);}};}

/* ---------- database: the same small interface the app uses online ---------- */
function docRef(path){var id=path.split('/').pop();return {id:id,path:path,
  get:function(){return req('docs','readonly',function(s){return s.get(path);}).then(function(v){return snap(id,v===undefined?null:v);});},
  set:function(data){var v=clone(data);return req('docs','readwrite',function(s){return s.put(v,path);}).then(function(){});},
  delete:function(){return req('docs','readwrite',function(s){return s.delete(path);}).then(function(){});}};}
function cmp(f,dir){var k=dir==='desc'?-1:1;return function(a,b){var x=a.d&&a.d[f],y=b.d&&b.d[f];if(x===y)return 0;if(x==null)return 1;if(y==null)return -1;
  return (typeof x==='number'&&typeof y==='number'?x-y:(String(x)<String(y)?-1:1))*k;};}
function colRef(path,q){q=q||{};return {path:path,
  orderBy:function(f,dir){return colRef(path,Object.assign({},q,{ob:[f,dir||'asc']}));},
  limit:function(n){return colRef(path,Object.assign({},q,{lim:n}));},
  doc:function(id){return docRef(path+'/'+id);},
  get:function(){var pre=path+'/';return open().then(function(d){return new Promise(function(res,rej){
    var out=[],t=d.transaction('docs','readonly'),c=t.objectStore('docs').openCursor(IDBKeyRange.bound(pre,pre+'￿'));
    c.onsuccess=function(){var cur=c.result;if(!cur)return;var k=String(cur.key).slice(pre.length);if(k&&k.indexOf('/')<0)out.push({id:k,d:cur.value});cur.continue();};
    t.oncomplete=function(){if(q.ob)out.sort(cmp(q.ob[0],q.ob[1]));if(q.lim)out=out.slice(0,q.lim);
      var docs=out.map(function(o){return snap(o.id,o.d);});res({docs:docs,size:docs.length,empty:!docs.length});};
    t.onerror=t.onabort=function(){rej(t.error||new Error('idb'));};});});}};}
var db={doc:docRef,collection:function(p){return colRef(p);}};

/* ---------- the person: one family device, full rights ---------- */
var NAMES={};try{NAMES=JSON.parse(localStorage.getItem('rihla-names')||'{}')||{};}catch(e){}
window.__localNames=function(m){Object.keys(m||{}).forEach(function(k){if(m[k]&&m[k].name)NAMES[k]={name:m[k].name};});try{localStorage.setItem('rihla-names',JSON.stringify(NAMES));}catch(e){}};
var user={can:function(){return Promise.resolve(true);},isOwner:function(){return Promise.resolve(true);},id:function(){return Promise.resolve('local');},
  profiles:function(ids){var o={};(ids||[]).forEach(function(i){if(i==='local')o[i]={name:'هذا الجهاز'};else if(NAMES[i])o[i]=NAMES[i];});return Promise.resolve(o);}};

/* ---------- files (videos, photos, attachments): kept as bytes on the device, served by sw.js at _blob/<id> ---------- */
function bytes(blob){if(blob.arrayBuffer)return blob.arrayBuffer();return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result);};r.onerror=function(){rej(r.error);};r.readAsArrayBuffer(blob);});}
function putBlob(id,blob){return bytes(blob).then(function(buf){var v={buf:buf,type:blob.type||'',size:buf.byteLength,t:Date.now()};return req('blobs','readwrite',function(s){return s.put(v,id);}).then(function(){return v;});});}
window.__localPutAsset=putBlob;
var assets={
  upload:function(blob){var id='L'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
    return putBlob(id,blob).then(function(v){return {id:id,url:window.__BLOBBASE+id,sizeBytes:v.size,contentType:v.type};});},
  list:function(){return open().then(function(d){return new Promise(function(res){var out=[],t=d.transaction('blobs','readonly'),c=t.objectStore('blobs').openCursor();
    c.onsuccess=function(){var cur=c.result;if(!cur)return;out.push({id:String(cur.key),contentType:cur.value.type,sizeBytes:cur.value.size});cur.continue();};
    t.oncomplete=function(){res({assets:out,usage:{}});};t.onerror=function(){res({assets:[],usage:{}});};});});},
  delete:function(id){return req('blobs','readwrite',function(s){return s.delete(id);}).then(function(){});}
};

/* ---------- downloads: the share sheet (Save to Files, AirDrop), or a plain download where sharing is missing ---------- */
var downloads={save:function(o){
  var name=o.filename||'file',type=/\.json$/i.test(name)?'application/json':/\.html?$/i.test(name)?'text/html':'application/octet-stream';
  var blob=o.data instanceof Blob?o.data:new Blob([o.data],{type:type});
  try{var file=new File([blob],name,{type:blob.type||type});
    if(navigator.canShare&&navigator.share&&navigator.canShare({files:[file]}))
      return navigator.share({files:[file],title:name}).catch(function(e){if(e&&e.name==='AbortError')throw {code:'cancelled'};return plain(blob,name);});}catch(e){}
  return plain(blob,name);}};
function plain(blob,name){var url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();
  setTimeout(function(){try{URL.revokeObjectURL(url);a.remove();}catch(e){}},5000);return Promise.resolve();}

window.claude={use:function(n){return Promise.resolve(n==='db'?db:n==='user'?user:n==='assets'?assets:n==='downloads'?downloads:null);}};

/* ---------- app-voice clips that carry the child's name arrive in the transfer file, not on the public link ---------- */
function regVx(){if(!window.__vc||!window.VOICES||!window.VKEY)return Promise.resolve(0);
  return open().then(function(d){return new Promise(function(res){var by={},t=d.transaction('vx','readonly'),c=t.objectStore('vx').openCursor();
    c.onsuccess=function(){var cur=c.result;if(!cur)return;var k=String(cur.key),i=k.indexOf(':');if(i>0)(by[k.slice(0,i)]=by[k.slice(0,i)]||{})[k.slice(i+1)]=cur.value;cur.continue();};
    t.oncomplete=function(){var n=0;Object.keys(by).forEach(function(dl){var data={};Object.keys(by[dl]).forEach(function(id){var v=by[dl][id];if(!v||!v.b64)return;data['x_'+id]=v.b64;
        window.VOICES[dl]=window.VOICES[dl]||{};window.VOICES[dl][id]=v.t;n++;});
      window.__vc(dl,99,data);Object.keys(data).forEach(function(k){window.VKEY[k.slice(2)]=[99,k];});});res(n);};
    t.onerror=function(){res(0);};});});}
window.__localPutVx=function(vx){var ops=[];Object.keys(vx||{}).forEach(function(dl){Object.keys(vx[dl]||{}).forEach(function(id){var v=vx[dl][id];
  if(v&&v.b64)ops.push(req('vx','readwrite',function(s){return s.put({t:v.t,b64:v.b64},dl+':'+id);}));});});
  return Promise.all(ops).then(regVx);};
document.addEventListener('DOMContentLoaded',function(){regVx().catch(function(){});});

/* ---------- offline, and asking the browser to keep this device's data ---------- */
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(function(){});}catch(e){}
if('serviceWorker' in navigator)window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});
})();
