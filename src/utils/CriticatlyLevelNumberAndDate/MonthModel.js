class Mois {
  constructor({
    nom = "",
    low = 0,
    medium = 0,
    high = 0,
    critical = 0
  }) {
    this.nom = nom;
    this.low = low;
    this.medium = medium;
    this.high = high;
    this.critical = critical;
  }
}

export default Mois;
