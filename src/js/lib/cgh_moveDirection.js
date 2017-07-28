/**
 * Created by Administrator on 2017/7/28.
 */
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
})(function ($) {
        return function(tag, e) {
            var w = $(tag).width();
            var h = $(tag).height();
            var x = (e.pageX - tag.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1);
            var y = (e.pageY - tag.offsetTop - (h / 2)) * (h > w ? (w / h) : 1);
            var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
            return direction;
        };
    }
);
