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
		let hookStatus = [];

		base.options = null;
		base.events = null;
		base.blurTimeout = null;
		base.timeChangeTimeout = null;
		base.setByPlugin = false;
		base.viewpoint = null;

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
				action: 'action',
				focus: "functional-focus"
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

		function doBlur(evt)
		{
			let letBlur = false;
			let $target = $(evt.target);
			let focusByPlugin = base.$el.data(base.constants.data.focus);
			base.$el.data(base.constants.data.focus, false);
			let self = isTargetSelf($target);

			if(evt.type === 'blur' && self)
			{
				letBlur = true;
			}
			else
			{
				if(!self && !isTargetInBase($target, base.getPlaceholder()))
				{
					if(!base.options.debug && !base.options.sticky)
					{
						if(!focusByPlugin)
						{
							letBlur = true;
						}
					}
				}
			}

			if(letBlur)
			{
				base.blurTimeout = setTimeout(function (){
					base.events.hide.call(base);
				}, 200);
			}
		}

		function attachPlaceholderEvents()
		{
			let $placeholder = base.getPlaceholder();

			if(!$placeholder || !$placeholder.length)
			{
				return;
			}

			$placeholder
				.on(
					'mouseover click',
					function (evt){
						evt.preventDefault();

						if(base.blurTimeout)
						{
							clearTimeout(base.blurTimeout);
						}
					}
				)
				.on(
					'click',
					function (evt){
						handleChanges(evt);
					}
				);

			$placeholder.find('.datetimepicker-time')
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
		}

		function setPlaceholder($placeholder)
		{
			base.$el.data(base.constants.data.placeholder, $placeholder);
		}

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

		function isKeyDirectional(evt)
		{
			let which = evt.which;

			return ([keys.left, keys.right, keys.up, keys.down].indexOf(which) !== -1);
		}

		function isTargetSelf($target)
		{
			return $target.is(base.$el);
		}

		function isTargetInBase($target, $placeholder)
		{
			let ret = null;
			let $parents = null;

			if(typeof $placeholder === typeof void 0)
			{
				$placeholder = base.getPlaceholder();
			}

			$parents = $target.closest($placeholder);

			if($parents.length !== 0)
			{
				ret = $target;
			}
			
			return ret;
		}

		base.callHook = function (hook){
			let args = Array.prototype.slice.call(arguments, 1);
			if(base.hooks)
			{
				if(base.hooks.hasOwnProperty(hook))
				{
					let hooks = base.hooks[hook];
					if(typeof hooks !== typeof [])
					{
						hooks = [hooks];
					}

					for(let i = 0; i < hooks.length; i++)
					{
						if(typeof hooks[i] === typeof function (){
						})
						{
							if(!hookStatus.hasOwnProperty(hook))
							{
								hookStatus[hook] = [];
							}

							if(!hookStatus[hook].hasOwnProperty(i))
							{
								hookStatus[hook][i] = false;
							}

							if(!hookStatus[hook][i])
							{
								hookStatus[hook][i] = true;
								hooks[i].apply(base, args);
								hookStatus[hook][i] = false;
							}
						}
					}
				}
			}
		};

		base.runCommand = function (command, options){
			switch(command)
			{
			case 'options':
				base.setOptions(options);
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
								if(typeof base.hooks[event] !== typeof [])
								{
									base.hooks[event] = [base.hooks[event]];
								}

								if(base.hooks[event].indexOf(callback) === -1)
								{
									base.hooks[event].push(callback);
								}
							}
							break;
						}
					}
				}
				break;

			case 'exec':
				if(typeof options === typeof {})
				{
					for(let event in options)
					{
						if(options.hasOwnProperty(event))
						{
							if(base.events.hasOwnProperty(event))
							{
								base.events[event].apply(this, options[event]);
							}
						}
					}
				}
				break;
			}
		};

		base.isDisabled = function ($target){
			return ($target.is('disabled') || $target.hasClass('datetimepicker-disabled'));
		};

		base.getPlaceholder = function (){
			let $placeholder = base.$el.data(base.constants.data.placeholder);
			if(!$placeholder || typeof $placeholder === typeof void 0)
			{
				if(base.options.template)
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

					if(base.options.classes)
					{
						$placeholder.addClass(base.options.classes);
					}

					$placeholder
						.appendTo(appendTo);

					setPlaceholder($placeholder);
				}
				else
				{
					$placeholder = $(null);
				}
			}

			return $placeholder;
		};

		base.getCompleteFormat = function (view){
			let format = [];
			if(typeof view !== typeof void 0)
			{
				view = base.normalizeViewPoint(view);

				if(this.options.allow[view])
				{
					format.push(base.options.allow[view]);
				}

				if(['days', 'time'].indexOf(view) !== -1 && base.allows('time'))
				{
					let $timeInput = base.getPlaceholder()
						.find(".datetimepicker-time");

					let includeTime = true;

					if (view === 'days')
					{
						includeTime = !$timeInput.attr("manual_unset");
					}

					if(includeTime)
					{
						format.push(base.options.timepicker);
					}
				}
			}

			return format.join(' ');
		};

		base.normalizeViewPoint = function (view){
			if(!base.options.allow.hasOwnProperty(view))
			{
				switch(view)
				{
				case 'time':
					view = 'days';
					break;

				case 'days':
					view = 'time';
					break;
				}
			}

			return view;
		};

		base.allows = function (view){
			let ret = true;
			let nView = base.normalizeViewPoint(view);
			let hasNView =  false;

			if(view === 'time')
			{
				ret = base.options.timepicker;
			}

			if (['time', 'days'].indexOf(view) !== -1)
			{
				hasNView = base.options.allow.hasOwnProperty("time")|| base.options.allow.hasOwnProperty("days");
			}
			else
			{
				hasNView = base.options.allow.hasOwnProperty(nView);
			}

			return ret && base.options.allow && hasNView;
		};

		base.matchValueView = function (datetime){
			let result = {
				view: null,
				datetime: null
			};

			let rounds = 2;
			let strict = true;

			if(base.options.allow)
			{
				while(rounds)
				{
					if(!(--rounds))
					{
						strict = false;
					}

					for(let v in base.options.allow)
					{
						if(base.allows(v))
						{
							let format = base.getCompleteFormat(v);

							if(format)
							{
								let d = moment(datetime, format, strict);

								if(d.isValid())
								{
									result.view = v;
									result.datetime = d;
									rounds = 0;
									break;
								}
							}
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

		base.showView = function ($view){
			if(!($view instanceof jQuery))
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

		base.hideView = function ($view){
			if(!($view instanceof jQuery))
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
				let viewpoint = null;

				switch(view)
				{
				case 'time':
				case 'days':
				case 'weeks':
					base.showDaysPicker($placeholder, datetime, view);
					viewpoint = 'days';
					break;

				case 'months':
					base.showMonthsPicker($placeholder, datetime, view);
					viewpoint = 'months';
					break;

				case 'years':
					base.showYearsPicker($placeholder, datetime, view);
					viewpoint = 'years';
					break;
				}

				base.viewpoint = viewpoint;

				base.hideView($views.not('.datetimepicker-' + viewpoint));
				base.showView(
					$($views)
						.filter('.datetimepicker-' + viewpoint)
				);

				if(base.allows("time") && viewpoint === 'days')
				{
					let $timePicker = $views.filter('.datetimepicker-timepicker');
					base.showView($timePicker);

					let $timeInput = $timePicker.find('.datetimepicker-time');

					if(!$timeInput.attr('manual_unset'))
					{
						$timeInput.val(
							base.getDateTime()
								.format(base.options.timepicker)
						);
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
			}
		};

		base.getNextAllowed = function (view, offset){
			if(offset > 0)
			{
				offset = 1;
			}
			else
			{
				offset = -1;
			}

			let next = null;

			let index = $.DateTimePicker.views.indexOf(view);

			if(index !== -1)
			{
				while(index > -1 && index < $.DateTimePicker.views.length)
				{
					let cur = $.DateTimePicker.views[index];

					if(cur)
					{
						if(base.allows(cur))
						{
							next = cur;
							break;
						}
					}
					else
					{
						break;
					}

					index += offset;
				}
			}

			return next;

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
			}
			else
			{
				view = null;
			}

			return view;
		};

		base.isBetweenRange = function (date, view){
			if(!moment.isMoment(date))
			{
				date = moment(date, base.getCompleteFormat(view));
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
				case 'time':
				case 'days':
					precision = 'day';
					break;

				case 'weeks':
					precision = 'week';
					break;

				case 'months':
					precision = 'month';
					break;

				case 'years':
					precision = 'year';
					break;
				}

				if(base.options.min)
				{
					if(date.isBefore(base.options.min, precision))
					{
						ret = false;
					}
				}

				if(base.options.max)
				{
					if(date.isAfter(base.options.max, precision))
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

		base.showDaysPicker = function ($placeholder, datetime, view){
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

			let $weeks = $placeholder.find('.datetimepicker-list-weeks');
			if(base.options.displayWeeks)
			{
				$weeks.html('');
				let week = firstDay.clone();

				for(; week.isSameOrBefore(lastDay); week.add(1, 'week'))
				{
					let $week = $("<div>")
						.html(week.format('W'));

					let classes = ['datetimepicker-cell'];
					let action = ["week"];

					if(base.allows('weeks'))
					{
						if(view === 'weeks' && week.isSame(selectedDay, 'week'))
						{
							classes.push('datetimepicker-selected');
							classes.push('ui-state-active');
						}
					}
					else
					{
						classes.push('not-selectable');
					}

					$week.addClass(classes.join(' '));

					$week.attr('data-' + base.constants.data.action, action.join('|'));
					$week.attr('data-' + base.constants.data.current, week);

					if(!base.isBetweenRange(week, "weeks"))
					{
						base.disableCell($week);
					}
					else
					{
						base.enableCell($week);
					}

					$weeks.append($week);
				}
			}
			else
			{
				$weeks.hide();
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

				if(base.allows('days'))
				{
					if(['days', 'time'].indexOf(view) !== -1 && viewDay.isSame(selectedDay, 'day'))
					{
						classes.push('datetimepicker-selected');
						classes.push('ui-state-active');
					}
				}
				else
				{
					classes.push("not-selectable");
				}

				$day.addClass(classes.join(' '));

				if(!base.isBetweenRange(viewDay, "days"))
				{
					base.disableCell($day);
				}
				else
				{
					$day.attr('data-' + base.constants.data.action, action.join('|'));
					$day.attr('data-' + base.constants.data.current, viewDay);
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

						$cell.attr('data-' + base.constants.data.current, datetime);

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

		base.showMonthsPicker = function ($placeholder, datetime, view){
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

					$month.attr('data-' + base.constants.data.current, month);
				}

				$month.addClass(classes.join(" "));

				$monthsList.append($month);
			}

			$monthPicker.find('[data-action*="year"]')
				.each(
					function (){
						let $cell = $(this);
						$cell.removeData();

						$cell.attr('data-' + base.constants.data.current, datetime);

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

		base.showYearsPicker = function ($placeholder, datetime, view){
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

					$year.attr('data-' + base.constants.data.current, year);
				}

				$year.addClass(classes.join(" "));

				$yearsList.append($year);
			}

			$monthPicker.find('[data-action*="decade"]')
				.each(
					function (){
						let $cell = $(this);
						$cell.removeData();

						$cell.attr('data-' + base.constants.data.current, decadeBegin);

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

				case 'week':
					increment = 1;
					unit = 'week';
					view = 'weeks';
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

				let format = base.getCompleteFormat(view);

				if(!moment.isMoment(current))
				{
					current = moment(current);
				}

				if(base.allows('time'))
				{
					let $timeInput = base.getPlaceholder()
						.find('.datetimepicker-time');

					if($timeInput.val())
					{
						let time = moment($timeInput.val(), base.options.timepicker);
						current.hour(time.hour());
						current.minute(time.minute());
						current.second(time.second());
						current.millisecond(time.millisecond());

						if(action[0] === 'time')
						{
							$timeInput.removeAttr('manual_unset');
						}
					}
					else
					{
						if(action[0] === 'time')
						{
							$timeInput.attr('manual_unset', true);
						}
						format = base.getCompleteFormat(view);
						current = moment(current.format(format), format);
					}
				}

				switch(action[1])
				{
				case 'prev':
				case 'next':
					// clicked of previous/next month/year/decade buttons
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
					// clicked on current month/year/decade button - to show a higher level

					if(view === 'decades')
					{
						// no higher level after decades, stay on `years`-view
						view = 'years';
					}
					base.showCalendar(current, base.getView(view));
					break;

				default:
					// clicked on a specific year/month/week/day value to select it
					if(base.allows(view))
					{
						base.setByPlugin = true;
						base.events.set.call(base, current, view);
						base.setByPlugin = false;
					}

					// try showing a lower level view
					let offset = -1;

					// if showing weeks or days, don't need to drill down, as days/time view is also present
					if(['weeks', 'days'].indexOf(view) !== -1)
					{
						offset = 0;
					}

					let targetView = base.getView(view, offset);

					// `weeks` is a virtual view. if `weeks`-view is the target view and not allowed, check if
					// `days`-view is allowed.
					let allowed = base.allows(targetView);
					if(targetView === 'weeks' && !allowed)
					{
						allowed = base.allows('days');
						targetView = 'days';
					}

					if(allowed || base.getNextAllowed(view, offset))
					{
						base.showCalendar(current, targetView, view);
					}
					break;
				}
			}
		};

		base.setOptions = function (options){
			let events = {};

			if(options.hasOwnProperty('events'))
			{
				events = options.events;
			}

			let initiateEvents = false;

			if(!base.options)
			{
				initiateEvents = true;
			}

			let currentOptions = (base.options === null)? $.DateTimePicker.defaultOptions:base.options;
			let currentEvents = (base.events === null)? $.DateTimePicker.defaultEvents:base.events;
			base.options = $.extend({}, currentOptions, options);
			base.events = $.extend({}, currentEvents, events);

			let min_max = ['min', 'max'];
			for(let i in min_max)
			{
				i = min_max[i];

				if(base.options.hasOwnProperty(i))
				{
					if(base.options[i])
					{
						if(!moment.isMoment(base.options[i]))
						{
							base.options[i] = base.matchValueView(base.options[i]).datetime;
						}
					}
				}
			}

			if(base.allows('weeks') && !base.options.displayWeeks)
			{
				base.options.displayWeeks = true;
			}

			if(base.options.hooks)
			{
				base.runCommand("hooks", base.options.hooks);
			}

			if(base.options.allow === null)
			{
				// todo: throw error indicating the plugin has no allowed formats
			}

			if(initiateEvents || currentOptions.template !== base.options.template)
			{
				setPlaceholder(null);
				attachPlaceholderEvents();
			}

			if(base.options.trigger)
			{
				let trigger = base.options.trigger;
				if(typeof trigger !== typeof {})
				{
					base.options.trigger = {};
					base.options.trigger[trigger] = base.options.view;
				}

				for(trigger in base.options.trigger)
				{
					if(!base.options.trigger.hasOwnProperty(trigger))
					{
						continue;
					}

					let $trigger = $(trigger);

					let view = base.options.trigger[trigger];
					$trigger.on(
						"click", function (){
							if(!base.getPlaceholder().is(":visible") || base.viewpoint !== view)
							{
								base.events.show.call(base, view);
							}
							else
							{
								base.events.hide.call(base);
							}
						}
					)
				}
			}

			if(base.options.inline)
			{
				base.getPlaceholder();
				base.showCalendar();
			}
		}
		;

		base.init = function (){
			base.setOptions(options);

			base.$el.data(base.constants.data.focus, false);

			base.$el.on(
				"change keyup",
				function (evt){
					if(evt.which && isKeyDirectional(evt.which))
					{
						return;
					}

					if(!base.setByPlugin)
					{
						let view = base.getView();
						let datetime = base.getDateTime();
						base.showCalendar(datetime);
						base.callHook("set", datetime, view);
					}
				});

			base.$el.on(
				"focus", function (){
					base.events.show.call(base);
				}
			);

			base.$el.on(
				"blur", function (evt){
					doBlur(evt);
				}
			);

			$(document)
				.on(
					"click",
					function (evt){
						doBlur(evt);
					}
				);

			if(!base.$el.attr('id'))
			{
				base.$el.uniqueId();
			}

			base.callHook('init');
		};

		// Run initializer
		base.init();
	}
	;

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
		'time',
		'days',
		'weeks',
		'months',
		'years',
		'decades'
	];

	$.DateTimePicker.defaultOptions = {
		allow: null,
		buttons: null,
		classes: null,
		debug: false,
		displayWeeks: false,
		hooks: null,
		inline: false,
		locale: 'default',
		max: null,
		min: null,
		position: null,
		sticky: false,
		template: null,
		timepicker: false,
		trigger: null,
		view: 'days'
	};

	$.DateTimePicker.defaultEvents = {
		show: function (view){
			clearTimeout(this.blurTimeout);
			this.$el.data(this.constants.data.focus, true);
			this.showCalendar(void 0, view);
		},
		hide: function (){
			if(!this.options.inline)
			{
				this.hideView(this.getPlaceholder());
			}
		},
		set: function (datetime, view){
			let format = this.getCompleteFormat(view);
			if(!moment.isMoment(datetime))
			{
				datetime = moment(datetime, format);
			}

			if(format)
			{
				this.$el.val(datetime.format(format));
			}

			this.callHook('set', datetime, view);
		}
	};

	$.DateTimePicker.getTemplate = function (path){
		let template = null;

		$.ajax({
			url: path,
			async: false,
			success: function (html){
				template = html;
			}
		});

		return template;
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

})
(jQuery);