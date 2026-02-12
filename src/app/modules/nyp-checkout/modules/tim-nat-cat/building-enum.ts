export enum MaterialeDiCostruzione {
  Muratura = 1,
  CementoArmato = 2,
  Acciaio = 3,
  NonConosciutoAltro = 4
}
export enum AnnoDiCostruzione {
  FinoAl1950 = 1,
  Dal1950Al1990 = 2,
  DopoIl1990 = 3,
  NonConosciuto = 4
}
export enum NumeroPianiEdificio {
  TreOpiu = 1,
  ZeroDue = 2
}
export enum PianoPiuBassoOccupato {
  PrimoPiano = 1,
  SuperioriAlPrimo = 2,
  PianoTerra = 3,
  Scantinato = 4
}