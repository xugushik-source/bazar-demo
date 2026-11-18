-- Owner 18.11: «Ферма Базара» does not exist. The supplier is switched off since 30.10 (0057); anything still on sale under its name or with its
-- purchase prices goes to Karo, the real fruit and vegetable supplier. A no-op when nothing is left.
UPDATE vendors SET active=0 WHERE id IN ('akhalkalaki-farm','tbilisi-farm') AND active=1;
UPDATE products SET vendor_id='akhalkalaki-karo',version=version+1 WHERE vendor_id='akhalkalaki-farm' AND active=1 AND EXISTS(SELECT 1 FROM vendors WHERE id='akhalkalaki-karo');
