/**
 * Created by Administrator on 2017/3/21.
 * 移动端拼音索引
 * https://github.com/coolzjy/alphabet-sidenav
 */
(function(d, e) {
    var inited = false, // 是否初始化
        list, // 导航条
        indicator; // 指示器


    // 动态写入 CSS 代码
    var style = d.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML += 'nav.alphabetList{';
    style.innerHTML += 'position:fixed;right:0;background:rgba(255,255,255,0.6);border-radius:3px;-webkit-user-select:none;}';
    style.innerHTML += 'nav.alphabetList ul{';
    style.innerHTML += 'list-style:none;padding:0;margin:0;}';
    style.innerHTML += 'nav.alphabetList ul li{padding:0 10px;text-align:center;color:#04a5d6;font-size:12px;}';
    style.innerHTML += 'div.alphabetIndicator{';
    style.innerHTML += 'position:fixed;display:none;left:50%;top:50%;width:50px;height:50px;background:rgba(0,0,0,0.2);z-index:2;';
    style.innerHTML += 'margin:-25px  0 0 -25px;font-size:30px;font-weight:bold;line-height:50px;text-align:center;}';
    d.head.appendChild(style);

    /*
     * 初始化方法
     *
     * @param {Array|string} 要添加导航的锚点列表，或要匹配的属性名称
     * @param {Object} 配置选项
     *
     * 配置项：top {int|string}、bottom {int|string}、showIndicator {boolean}、useHash {boolean}
     */
    function init(pTarget, pOptions) {
        var i, // 循环变量
            anchorList, // 需要添加导航的页面元素列表
            listUl, // 导航列表
            listLi, // 导航列表项
            attrName, // 属性名
            top, bottom, // 配置项
            showIndicator = true,
            useHash = false; // 拥有默认值的配置项

        // 如果已经初始化过，提醒并返回
        if (inited) {
            console.warn('alphabetNav has already been inited!');
            return;
        }

        // 检查参数类型
        if (Object.prototype.toString.call(pTarget) !== '[object Array]' && typeof pTarget !== 'string') {
            throw new TypeError('First parameter of alphabetNav init function must be an Array or String');
        }
        if (typeof pOptions !== 'undefined' && typeof pOptions !== 'object') {
            throw new TypeError('Second parameter of alphabetNav init function must be an Object');
        }

        // 读取配置
        if (typeof pOptions !== 'undefined') {
            top = pOptions.top;
            bottom = pOptions.bottom;

            if (typeof pOptions.showIndicator !== 'undefined') {
                showIndicator = pOptions.showIndicator;
            }
            if (typeof pOptions.useHash !== 'undefined') {
                useHash = pOptions.useHash;
            }
        }

        // 新建导航条
        list = myCreateElement('nav', 'alphabetList');
        listUl = myCreateElement('ul');
        list.appendChild(listUl);
        d.body.appendChild(list);

        // 添加导航项目
        if (typeof pTarget === 'string') {
            useHash = false; // 该调用类型下不允许 URL Hash 跳转
            attrName = pTarget;

            // 根据传递的参数选择包含指定属性的元素
            anchorList = d.querySelectorAll('[' + attrName + ']');

            // 添加导航项
            for (i = 0; i < anchorList.length; i++) {
                listLi = myCreateElement('li', 'alphabet', anchorList[i].getAttribute(attrName));
                listUl.appendChild(listLi);
            }
        } else {
            // 添加导航项
            for (i = 0; i < pTarget.length; i++) {
                // 检测数组元素类型
                if (typeof pTarget[i] !== 'object') continue;
                listLi = myCreateElement('li', 'alphabet', pTarget[i].display);
                listLi.setAttribute('to', pTarget[i].id);
                listUl.appendChild(listLi);
            }
        }

        // 处理位置属性
        if (typeof top !== 'undefined') {
            if (typeof top === 'number') {
                list.style.top = top + 'px';
            }
            if (typeof top === 'string') {
                list.style.top = top;
            }
        }
        if (typeof bottom !== 'undefined') {
            if (typeof bottom === 'number') {
                list.style.bottom = bottom + 'px';
            }
            if (typeof bottom === 'string') {
                list.style.bottom = bottom;
            }
        }
        if (typeof top === 'undefined' && typeof bottom === 'undefined') {
            list.style.top = '50%';
            list.style.marginTop = '-' + list.clientHeight / 2 + 'px';
        }

        // 新建指示器
        indicator = myCreateElement('div', 'alphabetIndicator');
        d.body.appendChild(indicator);

        //绑定事件
        list.addEventListener('touchstart', function(e) {
            alphabetMove(e.changedTouches[0].clientY);
        });

        list.addEventListener('touchmove', function(e) {
            e.preventDefault();
            alphabetMove(e.changedTouches[0].clientY);
        });

        if (showIndicator) {
            list.addEventListener('touchend', function() {
                indicator.style.display = 'none';
            });
        }

        function alphabetMove(pPositionY) {
            var currentItem, targetItem;
            currentItem = d.elementFromPoint(d.body.clientWidth - 1, pPositionY);
            if (!currentItem || currentItem.className.indexOf('alphabet') < 0) return;

            // 使用 url hash 进行跳转
            if (useHash) {
                location.hash = currentItem.getAttribute('to');
            }
            // 不使用 url hash 进行跳转
            else {
                // 属性调用模式
                if (typeof attrName !== 'undefined') {
                    targetItem = d.querySelector('[' + attrName + '=\'' +
                        currentItem.innerText + '\']');
                } else {
                    targetItem = d.getElementById(currentItem.getAttribute('to'));
                }
                if (targetItem) {
                    window.scrollBy(0, targetItem.getBoundingClientRect().top);
                }
            }

            // 显示指示器
            if (showIndicator) {
                indicator.innerText = currentItem.innerText;
                indicator.style.display = 'block';
            }

        }

        // 初始化完毕
        inited = true;
    }

    /*
     * 卸载方法
     */
    function destroy() {
        d.body.removeChild(list);
        d.body.removeChild(indicator);
        inited = false;
    }


    /*
     * 创建元素
     *
     * @param {string} 标签名
     * @param {string} CSS 类名
     * @param {string} Inner Text
     *
     * @return {HTMLDOMElement} 创建的 HTML 元素
     */
    function myCreateElement(pTagName, pClassName, pInnerText) {
        var newElement = d.createElement(pTagName);
        if (pClassName) {
            newElement.className = pClassName;
        }
        if (pInnerText) {
            newElement.innerText = pInnerText;
        }
        return newElement;
    }

    // AMD/CMD 加载器
    if (typeof define === 'function') {
        define(function() {
            return { init: init, destroy: destroy };
        });
    }
    // CommonJS 加载器
    else if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
        module.exports = { init: init, destroy: destroy };
    }
    // 无模块化加载器，挂载到 window
    else {
        window.alphabetNav = { init: init, destroy: destroy };
    }
})(document);
