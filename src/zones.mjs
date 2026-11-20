// Delivery zones (owner 30.10): only Akhalkalaki; «1 Городок» next to the town has a bad road, so delivery there costs extra,
// without the free-delivery threshold and without the free first order. Ninotsminda and Akhaltsikhe are announced as «скоро».
// Owner 31.10: «1 городок — 6 лари» (taxi Maxim from the centre: 6,7 ₾); the 14th and 15th gorodoks count as the town.
// Owner 07.11: nearby villages, free from 160 ₾ of goods.
const village=(id,fee,ru,hy,ka,aliases)=>({id,fee,free_from:16000,names:{ru,hy,ka},aliases}),far=(id,fee,ru,hy,ka,aliases)=>({id,fee,free_from:null,names:{ru,hy,ka},aliases});
export const zones={akhalkalaki:[{id:'gorodok',fee:700,free_from:15000,names:{ru:'1 Городок',hy:'1 Գորոդոկ',ka:'1 გოროდოკი'},aliases:['1 городок','1-й городок','1й городок','1-ый городок','первый городок','1 gorodok','1 գորոդոկ','1 გოროდოკი']},
 village('bavra',550,'Бавра','Բավրա','ბავრა',['бавр','bavra','բավրա','ბავრა']),village('khulgumo',600,'Хулгумо','Խուլգումո','ხულგუმო',['хулгум','хульгум','khulgumo','xulgumo','խուլգումո','ხულგუმო']),
 village('dilisqa',800,'Дилиска','Դիլիսկա','დილისქა',['дилиск','делиск','dilisqa','dilisca','diliska','դիլիսկա','დილისქა']),village('kartikam',800,'Картикам','Քարթիկամ','ქარტიკამი',['картикам','kartikam','kartikami','քարթիկամ','քարտիկամ','կարտիկամ','ქარტიკამი']),
 village('kulikam',800,'Куликам','Կուլիկամ','კულიკამი',['куликам','kulikam','kulikami','կուլիկամ','კულიკამი']),
 // Owner 20.11: Гокио 27 ₾, no free-delivery threshold, like the other farther villages.
 // Owner 11.11: farther villages — Маджадия 10 ₾, Орджа 13 ₾, Хандо 18 ₾, Аластан 22 ₾. No free-delivery threshold was given,
 // so these pay the fee on any order until the owner names one.
 far('majadia',1000,'Маджадия','Մաջադիա','მაჯადია',['маджади','majadia','majadiya','մաջադիա','მაჯადია']),far('orja',1300,'Орджа','Օրջա','ორჯა',['орджа','ордже','орджу','orja','ordja','օրջա','ორჯა']),
 far('khando',1800,'Хандо','Խանդո','ხანდო',['хандо','khando','xando','խանդո','ხანდო']),far('alastani',2200,'Аластан','Ալաստան','ალასტანი',['аластан','alastan','alastani','ալաստան','ალასტანი']),
 far('gokio',2700,'Гокио','Գոկիո','გოკიო',['гокио','гокиа','гокие','gokio','goqio','գոկիո','გოკიო']),
 // Owner 20.11: the price list of the other villages (no free-delivery threshold, like the farther villages above);
 // villages named without a price are not delivered to and are left out.
 far('abuli',1800,'Абули','Աբուլ','აბული',['абул','abuli','աբուլ','აბული']),
 far('agana',2500,'Агана','Աղանա','აგანა',['агана','agana','աղանա','აგანა']),
 far('alatumani',2500,'Алатумани','Ալաթուման','ალათუმანი',['алатуман','alatumani','ալաթուման','ალათუმანი']),
 far('aragva',1200,'Арагва','Արագվա','არაგვა',['арагв','aragva','արագվա','არაგვა']),
 far('azavreti',2700,'Азаврети','Ազավրեթ','აზავრეთი',['азаврет','azavreti','ազավրեթ','აზავრეთი']),
 far('balkho',1800,'Балхо','Բալխո','ბალხო',['балх','balxo','balkho','բալխո','ბალხო']),
 far('baraleti',2000,'Баралети','Բարալեթ','ბარალეთი',['баралет','baraleti','բարալեթ','ბარალეთი']),
 far('bezhano',2800,'Бежано','Բեժանո','ბეჟანო',['бежан','bejano','bezhano','բեժանո','ბეჟანო']),
 far('bugasheni',1500,'Бугашени','Բուղաշեն','ბუღაშენი',['бугашен','бугашэн','bugasheni','bughasheni','բուղաշեն','ბუღაშენი']),
 far('burnasheti',2300,'Бурнашети','Բուռնաշեթ','ბურნაშეთი',['бурнашет','burnasheti','բուռնաշեթ','ბურნაშეთი']),
 far('buzaveti',1400,'Бузавети','Բուզավեթ','ბუზავეთი',['бузавет','buzaveti','բուզավեթ','ბუზავეთი']),
 far('chunchkha',1420,'Чунчха','Ճունճխա','ჭუნჭხა',['чунчх','chunchxa','chunchkha','ճունճխա','ჭუნჭხა']),
 far('didi-samsari',2900,'Диди Самсари','Մեծ Սամսար','დიდი სამსარი',['диди самсар','большой самсар','мец самсар','didi samsari','մեծ սամսար','დიდი სამსარი']),
 far('gogasheni',3100,'Гогашени','Գոգաշեն','გოგაშენი',['гогашен','gogasheni','գոգաշեն','გოგაშენი']),
 far('gomani',1500,'Гомани','Գոման','გომანი',['гоман','gomani','գոման','გომანი']),
 far('ikhtila',2300,'Ихтила','Իխթիլա','იხთილა',['ихтил','ixtila','ikhtila','իխթիլա','იხთილა']),
 far('kartsakhi',4000,'Карцахи','Կարծախ','კარწახი',['карцах','kartsaxi','kartsakhi','կարծախ','კარწახი']),
 far('kartsebi',2100,'Карцеби','Կարցեբ','კარცები',['карцеб','kartsebi','կարցեբ','კარცები']),
 far('khorenia',1350,'Хорениа','Խորենիա','ხორენია',['хорени','xorenia','khorenia','խորենիա','ხორენია']),
 far('khospio',530,'Хоспио','Խոսպիո','ხოსპიო',['хоспи','xospio','khospio','խոսպիո','ხოსპიო']),
 far('kirovakani',950,'Кировакани','Կիրովական','კიროვაკანი',['кировакан','kirovakani','կիրովական','კიროვაკანი']),
 far('kochio',2400,'Кочио','Կոչիո','კოჩიო',['кочи','kochio','կոչիո','კოჩიო']),
 far('korkhi',1100,'Корхи','Կորխ','კორხი',['корх','korxi','korkhi','կորխ','კორხი']),
 far('kotelia',1450,'Котелиа','Կոթելիա','კოთელია',['котели','kotelia','կոթելիա','კოთელია']),
 far('kumurdo',1400,'Кумурдо','Կումուրդո','კუმურდო',['кумурд','kumurdo','կումուրդո','კუმურდო']),
 far('lomaturtskhi',2100,'Ломатурцхи','Լոմաթուրցխ','ლომათურცხი',['ломатурцх','lomaturtskhi','լոմաթուրցխ','ლომათურცხი']),
 far('machatia',1100,'Мачатиа','Մաճաթիա','მაჭათია',['мачати','machatia','մաճաթիա','მაჭათია']),
 far('martuni',550,'Мартуни','Մարտունի','მარტუნი',['мартун','martuni','մարտունի','მარტუნი']),
 far('merenia',2400,'Мерениа','Մերենիա','მერენია',['мерени','merenia','մերենիա','მერენია']),
 far('miasnikiani',2300,'Мясникиани','Մյասնիկյան','მიასნიკიანი',['мясникян','мясникиан','miasnikian','miasnikiani','մյասնիկյան','მიასნიკიანი']),
 far('modega',2600,'Модега','Մոդեգա','მოდეგა',['модег','modega','մոդեգա','მოდეგა']),
 far('murjakheti',1250,'Мурджахети','Մուրջախեթ','მურჯახეთი',['мурджахет','murjaxeti','murjakheti','մուրջախեթ','მურჯახეთი']),
 far('okami',2000,'Оками','Օկամ','ოკამი',['оками','окам','okami','օկամ','ოკამი']),
 far('olaverdi',1950,'Олаверди','Օլավերդի','ოლავერდი',['олаверд','olaverdi','օլավերդի','ოლავერდი']),
 far('patara-samsari',2800,'Патара Самсари','Փոքր Սամսար','პატარა სამსარი',['патара самсар','малый самсар','покр самсар','patara samsari','փոքր սամսար','პატარა სამსარი']),
 far('ptena',1900,'Птена','Փթենա','ფტენა',['птен','ptena','փթենա','ფტენა']),
 far('sirkva',2400,'Сирква','Սիրկվա','სირკვა',['сирко','сиркв','sirkva','սիրկվա','სირკვა']),
 far('sulda',2800,'Сулда','Սուլդա','სულდა',['сулд','sulda','սուլդա','სულდა']),
 far('takhcha',1600,'Тахча','Թախչա','თახჩა',['тахч','taxcha','takhcha','թախչա','თახჩა']),
 far('tirkna',1500,'Тиркна','Թիրքնա','თირქნა',['тиркн','tirkna','թիրքնա','თირქნა']),
 far('totkhami',900,'Тотхами','Թոթխամ','თოთხამი',['тотхам','totxami','totkhami','թոթխամ','თოთხამი']),
 far('turtskhi',2200,'Турцхи','Թուրցխ','თურცხი',['турцх','turtskhi','թուրցխ','თურცხი']),
 far('vachiani',1400,'Вачиани','Վաչիան','ვაჩიანი',['вачиан','vachiani','վաչիան','ვაჩიანი']),
 far('varevani',2200,'Варевани','Վարևան','ვარევანი',['варевани','варева','varevani','վարևան','ვარევანი']),
 far('zakvi',1600,'Закви','Զաքվի','ზაქვი',['закв','zaqvi','zakvi','զաքվի','ზაქვი'])]};
// Owner 31.10: free in «1 Городок» from 80 ₾ of goods (the town: from 50 ₾); the free first order stays a town offer.
// Owner 07.11: delivery 5 ₾ below 100 ₾ in the town, «1 Городок» 7 ₾, free from 100 ₾ in the town and from 150 ₾ in «1 Городок» (src/pricing-1107.mjs).
export const zoneFee=(z,items)=>z.free_from!=null&&items>=z.free_from?0:z.fee;
export const zoneOf=(c,id)=>(zones[c?.id]||[]).find(z=>z.id===id)||null;
// Owner 09.11: the village written in the address picks its delivery price by itself (site and server use the same rule).
export function detectZone(list,text){const t=' '+String(text||'').toLowerCase().replace(/ё/g,'е').replace(/\s+/g,' ')+' ';
 for(const z of list||[])for(const a of z.aliases||[]){let i=t.indexOf(a);while(i>=0){if(!/[\p{L}\p{N}]/u.test(t[i-1]||' ')&&!/[\p{L}\p{N}]/u.test(t[i+a.length]||' ')||!/[\p{L}\p{N}]/u.test(t[i-1]||' ')&&/[\p{L}]/u.test(t[i+a.length]||' ')&&!/\d/.test(a[0]))return z.id;i=t.indexOf(a,i+1)}}return ''}
