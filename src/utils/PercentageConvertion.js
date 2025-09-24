
async function PercentageConvertion(criticalLevelTotalNumber, endpointsTotalNumber) {
    const criticalLevelPercentage = (criticalLevelTotalNumber / endpointsTotalNumber) * 100;
    return criticalLevelPercentage.toFixed(2); // Retourne le pourcentage avec 2 décimales
}

export default PercentageConvertion;