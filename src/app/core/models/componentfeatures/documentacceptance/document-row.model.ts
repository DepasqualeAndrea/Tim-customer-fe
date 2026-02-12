import { ContentElement } from './content-element.model';

export class DocumentRow {
    classNames: string;
    rowName: string;
    enabled: boolean = true;
    elements: ContentElement[];
}
