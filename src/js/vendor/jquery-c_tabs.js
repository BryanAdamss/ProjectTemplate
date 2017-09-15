;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
})(function ($) {
    var $targets = null;
    $.fn.c_tabs = function (options) {
        if (typeof options.targets === 'string') {
            $targets = $(options.targets);
        } else if (options.targets instanceof jQuery) {
            $targets = options.targets;
        }

        $targets.each(function (i) {// 为目标添加data-id
            $(this).data('id', i);
        });

        function toggleTargets($tars,idx) {
            if ($tars instanceof jQuery) {
                var dfr = $.Deferred();
                $tars.each(function () {
                    if ($(this).data('id') === idx) {
                        $(this).addClass('is-active').siblings().removeClass('is-active');
                        dfr.resolve();
                        return false;
                    }
                });
                return dfr.promise();
            }
        }

        return this.each(function (i) {
            var $this = $(this);
            $this.data('id', i);// 添加data-id
            $this.on('click', function () {// 通过id找到对应目标
                var index = $(this).data('id');
                $(this).addClass('is-active').siblings().removeClass('is-active');
                $.when(toggleTargets($targets,index)).done(function () {
                    options.callback.call(window);
                });
            });
        });
    };
});