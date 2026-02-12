import { FormGroup } from "@angular/forms";
import { AddonHomeExtraParams } from "@model";

export interface MyHomeAddonContent {
  id: number;
  code: string;
  name: string;
  icon: string;
  price: string;
  addedByUsersLabel?: string;
  addButton: string;
  removeButton: string;
  detailsLink: string;
  extraForm?: AddonExtraForm;
  infoAddonModal: InfoAddonModal;
  linkedAddonsModal?: LinkedAddonModal;
  selezionata?: boolean;
  importoMassimaleAssicurato?: number;
  quoteParams?: AddonHomeExtraParams;
}

interface AddonExtraForm {
  type: ExtraFormTypes;
  buildingTypeLabel?: string;
  constructionTypeLabel?: string;
  locationStateLabel?: string;
  title?: string;
  options?: {
    text: string;
    value: string;
  };
  formValue?: {[key:string]: any};
}

export interface MyHomeModal {
  title: string;
  icon: string;
  buttonCancelLabel: string;
}

export interface LinkedAddonModal extends MyHomeModal {
  toggleOption?: {
    code: ToggleOptions;
    name: string;
  };
  descriptionAddonLinkedWith?: string;
  descriptionLinkedAddon?: string;
  addonsPrices?:  {
    name: string;
    price: string;
  };
}

export enum ToggleOptions {
  ADD = 'add',
  REMOVE = 'remove'
}

export interface InfoAddonModal extends MyHomeModal {
  description?: string;
  buttonAddLabel?: string;
  buttonRemoveLabel?: string;
}

export enum ExtraFormTypes {
  DAMAGE_FORM = 'warranty_form_damage',
  CATNAT_FORM = 'warranty_form_cat_nat',
  NONE = 'none'
}

export enum AddonCodes {
  ADDON_ASSISTANCE =      'A',
  ADDON_HOUSE_RC =        'B1',
  ADDON_PRIVATE_LIFE_RC = 'B2',
  ADDON_DAMAGE =          'C',
  ADDON_WATER_DAMAGE =    'C1',
  ADDON_CONTENT_DAMAGE =  'C2',
  ADDON_CATNAT =          'C3'
}

export type LinkedAddon = {
  name: string, 
  price: string, 
  code: string
}
