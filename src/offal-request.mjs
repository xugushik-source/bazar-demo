// Owner 22.11: heart, kidneys and liver (beef and pork) are in short supply and go quickly, so the buyer must ask whether they are in
// stock, like the whole piglet. The price stays on the card; the product leaves the cart (mode REQUEST: write on WhatsApp or call).
// The old weighed profile is kept in profile.restore, so putting the product back on sale is one statement:
//   UPDATE products SET profile=json_extract(profile,'$.restore') WHERE id IN (...) AND json_extract(profile,'$.mode')='REQUEST';
export const offalIds=['beef_heart','beef_kidneys','beef_liver','pork_heart','pork_kidneys','pork_liver'].map(k=>'akhalkalaki--'+k);
export function offalSql(){
 const ids=offalIds.map(x=>"'"+x+"'").join(',');
 return ["UPDATE products SET profile=json_object('mode','REQUEST','policy_version',COALESCE(json_extract(profile,'$.policy_version'),1),'ask_availability',1,'restore',json(profile)) WHERE id IN ("+ids+") AND json_extract(profile,'$.mode')='WEIGHED';"];
}
