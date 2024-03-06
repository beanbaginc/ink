import { JSDOM } from 'jsdom';


const dom = new JSDOM('<html><body></body></html>');

global.Node = dom.window.Node;
global.Element = dom.window.Node;
global.HTMLElement = dom.window.Node;
global.window = dom.window;
global.document = dom.window.document;
