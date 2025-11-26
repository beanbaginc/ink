import {
    DialogActionType,
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
        function onDelete() {
            return new Promise<void>(done => {
                setTimeout(() => {
                    alert('Deleted. Please close now.');
                    done();
                }, 1000);
            });
        }

        const dialogView = craft<DialogView>`
            <Ink.Dialog title="Dialog title" ...${args}>
             <Ink.Dialog.Body>
              Dialog content.
             </>
             <Ink.Dialog.PrimaryActions>
              <Ink.DialogAction
                action=${DialogActionType.CLOSE}
                type="primary">
               Close
              </>
              <Ink.DialogAction
                callback=${onDelete}
                type="danger">
               Delete
              </>
             </>
             <Ink.Dialog.SecondaryActions>
              <Ink.DialogAction
                action=${DialogActionType.CANCEL}
                callback=${() => dialogView.close()}>
               Cancel
              </>
             </>
            </>
        `;

        async function open(modal: boolean) {
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

            await dialogView.openAndWait({
                modal: modal,
            });
        }

        const el = paint<HTMLElement>`
            <div style="height: 250px">
             ${dialogView.el}
             <div style="display: flex; gap: 10px;">
              <Ink.Button onClick=${async () => open(false)}>
               Show non-modal
              </>
              <Ink.Button onClick=${async () => open(true)}>
               Show modal
              </>
             </div>
            </div>
        `;

        return el;
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
