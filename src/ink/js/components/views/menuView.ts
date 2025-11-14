/**
 * A component for an embedded or drop-down/pop-out menu.
 *
 * Version Added:
 *     0.5
 */

import _ from 'underscore';

import {
    type ElementAttributes,
    type BaseModel,
    type EventsHash,
    spina,
} from '@beanbag/spina';

import {
    type ComponentProps,
    type SubcomponentInfo,
    craft,
    inkComponent,
    paint,
    renderInto,
} from '../../core';
import { TypeaheadBuffer } from '../../foundation';
import { MenuItemsCollection } from '../collections/menuItemsCollection';
import {
    type MenuItem,
    MenuItemType,
} from '../models/menuItemModel';
import {
    type BaseComponentViewOptions,
    BaseComponentView,
} from './baseComponentView';
import {
    type KeyboardShortcutView,
} from './keyboardShortcutView';


/**
 * Base options for menu open/close methods.
 *
 * Version Added:
 *     0.5
 */
interface BaseOpenCloseMenuOptions {
    /**
     * Whether to animate the menu.
     *
     * If unspecified, defaults to ``true``.
     */
    animate?: boolean;

    /**
     * Whether to trigger events from a state change.
     *
     * If unspecified, defaults to ``true``.
     */
    triggerEvents?: boolean;
}


/**
 * Options for opening a menu.
 *
 * This is used to control animation, events, and current item selection.
 *
 * Version Added:
 *     0.5
 */
export interface OpenMenuOptions extends BaseOpenCloseMenuOptions {
    /**
     * The index of the item to focus.
     *
     * This can be -1 to focus the last item.
     */
    currentItemIndex?: number;

    /**
     * Whether to open the menu and keep it opened until clicking away.
     *
     * A sticky menu will remain open until clicking a parent element or
     * when another menu is opened. It will not close when moving the mouse
     * outside of the menu or its controller.
     *
     * If ``false``, then the menu will be closed when the mouse leaves the
     * menu.
     *
     * If ``true``, and the menu is already opened, it will be put into
     * sticky mode.
     */
    sticky?: boolean;
}


/**
 * Options for closing a menu.
 *
 * This is used to control animation and events.
 *
 * Version Added:
 *     0.5
 */
export interface CloseMenuOptions extends BaseOpenCloseMenuOptions {
    /**
     * Whether to delay closing the menu.
     *
     * This is used when an interaction may be moving away from the menu and
     * then back toward it. It gives the user time to re-enage with the menu
     * before it goes away.
     */
    delay?: boolean;
}


/**
 * Options for a menu.
 *
 * This is used to control the menu's drop-down or embedded mode, list of
 * menu items, and accessibility information.
 *
 * Version Added:
 *     0.5
 */
export interface MenuViewOptions extends BaseComponentViewOptions {
    /**
     * An explicit descriptive ARIA label to set on the menu.
     *
     * This is used to aid screen readers in case the text of the element is
     * insufficient.
     */
    ariaLabel?: string;

    /**
     * The ID of an element that contains an existing descriptive ARIA label.
     *
     * This will be used to set the labeled-by element to use for the menu,
     * to aid screen readers. If provided, this takes precedence over
     * ``ariaLabel``.
     */
    ariaLabelledBy?: string;

    /**
     * The element that's responsible for opening and closing the menu.
     */
    controllerEl?: HTMLElement;

    /**
     * Whether this menu is embedded within another element.
     *
     * When embedded, the menu will persist within an element, and won't
     * automatically open or close.
     */
    embedded?: boolean;

    /**
     * An existing collection of menu items to use in the menu.
     */
    menuItems?: MenuItemsCollection;
}


/**
 * A drop-down or embedded menu of items.
 *
 * This is a standard menu, showing a list of items (standard action items,
 * checkbox items, radio items, and separators) used to invoke actions or
 * change configuration.
 *
 * Menu items can contain optional icons and keyboard shortcuts. They're
 * expected to have a label.
 *
 * Menus and items are built to be accessible, helping those with screen
 * readers navigate the menu.
 *
 * Version Added:
 *     0.5
 */
@inkComponent('Ink.Menu')
@spina
export class MenuView<
    T extends BaseModel = BaseModel,
    TOptions extends MenuViewOptions = MenuViewOptions,
> extends BaseComponentView<
    T,
    HTMLMenuElement,
    TOptions
> {
    declare ['constructor']: typeof MenuView;

    static tagName = 'menu';
    static className = 'ink-c-menu';

    static subcomponents = {
        'CheckboxItem': '_recordMenuItem',
        'Header': '_recordMenuItem',
        'Item': '_recordMenuItem',
        'RadioItem': '_recordMenuItem',
        'Separator': '_recordMenuItem',
    };

    static events: EventsHash = {
        'click': '_onClick',
        'focusin': '_onFocusIn',
        'focusout': '_onFocusOut',
        'keydown': '_onKeyDown',
        'mouseenter .ink-c-menu__item': '_onMouseEnter',
        'mouseleave': '_onMouseLeave',
    };

    /**
     * The time in milliseconds before the menu is closed with a delay.
     */
    static DELAY_CLOSE_MS = 200;

    /**
     * The currently-opened menu item on the page.
     */
    static openedMenu: MenuView = null;

    /**********************
     * Instance variables *
     **********************/

    /**
     * The element that controls the display of this menu.
     */
    controllerEl: HTMLElement = null;

    /**
     * Whether this menu is embedded within another element.
     *
     * When embedded, the menu will persist within an element, and won't
     * automatically open or close.
     */
    embedded: boolean;

    /**
     * Whether an opened menu is sticky.
     *
     * A sticky menu will remain open until clicking a parent element or
     * when another menu is opened. It will not close when moving the mouse
     * outside of the menu or its controller.
     */
    isStickyOpen: boolean | null = null;

    /** The collection of menu items used in this menu. */
    menuItems: MenuItemsCollection;

    /**
     * The list of all all item views.
     *
     * Version Added:
     *     0.5
     */
    #allItemViews: BaseMenuItemView[] = [];

    /**
     * A timeout handle ID for closing a menu with a delay.
     */
    #closeTimeoutHandle: ReturnType<typeof setTimeout> = null;

    /**
     * The index of the currently-selected item in the menu.
     */
    #curItemIndex = null;

    /**
     * The list of all menu item elements.
     */
    #items: HTMLLIElement[] = [];

    /**
     * The list of all interactive item views.
     */
    #itemViews: BaseMenuItemView[] = [];

    /**
     * Whether focus is being carefully managed.
     *
     * When set, focus events won't be processed.
     */
    #managingFocus = false;

    /**
     * A bound handler for when the document is clicked.
     *
     * This is used as a stable handle when registering and unregistering
     * event handlers for document clicks.
     */
    #onDocClick = null;

    /**
     * The typeahead buffer used for keyboard-based navigation.
     */
    #typeaheadBuffer: TypeaheadBuffer;

    /**
     * Initialize the menu.
     *
     * Args:
     *     options (MenuViewOptions, optional):
     *         Options for customizing the menu.
     */
    initialize(options: Partial<TOptions> = {}) {
        super.initialize(options);

        options ??= {};
        this.controllerEl = options.controllerEl ?? null;
        this.embedded = !!options.embedded;

        /* Ensure there's always an ID set, for accessibility references. */
        this.id ||= _.uniqueId('_ink-c-menu');

        const menuItems = options.menuItems || new MenuItemsCollection();
        this.menuItems = menuItems;
        this.initialComponentState.hasExistingMenuItems = !menuItems.isEmpty();

        const typeaheadBuffer = new TypeaheadBuffer();
        this.#typeaheadBuffer = typeaheadBuffer;
        this.listenTo(typeaheadBuffer, 'bufferChanged',
                      this.#onTypeaheadBufferChanged);
    }

    /**
     * Return whether the menu is currently open.
     *
     * If the menu is in embedded mode, it's always considered open.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the menu is open. ``false`` if it is closed.
     */
    get isOpen(): boolean {
        return this.embedded || this.el.classList.contains('-is-open');
    }

    /**
     * Open the menu.
     *
     * This will show the menu on the screen. Before it's shown, an ``opening``
     * event will be emitted. Once shown (and after the animation finishes),
     * the ``opened`` event will be emitted.
     *
     * If the menu is embedded, this won't do anything.
     *
     * Args:
     *     options (MenuTransitionOptions, optional):
     *         Options to use when opening the menu.
     */
    open(options: OpenMenuOptions = {}) {
        /* Guard against null values from toggle(). */
        options ??= {};

        /*
         * Regardless of the open state, we want to respect a stickyOpen=true
         * setting. The user may have performed an action that should keep
         * the menu open.
         */
        if (!this.isStickyOpen) {
            this.isStickyOpen = !!options.sticky || this.embedded;
        }

        if (this.isOpen) {
            /* If there's a delayed close in progress, cancel it. */
            this.#clearDelayClose();

            return;
        }

        const el = this.el;
        const triggerEvents = (options.triggerEvents !== false);
        const currentItemIndex = options.currentItemIndex ?? null;

        /* Close any existing menu. */
        const cls = this.constructor;

        if (cls.openedMenu !== null) {
            cls.openedMenu.close({
                animate: false,
            });
        }

        if (options.animate === false) {
            /* Disable animation until the next render loop. */
            el.classList.add('js-no-animation');
            window.requestAnimationFrame(
                () => el.classList.remove('js-no-animation'));
        }

        if (triggerEvents) {
            this.trigger('opening');
        }

        el.classList.add('-is-open');
        el.tabIndex = 0;

        if (currentItemIndex !== null) {
            this.setCurrentItem(currentItemIndex);
        }

        cls.openedMenu = this;

        /*
         * Set up a handler so any click on the document will close the menu.
         */
        document.addEventListener(
            'click',
            this.#onDocClick,
            {
                once: true,
            });

        /* Update the opened state on the controller. */
        const controllerEl = this.controllerEl;

        if (controllerEl !== null) {
            controllerEl.setAttribute('aria-expanded', 'true');
            controllerEl.classList.add('-is-menu-open');
        }

        if (triggerEvents) {
            this.trigger('opened');
        }
    }

    /**
     * Close the menu.
     *
     * This will hide the menu. Before it's hidden, a ``closing`` event will
     * be emitted. Once hidden (and after the animation finishes), the
     * ``closed`` event will be emitted.
     *
     * Args:
     *     options (CloseMenuOptions, optional):
     *         Options for closing the menu.
     */
    close(options: CloseMenuOptions = {}) {
        if (!this.isOpen) {
            return;
        }

        this.#clearCurrentItem(false);

        if (this.embedded) {
            return;
        }

        /* Guard against null values from toggle(). */
        options ??= {};

        /*
         * If there's an existing delay close operation, or we just completed
         * one, we'l need to clear the handle.
         */
        this.#clearDelayClose();

        if (options.delay) {
            /*
             * Wait until closing the menu.
             *
             * Once closed, the handle will be cleared as normal.
             */
            this.#closeTimeoutHandle = setTimeout(
                () => this.close(Object.assign({}, options, {delay: false})),
                MenuView.DELAY_CLOSE_MS);

            return;
        }

        const el = this.el;
        const controllerEl = this.controllerEl;
        const triggerEvents = (options.triggerEvents !== false);

        if (options.animate === false) {
            /* Disable animation until the next render loop. */
            el.classList.add('js-no-animation');
            window.requestAnimationFrame(
                () => el.classList.remove('js-no-animation'));
        }

        if (triggerEvents) {
            this.trigger('closing');
        }

        /* Remove the opened accessibility state from the controller. */
        if (controllerEl !== null) {
            controllerEl.classList.remove('-is-menu-open');
            controllerEl.setAttribute('aria-expanded', 'false');
        }

        /* Remove focus from the current item. */
        const curItemIndex = this.#curItemIndex;

        if (curItemIndex !== null) {
            this.#items[curItemIndex].blur();
        }

        this.#clearCurrentItem(false);
        el.classList.remove('-is-open');
        el.tabIndex = -1;

        document.removeEventListener('click', this.#onDocClick);

        this.constructor.openedMenu = null;

        this.isStickyOpen = null;

        if (triggerEvents) {
            this.trigger('closed');
        }
    }

    /**
     * Toggle display of the menu.
     *
     * This wraps :js:meth:`open` or :js:meth:`close`, based on the current
     * state.
     *
     * Args:
     *     openOptions (OpenMenuOptions, optional):
     *         Options for opening the menu.
     *
     *     closeOptions (CloseMenuOptions, optional):
     *         Options for closing the menu.
     */
    toggle(
        openOptions: OpenMenuOptions = {},
        closeOptions: CloseMenuOptions = {},
    ) {
        if (this.isOpen) {
            this.close(closeOptions);
        } else {
            this.open(openOptions);
        }
    }

    /**
     * Set the current selected item in the menu.
     *
     * Any negative index will wrap to the end, and any number higher than
     * the length of items will wrap to the beginning.
     *
     * Args:
     *     index (number):
     *         The index to set.
     *
     *         If ``null``, the current selected item will be cleared, and
     *         no new one will be set.
     */
    setCurrentItem(index: number | null) {
        const items = this.#items;
        const curItemIndex = this.#curItemIndex;

        if (index === curItemIndex) {
            return;
        }

        if (index === null || items.length === 0) {
            this.#clearCurrentItem(true);

            return;
        }

        this.#clearCurrentItem(false);
        this.#clearDelayClose();

        if (index < 0) {
            index = items.length - 1;
        } else if (index >= items.length) {
            index = 0;
        }

        const itemEl = items[index];
        itemEl.setAttribute('aria-selected', 'true');
        itemEl.tabIndex = 0;
        itemEl.focus();

        this.el.setAttribute('aria-activedescendant', itemEl.id);

        this.#curItemIndex = index;
    }

    /**
     * Remove the menu from the DOM.
     */
    protected onRemove() {
        this.close();
        this.#clearMenuItems();
    }

    /**
     * Handle initial rendering for the component.
     *
     * This will set up the menu's element in preparation for rendering the
     * menu items.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const state = this.initialComponentState;
        const options = state.options;
        const embedded = this.embedded;

        /* Set the initial attributes and state for the menu. */
        el.setAttribute('role', 'menu');
        el.id ||= _.result(this, 'id');
        el.tabIndex = (this.embedded ? 0 : -1);

        if (options.ariaLabelledBy) {
            el.setAttribute('aria-labelled-by', options.ariaLabelledBy);
        } else if (options.ariaLabel) {
            el.setAttribute('aria-label', options.ariaLabel);
        }

        if (embedded) {
            el.classList.add('-is-embedded', '-is-open');
        } else {
            this.#onDocClick = () => this.close();
        }

        /* Set up the controller for the menu. */
        const controllerEl = this.controllerEl;

        if (controllerEl !== null) {
            console.assert(el.id, 'MenuView element ID unexpectedly unset!');

            controllerEl.setAttribute('aria-controls', el.id);
            controllerEl.setAttribute('aria-expanded', 'false');
            controllerEl.setAttribute('aria-haspopup', 'true');
        }

        /* Listen for updates to the menu items. */
        this.listenTo(this.menuItems, 'update reset', this.render);
    }

    /**
     * Render the menu items for the menu.
     */
    protected onRender() {
        const el = this.el;
        const curItemIndex = this.#curItemIndex;

        /* Clear any old state. */
        this.#clearMenuItems();
        el.removeAttribute('aria-activedescendant');

        /* Set up the items for the menu. */
        let hasIcons = false;
        let hasShortcuts = false;

        const allItems: BaseMenuItemView[] = [];
        const itemViews: BaseMenuItemView[] = [];
        const menuItemEls: HTMLLIElement[] = [];

        const cid = this.cid;

        for (const menuItem of this.menuItems) {
            const menuItemType = menuItem.get('type');
            const menuItemViewCls = _menuItemViews[menuItemType];

            if (!menuItemViewCls) {
                console.error('Unexpected menu item type: %s: %o',
                              menuItemType, menuItem);
                continue;
            }

            const interactive = !menuItemViewCls.isDecorative;

            const menuItemID =
                menuItem.id ||
                (interactive
                 ? `menuitem-${cid}-${menuItemEls.length}`
                 : null);

            const menuItemView = craft<BaseMenuItemView>`
                <${menuItemViewCls} model=${menuItem}
                                    id="${menuItemID}"/>
            `;
            allItems.push(menuItemView);

            /* Record all interactive menu items. */
            if (interactive) {
                const menuItemEl = menuItemView.el;

                menuItemEl.dataset.itemIndex = menuItemEls.length.toString();
                menuItemEls.push(menuItemEl);
                itemViews.push(menuItemView);

                /*
                 * Check and handle menu items that should close the menu
                 * when clicked.
                 */
                if (menuItemView.closeOnClick) {
                    this.listenTo(menuItemView, 'clicked', () => this.close());
                }
            }

            if (menuItemView.hasIcon) {
                hasIcons = true;
            }

            if (menuItemView.hasShortcut) {
                hasShortcuts = true;
            }

            /* If the menu item re-renders, re-compute menu state. */
            this.listenTo(menuItemView, 'rendered',
                          () => this.#updateMenuState());
        }

        renderInto(el, allItems, {
            empty: true,
        });

        this.#updateMenuState({
            hasIcons: hasIcons,
            hasShortcuts: hasShortcuts,
        });

        this.#allItemViews = allItems;
        this.#items = menuItemEls;
        this.#itemViews = itemViews;

        /*
         * If a current menu item was already set, and is in the range,
         * preserve it.
         */
        this.setCurrentItem(
            (curItemIndex === null || curItemIndex >= menuItemEls.length)
            ? null
            : curItemIndex);
    }

    /**
     * Update the state of the menu.
     *
     * This will set the icon and shortcut classes based on the states either
     * provided or calculated from the menu items.
     *
     * Args:
     *     state (object):
     *         Pre-computed flags indicating the current state.
     */
    #updateMenuState(
        state?: {
            hasIcons: boolean,
            hasShortcuts: boolean,
        },
    ) {
        let hasIcons;
        let hasShortcuts;

        if (state) {
            hasIcons = state.hasIcons;
            hasShortcuts = state.hasShortcuts;
        } else {
            hasIcons = false;
            hasShortcuts = false;

            for (const menuItemView of this.#allItemViews) {
                if (menuItemView.hasIcon) {
                    hasIcons = true;
                }

                if (menuItemView.hasShortcut) {
                    hasShortcuts = true;
                }

                if (hasIcons && hasShortcuts) {
                    /* We can bail early. */
                    break;
                }
            }
        }

        const el = this.el;
        el.classList.toggle('-has-icons', hasIcons);
        el.classList.toggle('-has-shortcuts', hasShortcuts);
    }

    /**
     * Clear the state for all the menu items.
     *
     * This will remove each menu item and clear the state so that changes
     * to the items will no longer impact the menu.
     */
    #clearMenuItems() {
        for (const menuItemView of this.#allItemViews) {
            menuItemView.remove();
        }

        this.#allItemViews = [];
        this.#items = [];
        this.#itemViews = [];
    }

    /**
     * Record a menu item from a subcomponent.
     *
     * This may represent a menu item (``Ink.Menu.Item``) or a separator
     * (``Ink.Menu.Separator``).
     *
     * Args:
     *     subcomponent (SubcomponentInfo):
     *         Information on the subcomponent.
     */
    private _recordMenuItem(subcomponent: SubcomponentInfo) {
        if (this.initialComponentState.hasExistingMenuItems) {
            throw Error(
                'Ink.Menu can\'t contain subcomponents if configured with a ' +
                'populated menuItems collection.'
            );
        }

        const children = subcomponent.children;
        const props = subcomponent.props || {};
        let menuItemProps: ComponentProps = {};

        switch (subcomponent.name) {
            case 'CheckboxItem': /* Pass-through */

            case 'Item': /* Pass-through */

            case 'RadioItem':
                menuItemProps = {
                    childEl: props.childEl,
                    disabled: !!props.disabled,
                    iconName: props.iconName,
                    id: props.id,
                    keyboardShortcut: props.keyboardShortcut,
                    keyboardShortcutRegistry: props.keyboardShortcutRegistry,
                    label: (children.length === 1
                            ? children[0]
                            : null),
                    onClick: props.onClick,
                    url: props.url,
                };

                if (subcomponent.name === 'CheckboxItem') {
                    menuItemProps['checked'] = props.checked;
                    menuItemProps['type'] = MenuItemType.CHECKBOX_ITEM;
                } else if (subcomponent.name === 'RadioItem') {
                    menuItemProps['checked'] = props.checked;
                    menuItemProps['radioGroup'] = props.radioGroup;
                    menuItemProps['type'] = MenuItemType.RADIO_ITEM;
                } else {
                    menuItemProps['type'] = MenuItemType.ITEM;
                }

                break;

            case 'Header':
                menuItemProps = {
                    childEl: props.childEl,
                    iconName: props.iconName,
                    id: props.id,
                    label: (children.length === 1
                            ? children[0]
                            : null),
                    type: MenuItemType.HEADER,
                };
                break;

            case 'Separator':
                menuItemProps['type'] = MenuItemType.SEPARATOR;
                break;

            default:
                console.assert(false, 'Not reached');

                return;
        }

        this.menuItems.add(menuItemProps);
    }

    /**
     * Clear a pending delayed close operation.
     */
    #clearDelayClose() {
        if (this.#closeTimeoutHandle !== null) {
            clearTimeout(this.#closeTimeoutHandle);
            this.#closeTimeoutHandle = null;
        }
    }

    /**
     * Clear the current selection.
     *
     * Args:
     *     setFocus (boolean, optional):
     *         Whether to set the menu to be focused after clearing the
     *         selection.
     */
    #clearCurrentItem(setFocus = true) {
        const index = this.#curItemIndex;

        this.el.removeAttribute('aria-activedescendant');

        if (index !== null) {
            const itemEl = this.#items[index];

            if (itemEl) {
                itemEl.removeAttribute('aria-selected');
                itemEl.tabIndex = -1;
            }

            this.#curItemIndex = null;

            this.#managingFocus = true;

            if (setFocus) {
                this.el.focus();
            } else {
                itemEl.blur();
            }

            this.#managingFocus = false;
        }
    }

    /**
     * Activate the current item.
     *
     * This will perform a click event on any ``<a>`` tag within the item,
     * or on the item itself if needed.
     *
     * Args:
     *     itemEl (MenuItemElement):
     *         The item to activate.
     */
    #activateItem(itemEl: HTMLLIElement) {
        this.#clearDelayClose();

        const clickEl = itemEl.querySelector<HTMLElement>('a') || itemEl;
        clickEl.click();
    }

    /**
     * Return the index for an item matching the typeahead buffer.
     *
     * Args:
     *     firstIndex (number):
     *         The first index to search.
     *
     *     lastIndex (number):
     *         The last index to search.
     *
     * Returns:
     *     number:
     *     The index of the item that was found, or ``null`` if not found.
     */
    #findItemIndexForTypeahead(
        firstIndex: number,
        lastIndex: number,
    ): number | null {
        const items = this.#items;

        return this.#typeaheadBuffer.helpFindItemWithPrefix({
            firstItem: firstIndex,
            lastItem: lastIndex,

            getItemText: curIndex => (
                items[curIndex]
                .querySelector('.ink-c-menu__item-label')
                .textContent
            ),
            getNextItem: curIndex => curIndex + 1,
        });
    }

    /**
     * Handle a change to the typeahead buffer.
     *
     * If there's content in the buffer, this will attempt to find a menu
     * item that matches.
     *
     * Args:
     *     buffer (string):
     *         The current typeahead buffer.
     */
    #onTypeaheadBufferChanged(buffer: string) {
        if (buffer === '') {
            return;
        }

        const items = this.#items;
        const curItemIndex = this.#curItemIndex;
        let index = this.#findItemIndexForTypeahead(curItemIndex || 0,
                                                    items.length - 1);

        if (index === null && curItemIndex) {
            index = this.#findItemIndexForTypeahead(0, curItemIndex - 1);
        }

        if (index !== null) {
            this.setCurrentItem(index);
        }
    }

    /**
     * Handle a click event.
     *
     * This will prevent the event from bubbling up past the menu.
     *
     * Args:
     *     evt (MouseEvent):
     *         The click event.
     */
    private _onClick(evt: MouseEvent) {
        /* Prevent bubbling up. */
        evt.stopPropagation();
    }

    /**
     * Handle a focusin event.
     *
     * If focusing to the menu itself, the first item will be selected.
     *
     * Args:
     *     evt (FocusEvent):
     *         The focus event.
     */
    private _onFocusIn(evt: FocusEvent) {
        evt.stopPropagation();
        evt.preventDefault();

        if (!this.#managingFocus && evt.target === this.el) {
            this.setCurrentItem(this.#curItemIndex || 0);
        }
    }

    /**
     * Handle a focusout event.
     *
     * If focusing outside of the menu, the menu will be closed.
     *
     * Args:
     *     evt (FocusEvent):
     *         The focus event.
     */
    private _onFocusOut(evt: FocusEvent) {
        evt.stopPropagation();
        evt.preventDefault();

        if (this.#managingFocus) {
            return;
        }

        const relatedTarget = evt.relatedTarget as HTMLElement;
        const controllerEl = this.controllerEl;

        if (!this.el.contains(relatedTarget) &&
            (!controllerEl ||
             (controllerEl !== relatedTarget &&
              !controllerEl.contains(relatedTarget)))) {
            /* Focus moved outside of this element. */
            if (this.embedded) {
                /* Clear focus when moving out of the element.*/
                this.#clearCurrentItem(false);
            } else {
                /* This is a drop-down menu. Close the menu. */
                this.close();
            }
        }
    }

    /**
     * Handle a keydown event.
     *
     * See the view's docs for the list of supported keyboard shortcuts.
     *
     * Args:
     *     evt (KeyboardEvent):
     *         The keydown event.
     */
    private _onKeyDown(evt: KeyboardEvent) {
        const key = evt.key;

        this.#typeaheadBuffer.handleKeyDown(evt);

        switch (key) {
            /* Move down an item */
            case 'ArrowDown': /* Fall through */

            case 'Down':
                /*
                 * Focus the next item in the menu, or wrap to the beginning
                 * of the menu.
                 */
                evt.preventDefault();
                evt.stopPropagation();

                this.setCurrentItem(this.#curItemIndex === null
                                    ? 0
                                    : this.#curItemIndex + 1);
                break;


            /* Move up an item */
            case 'ArrowUp': /* Fall through */

            case 'Up':
                /*
                 * Focus the previous item in the menu, or wrap to the end
                 * of the menu.
                 */
                evt.preventDefault();
                evt.stopPropagation();

                this.setCurrentItem(this.#curItemIndex === null
                                    ? -1
                                    : this.#curItemIndex - 1);
                break;


            /* Navigate to start of menu */
            case 'PageUp': /* Fall through */

            case 'Home':
                /*
                 * Focus to the first item in the menu.
                 */
                evt.preventDefault();
                evt.stopPropagation();

                this.setCurrentItem(0);
                break;


            /* Navigate to end of menu */
            case 'PageDown': /* Fall through */

            case 'End':
                /*
                 * Focus to the last item in the menu.
                 */
                evt.preventDefault();
                evt.stopPropagation();

                this.setCurrentItem(-1);
                break;


            /* Activate current item */
            case ' ': /* Fall through */

            case 'Enter':
                /*
                 * Activate the current item.
                 */
                if (this.#curItemIndex !== null) {
                    evt.preventDefault();
                    evt.stopPropagation();

                    const index = this.#curItemIndex;

                    if (!this.#itemViews[index].model.get('disabled')) {
                        const itemEl = this.#items[index];
                        this.#activateItem(itemEl);

                        /*
                         * For checkbox and radio menu items, Space should
                         * activate but not close. For standard menu items, it
                         * should close.
                         */
                        if (key === 'Enter' ||
                            itemEl.getAttribute('role') === 'menuitem') {
                            this.close();
                        }
                    }
                }

                break;


            /* Close the menu */
            case 'Tab': /* Fall through */

            case 'Escape':
                /*
                 * Close the menu.
                 */
                evt.preventDefault();
                evt.stopPropagation();

                this.close({
                    animate: false,
                });

                /* Focus the controller. */
                if (this.controllerEl !== null) {
                    this.controllerEl.focus();
                }

                break;

            default:
                /* See if there's a menu item starting with this. */
                break;
        }
    }

    /**
     * Handle a mouseenter event.
     *
     * This will set the current item based on the item receiving the event.
     *
     * Args:
     *     evt (MouseEvent):
     *         The mouseenter event.
     */
    private _onMouseEnter(evt: MouseEvent) {
        evt.stopPropagation();
        evt.preventDefault();

        const itemEl = (evt.target as HTMLElement)
            .closest<HTMLLIElement>('.ink-c-menu__item');

        if (itemEl) {
            const itemIndex = itemEl.dataset.itemIndex;

            if (itemIndex !== undefined) {
                this.setCurrentItem(parseInt(itemIndex, 10));
            } else {
                this.#clearCurrentItem(false);
            }
        }
    }

    /**
     * Handle a mouseleave event.
     *
     * This will unset the current item, if the mouse is leaving the menu.
     *
     * Args:
     *     evt (MouseEvent):
     *         The mouseleave event.
     */
    private _onMouseLeave(evt: MouseEvent) {
        if (!this.el.contains(evt.relatedTarget as HTMLElement)) {
            evt.stopPropagation();
            evt.preventDefault();

            this.#clearCurrentItem(true);

            if (!this.isStickyOpen) {
                this.close();
            }
        }
    }
}


/**
 * Base class for menu items.
 *
 * This sets some basic state on the menu item. It's meant to be subclassed
 * to control additional state and rendering.
 *
 * Version Added:
 *     0.5
 */
@spina({
    prototypeAttrs: [
        'isDecorative',
    ],
})
class BaseMenuItemView extends BaseComponentView<
    MenuItem,
    HTMLLIElement
> {
    static tagName = 'li';
    static attributes: ElementAttributes = {
        'draggable': false,
        'tabIndex': '-1',
    };

    /**
     * Whether the menu item is purely decorational/informative.
     *
     * Decorative menu items cannot be selected or invoked.
     *
     * Version Added:
     *     0.8
     */
    static isDecorative: boolean = false;
    declare isDecorative: boolean;

    /**********************
     * Instance variables *
     **********************/

    /** Whether clicking the menu item should close the menu. */
    closeOnClick: boolean = false;

    /** Whether the menu item will display or reserve space for an icon. */
    hasIcon: boolean = false;

    /** Whether the menu item will display a keyboard shortcut. */
    hasShortcut: boolean = false;
}


/**
 * A standard menu item.
 *
 * This provides common rendering and state management for menu items. It
 * will render the label (or custom element) and an optional icon and
 * keyboard shortcut. Updates to the information in the model will trigger
 * a re-render of the menu item.
 *
 * Subclasses can introduce additional state and rendering logic.
 *
 * Version Added:
 *     0.5
 */
@spina
class MenuItemView extends BaseMenuItemView {
    static className = 'ink-c-menu__item';
    static attributes: ElementAttributes = {
        'role': 'menuitem',
    };

    static events: EventsHash = {
        'click': '_onClick',
    };

    static modelEvents: EventsHash = {
        'change:childEl': '_onMenuItemChanged',
        'change:disabled': '_onMenuItemChanged',
        'change:iconName': '_onMenuItemChanged',
        'change:keyboardShortcut': '_onMenuItemChanged',
        'change:keyboardShortcutRegistry': '_onMenuItemChanged',
        'change:label': '_onMenuItemChanged',
        'change:url': '_onMenuItemChanged',
    };

    /**********************
     * Instance variables *
     **********************/

    /**
     * Whether clicking the menu item should close the menu.
     *
     * By default, menu items will close when clicked. This can be overridden
     * by subclasses.
     */
    closeOnClick = true;

    /**
     * The view managing the keyboard shortcut.
     */
    #keyboardShortcutView: KeyboardShortcutView = null;

    /**
     * Update state for the menu item.
     *
     * This will compute state to set on the view. Subclasses can override
     * this to compute or override any state.
     */
    protected updateMenuItemState() {
        const model = this.model;

        this.hasIcon = !!model.get('iconName');
        this.hasShortcut = !!model.get('keyboardShortcut');
    }

    /**
     * Handle removing the menu item.
     *
     * This will unregister state associated with the menu item.
     */
    protected onRemove() {
        super.onRemove();

        this.#keyboardShortcutView?.remove();
    }

    /**
     * Handle the initial rendering of the component.
     *
     * This will calculate the state from the model prior to the first render.
     */
    protected onComponentInitialRender() {
        this.updateMenuItemState();
    }

    /**
     * Render the menu item.
     *
     * This will rebuild the internals of the menu item based on the current
     * menu item state.
     */
    protected onRender() {
        const el = this.el;
        const model = this.model;
        const iconName = model.get('iconName');
        const label = model.get('label');
        const registry = model.get('keyboardShortcutRegistry');
        const shortcut = model.get('keyboardShortcut');
        const url = model.get('url');
        const innerProps: ElementAttributes = {};
        let iconEl: HTMLSpanElement;
        let innerTag: string;

        /* Clean up any old state. */
        this.#keyboardShortcutView?.remove();

        if (url) {
            innerTag = 'a';
            innerProps['href'] = url;
        } else {
            innerTag = 'span';
        }

        if (this.hasIcon) {
            const iconClass =
                iconName
                ? `ink-c-menu__item-icon ${iconName}`
                : 'ink-c-menu__item-icon';

            iconEl = paint`
                <span class="${iconClass}" aria-hidden="true"/>
            `;
        }

        let keyboardShortcutView: KeyboardShortcutView = null;

        if (shortcut) {
            keyboardShortcutView = craft<KeyboardShortcutView>`
                <Ink.KeyboardShortcut className="ink-c-menu__item-shortcut"
                                      keys="${shortcut}"
                                      registry=${registry}
                                      onInvoke="click"/>
            `;
        }

        if (model.get('disabled')) {
            el.setAttribute('aria-disabled', 'true');
        } else {
            el.removeAttribute('aria-disabled');
        }

        renderInto(
            el,
            paint`
                <${innerTag} class="ink-c-menu__item-inner"
                             role="presentation"
                             tabIndex="-1"
                             ...${innerProps}>
                 ${iconEl}
                 <label class="ink-c-menu__item-label">
                  ${model.get('childEl') || label}
                 </label>
                 ${keyboardShortcutView}
                </${innerTag}>
            `,
            {
                empty: true,
            });

        this.#keyboardShortcutView = keyboardShortcutView;
    }

    /**
     * Handle changes to the menu item.
     *
     * This will compute new menu item state and then trigger a re-render.
     */
    private _onMenuItemChanged() {
        this.updateMenuItemState();
        this.render();
    }

    /**
     * Handle a click on the menu item.
     *
     * This will invoke the action associated with the menu item, and then
     * emit a ``clicked`` event.
     *
     * Args:
     *     evt (MouseEvent):
     *         The mouse event triggering this handler.
     */
    private _onClick(evt: MouseEvent) {
        evt.stopPropagation();

        const model = this.model;
        const disabled = model.get('disabled');

        if (model.get('disabled')) {
            evt.preventDefault();
            return;
        }

        if (!model.get('url')) {
            evt.preventDefault();
        }

        model.invokeAction(evt);
        this.trigger('clicked');
    }
}


/**
 * Base class for a checkable menu item.
 *
 * This provides common state management for checkable menu items (checkbox
 * and radio button items).
 *
 * Version Added:
 *     0.5
 */
@spina
class BaseCheckableMenuItemView extends MenuItemView {
    declare ['constructor']: typeof BaseCheckableMenuItemView;

    static modelEvents: EventsHash = {
        'change:checked': '_onCheckedChanged',
    };

    /**
     * A mapping of item types to checkmark icon classes.
     *
     * This is only for checkbox and radio items.
     *
     * Version Added:
     *     0.5
     */
    static _CHECKED_ICONS = {
        [MenuItemType.CHECKBOX_ITEM]: 'ink-i-check',
        [MenuItemType.RADIO_ITEM]: 'ink-i-dot',
    };

    /**********************
     * Instance variables *
     **********************/

    /* Never close on click. Keep the menu open so the toggle can occur. */
    closeOnClick = false;

    /**
     * Update state for the menu item.
     *
     * This will load state from the menu item and then force the parent menu
     * to always reserve space for a checkable state icon, even if not
     * checked.
     */
    protected updateMenuItemState() {
        super.updateMenuItemState();

        /* Always claim space for an icon. */
        this.hasIcon = true;
    }

    /**
     * Render the menu item.
     *
     * This will perform the standard rendering of the menu item and then
     * update the icon to reflect the current checkable state.
     */
    protected onRender() {
        super.onRender();
        this._onCheckedChanged();
    }

    /**
     * Handle changes to the checked state of the menu item.
     *
     * This will update the icon to reflect the state of the menu item.
     */
    private _onCheckedChanged() {
        const el = this.el;
        const model = this.model;
        const checked = model.get('checked');
        const checkIconName =
            this.constructor._CHECKED_ICONS[model.get('type')];

        el.setAttribute('aria-checked', `${checked}`);
        el.querySelector('.ink-c-menu__item-icon')
            .classList.toggle(checkIconName, checked);
    }
}


/**
 * A checkbox menu item.
 *
 * Version Added:
 *     0.5
 */
@spina
class CheckboxMenuItemView extends BaseCheckableMenuItemView {
    static attributes: ElementAttributes = {
        'role': 'menuitemcheckbox',
    };
}


/**
 * A radio menu item.
 *
 * Version Added:
 *     0.5
 */
@spina
class RadioMenuItemView extends BaseCheckableMenuItemView {
    static attributes: ElementAttributes = {
        'role': 'menuitemradio',
    };
}


/**
 * A header menu item.
 *
 * This can't be clicked, but can be used to group together related menu
 * items.
 *
 * Version Added:
 *     0.8
 */
@spina
class HeaderMenuItemView extends MenuItemView {
    static className = 'ink-c-menu__item -is-header';
    static attributes: ElementAttributes = {
        /* Headers are essentially titled separators. */
        'role': 'separator',
    };
    static isDecorative: boolean = true;

    closeOnClick = false;
}


/**
 * A separator menu item.
 *
 * Version Added:
 *     0.5
 */
@spina
class SeparatorMenuItemView extends BaseMenuItemView {
    static className = 'ink-c-menu__separator';
    static attributes: ElementAttributes = {
        'role': 'separator',
    };
    static isDecorative: boolean = true;
}


/**
 * A mapping of menu item types to view classes.
 *
 * Version Added:
 *     0.5
 */
const _menuItemViews = {
    [MenuItemType.ITEM]: MenuItemView,
    [MenuItemType.CHECKBOX_ITEM]: CheckboxMenuItemView,
    [MenuItemType.HEADER]: HeaderMenuItemView,
    [MenuItemType.RADIO_ITEM]: RadioMenuItemView,
    [MenuItemType.SEPARATOR]: SeparatorMenuItemView,
};
