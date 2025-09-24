
// Fonction pour compter le nombre d'endpoints n'ayant pas AD
function countEndpointsNoAD(endpoints) {
  if (!Array.isArray(endpoints)) return 0;
  const total = endpoints.length;
  const countWithAD = endpoints.filter(ep => ep.Composites.includes("AD")).length;
  return total - countWithAD;
}

// Fonction pour compter le nombre d'endpoints n'etant pas dans GLPI
function countEndpointsNoGLPI(endpoints) {
  if (!Array.isArray(endpoints)) return 0;
  const total = endpoints.length;
  const countWithGLPI = endpoints.filter(ep => ep.Composites.includes("GLPI")).length;
  return total - countWithGLPI;
}

// Fonction pour compter le nombre d'endpoints n'ayant pas Kaspersky
function countEndpointsNoKaspersky(endpoints) {
  if (!Array.isArray(endpoints)) return 0;
  const total = endpoints.length;
  const countWithKaspersky = endpoints.filter(ep => ep.Composites.includes("Kaspersky")).length;
  return total - countWithKaspersky;
}

export {
  countEndpointsNoAD,
  countEndpointsNoGLPI,
  countEndpointsNoKaspersky
};
