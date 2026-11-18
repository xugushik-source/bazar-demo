// Owner 18.11: «закрой товары поставщика МАДО на 5 дней» — every MADO product is closed for Wed 18.11 … Sun 22.11
// (day_closures: hidden from the catalog, orders for those days refused); Monday 23.11 opens by itself.
export const madoClosedDays1118 = ['2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22'];
export function madoCloseSql1118(){return madoClosedDays1118.map(d=>`INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'${d}',vendor_id,'owner','2026-11-18T05:00:00.000Z' FROM products WHERE vendor_id='akhalkalaki-mado' ON CONFLICT(product_id,day) DO NOTHING;`)}
