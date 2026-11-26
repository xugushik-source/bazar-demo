// Owner 26.11: «Отмени сам» — the owner's own test programmes of «Забота о близких» (the payer is the shop's own phone 591244075) are cancelled, so that the planner
// never creates real orders for them. Each gets the same effect as the owner's cancel: status CANCELLED with a reason, its not yet started deliveries CANCELLED,
// an event in its history. Deliveries that already became orders are left alone. Programmes of other payers are not touched.
export const testPhoneTail='591244075';
export const testReason='Тестовая программа владельца, отменена 26.11';
const AT='2026-11-26T12:30:00.000Z';
const phone="replace(replace(replace(payer_phone,' ',''),'+',''),'-','')";
const cond=`${phone} LIKE '%${testPhoneTail}' AND status<>'CANCELLED'`;
const unlocked="'PLANNED','WAITING_FUNDS','WAITING_APPROVAL','WAITING_STOCK','WAITING_SLOT','WAITING_CHANGE'";
export const cancelOwnerTestsSql=()=>[
 `INSERT INTO subscription_events(id,program_id,at,actor,event,data) SELECT lower(hex(randomblob(16))),id,'${AT}','SYSTEM','STATUS_CANCEL','{"reason":"${testReason}"}' FROM subscription_programs WHERE ${cond};`,
 `UPDATE subscription_deliveries SET status='CANCELLED',reason='OPERATOR_CANCEL',updated_at='${AT}',version=version+1 WHERE program_id IN (SELECT id FROM subscription_programs WHERE ${cond}) AND status IN (${unlocked});`,
 `UPDATE subscription_programs SET status='CANCELLED',cancel_reason='${testReason}',updated_at='${AT}',version=version+1 WHERE ${cond};`];
