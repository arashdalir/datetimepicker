# DateTimePicker

A customizable date-time-picker using jQuery + jQuery-ui and moment.js.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Options](#options)
- [Hooks](#hooks)
- [Todo](#todo)
- [License](#license)

## Features
1. **Date/Time picker:** Picker allows selecting both date and time values. Time value is a text field; will be validated according to `formatTime` (see Options).
2. **Day/Month/Year selection:** `formatDate` defines which parts of a date is selectable. by omitting month or day formats from it, the output would be limited to year and month values respectively.
3. **Inline Display:** Picker can be used as an inline selector.

[⬆ back to top](#table-of-contents)

## Installation
Please download the latest release from [Releases Section](https://github.com/arashdalir/datetimepicker/releases), unzip it into your project and then take a look at the next section (Usage) for more information on how to use the plugin 

[⬆ back to top](#table-of-contents)

## Usage
Please refer to `./examples/index.html` for some examples.

[⬆ back to top](#table-of-contents)

## Dependencies
1. jQuery
2. jQuery-UI (position, uniqueId, today symbol comes from a jquery-ui theme image)
3. [moment.js](http://momentjs.com)

[⬆ back to top](#table-of-contents)

## Options
List: 
- [`allow`](#`allow`)
- [`buttons`](#buttons)
- [`debug`](#debug)
- [`formatDate`](#formatDate)
- [`formatTime`](#formatTime)
- [`inline`](#inline)
- [`locale`](#locale)
- [`max`](#max)
- [`min`](#min)
- [`position`](#position)
- [`template`](#template)
- [`view`](#view)
 
### `allow`
if set, it should be an object with `$.DateTimePicker.views` values as keys, and acceptable `moment.js` formats as values, which will then allow setting output on different views - default = `null`

`null` value will force the plugin to check for the lowest possible view form (`time, days, months, years`), and create an automatic `allow` entry based on `formatDate` and `formatTime` options.

### `buttons`
an array containing buttons ready to be appended to the placeholder - default: `null`

### `debug`
will force the placeholder to stay open after a blur or click outside the picker is detected - default: `false`,

### `formatDate`
format used for reading date from / writing date to the field - default: `'DD/MM/Y'`

### `formatTime`
format used for reading date from / writing time to the field - set to `null` to disable time field - default: `'H:mm:ss'`

for more information on available formats, please check [momentjs](http://momentjs.com)

### `inline`
automatically appends a `<div class="datetimepicker-inline"></div>` after the element and shows the placeholder in that `div` - default: `false`,

### `locale`
tells `moment.js` which locale should be used when formatting values and outputs - default: `'default'` (delivered in `dep\locale\default.js`)

### `max`
maximum selectable date - default: `null` (no maximum),

### `min`
minimum selectable date - default `null` (no minimum),

### `position`
a valid jQuery-Ui position() value - default: `null` which will tell the system to use the following position:
```js
position = {
	my: 'center top',
	at: 'center bottom+5',
	of: base.$el,
	collision: 'flipfit'
}
```
please refer to [jQueryUi#position](https://jqueryui.com/position/) for more information.

### `template`
HTML code representing the structure of placeholder and views.


### `view`
sets the view-level which is used when the picker is shown. default: `'days'`

can be any of `'days'`, `'months'`, `'years'` respectively to begin the selection from day, month or year level.

## Hooks
Are used to extend the functionality of the plugin without the need to write parts of the code completely from the scratch.
At the moment, only 1 hook is defined in the system:

### `change`
executed after the plugin has set the value.

## Todo
[ ] _Better `Options` Validation:_ invalid formats (for example `DD/Y` or `H:ss` should be detected and reported)

[ ] _Better Separation of View/Controller:_ the template and the controlling code are tightly coupled at the moment, but using constant values for placeholders and selectors will make it possible to customize the view even more.


[x] _Other Calendars' Support:_ for the time being, on gregorian calendar is supported. By adding an interface to moment.js functions, it is possible to define Add-ons for other calendars like `Jalali Calendar (Persian Calendar)`. -- Edit: this is already provided using plugins like [Jalaali Calendar Plugin](https://github.com/jalaali/moment-jalaali) or [Hijri Calendar Plugin](https://github.com/xsoh/moment-hijri). Please refer to [Plugins Section](https://momentjs.com/docs/#/plugins/) of Moment.js for more information.

## License
Licensed under [MIT](https://opensource.org/licenses/MIT).