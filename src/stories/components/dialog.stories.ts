import {
    DialogSize,
    DialogView,
    craft,
    paint,
} from '../../ink/js';


export default {
    title: 'Ink/Components/Dialog',
    tags: ['autodocs'],
    render: ({
        ...args
    }) => {
        const dialogView = craft<DialogView>`
            <Ink.Dialog title="Dialog title" ...${args}>
             <Ink.Dialog.Body>
              Dialog content.
             </>
             <Ink.Dialog.PrimaryActions>
              <Ink.Button type="primary"
                          onClick=${() => dialogView.close()}>
               OK
              </Ink.Button>
              <Ink.Button type="danger"
                          onClick=${() => dialogView.close()}>
               Delete
              </Ink.Button>
             </>
             <Ink.Dialog.SecondaryActions>
              <Ink.Button onClick=${() => dialogView.close()}>
               Cancel
              </Ink.Button>
             </>
            </>
        `;

        function open(modal: boolean) {
            const dialogStyle = dialogView.el.style;

            if (modal) {
                dialogStyle.removeProperty('position');
                dialogStyle.removeProperty('top');
                dialogStyle.removeProperty('left');
                dialogStyle.removeProperty('transform');
            } else {
                dialogStyle.position = 'fixed';
                dialogStyle.top = '50%';
                dialogStyle.left = '50%';
                dialogStyle.transform = 'translate(-50%, -50%)';
            }

            dialogView.open({
                modal: modal,
            });
        }

        return paint`
            <div style="height: 250px">
             ${dialogView.el}
             <div style="display: flex; gap: 10px;">
              <Ink.Button onClick=${() => open(false)}>
               Show non-modal
              </>
              <Ink.Button onClick=${() => open(true)}>
               Show modal
              </>
             </div>
            </div>
        `;
    },
    argTypes: {
        canSuppress: {
            description: 'Whether a suppress checkbox is added.',
            control: 'boolean',
        },
        size: {
            description: 'The size of the dialog.',
            control: 'radio',
            options: Object.values(DialogSize),
        },
        suppressText: {
            description: 'Custom text for the suppression checkbox.',
            control: 'text',
        },
    },
    args: {
        size: DialogSize.FIT,
    },
};


export const Standard = {};
