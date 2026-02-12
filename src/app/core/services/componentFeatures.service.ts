import { Injectable } from '@angular/core';
import { ComponentFeatures } from '../models/componentfeatures/componentfeatures.model';
import { Rules } from '../models/componentfeatures/rules.model';
import { Rule } from '../models/componentfeatures/rule.model';
import { Component } from '../models/componentfeatures/component.model';
import { runInThisContext } from 'vm';

@Injectable({
    providedIn: 'root'
})
export class ComponentFeaturesService {
    private features: ComponentFeatures;
    private component: Component = null;
    private currentRule: Rule = null;

    setComponentFeatures(features: ComponentFeatures) {
        this.features = features;
    }

    useComponent(componentName: string) {
        this.component = this.getComponent(componentName);
    }

    getComponent(componentName: string): Component {
        let selected: Component = null;
        if (!!this.features?.components) {
            this.features.components.forEach(comp => {
                if (comp.name === componentName)
                    selected = comp;
            });
            return selected;
        }
    }

    getComponentNames(): string[] {
        return this.features.components.map(c => c.name);
    }

    useRule(ruleName: string) {
        this.currentRule = null;
        if (!!this.component) {
            this.currentRule = this.getRule(ruleName);
        }
    }
    getRule(ruleName: string, c: Component = this.component): Rule {
        const rule: Rule = c.rules.find(r => r.name === ruleName);
        return !!rule ? rule : null;
    }


    getRuleNames(): string[] {
        if (this.component == null)
            return [];

        return this.component.rules.map<string>((rule: Rule) => rule.name);
    }

    getRules(c: Component = this.component): Rules {
        return c.rules;
    }

    isRuleEnabled(r: Rule = this.currentRule): boolean {
        return r && r.enabled;
    }

    getConstraints(r: Rule = this.currentRule): Map<string, any> {
        if (this.isRuleEnabled(r)) {
            const resultMap: Map<string, any> = new Map<string, any>();
            r.constraints.forEach(constraint => {
                resultMap.set(constraint.name, constraint.value);
            })
            return resultMap;
        }

        return new Map<string, any>();
    }
}