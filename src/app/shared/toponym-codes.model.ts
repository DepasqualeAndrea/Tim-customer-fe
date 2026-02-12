const listTopon = [
  {codDatoAssoluto: 1, descrizione: 'Via', descBrev: 'V.'},
  {codDatoAssoluto: 2, descrizione: 'Viale', descBrev: 'V.LE'},
  {codDatoAssoluto: 3, descrizione: 'Piazza', descBrev: 'P.ZA'},
  {codDatoAssoluto: 4, descrizione: 'Corso', descBrev: 'C.SO'},
  {codDatoAssoluto: 5, descrizione: 'Strada', descBrev: 'STR.'},
  {codDatoAssoluto: 6, descrizione: 'Vicolo', descBrev: 'VICOLO'},
  {codDatoAssoluto: 7, descrizione: 'Contrada', descBrev: 'CONTRADA'},
  {codDatoAssoluto: 8, descrizione: 'Largo', descBrev: 'L.GO'},
  {codDatoAssoluto: 9, descrizione: 'Piazzale', descBrev: 'P.LE'},
  {codDatoAssoluto: 10, descrizione: 'Localita', descBrev: 'LOC.'},
  {codDatoAssoluto: 11, descrizione: 'Salita', descBrev: 'SAL.'},
  {codDatoAssoluto: 12, descrizione: 'Circonvallazione', descBrev: 'CIRC.NE'},
  {codDatoAssoluto: 13, descrizione: 'Traversa', descBrev: 'TRAV.'},
  {codDatoAssoluto: 14, descrizione: 'Borgo', descBrev: 'B.GO'},
  {codDatoAssoluto: 15, descrizione: 'Frazione', descBrev: 'FRAZ.'},
  {codDatoAssoluto: 16, descrizione: 'Lungotevere', descBrev: 'L.TEVERE'},
  {codDatoAssoluto: 17, descrizione: 'Sestriere', descBrev: 'SESTIERE'},
  {codDatoAssoluto: 18, descrizione: 'Villaggio', descBrev: 'VILLAGIO'},
  {codDatoAssoluto: 19, descrizione: 'Piazzetta', descBrev: 'P.TTA'},
  {codDatoAssoluto: 20, descrizione: 'Galleria', descBrev: 'GALL.'},
  {codDatoAssoluto: 21, descrizione: 'Viottolo', descBrev: 'VIOTT'},
  {codDatoAssoluto: 99, descrizione: 'Altro', descBrev: ''},
];

export class ToponymHelper {
  static findToponymCode(string: string): number {
    const toponym = listTopon.find(topon => 
      topon.descrizione === string || topon.descBrev === string
    );
    if (toponym) {
      return toponym.codDatoAssoluto
    }
    else return 99
  }
}