import 'jasmine';
import { suite } from '@beanbag/jasmine-suites';

import { componentRegistry } from '../components';
import {
    craft,
    craftComponent,
    craftComponents,
} from '../craft';

import { MyComponent } from './myComponents';


suite('core/craft', () => {
    beforeAll(() => {
        componentRegistry.register(MyComponent, 'MyComponent');
    });

    afterAll(() => {
        componentRegistry.unregister('MyComponent');
    });

    describe('craftComponent', () => {
        it('With HTML tag', () => {
            const el = craftComponent(
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
                craftComponent('span', {}, 'there'));
            expect(el).toBeInstanceOf(window.HTMLAnchorElement);

            expect(el.outerHTML).toBe(
                '<a aria-label="Test label" class="my-class"' +
                ' data-test="123" href="#" style="background: blue;' +
                ' display: flex;">hi<span>there</span></a>');
        });

        it('With component', () => {
            const component = craftComponent<HTMLElement, MyComponent>(
                'MyComponent',
                {
                    'aria-label': 'My Label',
                    'class': 'my-class',
                    'data-test': 123,
                    'option1': 'value1',
                    'option2': 'value2',
                },
                'hi',
                craftComponent('span', {}, 'there'));

            expect(component).toBeInstanceOf(MyComponent);
            expect(component.options).toEqual({
                'componentCrafted': true,
                'option1': 'value1',
                'option2': 'value2',
            });

            const el = component.el;
            expect(el.className).toBe('my-class');
            expect(el.dataset.test).toBe('123');
            expect(el.getAttribute('aria-label')).toBe('My Label');

            const children = component.children;
            expect(children).toHaveSize(2);
            expect(children[0]).toBe('hi');

            const child = children[1] as HTMLSpanElement;
            expect(child).toBeInstanceOf(window.HTMLSpanElement);
            expect(child.innerHTML).toBe('there');
        });

        it('With component and subcomponent', () => {
            const component = craftComponent<HTMLElement, MyComponent>(
                'MyComponent',
                {
                    'aria-label': 'My Label',
                    'class': 'my-class',
                    'data-test': 123,
                    'option1': 'value1',
                    'option2': 'value2',
                },
                'hi',
                craftComponent('MyComponent.MySubcomponent'));

            expect(component).toBeInstanceOf(MyComponent);
            expect(component.options).toEqual({
                'componentCrafted': true,
                'option1': 'value1',
                'option2': 'value2',
            });
            expect(component.children).toHaveSize(1);
            expect((component.children[0] as HTMLElement).outerHTML).toBe(
                '<div data-subcomponent="MySubcomponent"></div>'
            );

            const el = component.el;
            expect(el.className).toBe('my-class');
            expect(el.dataset.test).toBe('123');
            expect(el.getAttribute('aria-label')).toBe('My Label');

            const subcomponents = component.subcomponentInfos;
            expect(subcomponents).toHaveSize(1);
            expect(subcomponents[0] as unknown).toEqual({
                children: [],
                fullName: 'MyComponent.MySubcomponent',
                funcName: '_handleSubcomponent',
                isSubcomponent: true,
                name: 'MySubcomponent',
                props: {},
            });
        });
    });

    it('craftComponents', () => {
        const results = craftComponents([
            {
                children: [
                    'hi',
                    craftComponent('span', {}, 'there'),
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
        ]);

        expect(results).toHaveSize(2);

        let result: HTMLElement | MyComponent;

        /* Check the first result. */
        result = results[0] as HTMLElement;
        expect(result).toBeInstanceOf(HTMLElement);

        expect(result.outerHTML).toBe(
            '<a aria-label="Test label" class="my-class"' +
            ' data-test="123" href="#" style="background: blue;' +
            ' display: flex;">hi<span>there</span></a>');

        /* Check the second result. */
        result = results[1] as MyComponent;
        expect(result).toBeInstanceOf(MyComponent);
        expect(result.options).toEqual({
            'componentCrafted': true,
            'option1': 'value1',
            'option2': 'value2',
        });

        const el = result.el;
        expect(el.className).toBe('my-class');
        expect(el.dataset.test).toBe('123');
        expect(el.getAttribute('aria-label')).toBe('My Label');
    });

    describe('craft templates', () => {
        it('With HTML tag', () => {
            const el = craft<HTMLAnchorElement>`
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

            expect(el.outerHTML).toBe(
                '<a aria-label="Test label" class="my-class"' +
                ' data-test="123" href="#" style="background: blue;' +
                ' display: flex;">hi<span>there</span></a>');
        });

        it('With component', () => {
            const component = craft<MyComponent>`
                <MyComponent aria-label="My Label"
                             class="my-class"
                             data-test="123"
                             option1="value1"
                             option2="value2">
                 hi
                 <span>there</span>
                </MyComponent>
            `;

            expect(component).toBeInstanceOf(MyComponent);
            expect(component.options).toEqual({
                'componentCrafted': true,
                'option1': 'value1',
                'option2': 'value2',
            });

            const el = component.el;
            expect(el.className).toBe('my-class');
            expect(el.dataset.test).toBe('123');
            expect(el.getAttribute('aria-label')).toBe('My Label');

            const children = component.children;
            expect(children).toHaveSize(2);
            expect(children[0]).toBe('hi');

            const child = children[1] as HTMLSpanElement;
            expect(child).toBeInstanceOf(window.HTMLSpanElement);
            expect(child.innerHTML).toBe('there');
        });

        it('With component and subcomponent', () => {
            const component = craft<MyComponent>`
                <MyComponent aria-label="My Label"
                             class="my-class"
                             data-test="123"
                             option1="value1"
                             option2="value2">
                 hi
                 <MyComponent.MySubcomponent/>
                </MyComponent>
            `;

            expect(component).toBeInstanceOf(MyComponent);
            expect(component.options).toEqual({
                'componentCrafted': true,
                'option1': 'value1',
                'option2': 'value2',
            });
            expect(component.children).toHaveSize(1);
            expect((component.children[0] as HTMLElement).outerHTML).toBe(
                '<div data-subcomponent="MySubcomponent"></div>'
            );

            const el = component.el;
            expect(el.className).toBe('my-class');
            expect(el.dataset.test).toBe('123');
            expect(el.getAttribute('aria-label')).toBe('My Label');

            const subcomponents = component.subcomponentInfos;
            expect(subcomponents).toHaveSize(1);
            expect(subcomponents[0] as unknown).toEqual({
                children: [],
                fullName: 'MyComponent.MySubcomponent',
                funcName: '_handleSubcomponent',
                isSubcomponent: true,
                name: 'MySubcomponent',
                props: {},
            });
        });
    });
});
