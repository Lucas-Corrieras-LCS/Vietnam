const REMOTE = "https://directus-vietnam.onrender.com";
const REMOTE_TOKEN = "28wD7gNDj4MHn3qtQcMOL8VGlE5AvRx1";

async function api(path) {
  const res = await fetch(`${REMOTE}${path}`, {
    headers: { Authorization: `Bearer ${REMOTE_TOKEN}` },
  });
  return res.json();
}

// User complet
const me = await api("/users/me");
console.log("👤 User:", JSON.stringify(me?.data, null, 2));

// Toutes les policies avec admin_access
const policies = await api("/policies?fields=id,name,admin_access,app_access&limit=20");
console.log("\n📋 Policies:", JSON.stringify(policies?.data, null, 2));

// Policies de l'utilisateur
const userId = me?.data?.id;
if (userId) {
  const userPolicies = await api(`/users/${userId}/policies`);
  console.log("\n🔐 User policies:", JSON.stringify(userPolicies?.data, null, 2));
}
