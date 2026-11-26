// Owner 29.10: «нет сегодня» from the supplier hides a product for that day only (the next day it is back by itself), and
// new costs wait for the owner. The tables live in migration 0055; databases before it simply have no closures.
// Owner 11.11: «нет в наличии» from the supplier lasts until the supplier brings the product back (day 9999-12-31).
export const FOREVER='9999-12-31';
export async function closedToday(db,day){try{return new Set((await db.prepare('SELECT product_id FROM day_closures WHERE day IN (?,?)').bind(day,FOREVER).all()).results.map(r=>r.product_id))}catch{return new Set()}}
// Owner 26.11: a dish that is ordered ahead (profile.lead_minutes) is never hidden by «нет в наличии» / «нет сегодня»: it is always there, by pre-order. Only a closure
// for the very day of delivery still counts when the order is placed (the restaurant may say «not that day»); the permanent one (FOREVER) does not.
export async function closedOnDay(db,day){try{return new Set((await db.prepare('SELECT product_id FROM day_closures WHERE day=?').bind(day).all()).results.map(r=>r.product_id))}catch{return new Set()}}
export const isPreorder=profile=>Number((typeof profile==='string'?(()=>{try{return JSON.parse(profile)}catch{return {}}})():profile)?.lead_minutes)>0;
