/**
 * Created by Administrator on 2017/7/28.
 */
var configs = {// 默认配置
    baseUrl: 'js/lib',
    paths: {
        handlebars: 'handlebars-4.0.5.min',
        mock: 'mock-1.0.0.min',
        domReady: 'domReady',
        c_carousel: '../widgets/jquery-c_imgSlider',
        c_tpl: 'c_tpl',
        c_throttle: 'c_throttle',
        c_moveDirection: 'c_moveDirection',
        layer: '../../vendors/layer/layer',
        c_tabs: '../widgets/jquery-c_tabs',
        c_drag: '../widgets/jquery-c_drag',
        c_pagination: '../widgets/c_pagination',
        c_jsonp: 'c_jsonp',
        raf: '../widgets/request-frame'
    },
    shim: {}
};

var htmlClassName = document.getElementsByTagName('html')[0].className;

switch (htmlClassName) {// 根据浏览器不同而添加的配置
    case 'ie9':
        configs.paths.jquery = 'jquery-2.2.4.min';
        configs.paths.placeholder = '../widgets/jquery-placeholder-2.3.1.min';
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

define(['domReady!', 'jquery', 'c_carousel', 'c_tpl', 'c_throttle', 'c_moveDirection', 'layer', 'c_tabs', 'c_drag', 'raf', 'c_pagination', 'c_jsonp'], function (doc, $, c_carousel, tplEngine, throttle, moveDirection, layer, c_tabs, c_drag, requestFrame, c_pagination, c_jsonp) {// 使用domReady!后，回调会在dom准备好后才被调用，并返回一个document

    // ajax全局loading动画
    $.ajaxSetup({
        beforeSend: function () {
            $('body').append('<div class="c-Loading"><img src="img/loading.gif" alt="loading"></div>');
        },
        success: function () {
            $('.c-Loading').remove();
        },
        error: function () {
            $('.c-Loading').remove();
        }
    });

    // 轮播调用
    $('.c-ImgSlider').c_carousel({
        height: 380,
        autoPlay: true,
        showPagination: true,
        startIndex: 0,
        autoTime: 3000
    });

    // 选项卡切换
    $('.c-Tabs .c-Tabs-item').c_tabs({
        targets: '.c-Targets .c-Targets-item',
        callback: function () {
            console.log('选项卡切换over');
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
    $('#testMoveDir').on('mouseenter mouseleave', function (e) {
        $(this).html(e.type + '方向' + moveDirection(this, e));
    });

    // layer，使用requjre使用layer时，需要配置layer文件夹路径
    layer.config({
        path: './vendors/layer/'
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
        target: '#box'
    });

    // 测试reques-animation-frame
    var raf = requestFrame('request'),
        caf = requestFrame('cancel');
    var rafId = null;
    var count = 0;

    function move() {
        count++;
        $('#js_raf').css({
            marginLeft: count + 'px'
        });
        if (count > 200) {
            count = 0;
        }
        rafId = raf(move);
    }

    $('#js_raf_btn').on('click.cgh', function (eve) {
        eve.stopPropagation();
        rafId = raf(move);
    });
    $('#js_raf_stop_btn').on('click.cgh', function (eve) {
        eve.stopPropagation();
        // cancelAnimationFrame必须在window下才能调用
        caf.call(window, rafId);
    });


    // 分页器
    var page = new c_pagination('js_page', {
        skin: 'mySkin',
        totalCount: 500,
        curPage: 1,
        pageShowCount: 5,
        pageSizeList: [5, 10, 15, 20, 25, 50],
        defaultPageSize: 10,
        showJump: true,
        showPageSizeSelector: true,
        showPN: true,
        showFL: true,
        callback: function (curPage, pageSize, ele) {
            console.log(this, curPage, pageSize, ele);
        }
    });
    setTimeout(function () {
        page.goLast();
    }, 1000);

    // jsonp
    c_jsonp({
        url: 'http://192.168.23.126:8080/hfgj/app/cgh.do',
        data: {
            id: 3,
            name: 'cgh'
        },
        success: function (resp) {
            console.log(resp);
        },
        error: function () {
            console.log('jsonp请求出错了');
        }
    });
});
