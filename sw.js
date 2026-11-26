/* sw.js — keeps رحلة working with no connection, and serves the files saved on this device at _blob/<id>. */
var V='rihla-46a856a14b',FILES=["./", "alib.js", "alib2.js", "alib3.js", "alib4.js", "alib5.js", "bimg.js", "content.js", "ebp.js", "fonts/baloo-bhaijaan-2-arabic-700-normal.woff2", "fonts/baloo-bhaijaan-2-arabic-800-normal.woff2", "fonts/baloo-bhaijaan-2-latin-700-normal.woff2", "fonts/baloo-bhaijaan-2-latin-800-normal.woff2", "fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2", "fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2", "fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2", "fonts/ibm-plex-sans-arabic-latin-400-normal.woff2", "fonts/ibm-plex-sans-arabic-latin-600-normal.woff2", "fonts/ibm-plex-sans-arabic-latin-700-normal.woff2", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "img/apple.jpg", "img/backpack.jpg", "img/ball.jpg", "img/banana.jpg", "img/bath.jpg", "img/bathroomdoor.jpg", "img/biscuit.jpg", "img/bread.jpg", "img/breakfast.jpg", "img/brush.jpg", "img/brushback.jpg", "img/brushdown.jpg", "img/brushup.jpg", "img/bubbles.jpg", "img/burger.jpg", "img/bye.jpg", "img/calm_break.jpg", "img/calm_breathe.jpg", "img/calm_count.jpg", "img/calm_quiet.jpg", "img/calm_squeeze.jpg", "img/car.jpg", "img/carryplate.jpg", "img/carseat.jpg", "img/cat.jpg", "img/center.jpg", "img/chair.jpg", "img/cheese.jpg", "img/chicken.jpg", "img/choco.jpg", "img/closet.jpg", "img/comb.jpg", "img/come.jpg", "img/cow.jpg", "img/cucumber.jpg", "img/cup.jpg", "img/dinner.jpg", "img/dog.jpg", "img/done.jpg", "img/door.jpg", "img/drink.jpg", "img/dryface.jpg", "img/dryhands.jpg", "img/ear.jpg", "img/eat.jpg", "img/egg.jpg", "img/emo_angry.jpg", "img/emo_calm.jpg", "img/emo_happy.jpg", "img/emo_sad.jpg", "img/emo_scared.jpg", "img/emo_surprised.jpg", "img/emo_tired.jpg", "img/eye.jpg", "img/fish.jpg", "img/flush.jpg", "img/funfair.jpg", "img/give.jpg", "img/grape.jpg", "img/hand.jpg", "img/help.jpg", "img/hug.jpg", "img/hurt.jpg", "img/imit_clap.jpg", "img/imit_head.jpg", "img/imit_stomp.jpg", "img/juice.jpg", "img/kabsa.jpg", "img/knock.jpg", "img/lamp.jpg", "img/laundry.jpg", "img/leg.jpg", "img/lightoff.jpg", "img/lunch.jpg", "img/lunchchoice.jpg", "img/mall.jpg", "img/me.jpg", "img/milk.jpg", "img/more.jpg", "img/mouth.jpg", "img/move_bear.jpg", "img/move_jump.jpg", "img/move_march.jpg", "img/move_push.jpg", "img/move_stretch.jpg", "img/no.jpg", "img/nose.jpg", "img/open.jpg", "img/pajamas.jpg", "img/pants.jpg", "img/park.jpg", "img/pasta.jpg", "img/paste.jpg", "img/pen.jpg", "img/pizza.jpg", "img/plate.jpg", "img/play.jpg", "img/play_ja.jpg", "img/play_song.jpg", "img/play_turn.jpg", "img/putpaste.jpg", "img/rest.jpg", "img/rinse.jpg", "img/rinsehands.jpg", "img/rubhands.jpg", "img/sea.jpg", "img/shampoo.jpg", "img/sheep.jpg", "img/shoe.jpg", "img/shoes.jpg", "img/shower.jpg", "img/sitchair.jpg", "img/sleep.jpg", "img/soap.jpg", "img/socks.jpg", "img/song.jpg", "img/soup.jpg", "img/speech.jpg", "img/spoon.jpg", "img/st_bar_1.jpg", "img/st_bar_2.jpg", "img/st_bar_3.jpg", "img/st_bar_4.jpg", "img/st_bar_5.jpg", "img/st_doc_1.jpg", "img/st_doc_2.jpg", "img/st_doc_3.jpg", "img/st_doc_4.jpg", "img/st_doc_5.jpg", "img/st_eid_1.jpg", "img/st_eid_2.jpg", "img/st_eid_3.jpg", "img/st_eid_4.jpg", "img/st_eid_5.jpg", "img/st_sch_1.jpg", "img/st_sch_2.jpg", "img/st_sch_3.jpg", "img/st_sch_4.jpg", "img/st_sch_5.jpg", "img/st_trip_1.jpg", "img/st_trip_2.jpg", "img/st_trip_3.jpg", "img/st_trip_4.jpg", "img/st_trip_5.jpg", "img/story.jpg", "img/swim.jpg", "img/swing.jpg", "img/tablet.jpg", "img/takebrush.jpg", "img/tapoff.jpg", "img/tapon.jpg", "img/tissue.jpg", "img/toilet.jpg", "img/towel.jpg", "img/train.jpg", "img/tubwater.jpg", "img/v_a.jpg", "img/v_i.jpg", "img/v_u.jpg", "img/wake.jpg", "img/walk.jpg", "img/washface.jpg", "img/washhands.jpg", "img/water.jpg", "img/wear.jpg", "img/wow.jpg", "img/write.jpg", "img/yes.jpg", "img/yogurt.jpg", "index.html", "lame.min.js", "manifest.webmanifest", "px.css", "px_child.js", "px_core.js", "px_family.js", "px_more.js", "px_pro.js", "px_social.js", "standalone.js", "vc/eg00.js", "vc/eg01.js", "vc/eg02.js", "vc/eg03.js", "vc/eg04.js", "vc/eg05.js", "vc/eg06.js", "vc/eg07.js", "vc/eg08.js", "vc/eg09.js", "vc/eg10.js", "vc/eg11.js", "vc/eg12.js", "vc/eg13.js", "vc/sa00.js", "vc/sa01.js", "vc/sa02.js", "vc/sa03.js", "vc/sa04.js", "vc/sa05.js", "vc/sa06.js", "vc/sa07.js", "vc/sa08.js", "vc/sa09.js", "vc/sa10.js", "vc/sa11.js", "vc/sa12.js", "vc/sa13.js", "voices.js"];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('rihla-')===0&&k!==V;}).map(function(k){return caches.delete(k);}));})
    .then(function(){return self.clients.claim();}));
});
function idb(){return new Promise(function(res,rej){var r=indexedDB.open('rihla-local',1);
  r.onupgradeneeded=function(){var d=r.result;['docs','blobs','vx'].forEach(function(s){if(!d.objectStoreNames.contains(s))d.createObjectStore(s);});};
  r.onsuccess=function(){res(r.result);};r.onerror=function(){rej(r.error);};});}
function blobResp(id,req){
  return idb().then(function(d){return new Promise(function(res){var q=d.transaction('blobs','readonly').objectStore('blobs').get(id);
    q.onsuccess=function(){res(q.result||null);};q.onerror=function(){res(null);};});}).then(function(v){
    if(!v||!v.buf)return new Response('',{status:404});
    var type=v.type||'application/octet-stream',buf=v.buf,size=buf.byteLength,rg=req.headers.get('range');
    if(rg){var m=/bytes=(\d*)-(\d*)/.exec(rg);
      if(m){var s=m[1]===''?null:+m[1],en=m[2]===''?null:+m[2];
        if(s===null){s=Math.max(0,size-(en||0));en=size-1;}else if(en===null||en>=size)en=size-1;
        if(s>=size||s>en)return new Response('',{status:416,headers:{'Content-Range':'bytes */'+size}});
        return new Response(buf.slice(s,en+1),{status:206,headers:{'Content-Type':type,'Content-Range':'bytes '+s+'-'+en+'/'+size,'Content-Length':String(en-s+1),'Accept-Ranges':'bytes'}});}}
    return new Response(buf,{status:200,headers:{'Content-Type':type,'Content-Length':String(size),'Accept-Ranges':'bytes'}});
  },function(){return new Response('',{status:404});});
}
self.addEventListener('fetch',function(e){
  var r=e.request,u=new URL(r.url);if(u.origin!==self.location.origin)return;
  var i=u.pathname.indexOf('/_blob/');
  if(i>=0){e.respondWith(blobResp(decodeURIComponent(u.pathname.slice(i+7)),r));return;}
  if(r.method!=='GET')return;
  e.respondWith(caches.open(V).then(function(c){
    if(r.mode==='navigate')return c.match(new URL('index.html',self.registration.scope).href).then(function(ix){return ix||fetch(r);});
    return c.match(r,{ignoreSearch:true}).then(function(hit){return hit||fetch(r);});
  }));
});
