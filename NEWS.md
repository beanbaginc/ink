# Ink Releases

## Ink 0.7.0 (18-February-2024)

* Added a new `ink-i-help` icon.

* Added a new `ink-u-font-xs` size, based on a 10 pixel font.

* Added a new `ink-u-rem-10px` unit size.

* Updated `ink-u-rem-11px` and `ink-u-rem-13px` sizes to avoid fractional
  pixel sizes.

  The old values led to sizes like 13.008px, and ended up causing subtle
  issues with layout.

* Drop-down menus are now responsive to changing browser widths.

  This improves anything using `Ink.BaseMenuHandleView`, including
  `Ink.MenuButtonView` and `Ink.MenuLabelView`.

* Fixed the appearance of focus indicators on `ink-c-button` components.

* Fixed the appearance of links in `ink-c-alert` components.

  Depending on the alert type and whether dark mode was used, links could be
  very hard to see. Alerts now always use an appropriate color for the mode
  and alert type.

* Updated our Storybook to 8.x.

* Improved build reliability for developers and packagers of Ink.


## Ink 0.6.0 (14-September-2024)

* Added a new ``Ink.Dialog`` component.

  This new component provides modal and non-modal dialogs, using the modern
  ``<dialog>`` HTML element. It contains three areas that can be customized:

  1. The title
  2. The body content
  3. The actions area (buttons and other elements), which can be separated
     into primary (right-aligned) and secondary (left-aligned) actions.

  Actions may optionally include ``DialogAction`` sub-components, which
  can automatically close or invoke a callback, helping to simplify creating
  dialogs.

  If a callback returns a promise, all actions will be disabled and the dialog
  remaining open while the promise runs. The action invoking the promise will
  show as busy.

  Dialogs may appear in 4 sizes:

  1. Fit (the dialog fits to the size of the content)
  2. Medium (takes 60% of the viewport width)
  3. Large (takes 80% of the viewport width)
  4. Max (takes the full viewport width, minus some spacing)

* Added new icons:

  * ``ink-i-circle-arrow-right``
  * ``ink-i-clock``
  * ``ink-i-copy``
  * ``ink-i-user``
  * ``ink-i-vcs-commit``

* Added package exports for all built CSS and LessCSS files.

  These are now available as:

  * ``@beanbag/ink/ink-auto.css``
  * ``@beanbag/ink/ink-auto.min.css``
  * ``@beanbag/ink/ink.css``
  * ``@beanbag/ink/ink.min.css``
  * ``@beanbag/ink/ink.less``
  * ``@beanbag/ink/lib/ink-auto.css``
  * ``@beanbag/ink/lib/ink-auto.min.css``
  * ``@beanbag/ink/lib/ink.css``
  * ``@beanbag/ink/lib/ink.min.css``
  * ``@beanbag/ink/lib/ink.less``

  The ``lib/`` variants are helpful when bridging the gap between standard
  LessCSS compilation and `package.json`-aware build systems.


## Ink 0.5.2 (1-July-2024)

* ``-is-*`` classes for buttons (such as ``-is-primary``) now take precedent
  over ``type="submit"`` and ``type="reset"``.

* Fixed the box shadow used for alerts.

  The box shadow for alerts was referencing a variable that didn't exist,
  causing shadows to break.


## Ink 0.5.1 (5-June-2024)

* Added an `ink-auto.min.css` stylesheet.

  This is a minified version of the "auto" stylesheet, which is responsible
  for setting defaults for the page to best utilize Ink.

* Fixed a broken `ink-i-info` icon in the generated CSS.

  This was intended to embed the SVG for the icon, but due to a build issue,
  it contained a file path within the build tree. That made the icon
  impossible to use by consuming applications, and could impact build tools.

* Fixed some circular references when attempting to build the JavaScript.


## Ink 0.5 (4-June-2024)

* Initial public preview release.

  This release is not feature-stable at this time.
