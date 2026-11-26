-- Owner 26.11: «промо-банан надо уже удалить … или закрыть». The promo was hidden by day closures only until 20.12 and would have
-- come back on 21.12 as an ordinary item; now it is switched off for good (kept in the database for the books). The ordinary banana stays.
UPDATE products SET active=0,stock=0 WHERE id='akhalkalaki--banana_promo_3kg';
UPDATE promotions SET active=0 WHERE id='banana-evening-1118';
