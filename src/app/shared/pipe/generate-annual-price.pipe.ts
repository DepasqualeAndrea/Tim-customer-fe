import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "generateAnnualPrice",
})
export class GenerateAnnualPricePipe implements PipeTransform {
  transform(value: string): number {
    if (!value) return 0;

    const numberValue = parseFloat(value.replace(",", "."));

    if (isNaN(numberValue)) return 0;

    const res = numberValue * 12;

    return res;
  }
}
