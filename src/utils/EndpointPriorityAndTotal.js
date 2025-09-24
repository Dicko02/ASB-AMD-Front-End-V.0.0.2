// Fonctions pour compter le nombre d'endpoints selon le niveau de dangerosité

function countEndpoints(endpoints) {
  if (!Array.isArray(endpoints)) return 0;
  return endpoints.length;
}

function countLowPriorityEndpoints(endpoints) {
  if (!Array.isArray(endpoints)) return 0;
  return endpoints.filter(ep => ep.criticalLevel === "low").length;
}

function countMediumPriorityEndpoints(endpoints) {
  if (!Array.isArray(endpoints)) return 0;
  return endpoints.filter(ep => ep.criticalLevel === "medium").length;
}

function countHighPriorityEndpoints(endpoints) {
  if (!Array.isArray(endpoints)) return 0;
  return endpoints.filter(ep => ep.criticalLevel === "high").length;
}

function countCriticalPriorityEndpoints(endpoints) {
  if (!Array.isArray(endpoints)) return 0;
  return endpoints.filter(ep => ep.criticalLevel === "critical").length;
}

export {
  countEndpoints,
  countLowPriorityEndpoints,
  countMediumPriorityEndpoints,
  countHighPriorityEndpoints,
  countCriticalPriorityEndpoints
};
