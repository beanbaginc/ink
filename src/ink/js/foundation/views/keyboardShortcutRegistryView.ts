/**
 * A view for managing keyboard shortcut events on an element.
 *
 * Version Added:
 *     0.5
 */

import {
    type EventsHash,
    BaseView,
    spina,
} from '@beanbag/spina';

import {
    type KeyboardShortcutRegistry,
} from '../models/keyboardShortcutRegistry';


/**
 * A view for managing keyboard shortcut events on an element.
 *
 * This listens for keydown events on the bound element and invokes any
 * shortcuts registered on the associated registry model. It can be used to
 * bind keyboard shortcuts to the document or to a specific element and its
 * ancestors.
 *
 * Version Added:
 *     0.5
 */
@spina
export class KeyboardShortcutRegistryView extends BaseView<
    KeyboardShortcutRegistry,
    HTMLElement
> {
    static events: EventsHash = {
        'keydown': '_onKeyDown',
    };

    /**
     * A mapping of registered elements to views.
     */
    static registryViews: WeakMap<
        HTMLElement,
        KeyboardShortcutRegistryView
    > = new WeakMap();

    /**
     * Return the nearest shortcut registry view in the element tree.
     *
     * This will scan up the element tree, looking for the nearest
     * registry view, and return it if found.
     *
     * Args:
     *     startEl (HTMLElement):
     *         The starting element in the tree to search.
     *
     * Returns:
     *     KeyboardShortcutRegistryView:
     *     The registry view, or ``null`` if not found.
     */
    static findNearestRegistryView(
        startEl: HTMLElement,
    ): KeyboardShortcutRegistryView | null {
        const registryViews = KeyboardShortcutRegistryView.registryViews;

        for (let el = startEl; el !== null; el = el.parentElement) {
            const view = registryViews.get(el);

            if (view) {
                return view;
            }
        }

        return null;
    }

    /**
     * Return the nearest shortcut registry in the element tree.
     *
     * This will scan up the element tree, looking for the nearest
     * registry view, and return its registry if found.
     *
     * Args:
     *     startEl (HTMLElement):
     *         The starting element in the tree to search.
     *
     * Returns:
     *     KeyboardShortcutRegistry:
     *     The registry, or ``null`` if not found.
     */
    static findNearestRegistry(
        startEl: HTMLElement,
    ): KeyboardShortcutRegistry | null {
        const registryView =
            KeyboardShortcutRegistryView.findNearestRegistryView(startEl);

        return registryView ? registryView.model : null;
    }

    /**
     * Initialize the view.
     *
     * This will register the view with the provided element for future lookup.
     */
    initialize(...args) {
        super.initialize(...args);

        const registryViews = KeyboardShortcutRegistryView.registryViews;
        const el = this.el;

        if (registryViews.has(el)) {
            console.warn(
                'A KeyboardShortcutRegistryView is already registered for ' +
                'element %o',
                el);
        } else {
            registryViews.set(el, this);
        }
    }

    /**
     * Handle the removal of the view.
     *
     * This will disassociate the view's registration from the element.
     */
    protected onRemove() {
        KeyboardShortcutRegistryView.registryViews.delete(this.el);
    }

    /**
     * Handle a keydown event.
     *
     * If the keydown maps to a registered shortcut, its handler will be
     * invoked.
     *
     * Args:
     *     e (KeyboardEvent):
     *         The keydown event.
     */
    _onKeyDown(e: KeyboardEvent) {
        const shortcut = this.model.getShortcut(e.key, {
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
        });

        if (shortcut) {
            e.preventDefault();
            e.stopPropagation();

            shortcut.onInvoke();
        }
    }
}
