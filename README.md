# DateTimePicker

A customizable date-time-picker using jQuery + jQuery-ui and moment.js.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Internal Parameters](#internal-parameters)
- [Options](#options)
- [Functions](#functions)
- [Hooks](#plugin-hooks)
- [Manipulators](#manipulators)
- [Defining Buttons](#defining-buttons)
	- [`$.DateTimePicker.Button`](#datetimepickerbutton)
	- [`$.DateTimePicker.DefaultButtons`](#datetimepickerdefaultbuttons)
- [ToDos](#todos)
- [License](#license)

## Features
1. **Date+Time picker:** Picker allows selecting both date and time values. Time input is only available if `'time'` is [`options.allow`](#allow)ed and will be shown in day-level selection view.
2. **Day/Week/Month/Year selection:** [`options.allow`](#allow) define what can be selected using plugin.
3. **Inline Display:** Picker can be used as an inline object.

[⬆ back to top](#table-of-contents)

## Installation
Please download the [latest release](https://github.com/arashdalir/datetimepicker/releases/latest) from [Releases Section](https://github.com/arashdalir/datetimepicker/releases), unzip it into your project and then take a look at the next section (Usage) for more information on how to use the plugin 

[⬆ back to top](#table-of-contents)

## Usage
> Refer to [`examples/index.html`](examples/index.html) for some examples.

### Usage Notes
1. see [this note](#setting-allow-value) about setting `options.allow`.
2. see [this note](#showingselecting-weeks) about selecting/displaying `weeks`.
2. see [this note](#setting-template) about defining `options.template`.

[⬆ back to top](#table-of-contents)

## Dependencies
1. jQuery
2. jQuery-UI (position, uniqueId, today symbol comes from a jquery-ui theme image)
3. [moment.js](http://momentjs.com)

[⬆ back to top](#table-of-contents)

## Internal Parameters

### `$.DateTimePicker.views`
can be any of `'time'`, `'days'`, `'weeks'`, `'months'`, `'years'`, `'decades'` respectively to begin the selection from day, month, year or decade level.
[⬆ back to top](#table-of-contents) or 
[⬅ back to internal parameters](#internal-parameters)

## Options
List: 
- [`allow`](#allow)
- [`buttons`](#buttons)
- [`classes`](#classes)
- [`debug`](#debug)
- [`displayWeeks`](#displayweeks)
- [`hooks`](#hooks)
- [`inline`](#inline)
- [`locale`](#locale)
- [`max`](#max)
- [`min`](#min)
- [`position`](#position)
- [`sticky`](#sticky)
- [`timeouts`](#timeouts)
	- [`blur`](#blur-timeout)
	- [`valueInputChange`](#valueinputchange-timeout)
	- [`timeInputChange`](#timeinputchange-timeout)
- [`template`](#template)
- [`trigger`](#trigger)
- [`view`](#view)
 
### `allow`
if set, it should be an object with [`$.DateTimePicker.views`](#datetimepickerviews) values as keys, and acceptable `moment.js` formats as values, which will then allow setting output on different views - default = `null`

> Refer to [this note](#showingselecting-weeks) for more information about selecting/displaying `weeks`.

> #### Setting `allow` Value
> This option MUST be set for each instance in order to tell it which views are allowed and which values can be selected. IF no value is set (is with default value), no date/time can be picked and the picker will not drill down. 
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

> #### Showing/Selecting `weeks`
> if `weeks` is set in `options.allow`, then `displayWeeks` is automatically turned on, as selecting weeks is made possible by allowing users to click on the week numbers. ([read more notes](#usage-notes))

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

### `timeouts`
defines the timeouts for different activities in the plugin:

> Note: Changing these values might drastically affect the usability as these values are responsible for disappearance of the widget and updating it after values in input fields are changed. it might also result in inconsistencies in usability and input-data-loss, as it will cause the values in input fields to change after given time on inactivity in another field.  

#### `blur` Timeout
sets the time in `ms` between clicking outside the widget / changing focus of input-field and hiding of the widget - default: `200`

#### `valueInputChange` Timeout
sets the time in `ms` between changing the value in the input-field (defined by the selector) and it affecting the widget's look - prevents constant refreshes when manually changing the date-time value - default: `500`

#### `timeInputChange` Timeout
sets the time in `ms` between changing the value in `time` field and it affecting time portion of input-field - prevents constant changing of input-value; which in return would refresh the widget - default: `500`

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

### `template`
HTML template for the plugin view - default is `null`

> #### Setting Template
> This value **MUST** be set for each instance or else the plugin will show nothing. As the plugin can be installed on any path, the option cannot have a working default value. Nevertheless, the value can be globally set using something like:

```javascript
$.DateTimePicker.defaultOptions.template = $.DateTimePicker.getTemplate('../src/html/datetimepicker.html');
```
There is a working template available in [src/html folder](/src/html/datetimepicker.html). Users can calculate its path and use the method mentioned above to set the option value. The [example page](/examples/index.html) shows this in action. ([read more notes](#usage-notes))

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

can be any of [`$.DateTimePicker.views`](#datetimepickerviews)

[⬆ back to top](#table-of-contents) or 
[⬅ back to options](#options)

## Functions

- [`callHook`](#callhookhookname-arg1-arg2-)
- [`isDisabled`](#isdisabledtarget)
- [`getPlaceholder`](#getplaceholder)
- [`getFormat`](#getformatview)
- [`allows`](#allowsview-checktime)
- [`matchValueView`](#matchvalueviewdatetime)
- [`getDateTime`](#getdatetime)
- [`showCalendar`](#showcalendardatetime-view)
- [`drawButtons`](#drawbuttons)
- [`getNextAllowed`](#getnextallowedview-offset)
- [`isBetweenRange`](#isbetweenrangedatetime-view)
- [`setOptions`](#setoptionsoptions)

### `callHook(hookName, arg1, arg2, ...)`
it checks whether [`disableHooks` manipulator](#disablehooks) is set or not. if not, then looks for defined [`hooks`](#hooks) and executes it using given parameters.
> Note: called functions have access to the instance using `this`

### `isDisabled($target)`
`$target` is a DOM element, which when `click`ed, will set the day, month or year in input field. this function checks if the given `$target` is disabled, which usually means it's outside the allowed date-range (defined using [min](#min) and [max](#max))
[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

### `getPlaceholder()`
returns the widget placeholder. if none is defined for the instance, then it will first create it.
[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

### `getFormat(view)`
it returns the [`allow`](#allow)ed format for a given `view` or `undefined`.
[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

### `allows(view, checkTime)`
it returns a `boolean` view indicting if the given `view` is defined as [`allow`](#allow)ed. 
- `checkTime` is only useful if `view === 'days'`, and it will check if either `days` or `time` is [`allow`](#allow)ed
[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

### `matchValueView(datetime)`
checks if the provided `datetime` value matches any of the [`allow`](#allow)ed formats.
[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

### `getDateTime()`
returns a `moment.js` object containing either the value of input-field or if not set, current date-time.
[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

### `showCalendar(datetime, view)`
shows the widget opened with `view` as view-point, set to `datetime`
[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

### `drawButtons()`
creates buttons defined in [`options.buttons`](#buttons).
[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

### `getNextAllowed(view, offset)`
> to be documented
[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

### `isBetweenRange(datetime, view)`
checks whether the value provided in `datetime`  is between [`min`](#min) and [`max`](#max) value. to do so, it adjusts the precision of `datetime` and current set value to `view` level, i.e. if for example `view === 'months'`, it only checks the dates in months level and `day` and `time` values won't be considered while checking.

[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

### `setOptions(options)`
merges `events` and options provided in `options` into current instance. it activates new `hooks` (if any defined) and attaches default event handlers to the instance. it also prepares and initiates the [`trigger`](#trigger)s
  
[⬆ back to top](#table-of-contents) or 
[⬅ back to functions](#functions)

## Plugin Hooks
Are used to extend the functionality of the plugin without the need to write parts of the code completely from the scratch.

All the hook callbacks have the value "this" referring to the DateTimePicker object of that instance:
```javascript
/**
* @internal this - refers to the DateTimePicker object, allows access to DateTimePicker functions
*/
```

- [`init`](#init)
- [`hide`](#hide)
- [`set`](#set)
- [`show`](#show)
- [`showCalendar`](#showcalendar)

### `init`
executed at the end of initiation process - prototype:
```javascript
/**
*/
function init(){}
```

[⬆ back to top](#table-of-contents) or 
[⬅ back to hooks](#plugin-hooks)

### `hide`
executed after `hide()` event is executed. please note that `hide()` event doesn't necessarily hide the `$placehoder`, as hiding it is dependent on [`this.options.inline`](#inline) value; nevertheless, the hook is executed regardless. 
```javascript
/**
*/
function hide(){}
```

[⬆ back to top](#table-of-contents) or 
[⬅ back to hooks](#plugin-hooks)

### `set`
executed after the plugin has set the value - prototype: 
```javascript
/**
* @param  datetime - value to be set in the input field - to be formatted according to view
* @param  view - the view which has caused the set action
*/
function set(datetime, view){}
```

> **NOTE:** this function is not executed on "change" events. to run it on change, please use an event-listener like:

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

### `show`
executed after placeholder's show() event is finished. can be used to adjust `view`
```javascript
/**
* @param view - which view is used for the preparation of widget
*/
function show(view){}
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

## Manipulators
In order to ease temporary runtime manipulation of plugin behavior, a new parameter-set is defined. Following parameters can be set to affect plugin's behavior:

- [`disableHooks`](#disablehooks)
- [`maxDrillDown`](#maxdrilldown)

To use the manipulators, their values can be set as following:
```javascript
let $picker = $('#date-picker');
$picker.DateTimePicker('manipulate', {disableHooks: true});
// do your thing
$picker.DateTimePicker('manipulate', {disableHooks: false});
```

### `disableHooks`
if set to `true`, hooks will not be executed. can be used to stop recursive call of hooks if they (in)directly cause each other to be triggered.
```javascript
let $picker = $('#date-picker');
$picker.DateTimePicker('manipulate', {disableHooks: true});
$picker.data("DateTimePicker").show(); // `hooks.show` won't be executed.
$picker.DateTimePicker('manipulate', {disableHooks: false});
```
[⬆ back to top](#table-of-contents) or 
[⬅ back to manipulators](#manipulators)

### `maxDrillDown`
can be any of [`$.DateTimePicker.views`](#datetimepickerviews). the views allowing a more accurate value selection will not be shown. Setting value directly is not affected. this can be used, for example, to define view-[`triggers`](#trigger). 
```javascript
$picker = $('#date-picker');
$picker.on('focus', function(){
	$picker.DateTimePicker('manipulate', {maxDrillDown: null});
});

$('#month_picker_trigger').on('click', function(){
	$picker.DateTimePicker('manipulate', {maxDrillDown: 'months'});
});

$('#day_picker_trigger').on('click', function(){
	$picker.DateTimePicker('manipulate', {maxDrillDown: 'days'});
});
```
[⬆ back to top](#table-of-contents) or 
[⬅ back to manipulators](#manipulators)


## Defining Buttons
In order to facilitate defining buttons, a new class `$.DateTimePicker.Button` was defined. its properties will be used to create buttons automatically. in addition, `$.DateTimePicker.DefaultButtons` defines a few handy predefined functionalities (at the moment `now`-button, `midnight`-button) 

### `$.DateTimePicker.Button`
accepts following options:

#### Button Options
```javascript
var options = {
	className: '',
	label: '',
	name: '', 
	onClick: function(dateTimePickerInstance){},
	show: function(dateTimePickerInstance){} // can also be true or false
};
```

these options will translate into: `<button class='{options.className}' name='{options.name}' onClick='{options.onClick([Date-Time-Picker-Instance])}'>{options.label}</button>`

#### `button.show()` 
will be evaluated before putting the button on the page. it can be any value which could be interpreted as boolean, or it could define a function, which should return `true` or `false`. if the value is evaluated to `false`, then the button will not appear in the widget.

#### `button.setOptions()`
it's possible to change a button's settings using this function. but they won't take effect if they buttons are already drawn, unless buttons are redrawn with [`drawButtons()`](#drawbuttons). 

> Note: functions `show()` and `onClick()` have access to button's properties using `this`. each [button option]("#button-options) as accessible via `this[{optionName}]`, like for example `base.className`, `base.name`, etc.

 
[⬆ back to top](#table-of-contents) or 
[⬅ back to Defining Buttons](#defining-buttons)

### `$.DateTimePicker.DefaultButtons`
currently, 2 default buttons are defined in this class:

1. `now` button will set date/time values to current moment.
1. `dayBegin` button will set the time to `0:00:00.000` of selected day.  by default it's only available (i.e. `show`n) if `time` selection is allowed. 
1. `dayEnd` button will set the time to `23:59:59.99999999` of selected day.  by default it's only available (i.e. `show`n) if `time` selection is allowed. 

```javascript
$.DateTimePicker.DefaultButtons = {
	now: new $.DateTimePicker.Button({
		name: 'now',
		label: 'Now',
		onClick: function (picker){
			if(picker instanceof $.DateTimePicker)
			{
				let current = moment();
				picker.events.set.call(picker, current, null);
				picker.$el.change();
			}
		}
	}),
    dayBegin: new $.DateTimePicker.Button({
        name: 'day_begin',
        label: 'Day Begin',
        onClick: function (picker){
            if(picker instanceof $.DateTimePicker)
            {
                let current = moment(picker.$el.val());
                current.set({
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0
                });
                picker.events.set.call(picker, current, null);
                picker.$el.change();
            }
        },
        show: function(picker){
            if (picker instanceof $.DateTimePicker)
            {
                return (picker.allows("time") && picker.viewpoint === 'days');
            }
            else
            {
                return false;
            }
        }
    }),
    dayEnd: new $.DateTimePicker.Button({
        name: 'day_end',
        label: 'Day End',
        onClick: function (picker){
            if(picker instanceof $.DateTimePicker)
            {
                let current = moment(picker.$el.val());
                current.set({
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 999
                });
                picker.events.set.call(picker, current, null);
                picker.$el.change();
            }
        },
        show: function(picker){
            if (picker instanceof $.DateTimePicker)
            {
                return (picker.allows("time") && picker.viewpoint === 'days');
            }
            else
            {
                return false;
            }
        }
    })
};
```

[⬆ back to top](#table-of-contents) or 
[⬅ back to Defining Buttons](#defining-buttons)

## ToDos
* [ ] _Better `Options` Validation:_ invalid formats (for example `DD/Y` or `H:ss` should be detected and reported)
 
* [ ] _Better Separation of View/Controller:_ the template and the controlling code are tightly coupled at the moment but using constant values for placeholders and selectors will make it possible to customize the view even more.

### Finished / Abandoned ToDos 
* [x] _Other Calendars' Support:_ for the time being, gregorian calendar is fully supported. Support of other calendars is provided by plugins like [Jalaali Calendar Plugin](https://github.com/jalaali/moment-jalaali) or [Hijri Calendar Plugin](https://github.com/xsoh/moment-hijri), but has not been tested.
 
 > Refer to [Plugins Section](https://momentjs.com/docs/#/plugins/) of Moment.js for more information.

[⬆ back to top](#table-of-contents) 

## License
Licensed under [MIT](https://opensource.org/licenses/MIT).

[⬆ back to top](#table-of-contents) 