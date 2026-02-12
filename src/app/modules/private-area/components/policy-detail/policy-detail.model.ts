export enum PolicyUpdateItem {
  APPLIANCES
}

export interface PolicyUpdateEvent {
  item: PolicyUpdateItem;
  value: any;
}
