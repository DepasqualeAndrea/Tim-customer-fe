import {AgeSelection} from './age-selector.model';
import {OrderAttributes} from '@model';


export class AgeSelectorHelper {

  private static displayFn = item => item.quantity ? `${item.quantity} ${item.descriptionLabel}` : '';

  static findAges(ageList: AgeSelection[], id: string) {
    return ageList.find(s => s.id === id);
  }

  static sumAges(ageList: AgeSelection[]) {
    return ageList.reduce((acc, cur) => acc + cur.quantity, 0);
  }

  static toOrderAttributes(ageList: AgeSelection[]): OrderAttributes {
    return {
      number_of_insureds_25: AgeSelectorHelper.findAges(ageList, 'number_of_insureds_25')?.quantity,
      number_of_insureds_50: AgeSelectorHelper.findAges(ageList, 'number_of_insureds_50')?.quantity,
      number_of_insureds_60: AgeSelectorHelper.findAges(ageList, 'number_of_insureds_60')?.quantity,
      number_of_insureds_65: AgeSelectorHelper.findAges(ageList, 'number_of_insureds_65')?.quantity
    };
  }

  static toString(ageList: AgeSelection[]) {
    return ageList.map(AgeSelectorHelper.displayFn).join(' ');
  }


}
