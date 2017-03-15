# js-components
个人写的一些常用前端组件集合
## 日历
```
//初始化参数
datePicker.init(target, options);
//显示
datePicker.show(target)
```
* 1、target
日历参数的存储以及显示位置的参考对象
* 2、options

> mark: '/',//日期分隔符（可选）

> minDate: '2016-05-11',//可选日期最小值（可选）

> maxDate: '2016-06-05',//可选日期最大值（可选）

> success: function(val) {}//成功回调

> cancel: function(oldVal) {}//取消选择回调
## 分页
```
pager.initPager(target, options);
```
* 1、target
包装分页控件的容器
* 2、options

> sync: false,//初次渲染是否同步

> currPage: pageNum,//当前页码

> totalPage: totalPage,//总页数

> hadInit: false,//是否已初始化分页

> goPage: function(currPage) {
    console.log('发送Ajax请求指定页数据：' + currPage);
},//切换分页回调

> prev: function(currPage) {
    console.log('当前页：' + currPage);
> },//上一页回调（可选）

> next: function(currPage) {
    console.log('当前页：' + currPage);
> }//下一页回调（可选）
