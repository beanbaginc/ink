import {
    SpinnerView,
    paint
} from '../../ink/js';


export default {
    title: 'Ink/Components/Spinner',
    tags: ['autodocs'],
    render: ({
        color,
        ...args
    }) => {
        const el = paint<HTMLSpanElement>`<Ink.Spinner/>`;

        if (color) {
            el.style.color = color;
        }

        return el;
    },
    argTypes: {
        color: {
            control: 'color',
        },
    },
};


export const Standard = {};


export const Colors = {
    render: ({
        color,
        ...args
    }) => {
        const style = window.getComputedStyle(document.documentElement);

        return paint`
            <div style="display: inline-flex; gap: 1em;">
             <Ink.Spinner style=${{
                 color: style.getPropertyValue('--ink-p-blue-500')
             }}/>
             <Ink.Spinner style=${{
                 color: style.getPropertyValue('--ink-p-red-500')
             }}/>
             <Ink.Spinner style=${{
                 color: style.getPropertyValue('--ink-p-yellow-800')
             }}/>
             <Ink.Spinner style=${{
                 color: style.getPropertyValue('--ink-p-green-500')
             }}/>
             <Ink.Spinner style=${{
                 color: style.getPropertyValue('--ink-p-grey-500')
             }}/>
             <Ink.Spinner style=${{
                 color: style.getPropertyValue('--ink-p-brown-500')
             }}/>
             <Ink.Spinner style=${{
                 color: style.getPropertyValue('--ink-p-cyan-500')
             }}/>
             <Ink.Spinner style=${{
                 color: style.getPropertyValue('--ink-p-cool-grey-500')
             }}/>
             <Ink.Spinner style=${{
                 color: style.getPropertyValue('--ink-p-mustard-500')
             }}/>
            </div>
        `;
    },
};
