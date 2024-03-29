import {
    Component,
    ComponentChild,
    ComponentProps,
    SubcomponentInfo,
} from '../components';
import { renderInto } from '../dom';
import { paint } from '../paint';


class BaseMyComponent implements Component {
    static allowComponentChildren = true;
    static subcomponents = {
        'MySubcomponent': '_handleSubcomponent',
    };

    children: ComponentChild[] = [];
    el: HTMLElement;
    options: ComponentProps;
    subcomponentInfos: SubcomponentInfo[] = [];

    constructor(options: ComponentProps) {
        this.options = options;
    }

    render(): this {
        const el = document.createElement('div');

        if (this.children) {
            renderInto(el, paint`${this.children}`);
        } else if (this.subcomponentInfos.length > 0) {
            renderInto(el, paint`${this.subcomponentInfos}`);
        }

        this.el = el;

        return this;
    }

    setComponentChildren(children: ComponentChild[]) {
        this.children = children;
    }

    private _handleSubcomponent(subcomponent: SubcomponentInfo) {
        this.subcomponentInfos.push(subcomponent);

        const el = document.createElement('div');
        el.dataset.subcomponent = subcomponent.name;

        this.children.push(el);
    }
}


export class MyComponent extends BaseMyComponent {
}


export class MyComponent2 extends BaseMyComponent {
}
