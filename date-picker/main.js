/**
 * Usage:
 *
 * 1、datePicker.init(target, options)
 * 控件初始化
 *
 *  ① target
 *     jquery元素选择字符串或dom元素或jq元素
 *
 *  ② options
 *     //日期分隔符（可选）
 *     mark: '/',
 *     //可选日期最小值（可选）
 *     minDate: '2016-05-11',
 *     //可选日期最大值（可选）
 *     maxDate: '2016-06-05',
 *     //成功回调
 *     success: function(val) {}
 *     //取消选择回调
 *     success: function(oldVal) {}
 *
 * 
 * 2、datePicker.show(target);
 * 控件调用显示
 * 
 *  ① target
 *     jquery元素选择字符串或dom元素或jq元素
 *     
 * Notice:添加多个日期选择控件时，每个目标元素都需要初始化
 * 
 */
!(function(self){
    'use strict';

    //日历容器
    $('body').append(
    '<div id="date_picker">'+
        '<h3><span class="year">2014</span>/<span class="month">08</span></h3>'+
        '<span class="prev">←</span>'+
        '<span class="next">→</span>'+
        '<ol>'+
            '<li>SUN</li>'+
            '<li>MON</li>'+
            '<li>TUE</li>'+
            '<li>WED</li>'+
            '<li>THU</li>'+
            '<li>FRI</li>'+
            '<li>SAT</li>'+
        '</ol>'+
        '<ul class="theCalendar"></ul>'+
    '</div>'
    );
    var $container = $('#date_picker');

    var dateOptions = {
        target: '',
        minDate: '',
        maxDate: '',
        historyDate: '',
        mark: '-',
        success: function() {},
        cancel: function() {}
    }

    //当年，当月，当月第一天(周几），当月最后一天，上月最后一天
    var curr_year, curr_month, first_day, last_date, prev_last_date;
    //本日，本月，本年
    var today_date, today_month, today_year;

    var date = new Date();
    today_date = date.getDate();
    today_month = date.getMonth();
    today_year = date.getFullYear();

    /**
     * 初始化日期
     * @param  {[object]}  selectedDate [历史时间对象]
     * @param  {Boolean} isFirst      [是否第一次初始化]
     */
    function initDates(selectedDate, isFirst) {

        if (selectedDate && isFirst) {
            date.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        }

        curr_year = date.getFullYear();
        curr_month = date.getMonth();

        //防止下月没有当前的日期，导致计算错误（例如今天31号，下月没有31号）
        date.setDate(1);
        first_day = date.getDay();

        date.setMonth(curr_month + 1);
        date.setDate(0);
        last_date = date.getDate();

        date.setDate(0);
        prev_last_date = date.getDate();

        date.setFullYear(curr_year, curr_month, 1);
        addDates(selectedDate);
    }
    /**
     * [addDates 填充日期数据]
     * @param {[Object]} selectedDate [历史时间对象]
     */
    function addDates(selectedDate) {

        var date_html = '',

            view_year,
            view_month,
            view_date,

            arr_mindate,
            arr_maxdate,
            str_curr;

        if (selectedDate) {
            view_year = selectedDate.getFullYear();
            view_month = selectedDate.getMonth();
            view_date = selectedDate.getDate();
        }
        //存在最小日期限制
        if (dateOptions.minDate) {
            arr_mindate = dateOptions.minDate.match(/\d+/g);
        }
        //存在最大日期限制
        if (dateOptions.maxDate) {
            arr_maxdate = dateOptions.maxDate.match(/\d+/g);
        }

        // console.log('上月日期')
        for (var i = 0; i < first_day; i++) {
            var item = prev_last_date + i - (first_day - 1);
            date_html += '<li class="excess prev_item">' + item + '</li>';
        }

        // console.log('今天：', today_year,today_month,today_date)
        // console.log('当天：', curr_year,curr_month)
        // console.log('历史日期：', view_year,view_month,view_date)


        // console.log('本月日期')
        for (var k = 1; k <= last_date; k++) {

            str_curr = parseInt(curr_year + '' + add0(curr_month + 1) + '' + add0(k));

            //当前日期早（晚）于可选的最小（大）日期
            if ((arr_mindate && str_curr < parseInt(arr_mindate.join(''))) || (arr_maxdate && str_curr > parseInt(arr_maxdate.join('')))) {

                date_html += '<li class="excess">' + k + '</li>';

                //上次选的日期那天
            } else if (selectedDate && k == view_date && curr_month == view_month && curr_year == view_year) {

                //上次选的是今天
                if (view_date == today_date) {

                    date_html += '<li class="enabled today active">' + k + '<i></i></li>';

                } else {

                    date_html += '<li class="enabled active">' + k + '</li>';

                }
                //是今天
            } else if (k == today_date && curr_month == today_month && curr_year == today_year) {

                date_html += '<li class="enabled today">' + k + '<i></i></li>';

                //本月普通可选择日期
            } else {

                date_html += '<li class="enabled">' + k + '</li>';

            }
        }
        // console.log('下月日期')
        for (var j = 1; j <= 42 - first_day - last_date; j++) {
            date_html += '<li class="excess next_item">' + j + '</li>';
        }
        $('.theCalendar').html(date_html);
        $container.find('.year').html(curr_year);
        var month_html = add0(curr_month + 1);
        $container.find('.month').html(month_html);

    }

    /**************************************** 事件绑定 ****************************************/
    //切换月份
    $(document).on('click', '#date_picker .prev', function() {
        changeMonths('prev');
    });
    $(document).on('click', '#date_picker .next', function() {
        changeMonths('next');
    });
    //选择日期
    $(document).on('click', '#date_picker .enabled', function(event) {

        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        var strSelectedDate = curr_year + dateOptions.mark + add0(curr_month + 1) + dateOptions.mark + add0(parseInt($(this).html()));
        $(dateOptions.target).data('history-date', strSelectedDate).removeClass('focus');

        $container.hide();
        typeof dateOptions.success === 'function' && dateOptions.success(strSelectedDate, dateOptions.target);

    });
    $(document).on('click', hideDatePicker)

    //改变月份
    function changeMonths(direction) {
        if (direction == 'next') {
            date.setMonth(curr_month + 1);
        } else if (direction == 'prev') {
            date.setMonth(curr_month - 1);
        }
        if (dateOptions.historyDate) {
            var arrDate = dateOptions.historyDate.split(dateOptions.mark),
                tempDate = new Date();
            tempDate.setFullYear(arrDate[0], parseInt(arrDate[1]) - 1, arrDate[2]);

            initDates(tempDate);
        } else {
            initDates();
        }
    }
    //单位数字补充0
    function add0(int) {
        if (isNaN(parseInt(int))) return '0';
        if (int < 10) {
            return '0' + int;
        } else {
            return '' + int;
        }
    }
    
    //点击空白区域隐藏日历
    function hideDatePicker(event) {
        var target = event.target;
        if(!$.contains($container[0], target)){
            $container.hide();
            typeof dateOptions.cancel === 'function' && dateOptions.cancel(dateOptions.historyDate);
        }
    }

    //初始化日历控件
    function initDatePicker(target, options) {
        //每个日期表单的初始化配置存储至自定义属性
        $(target).data('options', options);
        $(target).on('click', function() {
            return false;
        })
    }
    function showDatePicker(target) {
        var $target = $(target),
            historyDate = $target.data('history-date');
        dateOptions = $target.data('options');
        dateOptions.target = $target;
        if (!dateOptions.mark) dateOptions.mark = '-';

        //有选过的旧日期数据
        if (historyDate) {

            dateOptions.historyDate = historyDate;
            var arrDate = dateOptions.historyDate.split(dateOptions.mark),
                tempDate = new Date();
            tempDate.setFullYear(arrDate[0], parseInt(arrDate[1]) - 1, arrDate[2]);

            initDates(tempDate, true);

        } else {
            dateOptions.historyDate = '';
            date = new Date();
            initDates();
        }
        $container.css({
            left: $target.offset().left,
            top: $target.offset().top + $target.outerHeight() + 4
        }).show();

    }

    self.datePicker = {
        init: initDatePicker,
        show: showDatePicker
    }

})(window);