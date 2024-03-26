/**
 * Support for crafting instances and trees of components.
 *
 * Version Added:
 *     1.0
 */

import htm from 'htm/mini';

import {
    Component,
    ComponentChild,
    ComponentCtr,
    ComponentProps,
    SubcomponentInfo,
    componentRegistry,
    isSubcomponentInfo,
} from './components';
import { setProps } from './dom';
import { paintCraftedElements } from './paint';


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
 * An item to craft, when crafting a tree of components.
 *
 * Version Added:
 *     1.0
 */
export interface CraftComponentItem {
    /**
     * The name of the component or HTML element to craft.
     */
    name: string;

    /**
     * Properties to pass to the component constructor, or Element attributes.
     *
     * If crafting an Ink component, these will be passed to the constructor.
     *
     * If crafting an HTML element, these will be set as attributes on the
     * DOM Element object.
     */
    props?: ComponentProps;

    /**
     * Any children to nest within the crafted component.
     *
     * If crafting a component, then children will not be painted
     * automatically. It's up to the component to handle each item.
     *
     * If crafting an HTML element, then children will be painted
     * automatically.
     *
     * This is not supported for all components or HTML tags.
     */
    children?: ComponentChild[];
}


/**
 * Utility interface for typing craft functions.
 *
 * This is used internally by :js:func:`craft`.
 *
 * Version Added:
 *     1.0
 */
interface CraftFunction {
    <TResult extends (CraftedComponent<HTMLElement, Component> |
                      CraftedComponent<HTMLElement, Component>[])>(
        strings: TemplateStringsArray | string[],
        ...values: unknown[]
    ): TResult;
}


/* Type stubs for craftComponent(). */
export function craftComponent(
    name: keyof HTMLElementTagNameMap,
    props: ComponentProps,
    ...children: ComponentChild[]
): HTMLElementTagNameMap[typeof name];


export function craftComponent<
    TElement extends HTMLElement,
    TComponent extends Component<TElement>,
>(
    name: string,
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
 *     name (string):
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
    name: string | TTag,
    props: ComponentProps,
    ...children: TChild[]
): CraftedComponent<TElement | HTMLElementTagNameMap[TTag], TComponent> |
   SubcomponentInfo {
    const ComponentCls = componentRegistry.getComponent<TComponent>(name);

    if (ComponentCls !== null) {
        return _craftComponentCtr(ComponentCls, name, props, children);
    } else {
        const registeredSubcomponent = componentRegistry.getSubcomponent(name);

        if (registeredSubcomponent) {
            return {
                children: children,
                fullName: name,
                funcName: registeredSubcomponent.funcName,
                isSubcomponent: true,
                name: registeredSubcomponent.name,
                props: props || {},
            };
        } else {
            return _craftElement(name as TTag, props, children);
        }
    }
}


/**
 * Template tag for crafting components using an HTML-like language.
 *
 * See https://github.com/developit/htm for details on usage.
 *
 * Results will be component or :js:class:`HTMLElement` instances. Callers
 * can specify a more precise type as a generic.
 *
 * Version Added:
 *     1.0
 */
export const craft: CraftFunction = htm.bind(craftComponent) as CraftFunction;


/**
 * Craft an array of components.
 *
 * This will craft each component item, returning an array with each
 * resulting populated component in the order specified.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     items (Array of object):
 *         The component information items.
 *
 * Returns:
 *     Array:
 *     The resulting crafted components.
 */
export function craftComponents(
    items: CraftComponentItem[],
): CraftedComponent<HTMLElement, Component>[] {
    return items.map(item => craftComponent(item.name,
                                            item.props || {},
                                            ...(item.children || [])));
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

                    const subcomponentFullName = child.fullName;
                    const subcomponentFuncName = child.funcName;

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
