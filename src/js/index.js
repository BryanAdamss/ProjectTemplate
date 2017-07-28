/**
 * Created by Administrator on 2017/7/28.
 */
var configs = {// 默认配置
    baseUrl: 'js/lib',
    paths: {
        handlebars: 'handlebars-4.0.5.min',
        mock: 'mock-1.0.0.min',
        domReady: 'domReady',
        cgh_carousel: '../vendor/jquery-cgh_carousel',
        cgh_templateEngine: 'cgh_templateEngine',
        cgh_throttle: 'cgh_throttle',
        cgh_moveDirection:'cgh_moveDirection'
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

require(['domReady!', 'jquery', 'cgh_carousel', 'cgh_templateEngine', 'cgh_throttle','cgh_moveDirection'], function (doc, $, cgh_carousel, tplEngine, throttle,moveDirection) {// 使用domReady!后，回调会在dom准备好后才被调用，并返回一个document

    // 轮播调用
    $('.cgh_Carousel').cgh_carousel({
        height: 380,
        autoPlay: true,
        showPagination: true,
        startIndex: 0,
        autoTime: 3000
    });

    // 模板引擎
    var html = tplEngine(document.querySelector('#tpl_test').innerHTML, {
        text: '我是测试tplEngine的'
    });
    document.querySelector('#tplBox').innerHTML = html;

    // 测试节流函数
    var count = 0;
    var scrollHandler = function () {
        console.log('滚动次数:',++count);
    };
    // 节流函数
    // $(window).on('scroll', scrollHandler); // 未使用时，一次滚动scrollHandler触发10次以上
    $(window).on('scroll', throttle(scrollHandler, 50));// 只触发4次

    // 测试鼠标移入移出方向
    $('.testMoveDir').on('mouseenter mouseleave',function(e){
        console.log(e.type, '方向',moveDirection(this,e));
    });
});
