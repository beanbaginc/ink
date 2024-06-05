Ink - Craft Beautiful Webapps
=============================

Welcome to Ink, a new MIT-licensed CSS component UI library crafted by the team
at [Beanbag, Inc.](https://www.beanbaginc.com) for our signature
[Review Board](https://www.reviewboard.org) code review product.

Ink is designed to be accessible, mobile-friendly, and with a strong focus on
usability and easy integration into any JavaScript/TypeScript or HTML codebase.
While many libraries embrace flat UI design, Ink focuses on clear components
with strong visual cues. It's not skeuomorphic, and it's not flat. It's Ink.

Ink is built as a plain JavaScript library. It's not built on React or other
component libraries, but it can be used in products built on any framework.


## Ink is Under Development

We're still building Ink, and are working towards a solid 1.0 release. In the
meantime, we'll be putting out periodic releases as we work toward stability
and a full component library.

In the future, Ink will also be useable as a drop-in component library for
[Django](https://www.djangoproject.com/)-based Python projects, enhancing forms
and templates to provide a nice out-of-the-box experience.


## Components

Ink provides the following UI components out of the box:

* Alert Box
* Button Group
* Button
* Keyboard Shortcut Indicator
* Menu Button
* Menu Label
* Menu
* Spinner

Plus utilities for creating and using your own components.


## Installing Ink

Ink can be installed using `npm`:

```shell
$ npm install @beanbag/ink
```

See the [@beanbag/ink package on npm.js](npmjs.com/package/@beanbag/ink) for more.


## Consuming Ink

### Ink CSS

To include the Ink stylesheets on your page, use
`node_modules/@beanbag/ink/ink.min.css` as part of your build pipeline or your
HTML.

You can then set light, dark, or system theme modes on your `<html>` tag:

```html
<!-- For light mode -->
<html data-ink-color-scheme="light">

<!-- For dark mode -->
<html data-ink-color-scheme="dark">

<!-- For system mode -->
<html data-ink-color-scheme="system">
```


### Ink JavaScript/TypeScript

Once installed, JavaScript/TypeScript codebases using ESM or CommonJS can
import Ink components directly from `@beanbag/ink`.

If not using a build tool, you can include Ink JavaScript on your page using
`node_modules/@beanbag/lib/ink.js`.


## Usage Documentation

Ink is still very much in development, and we're in the process of building
interactive documentation using [Storybook.js](https://storybook.js.org/).

For now, please see the [sample
files](https://github.com/beanbaginc/ink/tree/master/src/stories/components)
for using components in Ink.
