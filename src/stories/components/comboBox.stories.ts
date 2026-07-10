import {
    type ComboBoxItem,
    type ComboBoxItemAttrs,
    type ComboBoxView,
    ComboBoxItemsCollection,
    craft,
    paint,
} from '../../ink/js';


const FRUITS: ComboBoxItemAttrs[] = [
    {id: 'apple', label: 'Apple', description: 'Crisp and sweet'},
    {id: 'apricot', label: 'Apricot'},
    {id: 'banana', label: 'Banana', description: 'A yellow fruit'},
    {id: 'cherry', label: 'Cherry'},
    {id: 'durian', label: 'Durian', description: 'Divisive', disabled: true},
    {id: 'grape', label: 'Grape'},
    {id: 'orange', label: 'Orange'},
    {id: 'peach', label: 'Peach'},
    {id: 'pear', label: 'Pear'},
    {id: 'plum', label: 'Plum'},
];


export default {
    title: 'Ink/Components/ComboBox',
    tags: ['autodocs'],
    render: ({
        asyncSource,
        loadDelayMS,
        simulateError,
        ...options
    }) => {
        if (asyncSource) {
            options.load = (query: string) => new Promise(
                (resolve, reject) => {
                    setTimeout(() => {
                        if (simulateError) {
                            reject(new Error('Oh no, the server is down.'));
                        } else {
                            const normQuery = query.toLowerCase();

                            resolve(FRUITS.filter(
                                item => item.label.toLowerCase()
                                    .includes(normQuery)));
                        }
                    }, loadDelayMS);
                });
        } else {
            options.items = FRUITS;
        }

        const comboBox = craft<ComboBoxView>`
            <Ink.ComboBox ...${options}/>
        `;

        comboBox.on('itemSelected', item => {
            console.log('Selected item:', item.attributes);
        });

        return paint`
            <div style="min-height: 20em;">
             ${comboBox.el}
            </div>
        `;
    },
    argTypes: {
        ariaLabel: {
            description: 'ARIA label for the field.',
            control: 'text',
        },
        asyncSource: {
            description:
                'Whether to load items asynchronously, with a delay.',
            control: 'boolean',
        },
        disabled: {
            description: 'Whether the combo box is disabled.',
            control: 'boolean',
        },
        hintText: {
            description: 'A hint shown below the suggested items.',
            control: 'text',
        },
        iconName: {
            description: 'The icon class name to show in front of the field.',
            control: 'text',
        },
        joined: {
            description:
                'Whether the combo box is joined with surrounding UI.',
            control: 'boolean',
        },
        loadDelayMS: {
            description: 'Delay in milliseconds for asynchronous loads.',
            control: 'number',
        },
        minLength: {
            description:
                'Minimum typed characters needed to suggest items.',
            control: 'number',
        },
        multiple: {
            description: 'Whether multiple items can be selected.',
            control: 'boolean',
        },
        placeholder: {
            description: 'Placeholder text for the field.',
            control: 'text',
        },
        selectFirst: {
            description:
                'Whether to automatically highlight the first item.',
            control: 'boolean',
        },
        simulateError: {
            description:
                'Whether asynchronous loads should fail with an error.',
            control: 'boolean',
        },
    },
    args: {
        ariaLabel: 'Fruits',
        asyncSource: false,
        loadDelayMS: 1000,
        placeholder: 'Find a fruit...',
    },
};


export const StaticItems = {};


export const AsyncItems = {
    args: {
        asyncSource: true,
    },
};


export const AsyncError = {
    args: {
        asyncSource: true,
        simulateError: true,
    },
};


export const SelectFirst = {
    args: {
        selectFirst: true,
    },
};


/**
 * Legacy-style tab completion.
 *
 * The first result is highlighted automatically, so pressing Tab (or
 * Enter) completes to it without needing to move the highlight. A hint
 * below the results points this out, matching the behavior of Review
 * Board's legacy rbautocomplete fields.
 */
export const TabCompletion = {
    args: {
        hintText: 'Press Tab to auto-complete.',
        selectFirst: true,
    },
};


export const Multiple = {
    args: {
        hintText: 'Press Tab to auto-complete.',
        multiple: true,
        selectFirst: true,
    },
};


export const MultipleAsync = {
    args: {
        asyncSource: true,
        multiple: true,
    },
};


/**
 * Multiple selection with a consumer-rendered list below the field.
 *
 * This is the pattern for building related-object selectors: the combo
 * box is joined into a shared panel, tracking the selection, and the
 * consumer renders the selection below by listening to events on
 * ``selectedItems``.
 */
export const MultipleExternalList = {
    args: {
        iconName: 'ink-i-search',
        joined: true,
        multiple: true,
        placeholder: 'Search fruits...',
        selectFirst: true,
        showSelected: false,
    },
    render: (options: Record<string, unknown>) => {
        options.items = FRUITS;

        const comboBox = craft<ComboBoxView>`
            <Ink.ComboBox ...${options}/>
        `;

        const listEl = paint<HTMLUListElement>`
            <ul style="list-style: none; margin: 0; padding: 0;
                       border-top: var(--ink-u-border-thin) solid
                                   var(--ink-p-container-border-color-weak);">
            </ul>
        `;

        const rowEls = new Map<ComboBoxItem, HTMLLIElement>();

        comboBox.selectedItems.on('add', (item: ComboBoxItem) => {
            const onRemoveClicked =
                () => comboBox.selectedItems.remove(item);
            const label = item.get('label');

            const rowEl = paint<HTMLLIElement>`
                <li style="display: flex; align-items: center; gap: 0.75em;
                           padding: 0.5em 0.75em;
                           border-bottom: var(--ink-u-border-thin) solid
                               var(--ink-p-container-border-color-weak);">
                 <span style="flex: none; width: 2.25em; height: 2.25em;
                              border-radius: 50%;
                              display: grid; place-items: center;
                              font-weight: bold;
                              font-size: var(--ink-u-font-sm);
                              background: var(--ink-p-blue-200);
                              color: var(--ink-p-blue-800);">
                  ${label.substring(0, 2).toUpperCase()}
                 </span>
                 <span style="flex: 1; display: flex;
                              flex-direction: column;">
                  <strong>${label}</strong>
                  <span style="color: var(--ink-p-fg-weak);
                               font-size: var(--ink-u-font-sm);">
                   ${item.get('description') || ''}
                  </span>
                 </span>
                 <Ink.Button onClick=${onRemoveClicked}>Remove</Ink.Button>
                </li>
            `;

            rowEls.set(item, rowEl);
            listEl.appendChild(rowEl);
        });

        comboBox.selectedItems.on('remove', (item: ComboBoxItem) => {
            rowEls.get(item)?.remove();
            rowEls.delete(item);
        });

        return paint`
            <div style="min-height: 24em;">
             <div style="width: 30em;
                         background: var(--ink-p-container-bg);
                         border: var(--ink-g-border-container);
                         border-radius: var(--ink-u-border-radius-m);
                         box-shadow: var(--ink-g-shadow-std);">
              ${comboBox.el}
              ${listEl}
             </div>
            </div>
        `;
    },
};


export const Disabled = {
    args: {
        disabled: true,
    },
};


interface Person {
    id: string;
    name: string;
    role: string;
    username: string;
}


const PEOPLE: Person[] = [
    {id: 'apark', name: 'Amelia Park', role: 'Maintainer', username: 'apark'},
    {id: 'dchen', name: 'David Chen', role: 'Reviewer', username: 'dchen'},
    {id: 'pnair', name: 'Priya Nair', role: 'Reviewer', username: 'pnair'},
    {id: 'mwebb', name: 'Marcus Webb', role: 'Reviewer', username: 'mwebb'},
    {id: 'sramos', name: 'Sofia Ramos', role: 'Maintainer',
     username: 'sramos'},
    {id: 'lfischer', name: 'Lena Fischer', role: 'Reviewer',
     username: 'lfischer'},
    {id: 'tokafor', name: 'Tom Okafor', role: 'Reviewer',
     username: 'tokafor'},
    {id: 'gliu', name: 'Grace Liu', role: 'Reviewer', username: 'gliu'},
    {id: 'rdesai', name: 'Ravi Desai', role: 'Reviewer', username: 'rdesai'},
    {id: 'nvolkov', name: 'Nina Volkov', role: 'Maintainer',
     username: 'nvolkov'},
];


const AVATAR_COLORS: [string, string][] = [
    ['var(--ink-p-blue-200)', 'var(--ink-p-blue-800)'],
    ['var(--ink-p-green-200)', 'var(--ink-p-green-800)'],
    ['var(--ink-p-mustard-500)', 'var(--ink-p-yellow-100)'],
    ['var(--ink-p-cyan-500)', 'var(--ink-p-white)'],
    ['var(--ink-p-red-200)', 'var(--ink-p-red-800)'],
    ['var(--ink-p-brown-500)', 'var(--ink-p-white)'],
];


function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}


function getAvatarColors(id: string): [string, string] {
    let hash = 0;

    for (const c of id) {
        hash = ((hash * 31) + c.charCodeAt(0)) >>> 0;
    }

    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}


function paintAvatar(
    person: Person,
    size: string,
): HTMLElement {
    const [bg, fg] = getAvatarColors(person.id);

    return paint`
        <span style="flex: none; width: ${size}; height: ${size};
                     border-radius: 50%;
                     display: grid; place-items: center;
                     font-size: var(--ink-u-font-sm); font-weight: bold;
                     background: ${bg}; color: ${fg};">
         ${getInitials(person.name)}
        </span>
    `;
}


/**
 * An example related user selector.
 *
 * This composes a joined combo box into a panel: people are searched by
 * name or username, options render custom avatar rows, and selected
 * users appear as removable rows below the field.
 */
export const RelatedUserSelector = {
    render: () => {
        const items: ComboBoxItemAttrs[] = PEOPLE.map(person => ({
            data: person,
            id: person.id,
            label: person.name,
        }));

        const selectedItems = new ComboBoxItemsCollection(
            items.slice(0, 3));

        const filterItems = (
            query: string,
            allItems: ComboBoxItem[],
        ): ComboBoxItem[] => {
            const normQuery = query.toLowerCase();

            return allItems.filter(item => {
                const person = item.get('data') as Person;

                return (person.name.toLowerCase().includes(normQuery) ||
                        person.username.includes(normQuery));
            });
        };

        const renderItem = (item: ComboBoxItem): HTMLElement => {
            const person = item.get('data') as Person;

            return paint`
                <span style="display: flex; align-items: center;
                             gap: var(--ink-u-spacing-sm); flex: 1;
                             min-width: 0;">
                 ${paintAvatar(person, '2.25em')}
                 <span style="flex: 1; min-width: 0; display: flex;
                              flex-direction: column; line-height: 1.25;">
                  <strong>${person.name}</strong>
                  <span style="font-family: var(--ink-ff-monospace);
                               font-size: var(--ink-u-font-sm);
                               opacity: 0.75;">
                   @${person.username}
                  </span>
                 </span>
                 <span style="flex: none;
                              font-size: var(--ink-u-font-sm);
                              opacity: 0.75;">
                  ${person.role}
                 </span>
                </span>
            `;
        };

        const comboBox = craft<ComboBoxView>`
            <Ink.ComboBox iconName="ink-i-search"
                          joined
                          multiple
                          filterItems=${filterItems}
                          items=${items}
                          placeholder="Search people..."
                          renderItem=${renderItem}
                          selectFirst
                          selectedItems=${selectedItems}
                          showSelected=${false}/>
        `;

        const listEl = paint<HTMLUListElement>`
            <ul style="list-style: none; margin: 0; padding: 0;
                       border-top: var(--ink-u-border-thin) solid
                                   var(--ink-p-container-border-color-weak);">
            </ul>
        `;

        const emptyEl = paint<HTMLDivElement>`
            <div class="user-empty">
             No users added yet.<br/>Search above to add people.
            </div>
        `;

        const rowEls = new Map<ComboBoxItem, HTMLLIElement>();

        function update() {
            emptyEl.hidden = (selectedItems.length > 0);
        }

        function addRow(item: ComboBoxItem) {
            const person = item.get('data') as Person;
            const onRemoveClicked = () => selectedItems.remove(item);

            const rowEl = paint<HTMLLIElement>`
                <li class="user-row"
                    style="display: flex; align-items: center;
                           gap: var(--ink-u-spacing-sm);
                           padding: 0.75em 1em;
                           border-bottom: var(--ink-u-border-thin) solid
                               var(--ink-p-container-border-color-weak);">
                 ${paintAvatar(person, '2.5em')}
                 <span style="flex: 1; min-width: 0; display: flex;
                              flex-direction: column; line-height: 1.25;">
                  <strong>${person.name}</strong>
                  <span style="font-family: var(--ink-ff-monospace);
                               font-size: var(--ink-u-font-sm);
                               color: var(--ink-p-fg-weak);">
                   @${person.username}
                  </span>
                 </span>
                 <span style="flex: none; font-size: var(--ink-u-font-s);
                              color: var(--ink-p-fg-weak);">
                  ${person.role}
                 </span>
                 <button class="user-remove"
                         type="button"
                         aria-label="Remove user"
                         title="Remove user"
                         onclick=${onRemoveClicked}>
                  <span class="ink-i-close"></span>
                 </button>
                </li>
            `;

            rowEls.set(item, rowEl);
            listEl.appendChild(rowEl);
            update();
        }

        comboBox.selectedItems.on('add', addRow);
        comboBox.selectedItems.on('remove', (item: ComboBoxItem) => {
            rowEls.get(item)?.remove();
            rowEls.delete(item);
            update();
        });

        selectedItems.each(addRow);
        update();

        return paint`
            <div style="min-height: 34em; width: 34em;">
             <style>
              .user-row:hover {
                  background: var(--ink-p-container-hover-bg);
              }
              .user-remove {
                  flex: none;
                  display: grid;
                  place-items: center;
                  width: 2em;
                  height: 2em;
                  border: 0;
                  border-radius: var(--ink-u-border-radius-s);
                  background: transparent;
                  color: var(--ink-p-fg-weak);
                  cursor: pointer;
              }
              .user-remove:hover {
                  background: var(--ink-p-container-hover-bg);
                  color: var(--ink-p-fg);
              }
              .user-empty {
                  padding: 2em 1em;
                  text-align: center;
                  font-size: var(--ink-u-font-m);
                  line-height: 1.5;
                  color: var(--ink-p-fg-weak);
              }
             </style>
             <label style="display: block;
                           font-size: var(--ink-u-font-l);
                           font-weight: bold; margin-bottom: 4px;">
              Users
             </label>
             <p style="margin: 0 0 var(--ink-u-spacing-sm);
                       font-size: var(--ink-u-font-m); line-height: 1.5;
                       color: var(--ink-p-fg-weak);">
              Add the people who should review this change. Type a name
              or username to search.
             </p>
             <div style="background: var(--ink-p-container-bg);
                         border: var(--ink-g-border-container);
                         border-radius: var(--ink-u-border-radius-m);
                         box-shadow: var(--ink-g-shadow-std);">
              ${comboBox.el}
              ${listEl}
              ${emptyEl}
             </div>
            </div>
        `;
    },
};
