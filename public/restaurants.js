// Restaurant dishes («Ресторанные блюда» inside «Готовая еда»). Public data only — names, sections, set composition, photo notes.
// Purchase prices live on the server (src/restaurants.mjs) and never in this file.
// Any restaurant is a vendor; its dishes use the shared rf_rs_* sections, so a second restaurant needs only a new vendor and a dish list.
export const restaurantSections=[
 ['rf_rs_hot',{ru:'Ресторанные блюда: горячие блюда',ka:'რესტორნის კერძები: ცხელი კერძები',hy:'Ռեստորանային ուտեստներ՝ տաք ուտեստներ'},85],
 ['rf_rs_fish',{ru:'Ресторанные блюда: рыбные блюда',ka:'რესტორნის კერძები: თევზის კერძები',hy:'Ռեստորանային ուտեստներ՝ ձկան ուտեստներ'},86],
 ['rf_rs_grill',{ru:'Ресторанные блюда: шашлыки и мангал',ka:'რესტორნის კერძები: მწვადი და მანგალი',hy:'Ռեստորանային ուտեստներ՝ խորոված և մանղալ'},87],
 ['rf_rs_cold',{ru:'Ресторанные блюда: холодные закуски',ka:'რესტორნის კერძები: ცივი საუზმეული',hy:'Ռեստորանային ուտեստներ՝ սառը նախուտեստներ'},88],
 ['rf_rs_salads',{ru:'Ресторанные блюда: салаты',ka:'რესტორნის კერძები: სალათები',hy:'Ռեստորանային ուտեստներ՝ աղցաններ'},89],
 ['rf_rs_soups',{ru:'Ресторанные блюда: супы',ka:'რესტორნის კერძები: სუპები',hy:'Ռեստորանային ուտեստներ՝ ապուրներ'},90],
 ['rf_rs_sides',{ru:'Ресторанные блюда: гарниры',ka:'რესტორნის კერძები: გარნირები',hy:'Ռեստորանային ուտեստներ՝ խավարտներ'},91],
 ['rf_rs_bread',{ru:'Ресторанные блюда: хлеб',ka:'რესტორნის კერძები: პური',hy:'Ռեստորանային ուտեստներ՝ հաց'},92],
 ['rf_rs_sauces',{ru:'Ресторанные блюда: соусы',ka:'რესტორნის კერძები: სოუსები',hy:'Ռեստորանային ուտեստներ՝ սոուսներ'},93],
 ['rf_rs_sets',{ru:'Ресторанные блюда: ассорти и наборы',ka:'რესტორნის კერძები: ასორტი და ნაკრებები',hy:'Ռեստորանային ուտեստներ՝ տեսականի և հավաքածուներ'},94]];
export const restaurantCategoryIds=restaurantSections.map(s=>s[0]);
export const isRestaurantCat=c=>String(c||'').startsWith('rf_rs_');
// [key, section, ru, ka, hy, byKg] — byKg: sold by the kilogram (price per kg, the restaurant weighs, the buyer pays the real weight)
export const forelDishes=[
 ['pork_leg_baked','rf_rs_hot','Запечённая свиная нога','შემწვარი ღორის ბარკალი','Խոզի թխած ազդր',0],
 ['rabbit_baked','rf_rs_hot','Запечённый кролик','შემწვარი კურდღელი','Տապակած նապաստակ',1],
 ['chicken_boiled','rf_rs_hot','Варёная домашняя курица','მოხარშული შინაური ქათამი','Եփած տնային հավ',0],
 ['piglet_baked','rf_rs_hot','Запечённый поросёнок','შემწვარი გოჭი','Տապակած խոճկոր',1],
 ['pork_knuckle','rf_rs_hot','Свиная рулька','ღორის კანჭი','Խոզի սրունք',0],
 ['beef_saddle','rf_rs_hot','Седло из говядины','საქონლის ხორცის უნაგირი','Տավարի մեջքամիս',1],
 ['lamb_khashlama','rf_rs_hot','Хашлама из баранины','ცხვრის ხაშლამა','Գառան խաշլամա',1],
 ['beef_stroganoff','rf_rs_hot','Бефстроганов','ბიფსტროგანოვი','Բեֆստրոգանով',0],
 ['pork_fried','rf_rs_hot','Жареная свинина','შემწვარი ღორის ხორცი','Տապակած խոզի միս',0],
 ['ojakhuri','rf_rs_hot','Оджахури','ოჯახური','Օջախուրի',0],
 ['pork_pot','rf_rs_hot','Свинина в горшочке','ღორის ხორცი ქოთანში','Խոզի միս կավե ամանում',0],
 ['dolma','rf_rs_hot','Долма','ტოლმა','Տոլմա',0],
 ['khashlama','rf_rs_hot','Хашлама','ხაშლამა','Խաշլամա',0],
 ['oxtail','rf_rs_hot','Говяжий хвост','საქონლის კუდი','Տավարի պոչ',0],
 ['chkmeruli','rf_rs_hot','Чкмерули','ჩქმერული','Չքմերուլի',0],
 ['fish_kebab','rf_rs_fish','Рыбный кебаб','თევზის ქაბაბი','Ձկան քաբաբ',0],
 ['river_trout','rf_rs_fish','Речная форель','მდინარის კალმახი','Գետի իշխան',1],
 ['ryabushka','rf_rs_fish','Рябушка','რიაბუშკა','Ռյաբուշկա',1],
 ['sterlet','rf_rs_fish','Стерлядь','სტერლეტი','Ստերլետ',1],
 ['trout_large','rf_rs_fish','Крупная форель','დიდი კალმახი','Խոշոր իշխան',1],
 ['lamb_ribs_shashlik','rf_rs_grill','Шашлык из бараньих рёбер','ცხვრის ნეკნების მწვადი','Գառան կողերի խորոված',0],
 ['chicken_breast_shashlik','rf_rs_grill','Шашлык из куриной грудки','ქათმის გულ-მკერდის მწვადი','Հավի կրծքամսի խորոված',0],
 ['pork_shashlik','rf_rs_grill','Шашлык из свиной мякоти','ღორის რბილი ხორცის მწვადი','Խոզի փափկամսի խորոված',0],
 ['chicken_spit','rf_rs_grill','Курица на вертеле','შამფურზე შემწვარი ქათამი','Շամփուրի վրա խորոված հավ',1],
 ['saddle_grill','rf_rs_grill','Седло','უნაგირი','Մեջքամիս',1],
 ['trout_grill','rf_rs_grill','Форель','კალმახი','Իշխան',1],
 ['quail','rf_rs_grill','Перепёлка','მწყერი','Լոր',0],
 ['chicken_tabaka','rf_rs_grill','Цыплёнок табака','წიწილა ტაბაკა','Ճուտ տաբակա',0],
 ['chicken_wings','rf_rs_grill','Куриные крылышки','ქათმის ფრთები','Հավի թևիկներ',0],
 ['grilled_vegetables','rf_rs_grill','Овощи на гриле','გრილზე შემწვარი ბოსტნეული','Խորոված բանջարեղեն',0],
 ['kebab','rf_rs_grill','Кебаб','ქაბაბი','Քաբաբ',0],
 ['pork_ribs_shashlik','rf_rs_grill','Шашлык из свиных рёбрышек','ღორის ნეკნების მწვადი','Խոզի կողերի խորոված',0],
 ['pickles_banquet','rf_rs_cold','Банкетное ассорти из солений','მჟავეულის ასორტი (საბანკეტო)','Թթուների տեսականի',0],
 ['cheese_banquet','rf_rs_cold','Банкетное сырное ассорти','ყველის ასორტი (საბანკეტო)','Պանրի տեսականի',0],
 ['ham','rf_rs_cold','Ветчина','ლორი','Խոզապուխտ',0],
 ['summer_dolma','rf_rs_cold','Летние голубцы','საზაფხულო ტოლმა','Ամառային տոլմա',1],
 ['caviar','rf_rs_cold','Икра','ხიზილალა','Ձկնկիթ',0],
 ['sausage','rf_rs_cold','Колбаса','ძეხვი','Երշիկ',0],
 ['pkhali','rf_rs_cold','Пхали','ფხალი','Փխալի',0],
 ['fish_assorted','rf_rs_cold','Рыбное ассорти','თევზის ასორტი','Ձկնային տեսականի',0],
 ['eggplant_walnuts','rf_rs_cold','Баклажаны с орехами','ბადრიჯანი ნიგვზით','Սմբուկ ընկույզով',0],
 ['basturma_sujuk','rf_rs_cold','Бастурма и суджук','ბასტურმა და სუჯუკი','Բաստուրմա և սուջուխ',0],
 ['greens','rf_rs_cold','Зелень','მწვანილი','Կանաչի',0],
 ['meat_platter','rf_rs_cold','Мясная нарезка','ხორცის ასორტი','Մսային տեսականի',0],
 ['vegetable_platter','rf_rs_cold','Овощная нарезка','დაჭრილი ბოსტნეული','Կտրատած բանջարեղեն',0],
 ['pickles','rf_rs_cold','Соленья','მჟავეული','Թթուներ',0],
 ['cheese','rf_rs_cold','Сыр','ყველი','Պանիր',0],
 ['tongue_boiled','rf_rs_cold','Отварной язык','მოხარშული ენა','Եփած լեզու',0],
 ['lemon','rf_rs_cold','Лимон','ლიმონი','Կիտրոն',0],
 ['olives','rf_rs_cold','Оливки','ზეთისხილი','Ձիթապտուղ',0],
 ['caesar','rf_rs_salads','Цезарь','ცეზარი','Կեսար',0],
 ['crab_salad','rf_rs_salads','Крабовый салат','კრაბის სალათი','Խեցգետնի աղցան',0],
 ['kuchmachi','rf_rs_salads','Кучмачи','კუჭმაჭი','Կուչմաչի',0],
 ['svetofor','rf_rs_salads','Светофор','შუქნიშანი','Լուսացույց',0],
 ['moskovsky','rf_rs_salads','Московский','მოსკოვური','Մոսկովյան',0],
 ['tongue_cucumber_salad','rf_rs_salads','Салат с языком и огурцом','ენისა და კიტრის სალათი','Լեզվով և վարունգով աղցան',0],
 ['vegetable_salad','rf_rs_salads','Овощной салат','ბოსტნეულის სალათი','Բանջարեղենային աղցան',0],
 ['bean_salad','rf_rs_salads','Салат с фасолью','ლობიოს სალათი','Լոբով աղցան',0],
 ['chicken_mushroom_salad','rf_rs_salads','Салат с курицей и грибами','ქათმისა და სოკოს სალათი','Հավով և սնկով աղցան',0],
 ['chakapuli','rf_rs_soups','Чакапули','ჩაქაფული','Չաքափուլի',0],
 ['kharcho','rf_rs_soups','Харчо','ხარჩო','Խարչո',0],
 ['chicken_soup','rf_rs_soups','Куриный суп','ქათმის სუპი','Հավի ապուր',0],
 ['ostri','rf_rs_soups','Остри','ოსტრი','Օստրի',0],
 ['solyanka','rf_rs_soups','Солянка','სოლიანკა','Սոլյանկա',0],
 ['ukha','rf_rs_soups','Уха','თევზის სუპი','Ձկան ապուր',0],
 ['peas_egg','rf_rs_sides','Горошек с яйцом','ბარდა კვერცხით','Կանաչ ոլոռ ձվով',0],
 ['mushrooms_baked','rf_rs_sides','Запечённые грибы','შემწვარი სოკო','Տապակած սունկ',0],
 ['mushrooms_cheese','rf_rs_sides','Грибы с сыром','სოკო ყველით','Սունկ պանրով',0],
 ['potato_home','rf_rs_sides','Картофель по-домашнему','ოჯახური კარტოფილი','Տնական կարտոֆիլ',0],
 ['fries','rf_rs_sides','Картофель фри','კარტოფილი ფრი','Կարտոֆիլ ֆրի',0],
 ['bread_basket','rf_rs_bread','Хлебная корзина','პურის კალათა','Հացի զամբյուղ',0],
 ['matsoni','rf_rs_sauces','Мацони','მაწონი','Մածուն',0],
 ['satsebeli','rf_rs_sauces','Сацебели','საწებელი','Սացեբելի',0],
 ['sour_cream','rf_rs_sauces','Сметана','არაჟანი','Թթվասեր',0],
 ['tkemali','rf_rs_sauces','Ткемали','ტყემალი','Տկեմալի',0]];
// Sets made of the restaurant's own dishes: [key, ru, ka, hy, [[dishKey, count], ...]]. Their purchase price is the sum of the parts.
export const forelSets=[
 ['set_meat','Мясное ассорти','ხორცის ასორტი','Մսային տեսականի',[['pork_shashlik',1],['chicken_breast_shashlik',1],['lamb_ribs_shashlik',1],['kebab',1]]],
 ['set_chicken','Куриное ассорти','ქათმის ასორტი','Հավի տեսականի',[['chicken_breast_shashlik',1],['chicken_wings',1],['chicken_tabaka',1]]],
 ['set_dinner_two','Ужин на двоих','ვახშამი ორისთვის','Ընթրիք երկուսի համար',[['pork_shashlik',1],['kebab',1],['grilled_vegetables',1],['potato_home',1],['bread_basket',1],['satsebeli',1]]],
 ['set_feast','Большое застолье','დიდი სუფრა','Մեծ խնջույք',[['pork_shashlik',2],['kebab',2],['lamb_ribs_shashlik',1],['pork_ribs_shashlik',1],['grilled_vegetables',1],['vegetable_salad',1],['bread_basket',2],['satsebeli',1],['tkemali',1]]],
 ['set_caucasian','Кавказские закуски','კავკასიური საუზმეული','Կովկասյան նախուտեստներ',[['eggplant_walnuts',1],['pkhali',1],['cheese',1],['pickles',1],['vegetable_platter',1]]]];
export const forelVendorId='akhalkalaki-forel';
export const forelKey=k=>'forel_'+k;
export const restaurantArt=(section,key)=>'restaurants/forel/'+section.replace('rf_rs_','')+'/'+key.replaceAll('_','-');
// Photos taken from another project («Шашлычный рай») show a similar dish, not the restaurant's own serving.
export const illustrativeArts=new Set(["restaurants/forel/hot/ojakhuri", "restaurants/forel/hot/dolma", "restaurants/forel/grill/trout-grill", "restaurants/forel/grill/chicken-breast-shashlik", "restaurants/forel/grill/pork-shashlik", "restaurants/forel/grill/chicken-wings", "restaurants/forel/grill/grilled-vegetables", "restaurants/forel/grill/pork-ribs-shashlik", "restaurants/forel/cold/pickles", "restaurants/forel/cold/cheese-banquet", "restaurants/forel/cold/pkhali", "restaurants/forel/cold/eggplant-walnuts", "restaurants/forel/cold/basturma-sujuk", "restaurants/forel/cold/meat-platter", "restaurants/forel/cold/vegetable-platter", "restaurants/forel/cold/tongue-boiled", "restaurants/forel/cold/cheese", "restaurants/forel/salads/caesar", "restaurants/forel/salads/vegetable-salad", "restaurants/forel/salads/tongue-cucumber-salad", "restaurants/forel/soups/kharcho", "restaurants/forel/sides/mushrooms-baked", "restaurants/forel/sides/fries", "restaurants/forel/sauces/satsebeli", "restaurants/forel/sauces/tkemali", "restaurants/forel/sets/set-meat", "restaurants/forel/sets/set-chicken", "restaurants/forel/sets/set-dinner-two", "restaurants/forel/sets/set-feast", "restaurants/forel/sets/set-caucasian"]);
export const restaurantPlaceholder='restaurants/forel/placeholder';
export const photoNote={ru:'Фото похожего блюда, не подача ресторана',ka:'მსგავსი კერძის ფოტო, არა რესტორნის მიწოდება',hy:'Նման ուտեստի լուսանկար, ոչ ռեստորանի մատուցումը'};
// Set composition shown to the buyer, with the saving against buying the same dishes separately (only when there is one).
export function setInfo(products,product){const k=String(product.id).split('--')[1]||'',set=forelSets.find(s=>forelKey(s[0])===k);if(!set)return null;
 const city=String(product.id).split('--')[0],lines=set[4].map(([d,n])=>({product:products.find(p=>p.id===city+'--'+forelKey(d)),count:n}));
 if(lines.some(l=>!l.product))return {lines,separate:null,saving:0};const separate=lines.reduce((s,l)=>s+l.product.price*l.count,0);return {lines,separate,saving:Math.max(0,separate-product.price)}}
export const restaurantWords={
 ru:{restaurant:'Ресторан',all:'Все блюда',set:'Состав набора',separate:'По отдельности',saving:'Экономия',portion:'порц.'},
 ka:{restaurant:'რესტორანი',all:'ყველა კერძი',set:'ნაკრების შემადგენლობა',separate:'ცალ-ცალკე',saving:'დანაზოგი',portion:'ულ.'},
 hy:{restaurant:'Ռեստորան',all:'Բոլոր ուտեստները',set:'Հավաքածուի կազմը',separate:'Առանձին',saving:'Խնայողություն',portion:'բաժ.'}};
