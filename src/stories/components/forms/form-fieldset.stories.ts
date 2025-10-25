import {
    paint,
    renderInto,
} from '../../../ink/js';


export default {
    title: 'Ink/Components/Forms/FormFieldset',
    tags: ['autodocs'],
    render: ({
        hasDescription,
        hasLegend,
        isCollapsible,
        isCollapsed,
    }) => {
        const legend = hasLegend
            ? paint`<legend>Legend</legend>`
            : null;
        const description = hasDescription
            ? paint`
                <div class="ink-c-form-fieldset__description">
                 Description text.
                </div>
            `
            : null;

        return paint`
            <form class="ink-c-form">
             <fieldset class="ink-c-form-fieldset">
              ${legend}
              ${description}
              <Ink.TextFormField
                  placeholder="Jane Smith"
                  label="Name Field"
                  required="true" />
              <Ink.DateFormField
                  label="Birthday"/>
             </fieldset>
            </form>
        `;
    },
    argTypes: {
        isCollapsible: {
            description: 'Whether the fieldset can be collapsed.',
            control: 'boolean',
        },
        isCollapsed: {
            description: 'Whether the fieldset is collapsed.',
            control: 'boolean',
        },
        hasDescription: {
            description: 'Whether the fieldset has a description.',
            control: 'boolean',
        },
        hasLegend: {
            description: 'Whether the fieldset has a legend.',
            control: 'boolean',
        },
    },
    args: {
        hasDescription: false,
        hasLegend: true,
        isCollapsible: false,
        isCollapsed: false,
    },
};


export const Standard = {
};
