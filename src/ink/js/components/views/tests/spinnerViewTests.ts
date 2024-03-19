import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import { paint } from '../../../index';


suite('components/views/ButtonView', () => {
    it('Render', () => {
        const el = paint<HTMLSpanElement>`<Ink.Spinner/>`;

        expect(el.outerHTML).toBe('<span class="ink-c-spinner"></div>');
    });
});
