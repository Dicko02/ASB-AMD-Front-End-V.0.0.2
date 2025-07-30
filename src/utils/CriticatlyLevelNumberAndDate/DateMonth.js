function getMonth(dateString) {
  const date = new Date(dateString);

  // Vérification que la date est valide
  if (isNaN(date)) {
    console.error("Date invalide :", dateString);
    return "inconnu";
  }

  const monthNumber = date.getUTCMonth() + 1;
  let Month;

  switch (monthNumber) {
    case 1:
      Month = "janvier";
      break;
    case 2:
      Month = "fevrier";
      break;
    case 3:
      Month = "mars";
      break;
    case 4:
      Month = "avril";
      break;
    case 5:
      Month = "mai";
      break;
    case 6:
      Month = "juin";
      break;
    case 7:
      Month = "juillet";
      break;
    case 8:
      Month = "aout";
      break;
    case 9:
      Month = "septembre";
      break;
    case 10:
      Month = "octobre";
      break;
    case 11:
      Month = "novembre";
      break;
    case 12:
      Month = "decembre";
      break;
    default:
      Month = "inconnu"; // 🟢 Corrigé ici
      console.warn("Mois inconnu pour la date :", dateString);
  }

  return Month;
}

export default getMonth;
