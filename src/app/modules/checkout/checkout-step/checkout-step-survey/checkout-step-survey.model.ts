import {AccetableAnswers, CheckoutProduct} from '../../checkout.model';

export interface CheckoutSurveyProduct extends CheckoutProduct {
  answers: AccetableAnswers[];
  requireAcknowledgmentQuestion: boolean | undefined;
}
