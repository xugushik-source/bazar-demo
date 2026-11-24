// Owner 24.11: restaurant «Форель» — «Ресторанные блюда» inside «Готовая еда». Purchase prices approved by the restaurant (GEL),
// kept only here (server side); sale price = Math.ceil(cost × 1.2) in whole lari. Sets cost the sum of their dishes.
// Public names, sections and set composition: public/restaurants.js. Another restaurant = a new vendor + a dish list here.
import {restaurantSections,forelDishes,forelSets,forelVendorId,forelKey,restaurantArt}from '../public/restaurants.js';
export const forelVendor={id:forelVendorId,city_id:'akhalkalaki',names:{ru:'Форель',ka:'კალმახი',hy:'Իշխան'}};
// cost in GEL per portion (per kg for dishes sold by the kilogram)
export const forelCosts={pork_leg_baked:58,rabbit_baked:40,chicken_boiled:58,piglet_baked:63,pork_knuckle:49,beef_saddle:64.5,lamb_khashlama:63,beef_stroganoff:16,
 pork_fried:16,ojakhuri:18,pork_pot:16,dolma:15,khashlama:16,oxtail:16,chkmeruli:13,
 fish_kebab:13,river_trout:63,ryabushka:27,sterlet:45,trout_large:40,
 lamb_ribs_shashlik:18,chicken_breast_shashlik:10.5,pork_shashlik:13,chicken_spit:27,saddle_grill:54,trout_grill:31,quail:10.5,chicken_tabaka:13,
 chicken_wings:7,grilled_vegetables:9,kebab:11.5,pork_ribs_shashlik:13,
 pickles_banquet:16,cheese_banquet:22,ham:18,summer_dolma:49,caviar:18,sausage:13,pkhali:13,fish_assorted:22,eggplant_walnuts:13,basturma_sujuk:15,
 greens:9,meat_platter:16,vegetable_platter:13,pickles:13,cheese:13,tongue_boiled:13,lemon:2.5,olives:5,
 caesar:13,crab_salad:10.5,kuchmachi:13,svetofor:16,moskovsky:13,tongue_cucumber_salad:13,vegetable_salad:13,bean_salad:14,chicken_mushroom_salad:13,
 chakapuli:22,kharcho:13,chicken_soup:13,ostri:13,solyanka:13,ukha:10.5,
 peas_egg:3.5,mushrooms_baked:7,mushrooms_cheese:10.5,potato_home:5,fries:3.5,bread_basket:2.5,matsoni:4,satsebeli:2.5,sour_cream:4,tkemali:2.5};
const tetri=gel=>Math.round(gel*100);
export const saleOf=costTetri=>Math.ceil(costTetri*1.2/100-1e-9)*100;   // whole lari, rounded up
export const setCost=set=>set[4].reduce((s,[k,n])=>s+tetri(forelCosts[k])*n,0);
const byKg={mode:'WEIGHED',policy_version:1,minimum_g:1000,order_step_g:1000,tolerance_bps:1000,tolerance_cap_g:50};
const each={mode:'EACH',policy_version:1};
export function forelProducts(){
 return [...forelDishes.map(([key,section,ru,ka,hy,kg])=>({key,section,names:{ru,ka,hy},cost:tetri(forelCosts[key]),profile:kg?byKg:each})),
  ...forelSets.map(s=>({key:s[0],section:'rf_rs_sets',names:{ru:s[1],ka:s[2],hy:s[3]},cost:setCost(s),profile:each}))]
  .map(p=>({...p,id:forelVendor.city_id+'--'+forelKey(p.key),art:restaurantArt(p.section,p.key),price:saleOf(p.cost)}))}
export function restaurantSql(){const V=forelVendor,s=x=>"'"+String(x).replaceAll("'","''")+"'",j=o=>s(JSON.stringify(o));
 return [...restaurantSections.map(([id,names,sort])=>`INSERT INTO categories(id,names,sort) VALUES(${s(id)},${j(names)},${sort}) ON CONFLICT(id) DO NOTHING;`),
  `INSERT INTO vendors(id,city_id,names,active) SELECT ${s(V.id)},${s(V.city_id)},${j(V.names)},1 WHERE EXISTS(SELECT 1 FROM cities WHERE id=${s(V.city_id)}) ON CONFLICT(id) DO NOTHING;`,
  ...forelProducts().map(p=>`INSERT INTO products(id,vendor_id,names,category,art,profile,price,cost,stock,active) SELECT ${s(p.id)},${s(V.id)},${j(p.names)},${s(p.section)},${s(p.art)},${j(p.profile)},${p.price},${p.cost},${p.profile.mode==='WEIGHED'?1000000:1000},1 WHERE EXISTS(SELECT 1 FROM vendors WHERE id=${s(V.id)}) ON CONFLICT(id) DO NOTHING;`)]}
// Owner 24.11: «Форель» works 11:00–23:00, orders until 22:00. With the one-hour lead, a restaurant-only basket gets
// delivery slots 12:00–22:30, so the last order for today is at 22:00; later orders go to tomorrow.
// Owner 24.11 (later): the city lead is 30 minutes, so «orders until 22:00» means the last delivery slot is 22:30.
export const forelHours={open_minute:660,close_minute:1350};
export function forelHoursSql(){const h=forelHours;return [`UPDATE vendors SET open_minute=${h.open_minute},close_minute=${h.close_minute} WHERE id='${forelVendor.id}' AND (open_minute IS NOT ${h.open_minute} OR close_minute IS NOT ${h.close_minute});`]}
