# Readme

## Installation
1. Run `installer.sh`
1. Configure the correct S3 settings in `tasks/config.json` (replace the **** placeholders, passwords are in the password manager)
1. Add the fonts (see next step). Fonts are not included in this source because they are licensed

## Generating webfonts

1. Designer hands off original files (TTF, WOFF, or something else, but hopefully one of these)
1. Use https://www.fontsquirrel.com/tools/webfont-generator to generate the correct versions of the webfonts
    - Upload the fonts
    - Pick expert mode (smile)
    - Check TTF, WOFF and WOFF2
    - Choose Arial to match x-height, as Arial is our first fallback font
1. Add the fonts to the this repo, in the `src/fonts` folder
1. Make sure the paths to the fonts are generated, by publishing the fonts (`gulp fonts:clean && gulp fonts:rev && gulp fonts:release`)
1. Adjust the font-settings in the theme specific `_settings.scss` file
1. Make sure the `@font-face` rule is generated: check if the `@webfont mixin` is used for this font
1. Now you're ready for testing the new font
