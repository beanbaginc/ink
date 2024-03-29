/**
 * A component for an embedded or drop-down/pop-out menu.
 *
 * Version Added:
 *     1.0
 */

import _ from 'underscore';

import {
    BaseModel,
    BaseView,
    EventsHash,
    spina,
} from '@beanbag/spina';

import {
    ComponentProps,
    SubcomponentInfo,
    inkComponent,
    paint,
    renderInto,
} from '../../core';
import { TypeaheadBuffer } from '../../foundation';
import { MenuItemsCollection } from '../collections/menuItemsCollection';
import {
    MenuItem,
    MenuItemType,
} from '../models/menuItemModel';
import {
    BaseComponentView,
    BaseComponentViewOptions,
} from './baseComponentView';


/**
 * Base options for menu open/close methods.
 *
 * Version Added:
 *     1.0
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
 *     1.0
 */
export interface OpenMenuOptions extends BaseOpenCloseMenuOptions {
    /**
     * The index of the item to focus.
     *
     * This can be -1 to focus the last item.
     */
    currentItemIndex?: number;
}


/**
 * Options for closing a menu.
 *
 * This is used to control animation and events.
 *
 * Version Added:
 *     1.0
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
 *     1.0
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
 * A mapping of item types to checkmark icon classes.
 *
 * This is only for checkbox and radio items.
 *
 * Version Added:
 *     1.0
 */
const _CHECKED_ICONS = {
    [MenuItemType.CHECKBOX_ITEM]: 'ink-i-check',
    [MenuItemType.RADIO_ITEM]: 'ink-i-dot',
};


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
 *     1.0
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
    static tagName = 'menu';
    static className = 'ink-c-menu';

    static subcomponents = {
        'CheckboxItem': '_recordMenuItem',
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

    /** The collection of menu items used in this menu. */
    menuItems: MenuItemsCollection;

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
        this.id ??= _.uniqueId('_ink-c-menu');

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
        if (this.isOpen) {
            /* If there's a delayed close in progress, cancel it. */
            this.#clearDelayClose();

            return;
        }

        /* Guard against null values from toggle(). */
        options ??= {};

        const el = this.el;
        const triggerEvents = (options.triggerEvents !== false);
        const currentItemIndex = options.currentItemIndex ?? null;

        /* Close any existing menu. */
        if (MenuView.openedMenu !== null) {
            MenuView.openedMenu.close({
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

        MenuView.openedMenu = this;

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
        MenuView.openedMenu = null;

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
        this.#items = [];
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

        this.#items = [];

        /* Set up the items for the menu. */
        let hasIcons = false;
        let hasShortcuts = false;

        const allItemEls: HTMLLIElement[] = [];
        const menuItemEls: HTMLLIElement[] = [];

        for (const menuItem of this.menuItems) {
            const menuItemType = menuItem.get('type');
            let itemEl: HTMLLIElement;
            let clickHandlerFunc: ((e: MouseEvent) => void);

            if (menuItemType === MenuItemType.ITEM ||
                menuItemType === MenuItemType.CHECKBOX_ITEM ||
                menuItemType === MenuItemType.RADIO_ITEM) {
                /*
                 * Render a standard menu item, checkbox menu item, or
                 * radio menu item.
                 *
                 * These are mostly rendered the same, but with some changes
                 * to ARIA information, callbacks, and state changes.
                 */
                const iconName = menuItem.get('iconName');
                const label = menuItem.get('label');
                const registry = menuItem.get('keyboardShortcutRegistry');
                const shortcut = menuItem.get('keyboardShortcut');
                const url = menuItem.get('url');
                const innerProps: Record<string, string> = {};
                const itemProps: Record<string, string> = {};
                let iconEl: HTMLSpanElement;
                let alwaysShowIcon = false;
                let role = 'menuitem';
                let innerTag: string;

                if (shortcut) {
                    hasShortcuts = true;
                }

                if (url) {
                    innerTag = 'a';
                    innerProps['href'] = url;
                } else {
                    innerTag = 'span';
                }

                if (menuItemType === MenuItemType.CHECKBOX_ITEM) {
                    alwaysShowIcon = true;
                    role = 'menuitemcheckbox';
                } else if (menuItemType === MenuItemType.RADIO_ITEM) {
                    alwaysShowIcon = true;
                    role = 'menuitemradio';
                }

                if (menuItem.id) {
                    itemProps['id'] = menuItem.id.toString();
                }

                if (iconName || alwaysShowIcon) {
                    hasIcons = true;

                    const iconClass =
                        iconName
                        ? `ink-c-menu__item-icon ${iconName}`
                        : 'ink-c-menu__item-icon';

                    iconEl = paint`
                        <span class="${iconClass}" aria-hidden="true"/>
                    `;
                }

                itemEl = paint`
                    <li class="ink-c-menu__item" role="${role}"
                        ...${itemProps}>
                     ${menuItem.get('childEl') || paint`
                      <${innerTag} class="ink-c-menu__item-inner"
                                   ...${innerProps}>
                       ${iconEl}
                       <label class="ink-c-menu__item-label">
                        ${label}
                       </label>
                       ${shortcut && paint`
                        <Ink.KeyboardShortcut
                          className="ink-c-menu__item-shortcut"
                          keys="${shortcut}"
                          registry=${registry}
                          onInvoke="click"/>
                       `}
                      </${innerTag}>
                     `}
                    </li>
                `;
                menuItemEls.push(itemEl);

                if (menuItemType === MenuItemType.CHECKBOX_ITEM ||
                    menuItemType === MenuItemType.RADIO_ITEM) {
                    /*
                     * Listen for changes to the "checked" state and update
                     * the icon accordingly.
                     */
                    const onCheckedChanged = () => {
                        const checked = menuItem.get('checked');
                        const checkIconName = _CHECKED_ICONS[menuItemType];

                        itemEl.setAttribute('aria-checked', `${checked}`);
                        itemEl.querySelector('.ink-c-menu__item-icon')
                            .classList.toggle(checkIconName, checked);
                    };

                    this.listenTo(menuItem, 'change:checked',
                                  onCheckedChanged);
                    onCheckedChanged();

                    /*
                     * Set up an event handler for checkbox and radio clicks.
                     *
                     * Unlike standard items, these won't cause the menu to
                     * close. Click handlers can still close the menu if they
                     * choose to.
                     */
                    clickHandlerFunc = (e => {
                        menuItem.invokeAction(e);
                    });
                } else {
                    /*
                     * Set up an event handler for standard menu items.
                     *
                     * This will invoke the menu item's action and then
                     * close the menu.
                     */
                    clickHandlerFunc = (e => {
                        menuItem.invokeAction(e);
                        this.close();
                    });
                }
            } else if (menuItemType === MenuItemType.SEPARATOR) {
                /*
                 * Render a separator.
                 */
                itemEl = paint`
                    <li class="ink-c-menu__separator" role="separator"/>
                `;

                /*
                 * Set up an event handler for separator items.
                 *
                 * This will ignore the event and prevent it from bubbling up.
                 */
                clickHandlerFunc = (e => {});
            } else {
                /*
                 * Handle unexpected menu item types.
                 */
                console.error('Unexpected menu item type: %s: %o',
                              menuItemType, menuItem);
                continue;
            }

            itemEl.addEventListener(
                'click',
                evt => {
                    evt.preventDefault()
                    evt.stopPropagation();

                    clickHandlerFunc(evt);
                },
                {
                    capture: true,
                });

            /* Finalize and track this menu item. */
            this.#finalizeMenuItemEl(itemEl);
            allItemEls.push(itemEl);
        }

        renderInto(el, allItemEls, {
            empty: true,
        });

        el.classList.toggle('-has-icons', hasIcons);
        el.classList.toggle('-has-shortcuts', hasShortcuts);
        el.removeAttribute('aria-activedescendant');

        this.#items = menuItemEls;

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
     * Finalize a menu item element for usage in the menu.
     *
     * This will ensure the element has the necessary attributes for
     * accessory and interaction.
     *
     * Args:
     *     menuItemEl (HTMLLIElement):
     *         The menu item element to prepare.
     */
    #finalizeMenuItemEl(menuItemEl: HTMLLIElement) {
        const index = this.#items.length;

        menuItemEl.tabIndex = -1;

        const innerEl = menuItemEl.firstElementChild as HTMLElement;

        if (innerEl) {
            innerEl.draggable = false;
            innerEl.role = 'presentation';
            innerEl.tabIndex = -1;

            /*
             * Make sure any items with content (those that are not a
             * separator) have an ID.
             */
            if (!menuItemEl.id) {
                menuItemEl.id = `menuitem-${this.cid}-${index}`;
            }
        }

        if (menuItemEl.classList.contains('ink-c-menu__item')) {
            menuItemEl.dataset.itemIndex = index.toString();
            this.#items.push(menuItemEl);
        }
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

                    const itemEl = this.#items[this.#curItemIndex];
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
            this.setCurrentItem(parseInt(itemEl.dataset.itemIndex, 10));
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
        }
    }
}