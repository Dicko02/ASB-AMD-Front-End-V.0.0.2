import countEndpoints from "./EndpointPriorityLevelNumber/EndpointTotalNumber";

async function PercentageConvertion(criticalLevelTotalNumber) {
    const endpointsTotalNumber = await countEndpoints();
    const criticalLevelPercentage = (criticalLevelTotalNumber / endpointsTotalNumber) * 100;
    return criticalLevelPercentage.toFixed(2); // Retourne le pourcentage avec 2 décimales
}

export default PercentageConvertion;