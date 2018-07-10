# DateTimePicker

A customizable date-time-picker using jQuery + jQuery-ui and moment.js.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Options](#options)
- [Hooks](#plugin-hooks)
- [ToDos](#todos)
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
- [`allow`](#allow)
- [`buttons`](#buttons)
- [`classes`](#classes)
- [`debug`](#debug)
- [`formatDate`](#formatDate)
- [`formatTime`](#formatTime)
- [`hooks`](#hooks)
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

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `buttons`
an array containing buttons ready to be appended to the placeholder - default: `null`

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `classes`
a list of classes (in string form, space separated) to be assigned to the placeholder - default: `null`

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `debug`
will force the placeholder to stay open after a blur or click outside the picker is detected - default: `false`,

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `formatDate`
format used for reading date from / writing date to the field - default: `'DD/MM/Y'`

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `formatTime`
format used for reading date from / writing time to the field - set to `null` to disable time field - default: `'H:mm:ss'`

for more information on available formats, please check [momentjs](http://momentjs.com)

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `hooks`
a list of hooks to be assigned to the instance - default: `null`

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `inline`
automatically appends a `<div class="datetimepicker-inline"></div>` after the element and shows the placeholder in that `div` - default: `false`

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `locale`
tells `moment.js` which locale should be used when formatting values and outputs - default: `'default'` (delivered in `dep\locale\default.js`)

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `max`
maximum selectable date - default: `null` (no maximum)

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `min`
minimum selectable date - default `null` (no minimum)

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

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

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `template`
HTML code representing the structure of placeholder and views.

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `view`
sets the view-level which is used when the picker is shown. default: `'days'`

can be any of `'days'`, `'months'`, `'years'`, `'decades'` respectively to begin the selection from day, month, year or decade level.

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

## Plugin Hooks
Are used to extend the functionality of the plugin without the need to write parts of the code completely from the scratch.

- [`change`](#`change`)
- [`showCalendar`](#`showCalendar`)

### `change`
executed after the plugin has set the value.

[⬆ back to top](#table-of-contents) or 
[⬅ back to hooks](#plugin-hooks)

### `showCalendar`
executed before showing the calender widget

[⬆ back to top](#table-of-contents) or 
[⬅ back to hooks](#plugin-hooks)

## ToDos
 [ ] _Better `Options` Validation:_ invalid formats (for example `DD/Y` or `H:ss` should be detected and reported)

 [ ] _Better Separation of View/Controller:_ the template and the controlling code are tightly coupled at the moment, but using constant values for placeholders and selectors will make it possible to customize the view even more.

### Finished / Abandoned ToDos 

 [x] _Other Calendars' Support:_ for the time being, on gregorian calendar is supported. By adding an interface to moment.js functions, it is possible to define Add-ons for other calendars like `Jalali Calendar (Persian Calendar)`. -- Edit: this is already provided using plugins like [Jalaali Calendar Plugin](https://github.com/jalaali/moment-jalaali) or [Hijri Calendar Plugin](https://github.com/xsoh/moment-hijri). Please refer to [Plugins Section](https://momentjs.com/docs/#/plugins/) of Moment.js for more information.

[⬆ back to top](#table-of-contents) 

## License
Licensed under [MIT](https://opensource.org/licenses/MIT).

[⬆ back to top](#table-of-contents) 