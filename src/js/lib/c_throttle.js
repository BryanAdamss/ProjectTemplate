/**
 * Created by Administrator on 2017/7/28.
 */
;(function(root,moduleName,factory){
    if(typeof define==='function'&&define.amd){
        define([],function(){
            return (root[moduleName]=factory(root));
        });
    }else{
        root[moduleName]=factory(root);
    }
})(this,'c_throttle',function(win){
    return function(fn, interval) {
        var _self = fn, //保存需要被延迟的函数
            firstTime = true, // 是否首次调用
            intervalTime = interval || 500, // 间隔调用时间，默认500毫秒
            timer; // 定时器
        return function() {
            var args = arguments,
                _me = this;
            if (firstTime) { // 如果第一次，则无需延迟，直接调用
                _self.apply(_me, args);
                return firstTime = false;
            }
            if (timer) { // 如果定时器存在，说明前一次执行还没有完成
                return false;
            }
            timer = setTimeout(function() { // 延迟intervalTime后执行
                clearTimeout(timer);
                timer = null;
                _self.apply(_me, args);
            }, intervalTime);
        };
    };
});
