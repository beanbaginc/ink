import 'jasmine';
import $ from 'jquery';
import { suite } from '@beanbag/jasmine-suites';

import { craft } from '../craft';
import {
    renderInto,
    renderNodesInto,
    setProps,
} from '../dom';


suite('core/dom', () => {
    describe('renderInto', () => {
        it('Into DOM element', () => {
            const containerEl = document.createElement('div');
            containerEl.innerHTML = '<button></button>';

            renderInto(containerEl,
                       document.createElement('a'));

            expect(containerEl.innerHTML)
                .toBe('<button></button><a></a>');
        });

        it('Into JQuery element', () => {
            const $container = $('<div><button></button></div>');

            renderInto($container,
                       document.createElement('a'));

            expect($container.html())
                .toBe('<button></button><a></a>');
        });

        it('Rendering single DOM element', () => {
            const containerEl = document.createElement('div');
            containerEl.innerHTML = '<button></button>';

            renderInto(containerEl,
                       document.createElement('a'));

            expect(containerEl.innerHTML)
                .toBe('<button></button><a></a>');
        });

        it('Rendering multiple DOM elements', () => {
            const containerEl = document.createElement('div');
            containerEl.innerHTML = '<button></button>';

            renderInto(
                containerEl,
                [
                    document.createElement('a'),
                    document.createElement('span'),
                ]);

            expect(containerEl.innerHTML)
                .toBe('<button></button><a></a><span></span>');
        });

        it('Rendering single crafted component', () => {
            const containerEl = document.createElement('div');
            containerEl.innerHTML = '<button></button>';

            renderInto(containerEl,
                       craft`<a href="#"/>`);

            expect(containerEl.innerHTML).toBe(
                '<button></button><a href="#"></a>');
        });

        it('Rendering multiple crafted components', () => {
            const containerEl = document.createElement('div');
            containerEl.innerHTML = '<button></button>';

            renderInto(
                containerEl,
                craft`
                    <a href="#"/>
                    <div><span/></>
                `);

            expect(containerEl.innerHTML).toBe(
                '<button></button><a href="#"></a><div><span></span></div>');
        });

        it('With options.empty', () => {
            const containerEl = document.createElement('div');
            containerEl.innerHTML = '<button></button>';

            renderInto(
                containerEl,
                [
                    document.createElement('a'),
                    document.createElement('span'),
                ],
                {
                    empty: true,
                });

            expect(containerEl.innerHTML).toBe('<a></a><span></span>');
        });

        it('With options.prepend', () => {
            const containerEl = document.createElement('div');
            containerEl.innerHTML = '<button></button>';

            renderInto(
                containerEl,
                [
                    document.createElement('a'),
                    document.createElement('span'),
                ],
                {
                    prepend: true,
                });

            expect(containerEl.innerHTML)
                .toBe('<a></a><span></span><button></button>');
        });
    });

    describe('renderNodesInto', () => {
        it('Into DOM element', () => {
            const containerEl = document.createElement('div');
            containerEl.innerHTML = '<button></button>';

            renderNodesInto(
                containerEl,
                [
                    document.createElement('a'),
                    document.createElement('span'),
                ]);

            expect(containerEl.innerHTML)
                .toBe('<button></button><a></a><span></span>');
        });

        it('Into JQuery element', () => {
            const $container = $('<div><button></button></div>');

            renderNodesInto(
                $container,
                [
                    document.createElement('a'),
                    document.createElement('span'),
                ]);

            expect($container.html())
                .toBe('<button></button><a></a><span></span>');
        });

        it('With options.empty', () => {
            const containerEl = document.createElement('div');
            containerEl.innerHTML = '<button></button>';

            renderNodesInto(
                containerEl,
                [
                    document.createElement('a'),
                    document.createElement('span'),
                ],
                {
                    empty: true,
                });

            expect(containerEl.innerHTML).toBe('<a></a><span></span>');
        });

        it('With options.prepend', () => {
            const containerEl = document.createElement('div');
            containerEl.innerHTML = '<button></button>';

            renderNodesInto(
                containerEl,
                [
                    document.createElement('a'),
                    document.createElement('span'),
                ],
                {
                    prepend: true,
                });

            expect(containerEl.innerHTML)
                .toBe('<a></a><span></span><button></button>');
        });
    });

    describe('setProps', () => {
        it('Basic properties', () => {
            const el = document.createElement('a');

            setProps(el, {
                href: 'https://beanbaginc.com/',
                target: '_blank',
            });

            expect(el.href).toBe('https://beanbaginc.com/');
            expect(el.target).toBe('_blank');
        });

        it('aria-*', () => {
            const el = document.createElement('a');

            setProps(el, {
                'aria-label': 'This is my label!',
                'aria-role': 'button',
            });

            expect(el.getAttribute('aria-label')).toBe('This is my label!');
            expect(el.getAttribute('aria-role')).toBe('button');
        });

        it('class=', () => {
            const el = document.createElement('a');

            setProps(el, {
                'class': 'class1 class2',
            });

            expect(el).toHaveClass('class1');
            expect(el).toHaveClass('class2');
        });

        it('className=', () => {
            const el = document.createElement('a');

            setProps(el, {
                'className': 'class1 class2',
            });

            expect(el).toHaveClass('class1');
            expect(el).toHaveClass('class2');
        });

        it('data-*', () => {
            const el = document.createElement('a');

            setProps(el, {
                'data-abc': '123',
                'data-def': 'false',
            });

            expect(el.dataset.abc).toBe('123');
            expect(el.dataset.def).toBe('false');
            expect(el.getAttribute('data-abc')).toBe('123');
            expect(el.getAttribute('data-def')).toBe('false');
        });

        it('style=', () => {
            const el = document.createElement('a');
            el.style.borderColor = 'green';

            setProps(el, {
                'style': {
                    'background': 'red',
                    'color': 'yellow',
                },
            });

            expect(el.style.background).toBe('red');
            expect(el.style.borderColor).toBe('green');
            expect(el.style.color).toBe('yellow');
        });
    });
});
