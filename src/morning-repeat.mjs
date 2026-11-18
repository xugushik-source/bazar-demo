// Owner 18.11: «если вечером делается заказ, то утром он должен повториться — к началу рабочего дня, с напоминанием».
// At the start of the working day (the first minute of the delivery window, 09:00) every order that was made BEFORE that moment
// and is to be delivered TODAY and has not reached «ready» yet is sent again, once, to the owner, the suppliers and the staff
// chats as a NEW message (not an edit of the old one, which may be far up the chat) with a note on top: «заказ сделан вчера в 21:40».
// The buyer and the courier group are not bothered. The card itself is the usual one, with the usual buttons.
import {q,clock}from './commerce.mjs';import {orderHours}from './order-hours.mjs';
const hhmm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
export const morningWords={
 ru:{note:'🌅 Заказ сделан {when} — напоминаем к началу рабочего дня. Доставка сегодня в {time}.',today:'сегодня в {t}',yesterday:'вчера в {t}',earlier:'{d} в {t}'},
 hy:{note:'🌅 Պատվերը կատարվել է {when} — հիշեցնում ենք աշխատանքային օրվա սկզբին։ Առաքումը այսօր՝ {time}։',today:'այսօր {t}-ին',yesterday:'երեկ {t}-ին',earlier:'{d}-ին {t}-ին'},
 ka:{note:'🌅 შეკვეთა გაკეთდა {when} — გახსენებთ სამუშაო დღის დასაწყისში. მიწოდება დღეს {time}-ზე.',today:'დღეს {t}-ზე',yesterday:'გუშინ {t}-ზე',earlier:'{d} {t}-ზე'}};
const startOf=(day,minute)=>Date.parse(day+'T'+hhmm(minute)+':00+04:00');// Tbilisi has no daylight saving
// Orders to repeat now, or [] (before the start of the day, after its end, or nothing waiting).
export async function morningOrders(db,at=new Date()){const h=await orderHours(db);if(!h)return [];const c=clock('Asia/Tbilisi',at);if(c.minute<h.from||c.minute>=h.to)return [];
 const start=startOf(c.day,h.from),rows=(await q(db,"SELECT id,created_at,day,minute,status FROM orders WHERE day=? AND status IN('NEW','CLAIMED','WEIGHING','ASSEMBLING') AND id NOT IN(SELECT order_id FROM morning_repeats)",c.day).all()).results;
 return rows.filter(o=>Date.parse(o.created_at)<start)}
export async function morningTick(db,at=new Date()){const list=await morningOrders(db,at);if(!list.length)return 0;const c=clock('Asia/Tbilisi',at);
 for(const o of list)await db.batch([q(db,'INSERT INTO morning_repeats(order_id,day,at) VALUES(?,?,?) ON CONFLICT(order_id) DO NOTHING',o.id,c.day,at.toISOString()),
  // a new message in every chat that already follows this order: owner, suppliers, staff — the next drain sends instead of editing
  q(db,"UPDATE tg_jobs SET message_id=NULL,revision=revision+1,next_at=0,attempts=0,last_error=NULL WHERE order_id=? AND link_id IN(SELECT id FROM tg_links WHERE active=1 AND kind IN('OWNER','SUPPLIER','PERSONAL'))",o.id)]);
 return list.length}
// The note on top of the card, only on the day of the repeat and only for the team (never the buyer or the courier group).
export async function morningNote(db,order,lang,at=new Date()){const c=clock('Asia/Tbilisi',at),m=await q(db,'SELECT day FROM morning_repeats WHERE order_id=?',order.id).first();if(!m||m.day!==c.day)return null;
 const o=await q(db,'SELECT created_at,minute FROM orders WHERE id=?',order.id).first();if(!o)return null;const w=morningWords[lang]||morningWords.ru,made=clock('Asia/Tbilisi',new Date(o.created_at)),t=hhmm(made.minute);
 const when=(made.day===c.day?w.today:made.day===clock('Asia/Tbilisi',new Date(at.getTime()-86400000)).day?w.yesterday:w.earlier.replace('{d}',made.day)).replace('{t}',t);
 return w.note.replace('{when}',when).replace('{time}',hhmm(o.minute))}
