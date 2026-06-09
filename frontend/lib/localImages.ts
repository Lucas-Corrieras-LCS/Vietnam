/**
 * localImages.ts
 * Fallback : images locales dans /public/ quand Directus n'a pas encore
 * d'asset uploadé pour un élément. Clé = slug (traditions/personnages)
 * ou nom exact (sites).
 */

export const TRADITION_IMAGES: Record<string, string> = {
  "pho":            "/pho.jpg",
  "tet":            "/tet_nguyen_dan.jpg",
  "nha-nhac":       "/nha_nhac.jpg",
  "fete-lanternes": "/fetes_des_lanternes.jpg",
  "banh-mi":        "/banh_mi.jpg",
  "soie-van-phuc":  "/soierie_van_phuc.jpg",
  "quan-ho":        "/quan_ho_bac_ninh.jpeg",
  "ao-dai":         "/ao_dai.jpeg",
};

export const SITE_IMAGES: Record<string, string> = {
  "Baie d'Ha Long":                      "/baie_d'ha_long.jpg",
  "Vieille ville de Hội An":             "/vieille_ville_hoi_an.jpg",
  "Complexe impérial de Hué":            "/complexe_impérial_de_hué.jpg",
  "Sanctuaire de Mỹ Sơn":               "/sanctuaire_de_my_son.jpg",
  "Parc national de Phong Nha-Kẻ Bàng": "/phong_nha-ke_bang.jpg",
  "Delta du Mékong":                     "/delta_mekong.jpg",
  "Ruines de la Citadelle de Hà Nội":    "/citadelle_de_ha_noi.jpg",
};

export const PERSONNAGE_IMAGES: Record<string, string> = {
  "ho-chi-minh":    "/Ho_Chi_Minh.jpg",
  "vo-nguyen-giap": "/vo_nguyen_giap.jpg",
  "trung-sisters":  "/soeurs_trung.jpg",
  "tu-duc":         "/Tu_Duc.jpg",
  "nguyen-du":      "/nguyen_du.jpg",
};

export const REGION_IMAGES: Record<string, string> = {
  "sud-vietnam": "/delta_mekong.jpg",
};

/** Renvoie l'image locale ou null si introuvable */
export function localTradition(slug: string): string | null {
  return TRADITION_IMAGES[slug] ?? null;
}
export function localSite(nom: string): string | null {
  return SITE_IMAGES[nom] ?? null;
}
export function localPersonnage(slug: string): string | null {
  return PERSONNAGE_IMAGES[slug] ?? null;
}
export function localRegion(slug: string): string | null {
  return REGION_IMAGES[slug] ?? null;
}

/**
 * Encapsule une URL image dans une chaîne CSS backgroundImage sécurisée.
 * Les apostrophes dans les noms de fichiers sont gérées via double-quotes CSS.
 */
export function bgImage(url: string | null): string {
  if (!url) return "none";
  // Double quotes à l'intérieur pour gérer les apostrophes dans les URLs
  return `url("${url}")`;
}
