import { PreventivatoreAbstractStateReducer } from './preventivatore-abstract-state-reducer';
import { PreventivatoreStateReducer } from './preventivatore-state-reducer';
import { PreventivatoreDynamicState } from './preventivatore-dynamic-state.model';

export class PreventivatoreBaggageLossStateReducer extends PreventivatoreAbstractStateReducer implements PreventivatoreStateReducer {

  constructor() {
    super();
  }

  getInitialState() {
    this.state = this.getEmptyState();
    return this.state;
  }

  private getEmptyState(): PreventivatoreDynamicState {
    return {
      component1: null,
      component2: null,
      component3: null,
      component4: null,
      component5: null,
      component6: null
    };
  }

  reduce(actionName: string, payload: any) {
    switch (actionName) {
      case 'date64Received':
        this.state = this.date64Received(this.state, payload);
        break;
      case 'bookingId64Received':
        this.state = this.bookingID64Received(this.state, payload);
        break;
    }

    return super.common(actionName, payload);

  }

  private date64Received(state: PreventivatoreDynamicState, payload: any) {
    const dateBase64 = payload.dateBase64;
    if (!dateBase64) {
      state.component1.products.forEach(product => {
        const selected_values = Object.assign(product.selected_values);
        product.selected_values = selected_values;
        selected_values.dates_from_url = false;
      });
      return state;
    }
    const decodedDate = this.decodeBase64String(dateBase64);
    const dates = decodedDate.split('|');
    const fromDate = this.getDateFromUrlDateParam(dates[0]);
    const toDate = this.getDateFromUrlDateParam(dates[1]);

    state.component1.products.forEach(product => {
      const selected_values = Object.assign({}, product.selected_values);
      product.selected_values = selected_values;
      selected_values.dates_from_url = true;
      selected_values.fromDate = fromDate;
      selected_values.toDate = toDate;
    });
    return state;
  }

  private bookingID64Received(state: PreventivatoreDynamicState, payload: any) {
    const bookingIdBase64 = payload.bookingIdBase64;
    if (!bookingIdBase64) {
      state.component1.products.forEach(product => {
        const selected_values = Object.assign(product.selected_values);
        product.selected_values = selected_values;
        selected_values.booking_id_from_url = false;
      });
      return state;
    }

    const decodedBookingId = this.decodeBase64String(bookingIdBase64);
    state.component1.products.forEach(product => {
      const selected_values = Object.assign({}, product.selected_values);
      product.selected_values = selected_values;
      selected_values.booking_id_from_url = true;
      selected_values.booking_id = decodedBookingId;
    });
    return state;
  }

  decodeBase64String(dateBase64: string): string {
    return atob(dateBase64);
  }

  getDateFromUrlDateParam(dateString: string): Date {
    const newDate = new Date(dateString);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  public getStringFromDate(date: Date) {
    let day = date.getDate().toString();
    if (day.length === 1) {
      day = '0' + day;
    }
    let month = (date.getMonth() + 1).toString();
    if (month.length === 1) {
      month = '0' + month;
    }
    const formattedDate = date.getFullYear() + '-' + month + '-' + day;
    return formattedDate;
  }

  getState() {
    return this.state;
  }

}
