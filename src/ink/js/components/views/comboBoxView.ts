/**
 * A component for a combo box with auto-complete.
 *
 * Version Added:
 *     0.10
 */

import _ from 'underscore';

import {
    type ElementAttributes,
    type BaseModel,
    type EventsHash,
    spina,
} from '@beanbag/spina';

import {
    type SubcomponentInfo,
    craft,
    inkComponent,
    paint,
    renderInto,
} from '../../core';
import {
    ComboBoxItemsCollection,
} from '../collections/comboBoxItemsCollection';
import {
    type ComboBoxItemAttrs,
    ComboBoxItem,
} from '../models/comboBoxItemModel';
import {
    type BaseComponentViewOptions,
    BaseComponentView,
} from './baseComponentView';
import { TextFieldView } from './textFieldView';


/**
 * A function used to load items matching a query.
 *
 * Version Added:
 *     0.10
 */
export type ComboBoxLoadItemsFunc = (
    query: string,
) => Promise<ComboBoxItemAttrs[]>;


/**
 * A function used to filter static items against a query.
 *
 * Version Added:
 *     0.10
 */
export type ComboBoxFilterItemsFunc = (
    query: string,
    items: ComboBoxItem[],
) => ComboBoxItem[];


/**
 * A function used to render custom content for an item.
 *
 * Version Added:
 *     0.10
 */
export type ComboBoxRenderItemFunc = (item: ComboBoxItem) => HTMLElement;


/**
 * Options for ComboBoxView.
 *
 * Version Added:
 *     0.10
 */
export interface ComboBoxViewOptions extends BaseComponentViewOptions {
    /**
     * Whether typed text can be turned into a custom selected item.
     *
     * When enabled, pressing ``Enter`` or ``,`` with typed text (and no
     * highlighted suggestion) selects the text itself as an item, using
     * the text as both the ID and the label. This suits fields whose
     * values aren't limited to the suggestions, such as tag or bug ID
     * fields.
     *
     * This only applies when ``multiple`` is enabled. This defaults to
     * ``false``.
     *
     * Version Added:
     *     0.10
     */
    allowCustomTokens?: boolean;

    /**
     * An explicit descriptive ARIA label to set on the field.
     *
     * This is used to aid screen readers in case the text of the element is
     * insufficient.
     */
    ariaLabel?: string;

    /**
     * The ID of an element that contains an existing descriptive ARIA label.
     *
     * If provided, this takes precedence over ``ariaLabel``.
     */
    ariaLabelledBy?: string;

    /**
     * The time in milliseconds to wait after typing before loading items.
     *
     * This only applies when using ``load``. This defaults to 250.
     */
    debounceMS?: number;

    /**
     * Whether the combo box should be disabled.
     */
    disabled?: boolean;

    /**
     * The status text shown when an asynchronous load fails.
     *
     * This is only used when the rejected error has no message of its own.
     * Provide a translated string here when localizing the component.
     */
    errorText?: string;

    /**
     * A function used to filter static items against a query.
     *
     * This only applies when using static items. By default, items are
     * matched case-insensitively against their labels.
     */
    filterItems?: ComboBoxFilterItemsFunc;

    /**
     * A hint shown below the suggested items.
     *
     * This is typically used to hint at keyboard shortcuts, such as
     * "Press Tab to auto-complete.". It's only shown when there are
     * suggested items.
     */
    hintText?: string;

    /**
     * Optional name of an icon to display in front of the field.
     *
     * This is useful for search-like fields, using ``ink-i-search``.
     */
    iconName?: string;

    /**
     * A static set of items to suggest from.
     *
     * This can't be used together with ``load``.
     */
    items?: ComboBoxItemsCollection | ComboBoxItemAttrs[];

    /**
     * Whether the combo box is joined with surrounding UI.
     *
     * When enabled, the field is drawn without its own chrome, and the
     * pop-up is inset from the edges. This is intended for embedding the
     * combo box into a shared container, such as a panel showing the
     * selection below the field (with ``showSelected: false``).
     */
    joined?: boolean;

    /**
     * A function used to load items matching a query.
     *
     * This is used for asynchronous sources, such as a server-side API.
     * It's called with the current query, and must return a promise
     * resolving to attributes for the matching items.
     *
     * This can't be used together with ``items``.
     */
    load?: ComboBoxLoadItemsFunc;

    /**
     * The status text shown while an asynchronous load is in progress.
     *
     * Provide a translated string here when localizing the component.
     */
    loadingText?: string;

    /**
     * The minimum number of typed characters needed to suggest items.
     *
     * This defaults to 1.
     */
    minLength?: number;

    /**
     * Whether multiple items can be selected.
     *
     * When enabled, selected items are shown as removable tokens within
     * the field, and are tracked in :js:attr:`ComboBoxView.selectedItems`.
     *
     * This defaults to ``false``.
     */
    multiple?: boolean;

    /**
     * The form field name for the combo box.
     *
     * If provided, a hidden input will be rendered, containing the ID of
     * the selected item. When ``multiple`` is enabled, it will contain the
     * IDs of all selected items, comma-separated.
     */
    name?: string;

    /**
     * The status text shown when a query matches no items.
     *
     * Provide a translated string here when localizing the component.
     */
    noResultsText?: string;

    /**
     * Placeholder text to show when the field is empty.
     */
    placeholder?: string;

    /**
     * The label for a selected item's remove button.
     *
     * This is used for the button's tooltip and screen reader text when
     * ``multiple`` is enabled. Any ``{label}`` placeholder will be
     * replaced with the item's label.
     *
     * This defaults to ``Remove {label}``. Provide a translated string
     * here when localizing the component.
     *
     * Version Added:
     *     0.10
     */
    removeItemText?: string;

    /**
     * A function used to render custom content for suggested items.
     *
     * If not provided, items will render their labels and optional
     * descriptions.
     */
    renderItem?: ComboBoxRenderItemFunc;

    /**
     * Whether to automatically highlight the first suggested item.
     *
     * This defaults to ``false``.
     */
    selectFirst?: boolean;

    /**
     * An existing collection to use for the selected items.
     *
     * This can be used to pre-populate the selection, or to share the
     * selection with other views. This only applies when ``multiple`` is
     * enabled.
     */
    selectedItems?: ComboBoxItemsCollection;

    /**
     * Whether to show the selected items as tokens within the field.
     *
     * When disabled, the selection is still tracked in
     * :js:attr:`ComboBoxView.selectedItems`, but nothing is rendered for
     * it. This is intended for consumers that render the selection
     * themselves (such as a list of rows below the field), by listening
     * to events on that collection.
     *
     * This only applies when ``multiple`` is enabled, and defaults to
     * ``true``.
     */
    showSelected?: boolean;
}


/**
 * A text field with auto-complete suggestions.
 *
 * This implements the ARIA 1.2 combobox pattern. It wraps a text field
 * (:js:class:`TextFieldView`) that keeps DOM focus at all times, and a
 * pop-up listbox of suggested items. The highlighted item is tracked
 * virtually through ``aria-activedescendant``.
 *
 * Suggestions can come from a static set of items (``items``, or
 * ``Ink.ComboBox.Item`` children), or be loaded asynchronously from a
 * function (``load``). Asynchronous loads are debounced, and stale
 * responses are discarded.
 *
 * A single item can be selected by default. With ``multiple`` enabled,
 * several items can be selected, shown as removable tokens within the
 * field and tracked in :js:attr:`selectedItems`. Consumers can instead
 * render the selection themselves (such as a list of rows below the
 * field) by disabling ``showSelected`` and listening to events on that
 * collection.
 *
 * The following keyboard shortcuts are supported:
 *
 * * ``Down``/``Up`` opens the pop-up, and moves the highlight through
 *   the options (wrapping around the ends).
 * * ``Page Up``/``Page Down`` highlights the first/last option.
 * * ``Enter`` accepts the highlighted option. With
 *   ``allowCustomTokens``, it selects the typed text instead when
 *   nothing is highlighted, and falls through to the form when nothing
 *   was typed.
 * * ``Tab`` accepts the highlighted option, keeping focus in the field.
 *   When nothing is highlighted, focus moves on as normal.
 * * ``,`` accepts the highlighted option, when ``multiple`` is enabled.
 *   With ``allowCustomTokens``, it selects the typed text instead when
 *   nothing is highlighted.
 * * ``Escape`` closes the pop-up. When already closed, it clears the
 *   field.
 * * ``Backspace`` on an empty field moves the last selected item back
 *   into the field for editing, when ``multiple`` is enabled.
 *
 * For behavior like legacy auto-complete fields, where Tab completes to
 * the first result without needing to move the highlight, enable
 * ``selectFirst`` and consider providing a ``hintText`` (such as
 * "Press Tab to auto-complete.").
 *
 * Note that this deliberately does not use
 * :js:class:`~ink/foundation/models/typeaheadBuffer.TypeaheadBuffer`.
 * That exists to accumulate keystrokes on non-editable widgets (such as
 * menus). Here, the text field itself is the query buffer.
 *
 * Version Added:
 *     0.10
 */
@inkComponent('Ink.ComboBox')
@spina
export class ComboBoxView<
    TModel extends BaseModel = BaseModel,
    TOptions extends ComboBoxViewOptions = ComboBoxViewOptions,
> extends BaseComponentView<
    TModel,
    HTMLDivElement,
    TOptions
> {
    static className = 'ink-c-combo-box';

    static subcomponents = {
        'Item': '_recordItem',
    };

    static events: EventsHash = {
        'click .ink-c-combo-box__option': '_onOptionClick',
        'focusout': '_onFocusOut',
        'input .ink-c-combo-box__field': '_onInput',
        'keydown .ink-c-combo-box__field': '_onKeyDown',
        'mousedown .ink-c-combo-box__popup': '_onPopupMouseDown',
        'mouseenter .ink-c-combo-box__option': '_onOptionMouseEnter',
    };

    /**********************
     * Instance variables *
     **********************/

    /**
     * The currently-selected items.
     *
     * This is only used when ``multiple`` is enabled. Consumers can listen
     * to standard collection events on this to track the selection.
     */
    selectedItems: ComboBoxItemsCollection;

    /** The currently-suggested items. */
    suggestions: ComboBoxItemsCollection;

    /** The inner text field. */
    textField: TextFieldView = null;

    /** The full set of static items to suggest from. */
    #allItems: ComboBoxItemsCollection;

    /** The index of the currently-highlighted suggestion. */
    #curIndex: number | null = null;

    /** The time in milliseconds to wait before running a scheduled query. */
    #debounceMS: number;

    /** The status text shown when an asynchronous load fails. */
    #errorText: string;

    /** The function used to filter static items. */
    #filterItems: ComboBoxFilterItemsFunc;

    /** The hidden input used for form submission. */
    #hiddenInputEl: HTMLInputElement = null;

    /** The element containing the hint shown below the options. */
    #hintEl: HTMLElement = null;

    /** The function used to load items asynchronously. */
    #load: ComboBoxLoadItemsFunc | null;

    /** The status text shown while an asynchronous load is in progress. */
    #loadingText: string;

    /** The minimum number of typed characters needed to suggest items. */
    #minLength: number;

    /** Whether typed text can be turned into a custom selected item. */
    #allowCustomTokens: boolean;

    /** Whether multiple items can be selected. */
    #multiple: boolean;

    /** The status text shown when a query matches no items. */
    #noResultsText: string;

    /** The label for a selected item's remove button. */
    #removeItemText: string;

    /**
     * A bound handler for when the document is clicked.
     *
     * This is used as a stable handle when registering and unregistering
     * event handlers for document clicks.
     */
    #onDocClick = null;

    /** The elements for the currently-rendered options. */
    #optionEls: HTMLLIElement[] = [];

    /** The views for the currently-rendered options. */
    #optionViews: ComboBoxOptionView[] = [];

    /** The listbox element containing the options. */
    #optionsEl: HTMLUListElement = null;

    /** The pop-up element containing the listbox and status area. */
    #popupEl: HTMLDivElement = null;

    /**
     * The sequence number of the latest query.
     *
     * This is used to discard responses from stale asynchronous loads.
     */
    #querySequence = 0;

    /** A timeout handle ID for a scheduled query. */
    #queryTimeoutHandle: ReturnType<typeof setTimeout> = null;

    /** The function used to render custom content for items. */
    #renderItem: ComboBoxRenderItemFunc | null;

    /** Whether to automatically highlight the first suggested item. */
    #selectFirst: boolean;

    /** The currently-selected item. */
    #selectedItem: ComboBoxItem | null = null;

    /** The status element used for loading, empty, and error states. */
    #statusEl: HTMLElement = null;

    /** The list item element containing the text field in multiple mode. */
    #tokenFieldEl: HTMLLIElement = null;

    /** The views for the currently-rendered tokens. */
    #tokenViews: ComboBoxTokenView[] = [];

    /** The list element containing the tokens and field in multiple mode. */
    #tokensEl: HTMLUListElement = null;

    /**
     * Initialize the combo box.
     *
     * Args:
     *     options (ComboBoxViewOptions, optional):
     *         Options for customizing the combo box.
     */
    initialize(options: Partial<TOptions> = {}) {
        super.initialize(options);

        console.assert(
            !(options.items && options.load),
            'Ink.ComboBox can\'t be configured with both "items" and ' +
            '"load".');

        /* Ensure there's always an ID set, for accessibility references. */
        this.id ||= _.uniqueId('_ink-c-combo-box');

        const items = options.items;

        this.#allItems = (items instanceof ComboBoxItemsCollection
                          ? items
                          : new ComboBoxItemsCollection(items || []));

        this.suggestions = new ComboBoxItemsCollection();
        this.listenTo(this.suggestions, 'update reset',
                      () => this.#onSuggestionsChanged());

        this.#multiple = !!options.multiple;
        this.#allowCustomTokens = !!options.allowCustomTokens;

        const selectedItems =
            options.selectedItems || new ComboBoxItemsCollection();
        this.selectedItems = selectedItems;

        this.listenTo(selectedItems, 'add',
                      item => {
                          this.trigger('itemSelected', item);
                          this.trigger('change');
                      });
        this.listenTo(selectedItems, 'remove',
                      item => {
                          this.trigger('itemRemoved', item);
                          this.trigger('change');
                      });
        this.listenTo(selectedItems, 'update reset',
                      () => {
                          this.#renderTokens();
                          this.#updateHiddenInput();
                      });

        this.#debounceMS = options.debounceMS ?? 250;
        this.#errorText = options.errorText || _statusText.error;
        this.#filterItems = options.filterItems || _defaultFilterItems;
        this.#load = options.load || null;
        this.#loadingText = options.loadingText || _statusText.loading;
        this.#minLength = options.minLength ?? 1;
        this.#noResultsText = options.noResultsText || _statusText.noResults;
        this.#removeItemText = options.removeItemText || 'Remove {label}';
        this.#renderItem = options.renderItem || null;
        this.#selectFirst = !!options.selectFirst;
    }

    /**
     * Return whether the pop-up is currently open.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the pop-up is open. ``false`` if it is closed.
     */
    get isOpen(): boolean {
        return this.el.classList.contains('-is-open');
    }

    /**
     * Return whether the combo box is disabled.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the combo box is disabled. ``false`` if it is not.
     */
    get disabled(): boolean {
        return this.textField.disabled;
    }

    /**
     * Set whether the combo box is disabled.
     *
     * Args:
     *     newDisabled (boolean):
     *         ``true`` if the combo box should be disabled. ``false`` if it
     *         should not.
     */
    set disabled(newDisabled: boolean) {
        this.textField.disabled = newDisabled;
        this.el.classList.toggle('-is-disabled', newDisabled);

        /*
         * The tokens are separate controls from the field, so they need to
         * be disabled explicitly. Otherwise items could still be removed
         * from a disabled combo box.
         */
        for (const tokenView of this.#tokenViews) {
            tokenView.disabled = newDisabled;
        }

        if (newDisabled) {
            this.close();
        }
    }

    /**
     * Return the currently-selected item.
     *
     * This only applies when ``multiple`` is disabled. For multiple
     * selection, use :js:attr:`selectedItems` instead.
     *
     * Returns:
     *     ComboBoxItem:
     *     The selected item, or ``null`` if no item is selected.
     */
    get value(): ComboBoxItem | null {
        return this.#selectedItem;
    }

    /**
     * Set the currently-selected item.
     *
     * This only applies when ``multiple`` is disabled. For multiple
     * selection, use :js:attr:`selectedItems` instead.
     *
     * Note that this does not emit ``itemSelected`` or ``change``. Those
     * are only emitted for selections made by the user. Callers setting
     * this already know the new value.
     *
     * Args:
     *     newValue (ComboBoxItem):
     *         The item to select.
     *
     *         This can be set to ``null`` to clear the selection.
     */
    set value(newValue: ComboBoxItem | null) {
        this.#selectedItem = newValue;
        this.textField.value = (newValue && newValue.get('label')) || '';
        this.#updateHiddenInput();
    }

    /**
     * Focus the combo box's text field.
     */
    focus() {
        this.textField.focus();
    }

    /**
     * Open the pop-up.
     *
     * Before it's shown, an ``opening`` event will be emitted. Once shown,
     * the ``opened`` event will be emitted.
     */
    open() {
        if (this.isOpen || this.disabled) {
            return;
        }

        this.trigger('opening');

        this.el.classList.add('-is-open');
        this.textField.inputEl.setAttribute('aria-expanded', 'true');

        this.#updatePopupPosition();

        /*
         * Set up a handler so any click on the document will close the
         * pop-up.
         */
        document.addEventListener(
            'click',
            this.#onDocClick,
            {
                once: true,
            });

        this.trigger('opened');
    }

    /**
     * Close the pop-up.
     *
     * Before it's hidden, a ``closing`` event will be emitted. Once hidden,
     * the ``closed`` event will be emitted.
     */
    close() {
        if (!this.isOpen) {
            return;
        }

        this.trigger('closing');

        this.#setCurrentItem(null);

        this.el.classList.remove('-is-open');
        this.textField.inputEl.setAttribute('aria-expanded', 'false');

        /*
         * Clear the positioning state, so a stale position can't be shown
         * for a frame the next time the pop-up is opened.
         */
        this.el.classList.remove('-opens-up');

        const popupStyle = this.#popupEl.style;
        popupStyle.top = '';
        popupStyle.bottom = '';
        popupStyle.left = '';
        popupStyle.right = '';

        document.removeEventListener('click', this.#onDocClick);

        this.trigger('closed');
    }

    /**
     * Handle removing the combo box from the DOM.
     */
    protected onRemove() {
        this.#cancelScheduledQuery();
        this.close();
        this.#clearOptions();

        for (const tokenView of this.#tokenViews) {
            tokenView.remove();
        }

        this.#tokenViews = [];

        this.textField.remove();
    }

    /**
     * Handle initial rendering for the component.
     *
     * This will set up the text field, pop-up, and any hidden form input.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const options = this.initialComponentState.options;

        el.id ||= _.result(this, 'id');

        if (options.joined) {
            el.classList.add('-is-joined');
        }

        const listBoxID = `${el.id}__listbox`;

        /* Set up the inner text field. */
        const textField = craft<TextFieldView>`
            <Ink.TextField class="ink-c-combo-box__field"
                           ariaLabel=${options.ariaLabel}
                           ariaLabelledBy=${options.ariaLabelledBy}
                           iconName=${options.iconName}
                           placeholder=${options.placeholder}/>
        `;
        this.textField = textField;

        const fieldInputEl = textField.inputEl;
        fieldInputEl.setAttribute('role', 'combobox');
        fieldInputEl.setAttribute('autocomplete', 'off');
        fieldInputEl.setAttribute('aria-autocomplete', 'list');
        fieldInputEl.setAttribute('aria-controls', listBoxID);
        fieldInputEl.setAttribute('aria-expanded', 'false');

        /* Set up the pop-up with the listbox and status area. */
        const popupEl = paint<HTMLDivElement>`
            <div class="ink-c-combo-box__popup">
             <ul class="ink-c-combo-box__options"
                 id="${listBoxID}"
                 role="listbox"></ul>
             <div class="ink-c-combo-box__status" role="status" hidden></div>
             ${options.hintText && paint`
              <div class="ink-c-combo-box__hint" hidden>${
                  options.hintText
              }</div>
             `}
            </div>
        `;
        this.#popupEl = popupEl;
        this.#optionsEl = popupEl.querySelector('.ink-c-combo-box__options');
        this.#statusEl = popupEl.querySelector('.ink-c-combo-box__status');
        this.#hintEl = popupEl.querySelector('.ink-c-combo-box__hint');

        this.#onDocClick = () => this.close();

        if (this.#multiple && options.showSelected !== false) {
            /*
             * In multiple mode, the field is embedded in a list alongside
             * tokens for the selected items.
             */
            el.classList.add('-is-multiple');

            const tokensEl = paint<HTMLUListElement>`
                <ul class="ink-c-combo-box__tokens">
                 <li class="ink-c-combo-box__token-field"></li>
                </ul>
            `;
            this.#tokensEl = tokensEl;
            this.#tokenFieldEl =
                tokensEl.querySelector('.ink-c-combo-box__token-field');
            this.#tokenFieldEl.appendChild(textField.el);

            renderInto(el, [tokensEl, popupEl]);

            this.#renderTokens();
        } else {
            renderInto(el, [textField, popupEl]);
        }

        /* Set up the hidden input for form submission. */
        if (options.name) {
            this.#hiddenInputEl = paint<HTMLInputElement>`
                <input type="hidden" name="${options.name}"/>
            `;
            el.appendChild(this.#hiddenInputEl);

            this.#updateHiddenInput();
        }

        /*
         * Set properties from any initial options. This will update the
         * combo box to reflect the state.
         */
        Object.assign(this, _.pick(options, 'disabled'));
    }

    /**
     * Record an item from a subcomponent.
     *
     * Args:
     *     subcomponent (SubcomponentInfo):
     *         Information on the subcomponent.
     */
    private _recordItem(subcomponent: SubcomponentInfo) {
        const children = subcomponent.children;
        const props = subcomponent.props || {};

        this.#allItems.add({
            data: props.data,
            description: props.description,
            disabled: !!props.disabled,
            id: props.id,
            label: (children.length === 1
                    ? children[0]
                    : props.label),
        } as ComboBoxItemAttrs);
    }

    /**
     * Run a query, updating the suggested items.
     *
     * For static items, this will filter the items immediately. For
     * asynchronous sources, this will start a load, discarding the results
     * if another query is started in the meantime.
     *
     * Args:
     *     query (string):
     *         The query to run.
     */
    #runQuery(query: string) {
        const load = this.#load;

        if (load === null) {
            this.suggestions.reset(
                this.#filterSelected(
                    this.#filterItems(query, this.#allItems.models)));
            this.open();
        } else {
            const querySequence = ++this.#querySequence;

            this.el.classList.add('-is-loading');
            this.#setStatus(this.#loadingText);
            this.open();

            load(query)
                .then(itemAttrs => {
                    if (querySequence !== this.#querySequence) {
                        /* This query is stale. Discard the results. */
                        return;
                    }

                    this.el.classList.remove('-is-loading');
                    this.suggestions.reset(
                        this.#filterSelected(itemAttrs));
                })
                .catch(err => {
                    if (querySequence !== this.#querySequence) {
                        return;
                    }

                    this.el.classList.remove('-is-loading');
                    this.suggestions.reset([]);
                    this.#setStatus(err?.message || this.#errorText);
                });
        }
    }

    /**
     * Handle a change to the suggested items.
     *
     * This will re-render the options in the listbox.
     */
    #onSuggestionsChanged() {
        const optionEls: HTMLLIElement[] = [];
        const optionViews: ComboBoxOptionView[] = [];
        const elID = this.el.id;
        const renderItem = this.#renderItem;

        this.#clearOptions();

        this.suggestions.each((item, index) => {
            const optionView = craft<ComboBoxOptionView>`
                <${ComboBoxOptionView} model=${item}
                                       id="${elID}__option-${index}"
                                       renderItem=${renderItem}/>
            `;

            const optionEl = optionView.el;
            optionEl.dataset.itemIndex = index.toString();

            optionEls.push(optionEl);
            optionViews.push(optionView);
        });

        renderInto(this.#optionsEl, optionViews, {
            empty: true,
        });

        this.#optionEls = optionEls;
        this.#optionViews = optionViews;

        this.#setStatus(optionEls.length === 0
                        ? this.#noResultsText
                        : null);

        if (this.#hintEl !== null) {
            this.#hintEl.hidden = (optionEls.length === 0);
        }

        this.#setCurrentItem((this.#selectFirst && optionEls.length > 0)
                             ? 0
                             : null);

        if (this.isOpen) {
            this.#updatePopupPosition();
        }
    }

    /**
     * Remove all rendered options.
     */
    #clearOptions() {
        for (const optionView of this.#optionViews) {
            optionView.remove();
        }

        this.#optionEls = [];
        this.#optionViews = [];
        this.#curIndex = null;
    }

    /**
     * Set the status text shown in the pop-up.
     *
     * Args:
     *     text (string):
     *         The status text to show.
     *
     *         If ``null``, the status area will be hidden.
     */
    #setStatus(text: string | null) {
        const statusEl = this.#statusEl;

        if (text) {
            statusEl.textContent = text;
            statusEl.hidden = false;
        } else {
            statusEl.textContent = '';
            statusEl.hidden = true;
        }
    }

    /**
     * Set the currently-highlighted item in the listbox.
     *
     * Any negative index will wrap to the end, and any number higher than
     * the length of options will wrap to the beginning.
     *
     * DOM focus stays on the text field. The highlight is tracked through
     * ``aria-activedescendant``.
     *
     * Args:
     *     index (number):
     *         The index to set.
     *
     *         If ``null``, the current highlight will be cleared.
     */
    #setCurrentItem(index: number | null) {
        const optionEls = this.#optionEls;
        const fieldEl = this.textField.inputEl;
        const curIndex = this.#curIndex;

        if (curIndex !== null && optionEls[curIndex]) {
            optionEls[curIndex].removeAttribute('aria-selected');
        }

        if (index === null || optionEls.length === 0) {
            fieldEl.removeAttribute('aria-activedescendant');
            this.#curIndex = null;

            return;
        }

        if (index < 0) {
            index = optionEls.length - 1;
        } else if (index >= optionEls.length) {
            index = 0;
        }

        const optionEl = optionEls[index];
        optionEl.setAttribute('aria-selected', 'true');

        /* Note that scrollIntoView may not exist in test environments. */
        optionEl.scrollIntoView?.({
            block: 'nearest',
        });

        fieldEl.setAttribute('aria-activedescendant', optionEl.id);

        this.#curIndex = index;
    }

    /**
     * Accept the item at the given index.
     *
     * This will select the item, update the text field and any hidden
     * input, and close the pop-up.
     *
     * Args:
     *     index (number):
     *         The index of the item to accept.
     */
    #acceptItem(index: number) {
        const item = this.suggestions.at(index);

        if (!item || item.get('disabled')) {
            return;
        }

        if (this.#multiple) {
            this.selectedItems.add(item);
            this.textField.value = '';
        } else {
            this.value = item;

            this.trigger('itemSelected', item);
            this.trigger('change');
        }

        this.close();
    }

    /**
     * Select the typed text as a custom item.
     *
     * The trimmed text becomes a selected item, using the text as both
     * the ID and the label, and the field is cleared. This only applies
     * when ``multiple`` and ``allowCustomTokens`` are enabled.
     *
     * Version Added:
     *     0.10
     *
     * Returns:
     *     boolean:
     *     ``true`` if there was text to select.
     */
    #acceptCustomToken(): boolean {
        const text = this.textField.value.trim();

        if (!text) {
            return false;
        }

        this.selectedItems.add({
            id: text,
            label: text,
        });
        this.textField.value = '';
        this.close();

        return true;
    }

    /**
     * Filter out items that are already selected.
     *
     * This only applies when ``multiple`` is enabled.
     *
     * Args:
     *     items (ComboBoxItem[] or ComboBoxItemAttrs[]):
     *         The items to filter.
     *
     * Returns:
     *     ComboBoxItem[] or ComboBoxItemAttrs[]:
     *     The items that are not already selected.
     */
    #filterSelected<
        T extends ComboBoxItem | ComboBoxItemAttrs,
    >(
        items: T[],
    ): T[] {
        if (!this.#multiple) {
            return items;
        }

        const selectedItems = this.selectedItems;

        return items.filter(item => {
            const id = (item instanceof ComboBoxItem
                        ? item.get('id')
                        : item.id);

            return (id === null ||
                    id === undefined ||
                    selectedItems.get(id) === undefined);
        });
    }

    /**
     * Render the tokens for the selected items.
     *
     * This only applies when ``multiple`` is enabled.
     */
    #renderTokens() {
        const tokensEl = this.#tokensEl;

        if (tokensEl === null) {
            return;
        }

        for (const tokenView of this.#tokenViews) {
            this.stopListening(tokenView);
            tokenView.remove();
        }

        const tokenFieldEl = this.#tokenFieldEl;
        const tokenViews: ComboBoxTokenView[] = [];
        const disabled = this.disabled;

        for (const item of this.selectedItems) {
            const tokenView = craft<ComboBoxTokenView>`
                <${ComboBoxTokenView} model=${item}
                                      disabled=${disabled}
                                      removeItemText=${this.#removeItemText}/>
            `;

            this.listenTo(tokenView, 'removeClicked', () => {
                this.selectedItems.remove(item);
                this.focus();
            });

            tokensEl.insertBefore(tokenView.el, tokenFieldEl);
            tokenViews.push(tokenView);
        }

        this.#tokenViews = tokenViews;
    }

    /**
     * Clear the selection if the field's text no longer matches it.
     *
     * This only applies when ``multiple`` is disabled. Once the user edits
     * the text away from the accepted item, the combo box no longer has a
     * selection, and neither :js:attr:`value` nor the hidden input should
     * keep claiming otherwise.
     */
    #clearStaleValue() {
        const selectedItem = this.#selectedItem;

        if (this.#multiple || selectedItem === null) {
            return;
        }

        if (this.textField.value !== (selectedItem.get('label') || '')) {
            this.#selectedItem = null;
            this.#updateHiddenInput();

            this.trigger('itemRemoved', selectedItem);
            this.trigger('change');
        }
    }

    /**
     * Update the hidden form input to reflect the current selection.
     */
    #updateHiddenInput() {
        const hiddenInputEl = this.#hiddenInputEl;

        if (hiddenInputEl === null) {
            return;
        }

        if (this.#multiple) {
            /*
             * Items without an ID can't be serialized. Leave them out
             * entirely, rather than emitting empty entries that consumers
             * would have to filter back out.
             */
            hiddenInputEl.value = this.selectedItems
                .map(item => item.get('id'))
                .filter(id => id !== null && id !== undefined)
                .join(',');
        } else {
            const selectedItem = this.#selectedItem;

            hiddenInputEl.value =
                (selectedItem !== null
                 ? `${selectedItem.get('id') ?? ''}`
                 : '');
        }
    }

    /**
     * Open the pop-up in response to keyboard navigation.
     *
     * For static items, this will suggest all items matching the current
     * text (or all items, if the field is empty). For asynchronous sources,
     * this will run a query if the current text is long enough.
     */
    #openForNavigation() {
        /*
         * The query runs immediately here, so drop any query the last
         * keystroke scheduled. Otherwise it would fire after the debounce
         * delay and repeat the query that's about to run.
         */
        this.#cancelScheduledQuery();

        const query = this.textField.value;

        if (this.#load === null || query.length >= this.#minLength) {
            this.#runQuery(query);
        }
    }

    /**
     * Position the pop-up relative to the text field.
     *
     * This will attempt to determine whether there's enough space below
     * the field for the pop-up to fully appear. If there is not, the
     * pop-up will appear above the field instead.
     *
     * The pop-up is also shifted horizontally so that it stays within the
     * viewport. Options don't wrap, so a long label can easily make the
     * pop-up wider than the field.
     *
     * Note that the vertical logic here mirrors
     * :js:func:`BaseMenuHandleView._updateMenuPosition`. The two should be
     * consolidated into a shared helper, but that's left to its own change
     * so menu positioning isn't disturbed by this one.
     */
    #updatePopupPosition() {
        const el = this.el;
        const popupEl = this.#popupEl;

        const elRect = el.getBoundingClientRect();
        const elY1 = elRect.top +
                     window.pageYOffset -
                     document.documentElement.clientTop;
        const elY2 = elY1 + el.clientHeight;
        const pageY2 = window.pageYOffset + window.innerHeight;
        const popupHeight = popupEl.offsetHeight;

        const opensUp = (pageY2 < elY2 + popupHeight &&
                         elY1 - window.pageYOffset - popupHeight >= 0);

        el.classList.toggle('-opens-up', opensUp);

        const offsetPx = `${el.clientHeight}px`;
        popupEl.style.top = (opensUp ? '' : offsetPx);
        popupEl.style.bottom = (opensUp ? offsetPx : '');

        /*
         * Position the pop-up laterally according to the viewport width.
         *
         * The pop-up stays left-aligned with the field, sliding left only
         * as far as it takes to keep its right edge on screen, and never
         * past the left edge of the viewport.
         *
         * Note that this deliberately doesn't right-align the pop-up with
         * the field the way a menu right-aligns with its handle. A menu
         * hangs off its handle, so either edge is a natural anchor. This
         * pop-up lines up with the text being typed, so moving it any
         * further than the overflow requires just makes it harder to
         * follow.
         */
        const popupWidth = popupEl.offsetWidth;
        const windowWidth = document.documentElement.clientWidth;
        const elLeft = elRect.left;
        const maxPopupLeft = Math.max(0, windowWidth - popupWidth);
        const popupLeft = Math.max(0, Math.min(elLeft, maxPopupLeft));

        const newPopupLeft = (popupLeft === elLeft
                              ? ''
                              : `${popupLeft - elLeft}px`);

        popupEl.style.left = newPopupLeft;

        /*
         * The joined state insets the pop-up using both "left" and "right".
         * Drop "right" when shifting, so the pop-up moves instead of being
         * stretched between the two.
         */
        popupEl.style.right = (newPopupLeft ? 'auto' : '');
    }

    /**
     * Handle a focusout event.
     *
     * If focus is moving outside of the combo box, the pop-up will be
     * closed.
     *
     * Args:
     *     evt (FocusEvent):
     *         The focus event.
     */
    private _onFocusOut(evt: FocusEvent) {
        const relatedTarget = evt.relatedTarget as HTMLElement;

        if (!this.el.contains(relatedTarget)) {
            this.close();
        }
    }

    /**
     * Handle an input event on the text field.
     *
     * This will run (or schedule) a query for the typed text, or close the
     * pop-up if the text is too short.
     *
     * Any single-selection value is cleared first, since the typed text no
     * longer represents it.
     */
    private _onInput() {
        const query = this.textField.value;

        this.#clearStaleValue();

        if (query.length < this.#minLength) {
            /* Invalidate any scheduled or in-flight query. */
            this.#cancelScheduledQuery();
            this.#querySequence++;
            this.el.classList.remove('-is-loading');

            this.suggestions.reset([]);
            this.close();

            return;
        }

        if (this.#load === null) {
            this.#runQuery(query);
        } else {
            this.#scheduleQuery(query);
        }
    }

    /**
     * Schedule a query to run after the debounce delay.
     *
     * Any previously-scheduled query will be replaced.
     *
     * Args:
     *     query (string):
     *         The query to run.
     */
    #scheduleQuery(query: string) {
        this.#cancelScheduledQuery();

        this.#queryTimeoutHandle = setTimeout(
            () => {
                this.#queryTimeoutHandle = null;
                this.#runQuery(query);
            },
            this.#debounceMS);
    }

    /**
     * Cancel any scheduled query.
     */
    #cancelScheduledQuery() {
        if (this.#queryTimeoutHandle !== null) {
            clearTimeout(this.#queryTimeoutHandle);
            this.#queryTimeoutHandle = null;
        }
    }

    /**
     * Handle a keydown event on the text field.
     *
     * See the view's docs for the list of supported keyboard shortcuts.
     *
     * Args:
     *     evt (KeyboardEvent):
     *         The keydown event.
     */
    private _onKeyDown(evt: KeyboardEvent) {
        /*
         * A disabled input won't deliver these in a browser, but don't
         * depend on that. Nothing here should be reachable while the combo
         * box is disabled.
         */
        if (this.disabled) {
            return;
        }

        const isOpen = this.isOpen;
        const curIndex = this.#curIndex;

        switch (evt.key) {
            /* Highlight the next item, or open the pop-up. */
            case 'ArrowDown': /* Fall through */

            case 'Down':
                evt.preventDefault();
                evt.stopPropagation();

                if (isOpen) {
                    this.#setCurrentItem(curIndex === null
                                         ? 0
                                         : curIndex + 1);
                } else {
                    this.#openForNavigation();
                }

                break;


            /* Highlight the previous item, or open the pop-up. */
            case 'ArrowUp': /* Fall through */

            case 'Up':
                evt.preventDefault();
                evt.stopPropagation();

                if (isOpen) {
                    this.#setCurrentItem(curIndex === null
                                         ? -1
                                         : curIndex - 1);
                } else {
                    this.#openForNavigation();
                }

                break;


            /* Highlight the first item. */
            case 'PageUp':
                if (isOpen) {
                    evt.preventDefault();
                    evt.stopPropagation();

                    this.#setCurrentItem(0);
                }

                break;


            /* Highlight the last item. */
            case 'PageDown':
                if (isOpen) {
                    evt.preventDefault();
                    evt.stopPropagation();

                    this.#setCurrentItem(-1);
                }

                break;


            /* Accept the highlighted item, or the typed text. */
            case 'Enter':
                if (isOpen && curIndex !== null) {
                    /* Keep the form from being submitted. */
                    evt.preventDefault();
                    evt.stopPropagation();

                    this.#acceptItem(curIndex);
                } else if (this.#multiple &&
                           this.#allowCustomTokens &&
                           this.#acceptCustomToken()) {
                    /*
                     * The typed text became an item. Keep the form from
                     * being submitted, so another value can be typed.
                     * With nothing typed, Enter falls through to the
                     * form as normal.
                     */
                    evt.preventDefault();
                    evt.stopPropagation();
                }

                break;


            /* Accept the highlighted item. */
            case 'Tab':
                if (isOpen) {
                    if (curIndex !== null) {
                        /*
                         * Keep focus in the field, so the completion can
                         * be seen and (in multiple mode) another value
                         * can be typed. Pressing Tab again will move
                         * focus on as normal.
                         */
                        evt.preventDefault();
                        evt.stopPropagation();

                        this.#acceptItem(curIndex);
                    } else {
                        this.close();
                    }
                }

                break;


            /*
             * Accept the highlighted item or the typed text when
             * separating values.
             *
             * This provides parity with legacy comma-separated
             * auto-complete fields.
             */
            case ',':
                if (this.#multiple && isOpen && curIndex !== null) {
                    /* Keep the comma from being typed. */
                    evt.preventDefault();
                    evt.stopPropagation();

                    this.#acceptItem(curIndex);
                } else if (this.#multiple && this.#allowCustomTokens) {
                    /*
                     * The comma only ever separates values. Keep it from
                     * being typed, whether or not there was text to
                     * select.
                     */
                    evt.preventDefault();
                    evt.stopPropagation();

                    this.#acceptCustomToken();
                }

                break;


            /* Move the last selected item back into the field. */
            case 'Backspace':
                if (this.#multiple && !this.textField.value) {
                    const lastItem = this.selectedItems.last();

                    if (lastItem) {
                        /*
                         * Un-tokenize the item rather than discarding
                         * it, so it can be edited or removed a character
                         * at a time. Keep the default handling from
                         * deleting the last character of the restored
                         * text.
                         */
                        evt.preventDefault();
                        evt.stopPropagation();

                        this.selectedItems.remove(lastItem);
                        this.textField.value =
                            lastItem.get('label') ||
                            String(lastItem.get('id') ?? '');
                    }
                }

                break;


            /* Close the pop-up, or clear the field. */
            case 'Escape':
                if (isOpen) {
                    evt.preventDefault();
                    evt.stopPropagation();

                    this.close();
                } else if (this.textField.value) {
                    evt.preventDefault();
                    evt.stopPropagation();

                    this.textField.value = '';
                    this.#clearStaleValue();
                }

                break;

            default:
                break;
        }
    }

    /**
     * Handle a click on an option.
     *
     * This will accept the clicked option.
     *
     * Args:
     *     evt (MouseEvent):
     *         The click event.
     */
    private _onOptionClick(evt: MouseEvent) {
        evt.stopPropagation();
        evt.preventDefault();

        const index = this.#getOptionIndexForEvent(evt);

        if (index !== null) {
            this.#acceptItem(index);
        }
    }

    /**
     * Handle a mouseenter event on an option.
     *
     * This will highlight the option under the mouse.
     *
     * Args:
     *     evt (MouseEvent):
     *         The mouseenter event.
     */
    private _onOptionMouseEnter(evt: MouseEvent) {
        const index = this.#getOptionIndexForEvent(evt);

        if (index !== null) {
            this.#setCurrentItem(index);
        }
    }

    /**
     * Handle a mousedown event on the pop-up.
     *
     * This keeps DOM focus on the text field while interacting with the
     * pop-up.
     *
     * Args:
     *     evt (MouseEvent):
     *         The mousedown event.
     */
    private _onPopupMouseDown(evt: MouseEvent) {
        evt.preventDefault();
    }

    /**
     * Return the option index for an event's target.
     *
     * Args:
     *     evt (Event):
     *         The event.
     *
     * Returns:
     *     number:
     *     The index of the option, or ``null`` if not found.
     */
    #getOptionIndexForEvent(evt: Event): number | null {
        const optionEl = (evt.target as HTMLElement)
            .closest<HTMLLIElement>('.ink-c-combo-box__option');
        const itemIndex = optionEl?.dataset.itemIndex;

        return (itemIndex === undefined
                ? null
                : parseInt(itemIndex, 10));
    }
}


/**
 * Status text shown in the pop-up.
 *
 * Version Added:
 *     0.10
 */
const _statusText = {
    error: 'Failed to load matching items.',
    loading: 'Loading...',
    noResults: 'No results found.',
};


/**
 * The default filter for static items.
 *
 * This matches items case-insensitively against their labels.
 *
 * Version Added:
 *     0.10
 *
 * Args:
 *     query (string):
 *         The query to match.
 *
 *     items (ComboBoxItem[]):
 *         The items to filter.
 *
 * Returns:
 *     ComboBoxItem[]:
 *     The items matching the query.
 */
function _defaultFilterItems(
    query: string,
    items: ComboBoxItem[],
): ComboBoxItem[] {
    const normQuery = query.toLowerCase();

    return items.filter(
        item => (item.get('label') || '').toLowerCase().includes(normQuery));
}


/**
 * A token for a selected item in a combo box.
 *
 * This shows the item's label and a button used to remove the item from
 * the selection. Clicking the button emits a ``removeClicked`` event.
 *
 * Version Added:
 *     0.10
 */
@spina
class ComboBoxTokenView extends BaseComponentView<
    ComboBoxItem,
    HTMLLIElement
> {
    static tagName = 'li';
    static className = 'ink-c-combo-box__token';

    static events: EventsHash = {
        'click .ink-c-combo-box__token-remove': '_onRemoveClick',
    };

    static modelEvents: EventsHash = {
        'change': 'render',
    };

    /**********************
     * Instance variables *
     **********************/

    /** Whether the token is disabled. */
    #disabled = false;

    /** The button used to remove the item from the selection. */
    #removeEl: HTMLButtonElement = null;

    /** The label for the remove button, with a ``{label}`` placeholder. */
    #removeItemText = 'Remove {label}';

    /**
     * Return whether the token is disabled.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the token is disabled. ``false`` if it is not.
     */
    get disabled(): boolean {
        return this.#disabled;
    }

    /**
     * Set whether the token is disabled.
     *
     * A disabled token can't be removed, and its button is taken out of
     * the tab order.
     *
     * Args:
     *     newDisabled (boolean):
     *         ``true`` if the token should be disabled. ``false`` if it
     *         should not.
     */
    set disabled(newDisabled: boolean) {
        this.#disabled = newDisabled;

        if (this.#removeEl !== null) {
            this.#removeEl.disabled = newDisabled;
        }
    }

    /**
     * Handle the initial rendering of the component.
     *
     * This will store the initial disabled state, if one was provided.
     */
    protected onComponentInitialRender() {
        const options = this.initialComponentState.options as {
            disabled?: boolean;
            removeItemText?: string;
        };

        this.#disabled = !!options.disabled;
        this.#removeItemText = options.removeItemText ||
                               this.#removeItemText;
    }

    /**
     * Render the token.
     */
    protected onRender() {
        const label = this.model.get('label');
        const removeLabel = this.#removeItemText.replace('{label}', label);

        const removeEl = paint<HTMLButtonElement>`
            <button class="ink-c-combo-box__token-remove"
                    type="button"
                    aria-label="${removeLabel}"
                    title="${removeLabel}"></button>
        `;
        removeEl.disabled = this.#disabled;
        this.#removeEl = removeEl;

        renderInto(
            this.el,
            paint`
                <span class="ink-c-combo-box__token-label">${label}</span>
                ${removeEl}
            `,
            {
                empty: true,
            });
    }

    /**
     * Handle a click on the remove button.
     *
     * This will emit a ``removeClicked`` event.
     *
     * Args:
     *     evt (MouseEvent):
     *         The click event.
     */
    private _onRemoveClick(evt: MouseEvent) {
        evt.stopPropagation();
        evt.preventDefault();

        this.trigger('removeClicked');
    }
}


/**
 * An option shown in a combo box's listbox.
 *
 * This renders the item's label and optional description, or custom
 * content from the combo box's ``renderItem`` function.
 *
 * Version Added:
 *     0.10
 */
@spina
class ComboBoxOptionView extends BaseComponentView<
    ComboBoxItem,
    HTMLLIElement
> {
    static tagName = 'li';
    static className = 'ink-c-combo-box__option';
    static attributes: ElementAttributes = {
        'role': 'option',
    };

    static modelEvents: EventsHash = {
        'change': 'render',
    };

    /**********************
     * Instance variables *
     **********************/

    /** The function used to render custom content for the item. */
    #renderItem: ComboBoxRenderItemFunc | null = null;

    /**
     * Handle the initial rendering of the component.
     *
     * This will store the custom render function, if one was provided.
     */
    protected onComponentInitialRender() {
        const options = this.initialComponentState.options;

        this.#renderItem =
            (options as {renderItem?: ComboBoxRenderItemFunc}).renderItem ||
            null;
    }

    /**
     * Render the option.
     *
     * This will rebuild the option's content based on the item.
     */
    protected onRender() {
        const el = this.el;
        const model = this.model;
        const renderItem = this.#renderItem;

        if (model.get('disabled')) {
            el.setAttribute('aria-disabled', 'true');
        } else {
            el.removeAttribute('aria-disabled');
        }

        if (renderItem) {
            renderInto(el, renderItem(model), {
                empty: true,
            });
        } else {
            const description = model.get('description');

            renderInto(
                el,
                paint`
                    <span class="ink-c-combo-box__option-label">${
                        model.get('label')
                    }</span>
                    ${description && paint`
                        <span class="ink-c-combo-box__option-description">${
                            description
                        }</span>
                    `}
                `,
                {
                    empty: true,
                });
        }
    }
}
