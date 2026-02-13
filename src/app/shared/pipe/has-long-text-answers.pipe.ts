import { Pipe, PipeTransform } from '@angular/core';
import { Answer } from 'app/modules/nyp-checkout/models/api.model';

@Pipe({
    name: 'hasLongTextAnswers',
    standalone: false
})
export class HasLongTextAnswersPipe implements PipeTransform {

  transform(answers: Answer[]): boolean {
    if(answers && answers.length){
      return answers.filter(answer => answer.value?.length > 2).length > 0;
    }
    return false;
  }

}
