import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {LocalD1} from '../tools/sqlite.mjs';import {migrate} from '../tools/migrate.mjs';import {seed,createUser} from '../tools/seed.mjs';import {handle} from '../src/worker.mjs';import {q} from '../src/commerce.mjs';import {sha,token} from '../src/security.mjs';
import {restaurantSql,forelProducts,forelCosts,saleOf,setCost}from '../src/restaurants.mjs';
import {forelDishes,forelSets,restaurantCategoryIds,setInfo,illustrativeArts,isRestaurantCat}from '../public/restaurants.js';
import {recommend}from '../public/merchandising.js';import {salesReport,lineRevenue}from '../src/sales-report.mjs';
// Owner 24.11: restaurant «Форель» inside «Готовая еда» — 75 dishes, 5 sets, its own vendor, cost +20 % in whole lari.
const cid='akhalkalaki',pid=k=>cid+'--'+k;
const env=async()=>{const DB=new LocalD1();migrate(DB);await seed(DB,{karo:false});DB.exec('UPDATE cities SET first_order_free=0');DB.exec('DELETE FROM day_hours');for(const s of restaurantSql())DB.exec(s);
 const owner={id:await createUser(DB,{email:'owner@test.invalid',name:'Владелец',password:'test-password-123456',owner:true}),owner:true,memberships:[]};return {DB,owner}};
async function call(e,path,b,user=null){const headers=b?{'Content-Type':'application/json','X-Bazar-CSRF':'1'}:{};if(user){const session=token();await q(e.DB,'INSERT INTO sessions(hash,user_id,expires) VALUES(?,?,?)',await sha(session),user.id,Date.now()+100000).run();headers.cookie='bazar_session='+session}const r=await handle(new Request('https://bazar.test/api/'+path,{method:b?'POST':'GET',headers,...(b?{body:JSON.stringify(b)}:{})}),e);return {...await r.json(),http:r.status}}
async function order(e,items){const base={city_id:cid,items,fulfillment:'delivery'},quote=await call(e,'quote',base);assert.equal(quote.http,200,JSON.stringify(quote));const b={...base,idem:crypto.randomUUID(),day:new Date(Date.now()+86400000).toISOString().slice(0,10),minute:600,method:'cash',customer:{name:'Тестовый покупатель',phone:'+995555000000',address:'Тестовый адрес, не доставлять'},expected_total:quote.total,maximum_total:quote.maximum_total,accepted_weight_rules:true,privacy_consent:true};const o=await call(e,'orders',b);assert.equal(o.http,201,JSON.stringify(o));return o}

test('restaurant «Форель»: migration equals the generator; 75 dishes + 5 sets, sale = cost × 1.2 rounded up to whole lari',()=>{
 assert.ok(fs.readFileSync(new URL('../migrations/0124_restaurant_forel.sql',import.meta.url),'utf8').endsWith(restaurantSql().join('\n')+'\n'));
 const all=forelProducts();assert.equal(forelDishes.length,75);assert.equal(forelSets.length,5);assert.equal(all.length,80);
 assert.equal(new Set(all.map(p=>p.id)).size,80);assert.equal(new Set(all.map(p=>p.names.ru)).size,80,'no duplicate names');
 for(const p of all){assert.equal(p.price,Math.ceil(p.cost*1.2/100-1e-9)*100,p.key);assert.ok(p.names.ru&&p.names.ka&&p.names.hy,p.key);assert.ok(restaurantCategoryIds.includes(p.section))}
 for(const [k,gel]of Object.entries(forelCosts))assert.equal(all.find(p=>p.key===k).cost,Math.round(gel*100),'cost not recomputed: '+k);
 const by=k=>all.find(p=>p.key===k);assert.equal(by('pork_shashlik').price,1600);assert.equal(by('beef_saddle').price,7800);assert.equal(by('chicken_wings').price,900);assert.equal(by('lemon').price,300);
 assert.deepEqual(forelSets.map(s=>setCost(s)),[5300,3050,4350,11200,6500]);assert.deepEqual(forelSets.map(s=>saleOf(setCost(s))),[6400,3700,5300,13500,7800]);
 for(const s of forelSets)for(const [k]of s[4])assert.ok(forelCosts[k]!==undefined,'set component is a real dish: '+k);
 assert.ok(!all.some(p=>/(^|[\s(,])(алкогол|вин[оа]|пиво|водк|коньяк|ча[йя]|кофе|лимонад|сок|вода|напит)/i.test(p.names.ru)),'no drinks, tea, coffee or alcohol in the restaurant');
 assert.equal(all.filter(p=>p.profile.mode==='WEIGHED').length,12);for(const p of all.filter(p=>p.profile.mode==='WEIGHED'))assert.deepEqual([p.profile.minimum_g,p.profile.order_step_g],[1000,1000]);
 for(const n of ['Ряпушка','Седло','Икра','Кебаб'])assert.ok(all.some(p=>p.names.ru.startsWith(n)),'ambiguous name kept: '+n)});

test('restaurant «Форель»: in the public catalogue with vendor and sections in three languages, never the purchase price',async()=>{const e=await env();try{
 const c=await call(e,'catalog?city='+cid);const mine=c.products.filter(p=>p.vendor_id==='akhalkalaki-forel');assert.equal(mine.length,80);
 assert.ok(mine.every(p=>!('cost'in p)&&p.price>0&&isRestaurantCat(p.category)));assert.ok(!JSON.stringify(c).includes('"cost"'),'no purchase price anywhere in the catalogue');
 const v=c.vendors.find(v=>v.id==='akhalkalaki-forel');assert.deepEqual(v.names,{ru:'Форель',ka:'კალმახი',hy:'Իշխան'});
 for(const id of restaurantCategoryIds){const cat=c.categories.find(x=>x.id===id);assert.ok(cat&&cat.names.ru.startsWith('Ресторанные блюда')&&cat.names.ka&&cat.names.hy,id)}
 const trout=mine.find(p=>p.id===pid('forel_river_trout'));assert.equal(trout.profile.mode,'WEIGHED');assert.equal(trout.price,7600,'per kg');
 const tiles=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');// owner 26.11: «Готовая еда» (pizza…) is part of the restaurant tile now: the group holds every restaurant section and the ready-food ones
 assert.match(tiles,/\['restaurant',restaurantGroupIds\]/);assert.match(tiles,/restaurantGroupIds=\['rf_pizza',\.\.\.restaurantCategoryIds,/);assert.ok(!/\['readyfood',/.test(tiles),'no separate «Готовая еда» tile');
 const i18n=fs.readFileSync(new URL('../public/i18n.js',import.meta.url),'utf8');assert.equal(i18n.match(/group_restaurant:/g).length,3)}finally{e.DB.close()}});

test('restaurant «Форель»: a mixed basket is split by vendor; the restaurant line keeps its cost; a dish by the kilo is paid by weight',async()=>{const e=await env();try{
 const o=await order(e,[{product_id:pid('apple_loose'),selection:{grams:1000}},{product_id:pid('forel_pork_shashlik'),selection:{count:2}},{product_id:pid('forel_river_trout'),selection:{grams:1000}}]);
 const id=o.id||o.order?.id;const lines=(await q(e.DB,'SELECT vendor_id,cost,reserved,quote FROM order_lines WHERE order_id=?',id).all()).results;
 const rs=lines.filter(l=>l.vendor_id==='akhalkalaki-forel');assert.equal(rs.length,2);assert.ok(lines.some(l=>l.vendor_id!=='akhalkalaki-forel'),'the shop line stays with its own vendor');
 assert.deepEqual(rs.map(l=>l.cost).sort((a,b)=>a-b),[1300,6300]);
 const groups=(await q(e.DB,'SELECT vendor_id FROM order_groups WHERE order_id=?',id).all()).results.map(g=>g.vendor_id);assert.ok(groups.includes('akhalkalaki-forel')&&groups.length>=2,'one group per vendor');
 // accounting: deliver it and read the owner report
 assert.equal(rs.find(l=>l.cost===6300).reserved,1100,'before weighing the kilo dish reserves +10 %');
 e.DB.exec(`UPDATE order_lines SET reserved=1000 WHERE order_id='${id}' AND product_id='${pid('forel_river_trout')}'`);// what the scales recorded
 e.DB.exec(`UPDATE orders SET status='COMPLETED' WHERE id='${id}'`);const r=await salesReport(e.DB,cid);const f=r.vendors.find(v=>v.id==='akhalkalaki-forel');
 assert.equal(f.revenue,2*1600+7600);assert.equal(f.cost,2*1300+6300);assert.equal(f.gross_profit,f.revenue-f.cost);assert.equal(f.quantity,2);assert.equal(f.weighed_g,1000);
 assert.ok(r.categories.find(c=>c.id==='rf_rs_grill'));assert.equal(r.total.revenue,r.vendors.reduce((s,v)=>s+v.revenue,0));
 const forbidden=await call(e,'manage/sales?city='+cid);assert.notEqual(forbidden.http,200,'the report is for the owner only');
 const ok=await call(e,'manage/sales?city='+cid,null,e.owner);assert.equal(ok.http,200);assert.ok(ok.vendors.some(v=>v.id==='akhalkalaki-forel'))}finally{e.DB.close()}});

test('restaurant «Форель»: a set shows its composition (owner: no «saving» line); sold sets are counted apart',async()=>{const e=await env();try{
 const c=await call(e,'catalog?city='+cid),set=k=>c.products.find(p=>p.id===pid('forel_'+k));
 const meat=setInfo(c.products,set('set_meat'));assert.ok(meat.lines.length>=3&&meat.lines.every(l=>l.product));
 const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');assert.ok(!app.includes("rsWord('saving')"),'owner 24.11: no «saving» on sets — just the set, so nobody has to count');
 assert.equal(setInfo(c.products,set('pork_shashlik')),null,'a single dish is not a set');
 const o=await order(e,[{product_id:pid('forel_set_feast'),selection:{count:1}}]);e.DB.exec(`UPDATE orders SET status='COMPLETED' WHERE id='${o.id||o.order?.id}'`);
 const r=await salesReport(e.DB,cid);assert.equal(r.sets.length,1);assert.equal(r.sets[0].revenue,13500);assert.equal(r.sets[0].cost,11200)}finally{e.DB.close()}});

test('restaurant «Форель»: upsells — sauces, sides and the shop drinks to shashlik, lemon to fish, sets only to a big order; never a sauce to water',async()=>{const e=await env();try{
 const c=await call(e,'catalog?city='+cid),ids=r=>r.map(x=>(x.product||x).id);
 const grill=recommend(c.products,cid,[{product_id:pid('forel_pork_shashlik')}],{limit:20});assert.ok(grill.length,'shashlik gets suggestions');
 assert.ok(ids(grill).some(i=>/forel_(satsebeli|tkemali)/.test(i)));assert.ok(!ids(grill).some(i=>/forel_set_/.test(i)),'one dish is not a big order');
 const fish=recommend(c.products,cid,[{product_id:pid('forel_trout_grill')}],{limit:20});assert.ok(ids(fish).includes(pid('forel_lemon')));
 const big=recommend(c.products,cid,[{product_id:pid('forel_pork_shashlik')},{product_id:pid('forel_kebab')},{product_id:pid('forel_trout_grill')}],{limit:30});assert.ok(ids(big).some(i=>/forel_set_/.test(i)),'a big order is offered a set');
 const water=recommend(c.products,cid,[{product_id:pid('kri_nabeglavi_050')}],{limit:20});assert.ok(!ids(water).some(i=>i.includes('forel_')),'a drink never pulls restaurant food')}finally{e.DB.close()}});

test('restaurant «Форель»: photos — every illustrative photo exists and is listed with its source; dishes without one fall back to the placeholder',async()=>{
 const sources=JSON.parse(fs.readFileSync(new URL('../docs/PHOTO_SOURCES.json',import.meta.url),'utf8')),files=new Set(sources.map(s=>s.file));
 const manifest=JSON.parse(fs.readFileSync(new URL('../public/media/restaurants/forel/image-manifest.json',import.meta.url),'utf8'));assert.equal(manifest.length,illustrativeArts.size);
 for(const a of illustrativeArts){const f='public/media/'+a+'.jpg';assert.ok(fs.existsSync(new URL('../'+f,import.meta.url)),a);assert.ok(files.has(f),a)}
 const {photoPath}=await import('../public/photos.js');const missing=forelProducts().filter(p=>!illustrativeArts.has(p.art));assert.ok(missing.length>0);
 for(const p of missing)assert.match(photoPath(p.art,p.section),/restaurants\/forel\/placeholder\.jpg/,p.key);
 assert.match(photoPath('restaurants/forel/grill/pork-shashlik','rf_rs_grill'),/grill\/pork-shashlik\.jpg\?v=/)});

test('restaurant «Форель»: «Забота о близких» reads the same catalogue, so the dishes are orderable there too',()=>{
 const z=fs.readFileSync(new URL('../public/zabota.html',import.meta.url),'utf8')+(fs.existsSync(new URL('../public/zabota.js',import.meta.url))?fs.readFileSync(new URL('../public/zabota.js',import.meta.url),'utf8'):'');assert.match(z,/catalog/)});

test('restaurant «Форель»: orders until 22:00 — a restaurant-only basket is delivered 12:00–22:30; migration equals the generator',async()=>{const e=await env();try{
 const {forelHoursSql}=await import('../src/restaurants.mjs');assert.ok(fs.readFileSync(new URL('../migrations/0126_restaurant_forel_hours_b.sql',import.meta.url),'utf8').endsWith(forelHoursSql().join('\n')+'\n'));
 for(const s of forelHoursSql())e.DB.exec(s);const day=new Date(Date.now()+86400000).toISOString().slice(0,10);
 const r=await call(e,`slots?city=${cid}&day=${day}&products=${pid('forel_pork_shashlik')}`);const m=r.slots.map(s=>s.minute);
 assert.equal(Math.min(...m),720,'first delivery 12:00');assert.equal(Math.max(...m),1350,'last delivery 22:30 — with the 30-minute lead the last order is 22:00');
 const mixed=await call(e,`slots?city=${cid}&day=${day}&products=${pid('forel_pork_shashlik')},${pid('apple_loose')}`);assert.ok(Math.max(...mixed.slots.map(s=>s.minute))<1350,'with shop goods the shop hours apply')}finally{e.DB.close()}});

test('owner 24.11: Karo (fruit and vegetables) delivers in the evening by its own hours, until 20:00, last order 19:30; with other shop goods the usual hours stay',async()=>{const DB=new LocalD1();migrate(DB);await seed(DB);DB.exec('DELETE FROM day_hours');const e={DB};try{
 e.DB.exec("UPDATE vendors SET open_minute=480,close_minute=1200 WHERE id='akhalkalaki-karo'");const day=new Date(Date.now()+86400000).toISOString().slice(0,10);
 const karo=(await e.DB.prepare("SELECT id FROM products WHERE vendor_id='akhalkalaki-karo' AND active=1 LIMIT 1").first()).id,other=(await e.DB.prepare("SELECT id FROM products WHERE vendor_id='akhalkalaki-artur' AND active=1 LIMIT 1").first())?.id;
 const prev=process.env.BAZAR_IGNORE_ORDER_HOURS;e.DB.exec("INSERT INTO app_config(key,value) VALUES('order_hours','540-1080') ON CONFLICT(key) DO UPDATE SET value=excluded.value");delete process.env.BAZAR_IGNORE_ORDER_HOURS;
 try{const r=await call(e,`slots?city=${cid}&day=${day}&products=${karo}`);assert.equal(Math.max(...r.slots.map(s=>s.minute)),1200,'Karo alone: up to 20:00, past the 18:00 cap');
  const fs=await import('node:fs'),{karoHoursSql1124}=await import('../src/karo.mjs');assert.ok(fs.readFileSync(new URL('../migrations/0127_karo_until_20.sql',import.meta.url),'utf8').endsWith(karoHoursSql1124().join('\n')+'\n'));
  if(other){const m=await call(e,`slots?city=${cid}&day=${day}&products=${karo},${other}`);assert.ok(Math.max(...m.slots.map(s=>s.minute))<=1060,'with Artur: the usual 18:00 cap')}
  const c=await call(e,'catalog?city='+cid);assert.deepEqual(c.city.evening_vendors,['akhalkalaki-karo'])}finally{if(prev!==undefined)process.env.BAZAR_IGNORE_ORDER_HOURS=prev}}finally{e.DB.close()}});

test('owner 24.11: home page — tiles right after the search, popular goods instead of all of them, no banners, «Забота» in the header',()=>{
 const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8'),html=fs.readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
 assert.match(app,/filter='home'/);assert.match(app,/class=\"home-more\"/);/* owner 26.11: «Забота» moved from the header into the top cards, next to the restaurant */assert.match(app,/class="top-card top-care" href="\.\/zabota\.html"/);assert.ok(!/class="zabota-link"/.test(app));assert.ok(!html.includes('>Забота о близких</a></div>'),'the big «Забота» strip is gone from the top');
 assert.ok(!app.includes('${ownHoursHTML()}'),'no big hours block; the hours are on the tiles');assert.ok(!app.includes('soon-line'))});

test('owner 24.11: the grill «Седло» is «Корейка свиная» in three languages; the beef saddle stays; migration equals the generator',async()=>{const e=await env();try{
 const {forelRenameSql}=await import('../src/restaurants.mjs');assert.ok(fs.readFileSync(new URL('../migrations/0128_forel_koreika.sql',import.meta.url),'utf8').endsWith(forelRenameSql().join('\n')+'\n'));
 for(const s of forelRenameSql())e.DB.exec(s);const c=await call(e,'catalog?city='+cid),by=k=>c.products.find(p=>p.id===pid('forel_'+k));
 assert.deepEqual(by('saddle_grill').names,{ru:'Корейка свиная',ka:'ღორის კორეიკა',hy:'Խոզի կորեյկա'});assert.equal(by('saddle_grill').price,6500);assert.equal(by('beef_saddle').names.ru,'Седло из говядины')}finally{e.DB.close()}});

test('owner 24.11: «не рябушка, а ряпушка» — the fish is named right in three languages; migration equals the generator',async()=>{const e=await env();try{
 const {forelRenameSql}=await import('../src/restaurants.mjs');assert.ok(fs.readFileSync(new URL('../migrations/0129_forel_ryapushka.sql',import.meta.url),'utf8').endsWith(forelRenameSql(1).join('\n')+'\n'));
 for(const s of forelRenameSql(1))e.DB.exec(s);const c=await call(e,'catalog?city='+cid),f=c.products.find(p=>p.id===pid('forel_ryabushka'));
 assert.deepEqual(f.names,{ru:'Ряпушка',ka:'რიაპუშკა',hy:'Ռյապուշկա'});assert.equal(f.price,3300);assert.ok(!JSON.stringify(c.products.map(p=>p.names)).includes('Рябушк'))}finally{e.DB.close()}});

test('owner 24.11: «мы будем точно так подавать» — no «similar dish» note on restaurant photos',()=>{
 const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');assert.ok(!app.includes('photo-note')&&!app.includes('photoNote'))});

test('owner 24.11: five dishes are closed (hidden, not deleted) — the rest of the restaurant and every set stay; migration equals the generator',async()=>{const e=await env();try{
 const {forelHideSql,forelHidden}=await import('../src/restaurants.mjs');assert.ok(fs.readFileSync(new URL('../migrations/0130_forel_hide5.sql',import.meta.url),'utf8').endsWith(forelHideSql().join('\n')+'\n'));
 for(const s of forelHideSql())e.DB.exec(s);const c=await call(e,'catalog?city='+cid),mine=c.products.filter(p=>p.vendor_id==='akhalkalaki-forel');
 assert.equal(mine.length,75);for(const k of forelHidden)assert.ok(!mine.some(p=>p.id===pid('forel_'+k)),k);
 assert.equal((await e.DB.prepare("SELECT COUNT(*) n FROM products WHERE id LIKE 'akhalkalaki--forel_%'").first()).n,80,'still in the database');
 for(const s of forelSets)assert.ok(setInfo(c.products,mine.find(p=>p.id===pid('forel_'+s[0]))).lines.every(l=>l.product),s[0])}finally{e.DB.close()}});

test('owner 25.11: «Забота о близких» has a way back to the shop in three languages',()=>{
 const z=fs.readFileSync(new URL('../public/zabota.html',import.meta.url),'utf8');assert.match(z,/id="t-back" href="\.\/"/);for(const w of ['← Назад в Базар','← Վերադառնալ Բազար','← უკან ბაზარში'])assert.ok(z.includes(w),w)});

test('owner 25.11: «Забота» keeps the draft until the order is sent; the phone suggests the payer\'s own name and phone, never for the recipient',()=>{
 const z=fs.readFileSync(new URL('../public/zabota.html',import.meta.url),'utf8');
 assert.match(z,/localStorage\.setItem\(DRAFT/);assert.match(z,/function showDone\(r\)\{\n  try\{localStorage\.removeItem\(DRAFT\)/);assert.ok(!/DRAFT_FIELDS=\[[^\]]*c-privacy/.test(z),'consents are ticked anew');
 assert.match(z,/id="pname" type="text" autocomplete="name"/);assert.match(z,/id="pphone"[^>]*autocomplete="tel"/);assert.match(z,/id="rphone"[^>]*autocomplete="off"/);assert.match(z,/id="rname"[^>]*autocomplete="off"/);
 const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');assert.ok(app.includes('autocomplete="name"')&&app.includes('autocomplete="tel"')&&app.includes('autocomplete="street-address"'))});

import {clock}from '../src/commerce.mjs';
test('owner 26.11: restaurant list of 16 — pre-order times are enforced across days, the vendace is «ask first» with its price, the river trout is closed, names and 30 minutes of cooking; migration equals the generator',async()=>{const e=await env();try{
 const {forelMenuSql,forelLead,forelAsk,forelHidden2}=await import('../src/restaurants.mjs');
 const file=fs.readFileSync(new URL('../migrations/0132_forel_menu_1126.sql',import.meta.url),'utf8').split('\n').slice(1).filter(Boolean).join('\n');assert.equal(file,forelMenuSql().join('\n'));
 for(const s of forelMenuSql())e.DB.exec(s);for(const s of forelMenuSql())e.DB.exec(s);// the second run changes nothing
 const c=await call(e,'catalog?city='+cid),by=k=>c.products.find(p=>p.id===pid('forel_'+k));
 for(const [k,m] of Object.entries(forelLead)){assert.equal(by(k).profile.lead_minutes,m,k);assert.equal(by(k).profile.prep_minutes,undefined,k+': a pre-order dish has no «30 minutes» note')}
 assert.deepEqual(Object.fromEntries(Object.entries(forelLead).map(([k,m])=>[k,m/60])),{beef_saddle:6,chicken_boiled:5,pork_knuckle:6,pork_leg_baked:6,rabbit_baked:4,fish_kebab:3,oxtail:24,piglet_baked:24,dolma:24,sterlet:48});
 for(const k of forelHidden2)assert.equal(by(k),undefined,k+' is not offered');assert.ok(await q(e.DB,"SELECT id FROM products WHERE id=?",pid('forel_river_trout')).first(),'closed, not deleted');
 for(const k of forelAsk){const p=by(k);assert.equal(p.profile.mode,'REQUEST');assert.equal(p.profile.ask_availability,1);assert.equal(p.price,3300,'the price stays');assert.equal(JSON.parse((await q(e.DB,'SELECT profile FROM products WHERE id=?',pid('forel_'+k)).first()).profile).restore.mode,'WEIGHED')}
 assert.equal(by('kebab').names.ru,'Кебаб из говядины');assert.equal(by('olives').names.ru,'Оливки чёрные с лимоном');assert.equal(by('pkhali').names.ru,'Пхали из баклажана и перца');assert.equal(by('eggplant_walnuts').names.ru,'Баклажанные рулеты, 6 штук');
 for(const k of ['kebab','olives','pkhali','eggplant_walnuts'])assert.ok(by(k).names.ka&&by(k).names.hy,k+' has all three languages');
 assert.equal(by('pork_shashlik').profile.prep_minutes,30);assert.equal(by('set_meat').profile.prep_minutes,30);
 // the delivery times respect the lead, across days
 const now=clock('Asia/Tbilisi'),day=n=>new Date(Date.now()+n*86400000).toISOString().slice(0,10);
 const slotsOf=async(k,d)=>(await call(e,`slots?city=${cid}&day=${d}&products=${pid('forel_'+k)}`)).slots.map(s=>s.minute);
 assert.deepEqual(await slotsOf('sterlet',day(0)),[]);assert.deepEqual(await slotsOf('sterlet',day(1)),[],'two days ahead: tomorrow is too early');assert.ok((await slotsOf('sterlet',day(3))).length>0);
 for(const m of await slotsOf('beef_saddle',day(0)))assert.ok(m>=now.minute+360,'6 hours from now: '+m);
 // the server refuses what the picker would not offer
 const mk=(k,d,g)=>({city_id:cid,items:[{product_id:pid('forel_'+k),selection:{grams:g||1000}}],fulfillment:'delivery'});
 const place=async(k,d)=>{const base=mk(k,d),quote=await call(e,'quote',base);assert.equal(quote.http,200,JSON.stringify(quote));return call(e,'orders',{...base,idem:crypto.randomUUID(),day:d,minute:720,method:'cash',customer:{name:'Тест',phone:'+995555000000',address:'Тестовый адрес, не доставлять'},expected_total:quote.total,maximum_total:quote.maximum_total,accepted_weight_rules:true,privacy_consent:true})};
 const early=await place('sterlet',day(1));assert.equal(early.http,409);assert.match(JSON.stringify(early),/BULK_LEAD_TIME/);
 assert.equal((await place('sterlet',day(3))).http,201)}finally{e.DB.close()}});

test('owner 26.11: a pre-order dish is never hidden by «нет в наличии» / «нет сегодня» — it is always there, by pre-order; an ordinary dish stays hidden; the delivery day\'s own closure still counts',async()=>{const e=await env();try{
 const {forelMenuSql}=await import('../src/restaurants.mjs');for(const s of forelMenuSql())e.DB.exec(s);
 const FOREVER='9999-12-31',day=n=>new Date(Date.now()+n*86400000).toISOString().slice(0,10),close=(k,d)=>e.DB.prepare("INSERT OR REPLACE INTO day_closures(product_id,day,vendor_id,closed_by,at) VALUES(?,?,'akhalkalaki-forel','test','2026-11-26T00:00:00.000Z')").bind(pid('forel_'+k),d).run();
 await close('pork_knuckle',FOREVER);await close('chicken_boiled',day(0));await close('pork_shashlik',FOREVER);await close('ryabushka',FOREVER);// two pre-order dishes and one ordinary dish are marked unavailable
 let c=await call(e,'catalog?city='+cid),has=k=>c.products.some(p=>p.id===pid('forel_'+k));
 assert.ok(has('pork_knuckle'),'closed for ever, but a pre-order dish: shown');assert.ok(has('chicken_boiled'),'closed today, but a pre-order dish: shown');assert.ok(!has('pork_shashlik'),'an ordinary dish stays hidden');assert.ok(has('ryabushka'),'an «ask first» dish is shown too (the vendace), though the restaurant marked it unavailable');
 const place=async(k,d,g)=>{const base={city_id:cid,items:[{product_id:pid('forel_'+k),selection:g?{grams:g}:{count:1}}],fulfillment:'delivery'},quote=await call(e,'quote',base);assert.equal(quote.http,200,JSON.stringify(quote));return call(e,'orders',{...base,idem:crypto.randomUUID(),day:d,minute:720,method:'cash',customer:{name:'Тест',phone:'+995555000000',address:'Тестовый адрес, не доставлять'},expected_total:quote.total,maximum_total:quote.maximum_total,accepted_weight_rules:true,privacy_consent:true})};
 assert.equal((await place('pork_knuckle',day(2))).http,201,'a pre-order dish closed for ever can be ordered ahead');
 await close('chicken_boiled',day(3));const r=await place('chicken_boiled',day(3));assert.equal(r.http,409);assert.match(JSON.stringify(r),/CLOSED_TODAY/,'the restaurant said «not that day»: refused for that day');
 assert.equal((await place('chicken_boiled',day(4))).http,201,'another day is fine');
 const o=await place('pork_shashlik',day(2));assert.equal(o.http,409);assert.match(JSON.stringify(o),/CLOSED_TODAY/,'the hidden ordinary dish still cannot be ordered')}finally{e.DB.close()}});
