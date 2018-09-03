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
1. **Date+Time picker:** Picker allows selecting both date and time values. Time value is a text field and is enabled by setting the desired time-format in [`options.timepicker`](#timepicker). Time input is only available if `days` is [`options.allow`](#allow)ed and will be shown in day-level selection view.
2. **Day/Week/Month/Year selection:** [`options.allow`](#allow) and [`options.timepicker`](#timepicker) define what can be selected using plugin.
3. **Inline Display:** Picker can be used as an inline object.

[⬆ back to top](#table-of-contents)

## Installation
Please download the [latest release](https://github.com/arashdalir/datetimepicker/releases/latest) from [Releases Section](https://github.com/arashdalir/datetimepicker/releases), unzip it into your project and then take a look at the next section (Usage) for more information on how to use the plugin 

[⬆ back to top](#table-of-contents)

## Usage
> Refer to [`examples/index.html`](examples/index.html) for some examples.

### Usage Notes
1. see [Note 1](#note1) about setting `options.allow`.
2. see [Note 2](#note2) about selecting/displaying `weeks`.
2. see [Note 3](#note3) about defining `options.template`.

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
- [`displayWeeks`](#displayWeeks)
- [`hooks`](#hooks)
- [`inline`](#inline)
- [`locale`](#locale)
- [`max`](#max)
- [`min`](#min)
- [`position`](#position)
- [`sticky`](#sticky)
- [`template`](#template)
- [`timepicker`](#timepicker)
- [`trigger`](#trigger)
- [`view`](#view)
 
### `allow`
if set, it should be an object with `$.DateTimePicker.views` values as keys, and acceptable `moment.js` formats as values, which will then allow setting output on different views - default = `null`

> To ONLY ALLOW `time`: use `allow.time: 'DATE-FORMAT'` + `timepicker: 'TIME-FORMAT'`. To allow `days` and `time`, use `allow.days: 'DATE-FORMAT'` + `timepicker: 'TIME-FORMAT'`. The latter method allows leaving `time` field empty, hence selecting a day.

> Refer to [note2](#note2) for more information about selecting/displaying `weeks`.

#### Note1
This option MUST be set for each instance in order to tell it which views are allowed and which values can be selected. IF no value is set (is with default value), no date/time can be picked and the picker will not drill down. 
([read more notes](#usage-notes))

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

### `displayWeeks`
Defines if plugin should show week numbers. 

#### Note2
if `weeks` is set in `options.allow`, then `displayWeeks` is automatically turned on, as selecting weeks is made possible by allowing users to click on the week numbers. ([read more notes](#usage-notes))

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
> Refer to [jQueryUi#position](https://jqueryui.com/position/) for more information.

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)


### `sticky`
if set to true, the placeholder will not be automatically hidden when a click/blur-event outside of placeholder or input field is detected - default: `false`

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)


### `template`
HTML template for the plugin view - default is `null`

#### Note3
This value **MUST** be set for each instance or else the plugin will show nothing. As the plugin can be installed on any path, the option cannot have a working default value. Nevertheless, the value can be globally set using something like 

```javascript
$.DateTimePicker.defaultOptions.template = $.DateTimePicker.getTemplate('../src/html/datetimepicker.html');
```
There is a working template available in [src/html folder](/src/html/datetimepicker.html). Users can calculate its path and use the method mentioned above to set the option value. The [example page](/examples/index.html) shows this in action. ([read more notes](#usage-notes))

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `timepicker`
If the plugin should show time-field in day-view - default: `false`, acceptable values are acceptable time formats of `moment.js`

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `trigger`
if defined, `show` action will be executed on `click`-event of the defined trigger(s). The value can be either a selector, which defines a trigger to open [`options.view`](#view), but it can also be an object with keys defining the selectors and values defining their `viewpoint` - default: `null`, acceptable values:

```javascript
// define a single trigger with default to `options.view`
let example1 = {
	trigger: '#button-id'
};
	
let example2 = {
	trigger: {
		'#button-id1': 'days', // #button-id1 opens `days` view
		'#button-id2': 'months' // #button-id2 opens `months` view
	}
};
```

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `view`
sets the view-level which is used when the picker is shown. default: `'days'`

can be any of `'time'`, `'days'`, `'weeks'`, `'months'`, `'years'`, `'decades'` respectively to begin the selection from day, month, year or decade level.

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

## Plugin Hooks
Are used to extend the functionality of the plugin without the need to write parts of the code completely from the scratch.

All the hook callbacks have the value "this" referring to the DateTimePicker object of that instance:
```javascript
/**
* @internal this - refers to the DateTimePicker object, allows access to DateTimePicker functions
*/
```

- [`init`](#init)
- [`set`](#set)
- [`showCalendar`](#showCalendar)

### `init`
executed at the end of initiation process - prototype:
```javascript
/**
*/
function init(){}
```

[⬆ back to top](#table-of-contents) or 
[⬅ back to hooks](#plugin-hooks)

### `set`
executed after the plugin has set the value - prototype: 
```javascript
/**
* @param  $element - the jquery-ready html-element, onm which the set function has been executed
* @param  view - the view which has caused the set action
*/
function set($element, view){}
```


**NOTE:** this function is not executed on "change" events. to run it on change, please use an event-listener like:
```javascript
$('#example').DateTimePicker().on(
	"change",
	function (){
		let $this = $(this);
		let base = $this.data('DateTimePicker');

		base.callHook("set", $this);
	}
);
```

[⬆ back to top](#table-of-contents) or 
[⬅ back to hooks](#plugin-hooks)

### `showCalendar`
executed before showing the calender widget - prototype:
```javascript
/**
* @param $placeholder - the jquery-ready HTML of the calender-widget for current instance
* @param view - which view is used for the preparation of widget
*/
function showCalendar($placeholder, view){}
```

[⬆ back to top](#table-of-contents) or 
[⬅ back to hooks](#plugin-hooks)

## ToDos
 [ ] _Better `Options` Validation:_ invalid formats (for example `DD/Y` or `H:ss` should be detected and reported)
 
 [ ] _Better Separation of View/Controller:_ the template and the controlling code are tightly coupled at the moment but using constant values for placeholders and selectors will make it possible to customize the view even more.

### Finished / Abandoned ToDos 
 [x] _Other Calendars' Support:_ for the time being, gregorian calendar is fully supported. Support of other calendars is provided by plugins like [Jalaali Calendar Plugin](https://github.com/jalaali/moment-jalaali) or [Hijri Calendar Plugin](https://github.com/xsoh/moment-hijri), but has not been tested.
 
 > Refer to [Plugins Section](https://momentjs.com/docs/#/plugins/) of Moment.js for more information.

[⬆ back to top](#table-of-contents) 

## License
Licensed under [MIT](https://opensource.org/licenses/MIT).

[⬆ back to top](#table-of-contents) 