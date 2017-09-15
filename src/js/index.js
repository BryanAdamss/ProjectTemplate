/**
 * Created by Administrator on 2017/7/28.
 */
var configs = {// 默认配置
    baseUrl: 'js/lib',
    paths: {
        handlebars: 'handlebars-4.0.5.min',
        mock: 'mock-1.0.0.min',
        domReady: 'domReady',
        c_carousel: '../vendor/jquery-c_carousel',
        c_tpl: 'c_tpl',
        c_throttle: 'c_throttle',
        c_moveDirection: 'c_moveDirection',
        layer: '../vendor/layer/layer',
        c_tabs: '../vendor/jquery-c_tabs',
        c_drag: '../vendor/jquery-c_drag'
    },
    shim: {}
};
var htmlClassName = document.getElementsByTagName('html')[0].className;
switch (htmlClassName) {// 根据浏览器不同而添加的配置
    case 'ie9':
        configs.paths.jquery = 'jquery-2.2.4.min';
        configs.paths.placeholder = '../vendor/jquery-placeholder-2.3.1.min';
        configs.shim.placeholder = {
            deps: ['jquery'],
        };
        console.log('ie9:', JSON.stringify(configs));
        break;
    case 'ie8':
        configs.paths.jquery = 'jquery-1.12.4.min';
        configs.paths.html5shiv = 'html5shiv-3.7.3.min';
        configs.paths.modernizr = 'modernizr-3.3.1.min';
        configs.paths.respond = 'respond-1.4.2.min';
        console.log('ie8:', JSON.stringify(configs));
        break;
    default:
        configs.paths.jquery = 'jquery-2.2.4.min';
        console.log('!ie:', configs);
}

require.config(configs);// 加载配置

require(['domReady!', 'jquery', 'c_carousel', 'c_tpl', 'c_throttle', 'c_moveDirection', 'layer', 'c_tabs','c_drag'], function (doc, $, c_carousel, tplEngine, throttle, moveDirection, layer, c_tabs,c_drag) {// 使用domReady!后，回调会在dom准备好后才被调用，并返回一个document

    // ajax全局loading动画
    $.ajaxSetup({
        beforeSend: function () {
            $('body').append('<div class="c-AjaxLoading"><img src="img/loading.gif" alt="loading"></div>');
        },
        success: function () {
            $('.c-AjaxLoading').remove();
        },
        error: function () {
            $('.c-AjaxLoading').remove();
        }
    });

    // 轮播调用
    $('.c-Carousel').c_carousel({
        height: 380,
        autoPlay: true,
        showPagination: true,
        startIndex: 0,
        autoTime: 3000
    });

    // 选项卡切换
    $('.c-Tabs .c-Tabs-item').c_tabs({
        targets:'.c-Targets .c-Targets-item',
        callback:function(){
            console.log(2);
        }
    });

    // 模板引擎
    var html = tplEngine(document.querySelector('#tpl_test').innerHTML, {
        text: '我是测试tplEngine的'
    });
    document.querySelector('#tplBox').innerHTML = html;

    // 测试节流函数
    var count = 0;
    var scrollHandler = function () {
        console.log('滚动次数:', ++count);
    };

    // 节流函数
    // $(window).on('scroll', scrollHandler); // 未使用时，一次滚动scrollHandler触发10次以上
    $(window).on('scroll', throttle(scrollHandler, 50));// 只触发4次

    // 测试鼠标移入移出方向
    $('.testMoveDir').on('mouseenter mouseleave', function (e) {
        console.log(e.type, '方向', moveDirection(this, e));
    });

    // layer，使用requjre使用layer时，需要配置layer文件夹路径
    layer.config({
        path: './js/vendor/layer/'
    });

    $('.js-layer').on('click', function () {
        layer.open({
            type: 1,
            title: '标题',
            skin: 'c-Layer',// 自定义样式
            move: false,// 不可移动
            area: ['440px', '300px'],// 长/宽
            closeBtn: 0,// 不需要关闭按钮
            shadeClose: true,// 点击mask关闭
            content: '<h1>测试layer</h1>'
        });
    });
    // 拖拽
    $('#box-hd').c_drag({
        target:'#box'
    });
});
