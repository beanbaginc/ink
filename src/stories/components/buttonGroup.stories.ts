import { paint } from '../../ink/js';


export default {
    title: 'Ink/Components/ButtonGroup',
    tags: ['autodocs'],
    render: options => paint`
        <Ink.ButtonGroup ...${options}>
         <Ink.Button>A button</>
         <Ink.Button>Another button</>
         <Ink.Button iconName="ink-i-success">Third</>
         <Ink.Button type="primary">Fourth</>
         <Ink.Button type="primary">Fifth!</>
         <Ink.Button type="danger">Danger!</>
         <Ink.Button type="danger">Danger!!</>
         <Ink.Button disabled>Disabled</>
         <Ink.Button>Last</>
        </>
    `,
    argTypes: {
        'aria-label': {
            description: 'ARIA label for the button group.',
            control: 'text',
        },
        'orientation': {
            description: 'The direction in which buttons are laid out.',
            control: 'radio',
            options: [
                'horizontal',
                'vertical',
            ],
        },
    },
};


export const Horizontal = {
    args: {
        'aria-label': 'Important Button Group',
        'orientation': 'horizontal',
    },
}


export const Vertical = {
    args: {
        'orientation': 'vertical',
    },
};
