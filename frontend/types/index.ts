// ─── Types Directus ───────────────────────────────────────────────────────────

export interface Categorie {
  id: number;
  nom: string;
  icone: string;
  couleur: string;
}

export interface Tradition {
  id: number;
  slug: string;
  nom: string;
  description: string;
  image: string | null;          // UUID fichier Directus
  categorie_id: Categorie | null;
}

export interface Site {
  id: number;
  nom: string;
  description: string;
  image: string | null;
  type: "UNESCO" | "Naturel" | "Temple" | "Ville ancienne" | string;
  region_id: number | Region;
}

export interface Personnage {
  id: number;
  slug: string;
  nom: string;
  dates_vie: string;
  description: string;
  portrait: string | null;
  role: "Leader politique" | "Général" | "Poète" | "Philosophe" | "Résistant" | string;
}

export interface Region {
  id: number;
  slug: string;
  nom: string;
  description: string;
  image_hero: string | null;
  capitale: string;
  couleur_identitaire: string;
  // Relations (présentes uniquement quand fetchées avec nesting)
  traditions?: Array<{ traditions_id: Tradition }>;
  periodes?:   Array<{ periodes_id: Periode }>;
  sites?:      Site[];
}

export interface Periode {
  id: number;
  slug: string;
  nom: string;
  date_debut: number;
  date_fin: number | null;
  description: string;
  image: string | null;
  type: "Légendaire" | "Occupation" | "Dynastie" | "Colonisation" | "Guerre" | "Réforme" | "Contemporain" | string;
  resume_frise: string;
  // Relations
  personnages?: Array<{ personnages_id: Personnage }>;
  regions?:     Array<{ regions_id: Region }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Transforme un UUID Directus en URL d'asset complète */
export function assetUrl(uuid: string | null | undefined, baseUrl: string): string | null {
  if (!uuid) return null;
  return `${baseUrl}/assets/${uuid}`;
}
