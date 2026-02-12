export enum QuotatorSciStepper {
  NUMERO_ASSICURATI = 'numero_assicurati',
  PER_QUANTO = 'per_quanto',
  PREVENTIVO = 'preventivo',
  DETTAGLIO_COPERTURE = 'dettaglio_coperture',
  DOVE_ANDRAI = 'dove_andrai'
}

export const quotatorGenertelSciSubsteps = [
  QuotatorSciStepper.NUMERO_ASSICURATI,
  QuotatorSciStepper.PER_QUANTO,
  QuotatorSciStepper.PREVENTIVO,
  QuotatorSciStepper.DETTAGLIO_COPERTURE,
  QuotatorSciStepper.DOVE_ANDRAI
];
