'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function dataCallback(data) {
    if (!data) {
        return {};
    }
    if (typeof data === 'function') {
        return data();
    }
    else if (typeof data === 'object') {
        var newData = {};
        for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
            var key = _a[_i];
            if (typeof data[key] === 'function') {
                newData[key] = data[key]();
            }
            else {
                newData[key] = data[key];
            }
        }
        return newData;
    }
    else {
        return data;
    }
}

var BeaconSender = /** @class */ (function () {
    function BeaconSender(url) {
        this.url = url;
        window.addEventListener('visibilitychange', function logData() {
        });
    }
    BeaconSender.prototype.send = function (data) {
        // const content = new Blob([JSON.stringify(data)], {
        // 	type: 'application/x-www-form-urlencoded',
        // })
        navigator.sendBeacon(this.url, JSON.stringify(data));
    };
    return BeaconSender;
}());

var XHRSender = /** @class */ (function () {
    function XHRSender(url) {
        var _this_1 = this;
        this._cache = [];
        this.send = function (data) {
            var _data = JSON.stringify(data);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', _this_1.url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(_data));
            var _this = _this_1;
            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    if (this.status >= 400) {
                        // 上报失败，写入缓存
                        _this._cache.push(_data);
                    }
                    else {
                        // 上报成功
                        _this._cache.push(_data);
                        while (_this._cache.length > 0) {
                            this.send(_this._cache.shift());
                        }
                    }
                }
            });
        };
        this.url = url;
    }
    return XHRSender;
}());

var currentSender;
// sender的配置
var currentOption;
function createSender(option) {
    currentOption = option;
    if (navigator.sendBeacon) {
        currentSender = new BeaconSender(currentOption.url);
    }
    else {
        currentSender = new XHRSender(currentOption.url);
    }
    return currentSender;
}
function report(data) {
    var newData = Object.assign({
        userAgent: navigator.userAgent,
        language: navigator.language,
        source: location.href,
    }, data);
    // 添加每次请求都携带的信息
    currentSender.send(Object.assign(newData, dataCallback(currentOption.data)));
}

var Plugin = /** @class */ (function () {
    function Plugin() {
    }
    Plugin.prototype.install = function (starter) {
        this.starter = starter;
        starter.plugins.push(this);
    };
    Plugin.prototype.uninstall = function () {
        this.starter.plugins = this.starter.plugins.filter(function (item) {
        });
    };
    return Plugin;
}());

function createCanAbortListener(event, callback, option) {
    var listenerOption = {};
    if (typeof option === 'boolean') {
        listenerOption.capture = option;
    }
    else {
        listenerOption = option || {};
    }
    var controller = new AbortController();
    if (Array.isArray(event)) {
        event.forEach(function (item) {
            window.addEventListener(item, function (e) {
                callback(e);
            }, Object.assign({
                signal: controller.signal,
            }, option));
        });
    }
    else {
        window.addEventListener(event, function (e) {
            callback(e);
        }, Object.assign({
            signal: controller.signal,
        }, option));
    }
    return controller.abort;
}

var makeListener = function () {
    var lastEvent;
    createCanAbortListener(['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'], function (e) {
        lastEvent = e;
    }, {
        capture: true,
        passive: true, //不阻止默认事件
    });
    return function () { return lastEvent; };
};
var getLastEvent = makeListener();

var SourceErrorPlugin = /** @class */ (function (_super) {
    __extends(SourceErrorPlugin, _super);
    function SourceErrorPlugin(opt) {
        var _this_1 = _super.call(this) || this;
        _this_1.data = opt.data;
        return _this_1;
    }
    SourceErrorPlugin.prototype.install = function (starter) {
        var _this = this;
        window.addEventListener('error', function (e) {
            var lastEvent = getLastEvent();
            var target = e.target;
            if (target && (target.src || target.href)) {
                var reportData = Object.assign(dataCallback(_this.data), {
                    type: 'sourceError',
                    eventType: lastEvent.type,
                    src: target.src || target.href,
                });
                report(reportData);
            }
        }, true);
        _super.prototype.install.call(this, starter);
    };
    SourceErrorPlugin.prototype.uninstall = function () {
        this.abort();
        _super.prototype.uninstall.call(this);
    };
    return SourceErrorPlugin;
}(Plugin));

var JSErrorPlugin = /** @class */ (function (_super) {
    __extends(JSErrorPlugin, _super);
    function JSErrorPlugin(opt) {
        var _this = _super.call(this) || this;
        _this.data = opt.data;
        return _this;
    }
    JSErrorPlugin.prototype.install = function (starter) {
        // 监听error错误
        this.abort = createCanAbortListener('error', function (e) {
            var target = e.target;
            if (target && !target.src && !target.href) {
                // 上报jserror
                var reportData = Object.assign(dataCallback(this.data), {
                    type: 'jsError',
                    message: e.error.message,
                    source: e.filename,
                    lineno: e.lineno,
                    colno: e.colno,
                    stack: e.error.stack,
                });
                report(reportData);
            }
        }, true);
        // 监听promise错误
        createCanAbortListener('unhandledrejection', function (e) {
            // 上报数据
            report({
                message: e.reason.message,
                stack: e.reason.stack,
                timeStamp: e.timeStamp,
                type: e.type,
            });
        }, true);
        _super.prototype.install.call(this, starter);
    };
    JSErrorPlugin.prototype.uninstall = function () {
        this.abort();
        _super.prototype.uninstall.call(this);
    };
    return JSErrorPlugin;
}(Plugin));

var HttpErrorPlugin = /** @class */ (function (_super) {
    __extends(HttpErrorPlugin, _super);
    function HttpErrorPlugin(opt) {
        var _this_1 = _super.call(this) || this;
        _this_1.data = opt.data;
        return _this_1;
    }
    HttpErrorPlugin.prototype.install = function (starter) {
        var _this_1 = this;
        // 重写XHR和fetch
        var XMLHttpRequest = window.XMLHttpRequest;
        this.originOpen = this.originOpen || XMLHttpRequest.prototype.open;
        this.originSend = this.originSend || XMLHttpRequest.prototype.send;
        var _this = this;
        XMLHttpRequest.prototype.open = function (method, url) {
            this.xhrData = {
                method: method,
                url: url,
                sTime: new Date(),
            };
            _this.originOpen.call(this, [method, url, true]);
        };
        XMLHttpRequest.prototype.send = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.addEventListener('loadend', function () {
                // 过滤上报请求
                if (currentOption.url !== this.xhrData.url) {
                    // 捕获错误，并上报
                    if (this.status > 400) {
                        var log = _this.logCallback;
                        if (typeof _this.logCallback === 'function') {
                            log = _this.logCallback();
                        }
                        // 上报内容
                        var logData = {};
                        for (var _i = 0, _a = Object.keys(log); _i < _a.length; _i++) {
                            var key = _a[_i];
                            if (typeof log[key] === 'function') {
                                logData[key] === log[key]();
                            }
                        }
                        var reportData = Object.assign(dataCallback(_this.data), Object.assign(this.xhrData, logData));
                        report(reportData);
                    }
                }
            });
            return _this.originSend.apply(this, args);
        };
        // 重写fetch
        this.originFetch = this.originFetch || window.fetch;
        window.fetch = function (url, config) {
            return _this_1.originFetch.apply(window, [url, config]).then(function (res) {
                // 根据返回值上报
                return res;
            }, function (err) {
                var reportData = Object.assign(dataCallback(_this_1.data), {
                    url: url,
                    sTime: new Date(),
                    type: err.type,
                    message: err.reason,
                    stack: err.reason,
                    timeStamp: err.timeStamp,
                });
                report(reportData);
                throw err;
            });
        };
        _super.prototype.install.call(this, starter);
    };
    HttpErrorPlugin.prototype.uninstall = function () {
        // 还原
        window.XMLHttpRequest.prototype.open = this.originOpen;
        window.XMLHttpRequest.prototype.send = this.originSend;
        window.fetch = this.originFetch;
        _super.prototype.uninstall.call(this);
    };
    return HttpErrorPlugin;
}(Plugin));

// 待完善。。。
var ImageSender = /** @class */ (function () {
    function ImageSender(endpoint) {
        this.endpoint = endpoint;
    }
    ImageSender.prototype.send = function (data) {
        var img = new Image(1, 1);
        img.onerror = function (event) {
            console.log(event);
        };
        img.src = this.endpoint;
    };
    return ImageSender;
}());

function createHistoryEvent(type) {
    var origin = history[type];
    return function () {
        var res = origin.apply(this, arguments);
        var e = new Event(type);
        window.dispatchEvent(e);
        return res;
    };
}

var PvPlugin = /** @class */ (function (_super) {
    __extends(PvPlugin, _super);
    function PvPlugin(opt) {
        var _this = _super.call(this) || this;
        _this.init();
        _this.data = opt.data;
        return _this;
    }
    // 监听history
    PvPlugin.prototype.captureEventList = function (list) {
        var _this = this;
        list.forEach(function (item) {
            window.addEventListener(item, function (e) {
                _this.reportPv();
            }, {
                signal: _this.controller.signal,
            });
        });
    };
    // 重写history事件
    PvPlugin.prototype.init = function () {
        window.history['pushState'] = createHistoryEvent('pushState');
        window.history['replaceState'] = createHistoryEvent('replaceState');
    };
    PvPlugin.prototype.install = function (starter) {
        this.controller = new AbortController();
        this.captureEventList(['pushState', 'replaceState', 'popstate']);
        _super.prototype.install.call(this, starter);
    };
    PvPlugin.prototype.uninstall = function () {
        this.controller.abort();
        _super.prototype.uninstall.call(this);
    };
    PvPlugin.prototype.reportPv = function () {
        var Today = String(new Date().getDate());
        var lastDay = localStorage.getItem('pvtime');
        // 同一天只上报一次
        if (Today !== lastDay) {
            var reportData = Object.assign(dataCallback(this.data), {});
            // 内容
            report(reportData);
            localStorage.setItem('pvtime', Today);
        }
    };
    return PvPlugin;
}(Plugin));

function getSlector(element) {
    var selector = '';
    // element.id
    // element.className
    // element.tagName
    // 待完成。。。
    console.log('这里没写完', element);
    return selector;
}

function throttle(func, wait) {
    var timer = null;
    return function () {
        if (timer)
            return;
        var args = arguments;
        timer = setTimeout(function () {
            func.apply(this, args);
            timer = null;
        }, wait);
    };
}

var BehaviorPlugin = /** @class */ (function (_super) {
    __extends(BehaviorPlugin, _super);
    function BehaviorPlugin(opt) {
        if (opt === void 0) { opt = {
            limit: 20,
        }; }
        var _this = _super.call(this) || this;
        _this.userAction = [];
        _this.currentAction = {};
        _this.limit = opt.limit;
        _this.data = opt.data;
        return _this;
    }
    BehaviorPlugin.prototype.install = function (starter) {
        var _this = this;
        this.lasttime = performance.now();
        var collectCallback = this.collectAction();
        // 绑定监听==>正常执行
        createCanAbortListener(['click', 'touchstart', 'mousedown', 'keydown'], collectCallback);
        // 关闭页面
        window.addEventListener('pagehide', function () {
            if (_this.userAction.length > 0) {
                _this.reportUserAction();
            }
        });
        // 出错中断
        window.addEventListener('error', function (e) {
            _this.currentAction.hasError = true;
            _this.currentAction.errorstack = e.error.stack;
            _this.userAction.push(_this.currentAction);
            if (_this.userAction.length > 0) {
                _this.reportUserAction();
            }
            _this.currentAction.hasError = false;
            delete _this.currentAction.errorstack;
        });
        _super.prototype.install.call(this, starter);
    };
    BehaviorPlugin.prototype.reportUserAction = function () {
        var reportData = Object.assign(dataCallback(this.data), {
            action: this.userAction,
            type: 'behavior',
        });
        report(reportData);
        this.userAction = [];
    };
    BehaviorPlugin.prototype.collectAction = function () {
        var _this = this;
        return throttle(function (e) {
            var newtime = performance.now();
            if (e instanceof KeyboardEvent) {
                _this.currentAction.key = e.key;
            }
            _this.currentAction.slector = getSlector(e.target);
            _this.currentAction.type = e.type;
            _this.currentAction.time = newtime;
            _this.currentAction.gaptime = newtime - _this.lasttime;
            _this.currentAction.source = location.href;
            // 收集行为
            _this.userAction.push(_this.currentAction);
            console.log('shoujidaole');
            if (_this.userAction.length > _this.limit) {
                _this.reportUserAction();
            }
            _this.lasttime = newtime;
        }, 500);
    };
    return BehaviorPlugin;
}(Plugin));

var Starter = /** @class */ (function () {
    function Starter(plugins, opt) {
        var _this = this;
        this.plugins = [];
        if (Starter.instance) {
            return Starter.instance;
        }
        this.sender = createSender(opt);
        plugins.forEach(function (item) {
            var p = new item();
            p.install(_this);
        });
        Starter.instance = this;
        console.log('初始化');
    }
    //注册监听插件
    Starter.prototype.regist = function (plugin) {
        if (this.plugins.includes(plugin)) {
            return console.log('请勿重复注册');
        }
        plugin.install(this);
        return this;
    };
    Starter.prototype.uninstallPlugin = function (plugins) {
        var _this = this;
        plugins.forEach(function (plugin) {
            _this.plugins.forEach(function (item) {
                if (item instanceof plugin) {
                    item.uninstall();
                }
            });
        });
    };
    // 销毁监听
    Starter.prototype.destroy = function () {
        this.plugins.forEach(function (item) {
            item.uninstall();
        });
        this.plugins = [];
    };
    return Starter;
}());

var PerformancePlugin = /** @class */ (function (_super) {
    __extends(PerformancePlugin, _super);
    function PerformancePlugin(opt) {
        var _this = _super.call(this) || this;
        _this.performanceData = {
            FP: '',
            FCP: '',
        };
        _this.data = opt.data;
        _this.startTime = opt.startTime || 1000;
        return _this;
    }
    PerformancePlugin.prototype.install = function (starter) {
        var _this = this;
        var observer = new PerformanceObserver(function (list) {
            list.getEntries().forEach(function (item) {
                if (item.entryType === 'navigation') {
                    _this.navigationPerformance = item;
                }
                if (item.name === 'first-paint') {
                    _this.firstPerformance = item;
                }
                if (item.name === 'first-contentful-paint') {
                    _this.firstContentfulPerformance = item;
                }
            });
        });
        observer.observe({ type: 'navigation', buffered: true });
        observer.observe({ type: 'paint', buffered: true });
        setTimeout(function () {
            var np = _this.navigationPerformance;
            var fp = _this.navigationPerformance;
            var fcp = _this.firstContentfulPerformance;
            _this.performanceData.FP = fp.startTime;
            _this.performanceData.FCP = fcp.startTime;
            console.log(_this.performanceData);
            observer.disconnect();
            var reportData = Object.assign(dataCallback(_this.data), {
                redirectTime: np.redirectStart - np.redirectEnd,
                redirectCount: np.redirectCount,
                DNS: np.domainLookupStart - np.domainLookupEnd,
                TCP: np.connectStart - np.connectEnd,
            });
            report(reportData);
        }, this.startTime);
        _super.prototype.install.call(this, starter);
    };
    return PerformancePlugin;
}(Plugin));

var FPSPlugin = /** @class */ (function (_super) {
    __extends(FPSPlugin, _super);
    function FPSPlugin(opt) {
        var _this = _super.call(this) || this;
        _this.limit = opt.limit || 20;
        _this.data = opt.data;
        return _this;
    }
    FPSPlugin.prototype.install = function (starter) {
        this.init();
        _super.prototype.install.call(this, starter);
    };
    FPSPlugin.prototype.init = function () {
        var _this = this;
        var lasttime = performance.now();
        var frame = 0;
        // // 让刚打开页面时重新计算(待完善，兼容需处理)
        window.addEventListener('pagehide', function () {
            console.log('hide');
        });
        var handller = function () {
            if (!document.hidden) {
                frame++;
                var now = performance.now();
                if (now - lasttime > 1000) {
                    if (frame < _this.limit) {
                        var reportData = Object.assign(dataCallback(_this.data), {
                            FPS: frame,
                            time: performance.now(),
                            sTime: new Date().getTime(),
                            type: 'FPSError',
                        });
                        report(reportData);
                    }
                    frame = 0;
                    lasttime = now;
                }
            }
            window.requestAnimationFrame(handller);
        };
        window.requestAnimationFrame(handller);
    };
    return FPSPlugin;
}(Plugin));

var WhiteScreenPlugin = /** @class */ (function (_super) {
    __extends(WhiteScreenPlugin, _super);
    function WhiteScreenPlugin(opt) {
        var _this = _super.call(this) || this;
        _this.data = opt.data;
        _this.grain = opt.grain || 20;
        _this.offset = opt.offset || 5; //可接受的白点-偏差
        return _this;
    }
    WhiteScreenPlugin.prototype.install = function (starter) {
        var _this = this;
        var onload = function () {
            // 定义外层容器元素的集合
            var containerElements = ['html', 'body', '#app', '#root'];
            function getSelector(element) {
                if (element.id) {
                    return '#' + element.id;
                }
                else if (element.className) {
                    return ('.' +
                        element.className
                            .split(' ')
                            .filter(function (item) { return !!item; })
                            .join('.'));
                }
                else {
                    return element.nodeName.toLowerCase();
                }
            }
            function isEmpty(node) {
                if (!containerElements.includes(node)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            // 颗粒度
            var grain = _this.grain;
            // 空白点
            var emptyPoints = 0;
            for (var i = 0; i < grain; i++) {
                var xElement = document.elementsFromPoint((window.innerWidth * i) / grain, window.innerHeight / 2)[0];
                var yElement = document.elementsFromPoint(window.innerWidth / 2, (window.innerHeight * i) / grain)[0];
                var nodey = getSelector(yElement);
                var nodex = getSelector(xElement);
                isEmpty(nodex) && emptyPoints++;
                isEmpty(nodey) && emptyPoints++;
            }
            // 上报白屏
            if (emptyPoints <= grain * 2 - _this.offset) {
                var reportData = Object.assign(dataCallback(_this.data), {
                    innerWidth: window.innerWidth,
                    innerHeight: window.innerHeight,
                    source: location.href,
                    type: 'whitescreen',
                });
                report(reportData);
            }
        };
        window.addEventListener('load', onload);
        _super.prototype.install.call(this, starter);
    };
    return WhiteScreenPlugin;
}(Plugin));

var index = {
    Starter: Starter,
    PvPlugin: PvPlugin,
    BeaconSender: BeaconSender,
    ImageSender: ImageSender,
    XHRSender: XHRSender,
    HttpErrorPlugin: HttpErrorPlugin,
    JSErrorPlugin: JSErrorPlugin,
    SourceErrorPlugin: SourceErrorPlugin,
    PerformancePlugin: PerformancePlugin,
    FPSPlugin: FPSPlugin,
    WhiteScreenPlugin: WhiteScreenPlugin,
    BehaviorPlugin: BehaviorPlugin,
};

module.exports = index;
