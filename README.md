# DateTimePicker

A customizable date-time-picker using jQuery + jQuery-ui and moment.js.

## Features
1. **Date/Time picker:** Picker allows selecting both date and time values. Time value is a text field; will be validated according to `formatTime` (see Options).
2. **Day/Month/Year selection:** `formatDate` defines which parts of a date is selectable. by omitting month or day formats from it, the output would be limited to year and month values resepectively.
3. **Inline Display:** Picker can be used as an inline selector.


## Usage
Please refer to `./examples/index.html` for some examples.

## Dependencies
1. jQuery
2. jQuery-UI (position, uniqueId, today symbol comes from a jquery-ui theme image)
3. [moment.js](http://momentjs.com)

## Options

### `buttons`: 
an array containing buttons ready to be appended to the placeholder - default: `null`

### `debug`: 
will force the placeholder to stay open after a blur or click outside the picker is detected - default: `false`,

### `formatDate`: 
format used for reading date from / writing date to the field - default: `'DD/MM/Y'`

### `formatTime`: 
format used for reading date from / writing time to the field - set to `null` to disable time field - default: `'H:mm:ss'`

for more information on available formats, please check [momentjs](http://momentjs.com)

### `inline`: 
automatically appends a `<div class="datetimepicker-inline"></div>` after the element and shows the placeholder in that `div` - default: `false`,

### `locale`: 
tells `moment.js` which locale should be used when formatting values and outputs - default: `'default'` (delivered in `dep\locale\default.js`)

### `max`: 
maximum selectable date - default: `null` (no maximum),

### `min`: 
minimum selectable date - default `null` (no minimum),

### `position`: 
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

### `template`: 
HTML code representing the structure of placeholder and views.


### `view`: 
sets the view-level which is used when the picker is shown. default: `'days'`

can be any of `'days'`, `'months'`, `'years'` respectively to begin the selection from day, month or year level.

## Todo:
-[ ] _Better `Options` Validation:_ invalid formats (for example `DD/Y` or `H:ss` should be detected and reported)

-[ ] _Other Calendars' Support:_ for the time being, on gregorian calendar is supported. By adding an interface to moment.js functions, it is possible to define Add-ons for other calendars like `Jalali Calendar (Persian Calendar)`.
 
-[ ] _Better Separation of View/Controller:_ the template and the controlling code are tightly coupled that the moment, but using constant values for placeholders and selectors will make it possible to customize the view even more.

## License:
Licensed under [MIT](https://opensource.org/licenses/MIT).