/**
 * Base class for Spina-based Ink components.
 *
 * Version Added:
 *     1.0
 */

import {
    BaseModel,
    BaseView,
    spina,
} from '@beanbag/spina';
import { dedent } from 'babel-plugin-dedent';

import {
    Component,
    ComponentChild,
    SubcomponentInfo,
} from '../../core';


/**
 * Base options passed into components.
 *
 * Version Added:
 *     1.0
 */
export interface BaseComponentViewOptions {
    /**
     * A flag indicating if this component was crafted.
     *
     * Crafted components are constructed using the ``craft`` or ``paint``
     * tagged templates. They only contain the children provided in the
     * crafting rules.
     *
     * Components can use this to determine whether they can rely on data
     * passed during crafting, or whether they should inspect any child
     * DOM elements instead.
     */
    componentCrafted?: boolean;
}


/**
 * Initial pre-render state for a component.
 *
 * This collects information on the options passed in to the component,
 * any children or subcomponents used during its construction, and any
 * additional information that may be needed to correctly render the
 * component.
 *
 * Version Added:
 *     1.0
 */
export interface InitialComponentState<
    TOptions extends BaseComponentViewOptions,
> {
    /**
     * Whether this component was crafted.
     *
     * Crafted components are expected to fully populate their own
     * component's DOM element tree. If a component is not crafted, it may be
     * based off of an existing tree.
     */
    crafted: boolean;

    /**
     * Any options passed in during construction.
     */
    options: Partial<TOptions>;

    /**
     * Any children provided while crafting the component.
     */
    children?: ComponentChild[];

    /**
     * Any subcomponents provided while crafting the component.
     *
     * This maps subcomponent names to arrays of instances.
     */
    subcomponents: Record<string, SubcomponentInfo[]>;

    /**
     * Any extra state a component wants to store by a component.
     */
    [extraKey: string]: unknown;
}


/**
 * Base class for a Spina-based component.
 *
 * This can be used as a base class for building a component. It takes care
 * of tracking any initial pre-render state from the construction or crafting
 * process, and then helping facilitate the rendering of the component.
 *
 * Version Added:
 *     1.0
 */
export abstract class BaseComponentView<
    TModel extends BaseModel = BaseModel,
    TElement extends HTMLElement = HTMLDivElement,
    TOptions extends BaseComponentViewOptions = BaseComponentViewOptions,
> extends BaseView<
    TModel,
    TElement,
    TOptions
> implements Component {
    /**********************
     * Instance variables *
     **********************/

    /**
     * Initial options passed during construction.
     *
     * These will be removed after initial render.
     */
    protected initialComponentState: InitialComponentState<TOptions> | null;

    /**
     * Initialize the component.
     *
     * This will set up some initial state for the component, used to collect
     * and track state that can be used when rendering the component.
     *
     * Subclasses must call this when overriding this method.
     *
     * Args:
     *     options (object, optional):
     *         Options passed to the component.
     */
    initialize(options: Partial<TOptions> = {}) {
        if (!options) {
            options = {};
        }

        this.initialComponentState = {
            crafted: !!options.componentCrafted,
            options: options,
            subcomponents: {},
        };
    }

    /**
     * Set the direct children for this component.
     *
     * This will be called with the complete list of children when crafting
     * or painting a component.
     *
     * If subcomponents are used, then this will not be called. Instead,
     * the subcomponent handles will be called.
     *
     * This will never be called after rendering the component.
     *
     * Args:
     *     children (Array):
     *         The children passed to the component.
     */
    setComponentChildren(children: ComponentChild[]) {
        const state = this.initialComponentState;

        if (!state) {
            throw Error(
                `${this.constructor.name}.setComponentChildren() cannot ` +
                `be called after the component is rendered.`
            );
        }

        state.children = children;
    }

    /**
     * Helper to record a single instance of a subcomponent.
     *
     * This can be used as a callback in ``subcomponents`` to handle a
     * single instance of a subcomponent. If a second instance of that
     * subcomponent is provided, then this will fail with an error.
     *
     * Args:
     *     subcomponent (object):
     *         Information on the subcomponent.
     */
    protected recordOneSubcomponent(subcomponent: SubcomponentInfo) {
        const state = this.initialComponentState;

        if (!state) {
            throw Error(
                `${this.constructor.name}.recordOneSubcomponent() cannot ` +
                `be called after the component is rendered.`
            );
        }

        const allSubcomponents = state.subcomponents;
        const name = subcomponent.name;

        if (name in allSubcomponents) {
            throw Error(
                `Subcomponent "${name}" cannot be provided more than once.`
            );
        }

        allSubcomponents[name] = [subcomponent];
    }

    /**
     * Helper to record all instances of a subcomponent in an array.
     *
     * This can be used as a callback in ``subcomponents`` to handle
     * recording all instances of a subcomponent for processing.
     *
     * Args:
     *     subcomponent (object):
     *         Information on the subcomponent.
     */
    protected recordAllSubcomponents(subcomponent: SubcomponentInfo) {
        const state = this.initialComponentState;

        if (!state) {
            throw Error(
                `${this.constructor.name}.recordAllSubcomponents() cannot ` +
                `be called after the component is rendered.`
            );
        }

        const allSubcomponents = state.subcomponents;
        let subcomponents: SubcomponentInfo[];

        if (subcomponent.name in allSubcomponents) {
            subcomponents = allSubcomponents[subcomponent.name];
        } else {
            subcomponents = [];
            allSubcomponents[subcomponent.name] = subcomponents;
        }

        subcomponents.push(subcomponent);
    }

    /**
     * Handle the initial render of the component.
     *
     * This is meant to be overridden by subclasses to handle rendering the
     * component based on any collected state.
     *
     * Once rendered, the :js:attr:`initialComponentState` will be discarded.
     *
     * Subclasses do not need to call the parent method.
     */
    protected onComponentInitialRender() {
        /* Intentionally empty. */
    }

    /**
     * Handle the initial render of the view.
     *
     * This will call :js:func:`onComponentInitialRender` and then clear any
     * initial pre-render state.
     *
     * This should not be overridden by subclasses.
     */
    protected onInitialRender() {
        this.onComponentInitialRender();

        this.initialComponentState = null;
    }
}
