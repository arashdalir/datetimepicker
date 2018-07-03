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

		let blurTimeout = null;

		// Access to jQuery and DOM versions of element
		base.$el = $(el);
		base.el = el;

		// Add a reverse reference to the DOM object
		base.$el.data("DateTimePicker", base);

		base.constants = {
			data: {
				placeholder: 'datetimepicker_placeholder',
				current: 'date_current',
				action: 'action'
			}
		};

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

		base.isDisabled = function ($target){
			return ($target.is('disabled') || $target.hasClass('datetimepicker-disabled'));
		};

		base.has = function (token){
			let ret = false;

			switch(token)
			{
			case 'days':
				if(base.options.formatDate)
				{
					ret = base.options.formatDate.match(/D/);
				}
				break;

			case 'months':
				if(base.options.formatDate)
				{
					ret = base.options.formatDate.match(/M/);
				}
				break;

			case 'years':
				if(base.options.formatDate)
				{
					ret = base.options.formatDate.match(/Y/);
				}
				break;

			case 'hours':
				if(base.options.formatTime)
				{
					ret = base.has('days') && base.options.formatTime.match(/[hHkK]/);
				}
				break;

			case 'minutes':
				if(base.options.formatTime)
				{
					ret = base.has('days') && base.options.formatTime.match(/m/);
				}
				break;

			case 'seconds':
				if(base.options.formatTime)
				{
					ret = base.has('days') && base.options.formatTime.match(/s/);
				}
				break;

			case 'date':
				ret = base.has('days') || base.has('months') || base.has('years');
				break;

			case 'time':
				ret = base.has('hours') || base.has('minutes') || base.has('seconds');
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
				if (base.options.inline)
				{
					appendTo = $("<div>")
						.addClass("datetimepicker-inline")
						.addClass("clearfix");

					base.$el.after(appendTo);
				}
				$placeholder
					.appendTo(appendTo);
				base.$el.data(base.constants.data.placeholder, $placeholder);
			}

			return $placeholder;
		};

		base.getCompleteFormat = function (){
			let format = [];

			if(base.has('date'))
			{
				format.push(base.options.formatDate);
			}
			if(base.has('time'))
			{
				format.push(base.options.formatTime);
			}

			return format.join(' ');
		};

		base.getDateTime = function (){
			let datetime = null;

			if(!(datetime = base.$el.val()))
			{
				datetime = moment();
				base.$el.val(datetime.format(base.getCompleteFormat()));
			}

			if(!(datetime instanceof moment))
			{
				datetime = moment(datetime, base.getCompleteFormat());
			}

			if(!datetime.isValid())
			{
				datetime = moment();
			}

			return datetime;
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

			view = base.getBaseView(view);
			let $placeholder = base.getPlaceholder();

			let $views = $placeholder.find('.datetimepicker-view');

			if(view)
			{
				$views.not('.datetimepicker-' + view)
					.hide();
				$($views)
					.filter('.datetimepicker-' + view)
					.show();
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

				if(view === 'days' && base.has('time'))
				{
					let $timePicker = $views.filter('.datetimepicker-hours');
					$timePicker.show();

					let $timeInput = $timePicker.find('.datetimepicker-time');

					if(!$timeInput.val())
					{
						$timeInput.val(moment()
							.format(base.options.formatTime));
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

				$buttons.show();
			}

			$placeholder.show().position(position);
		};

		base.getBaseView = function (view){
			if(typeof view === typeof void 0)
			{
				view = base.options.view;
			}

			let index = $.DateTimePicker.views.indexOf(view);

			if(index !== -1)
			{
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

		base.isBetweenRange = function (viewDay){
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

				if(base.options.min)
				{
					if(viewDay.isBefore(moment(base.options.min, base.options.formatDate), 'day'))
					{
						ret = false;
					}
				}

				if(base.options.max)
				{
					if(viewDay.isAfter(moment(base.options.max, base.options.formatDate), 'day'))
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

				if(!base.isBetweenRange(viewDay))
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
							if(!base.isBetweenRange(checkDate))
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

				if(!base.isBetweenRange(monthBegin) && !base.isBetweenRange(monthEnd))
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
							if(!base.isBetweenRange(checkDate))
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
			let decade = Math.floor(year/10);
			let decadeBegin = moment({year: decade * 10});
			let decadeEnd = moment({year: (decade + 1) * 10}).subtract(1, 'day');

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

				if(!base.isBetweenRange(yearBegin) && !base.isBetweenRange(yearEnd))
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
							if(!base.isBetweenRange(checkDate))
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

		base.handleActions = function ($target){
			let action = $target.data(base.constants.data.action);
			let current = null;

			if(action)
			{
				action = action.split('|');

				switch(action[0])
				{
				case 'decade':
					current = $target.data(base.constants.data.current);
					current = moment(current, base.options.formatDate);

					switch(action[1])
					{
					case 'current':
						base.showCalendar(current, 'years');
						break;

					case 'prev':
					case 'next':
						if(action[1] === 'prev')
						{
							current.subtract(10, 'year');
						}
						else
						{
							current.add(10, 'year');
						}
						current.startOf('year');
						base.showCalendar(current, 'years');
						break;

					default:
						base.showCalendar(current, 'years');
						break;
					}
					break;
				case 'year':
					current = $target.data(base.constants.data.current);
					current = moment(current, base.options.formatDate);

					switch(action[1])
					{
					case 'current':
						base.showCalendar(current, 'years');
						break;

					case 'prev':
					case 'next':
						if(action[1] === 'prev')
						{
							current.subtract(1, 'year');
						}
						else
						{
							current.add(1, 'year');
						}
						current.startOf('year');
						base.showCalendar(current, 'months');
						break;

					default:
						base.showCalendar(current, 'months');
						break;
					}

					if(!base.has('months'))
					{
						base.$el.val(current.format(base.getCompleteFormat()));
						base.showCalendar(current, 'year');
					}
					break;
				case 'month':
					current = $target.data(base.constants.data.current);
					current = moment(current, base.options.formatDate);
					switch(action[1])
					{
					case 'current':
						base.showCalendar(current, 'months');
						break;

					case 'prev':
					case 'next':
						if(action[1] === 'prev')
						{
							current.subtract(1, 'month');
						}
						else
						{
							current.add(1, 'month');
						}
						current.startOf('month');
						base.showCalendar(current, 'days');
						break;

					default:
						base.showCalendar(current, 'days');
						break;
					}

					if(!base.has('days'))
					{
						base.$el.val(current.format(base.getCompleteFormat()));
						base.showCalendar(current, 'months');
					}
					break;
				case 'date':
					current = $target.data(base.constants.data.current);
					if(base.has('time'))
					{
						current += " " + base.getPlaceholder()
							.find('.datetimepicker-time')
							.val();
					}
					current = moment(current, base.getCompleteFormat());
					base.$el.val(current.format(base.getCompleteFormat()));

					base.showCalendar(current, "days");
				}
			}
		};

		base.init = function (){
			let events = options.events;
			base.options = $.extend({}, $.DateTimePicker.defaultOptions, options);
			base.events = $.extend({}, $.DateTimePicker.defaultEvents, events);

			base.$el.on(
				"focus", function (){
					base.events.show.call(base);
				}
			);

			base.$el.on(
				"blur", function (evt){
					if (!base.options.debug)
					{
						blurTimeout = setTimeout(function(){
							base.events.hide.call(base);
						}, 100);
					}
				}
			);

			$(document)
				.on(
					'click',
					function (evt){
						let $orig = $(evt.target);
						let $target = isTargetInBase($orig);

						if($target)
						{
							evt.preventDefault();

							if (blurTimeout)
							{
								clearTimeout(blurTimeout);
							}

							if(!base.isDisabled($target))
							{
								base.handleActions($target);
							}
						}
						else
						{
							if ($orig.get(0) !== base.$el.get(0))
							{
								base.$el.blur();
							}
						}
					}
				);

			if (!base.$el.attr('id'))
			{
				base.$el.uniqueId();
			}

			if (base.options.inline)
			{
				base.getPlaceholder();
				base.showCalendar();
			}
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
		'years'
	];

	/*
	$.DateTimePicker.calendars = {
		gregorian: {
			daysInMonth: function (year, month){
				$.DateTimePicker.setLocale(this);
				return moment([year, month])
					.daysInMonth();
			},
			isLeapYear: function (year){
				$.DateTimePicker.setLocale(this);
				moment([year])
					.isLeapYear();
			}
		}
	};
	*/

	$.DateTimePicker.defaultOptions = {
		buttons: null,
		//calendar: $.DateTimePicker.calendars.gregorian,
		debug: false,
		formatDate: 'DD/MM/Y',
		formatTime: 'H:mm:ss',
		inline: false,
		locale: 'default',
		max: null,
		min: null,
		position: null,
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
			'<div class="datetimepicker-view datetimepicker-buttons"></div>' +
			'</div>' +
			'</div>',
		view: 'days'
	};

	$.DateTimePicker.defaultEvents = {
		show: function (){
			this.showCalendar();
		},
		hide: function (){
			if (!this.options.inline)
			{
				this.getPlaceholder()
					.hide();
			}
		}
	};

	$.fn.DateTimePicker = function (options){
		return this.each(function (){
			(new $.DateTimePicker(this, options));

			// HAVE YOUR PLUGIN DO STUFF HERE

			// END DOING STUFF

		});
	};

})(jQuery);