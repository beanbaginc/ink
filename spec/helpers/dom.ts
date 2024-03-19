import { JSDOM } from 'jsdom';


const dom = new JSDOM('<html><body></body></html>');
const window = dom.window;

global.Node = window.Node;
global.Element = window.Node;
global.HTMLElement = window.HTMLElement;
global.HTMLAnchorElement = window.HTMLAnchorElement;
global.HTMLButtonElement = window.HTMLButtonElement;
global.window = window;
global.document = window.document;
