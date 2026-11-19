// Owner 19.11: «сверка прошла, дальше нужно подтверждение оплаты, что я оплатил — а нажимать некуда». The owner lives in Telegram:
// • the moment a supplier agrees a statement the owner's bot offers «оплатил наличными / переводом» for the whole debt,
// • «/pay» shows the same for every supplier with an agreed debt (also for debts agreed before),
// • a tap asks once more, «Да» records the payment (same rules as the cabinet: never above the agreed debt) and the supplier's group gets
//   «БАЗАР оплатил … Деньги получили?» with «Получил / Не получил». A mistake is undone in the cabinet («Отменить оплату»).
import {q,parse}from './commerce.mjs';import {fail,token}from './security.mjs';import {botWords}from './bot-words.mjs';import {balance,payVendor}from './vendor-ledger.mjs';
const W=l=>botWords[l]||botWords.ru;
const money=(n,cur)=>(n/100).toFixed(2)+' '+(cur||'GEL');
async function button(db,l,caption,payload){const id=token().slice(0,32);await q(db,'INSERT INTO tg_buttons(id,link_id,order_id,version,payload,expires) VALUES(?,?,NULL,NULL,?,?)',id,l.id,JSON.stringify(payload),Date.now()+7*86400000).run();return {text:caption,callback_data:'bz:'+id}}
const vendorInfo=async(db,id,lang)=>{const v=await q(db,'SELECT v.id,v.names,v.active,c.currency FROM vendors v LEFT JOIN cities c ON c.id=v.city_id WHERE v.id=?',id).first();if(!v)return null;const n=parse(v.names,{});return {id:v.id,active:v.active,cur:v.currency||'GEL',name:n[lang]||n.ru||v.id}};
async function rowsFor(db,l,vendor,debt){const w=W(l.lang);return [[await button(db,l,w.opayCash.replace('{vendor}',vendor.name).replace('{amount}',money(debt,vendor.cur)),{action:'opay_pick',vendor_id:vendor.id,method:'cash'})],[await button(db,l,w.opayTransfer.replace('{vendor}',vendor.name).replace('{amount}',money(debt,vendor.cur)),{action:'opay_pick',vendor_id:vendor.id,method:'transfer'})]]}
export async function payMenu(db,env,call,l){const w=W(l.lang),rows=[];
 for(const r of(await db.prepare('SELECT id FROM vendors WHERE active=1 ORDER BY id').all()).results){const debt=(await balance(db,r.id)).debt;if(debt>0){const v=await vendorInfo(db,r.id,l.lang);rows.push(...await rowsFor(db,l,v,debt))}}
 return call(env,'sendMessage',{chat_id:l.chat_id,text:rows.length?w.opayHead:w.opayNone,...(rows.length?{reply_markup:{inline_keyboard:rows}}:{})})}
// A supplier has just agreed a statement: every owner chat is offered the payment buttons.
export async function payAfterAgree(db,env,call,statement){const debt=(await balance(db,statement.vendor_id)).debt;if(debt<=0)return 0;let n=0;
 for(const l of(await db.prepare("SELECT * FROM tg_links WHERE kind='OWNER' AND active=1").all()).results){const v=await vendorInfo(db,statement.vendor_id,l.lang),w=W(l.lang);
  try{await call(env,'sendMessage',{chat_id:l.chat_id,text:w.opayAfter.replace('{vendor}',v.name).replace('{day}',statement.day).replace('{amount}',money(statement.amount,v.cur)).replace('{debt}',money(debt,v.cur)),reply_markup:{inline_keyboard:await rowsFor(db,l,v,debt)}});n++}catch{}}return n}
export async function ownerPayCallback(db,env,call,l,p,user,notify,buttonId){if(l.kind!=='OWNER'||!user?.owner)fail('FORBIDDEN',403);const w=W(l.lang),say=text=>call(env,'sendMessage',{chat_id:l.chat_id,text});
 if(p.action==='opay_no'){await say(w.opayCancelled);return {ok:true}}
 const v=await vendorInfo(db,p.vendor_id,l.lang);if(!v||!v.active||!['cash','transfer'].includes(p.method))fail('NOT_FOUND',404);const debt=(await balance(db,v.id)).debt,method=p.method==='cash'?w.payCash:w.payTransfer;
 if(p.action==='opay_pick'){if(debt<=0){await say(w.opayNone);return {ok:true}}
  await call(env,'sendMessage',{chat_id:l.chat_id,text:w.opayAsk.replace('{vendor}',v.name).replace('{amount}',money(debt,v.cur)).replace('{method}',method),reply_markup:{inline_keyboard:[[await button(db,l,w.opayYes,{action:'opay_do',vendor_id:v.id,method:p.method,amount:debt}),await button(db,l,w.opayNo,{action:'opay_no',vendor_id:v.id,method:p.method})]]}});return {ok:true}}
 // opay_do pressed twice: the first tap already recorded it — say the same again, record nothing
 const had=await q(db,'SELECT amount FROM vendor_payments WHERE command=?','tgpay-'+buttonId).first();if(had){await say(w.opayDone.replace('{vendor}',v.name).replace('{amount}',money(had.amount,v.cur)).replace('{method}',method));return {ok:true}}
 // opay_do: the amount shown in the question must still be the whole debt (the cabinet or another tap may have changed it)
 if(debt!==p.amount){await say(w.opayChanged.replace('{debt}',money(Math.max(0,debt),v.cur)));return {ok:true}}
 let r;try{r=await payVendor(db,{vendor_id:v.id,amount:debt,method:p.method,reason:'Оплата из Telegram (владелец)',command:'tgpay-'+buttonId},user)}catch(e){if(e?.code==='PAYMENT_EXCEEDS_DEBT'||e?.code==='IDEMPOTENCY_CONFLICT'){await say(w.opayChanged.replace('{debt}',money(Math.max(0,debt),v.cur)));return {ok:true}}throw e}
 await notify(db,env,r.id).catch(()=>{});await say(w.opayDone.replace('{vendor}',v.name).replace('{amount}',money(debt,v.cur)).replace('{method}',method));return {ok:true}}
