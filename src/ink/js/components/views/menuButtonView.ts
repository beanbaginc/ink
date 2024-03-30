/**
 * A component for a menu button.
 *
 * Version Added:
 *     1.0
 */

import {
    BaseModel,
    EventsHash,
    spina,
} from '@beanbag/spina';
import _ from 'underscore';

import {
    SubcomponentInfo,
    craft,
    inkComponent,
    paint,
    renderInto,
} from '../../core';
import type { MenuItemsCollection } from '../collections/menuItemsCollection';
import {
    BaseComponentView,
    BaseComponentViewOptions,
} from './baseComponentView';
import type {
    ButtonType,
    ButtonView,
} from './buttonView';
import { MenuView } from './menuView';


/**
 * The direction in which a menu will open from a menu button.
 *
 * Menu buttons compute this automatically, based on available screen space.
 *
 * Version Added:
 *     1.0
 */
export enum MenuButtonOpenDirection {
    /** The menu opens in an up direction. */
    UP = 'up',

    /** The menu opens in a down direction. */
    DOWN = 'down',
}


/**
 * Options for MenuButtonView.
 *
 * Version Added:
 *     1.0
 */
export interface MenuButtonViewOptions extends BaseComponentViewOptions {
    /**
     * Whether the menu button should show a busy state.
     */
    busy?: boolean;

    /**
     * Whether the menu button should be disabled.
     */
    disabled?: boolean;

    /**
     * Whether there should be an action button.
     *
     * If true, there will be an additional button separate from the
     * drop-down button.
     */
    hasActionButton?: boolean;

    /**
     * The label shown on the button.
     */
    label?: string;

    /**
     * The icon class to use for the drop-down icon.
     */
    menuIconName?: string;

    /**
     * A list of menu items.
     *
     * Each will be passed to :js:meth:RB.MenuView.addItem` If not provided,
     * explicit items should be added to the menu.
     */
    menuItems?: MenuItemsCollection;

    /**
     * An ARIA label to apply to the dropdown handle button.
     */
    dropdownButtonAriaLabel?: string;

    /**
     * An ARIA label to apply to the menu.
     */
    menuAriaLabel?: string;

    /**
     * The handler for click events on the action button.
     *
     * This won't do anything if ``hasActionButton`` isn't ``true``.
     */
    onActionButtonClick?: () => void;

    /**
     * The type of buttons.
     *
     * This defaults to :js:attr:`ButtonType.STANDARD`.
     */
    type?: ButtonType;
}


/**
 * Component for showing a button that opens a drop-down menu.
 *
 * Menu Buttons contain a label and a drop-down handle. When hovering over
 * the button or invoking it via a click or Space/Enter/arrow key, a specified
 * menu will appear.
 *
 * A Menu Button may contain a separate action button, which is distinct from
 * the drop-down menu handle button. This allows for a primary action that is
 * separate from a menu of actions or options.
 *
 * Just like a Button, a Menu Button may have a type, which communicates its
 * intent via a color hint.
 *
 * Version Added:
 *     1.0
 */
@inkComponent('Ink.MenuButton')
@spina
export class MenuButtonView<
    T extends BaseModel = BaseModel,
    TOptions extends MenuButtonViewOptions = MenuButtonViewOptions,
> extends BaseComponentView<
    T,
    HTMLElement,
    TOptions
> {
    static className = 'ink-c-menu-button';
    static allowComponentChildren = true;

    static subcomponents = MenuView.subcomponents;

    static events: EventsHash = {
        'keydown .ink-c-menu-button__dropdown-button':
            '_onDropdownButtonKeyDown',
        'mouseenter .ink-c-menu-button__dropdown-button':
            '_onDropdownButtonMouseEnter',
    };

    /**********************
     * Instance variables *
     **********************/

    /** The action button, if one is configured. */
    actionButtonView: ButtonView | null = null;

    /** The action button, if one is configured. */
    actionButtonEl: HTMLButtonElement | null = null;

    /** The drop-down button. */
    dropdownButtonView: ButtonView | null = null;

    /** The menu associated with the button. */
    menuView: MenuView | null = null;

    /** The direction that the menu will open. */
    private _openDirection = MenuButtonOpenDirection.DOWN;

    /**
     * Return whether the menu button is in a busy state.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the menu button is in a busy state. ``false`` if it
     *     is not.
     */
    get busy(): boolean {
        return this.el.getAttribute('aria-busy') === 'true';
    }

    /**
     * Set whether the menu button is in a busy state.
     *
     * Args:
     *     newBusy (boolean):
     *         ``true`` if the menu button should be in a busy state. ``false``
     *         if it should not.
     */
    set busy(newBusy: boolean) {
        if (newBusy) {
            this.el.setAttribute('aria-busy', 'true');
        } else {
            this.el.removeAttribute('aria-busy');
        }

        if (this.actionButtonView !== null) {
            this.actionButtonView.busy = newBusy;

            if (!this.disabled) {
                this.dropdownButtonView.disabled = newBusy;
            }
        } else {
            this.dropdownButtonView.busy = newBusy;
        }
    }

    /**
     * Return whether the menu button is disabled.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the button is disabled. ``false`` if it is not.
     */
    get disabled(): boolean {
        return (this.actionButtonView || this.dropdownButtonView).disabled;
    }

    /**
     * Set whether the menu button is disabled.
     *
     * Args:
     *     newDisabled (boolean):
     *         ``true`` if the button should be disabled. ``false``
     *         if it should not.
     */
    set disabled(newDisabled: boolean) {
        this.dropdownButtonView.disabled = newDisabled;

        if (this.actionButtonView !== null) {
            this.actionButtonView.disabled = newDisabled;
        }
    }

    /**
     * Return the name of the icon shown on the dropdown handle button.
     *
     * Returns:
     *     string:
     *     The name of the icon shown.
     */
    get iconName(): string | null {
        return this.dropdownButtonView.iconName;
    }

    /**
     * Set the name of the icon to show on the dropdown handle button.
     *
     * Args:
     *     newIconName (string):
     *         The name of the icon to show.
     *
     *         This can be set to ``null`` to hide an icon.
     */
    set iconName(newIconName: string | null) {
        this.dropdownButtonView.iconName = newIconName;
    }

    /**
     * Return the label shown on the button.
     *
     * Returns:
     *     string:
     *     The label shown on the button.
     */
    get label(): string | null {
        return (this.actionButtonView || this.dropdownButtonView).label;
    }

    /**
     * Set the label to show on the button.
     *
     * Args:
     *     newLabel (string):
     *         The label to show.
     */
    set label(newLabel: string | null) {
        (this.actionButtonView || this.dropdownButtonView).label = newLabel;
    }

    /**
     * Return the type of the menu button.
     *
     * Returns:
     *     ButtonType:
     *     The current type of the menu button.
     */
    get type(): ButtonType {
        return this.dropdownButtonView.type;
    }

    /**
     * Set the type of the button.
     *
     * Args:
     *     newType (ButtonType):
     *         The type of the button.
     */
    set type(newType: ButtonType) {
        this.dropdownButtonView.type = newType;

        if (this.actionButtonView !== null) {
            this.actionButtonView.type = newType;
        }
    }

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
     * Handle initially rendering the button.
     *
     * This will set up the button, based on any provided options, and
     * then render the menu.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const state = this.initialComponentState;
        const options = state.options;

        el.setAttribute('role', 'group');

        const buttonLabel = options.label || '';
        const menuLabel = options.menuAriaLabel || `Menu for ${buttonLabel}`;
        const cid = this.cid;
        const menuID = `ink-menu-button__menu__${cid}`;
        const labelID = `ink-menu-button__dropdown__${cid}`;

        /*
         * Build the internal buttons.
         *
         * If there's an action button, we'll build that and put it and
         * the dropdown handle button into a group.
         *
         * If there's no action button, we'll just use the handle button
         * as the only button, and place the label there.
         */
        const dropdownButtonProps: Record<string, unknown> = {
            'aria-label': options.dropdownButtonAriaLabel || 'Open menu',
            'class': 'ink-c-menu-button__dropdown-button',
            'iconName': options.menuIconName || 'ink-i-dropdown',
            'id': labelID,
            'onClick': () => {
                this.menuView.open({
                    sticky: true,
                });
            },
        };

        const dropdownButton = craft<ButtonView>`
            <Ink.Button ...${dropdownButtonProps}/>
        `;

        if (options.hasActionButton) {
            const actionButton = craft<ButtonView>`
                <Ink.Button class="ink-c-menu-button__action-button"
                            onClick=${options.onActionButtonClick}>
                 ${buttonLabel}
                </Ink.Button>
            `;
            this.actionButtonView = actionButton;

            renderInto(el, paint`
                <Ink.ButtonGroup class="ink-c-menu-button__buttons">
                 ${actionButton}
                 ${dropdownButton}
                </Ink.ButtonGroup>
            `);
        } else {
            dropdownButton.label = buttonLabel;

            renderInto(el, dropdownButton);
        }

        this.dropdownButtonView = dropdownButton;

        /* Build the internal menu and listen for events. */
        const menu = craft<MenuView>`
            <Ink.Menu aria-label=${menuLabel}
                      class="ink-c-menu-button__menu"
                      controllerEl=${dropdownButton.el}
                      id="${menuID}"
                      menuItems=${options.menuItems}>
             ${state.subcomponents['_MenuItem']}
            </Ink.Menu>
        `;

        this.listenTo(
            menu,
            'opening',
            () => this.dropdownButtonView.el.classList.add('js-hover'));

        this.listenTo(
            menu,
            'closing',
            () => this.dropdownButtonView.el.classList.remove('js-hover'));

        this.listenTo(menu, 'opened', () => this.#updateMenuPosition());

        renderInto(el, menu);
        this.menuView = menu;

        Object.assign(this, _.pick(
            options,
            'busy',
            'disabled',
            'label',
            'type'));
    }

    /**
     * Handle removing the element.
     *
     * This will explicitly remove the menu as well.
     */
    protected onRemove() {
        this.dropdownButtonView.remove();
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
    private _recordMenuItem(subcomponent: SubcomponentInfo) {
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
     * Handle a keydown event.
     *
     * When the drop-down button has focus, this will take care of handling
     * keyboard-based navigation, allowing the menu to be opened or closed.
     * Opening the menu will transfer focus to the menu items.
     *
     * Args:
     *     evt (KeyboardEvent):
     *         The keydown event.
     */
    private _onDropdownButtonKeyDown(evt: KeyboardEvent) {
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

            const menu = this.menuView;
            menu.open({
                animate: false,
                sticky: true,
            });

            if (this._openDirection === MenuButtonOpenDirection.UP) {
                menu.setCurrentItem(-1);
            } else {
                menu.setCurrentItem(0);
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
     * Handle a mouseenter event on the dropdown button.
     *
     * This will open the menu.
     *
     * Args:
     *     e (MouseEvent):
     *         The mouseenter event.
     */
    private _onDropdownButtonMouseEnter(evt: MouseEvent) {
        evt.stopPropagation();
        evt.preventDefault();

        this.menuView.open();
    }

    /**
     * Position the drop-down menu above or below the button.
     *
     * This will attempt to determine whether there's enough space below
     * the button for the menu to fully appear. If there is not, then the
     * menu will appear above the button instead.
     *
     * The resulting direction will also impact the styling of the button and
     * menu, helping to create a connected appearance.
     */
    #updateMenuPosition() {
        const buttonEl = this.dropdownButtonView.el;
        const buttonY1 = buttonEl.getBoundingClientRect().top +
                         window.pageYOffset -
                         document.documentElement.clientTop;
        const buttonY2 = buttonY1 + buttonEl.clientHeight;
        const pageY1 = window.pageYOffset;
        const pageY2 = window.pageYOffset + window.innerHeight;
        const menuEl = this.menuView.el;
        let direction: MenuButtonOpenDirection;

        if (pageY1 >= buttonY1) {
            /*
             * The button is at least partially off-screen, above the current
             * viewport. Drop the menu down.
             */
            direction = MenuButtonOpenDirection.DOWN;
        } else if (pageY2 <= buttonY2) {
            /*
             * The button is at least partially off-screen, below the current
             * viewport. Drop the menu up.
             */
            direction = MenuButtonOpenDirection.UP;
        } else {
            const menuHeight = menuEl.offsetHeight;

            /*
             * The button is fully on-screen. See if there's enough room below
             * the button for the menu.
             */
            if (pageY2 >= buttonY2 + menuHeight ||
                buttonY1 - pageY1 - menuHeight < 0) {
                /* The menu can fully fit below the button. */
                direction = MenuButtonOpenDirection.DOWN;
            } else {
                /* The menu cannot fully fit below the button. */
                direction = MenuButtonOpenDirection.UP;
            }
        }

        this._openDirection = direction;

        this.el.classList.toggle(
            '-opens-up',
            direction === MenuButtonOpenDirection.UP);

        /* Position the menu relative to the button. */
        const offsetPx = `${buttonEl.clientHeight}px`;
        menuEl.style.top = (direction === MenuButtonOpenDirection.DOWN
                            ? offsetPx
                            : '');
        menuEl.style.bottom = (direction === MenuButtonOpenDirection.UP
                               ? offsetPx
                               : '');
    }
}
