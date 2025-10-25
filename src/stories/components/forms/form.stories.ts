import {
    paint,
    renderInto,
} from '../../../ink/js';


enum FormLayoutType {
    ALIGNED = 'aligned',
    VERTICAL = 'vertical',
    CENTERED = 'centered',
}

enum ShowActionsType {
    NONE = 'none',
    PRIMARY_ONLY = 'primary only',
    PRIMARY_SECONDARY = 'primary + secondary',
}


export default {
    title: 'Ink/Components/Forms/Form',
    tags: ['autodocs'],
    render: ({
        formLayout,
        showActions,
    }) => {
        let actionsEl: HTMLElement;

        if (showActions !== ShowActionsType.NONE) {
            actionsEl = paint<HTMLElement>`<div class="ink-c-form__actions"/>`;

            const primaryActionEls = paint`
                <button class="ink-c-form__action ink-c-button -is-primary">
                 Save
                </button>
                <div class="ink-c-form__action">
                 <button class="ink-c-button">
                  Save and Continue
                 </button>
                </div>
            `;

            const secondaryActionEls = paint`
                <button class="ink-c-form__action ink-c-button -is-danger">
                 Delete
                </button>
                <div class="ink-c-form__action">
                 <button class="ink-c-button">
                  Cancel
                 </button>
                </div>
            `;

            if (showActions === ShowActionsType.PRIMARY_ONLY) {
                renderInto(actionsEl, paint`
                    <div class="ink-c-form__actions-primary">
                     ${primaryActionEls}
                    </div>
                `);
            } else if (showActions === ShowActionsType.PRIMARY_SECONDARY) {
                renderInto(actionsEl, paint`
                    <div class="ink-c-form__actions-primary">
                     ${primaryActionEls}
                    </div>
                    <div class="ink-c-form__actions-secondary">
                     ${secondaryActionEls}
                    </div>
                `);
            }
        }

        let formClass = 'ink-c-form';

        if (formLayout === FormLayoutType.ALIGNED) {
            formClass += ' -is-aligned';
        } else if (formLayout === FormLayoutType.CENTERED) {
            formClass += ' -is-centered';
        }

        return paint`
            <form class="${formClass}">
             <div class="ink-c-form__fields">
              <Ink.TextFormField
                  placeholder="Jane Smith"
                  label="Name Field"
                  required="true" />
              <Ink.DateFormField
                  label="Birthday"/>
              <Ink.ColorFormField
                  label="Favorite Color"
                  helpHTML="Choose your favorite color"/>
              <Ink.CheckBoxFormField
                  label="Active"/>
              <Ink.TextAreaFormField
                  label="Write a Poem" />
             </div>
             <fieldset class="ink-c-form-fieldset">
              <legend>
               Fieldset with legend
              </legend>
              <div class="ink-c-form__fields">
               <Ink.TextFormField
                   placeholder="Jane Smith"
                   label="Name Field"
                   required="true" />
              </div>
             </fieldset>
             ${actionsEl}
            </form>
        `;
    },
    argTypes: {
        formLayout: {
            description: 'The form layout',
            control: 'radio',
            options: [
                FormLayoutType.ALIGNED,
                FormLayoutType.VERTICAL,
                FormLayoutType.CENTERED,
            ],
        },
        showActions: {
            description: 'The mode used to show actions.',
            control: 'radio',
            options: [
                ShowActionsType.NONE,
                ShowActionsType.PRIMARY_ONLY,
                ShowActionsType.PRIMARY_SECONDARY,
            ],
        },
    },
    args: {
        formLayout: FormLayoutType.VERTICAL,
        showActions: ShowActionsType.PRIMARY_SECONDARY,
    },
};


export const Standard = {
    args: {
        showActions: ShowActionsType.NONE,
    },
};


export const WithActions = {
    args: {
        showActions: ShowActionsType.PRIMARY_SECONDARY,
    },
};


export const WithPrimaryActionsOnly = {
    args: {
        showActions: ShowActionsType.PRIMARY_ONLY,
    },
};


export const LayoutAligned = {
    args: {
        formLayout: FormLayoutType.ALIGNED,
        showActions: ShowActionsType.PRIMARY_SECONDARY,
    },
};
