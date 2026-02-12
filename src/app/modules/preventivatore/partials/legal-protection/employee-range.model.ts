export class Range {

    constructor(range: string) {
        this.presentation = range;
        const rangeValues = this.presentation.split('-');
        this.rangeMin = +rangeValues[0];
        this.rangeMax = +rangeValues[1];
    }
    presentation: string;
    rangeMax?: number;
    rangeMin?: number;
}

