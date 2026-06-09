import { createDirectus, rest, readItems } from "@directus/sdk";
import type { Region, Periode, Tradition, Site, Personnage, Categorie } from "@/types";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
const client = createDirectus(DIRECTUS_URL).with(rest());
export { DIRECTUS_URL };

async function safeRequest<T>(promise: Promise<T[]>): Promise<T[]> {
  try {
    return await promise;
  } catch (e) {
    console.warn("[Directus] Requête échouée :", (e as Error).message?.slice(0, 80));
    return [];
  }
}

// ─── Régions ──────────────────────────────────────────────────────────────────

export async function getAllRegions(): Promise<Region[]> {
  return safeRequest(
    client.request(readItems("regions", { fields: ["*"], sort: ["nom"] })) as Promise<Region[]>
  );
}

export async function getRegionBySlug(slug: string): Promise<Region | null> {
  const r = await safeRequest(
    client.request(readItems("regions", {
      filter: { slug: { _eq: slug } },
      fields: [
        "*",
        "traditions.traditions_id.*",
        "traditions.traditions_id.categorie_id.*",
        "periodes.periodes_id.id",
        "periodes.periodes_id.nom",
        "periodes.periodes_id.slug",
        "periodes.periodes_id.date_debut",
        "periodes.periodes_id.date_fin",
        "periodes.periodes_id.type",
        "sites.*",
      ],
      limit: 1,
    })) as Promise<Region[]>
  );
  return r[0] ?? null;
}

export async function getAllRegionSlugs(): Promise<string[]> {
  const r = await safeRequest(
    client.request(readItems("regions", { fields: ["slug"] })) as Promise<{ slug: string }[]>
  );
  return r.map((x) => x.slug);
}

// ─── Périodes ─────────────────────────────────────────────────────────────────

export async function getAllPeriodes(): Promise<Periode[]> {
  return safeRequest(
    client.request(readItems("periodes", {
      fields: ["id", "slug", "nom", "date_debut", "date_fin", "type", "resume_frise", "image"],
      sort: ["date_debut"],
    })) as Promise<Periode[]>
  );
}

export async function getPeriodeBySlug(slug: string): Promise<Periode | null> {
  const r = await safeRequest(
    client.request(readItems("periodes", {
      filter: { slug: { _eq: slug } },
      fields: [
        "*",
        "personnages.personnages_id.*",
        "regions.regions_id.id",
        "regions.regions_id.nom",
        "regions.regions_id.slug",
        "regions.regions_id.couleur_identitaire",
      ],
      limit: 1,
    })) as Promise<Periode[]>
  );
  return r[0] ?? null;
}

export async function getAllPeriodeSlugs(): Promise<string[]> {
  const r = await safeRequest(
    client.request(readItems("periodes", { fields: ["slug"] })) as Promise<{ slug: string }[]>
  );
  return r.map((x) => x.slug);
}

// ─── Traditions ───────────────────────────────────────────────────────────────

export async function getAllTraditions(): Promise<Tradition[]> {
  return safeRequest(
    client.request(readItems("traditions", {
      fields: ["*", "categorie_id.*"],
      sort: ["nom"],
    })) as Promise<Tradition[]>
  );
}

export async function getTraditionBySlug(slug: string): Promise<Tradition | null> {
  const r = await safeRequest(
    client.request(readItems("traditions", {
      filter: { slug: { _eq: slug } },
      fields: ["*", "categorie_id.*"],
      limit: 1,
    })) as Promise<Tradition[]>
  );
  return r[0] ?? null;
}

export async function getAllTraditionSlugs(): Promise<string[]> {
  const r = await safeRequest(
    client.request(readItems("traditions", { fields: ["slug"] })) as Promise<{ slug: string }[]>
  );
  return r.map((x) => x.slug);
}

// ─── Sites ────────────────────────────────────────────────────────────────────

export async function getAllSites(): Promise<Site[]> {
  return safeRequest(
    client.request(readItems("sites", {
      fields: ["*", "region_id.*"],
      sort: ["nom"],
    })) as Promise<Site[]>
  );
}

// ─── Personnages ──────────────────────────────────────────────────────────────

export async function getAllPersonnages(): Promise<Personnage[]> {
  return safeRequest(
    client.request(readItems("personnages", {
      fields: ["*"],
      sort: ["nom"],
    })) as Promise<Personnage[]>
  );
}

// ─── Catégories ───────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Categorie[]> {
  return safeRequest(
    client.request(readItems("categories", {
      fields: ["*"],
      sort: ["nom"],
    })) as Promise<Categorie[]>
  );
}

// ─── Page d'accueil ───────────────────────────────────────────────────────────

export async function getAccueilData(): Promise<{ regions: Region[]; periodes: Periode[] }> {
  const [regions, periodes] = await Promise.all([
    safeRequest(
      client.request(readItems("regions", {
        fields: ["id", "slug", "nom", "capitale", "image_hero", "couleur_identitaire", "description"],
        sort: ["nom"],
      })) as Promise<Region[]>
    ),
    safeRequest(
      client.request(readItems("periodes", {
        fields: ["id", "slug", "nom", "date_debut", "date_fin", "type", "resume_frise"],
        sort: ["date_debut"],
        limit: 5,
      })) as Promise<Periode[]>
    ),
  ]);
  return { regions, periodes };
}
