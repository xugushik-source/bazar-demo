// Owner 19.11: «зелень — нормальные красивые фото, а не одно общее». Each of the five greens (src/greens-1119.mjs) gets its own photo
// (free Pexels licence, see docs/PHOTO_SOURCES.json): dill, spring onion, cilantro, parsley and garden cress («котем»).
// Migration 0116 stays as it was applied; this one only changes the picture of the products that still have the first one.
export const greensPhotos=[['dill','greens-dill','dill'],['spring_onion','greens-spring-onion','herbs'],['kotem','greens-kotem','herbs'],['parsley','greens-parsley','herbs'],['cilantro','greens-cilantro','herbs']];
export function greensPhotoSql(){return greensPhotos.map(([k,art,old])=>`UPDATE products SET art='${art}',version=version+1 WHERE id='akhalkalaki--greens_${k}' AND art='${old}';`)}
