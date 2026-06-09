/**
 * retry-migrate.mjs v2
 * Insère regions, periodes, sites sans forcer les IDs (laisse Render les générer).
 * Remappe region_id dans sites via le slug.
 */

const LOCAL  = "http://localhost:8055";
const REMOTE = "https://directus-vietnam.onrender.com";
const LOCAL_TOKEN  = "CBgW_AoUAUanBBo8Pyao8hYzkbYwxvXR";
const REMOTE_TOKEN = "Gh54dIHPD_Fbw2qXi2YkyntxfcGZ57po";

async function api(base, token, method, path, body) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

// Retire les champs qui posent problème
function cleanItem(item, stripFields = []) {
  const cleaned = { ...item };
  delete cleaned.id;               // laisse Render générer l'ID
  delete cleaned.user_created;
  delete cleaned.user_updated;
  delete cleaned.date_created;
  delete cleaned.date_updated;
  for (const f of stripFields) delete cleaned[f];
  return cleaned;
}

async function main() {
  console.log("\n🔄 Retry migration v2 — sans IDs forcés\n");

  // ── 1. Regions ──────────────────────────────────────────────────────────────
  console.log("→ Regions...");
  const regData = await api(LOCAL, LOCAL_TOKEN, "GET", "/items/regions?limit=-1");
  const regions = regData?.data || [];

  const regionSlugToId = {}; // oldSlug → newId sur Render

  for (const item of regions) {
    // On retire image_hero (fichier absent) + relations inversées (sites, traditions)
    const cleaned = cleanItem(item, ["image_hero", "sites", "traditions"]);
    const result = await api(REMOTE, REMOTE_TOKEN, "POST", `/items/regions`, cleaned);
    if (result?.errors) {
      console.error(`  ❌ ${item.nom}: ${result.errors[0]?.message}`);
    } else {
      const newId = result?.data?.id;
      regionSlugToId[item.slug] = newId;
      console.log(`  ✅ ${item.nom} → id=${newId}`);
    }
  }

  // ── 2. Periodes ─────────────────────────────────────────────────────────────
  console.log("\n→ Periodes...");
  const perData = await api(LOCAL, LOCAL_TOKEN, "GET", "/items/periodes?limit=-1");
  const periodes = perData?.data || [];

  for (const item of periodes) {
    const cleaned = cleanItem(item, ["image", "regions", "personnages"]);
    const result = await api(REMOTE, REMOTE_TOKEN, "POST", `/items/periodes`, cleaned);
    if (result?.errors) {
      console.error(`  ❌ ${item.nom}: ${result.errors[0]?.message}`);
    } else {
      console.log(`  ✅ ${item.nom}`);
    }
  }

  // ── 3. Sites (avec remappage region_id) ────────────────────────────────────
  console.log("\n→ Sites...");
  const sitData = await api(LOCAL, LOCAL_TOKEN, "GET", "/items/sites?limit=-1&fields=*,region_id.*");
  const sites = sitData?.data || [];

  // Récupérer les nouvelles regions sur Render pour faire le mapping slug→id
  const renderRegions = await api(REMOTE, REMOTE_TOKEN, "GET", "/items/regions?fields=id,slug&limit=-1");
  const renderRegionMap = {};
  for (const r of renderRegions?.data || []) {
    renderRegionMap[r.slug] = r.id;
  }
  console.log("  Mapping regions Render:", renderRegionMap);

  for (const item of sites) {
    const cleaned = cleanItem(item, ["image"]);

    // Remapper region_id via le slug
    if (item.region_id) {
      const regionSlug = typeof item.region_id === "object"
        ? item.region_id.slug
        : null;

      if (regionSlug && renderRegionMap[regionSlug]) {
        cleaned.region_id = renderRegionMap[regionSlug];
      } else {
        // Essayer de trouver par l'ID local dans le mapping
        const matchedSlug = Object.keys(regionSlugToId).find(
          s => regionSlugToId[s] !== undefined
        );
        cleaned.region_id = null; // On met null si on ne trouve pas
      }
    }

    const result = await api(REMOTE, REMOTE_TOKEN, "POST", `/items/sites`, cleaned);
    if (result?.errors) {
      console.error(`  ❌ ${item.nom}: ${result.errors[0]?.message}`);
    } else {
      console.log(`  ✅ ${item.nom}`);
    }
  }

  console.log("\n🎉 Migration v2 terminée !\n");
}

main().catch(e => { console.error("💥", e.message); process.exit(1); });
