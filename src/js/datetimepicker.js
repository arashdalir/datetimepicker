/**
 *
 * @License: MIT
 * @Author: Arash Dalir (arash.dalir [at] gmail.com)
 *
 */
(function ($){
	'use strict';
	$.DateTimePicker = function (el, options){
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		let base = this;

		base.blurTimeout = null;
		base.timeChangeTimeout = null;
		base.setByPlugin = false;

		// Access to jQuery and DOM versions of element
		base.$el = $(el);
		base.el = el;

		base.hooks = {};

		// Add a reverse reference to the DOM object
		base.$el.data("DateTimePicker", base);

		base.constants = {
			data: {
				placeholder: 'datetimepicker_placeholder',
				current: 'date_current',
				action: 'action'
			}
		};

		let keys = {
			left: 37,
			up: 38,
			right: 39,
			down: 40,
			tab: 9,
			enter: 13,
			capsLock: 20,
			backspace: 8,
			numLock: 144
		};

		function isKeyDirectional(evt)
		{
			let which = evt.which;

			return ([keys.left, keys.right, keys.up, keys.down].indexOf(which) != -1);
		}

		function isTargetInBase($target, $placeholder)
		{
			if(typeof $placeholder === typeof void 0)
			{
				$placeholder = base.getPlaceholder();
			}

			let $parents = $target.closest($placeholder);

			if($parents.length !== 0)
			{
				return $target;
			}
			else
			{
				return null;
			}
		}

		base.callHook = function (hook, ...args)
		{
			if (base.hooks)
			{
				if (base.hooks.hasOwnProperty(hook))
				{
					let hooks = base.hooks[hook];
					if (typeof hooks !== typeof [])
					{
						hooks = [hooks];
					}

					for(let i = 0; i < hooks.length; i++)
					{
						if (typeof hooks[i] === typeof function(){})
						{
							hooks[i].apply(base, args);
						}
					}
				}
			}
		};

		base.runCommand = function (command, options){
			switch(command)
			{
			case 'options':
				base.options = $.extend({}, base.options, options);
				break;

			case "hooks":
				if(typeof options === typeof {})
				{
					for(let event in options)
					{
						if(options.hasOwnProperty(event))
						{
							let callback = options[event];

							if(typeof callback === typeof function (){
							})
							{
								if (typeof base.hooks[event] !== typeof [])
								{
									base.hooks[event] = [base.hooks[event]];
								}

								base.hooks[event].push(callback);
							}
							break;
						}
					}
				}
				break;
			}
		};

		base.isDisabled = function ($target){
			return ($target.is('disabled') || $target.hasClass('datetimepicker-disabled'));
		};

		base.has = function (token, formatDate){
			let formatTime = null;
			if(typeof formatDate === typeof void 0)
			{
				formatDate = base.options.formatDate;
				formatTime = base.options.formatTime;
			}
			else
			{
				formatTime = formatDate;
			}

			let ret = false;

			switch(token)
			{
			case 'days':
				if(formatDate)
				{
					ret = formatDate.match(/D/);
				}
				break;

			case 'months':
				if(formatDate)
				{
					ret = formatDate.match(/M/);
				}
				break;

			case 'years':
				if(formatDate)
				{
					ret = formatDate.match(/Y/);
				}
				break;

			case 'hours':
				if(formatTime)
				{
					ret = base.has('days') && formatTime.match(/[hHkK]/);
				}
				break;

			case 'minutes':
				if(formatTime)
				{
					ret = base.has('days', formatDate) && formatTime.match(/m/);
				}
				break;

			case 'seconds':
				if(formatTime)
				{
					ret = base.has('days', formatDate) && formatTime.match(/s/);
				}
				break;

			case 'date':
				ret = base.has('days', formatDate) || base.has('months', formatDate) || base.has('years', formatDate);
				break;

			case 'time':
				ret = base.has('hours', formatDate) || base.has('minutes', formatDate) || base.has('seconds', formatDate);
				break;
			}

			return ret;
		};

		base.getPlaceholder = function (){
			let $placeholder = base.$el.data(base.constants.data.placeholder);
			if(typeof $placeholder === typeof void 0)
			{
				$placeholder = $(base.options.template);

				let appendTo = 'body';
				if(base.options.inline)
				{
					appendTo = $("<div>")
						.addClass("datetimepicker-inline")
						.addClass("clearfix");

					base.$el.after(appendTo);
				}

				if (base.options.classes)
				{
					$placeholder.addClass(base.options.classes);
				}

				$placeholder
					.appendTo(appendTo);

				base.$el.data(base.constants.data.placeholder, $placeholder);
			}

			return $placeholder;
		};

		base.getCompleteFormat = function (view){
			let format = [];
			if(typeof view !== typeof void 0)
			{
				if(this.options.allow[view])
				{
					format.push(base.options.allow[view]);
				}
			}
			else
			{
				format.push(base.options.formatDate);
			}

			if(format.length && base.has('days', format[0]) && !base.has('time', format[0]) && base.options.formatTime)
			{
				format.push(base.options.formatTime);
			}

			return format.join(' ');
		};

		base.matchValueView = function (datetime){
			let result = {
				view: null,
				datetime: null
			};

			let rounds = 2;
			let strict = true;

			while(rounds)
			{
				if (!(--rounds))
				{
					strict = false;
				}

				for(let v = 0; v < $.DateTimePicker.views.length; v++)
				{
					let view = $.DateTimePicker.views[v];
					let format = base.getCompleteFormat(view);

					if(format)
					{
						let d = moment(datetime, format, strict);

						if(d.isValid())
						{
							result.view = view;
							result.datetime = d;
							rounds = 0;
							break;
						}
					}
				}
			}

			return result;
		};

		base.getDateTime = function (){
			let datetime = null;

			if(!(datetime = base.$el.val()))
			{
				datetime = moment();
			}

			if(!(datetime instanceof moment))
			{
				datetime = base.matchValueView(datetime).datetime;
			}

			if(!datetime || !datetime.isValid())
			{
				datetime = moment();
			}

			return datetime;
		};

		base.showView = function($view)
		{
			if (!($view instanceof jQuery))
			{
				// todo: alert that the item is not a valid instance
			}
			else
			{
				$view
					.addClass("datetimepicker-visible")
					.show()
			}
		};

		base.hideView = function($view)
		{
			if (!($view instanceof jQuery))
			{
				// todo: alert that the item is not a valid instance
			}
			else
			{
				$view
					.removeClass("datetimepicker-visible")
					.hide();
			}
		};

		base.showCalendar = function (datetime, view){
			let position = base.options.position;

			if(!position)
			{
				position = {
					my: 'center top',
					at: 'center bottom+5',
					of: base.$el,
					collision: 'flipfit'
				};
			}

			view = base.getView(view);
			let $placeholder = base.getPlaceholder();

			let $views = $placeholder.find('.datetimepicker-view');

			if(view)
			{
				base.hideView($views.not('.datetimepicker-' + view));
				base.showView($($views).filter('.datetimepicker-' + view));
				switch(view)
				{
				case 'days':
					base.showDaysPicker($placeholder, datetime);
					break;

				case 'months':
					base.showMonthsPicker($placeholder, datetime);
					break;

				case 'years':
					base.showYearsPicker($placeholder, datetime);
					break;
				}

				if(view === 'days' && base.has('time', base.getCompleteFormat(view)))
				{
					let $timePicker = $views.filter('.datetimepicker-hours');
					base.showView($timePicker);

					let $timeInput = $timePicker.find('.datetimepicker-time');

					if(!$timeInput.val())
					{
						$timeInput.val(moment()
							.format(base.options.formatTime));
					}
					else
					{
						if(base.$el.val())
						{
							$timeInput.val(base.getDateTime()
								.format(base.options.formatTime));
						}
					}
				}
			}

			if(base.options.buttons)
			{
				let $buttons = $views.filter('.datetimepicker-buttons');

				for(let b in base.options.buttons)
				{
					if(base.options.buttons.hasOwnProperty(b))
					{
						let button = base.options.buttons[b];
						$buttons.append(button);
					}
				}

				base.showView($buttons);
			}

			base.callHook("showCalendar", $placeholder, view);

			base.showView($placeholder);
			$placeholder.position(position);
		};

		base.getView = function (view, offset){
			if(typeof view === typeof void 0)
			{
				let datetime = base.$el.val();

				if(datetime)
				{
					view = base.matchValueView(datetime).view;
				}

				if(!view)
				{
					view = base.options.view;
				}
			}

			if(typeof offset === typeof void 0)
			{
				offset = null;
			}

			let index = $.DateTimePicker.views.indexOf(view);

			if(index !== -1)
			{
				if(offset !== null)
				{
					index += offset;

					if($.DateTimePicker.views[index] !== void 0)
					{
						view = $.DateTimePicker.views[index];
					}
				}

				if(!base.has(view))
				{
					if($.DateTimePicker.views[index + 1])
					{
						view = $.DateTimePicker.views[index + 1];
					}
					else
					{
						if($.DateTimePicker.views[index - 1])
						{
							view = $.DateTimePicker.views[index - 1];
						}
						else
						{
							view = null;
						}
					}
				}
			}
			else
			{
				view = null;
			}

			return view;
		};

		base.isBetweenRange = function (viewDay, view){
			if(!moment.isMoment(viewDay))
			{
				viewDay = moment(viewDay, base.getCompleteFormat());
			}

			let ret = false;

			if(!base.options.min && !base.options.max)
			{
				ret = true;
			}
			else
			{
				ret = true;

				let precision = null;
				switch(view)
				{
				case 'days':
					precision = 'day';
					break;

				case 'months':
					precision = 'month';
					break;

				case 'years':
					precision = 'year';
					break;
				}

				let format = base.getCompleteFormat(view);

				if(base.options.min)
				{
					if(viewDay.isBefore(moment(base.options.min, format), precision))
					{
						ret = false;
					}
				}

				if(base.options.max)
				{
					if(viewDay.isAfter(moment(base.options.max, format), precision))
					{
						ret = false;
					}
				}
			}

			return ret;
		};

		base.disableCell = function ($cell){
			$cell.addClass("datetimepicker-disabled");
			$cell.addClass("ui-state-disabled");
			$cell.prop('disabled', true);
		};

		base.enableCell = function ($cell){
			$cell.removeClass("datetimepicker-disabled");
			$cell.removeClass("ui-state-disabled");
			$cell.removeProp('disabled');
		};

		base.showDaysPicker = function ($placeholder, datetime){
			let selectedDay = base.getDateTime();

			if(typeof datetime === typeof void 0)
			{
				datetime = selectedDay.clone();
			}
			else
			{
				if(!moment.isMoment(datetime))
				{
					datetime = moment(datetime);
				}
			}

			let $dayPicker = $placeholder.find('.datetimepicker-days');
			let today = moment();

			let month = datetime.format("MMM Y");

			let monthBegin = datetime.clone()
				.startOf('month');
			let monthEnd = datetime.clone()
				.endOf('month');

			let firstDay = monthBegin.weekday();

			if(firstDay > 0)
			{
				firstDay = monthBegin.clone()
					.subtract(firstDay, "days");
			}
			else
			{
				firstDay = monthBegin.clone();
			}

			let lastDay = monthEnd.weekday();
			if(lastDay !== 7)
			{
				lastDay = monthEnd.clone()
					.add(7 - 1 - lastDay, "days");
			}
			else
			{
				lastDay = monthEnd.clone();
			}

			let daysList =
				$dayPicker.find('.datetimepicker-list-days');

			daysList.html('');
			for(let viewDay = firstDay.clone(); viewDay.isSameOrBefore(lastDay); viewDay = viewDay.add(1, 'day'))
			{
				let $day = $("<div>")
					.html(viewDay.get('date'));

				let classes = ['datetimepicker-cell'];
				let action = ["date"];
				if(viewDay.isBefore(monthBegin) || viewDay.isAfter(monthEnd))
				{
					classes.push('datetimepicker-another-month');
					action.push('change');
				}

				if(viewDay.isSame(today, 'day'))
				{
					classes.push('datetimepicker-today');
				}

				if(viewDay.isSame(selectedDay, 'day'))
				{
					classes.push('datetimepicker-selected');
					classes.push('ui-state-active');
				}

				$day.addClass(classes.join(' '));

				if(!base.isBetweenRange(viewDay, "days"))
				{
					base.disableCell($day);
				}
				else
				{
					$day.attr('data-' + base.constants.data.action, action.join('|'));
					$day.attr('data-' + base.constants.data.current, viewDay.format(base.options.formatDate));
				}

				daysList.append($day);
			}

			let minWeekDays = moment.weekdaysMin(true);
			let weekdays = "";
			for(let i = 0; i < minWeekDays.length; i++)
			{
				weekdays += "<div class='datetimepicker-cell'>" + minWeekDays[i] + "</div>";
			}

			$dayPicker.find('.datetimepicker-weekdays')
				.html(weekdays);
			$dayPicker.find('[data-action="month|current"]')
				.html(month);

			$dayPicker.find('[data-action*="month"]')
				.each(
					function (){
						let $cell = $(this);
						$cell.removeData();

						$cell.attr('data-' + base.constants.data.current, datetime.format(base.options.formatDate));

						let action = $cell.data(base.constants.data.action)
							.split('|');

						let checkDate = null;

						switch(action[1])
						{
						case 'next':
							checkDate = monthEnd.clone()
								.add(1, 'day');
							break;

						case 'prev':
							checkDate = monthBegin.clone()
								.subtract(1, 'day');
							break;

						default:
							checkDate = null;
						}

						if(checkDate)
						{
							if(!base.isBetweenRange(checkDate, "days"))
							{
								base.disableCell($cell);
							}
							else
							{
								base.enableCell($cell);
							}
						}
					}
				);
		};

		base.showMonthsPicker = function ($placeholder, datetime){
			let selectedDay = base.getDateTime();

			if(typeof datetime === typeof void 0)
			{
				datetime = selectedDay.clone();
			}
			else
			{
				if(!moment.isMoment(datetime))
				{
					datetime = moment(datetime);
				}
			}

			let $monthPicker = $placeholder.find('.datetimepicker-months');
			let today = moment();

			let year = datetime.format('Y');

			$monthPicker.find("[data-action='year|current']")
				.html(year);

			let $monthsList = $monthPicker.find('.datetimepicker-list-months');

			$monthsList.html('');

			let months = moment.monthsShort();

			for(let i = 0; i < months.length; i++)
			{
				let $month = $("<div>")
					.html(months[i]);

				let month = moment({year: year, month: i});
				let monthBegin = month.clone()
					.startOf('month');
				let monthEnd = month.clone()
					.endOf('month');

				let classes = ['datetimepicker-flexcell'];

				if(today.isBetween(monthBegin, monthEnd))
				{
					classes.push('datetimepicker-today');
				}

				if(selectedDay.isBetween(monthBegin, monthEnd) || selectedDay.isSame(month))
				{
					classes.push('datetimepicker-selected');
					classes.push('ui-state-active');
				}

				if(!base.isBetweenRange(monthBegin, "months") && !base.isBetweenRange(monthEnd, "months"))
				{
					base.disableCell($month);
				}
				else
				{
					$month.attr('data-' + base.constants.data.action, 'month');

					$month.attr('data-' + base.constants.data.current, month.format(base.options.formatDate));
				}

				$month.addClass(classes.join(" "));

				$monthsList.append($month);
			}

			$monthPicker.find('[data-action*="year"]')
				.each(
					function (){
						let $cell = $(this);
						$cell.removeData();

						$cell.attr('data-' + base.constants.data.current, datetime.format(base.options.formatDate));

						let action = $cell.data(base.constants.data.action)
							.split('|');

						let checkDate = null;

						switch(action[1])
						{
						case 'next':
							checkDate = datetime.clone()
								.endOf('year')
								.add(1, 'day');
							break;

						case 'prev':
							checkDate = datetime.clone()
								.startOf('year')
								.subtract(1, 'day');
							break;

						default:
							checkDate = null;
						}

						if(checkDate)
						{
							if(!base.isBetweenRange(checkDate, "months"))
							{
								base.disableCell($cell);
							}
							else
							{
								base.enableCell($cell);
							}
						}
					}
				);
		};

		base.showYearsPicker = function ($placeholder, datetime){
			let selectedDay = base.getDateTime();

			if(typeof datetime === typeof void 0)
			{
				datetime = selectedDay.clone();
			}
			else
			{
				if(!moment.isMoment(datetime))
				{
					datetime = moment(datetime);
				}
			}

			let $monthPicker = $placeholder.find('.datetimepicker-years');
			let today = moment();

			let year = datetime.format('Y');
			let decade = Math.floor(year / 10);
			let decadeBegin = moment({year: decade * 10});
			let decadeEnd = moment({year: (decade + 1) * 10})
				.subtract(1, 'day');

			$monthPicker.find("[data-action='decade|current']")
				.html(decadeBegin.format('Y') + ' - ' + decadeEnd.format('Y'));

			let $yearsList = $monthPicker.find('.datetimepicker-list-years');

			$yearsList.html('');

			let years = moment.monthsShort();

			for(let i = decadeBegin.get('year'); i <= decadeEnd.get('year'); i++)
			{
				let $year = $("<div>")
					.html(i);

				let year = moment({year: i});
				let yearBegin = year.clone()
					.startOf('year');
				let yearEnd = year.clone()
					.endOf('year');

				let classes = ['datetimepicker-flexcell'];

				if(today.isBetween(yearBegin, yearEnd))
				{
					classes.push('datetimepicker-today');
				}

				if(selectedDay.isBetween(yearBegin, yearEnd) || selectedDay.isSame(year))
				{
					classes.push('datetimepicker-selected');
					classes.push('ui-state-active');
				}

				if(!base.isBetweenRange(yearBegin, "years") && !base.isBetweenRange(yearEnd, "years"))
				{
					base.disableCell($year);
				}
				else
				{
					$year.attr('data-' + base.constants.data.action, 'year');

					$year.attr('data-' + base.constants.data.current, year.format(base.options.formatDate));
				}

				$year.addClass(classes.join(" "));

				$yearsList.append($year);
			}

			$monthPicker.find('[data-action*="decade"]')
				.each(
					function (){
						let $cell = $(this);
						$cell.removeData();

						$cell.attr('data-' + base.constants.data.current, decadeBegin.format(base.options.formatDate));

						let action = $cell.data(base.constants.data.action)
							.split('|');

						let checkDate = null;

						switch(action[1])
						{
						case 'next':
							checkDate = decadeEnd.clone()
								.endOf('year')
								.add(1, 'day');
							break;

						case 'prev':
							checkDate = decadeBegin.clone()
								.startOf('year')
								.subtract(1, 'day');
							break;

						default:
							checkDate = null;
						}

						if(checkDate)
						{
							if(!base.isBetweenRange(checkDate, "years"))
							{
								base.disableCell($cell);
							}
							else
							{
								base.enableCell($cell);
							}
						}
					}
				);
		};

		base.handleActions = function (event, $target){
			let action = $target.data(base.constants.data.action);
			let current = $target.data(base.constants.data.current);

			if(typeof current === typeof void 0)
			{
				current = base.getDateTime();
			}

			if(action)
			{
				action = action.split('|');

				let increment = null;
				let unit = null;
				let view = null;

				switch(action[0])
				{
				case 'decade':
					increment = 10;
					unit = 'year';
					view = 'decades';
					break;

				case 'year':
					increment = 1;
					unit = 'year';
					view = 'years';
					break;

				case 'month':
					increment = 1;
					unit = 'month';
					view = 'months';
					break;

				case 'date':
					increment = 1;
					unit = 'day';
					view = 'days';
					break;

				case 'time':
					if(["change", "keyup"].indexOf(event.type) === -1)
					{
						return;
					}
					increment = null;
					unit = null;
					view = 'days';
					break;
				}

				let format = base.getCompleteFormat();

				if(!moment.isMoment(current))
				{
					current = moment(current, format);
				}

				if(base.has('time', format))
				{
					let time = moment(
						base.getPlaceholder()
							.find('.datetimepicker-time')
							.val(),
						base.options.formatTime
					);

					current.hour(time.hour());
					current.minute(time.minute());
					current.second(time.second());
					current.millisecond(time.millisecond());
				}

				switch(action[1])
				{
				case 'prev':
				case 'next':
					if(increment && unit)
					{
						if(action[1] === 'prev')
						{
							current.subtract(increment, unit);
						}
						else
						{
							current.add(increment, unit);
						}
						current.startOf(unit);
						base.showCalendar(current, base.getView(view, -1));
					}
					break;

				case 'current':
					base.showCalendar(current, base.getView(view));
					break;

				default:
					base.setByPlugin = true;
					base.events.set.call(base, base.$el, current, view);
					base.setByPlugin = false;
					base.showCalendar(current, base.getView(view, -1));
					break;
				}
			}
		};

		base.init = function (){
			let events = {};

			if(options.hasOwnProperty('events'))
			{
				events = options.events;
			}

			base.options = $.extend({}, $.DateTimePicker.defaultOptions, options);
			base.events = $.extend({}, $.DateTimePicker.defaultEvents, events);

			if (base.options.hooks)
			{
				base.runCommand("hooks", base.options.hooks);
			}

			if(base.options.allow === null)
			{
				let key = null;

				switch(true)
				{
				case !!base.has("time"):
				case !!base.has("days"):
					key = "days";
					break;

				case !!base.has("months"):
					key = "months";
					break;

				case !!base.has("years"):
					key = "years";
					break;
				}

				if(key)
				{
					base.options.allow = {};
					base.options.allow[key] = base.getCompleteFormat();
				}
			}

			base.$el.on(
				"change keyup",
				function (evt){
					if(evt.which && isKeyDirectional(evt.which))
					{
						return;
					}

					if(!base.setByPlugin)
					{
						base.showCalendar(base.getDateTime());
					}
				});

			base.$el.on(
				"focus", function (){
					base.events.show.call(base);
				}
			);

			base.$el.on(
				"blur", function (evt){
					if(!base.options.debug && !base.options.sticky)
					{
						base.blurTimeout = setTimeout(function (){
							base.events.hide.call(base);
						}, 200);
					}
				}
			);

			$(document)
				.on(
					"click",
					function (evt){
						let $target = $(evt.target);

						if($target.get(0) !== base.$el.get(0) && !isTargetInBase($target, base.getPlaceholder()))
						{
							base.$el.blur();
						}
					}
				);

			base.getPlaceholder()
				.on(
					'mouseover click',
					function (evt){
						let $target = $(evt.target);
						evt.preventDefault();

						if(base.blurTimeout)
						{
							clearTimeout(base.blurTimeout);
						}
					}
				);

			function handleChanges(evt)
			{
				let $target = $(evt.target);
				if(!base.isDisabled($target))
				{
					evt.preventDefault();
					evt.stopPropagation();
					base.handleActions(evt, $target);
				}
			}

			base.getPlaceholder()
				.on(
					'click',
					function (evt){
						handleChanges(evt);
					}
				);
			base.getPlaceholder()
				.find('.datetimepicker-time')
				.on(
					"keyup change",
					function (evt){
						if(evt.which && isKeyDirectional(evt.which))
						{
							return;
						}
						if(base.timeChangeTimeout)
						{
							clearTimeout(base.timeChangeTimeout);
						}

						base.timeChangeTimeout = setTimeout(
							function (){
								handleChanges(evt);
							},
							1000
						);
					}
				);

			if(base.options.trigger)
			{
				base.$trigger = $(base.options.trigger);

				base.$trigger.on(
					"click", function (){
						if(!base.$trigger.data('status') || base.$trigger.data('status') === "invisible")
						{
							base.$trigger.data('status', "visible");
							base.events.show.call(base);
						}
						else
						{
							base.$trigger.data('status', "invisible");
							base.events.hide.call(base);
						}
					}
				)
			}

			if(!base.$el.attr('id'))
			{
				base.$el.uniqueId();
			}

			if(base.options.inline)
			{
				base.getPlaceholder();
				base.showCalendar();
			}

			base.callHook('init');
		};

		// Run initializer
		base.init();
	};

	$.DateTimePicker.setLocale = function (base){
		if(typeof base !== typeof void 0)
		{
			if(base.hasOwnProperty('options'))
			{
				if(base.options.hasOwnProperty('options'))
				{
					moment.locale(base.options.locale);
				}
			}
		}
	};

	$.DateTimePicker.views = [
		'days',
		'months',
		'years',
		'decades'
	];

	$.DateTimePicker.defaultOptions = {
		allow: null,
		buttons: null,
		classes: null,
		debug: false,
		formatDate: 'DD/MM/Y',
		formatTime: 'H:mm:ss',
		hooks: null,
		inline: false,
		locale: 'default',
		max: null,
		min: null,
		position: null,
		sticky: false,
		template:
			'<div class="ui-state-default datetimepicker-placeholder">' +
			'<div class="datetimepicker-view datetimepicker-years">' +
			'<div class="datetimepicker-line">' +
			'<div class="datetimepicker-cell datetimepicker-prev" data-action="decade|prev"></div>' +
			'<div class="datetimepicker-flexcell datetimepicker-current" data-action="decade|current"></div>' +
			'<div class="datetimepicker-cell datetimepicker-next" data-action="decade|next"></div>' +
			'</div>' +
			'<div class="datetimepicker-list datetimepicker-list-years"></div>' +
			'</div>' +
			'<div class="datetimepicker-view datetimepicker-months">' +
			'<div class="datetimepicker-line">' +
			'<div class="datetimepicker-flexcell datetimepicker-prev" data-action="year|prev"></div>' +
			'<div class="datetimepicker-flexcell datetimepicker-current" data-action="year|current"></div>' +
			'<div class="datetimepicker-cell datetimepicker-next" data-action="year|next"></div>' +
			'</div>' +
			'<div class="datetimepicker-list datetimepicker-list-months"></div>' +
			'</div>' +
			'<div class="datetimepicker-view datetimepicker-days">' +
			'<div class="datetimepicker-line">' +
			'<div class="datetimepicker-cell datetimepicker-prev" data-action="month|prev"></div>' +
			'<div class="datetimepicker-flexcell datetimepicker-current" data-action="month|current"></div>' +
			'<div class="datetimepicker-cell datetimepicker-next" data-action="month|next"></div>' +
			'</div>' +
			'<div class="datetimepicker-weekdays"></div>' +
			'<div class="datetimepicker-list datetimepicker-list-days"></div>' +
			'</div>' +
			'<div class="datetimepicker-view datetimepicker-hours">' +
			'<input class="datetimepicker-time" data-action="time" type="text" />' +
			'</div>' +
			'<div class="datetimepicker-view datetimepicker-extra"></div>' +
			'<div class="datetimepicker-view datetimepicker-buttons"></div>' +
			'</div>' +
			'</div>',
		trigger: null,
		view: 'days'
	};

	$.DateTimePicker.defaultEvents = {
		show: function (){
			this.showCalendar();
		},
		hide: function (){
			if(!this.options.inline)
			{
				this.hideView(this.getPlaceholder());
			}
		},
		set: function ($el, datetime, view){
			let format = this.getCompleteFormat(view);
			if(format)
			{
				$el.val(datetime.format(format));
			}

			this.callHook('set', this, $el, view);
		}
	};

	$.fn.DateTimePicker = function (command, options){
		if(typeof command !== typeof "")
		{
			options = command;
			command = null;
		}

		if(typeof options === typeof void 0)
		{
			options = {};
		}

		if(command === null)
		{
			return this.each(function (){
				(new $.DateTimePicker(this, options));
			});
		}
		else
		{
			this.each(function (){
				let $this = $(this);
				let $plugin = $this.data("DateTimePicker");
				$plugin.runCommand(command, options);
			});

			return this;
		}
	};

})(jQuery);