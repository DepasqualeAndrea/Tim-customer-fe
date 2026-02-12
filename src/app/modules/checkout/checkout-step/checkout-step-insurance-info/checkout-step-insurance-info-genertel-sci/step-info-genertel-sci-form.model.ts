import { City, State } from '@model';

export enum SelectDateFormOptions {
  INSTANT = 'instant',
  SELECTABLE = 'selectable'
}

export class InsuranceHolderFormLocation {
  states: State[];
  cities: City[];
  fiscalCode: string;
  insuredIsContractor: boolean;
  ageRange: 'OVER_50' | 'UNDER_50';
  constructor() {
    this.cities = [];
    this.states = [];
    this.fiscalCode = '';
    this.insuredIsContractor = false;
  }
}

export const professions = [
  'AGENTE / RAPPRESENTANTE DI COMMERCIO'
  , 'AGRICOLTORE'
  , 'ALTRE ATTIVITA\' PROFESSIONALI'
  , 'ARCHITETTO / INGEGNERE'
  , 'ARTIGIANO'
  , 'AUTORE'
  , 'AVVOCATO'
  , 'BENESTANTE / POSSIDENTE'
  , 'CASALINGA'
  , 'CLERO E ALTRI MINISTRI DI CULTO'
  , 'COMMERCIALISTA / CONSULENZA CONTABILE'
  , 'COMMERCIANTE'
  , 'CONSULENTE DEL LAVORO'
  , 'DIPLOMATICO'
  , 'DIRIGENTE'
  , 'DISOCCUPATO'
  , 'FORZE DELL\'ORDINE'
  , 'IMPIEGATO'
  , 'IMPRENDITORE'
  , 'INSEGNANTE'
  , 'LAV. AUTONOMO'
  , 'MAGISTRATO'
  , 'MEDICO'
  , 'NOTAIO'
  , 'OPERAIO'
  , 'PENSIONATO'
  , 'PERITO'
  , 'POLITICO (SENATORE / DEPUTATO)'
  , 'QUADRO'
  , 'SOCI COLLABORATORI IN COOPERATIVE'
  , 'STUDENTE'
];
