/**
 * A base class for a component working as a menu drop-down handle.
 *
 * Version Added:
 *     1.0
 */

import {
    type BaseModel,
} from '@beanbag/spina';

import {
    type SubcomponentInfo,
    craft,
} from '../../core';
import {
    type MenuItemsCollection,
} from '../collections/menuItemsCollection';
import {
    type BaseComponentViewOptions,
    BaseComponentView,
} from './baseComponentView';
import { MenuView } from './menuView';


/**
 * The direction in which a menu will open from the handle.
 *
 * Menu handles compute this automatically, based on available screen space.
 *
 * Version Added:
 *     1.0
 */
export enum MenuHandleOpenDirection {
    /** The menu opens in an up direction. */
    UP = 'up',

    /** The menu opens in a down direction. */
    DOWN = 'down',
}


/**
 * Options for building a menu for a menu handle.
 *
 * Version Added:
 *     1.0
 */
export interface BuildMenuOptions {
    /** The element that controls the menu. */
    controllerEl: HTMLElement;

    /**
     * The CSS class name for the menu.
     */
    menuClassName: string;

    /**
     * An ARIA label for the menu.
     *
     * If not provided, the ``menuAriaLabel`` set for the option will be
     * used. If that's not provided, the text "Menu" will be used.
     */
    menuAriaLabel?: string;

    /**
     * An ID for the menu.
     *
     * If not provided, one will be generated.
     */
    menuID?: string;

    /** Whether the menu should open when hovering over the controller. */
    openOnHover?: boolean;
}


/**
 * Options for BaseMenuHandleView.
 *
 * Version Added:
 *     1.0
 */
export interface BaseMenuHandleViewOptions extends BaseComponentViewOptions {
    /**
     * An ARIA label to apply to the menu.
     */
    menuAriaLabel?: string;

    /**
     * A list of menu items.
     *
     * Each will be passed to :js:meth:`RB.MenuView.addItem` If not provided,
     * explicit items should be added to the menu.
     */
    menuItems?: MenuItemsCollection;
}


/**
 * Base class for components that work as a drop-down menu handle.
 *
 * This contains the base logic for managing a menu, including its menu items
 * and open state. Subclasses can build upon this to control the rendering
 * of the menu handle, while leveraging standard behavior and accessibility
 * for the menu.
 *
 * Version Added:
 *     1.0
 */
export abstract class BaseMenuHandleView<
    TModel extends BaseModel = BaseModel,
    TElement extends HTMLElement = HTMLDivElement,
    TOptions extends BaseMenuHandleViewOptions = BaseMenuHandleViewOptions,
> extends BaseComponentView<
    TModel,
    TElement,
    TOptions
> {
    static allowComponentChildren = true;
    static subcomponents = MenuView.subcomponents;

    /**********************
     * Instance variables *
     **********************/

    /** The menu associated with the handle. */
    menuView: MenuView | null = null;

    /** The direction that the menu will open. */
    private _openDirection = MenuHandleOpenDirection.DOWN;

    /**
     * Return the menu items collection for the drop-down menu.
     *
     * This can be used to fetch or manipulate the items in the menu.
     *
     * Returns:
     *     MenuItemsCollection:
     *     The collection of menu items.
     */
    get menuItems(): MenuItemsCollection {
        return this.menuView.menuItems;
    }

    /**
     * Whether the menu can be opened.
     *
     * Subclasses can override this to only allow opening a menu based on
     * a disabled state or similar.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the menu is allowed to be opened. ``false`` if it is
     *     not.
     */
    canOpenMenu(): boolean {
        return true;
    }

    protected buildMenu(
        options: BuildMenuOptions,
    ): MenuView {
        const state = this.initialComponentState;
        const componentOptions = state.options;
        const menuLabel = options.menuAriaLabel ||
                          componentOptions.menuAriaLabel ||
                          'Menu';
        const controllerEl = options.controllerEl;
        const menuID = options.menuID ?? `ink-menu-handle__${this.cid}`;

        /* Build the internal menu and listen for events. */
        const menuView = craft<MenuView>`
            <Ink.Menu aria-label=${menuLabel}
                      class="${options.menuClassName}"
                      controllerEl=${controllerEl}
                      id="${menuID}"
                      menuItems=${componentOptions.menuItems}>
             ${state.subcomponents['_MenuItem']}
            </Ink.Menu>
        `;

        this.menuView = menuView;

        this.listenTo(
            menuView,
            'opening',
            () => controllerEl.classList.add('js-hover'));

        this.listenTo(
            menuView,
            'closing',
            () => controllerEl.classList.remove('js-hover'));

        this.listenTo(
            menuView,
            'opened',
            () => this._updateMenuPosition(controllerEl));

        controllerEl.addEventListener(
            'click',
            evt => this.#onControllerClicked(evt));

        controllerEl.addEventListener(
            'keydown',
            evt => this.#onControllerKeyDown(evt));

        if (options.openOnHover !== false) {
            controllerEl.addEventListener(
                'mouseover',
                evt => this.#onControllerMouseEnter(evt));
        }

        return menuView;
    }

    /**
     * Handle removing the element.
     *
     * This will explicitly remove the menu.
     *
     * Subclasses must call this.
     */
    protected onRemove() {
        this.menuView.remove();
    }

    /**
     * Record a menu item subcomponent.
     *
     * The subcomponent will be updated to work with ``Ink.Menu`` so that it
     * can be passed in during render.
     *
     * Args:
     *     subcomponent (SubcomponentInfo):
     *         Information on the subcomponent.
     */
    protected _recordMenuItem(subcomponent: SubcomponentInfo) {
        const subcomponents = this.initialComponentState.subcomponents;
        let menuItems: SubcomponentInfo[] = subcomponents['_MenuItem'];

        if (!menuItems) {
            menuItems = [];
            subcomponents['_MenuItem'] = menuItems;
        }

        /* Transform this for the internal Ink.Menu, and store it. */
        subcomponent.fullName = `Ink.Menu.${subcomponent.name}`;

        menuItems.push(subcomponent);
    }

    /**
     * Position the drop-down menu.
     *
     * This will attempt to determine whether there's enough space below
     * the controller for the menu to fully appear. If there is not, then the
     * menu will appear above the controller instead.
     *
     * The resulting direction will also impact the styling of the controller
     * and menu, helping to create a connected appearance.
     *
     * This also ensures that the menu will always appear fully on screen
     * according to the width of the viewport.
     *
     * Args:
     *     controllerEl (HTMLElement):
     *         The controller for the menu that the element will be positioned
     *         relative to.
     */
    protected _updateMenuPosition(controllerEl: HTMLElement) {
        const controllerElBoundingRect = controllerEl.getBoundingClientRect();
        const controllerY1 = controllerElBoundingRect.top +
                             window.pageYOffset -
                             document.documentElement.clientTop;
        const controllerY2 = controllerY1 + controllerEl.clientHeight;
        const pageY1 = window.pageYOffset;
        const pageY2 = window.pageYOffset + window.innerHeight;
        const menuEl = this.menuView.el;
        let direction: MenuHandleOpenDirection;

        if (pageY1 >= controllerY1) {
            /*
             * The controller is at least partially off-screen, above the
             * current viewport. Drop the menu down.
             */
            direction = MenuHandleOpenDirection.DOWN;
        } else if (pageY2 <= controllerY2) {
            /*
             * The controller is at least partially off-screen, below the
             * current viewport. Drop the menu up.
             */
            direction = MenuHandleOpenDirection.UP;
        } else {
            const menuHeight = menuEl.offsetHeight;

            /*
             * The controller is fully on-screen. See if there's enough room
             * below the controller for the menu.
             */
            if (pageY2 >= controllerY2 + menuHeight ||
                controllerY1 - pageY1 - menuHeight < 0) {
                /* The menu can fully fit below the controller. */
                direction = MenuHandleOpenDirection.DOWN;
            } else {
                /* The menu cannot fully fit below the controller. */
                direction = MenuHandleOpenDirection.UP;
            }
        }

        this._openDirection = direction;

        this.el.classList.toggle(
            '-opens-up',
            direction === MenuHandleOpenDirection.UP);

        /* Position the menu relative to the controller. */
        const offsetPx = `${controllerEl.clientHeight}px`;
        menuEl.style.top = (direction === MenuHandleOpenDirection.DOWN
                            ? offsetPx
                            : '');
        menuEl.style.bottom = (direction === MenuHandleOpenDirection.UP
                               ? offsetPx
                               : '');

        /* Position the menu laterally according to the viewport width. */
        const menuWidth = menuEl.offsetWidth;
        const windowWidth = window.innerWidth;
        const elOffsetLeft = controllerElBoundingRect.left;

        let newMenuLeft: string = '';

        if (elOffsetLeft + menuWidth > windowWidth) {
            /*
             * The right side of the menu is being clipped. Move to the left
             * so that the full menu fits on screen.
             */
            const newMenuLeftNum = (
                windowWidth -
                (elOffsetLeft + Math.min(menuWidth, windowWidth))
            );

            newMenuLeft = `${newMenuLeftNum}px`;
        }

        menuEl.style.left = newMenuLeft;

        /* Make sure the menu is never wider than the viewport. */
        menuEl.style.maxWidth = `${windowWidth}px`;
    }

    /**
     * Handle a click event on the controller.
     *
     * When clicked, the menu will be opened in sticky mode.
     *
     * Args:
     *     evt (MouseEvent):
     *         The click event.
     */
    #onControllerClicked(evt: MouseEvent) {
        evt.stopPropagation();
        evt.preventDefault();

        if (this.canOpenMenu()) {
            this.menuView.open({
                sticky: true,
            });
        }
    }

    /**
     * Handle a keydown event on the controller.
     *
     * When the menu handle has focus, this will take care of handling
     * keyboard-based navigation, allowing the menu to be opened or closed.
     * Opening the menu will transfer focus to the menu items.
     *
     * Args:
     *     evt (KeyboardEvent):
     *         The keydown event.
     */
    #onControllerKeyDown(evt: KeyboardEvent) {
        if (evt.key === 'ArrowDown' ||
            evt.key === 'ArrowUp' ||
            evt.key === 'Enter' ||
            evt.key === ' ') {
            /*
             * Open the menu and set the current item, based on the open
             * direction.
             */
            evt.stopPropagation();
            evt.preventDefault();

            if (this.canOpenMenu()) {
                const menu = this.menuView;
                menu.open({
                    animate: false,
                    sticky: true,
                });

                if (this._openDirection === MenuHandleOpenDirection.UP) {
                    menu.setCurrentItem(-1);
                } else {
                    menu.setCurrentItem(0);
                }
            }
        } else if (evt.key === 'Escape') {
            /* Close out of the menu. */
            evt.stopPropagation();
            evt.preventDefault();

            this.menuView.close({
                animate: false,
            });
        }
    }

    /**
     * Handle a mouseenter event on the controller.
     *
     * This will open the menu.
     *
     * Args:
     *     e (MouseEvent):
     *         The mouseenter event.
     */
    #onControllerMouseEnter(evt: MouseEvent) {
        evt.stopPropagation();
        evt.preventDefault();

        if (this.canOpenMenu()) {
            this.menuView.open();
        }
    }
}
