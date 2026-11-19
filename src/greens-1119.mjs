// Owner 19.11: «Зелень добавляем. Закуп 10 лари. Лук зелёный, котем, петрушка, укроп, кинза. Минимум 200 г, шаг 100 г».
// Five weighed products of Karo: cost 10.00 ₾/kg, price +25 % = 12.50 ₾/kg (rounded up to 10 tetri, the rule of Karo's fruit and vegetables),
// from 200 g in 100 g steps. They go under «Овощи и зелень» (category vegetables): the separate category «herbs» is closed since 29.10
// and its tolerance is ±10 %, vegetables ±20 % (owner 06.11). «Котем» is the local name of garden cress — written as people say it.
// Each product gets unusable markers (delta -1, as the promo banana) so the Karo / fruit-veg «+25 %» rules, which run again at releases,
// never lift 12.50 to 15.70.
export const greensCost=1000,greensPrice=1250,greensProfile={mode:'WEIGHED',policy_version:1,minimum_g:200,order_step_g:100,default_g:200,tolerance_bps:2000,tolerance_cap_g:200};// default_g: «+» puts 200 g in the basket, not the usual 1 kg
export const greens=[
 ['spring_onion',{ru:'Лук зелёный',hy:'Կանաչ սոխ',ka:'მწვანე ხახვი'},'herbs'],
 ['kotem',{ru:'Котем',hy:'Կոտեմ',ka:'კოტემი'},'herbs'],
 ['parsley',{ru:'Петрушка',hy:'Մաղադանոս',ka:'ოხრახუში'},'herbs'],
 ['dill',{ru:'Укроп',hy:'Սամիթ',ka:'კამა'},'dill'],
 ['cilantro',{ru:'Кинза',hy:'Համեմ',ka:'ქინძი'},'herbs']];
const s=x=>"'"+String(x).replaceAll("'","''")+"'",j=x=>s(JSON.stringify(x));
export const greensId=k=>'akhalkalaki--greens_'+k;
export function greensSql(){const out=[];
 for(const [k,names,art] of greens)out.push(`INSERT INTO products(id,vendor_id,names,category,art,profile,price,cost,stock) SELECT ${s(greensId(k))},'akhalkalaki-karo',${j(names)},'vegetables',${s(art)},${j(greensProfile)},${greensPrice},${greensCost},100000 WHERE EXISTS(SELECT 1 FROM vendors WHERE id='akhalkalaki-karo' AND active=1) ON CONFLICT(id) DO NOTHING;`);
 for(const [k] of greens)for(const m of ['k1106','fv25'])out.push(`INSERT INTO inventory(id,product_id,at,actor,delta,reason) SELECT '${m}-'||id,id,'2026-11-19T06:00:00.000Z','owner',-1,'CATALOG: greens — own price, kept out of the Karo / fruit-veg markup rules' FROM products WHERE id=${s(greensId(k))} ON CONFLICT(id) DO NOTHING;`);
 return out}
