import 'jasmine';
import { suite } from '@beanbag/jasmine-suites';
import { spina } from '@beanbag/spina';

import {
    ComponentChild,
    SubcomponentInfo,
    componentRegistry,
} from '../../../core/components';
import {
    BaseComponentView,
    BaseComponentViewOptions,
} from '../baseComponentView';


interface MyComponentOptions extends BaseComponentViewOptions {
    myOption: number;
}


@spina
class MyComponent extends BaseComponentView<
    null,
    HTMLDivElement,
    MyComponentOptions
> {
    /* Make all the following public, for testing. */
    declare public initialComponentState;

    public onComponentInitialRender() {}

    public recordOneSubcomponent(subcomponent: SubcomponentInfo) {
        super.recordOneSubcomponent(subcomponent);
    }

    public recordAllSubcomponents(subcomponent: SubcomponentInfo) {
        super.recordAllSubcomponents(subcomponent);
    }
}


suite('components/views/BaseComponentView', () => {
    beforeAll(() => {
        componentRegistry.register(MyComponent, 'MyComponent');
    });

    afterAll(() => {
        componentRegistry.unregister('MyComponent');
    });

    describe('Construction', () => {
        it('Crafted state', () => {
            const component = new MyComponent({
                componentCrafted: true,
                myOption: 123,
            });

            expect(component.initialComponentState).toEqual({
                crafted: true,
                options: {
                    componentCrafted: true,
                    myOption: 123,
                },
                subcomponents: {},
            });
        });

        it('Constructed state', () => {
            const component = new MyComponent({
                myOption: 123,
            });

            expect(component.initialComponentState).toEqual({
                crafted: false,
                options: {
                    myOption: 123,
                },
                subcomponents: {},
            });
        });

        it('With null options', () => {
            const component = new MyComponent(null);

            expect(component.initialComponentState).toEqual({
                crafted: false,
                options: {},
                subcomponents: {},
            });
        });
    });

    describe('Methods', () => {
        describe('setComponentChildren', () => {
            it('Pre-render', () => {
                const component = new MyComponent();

                const children: ComponentChild[] = [
                    document.createElement('div'),
                    document.createElement('a'),
                    [
                        document.createElement('b'),
                        document.createElement('b'),
                    ],
                    new MyComponent(),
                    {
                        children: [],
                        fullName: 'MyComponent.MySubcomponent',
                        funcName: 'myHandler',
                        isSubcomponent: true,
                        name: 'MySubcomponent',
                        props: {},
                    },
                ];

                component.setComponentChildren(children);

                expect(component.initialComponentState.children)
                    .toBe(children);
            });

            it('Post-render', () => {
                const component = new MyComponent();
                component.render();

                expect(() => component.setComponentChildren(['test']))
                    .toThrow(new Error(
                        '_MyComponent_.setComponentChildren() cannot be ' +
                        'called after the component is rendered.'
                    ));
            });
        });

        describe('recordOneSubcomponent', () => {
            it('Pre-render', () => {
                const component = new MyComponent();

                component.recordOneSubcomponent({
                    children: [],
                    fullName: 'MyComponent.MySubcomponent',
                    funcName: 'myHandler',
                    isSubcomponent: true,
                    name: 'MySubcomponent',
                    props: {},
                });

                expect(component.initialComponentState.subcomponents).toEqual({
                    'MySubcomponent': [
                        {
                            children: [],
                            fullName: 'MyComponent.MySubcomponent',
                            funcName: 'myHandler',
                            isSubcomponent: true,
                            name: 'MySubcomponent',
                            props: {},
                        },
                    ],
                });

                /* A second attempt should fail. */
                expect(() => component.recordOneSubcomponent({
                    children: [],
                    fullName: 'MyComponent.MySubcomponent',
                    funcName: 'myHandler',
                    isSubcomponent: true,
                    name: 'MySubcomponent',
                    props: {},
                })).toThrow(new Error(
                    'Subcomponent "MySubcomponent" cannot be provided ' +
                    'more than once.'
                ));

                /* Another subcomponent should work. */
                component.recordOneSubcomponent({
                    children: [],
                    fullName: 'MyComponent.MySubcomponent2',
                    funcName: 'myHandler2',
                    isSubcomponent: true,
                    name: 'MySubcomponent2',
                    props: {},
                });

                expect(component.initialComponentState.subcomponents).toEqual({
                    'MySubcomponent': [
                        {
                            children: [],
                            fullName: 'MyComponent.MySubcomponent',
                            funcName: 'myHandler',
                            isSubcomponent: true,
                            name: 'MySubcomponent',
                            props: {},
                        },
                    ],
                    'MySubcomponent2': [
                        {
                            children: [],
                            fullName: 'MyComponent.MySubcomponent2',
                            funcName: 'myHandler2',
                            isSubcomponent: true,
                            name: 'MySubcomponent2',
                            props: {},
                        },
                    ],
                });
            });

            it('Post-render', () => {
                const component = new MyComponent();
                component.render();

                expect(() => component.recordOneSubcomponent({
                    children: [],
                    fullName: 'MyComponent.MySubcomponent',
                    funcName: 'myHandler',
                    isSubcomponent: true,
                    name: 'MySubcomponent',
                    props: {},
                })).toThrow(new Error(
                    '_MyComponent_.recordOneSubcomponent() cannot be ' +
                    'called after the component is rendered.'
                ));
            });
        });

        describe('recordAllSubcomponents', () => {
            it('Pre-render', () => {
                const component = new MyComponent();

                component.recordAllSubcomponents({
                    children: [],
                    fullName: 'MyComponent.MySubcomponent',
                    funcName: 'myHandler',
                    isSubcomponent: true,
                    name: 'MySubcomponent',
                    props: {},
                });

                component.recordAllSubcomponents({
                    children: [],
                    fullName: 'MyComponent.MySubcomponent',
                    funcName: 'myHandler',
                    isSubcomponent: true,
                    name: 'MySubcomponent',
                    props: {
                        prop1: 123,
                    },
                });

                expect(component.initialComponentState.subcomponents).toEqual({
                    'MySubcomponent': [
                        {
                            children: [],
                            fullName: 'MyComponent.MySubcomponent',
                            funcName: 'myHandler',
                            isSubcomponent: true,
                            name: 'MySubcomponent',
                            props: {},
                        },
                        {
                            children: [],
                            fullName: 'MyComponent.MySubcomponent',
                            funcName: 'myHandler',
                            isSubcomponent: true,
                            name: 'MySubcomponent',
                            props: {
                                prop1: 123,
                            },
                        },
                    ],
                });
            });

            it('Post-render', () => {
                const component = new MyComponent();
                component.render();

                expect(() => component.recordOneSubcomponent({
                    children: [],
                    fullName: 'MyComponent.MySubcomponent',
                    funcName: 'myHandler',
                    isSubcomponent: true,
                    name: 'MySubcomponent',
                    props: {},
                })).toThrow(new Error(
                    '_MyComponent_.recordOneSubcomponent() cannot be ' +
                    'called after the component is rendered.'
                ));
            });
        });

        it('render', () => {
            const component = new MyComponent();
            spyOn(component, 'onComponentInitialRender');

            expect(component.initialComponentState).not.toBeNull();

            component.render();

            expect(component.initialComponentState).toBeNull();
            expect(component.onComponentInitialRender).toHaveBeenCalled();
        });
    });
});
