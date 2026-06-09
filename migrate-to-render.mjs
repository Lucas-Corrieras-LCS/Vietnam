/**
 * migrate-to-render.mjs
 * Exporte le schéma + les données du Directus local → les pousse vers Render.
 *
 * Usage :
 *   node migrate-to-render.mjs
 *
 * Prérequis : Directus local allumé (docker compose up -d)
 */

// ── Config ────────────────────────────────────────────────────────────────────
const LOCAL  = "http://localhost:8055";
const REMOTE = "https://directus-vietnam.onrender.com"; // ← ton URL Render

// ── Tokens statiques (Settings → Utilisateurs → admin → Jeton d'accès) ───────
const LOCAL_TOKEN  = "CBgW_AoUAUanBBo8Pyao8hYzkbYwxvXR"; // local
const REMOTE_TOKEN = "CE5kakBlPwkdhGJlx6srHRreXU9vaUZw";  // Render

const COLLECTIONS = ["categories", "regions", "periodes", "traditions", "sites", "personnages"];

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

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🚀 Migration Directus local → Render\n");

  if (REMOTE_TOKEN === "COLLE_ICI_TON_TOKEN_RENDER") {
    console.error("❌ Remplace REMOTE_TOKEN par ton token Render dans le script !");
    process.exit(1);
  }

  const localToken  = LOCAL_TOKEN;
  const remoteToken = REMOTE_TOKEN;
  console.log("✅ Tokens chargés");

  // 2. Export schéma local
  console.log("\n📐 Export du schéma local...");
  const snapshot = await api(LOCAL, localToken, "GET", "/schema/snapshot");
  if (!snapshot?.data) {
    console.error("❌ Impossible de récupérer le schéma local", snapshot);
    process.exit(1);
  }

  // 3. Calculer le diff sur Render
  console.log("🔍 Calcul du diff schéma...");
  const diff = await api(REMOTE, remoteToken, "POST", "/schema/diff", snapshot.data);
  if (!diff?.data) {
    console.log("ℹ️  Pas de différences de schéma (déjà à jour ?)");
  } else {
    // 4. Appliquer le schéma sur Render
    console.log("⚙️  Application du schéma sur Render...");
    await api(REMOTE, remoteToken, "POST", "/schema/apply", diff.data);
    console.log("✅ Schéma appliqué !");
  }

  // Petite pause pour que Directus indexe les nouvelles collections
  await new Promise(r => setTimeout(r, 3000));

  // 5. Migrer les données collection par collection
  console.log("\n📦 Migration des données...\n");

  for (const col of COLLECTIONS) {
    // Récupérer tous les items locaux
    const localData = await api(LOCAL, localToken, "GET", `/items/${col}?limit=-1`);
    const items = localData?.data;

    if (!Array.isArray(items) || items.length === 0) {
      console.log(`⚠️  ${col} : vide ou introuvable — ignoré`);
      continue;
    }

    console.log(`→ ${col} : ${items.length} item(s) à migrer...`);

    // Nettoyer les IDs pour laisser Render générer les siens
    // (on garde les IDs pour préserver les relations)
    const result = await api(REMOTE, remoteToken, "POST", `/items/${col}`, items);

    if (result?.errors) {
      console.error(`  ❌ Erreur sur ${col}:`, JSON.stringify(result.errors[0], null, 2));
    } else {
      const count = Array.isArray(result?.data) ? result.data.length : "?";
      console.log(`  ✅ ${col} : ${count} item(s) insérés`);
    }
  }

  // 6. Configurer les permissions publiques
  console.log("\n🔓 Configuration des permissions publiques...");

  // Récupérer la policy publique
  const policies = await api(REMOTE, remoteToken, "GET", "/policies?filter[name][_eq]=Public&limit=1");
  const publicPolicy = policies?.data?.[0];

  if (!publicPolicy) {
    console.log("⚠️  Policy publique introuvable — configure manuellement dans Settings → Access Policies → Public");
  } else {
    for (const col of COLLECTIONS) {
      await api(REMOTE, remoteToken, "POST", "/permissions", {
        policy: publicPolicy.id,
        collection: col,
        action: "read",
        fields: ["*"],
      });
    }
    console.log("✅ Permissions publiques READ activées sur toutes les collections !");
  }

  console.log("\n🎉 Migration terminée ! Vérifie https://directus-vietnam.onrender.com/admin\n");
}

main().catch((e) => {
  console.error("💥 Erreur inattendue :", e.message);
  process.exit(1);
});
