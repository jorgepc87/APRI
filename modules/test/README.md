# Picker

> 公司项目开发中抽离的一个移动端组件, 代码量小， 可复用性高， 纯原生js实现， 无任何依赖，options配置灵活～

## 介绍

原生 Javascript 实现移动端 Picker 组件

预览地址：

[https://peng-yin.github.io/Picker/]( https://peng-yin.github.io/Picker/)

## 依赖

原生 JavaScript 实现，无依赖。

## 大小

整个组件的js只用到了300多行实现， 压缩后 5KB，gzip 压缩后更小。

## 兼容

滑动动画流畅, 在安卓,ios下未出现兼容问题

## 下载

```js
https://github.com/peng-yin/Picker.git
```

## 使用

```html
<script src="path/picker.js"></script>
```

或者

```js
import picker from 'path/picker.js'
```

## 示例

```js
var $picker = new Picker({
    el: '.date-box',
    autoHide: true,
    itemHeight: 36,
    data: '',
    onChange: res => {
        switch (res.index) {
            case 0:
                selectYear = res.value;
            break;
            case 1:
                selectMonth = res.value;
            break;
            case 2:
                selectDay = res.value;
            break;
        }
    },
    onChangeEnd: res => {
        let _day = [], maxDay = new Date(selectYear, selectMonth, 0).getDate();
        for (var i = 0; i <=maxDay; i++) {
            _day.push({
                title: i + ' 日',
                value: i
            });
        }
        if (res.index === 0 || res.index === 1) {
            $picker.setItem({
                index: 2,
                data: _day,
                default: selectDay < maxDay ? selectDay : maxDay
            })
        }
    }
})
```

## API

### 初始化

```js
var $picker = new Picker(options);
```

### options

**container**

必填，指定Picker容器的 selector

**autoHide**

选填， 自动隐藏

**data**

必填，滑动数据项

**default**

选填，初始化默认值

**evt**

选填， 事件类型

**_height**

选填， itemHeight高度

### 方法

**onInit**

初始化方法

**onChange**

滑动变化时的回调

**onChangeEnd**

滑动结束时的回调

### 事件绑定

调用实例picker 打开方法

```js
$picker.open();
```

点击确认的方法

```js
$picker.onConfirm = res =>  {}
```
## TodoList

1. 代码测试, 打包压缩

2. 上传npm， 支持npm

