-- Owner 18.11: a promo banana next to the ordinary one. A pack of 3 kg: bought for 10.00 ₾, sold for 12.00 ₾ (cost 1000, price 1200), 16 packs
-- (48 kg, under the 50 kg cap) — only what customers order is bought, nothing lies on us. Shown under «Вечерний базар» (EVENING) for 3 days,
-- 18.11 – 20.11; afterwards the product is closed (day_closures) so it never stays on the shelf as an ordinary item.
-- A «fixed» promotion keeps the product's own price: no percent, no crossed-out regular price.
ALTER TABLE promotions ADD COLUMN fixed INTEGER NOT NULL DEFAULT 0;
INSERT INTO products(id,vendor_id,names,category,art,profile,price,cost,stock)
SELECT 'akhalkalaki--banana_promo_3kg','akhalkalaki-karo','{"ru":"Бананы спелые, упаковка 3 кг (акция)","hy":"Հասած բանան, 3 կգ փաթեթ (ակցիա)","ka":"მწიფე ბანანი, 3 კგ შეკვრა (აქცია)"}',category,art,'{"mode":"FIXED_PACK","policy_version":1,"declared_net_g":3000}',1200,1000,16
FROM products WHERE id='akhalkalaki--banana_loose' AND EXISTS(SELECT 1 FROM vendors WHERE id='akhalkalaki-karo')
ON CONFLICT(id) DO NOTHING;
INSERT INTO promotions(id,city_id,names,terms,kind,percent,starts_at,ends_at,active,fixed,actor,at)
SELECT 'banana-evening-1118','akhalkalaki','{"ru":"Спелые бананы 3 кг — специальное предложение","hy":"Հասած բանան 3 կգ — հատուկ առաջարկ","ka":"მწიფე ბანანი 3 კგ — სპეციალური შეთავაზება"}',
'{"ru":"Спелые бананы: лучше съесть в ближайшие дни или взять для выпечки и смузи. Упаковка 3 кг — 12 ₾. Количество ограничено.","hy":"Հասած բանան՝ լավ է մի քանի օրում ուտել կամ օգտագործել թխվածքի ու սմուզիի համար։ 3 կգ փաթեթ՝ 12 ₾։ Քանակը սահմանափակ է։","ka":"მწიფე ბანანი: უმჯობესია უახლოეს დღეებში მიირთვათ ან გამოიყენოთ ცომეულისა და სმუზისთვის. 3 კგ შეკვრა — 12 ₾. რაოდენობა შეზღუდულია."}',
'EVENING',1,'2026-11-18T00:00:00.000Z','2026-11-20T20:00:00.000Z',1,1,'owner','2026-11-18T06:00:00.000Z'
WHERE EXISTS(SELECT 1 FROM products WHERE id='akhalkalaki--banana_promo_3kg') AND EXISTS(SELECT 1 FROM cities WHERE id='akhalkalaki')
ON CONFLICT(id) DO NOTHING;
INSERT INTO promotion_products(promotion_id,product_id) SELECT 'banana-evening-1118','akhalkalaki--banana_promo_3kg' WHERE EXISTS(SELECT 1 FROM promotions WHERE id='banana-evening-1118') AND EXISTS(SELECT 1 FROM products WHERE id='akhalkalaki--banana_promo_3kg') ON CONFLICT DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-11-21',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-11-22',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-11-23',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-11-24',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-11-25',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-11-26',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-11-27',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-11-28',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-11-29',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-11-30',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-01',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-02',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-03',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-04',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-05',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-06',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-07',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-08',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-09',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-10',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-11',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-12',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-13',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-14',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-15',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-16',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-17',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-18',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-19',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
INSERT INTO day_closures(product_id,day,vendor_id,closed_by,at) SELECT id,'2026-12-20',vendor_id,'owner','2026-11-18T06:00:00.000Z' FROM products WHERE id='akhalkalaki--banana_promo_3kg' ON CONFLICT(product_id,day) DO NOTHING;
