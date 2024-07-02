# Ink Releases

## Ink 0.5.2 (TBD)

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
