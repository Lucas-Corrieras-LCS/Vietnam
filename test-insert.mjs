const REMOTE = "https://directus-vietnam.onrender.com";
const REMOTE_TOKEN = "Gh54dIHPD_Fbw2qXi2YkyntxfcGZ57po";

async function api(method, path, body) {
  const res = await fetch(`${REMOTE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${REMOTE_TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// Test 1 : champs existants dans regions ?
const fields = await api("GET", "/fields/regions");
console.log("Champs regions:", fields?.data?.map(f => f.field).join(", "));

// Test 2 : insertion minimale
const test = await api("POST", "/items/regions", { nom: "Test Region" });
console.log("\nInsertion minimale:", JSON.stringify(test, null, 2));
