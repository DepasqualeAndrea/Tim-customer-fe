import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cy'
})

export class CyPipe implements PipeTransform {
  constructor() { }
  transform(block, element, ...params): string {
    if(!block || block.length === 0)
      return '';

    const attribute = block.concat(
      '__',
      this.formatString(element),
      '-',
    );
    return attribute.concat(params.join('-'));
  }

  formatString(string: string) {
    if (!string) {
      return '';
    }
    return string
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toString()
      .toLowerCase()
      .replace(/\s/g, '-').replace(/_/g, '-');
  }

}
