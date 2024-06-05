/**
 * Internal support for crafting and painting instances and components.
 *
 * Version Added:
 *     1.0
 */

import {
    type Component,
    type ComponentChild,
    type ComponentCtr,
    type ComponentProps,
    type SubcomponentInfo,
    componentRegistry,
    isSubcomponentInfo,
} from './components';
import { setProps } from './dom/props';


/**
 * Type for a crafted component or HTML element.
 *
 * Version Added:
 *     1.0
 */
export type CraftedComponent<
    TElement extends HTMLElement = HTMLElement,
    TComponent extends Component<TElement> = Component<TElement>,
> = TComponent | TElement;


/**
 * An item that can be painted to an element.
 *
 * Version Added:
 *     1.0
 */
export type PaintableItem = (
    CraftedComponent |
    ComponentChild |
    Node |
    false
);


/* Type stubs for craftComponent(). */
export function craftComponent(
    nameOrClass: keyof HTMLElementTagNameMap,
    props: ComponentProps,
    ...children: ComponentChild[]
): HTMLElementTagNameMap[typeof nameOrClass];


export function craftComponent<
    TElement extends HTMLElement,
    TComponent extends Component<TElement>,
>(
    nameOrClass: string | ComponentCtr<TComponent>,
    props?: ComponentProps,
    ...children: ComponentChild[]
): TComponent;


/**
 * Craft a component or HTML element.
 *
 * This will instantiate the component or element with any provided
 * properties or children.
 *
 * If crafting a component, the component instance will be instantiated,
 * rendered, and returned.
 *
 * If crafting an HTML element, the Element instance will be returned.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     nameOrClass (string):
 *         The name of the component or HTML element to craft.
 *
 *     props (object):
 *         Properties to pass to the component constructor, or Element
 *         attributes.
 *
 *         If crafting an Ink component, these will be passed to the
 *         constructor.
 *
 *         If crafting an HTML element, these will be set as attributes on the
 *         DOM Element object.
 *
 *     ...children (ComponentChild[]):
 *         Any children to nest within the crafted component.
 *
 *         If crafting a component, then children will not be painted
 *         automatically. It's up to the component to handle each item.
 *
 *         If crafting an HTML element, then children will be painted
 *         automatically.
 *
 *         This is not supported for all components or HTML tags.
 *
 * Returns:
 *     Component or HTMLElement:
 *     The resulting component or HTML Element instance.
 */
export function craftComponent<
    TElement extends HTMLElement,
    TComponent extends Component<TElement, TChild>,
    TTag extends keyof HTMLElementTagNameMap,
    TChild extends ComponentChild,
>(
    nameOrClass: string | TTag | ComponentCtr<TComponent>,
    props: ComponentProps,
    ...children: TChild[]
): CraftedComponent<TElement | HTMLElementTagNameMap[TTag], TComponent> |
   SubcomponentInfo {
    if (typeof nameOrClass === 'string') {
        /* This should be a component name, subcomponent name, or tag name. */
        const ComponentCls =
            componentRegistry.getComponent<TComponent>(nameOrClass);

        if (ComponentCls !== null) {
            return _craftComponentCtr(ComponentCls, nameOrClass, props,
                                      children);
        } else {
            if (nameOrClass.startsWith('.')) {
                /*
                 * This is a shortened subcomponent name. It may be invalid,
                 * but we'll record it.
                 */
                return {
                    children: children,
                    fullName: nameOrClass,
                    funcName: null,
                    isSubcomponent: true,
                    name: nameOrClass.substring(1),
                    props: props || {},
                };
            }

            const registeredSubcomponent =
                componentRegistry.getSubcomponent(nameOrClass);

            if (registeredSubcomponent) {
                return {
                    children: children,
                    fullName: nameOrClass,
                    funcName: registeredSubcomponent.funcName,
                    isSubcomponent: true,
                    name: registeredSubcomponent.name,
                    props: props || {},
                };
            } else {
                return _craftElement(nameOrClass as TTag, props, children);
            }
        }
    } else {
        /* This should be a component class to instantiate. */
        return _craftComponentCtr(nameOrClass, nameOrClass.name, props,
                                  children);
    }
}


/* Type stubs for paintComponent(). */
export function paintComponent<
    TTag extends keyof HTMLElementTagNameMap,
>(
    name: TTag,
    props: ComponentProps,
    ...children: ComponentChild[]
): HTMLElementTagNameMap[TTag];


export function paintComponent<
    TElement extends HTMLElement,
    TComponent extends Component<TElement>,
>(
    name: string | ComponentCtr<TComponent>,
    props?: ComponentProps,
    ...children: ComponentChild[]
): TElement;


/**
 * Paint a component or HTML element.
 *
 * This will craft and then paint a component or HTML element, returning an
 * element that can be inserted into the DOM.
 *
 * If painting a component, the component instance will be instantiated (if
 * not already an instance), rendered to an element, and returned.
 *
 * If painting an HTML element, the Element instance will be returned.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     name (string):
 *         The name of the component or HTML element to craft.
 *
 *     props (object):
 *         Properties to pass to the component constructor, or Element
 *         attributes.
 *
 *         If painting an Ink component, these will be passed to the
 *         constructor.
 *
 *         If painting an HTML element, these will be set as attributes on the
 *         DOM Element object.
 *
 *     ...children (ComponentChild[]):
 *         Any children to nest within the crafted component.
 *
 *         If painting a component, then children will not be painted
 *         automatically. It's up to the component to handle each item.
 *
 *         If painting an HTML element, then children will be painted
 *         automatically.
 *
 *         This is not supported for all components or HTML tags.
 *
 * Returns:
 *     HTMLElement:
 *     The HTML Element instance.
 */
export function paintComponent<
    TElement extends HTMLElement,
    TComponent extends Component<TElement, TChild>,
    TTag extends keyof HTMLElementTagNameMap,
    TChild extends ComponentChild,
>(
    nameOrClass: string | TTag | ComponentCtr<TComponent>,
    props: ComponentProps,
    ...children: TChild[]
): TElement | HTMLElementTagNameMap[TTag] | SubcomponentInfo {
    const component = craftComponent(nameOrClass, props, ...children);

    return (isSubcomponentInfo(component)
            ? component
            : paintCraftedElements([component])[0] as TElement);
}


/**
 * Paint an array of crafted components/elements or children to DOM nodes.
 *
 * This will loop through the items and convert each to an element using the
 * following rules:
 *
 * 1. If it's an element already, it will be used as-is.
 * 2. If it's a string, it will be converted to a :js:class:`Text` node.
 * 3. If it's a component instance, it will be rendered and its element
 *    returned.
 *
 * Note:
 *     This will not craft components to instances.
 *
 *     It's the responsibility of the caller to ensure these are already
 *     instantiated.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     items (PaintableItem or PaintableItem[]):
 *         The item or items to paint.
 *
 * Returns:
 *     Node[]:
 *     The painted nodes to insert into the DOM.
 */
export function paintCraftedElements(
    items: PaintableItem | PaintableItem[],
): Node[] {
    if (!Array.isArray(items)) {
        items = [items];
    }

    const nodes: Node[] = [];

    for (const item of items) {
        if (item === null || item === undefined || item === false) {
            continue;
        }

        if (item instanceof Node) {
            nodes.push(item);
        } else if (typeof item === 'string') {
            nodes.push(document.createTextNode(item));
        } else if (Array.isArray(item)) {
            /*
             * This is the result of an inner paintCraftedElements() call for
             * children of a node. We should have a 1-element array of nodes
             * that we can inline.
             */
            nodes.push(...paintCraftedElements(item));
        } else if (item['el']) {
            nodes.push(item['el']);
        } else {
            console.assert(false, 'Unsupported render item %o', item);
        }
    }

    return nodes;
}


/**
 * Craft a component instance.
 *
 * This will instantiate the component with any provided properties or
 * children, and render it.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     ComponentCls (CompnentCtr):
 *         The class constructor for instantiating the component.
 *
 *     name (string):
 *         The name of the component to craft.
 *
 *     props (object):
 *         Properties to pass to the component constructor.
 *
 *     ...children (ComponentChild[]):
 *         Any children to nest within the crafted component.
 *
 *         Children will not be painted automatically. It's up to the
 *         component to handle each item.
 *
 *         This is not supported for all components. If not supported, an
 *         assertion will be raised.
 *
 * Returns:
 *     Component:
 *     The component instance.
 */
function _craftComponentCtr<
    TElement extends HTMLElement,
    TComponentChild extends ComponentChild,
    TComponent extends Component<TElement, TComponentChild>,
>(
    ComponentCls: ComponentCtr<TComponent>,
    name: string,
    props: ComponentProps,
    children: ComponentChild[],
): TComponent {
    const normProps: ComponentProps = {};
    const normAttrs: ComponentProps = {};
    let normClassName: string = null;

    /*
     * Strip out any props we want to set as attributes on the resulting
     * element, leaving the rest as options for the component.
     */
    if (props) {
        for (const [propKey, propValue] of Object.entries(props)) {
            if (propKey === 'class' || propKey === 'className') {
                normClassName = String(propValue);
            } else if (propKey.startsWith('aria-') ||
                       propKey.startsWith('data-') ||
                       propKey === 'style') {
                normAttrs[propKey] = propValue;
            } else {
                normProps[propKey] = propValue;
            }
        }
    }

    normProps['componentCrafted'] = true;

    /* Create an instance of the component with the normalized props. */
    const component = new ComponentCls(normProps);

    /*
     * Process any children of this component.
     *
     * If there are subcomponents, then they will be provided to the
     * component prior to rendering.
     *
     * If there aren't any, but children are provided, then they'll be
     * passed as children, if the component allows them.
     */
    if (children.length > 0) {
        /* First check if there are any subcomponents included. */
        let foundSubcomponent = false;

        for (const rawChild of children) {
            if (rawChild === null || rawChild === undefined) {
                continue;
            }

            /*
             * We may get a child, or an array of children. We'll need to
             * handle both cases.
             */
            const normChildren = (Array.isArray(rawChild)
                                  ? rawChild
                                  : [rawChild]);

            for (const child of normChildren) {
                if (isSubcomponentInfo(child)) {
                    foundSubcomponent = true;

                    let subcomponentFullName = child.fullName;
                    let subcomponentFuncName = child.funcName;

                    if (subcomponentFullName.startsWith('.')) {
                        /*
                         * This was a shortened, pending subcomponent. We need
                         * to finish resolving it now.
                         */
                        subcomponentFullName =
                            `${name}${subcomponentFullName}`;
                        child.fullName = subcomponentFullName;
                        subcomponentFuncName =
                            ComponentCls.subcomponents[child.name];
                        child.funcName = subcomponentFuncName;
                    } else {
                        subcomponentFuncName = child.funcName;
                    }

                    console.assert(
                        subcomponentFullName.startsWith(name),
                        'Subcomponent %s is not a direct child of %s',
                        subcomponentFullName, name);

                    const func: ((SubcomponentInfo) => void) =
                        component[subcomponentFuncName];

                    console.assert(
                        func,
                        'Component %s is missing subcomponent handler %s',
                        name, subcomponentFuncName);

                    func.call(component, child);
                } else {
                    console.assert(
                        !foundSubcomponent,
                        'Found a non-subcomponent child of %s alongside ' +
                        'subcomponents: %o',
                        name, child);
                }
            }
        }

        if (!foundSubcomponent) {
            if (ComponentCls.allowComponentChildren) {
                const setComponentChildren = component.setComponentChildren;
                console.assert(
                    setComponentChildren,
                    '%s.allowComponentChildren is true, but ' +
                    '%s.setComponentChildren() does not exist!',
                    component.constructor.name);

                setComponentChildren.call(component, children);
            } else {
                console.assert('Component %s does not support children', name);
            }
        }
    }

    /* We can now render the component. */
    component.render();

    /*
     * We can now set the attributes and class name from the props, if
     * provided.
     */
    if (normAttrs) {
        const el = component.el;

        setProps(el, normAttrs);
    }

    if (normClassName) {
        component.el.classList.add(...normClassName.split(/\s+/));
    }

    /* We're done! */
    return component;
}


/**
 * Craft a component instance.
 *
 * This will instantiate the component with any provided properties or
 * children.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     name (string):
 *         The name of the HTML element to craft.
 *
 *     props (object):
 *         Properties to set on the HTMLElement object.
 *
 *         These can be set recursively.
 *
 *     ...children (ComponentChild[]):
 *         Any children to paint and nest within the element.
 *
 *         Children will be painted automatically.
 *
 *         This is not supported for all elements.
 *
 * Returns:
 *     HTMLElement:
 *     The component instance.
 */
function _craftElement<
    TTag extends keyof HTMLElementTagNameMap,
>(
    name: TTag,
    props: ComponentProps,
    children: ComponentChild[],
): HTMLElementTagNameMap[TTag] {
    const el = document.createElement(name);

    if (props) {
        setProps(el, props);
    }

    if (children && children.length > 0) {
        el.append(...paintCraftedElements(children));
    }

    return el;
}
