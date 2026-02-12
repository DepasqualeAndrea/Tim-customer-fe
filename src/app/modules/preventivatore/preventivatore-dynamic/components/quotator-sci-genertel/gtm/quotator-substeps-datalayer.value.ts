import { QuotatorSciStepper } from "../quotator-sci-stepper";

export const dataLayerSciSubsteps = [
  {
    step: QuotatorSciStepper.NUMERO_ASSICURATI,
    value: {
      vpv: '/preventivatore/diretto/sci/persone-da-assicurare',
      vpvt: 'Preventivatore Sci - Persone da Assicurare'
    }
  },
  {
    step: QuotatorSciStepper.PER_QUANTO,
    value: {
      vpv: '/preventivatore/diretto/sci/durata-assicurazione',
      vpvt: 'Preventivatore Sci - Durata Assicurazione'
    }
  },
  {
    step: QuotatorSciStepper.PREVENTIVO,
    value: {
      vpv: '/preventivatore/diretto/sci/proposta-preventivo',
      vpvt: 'Preventivatore Sci - Proposta Preventivo'
    }
  },
  {
    step: QuotatorSciStepper.DETTAGLIO_COPERTURE,
    value: {
      vpv: '/preventivatore/diretto/sci/coperture-sci-plus',
      vpvt: 'Preventivatore Sci - Coperture Sci Plus'
    }
  },
  {
    step: QuotatorSciStepper.DOVE_ANDRAI,
    value:  {
      vpv: '/preventivatore/diretto/sci/dove-andrai',
      vpvt: 'Preventivatore Sci - Dove Andrai'
    }
  }
];
