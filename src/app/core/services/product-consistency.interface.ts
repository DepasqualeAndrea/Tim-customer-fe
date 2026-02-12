export interface Consistency {
  line_state?: string;
  service?: string;
  service_date?: string;
  offer_code?: string;
  target?: string;
}

export enum ConsistencyTarget {
  TIM = 'tim',
  MY_BROKER = 'timmybroker',
  BOTH = 'all'
}

export enum ConsistencyValue {
  TRUE = 'true',
  FALSE = 'false'
}