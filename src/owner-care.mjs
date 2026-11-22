// «Забота о близких» в Telegram владельца (22.11): человек переводит деньги мимо сайта, владелец подтверждает одной кнопкой,
// и только после этого программа может создавать заказы (подтверждённые деньги — единственное, что списывается; см. subscriptions.mjs).
//  • новая программа  → сообщение владельцу со сводкой и кнопкой «Отменить программу» (с вопросом «точно?»);
//  • заказчик сообщил о переводе («я оплатил» на странице статуса) → «Деньги пришли? / Не пришли»;
//  • запрос возврата → «Выплатить / Отклонить».
// Что уже отправлено, помнит сама программа: событие OWNER_NOTIFIED_PROGRAM / OWNER_NOTIFIED_FUND в subscription_events (миграций нет).
// Тексты на русском: владелец читает по-русски (для других языков чата тот же текст).
import {q,parse}from './commerce.mjs';import {fail,token,uuid,now}from './security.mjs';import {ownerFund,ownerStatus}from './subscriptions.mjs';
const money=n=>(n/100).toFixed(2)+' ₾';
const DAYS=['пн','вт','ср','чт','пт','сб','вс'];
const hhmm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
export function scheduleText(s){
  if(!s)return '—';
  let t;
  switch(s.type){
    case 'weekly':t='по дням: '+(s.days||[]).map(d=>DAYS[d-1]).join(', ');break;
    case 'monthly':t='числа месяца: '+(s.dates||[]).join(', ');break;
    case 'interval':t='каждые '+s.every+' дн. с '+s.start;break;
    case 'dates':t='даты: '+(s.dates||[]).join(', ');break;
    default:t='—';
  }
  return t+(s.from?'; с '+s.from:'')+(s.until?'; по '+s.until:'');
}
async function button(db,l,caption,payload){const id=token().slice(0,32);await q(db,'INSERT INTO tg_buttons(id,link_id,order_id,version,payload,expires) VALUES(?,?,NULL,NULL,?,?)',id,l.id,JSON.stringify(payload),Date.now()+7*86400000).run();return {text:caption,callback_data:'bz:'+id}}
const mark=(db,programId,event,data)=>q(db,'INSERT INTO subscription_events(id,program_id,at,actor,event,data) VALUES(?,?,?,?,?,?)',uuid(),programId,now(),'SYSTEM',event,JSON.stringify(data||{})).run();
const owners=db=>db.prepare("SELECT * FROM tg_links WHERE kind='OWNER' AND active=1").all().then(r=>r.results);

function programText(p){
  const items=parse(p.items,[]);
  return '🧡 Забота о близких: новая программа\n'
   +'Заказчик: '+p.payer_name+', '+p.payer_phone+'\n'
   +'Получатель: '+p.recipient_name+', '+p.recipient_phone+'\n'
   +'Адрес: '+p.address+'\n'
   +'График: '+scheduleText(parse(p.schedule,null))+', в '+hhmm(p.minute)+'\n'
   +'Товаров в наборе: '+items.length+'; не больше '+money(p.max_delivery_minor)+' за доставку\n'
   +(p.consent_by==='OPERATOR'?'Оформлено оператором по телефону.\n':'')
   +'\nЗаказы по программе появятся только когда вы подтвердите оплату.';
}
async function fundText(db,f){
  const p=await q(db,'SELECT payer_name,payer_phone,recipient_name FROM subscription_programs WHERE id=?',f.program_id).first();
  const who=p?p.payer_name+', '+p.payer_phone+' (получатель: '+p.recipient_name+')':f.program_id;
  return f.kind==='PAYMENT'
    ?'💰 Забота о близких: '+who+' сообщает о переводе '+money(f.amount_minor)+'.\nКомментарий к переводу: '+f.reference+'\n\nДеньги пришли?'
    :'↩️ Забота о близких: '+who+' просит вернуть '+money(f.amount_minor)+'.\n\nВыплатить возврат?';
}

// Рассылает владельцу всё, о чём он ещё не знает. Повторный запуск ничего не дублирует. Telegram не настроен / владелец не привязан — тихо ничего.
export async function careTick(db,env,call){
  const links=await owners(db);if(!links.length)return 0;let sent=0;
  const progs=(await db.prepare("SELECT * FROM subscription_programs p WHERE NOT EXISTS(SELECT 1 FROM subscription_events e WHERE e.program_id=p.id AND e.event='OWNER_NOTIFIED_PROGRAM') ORDER BY created_at LIMIT 5").all()).results;
  for(const p of progs){let ok=false;
    for(const l of links){try{await call(env,'sendMessage',{chat_id:l.chat_id,text:programText(p),reply_markup:{inline_keyboard:[[await button(db,l,'✖ Отменить программу',{action:'care_cancel_ask',program_id:p.id})]]}});ok=true}catch{}}
    if(ok){await mark(db,p.id,'OWNER_NOTIFIED_PROGRAM');sent++}}
  const funds=(await db.prepare("SELECT * FROM subscription_funds f WHERE f.status='PENDING' AND NOT EXISTS(SELECT 1 FROM subscription_events e WHERE e.program_id=f.program_id AND e.event='OWNER_NOTIFIED_FUND' AND json_extract(e.data,'$.fund_id')=f.id) ORDER BY requested_at LIMIT 10").all()).results;
  for(const f of funds){let ok=false;const text=await fundText(db,f),yes=f.kind==='PAYMENT'?'✅ Деньги пришли':'✅ Выплатить',no=f.kind==='PAYMENT'?'✖ Не пришли':'✖ Отклонить';
    for(const l of links){try{await call(env,'sendMessage',{chat_id:l.chat_id,text,reply_markup:{inline_keyboard:[[await button(db,l,yes,{action:'care_fund_yes',fund_id:f.id}),await button(db,l,no,{action:'care_fund_no',fund_id:f.id})]]}});ok=true}catch{}}
    if(ok){await mark(db,f.program_id,'OWNER_NOTIFIED_FUND',{fund_id:f.id});sent++}}
  return sent;
}

export async function ownerCareCallback(db,env,call,l,p,user){
  if(l.kind!=='OWNER'||!user?.owner)fail('FORBIDDEN',403);
  const say=(text,extra)=>call(env,'sendMessage',{chat_id:l.chat_id,text,...(extra?{reply_markup:extra}:{})});
  if(p.action==='care_keep'){await say('Хорошо, программа остаётся.');return {ok:true}}
  if(p.action==='care_cancel_ask'||p.action==='care_cancel_do'){
    const prog=await q(db,'SELECT * FROM subscription_programs WHERE id=?',p.program_id).first();if(!prog)fail('NOT_FOUND',404);
    if(prog.status==='CANCELLED'){await say('Программа уже отменена.');return {ok:true}}
    if(p.action==='care_cancel_ask'){await say('Отменить программу «'+prog.payer_name+' → '+prog.recipient_name+'»? Все ближайшие доставки по ней будут отменены.',{inline_keyboard:[[await button(db,l,'Да, отменить',{action:'care_cancel_do',program_id:prog.id}),await button(db,l,'Нет, оставить',{action:'care_keep',program_id:prog.id})]]});return {ok:true}}
    try{await ownerStatus(db,{id:prog.id,action:'cancel',reason:'Отменено владельцем в Telegram'},user)}catch(e){if(e?.code==='INVALID_TRANSITION'){await say('Программа уже отменена.');return {ok:true}}throw e}
    await say('Программа отменена. Ближайшие доставки по ней убраны из плана.');return {ok:true}}
  // care_fund_yes / care_fund_no: решение по деньгам. Повторное нажатие ничего не делает: ownerFund отвечает NOT_PENDING.
  const f=await q(db,'SELECT * FROM subscription_funds WHERE id=?',p.fund_id).first();if(!f)fail('NOT_FOUND',404);
  const yes=p.action==='care_fund_yes';
  try{const view=await ownerFund(db,{fund_id:f.id,decision:yes?'CONFIRM':'REJECT'},user);
    if(yes&&f.kind==='PAYMENT')await say('✅ Оплата '+money(f.amount_minor)+' подтверждена. Доступно для заказов по программе: '+money(view.summary?.unused_minor??0)+'. Доставки пойдут по графику.');
    else if(yes)await say('✅ Возврат '+money(f.amount_minor)+' отмечен выплаченным.');
    else await say('✖ Отклонено: '+money(f.amount_minor)+'. Заказчик увидит, что деньги не подтверждены.');
  }catch(e){
    if(e?.code==='NOT_PENDING'){await say('Это решение уже принято.');return {ok:true}}
    if(e?.code==='INSUFFICIENT_FUNDS'){await say('Возврат невозможен: на программе уже нет такой суммы (часть занята под доставки). Откройте кабинет.');return {ok:true}}
    throw e}
  return {ok:true};
}
