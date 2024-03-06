import 'jasmine';
import { suite } from '@beanbag/jasmine-suites';

import {
    ComponentRegistry,
    isSubcomponentInfo,
} from '../components';

import { MyComponent } from './myComponents';


suite('core/components', () => {
    describe('ComponentRegistry', () => {
        let registry: ComponentRegistry;

        beforeEach(() => {
            registry = new ComponentRegistry();
            registry.register(MyComponent, 'MyComponent');
        });

        describe('getComponent', () => {
            it('Component found', () => {
                expect(registry.getComponent('MyComponent')).toBe(MyComponent);
            });

            it('Component not found', () => {
                expect(registry.getComponent('XXX')).toBeNull();
            });
        });

        describe('getSubcomponent', () => {
            it('Subcomponent found', () => {
                expect(registry.getSubcomponent('MyComponent.MySubcomponent'))
                    .toEqual({
                        funcName: '_handleSubcomponent',
                        name: 'MySubcomponent',
                        parentComponentClass: MyComponent,
                    });
            });

            it('Subcomponent not found', () => {
                expect(registry.getSubcomponent('XXX')).toBeNull();
            });
        });
    });

    describe('isSubcomponentInfo', () => {
        it('With subcomponent', () => {
            expect(isSubcomponentInfo({
                children: [],
                fullName: 'My.Subcomponent',
                funcName: '_handleSubcomponent',
                isSubcomponent: true,
                name: 'Subcomponent',
                props: {},
            })).toBeTrue();
        });

        it('Without subcomponent', () => {
            expect(isSubcomponentInfo([1, 2, 3])).toBeFalse();
            expect(isSubcomponentInfo({})).toBeFalse();
        });
    });
});
