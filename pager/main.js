/**
 * [initPager 初始化分页插件]
 *
 * Requirements:
 * jQuery
 * 
 * 1、css: "/common/components/pager/main.less"
 * 
 * 2、js:
 * var pager = require('/common/components/pager/pager');
 * pager.initPager(selector, {
 *     //初次渲染是否同步
 *     sync: false,
 *     //当前页码
 *     currPage: pageNum,
 *     //总页数
 *     totalPage: totalPage,
 *     //是否已初始化分页
 *     hadInit: false,
 *     //切换分页回调
 *     goPage: function(currPage) {
 *         console.log('发送Ajax请求指定页数据：' + currPage);
 *     },
 *     //上一页回调（可选）
 *     prev: function(currPage) {
 *         console.log('当前页：' + currPage);
 *     },
 *     //下一页回调（可选）
 *     next: function(currPage) {
 *         console.log('当前页：' + currPage);
 *     }
 * });
 *
 * selector: 包装分页控件的容器
 * 
 */
!(function(self){
    'use strict';

    var initPager = function(selector, options) {

        if (typeof options != 'object') return;
        var page = options.currPage,
            totalPage = options.totalPage,
            prev = options.prev,
            next = options.next,
            goPage = options.goPage,
            sync = options.sync;
        if(!options.hadInit){
            $(selector).append('<div id="pager"></div>');
        }
        if (totalPage <= 1) {
            if(totalPage == 1){
                if(goPage && !sync){
                    goPage(page);
                }
            }
            $('#pager').hide();
            return false;
        }

        // console.log(page, totalPage)
        // 最多显示的页码个数，只支持大于3的奇数
        var maxPage = 9,
            //分页格式的两个临界值
            critical1 = (maxPage + 1) / 2,
            critical2 = totalPage - critical1 + 1,
            pagerHtml = '';
        // console.log('临界值：',critical1,critical2)
        pagerHtml += '<span class="page_prev page_control">上一页</span>';
        pagerHtml += '<div class="pager_wrapper">';
        //部分隐藏显示分页
        if (totalPage > maxPage) {
            //尾隐显示，例：1，2，3，…，7
            if (page <= critical1) {
                // console.log(critical1)
                for (var i = 1; i <= maxPage - 2; i++) {
                    pagerHtml += '<span class="pages">' + i + '</span>';
                }
                pagerHtml += '<span class="pages">…</span>';
                pagerHtml += '<span class="pages">' + totalPage + '</span>';
            //首隐显示，例：1，…，5，6，7
            } else if (page >= critical2) {
                pagerHtml += '<span class="pages">1</span>';
                pagerHtml += '<span class="pages">…</span>';
                for (var i = 1; i <= maxPage - 2; i++) {
                    pagerHtml += '<span class="pages">' + (totalPage - (maxPage - 2) + i) + '</span>';
                }
            //两侧隐显示，例：1，…，4，…，7
            } else {
                pagerHtml += '<span class="pages">1</span>';
                pagerHtml += '<span class="pages">…</span>';
                for (var i = page - (critical1 - 3); i <= page + (critical1 - 3); i++) {
                    pagerHtml += '<span class="pages">' + i + '</span>';
                }
                pagerHtml += '<span class="pages">…</span>';
                pagerHtml += '<span class="pages">' + totalPage + '</span>';
            }
        //全部显示
        } else {
            for (var i = 1; i <= totalPage; i++) {
                pagerHtml += '<span class="pages">' + i + '</span>';
            }
        }
        pagerHtml += '</div>';
        pagerHtml += '<span class="page_next page_control">下一页</span>';
        $('#pager').html(pagerHtml);

        $('#pager .pages').each(function(index, el) {
            if ($(this).html() == page) {
                $(this).addClass('focus');
            }
        });

        $('.page_control').removeClass('disabled');
        if (page == 1) {
            $('.page_prev').addClass('disabled');
        }
        if (page == totalPage) {
            $('.page_next').addClass('disabled');
        }
        $('#pager').show();
        if(goPage && !sync){
            goPage(page);
        }

        if (!options.hadInit) {
            // console.log('绑定事件')
            $('#pager').off('click', '.page_prev');
            $('#pager').off('click', '.page_next');
            $('#pager').off('click', '.pages');
            $('#pager').on('click', '.page_prev', function(event) {
                if (page <= 1) {
                    return false;
                }
                page--;
                options.currPage = page;
                options.hadInit = true;
                options.sync = false;

                initPager(selector, options);

                prev && prev(page);
            });

            $('#pager').on('click', '.page_next', function(event) {
                if (page >= totalPage) {
                    return false;
                }
                page++;
                options.currPage = page;
                options.hadInit = true;
                options.sync = false;

                initPager(selector, options);

                next && next(page);
            });

            $('#pager').on('click', '.pages', function(event) {
                page = parseInt($(this).html());
                if (isNaN(page)) {
                    return false;
                }
                options.currPage = page;
                options.hadInit = true;
                options.sync = false;

                initPager(selector, options);

            });
        }
    }
    self.pager = {
        initPager: initPager
    }

})(window);