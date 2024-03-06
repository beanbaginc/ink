/**
 * Support for defining, registering, and accessing components.
 *
 * Version Added:
 *     1.0
 */


/**
 * Type for a child of a component.
 *
 * Version Added:
 *     1.0
 */
export type ComponentChild = (
    Node |
    Node[] |
    string |
    Component |
    SubcomponentInfo
)


/**
 * A mapping of names to values for a component's properties.
 *
 * These are all properties that may be set when crafting the component,
 * and are passed to the component during construction.
 *
 * Version Added:
 *     1.0
 */
export type ComponentProps = Record<string, unknown>;


/**
 * A mapping of subcomponent names to handler function names.
 *
 * Version Added:
 *     1.0
 */
export type Subcomponents = Record<string, string>;


/**
 * Information on a parsed subcomponent.
 *
 * This is set when crafting a subcomponent, and can be used by components
 * to validate and handle the subcomponent.
 *
 * Version Added:
 *     1.0
 */
export interface SubcomponentInfo {
    /**
     * Any children of the subcomponent.
     */
    children: ComponentChild[];

    /**
     * The full name of the subcomponent.
     *
     * This contains the component's name as a prefix.
     */
    fullName: string;

    /**
     * The name of the handler function that would be invoked on the component.
     */
    funcName: string;

    /**
     * A flag indicating that this is subcomponent information.
     *
     * This aids in lookup and type checking.
     */
    isSubcomponent: true;

    /*
     * The partial name of the subcomponent.
     *
     * This won't include the component's name as a prefix.
     */
    name: string;

    /**
     * Any properties set on the subcomponent.
     */
    props: ComponentProps;
}


/**
 * Type for a component.
 *
 * Version Added:
 *     1.0
 */
export interface Component<
    TElement extends Element = HTMLElement,
    TChild extends ComponentChild = ComponentChild,
>{
    /**
     * An element representing the root of the component.
     */
    el: TElement;

    /**
     * A function for rendering the component.
     *
     * Returns:
     *     Component:
     *     The component instance, for chaining.
     */
    render(): this;

    /**
     * Set children on the component.
     *
     * This is optional, and dependent on the component. It's used when
     * painting or crafting components with children.
     *
     * Args:
     *     children (ComponentChild):
     *         The children to set.
     */
    setComponentChildren?(children: TChild[]);
}


/**
 * Type for a constructor for a component.
 *
 * Version Added:
 *     1.0
 */
export interface ComponentCtr<
    TComponent extends Component = Component,
> {
    /**
     * Constructor function for the component.
     *
     * Args:
     *     ...args (unknown[]):
     *         Any arguments passed to the component's constructor.
     */
    new (...args: unknown[]): TComponent;

    /**
     * Whether the component allows arbitrary children.
     */
    allowComponentChildren?: boolean;

    /**
     * A mapping of subcomponent names to handler functions.
     */
    subcomponents?: Subcomponents;
}


/**
 * A component tracked in the registry.
 *
 * Version Added:
 *     1.0
 */
export interface RegisteredSubcomponent {
    /**
     * The parent component's class.
     */
    parentComponentClass: ComponentCtr;

    /**
     * The name of the subcomponent.
     *
     * This will not contain the parent component's name as a prefix.
     */
    name: string;

    /**
     * The name of the function that handles this subcomponent.
     *
     * This function must be present on the parent component.
     */
    funcName: string;
}


/**
 * A registry for managing components.
 *
 * This takes care of storing the components registered and allows for
 * retrieval by name.
 *
 * Version Added:
 *     1.0
 */
export class ComponentRegistry {
    /**
     * The map of component names to component classes.
     */
    components: Record<string, ComponentCtr> = {};

    /**
     * The map of full subcomponent names to subcomponent information.
     */
    subcomponents: Record<string, RegisteredSubcomponent> = {};

    /**
     * Return a registered component with the given name.
     *
     * Args:
     *     name (string):
     *         The name of the component.
     *
     * Returns:
     *     Component:
     *     The component, if found.
     *
     *     If the component was not registered, this will return ``null``.
     */
    getComponent<
        TComponent extends Component,
    >(
        name: string,
    ): ComponentCtr<TComponent> | null {
        return (this.components[name] as ComponentCtr<TComponent>) ?? null;
    }

    /**
     * Return a subcomponent with the specified name.
     *
     * Args:
     *     name (string):
     *         The full subcomponent name.
     *
     * Returns:
     *     RegisteredSubcomponent:
     *     The subcomponent information, if found.
     *
     *     If the subcomponent was not registered, this will return ``null``.
     */
    getSubcomponent(
        name: string,
    ): RegisteredSubcomponent | null {
        return this.subcomponents[name] ?? null;
    }

    /**
     * Register a component.
     *
     * Args:
     *     component (ComponentCtr):
     *         The component to register.
     *
     *     name (string):
     *         The name of the component.
     *
     *         This should generally be vendor-prefixed.
     */
    register(
        componentClass: ComponentCtr,
        name: string,
    ) {
        const components = this.components;

        /*
         * Note that we'll allow reloading if running in Storybook. This is
         * necessary so that HMR doesn't trigger assertion errors while setting
         * up a Story after an edited module has been saved and reloaded.
         */
        console.assert(
            !components.hasOwnProperty(name) || window['IS_STORYBOOK'],
            `Component ${name} is already registered.`);

        components[name] = componentClass;

        if (componentClass.subcomponents) {
            const subcomponents = this.subcomponents;
            const subcomponentEntries =
                Object.entries(componentClass.subcomponents);

            for (const [subcomponentName, funcName] of subcomponentEntries) {
                subcomponents[`${name}.${subcomponentName}`] = {
                    funcName: funcName,
                    name: subcomponentName,
                    parentComponentClass: componentClass,
                };
            }
        }
    }

    /**
     * Unregister a component.
     *
     * Args:
     *     name (string):
     *         The name of the component to unregister.
     */
    unregister(name: string) {
        const components = this.components;
        const componentClass = components[name];

        console.assert(componentClass !== undefined,
                       `Component ${name} was not registered.`);

        if (componentClass.subcomponents) {
            const subcomponents = this.subcomponents;
            const subcomponentEntries =
                Object.keys(componentClass.subcomponents);

            for (const subcomponentName of subcomponentEntries) {
                delete subcomponents[`${name}.${subcomponentName}`];
            }
        }

        delete components[name];
    }
}


/**
 * Decorator to register a component.
 *
 * This takes an explicit name for the component and registers it so it
 * can be accessed, crafted, and painted.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     name (string):
 *         The name of the component.
 *
 *         This should generally be vendor-prefixed.
 *
 * Returns:
 *     Function:
 *     The decorator function for the class.
 */
export function inkComponent<
    TComponent extends ComponentCtr,
>(
    name: string,
): (component: TComponent) => TComponent | void {
    return function(component: TComponent) {
        componentRegistry.register(component, name);
    };
}


/**
 * Return whether an object is a parsed subcomponent.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     subcomponentInfo (object):
 *         The object that may be a parsed subcomponent.
 *
 * Returns:
 *     boolean:
 *     ``true`` if the object is a parsed subcomponent. ``false`` if it is not.
 */
export function isSubcomponentInfo(
    subcomponentInfo: unknown
): subcomponentInfo is SubcomponentInfo {
    return subcomponentInfo['isSubcomponent'] === true;
}


/**
 * The main registry for components.
 *
 * Version Added:
 *     1.0
 */
export const componentRegistry = new ComponentRegistry();
