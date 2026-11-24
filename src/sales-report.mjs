// Owner 24.11: sales accounting — by vendor (restaurant «Форель» included), by category and by product, with the sets apart.
// Only delivered orders count. Revenue = the price frozen in the order line × what was actually handed over (grams for goods
// sold by the kilo); cost = the purchase price frozen in the same line (lineCost, as in the supplier settlements).
// Restaurant debt = the supplier balance from vendor-ledger, so the report and the settlements never disagree.
import {q,parse}from './commerce.mjs';import {weightPrice}from './weight-policy.mjs';import {lineCost,balance,unsettled}from './vendor-ledger.mjs';
const WEIGHED=['WEIGHED','WHOLE_BY_WEIGHT','PREWEIGHED'];
export function lineRevenue(quote,reserved){const p=quote.product||{};return WEIGHED.includes(quote.mode)?weightPrice(quote.price_per_kg_minor??p.price_per_kg_minor,reserved):(p.price_per_unit_minor||0)*reserved}
const day=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')?s:null;
export async function salesReport(db,city,{from,to}={}){from=day(from);to=day(to);
 const rows=(await q(db,`SELECT l.product_id,l.vendor_id,l.quote,l.cost,l.reserved,p.category,p.names AS product_names,v.names AS vendor_names FROM order_lines l JOIN orders o ON o.id=l.order_id JOIN products p ON p.id=l.product_id JOIN vendors v ON v.id=l.vendor_id WHERE o.city_id=? AND o.status='COMPLETED' AND l.reserved>0${from?" AND date(o.updated_at,'+4 hours')>=?":''}${to?" AND date(o.updated_at,'+4 hours')<=?":''}`,city,...[from,to].filter(Boolean)).all()).results;
 const add=(map,key,init,r)=>{const x=map.get(key)||{...init,quantity:0,weighed_g:0,revenue:0,cost:0,cost_unknown:false};if(r.weighed)x.weighed_g+=r.reserved;else x.quantity+=r.reserved;x.revenue+=r.revenue;if(r.cost===null)x.cost_unknown=true;else x.cost+=r.cost;map.set(key,x)};
 const vendors=new Map(),categories=new Map(),products=new Map();
 for(const row of rows){const quote=parse(row.quote,{}),r={reserved:row.reserved,weighed:WEIGHED.includes(quote.mode),revenue:lineRevenue(quote,row.reserved),cost:lineCost(quote.mode,row.cost,row.reserved)};
  add(vendors,row.vendor_id,{id:row.vendor_id,names:parse(row.vendor_names,{})},r);add(categories,row.category,{id:row.category},r);
  add(products,row.product_id,{id:row.product_id,vendor_id:row.vendor_id,category:row.category,names:parse(row.product_names,{}),set:row.category==='rf_rs_sets'},r)}
 const finish=x=>({...x,cost:x.cost_unknown?null:x.cost,gross_profit:x.cost_unknown?null:x.revenue-x.cost}),list=m=>[...m.values()].map(finish).sort((a,b)=>b.revenue-a.revenue);
 const byVendor=list(vendors);for(const v of byVendor){v.balance=await balance(db,v.id);v.unsettled=(await unsettled(db,v.id)).reduce((s,l)=>s+(l.amount||0),0)}
 const all=[...products.values()],total=finish(all.reduce((t,x)=>({...t,quantity:t.quantity+x.quantity,weighed_g:t.weighed_g+x.weighed_g,revenue:t.revenue+x.revenue,cost:t.cost+x.cost,cost_unknown:t.cost_unknown||x.cost_unknown}),{quantity:0,weighed_g:0,revenue:0,cost:0,cost_unknown:false}));
 return {from,to,total,vendors:byVendor,categories:list(categories),products:list(products),sets:list(products).filter(p=>p.set)}}
