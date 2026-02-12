import { Constraints } from './constraints.model';

export class Rule {
    name: string;
    enabled: boolean;
    constraints: Constraints;
}