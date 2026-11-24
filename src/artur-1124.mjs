// Owner 24.11: Artur's extra goods from his shelf photos («Артур фарманян / Доп товары», sheet Artur-novye-tovary-2).
// Retail: cost +20 % rounded UP to 50 tetri (owner 24.11: «до 50 копеек»). Every flavour and kind is its own product (owner 24.11).
// Per-kg goods are weighed (WEIGHED); packed pieces of meat sold by the kilo are WHOLE_BY_WEIGHT around the pack weight.
// Photos come later — until then the section picture shows.
import {arturVendor}from './artur.mjs';
export const retail1124=cost=>Math.ceil(Math.round(cost*1.2)/50)*50;
const W=min=>({mode:'WEIGHED',policy_version:1,minimum_g:min,order_step_g:100,tolerance_bps:1000,tolerance_cap_g:50});
const P=(min_g,max_g,estimate_g)=>({mode:'WHOLE_BY_WEIGHT',policy_version:1,ranges:[{id:'whole',min_g,max_g,estimate_g}]});
const E=null;
// [key, ru, hy, ka, category, cost (tetri), profile|null]
const barilla=[['pipe_rigate','Pipe Rigate №91'],['penne_rigate','Penne Rigate №73'],['tortiglioni','Tortiglioni №83'],['risoni','Risoni №26'],['filini','Filini Vermicelles №30'],
 ['spaghetti','Spaghetti №5'],['bucatini','Bucatini №9'],['capellini','Capellini №1'],['stelline','Stelline №27']]
 .map(([k,n])=>['barilla_'+k,'Макароны Barilla '+n,'Մակարոն Barilla '+n,'მაკარონი Barilla '+n,'pantry',350,E]);
const jam=[['lemon','лимонный','կիտրոնի','ლიმონის'],['raspberry','малиновый','ազնվամորու','ჟოლოს'],['blueberry','черничный','հապալասի','მოცვის'],
 ['forest','лесные ягоды','անտառային հատապտուղներ','ტყის კენკრა'],['lemon_ginger','лимон с имбирём','կիտրոն կոճապղպեղով','ლიმონი ჯანჯაფილით'],['strawberry','клубничный','ելակի','მარწყვის']]
 .map(([k,ru,hy,ka])=>['jam_maheev_'+k,'Джем «Махеевъ» '+ru+', стекло','Ջեմ «Махеевъ» '+hy+', ապակե','ჯემი «Махеевъ» '+ka+', მინა','sweets',800,E]);
const jelly=[['kiwi','киви','կիվի','კივი'],['raspberry','малина','ազնվամորի','ჟოლო'],['strawberry','клубника','ելակ','მარწყვი']]
 .map(([k,ru,hy,ka])=>['jelly_iris_'+k,'Желе IRIS, '+ru,'Դոնդող IRIS, '+hy,'ჟელე IRIS, '+ka,'sweets',250,E]);
export const arturProducts1124=[
 ['ferrero_rocher_24','Конфеты Ferrero Rocher, 24 шт.','Կոնֆետներ Ferrero Rocher, 24 հատ','კანფეტები Ferrero Rocher, 24 ცალი','sweets',4500,E],
 ['ferrero_collection_big','Конфеты Ferrero Collection, большая коробка','Կոնֆետներ Ferrero Collection, մեծ տուփ','კანფეტები Ferrero Collection, დიდი ყუთი','sweets',4500,E],
 ['ferrero_collection_15','Конфеты Ferrero Collection, 15 шт.','Կոնֆետներ Ferrero Collection, 15 հատ','კანფეტები Ferrero Collection, 15 ცალი','sweets',2000,E],
 ['ferrero_rocher_16','Конфеты Ferrero Rocher, 16 шт.','Կոնֆետներ Ferrero Rocher, 16 հատ','კანფეტები Ferrero Rocher, 16 ცალი','sweets',2000,E],
 ['ferrero_rocher_tree','Конфеты Ferrero Rocher, пирамида-ёлка','Կոնֆետներ Ferrero Rocher, տոնածառ բուրգ','კანფეტები Ferrero Rocher, ნაძვის პირამიდა','sweets',4000,E],
 ['raffaello_gift','Конфеты Raffaello, большая подарочная коробка','Կոնֆետներ Raffaello, մեծ նվերի տուփ','კანფეტები Raffaello, დიდი სასაჩუქრე ყუთი','sweets',2500,E],
 ['raffaello_150','Конфеты Raffaello, 150 г','Կոնֆետներ Raffaello, 150 գ','კანფეტები Raffaello, 150 გ','sweets',1500,E],
 ['raffaello_small','Конфеты Raffaello, маленькая коробка','Կոնֆետներ Raffaello, փոքր տուփ','კანფეტები Raffaello, პატარა ყუთი','sweets',1100,E],
 ['adel_small','Конфеты «Адель», маленькая коробка','Կոնֆետներ «Ադել», փոքր տուփ','კანფეტები «ადელი», პატარა ყუთი','sweets',1100,E],
 ['kinder_maxi','Kinder Surprise Maxi, большое яйцо','Kinder Surprise Maxi, մեծ ձու','Kinder Surprise Maxi, დიდი კვერცხი','sweets',5000,E],
 ['candy_mix_70','Конфеты шоколадные в фольге, ассорти (развес)','Շոկոլադե կոնֆետներ փայլաթիթեղով, տեսականի (կշռով)','შოკოლადის კანფეტები ფოლგაში, ასორტი (წონით)','sweets',7000,W(200)],
 ['candy_mix_40','Конфеты ассорти (развес)','Կոնֆետներ տեսականի (կշռով)','კანფეტები ასორტი (წონით)','sweets',4000,W(200)],
 ['dragee_strawberry','Драже клубника в шоколаде (развес)','Դրաժե ելակ շոկոլադում (կշռով)','დრაჟე მარწყვი შოკოლადში (წონით)','sweets',2600,W(200)],
 ['dragee_bella','Драже Bella: миндаль и орехи в глазури (развес)','Դրաժե Bella՝ նուշ և ընկույզ ջնարակում (կշռով)','დრაჟე Bella: ნუში და თხილი მინანქარში (წონით)','sweets',8000,W(200)],
 ...jam,...jelly,...barilla,
 ['pasta_dami','Макароны Dami','Մակարոն Dami','მაკარონი Dami','pantry',200,E],
 ['pasta_molteto','Макароны Molteto','Մակարոն Molteto','მაკარონი Molteto','pantry',200,E],
 ['sugar_5kg','Сахар-песок, 5 кг','Շաքարավազ, 5 կգ','შაქარი, 5 კგ','pantry',1100,E],
 ['oil_oleina_085','Масло подсолнечное «Олейна» Традиционное, 0,85 л','Արևածաղկի ձեթ «Олейна», 0,85 լ','მზესუმზირის ზეთი «Олейна», 0,85 ლ','pantry',650,E],
 ['tomato_paste_burcu','Томатная паста Burcu, стекло ~700 г','Տոմատի մածուկ Burcu, ապակե ~700 գ','ტომატის პასტა Burcu, მინა ~700 გ','preserves',1100,E],
 ['tomato_paste_artfood','Томатная паста Artfood, 580 г','Տոմատի մածուկ Artfood, 580 գ','ტომატის პასტა Artfood, 580 გ','preserves',650,E],
 ['olives_markesa_black_3kg','Маслины Markesa de Oliva с косточкой, банка ~3 кг','Ձիթապտուղ Markesa de Oliva կորիզով, ~3 կգ','ზეთისხილი Markesa de Oliva კურკით, ~3 კგ','preserves',3200,E],
 ['olives_markesa_black_4kg','Маслины Markesa de Oliva с косточкой, банка ~4,3 кг','Ձիթապտուղ Markesa de Oliva կորիզով, ~4,3 կգ','ზეთისხილი Markesa de Oliva კურკით, ~4,3 კგ','preserves',5000,E],
 ['butter_valio_1kg','Масло сливочное Valio традиционное, 1 кг','Կարագ Valio ավանդական, 1 կգ','კარაქი Valio ტრადიციული, 1 კგ','dairy',4500,E],
 ['butter_valio_200','Масло сливочное Valio 82%, 200 г','Կարագ Valio 82%, 200 գ','კარაქი Valio 82%, 200 გ','dairy',600,E],
 ['butter_anchor_200','Масло сливочное Anchor 82,9%, 200 г','Կարագ Anchor 82,9%, 200 գ','კარაქი Anchor 82,9%, 200 გ','dairy',700,E],
 ['butter_eliseevskoe_200','Масло сливочное «Елисеевское» 82%, 200 г','Կարագ «Елисеевское» 82%, 200 գ','კარაქი «Елисеевское» 82%, 200 გ','dairy',800,E],
 ['butter_ferma_1kg','Масло сливочное Ferma 73%, 1 кг','Կարագ Ferma 73%, 1 կգ','კარაქი Ferma 73%, 1 კგ','dairy',3300,E],
 ['spread_tulchinka_1kg','Спред «Тульчинка», 1 кг','Սպրեդ «Тульчинка», 1 կգ','სპრედი «Тульчинка», 1 კგ','dairy',1300,E],
 ['condensed_korovka','Варёная сгущёнка «Коровка из Кореновки» 8,5%','Եփած խտացրած կաթ «Коровка из Кореновки» 8,5%','მოხარშული შესქელებული რძე «Коровка из Кореновки» 8,5%','sweets',450,E],
 ['condensed_alekseevskoe_boiled','Варёная сгущёнка «Алексеевское» 8,5%','Եփած խտացրած կաթ «Алексеевское» 8,5%','მოხარშული შესქელებული რძე «Алексеевское» 8,5%','sweets',500,E],
 ['varenka_baraqa','Варёнка Baraqa','Եփած խտացրած կաթ Baraqa','მოხარშული შესქელებული რძე Baraqa','sweets',300,E],
 ['chicken_wings','Куриные крылья, замороженные','Հավի թևեր, սառեցված','ქათმის ფრთები, გაყინული','frozen',1000,W(500)],
 ['chicken_legs','Куриные окорочка, замороженные','Հավի ազդրեր, սառեցված','ქათმის ბარკლები, გაყინული','frozen',800,W(500)],
 ['chicken_fillet','Куриное филе, замороженное','Հավի ֆիլե, սառեցված','ქათმის ფილე, გაყინული','frozen',800,W(500)],
 ['chicken_whole_qualiko','Курица целая Qualiko, замороженная','Հավ ամբողջական Qualiko, սառեցված','ქათამი მთლიანი Qualiko, გაყინული','frozen',1000,P(1000,1500,1200)],
 ['chicken_whole_yellow','Курица целая, замороженная (жёлтая упаковка)','Հավ ամբողջական, սառեցված (դեղին փաթեթ)','ქათამი მთლიანი, გაყინული (ყვითელი შეფუთვა)','frozen',1000,P(1000,1500,1200)],
 ['chicken_super_frango','Курица Super Frango (Бразилия), пакет','Հավ Super Frango (Բրազիլիա), փաթեթ','ქათამი Super Frango (ბრაზილია), შეფუთვა','frozen',2000,E],
 ['quail_2','Перепела Tiyur Zanjan, лоток 2 шт.','Լորեր Tiyur Zanjan, 2 հատ','მწყერი Tiyur Zanjan, 2 ცალი','frozen',900,E],
 ['turkey_fillet_stasin','Филе грудки индейки Stasin, вакуум','Հնդկահավի կրծքամսի ֆիլե Stasin, վակուում','ინდაურის მკერდის ფილე Stasin, ვაკუუმი','frozen',4400,P(700,950,800)],
 ['turkey_whole_stasin','Индейка целая Stasin, замороженная','Հնդկահավ ամբողջական Stasin, սառեցված','ინდაური მთლიანი Stasin, გაყინული','frozen',3000,P(5000,9000,7000)],
 ['kiev_cutlets','Котлеты по-киевски, пакет','Կիևյան կոտլետներ, փաթեթ','კიევური კოტლეტები, შეფუთვა','frozen',750,E],
 ['pork_trotters','Свиные ножки, замороженные','Խոզի ոտքեր, սառեցված','ღორის ფეხები, გაყინული','frozen',600,W(500)],
 ['octopus_kg','Осьминог замороженный (развес)','Ութոտնուկ սառեցված (կշռով)','რვაფეხა გაყინული (წონით)','frozen',2200,W(500)],
 ['crayfish_1kg','Раки варёные замороженные, лоток 1 кг','Խեցգետիններ եփած սառեցված, 1 կգ','კიბორჩხალა მოხარშული გაყინული, 1 კგ','frozen',4000,E],
 ['pork_extra_aleshino','Свинина «Экстра» копчёно-варёная «Алёшино»','Խոզի միս «Экстра» ապխտած-եփած «Алёшино»','ღორის ხორცი «Экстра» შებოლილ-მოხარშული «Алёшино»','deli',2800,P(600,900,750)],
 ['carbonade_mikoyan','Карбонад Микояновский копчёно-варёный','Կարբոնադ Микояновский ապխտած-եփած','კარბონადი Микояновский შებოლილ-მოხარშული','deli',2800,W(300)],
 ['beef_homestyle_brest','Говядина «По-домашнему» копчёно-варёная (Брест)','Տավարի միս «По-домашнему» ապխտած-եփած (Բրեստ)','საქონლის ხორცი «По-домашнему» შებოლილ-მოხარშული (ბრესტი)','deli',4000,P(650,950,800)],
];
const artOf=key=>'artur-'+key.replaceAll('_','-');
export const arturArtsWithoutPhoto1124=arturProducts1124.map(r=>artOf(r[0]));
export function arturSql1124(){const V=arturVendor,s=x=>"'"+String(x).replaceAll("'","''")+"'",j=o=>s(JSON.stringify(o));
 return [...arturProducts1124.map(([key,ru,hy,ka,category,cost,profile])=>`INSERT INTO products(id,vendor_id,names,category,art,profile,price,cost,stock,active) SELECT ${s(V.city_id+'--artur_'+key)},${s(V.id)},${j({ru,hy,ka})},${s(category)},${s(artOf(key))},${j(profile||{mode:'EACH',policy_version:1})},${retail1124(cost)},${cost},${profile?100000:100},1 WHERE EXISTS(SELECT 1 FROM vendors WHERE id=${s(V.id)}) AND EXISTS(SELECT 1 FROM categories WHERE id=${s(category)}) ON CONFLICT(id) DO NOTHING;`),
  // Рогачёвъ: the shelf shows 5 ₾ — cost 5 ₾ (owner 24.11)
  `UPDATE products SET cost=500,version=version+1 WHERE id=${s(V.city_id+'--artur_condensed_rogachev')} AND vendor_id=${s(V.id)};`]}
