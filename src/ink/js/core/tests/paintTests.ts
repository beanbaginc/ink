import 'jasmine';
import { suite } from '@beanbag/jasmine-suites';

import {
    componentRegistry,
} from '../components';
import {
    paint,
    paintComponent,
    paintComponents,
} from '../paint';

import {
    MyComponent,
    MyComponent2,
} from './myComponents';


suite('core/paint', () => {
    beforeAll(() => {
        componentRegistry.register(MyComponent, 'MyComponent');
    });

    afterAll(() => {
        componentRegistry.unregister('MyComponent');
    });

    describe('paintComponent', () => {
        it('With HTML tag', () => {
            const el = paintComponent(
                'a',
                {
                    'aria-label': 'Test label',
                    'class': 'my-class',
                    'data-test': 123,
                    'href': '#',
                    'style': {
                        'background': 'blue',
                        'display': 'flex',
                    },
                },
                'hi',
                paintComponent('span', {}, 'there'));

            expect(el).toBeInstanceOf(window.HTMLAnchorElement);
            expect(el.outerHTML).toBe(
                '<a aria-label="Test label" class="my-class"' +
                ' data-test="123" href="#" style="background: blue;' +
                ' display: flex;">hi<span>there</span></a>');
        });

        it('With component name', () => {
            const el = paintComponent(
                'MyComponent',
                {
                    'aria-label': 'My Label',
                    'class': 'my-class',
                    'data-test': 123,
                    'option1': 'value1',
                    'option2': 'value2',
                },
                'hi',
                paintComponent('span', {}, 'there'));

            expect(el).toBeInstanceOf(window.HTMLDivElement);
            expect(el.outerHTML).toBe(
                '<div aria-label="My Label" data-test="123"' +
                ' class="my-class">hi<span>there</span></div>');
        });

        it('With component name and subcomponent', () => {
            const el = paintComponent(
                'MyComponent',
                {
                    'aria-label': 'My Label',
                    'class': 'my-class',
                    'data-test': 123,
                    'option1': 'value1',
                    'option2': 'value2',
                },
                'hi',
                paintComponent('MyComponent.MySubcomponent'));

            expect(el).toBeInstanceOf(window.HTMLDivElement);
            expect(el.outerHTML).toBe(
                '<div aria-label="My Label" data-test="123"' +
                ' class="my-class"><div data-subcomponent="MySubcomponent">' +
                '</div></div>'
            );
        });

        it('With component class', () => {
            const el = paintComponent(
                MyComponent2,
                {
                    'aria-label': 'My Label',
                    'class': 'my-class',
                    'data-test': 123,
                    'option1': 'value1',
                    'option2': 'value2',
                },
                'hi',
                paintComponent('span', {}, 'there'));

            expect(el).toBeInstanceOf(window.HTMLDivElement);
            expect(el.outerHTML).toBe(
                '<div aria-label="My Label" data-test="123"' +
                ' class="my-class">hi<span>there</span></div>');
        });

        it('With component class and subcomponent', () => {
            const el = paintComponent(
                MyComponent2,
                {
                    'aria-label': 'My Label',
                    'class': 'my-class',
                    'data-test': 123,
                    'option1': 'value1',
                    'option2': 'value2',
                },
                'hi',
                paintComponent('.MySubcomponent'));

            expect(el).toBeInstanceOf(window.HTMLDivElement);
            expect(el.outerHTML).toBe(
                '<div aria-label="My Label" data-test="123"' +
                ' class="my-class"><div data-subcomponent="MySubcomponent">' +
                '</div></div>'
            );
        });
    });

    it('paintComponents', () => {
        const results = paintComponents([
            {
                children: [
                    'hi',
                    paintComponent('span', {}, 'there'),
                ],
                name: 'a',
                props: {
                    'aria-label': 'Test label',
                    'class': 'my-class',
                    'data-test': 123,
                    'href': '#',
                    'style': {
                        'background': 'blue',
                        'display': 'flex',
                    },
                },
            },
            {
                name: 'MyComponent',
                props: {
                    'aria-label': 'My Label',
                    'class': 'my-class',
                    'data-test': 123,
                    'option1': 'value1',
                    'option2': 'value2',
                },
            },
            {
                component: MyComponent2,
                props: {
                    'aria-label': 'My Other Label',
                    'class': 'my-other-class',
                    'data-test': 456,
                    'option1': 'value3',
                    'option2': 'value4',
                },
            },
        ]);

        expect(results).toHaveSize(3);

        let result: HTMLElement;

        /* Check the first result. */
        result = results[0] as HTMLElement;
        expect(result).toBeInstanceOf(HTMLElement);
        expect(result.outerHTML).toBe(
            '<a aria-label="Test label" class="my-class"' +
            ' data-test="123" href="#" style="background: blue;' +
            ' display: flex;">hi<span>there</span></a>');

        /* Check the second result. */
        result = results[1] as HTMLElement;
        expect(result).toBeInstanceOf(HTMLElement);
        expect(result.outerHTML).toBe(
            '<div aria-label="My Label" data-test="123" class="my-class">' +
            '</div>');

        /* Check the third result. */
        result = results[2] as HTMLElement;
        expect(result).toBeInstanceOf(HTMLElement);
        expect(result.outerHTML).toBe(
            '<div aria-label="My Other Label" data-test="456"' +
            ' class="my-other-class"></div>');
    });

    describe('paint templates', () => {
        it('With HTML tag', () => {
            const el = paint<HTMLAnchorElement>`
                <a aria-label="Test label"
                   class="my-class"
                   data-test="123"
                   href="#"
                   style=${{
                       background: 'blue',
                       display: 'flex',
                   }}>
                 hi
                 <span>there</>
                </>
            `;

            expect(el).toBeInstanceOf(window.HTMLAnchorElement);
            expect(el.outerHTML).toBe(
                '<a aria-label="Test label" class="my-class"' +
                ' data-test="123" href="#" style="background: blue;' +
                ' display: flex;">hi<span>there</span></a>');
        });

        it('With component', () => {
            const el = paint<HTMLDivElement>`
                <MyComponent aria-label="My Label"
                             class="my-class"
                             data-test="123"
                             option1="value1"
                             option2="value2">
                 hi
                 <span>there</span>
                </MyComponent>
            `;

            expect(el).toBeInstanceOf(window.HTMLDivElement);
            expect(el.outerHTML).toBe(
                '<div aria-label="My Label" data-test="123"' +
                ' class="my-class">hi<span>there</span></div>');
        });

        it('With component and subcomponent', () => {
            const el = paint<HTMLDivElement>`
                <MyComponent aria-label="My Label"
                             class="my-class"
                             data-test="123"
                             option1="value1"
                             option2="value2">
                 hi
                 <MyComponent.MySubcomponent/>
                </MyComponent>
            `;

            expect(el).toBeInstanceOf(window.HTMLDivElement);
            expect(el.outerHTML).toBe(
                '<div aria-label="My Label" data-test="123"' +
                ' class="my-class"><div data-subcomponent="MySubcomponent">' +
                '</div></div>'
            );
        });
    });
});
