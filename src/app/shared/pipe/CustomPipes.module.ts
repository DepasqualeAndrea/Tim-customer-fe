import { KenticoUnknownPipe } from "./kentico-unknown.pipe";
import { NgModule } from '@angular/core';
import { KenticoEmptyPipe } from './kentico-empty.pipe';
import { ToFormattedDatePipe } from './to-formatted-date.pipe';
import { ControlIsInvalidPipe } from './control-is-invalid.pipe';
import { FormControlErrorMessagesPipe } from './form-control-error-messages.pipe';
import { HasLongTextAnswersPipe } from './has-long-text-answers.pipe';
import { GenerateAnnualPricePipe } from './generate-annual-price.pipe';

@NgModule({
    declarations: [
        KenticoUnknownPipe,
        KenticoEmptyPipe,
        ToFormattedDatePipe,
        ControlIsInvalidPipe,
        FormControlErrorMessagesPipe,
        HasLongTextAnswersPipe,
        GenerateAnnualPricePipe
    ],
    imports: [],
    exports: [
        KenticoUnknownPipe,
        KenticoEmptyPipe,
        ToFormattedDatePipe,
        ControlIsInvalidPipe,
        FormControlErrorMessagesPipe,
        HasLongTextAnswersPipe,
        GenerateAnnualPricePipe
    ]
})
export class CustomPipeModule {}