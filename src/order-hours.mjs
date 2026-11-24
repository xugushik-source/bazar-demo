// Owner 07.11: «сайт работает с 9 до 18»; owner 17.11: the site is always open — orders are taken at ANY time, only the delivery runs 09:00–18:00 (Ахалкалаки time).
// The stored value 'from-to' now means the delivery window of ordinary goods: its last slot is `to` minus the slot gap.
// Stored in app_config as 'from-to' minutes; no row = no limit. Tests run with BAZAR_IGNORE_ORDER_HOURS=1.
const q=(db,sql,...p)=>db.prepare(sql).bind(...p);
export const ORDER_HOURS_KEY='order_hours';
export const orderHoursValue='540-1080';   // 09:00 – 18:00
export async function orderHours(db){try{const v=(await q(db,'SELECT value FROM app_config WHERE key=?',ORDER_HOURS_KEY).first())?.value;const m=/^(\d+)-(\d+)$/.exec(v||'');return m?{from:+m[1],to:+m[2]}:null}catch{return null}}
export const hoursOpen=(h,minute)=>!h||globalThis.process?.env?.BAZAR_IGNORE_ORDER_HOURS==='1'||(minute>=h.from&&minute<h.to);
export const orderHoursSql=()=>[`INSERT INTO app_config(key,value) VALUES('${ORDER_HOURS_KEY}','${orderHoursValue}') ON CONFLICT(key) DO UPDATE SET value=excluded.value;`];
// Owner 11.11: ready food (pizza, khachapuri, lamajo — categories rf_*) is ordered until 19:30, after the rest of the site closes
// at 18:00; a basket with anything else still follows the 9–18 hours. Its delivery may go up to the supplier's closing time.
export const readyFoodTo=1170;   // 19:30
// Owner 11.11 (later): cakes from the same bakery are ordered in the evening too.
export const isReadyCat=c=>String(c||'').startsWith('rf_')||c==='cakes';
// Owner 24.11: «курьеры все работают» — a supplier working in the evening (Karo, fruit and vegetables, 8:00–23:00) is delivered
// by its own hours, like ready food: up to its closing time, the last order «lead» minutes before. Mixed with others — their hours.
export const eveningVendors=['akhalkalaki-karo'];
export const ownHoursLine=(category,vendor)=>isReadyCat(category)||eveningVendors.includes(vendor);
export const readyOpen=(h,minute)=>!h||globalThis.process?.env?.BAZAR_IGNORE_ORDER_HOURS==='1'||(minute>=h.from&&minute<Math.max(h.to,readyFoodTo));

// Owner 17.11: the latest delivery slot (minutes) the order hours allow for ordinary goods, or null (no limit; also under test).
export async function deliveryCap(db,gap=20){if(globalThis.process?.env?.BAZAR_IGNORE_ORDER_HOURS==='1')return null;const h=await orderHours(db);return h?h.to-gap:null}
