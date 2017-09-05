;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
})(function ($) {
    var $targets = null;
    $.fn.c_tabs = function (targets) {
        if (typeof targets === 'string') {
            $targets = $(targets);
        } else if (targets instanceof jQuery) {
            $targets = targets;
        }

        $targets.each(function (i) {// 为目标添加data-id
            $(this).data('id', i);
        });
        return this.each(function (i) {
            var $this = $(this);
            $this.data('id', i);// 添加data-id
            $this.on('click', function () {// 通过id找到对应目标
                var index = $(this).data('id');
                $(this).addClass('is-active').siblings().removeClass('is-active');
                $targets.each(function () {
                    if ($(this).data('id') === index) {
                        $(this).addClass('is-active').siblings().removeClass('is-active');
                        return false;
                    }
                });
            });
        });
    };
});