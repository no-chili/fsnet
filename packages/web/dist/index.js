(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.persight = factory());
})(this, (function () { 'use strict';

	function createHistoryEvent(type) {
	    var origin = history[type];
	    return function () {
	        var res = origin.apply(this, arguments);
	        var e = new Event(type);
	        window.dispatchEvent(e);
	        return res;
	    };
	}

	var PvPlugin = /** @class */ (function () {
	    function PvPlugin() {
	        this.controller = new AbortController();
	        this.status = true;
	    }
	    PvPlugin.getinstance = function () {
	        if (PvPlugin.instance) {
	            return PvPlugin.instance;
	        }
	        PvPlugin.instance = new PvPlugin();
	        return PvPlugin.instance;
	    };
	    PvPlugin.prototype.captureEventList = function (list) {
	        var _this = this;
	        list.forEach(function (item) {
	            window.addEventListener(item, function (e) {
	                if (_this.status) {
	                    console.log(e);
	                    console.log(_this.controller);
	                }
	            }, {
	                signal: _this.controller.signal,
	            });
	        });
	    };
	    PvPlugin.prototype.init = function () {
	        if (!PvPlugin.hasrewrite) {
	            PvPlugin.hasrewrite = true;
	            window.history['pushState'] = createHistoryEvent('pushState');
	            window.history['replaceState'] = createHistoryEvent('replaceState');
	        }
	    };
	    PvPlugin.prototype.install = function (option) {
	        this.init();
	        this.captureEventList(['pushState', 'replaceState', 'popState']);
	        console.log('pv插件安装成功');
	    };
	    PvPlugin.prototype.uninstall = function () {
	        this.controller.abort();
	        console.log('插件卸载完成');
	    };
	    PvPlugin.prototype.run = function () {
	        this.status = true;
	    };
	    PvPlugin.prototype.stop = function () {
	        this.status = false;
	    };
	    PvPlugin.hasrewrite = false;
	    return PvPlugin;
	}());

	var ps = /*#__PURE__*/Object.freeze({
		__proto__: null,
		PvPlugin: PvPlugin
	});

	var Starter = /** @class */ (function () {
	    function Starter(opt) {
	        if (opt === void 0) { opt = {}; }
	        var _this = this;
	        this.plugins = [];
	        //是否启用
	        this.state = true;
	        if (opt.plugins && opt.plugins.length > 0) {
	            opt.plugins.forEach(function (item) {
	                var plugin = ps[item].getinstance();
	                _this.plugins.push(plugin);
	            });
	        }
	        console.log('初始化');
	    }
	    //注册监听插件
	    Starter.prototype.regist = function (plugin) {
	        var _this = this;
	        if (Array.isArray(plugin)) {
	            plugin.forEach(function (item) {
	                var plugin = ps[item].getinstance();
	                if (!_this.plugins.includes(plugin)) {
	                    plugin.install();
	                    _this.plugins.push(plugin);
	                }
	            });
	        }
	        else {
	            var p = ps[plugin].getinstance();
	            p.install();
	            this.plugins.push(p);
	        }
	    };
	    // 启动监听
	    Starter.prototype.start = function () {
	        this.state = true;
	    };
	    // 暂停监听
	    Starter.prototype.stop = function () {
	        this.state = false;
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

	var persight = {
	    Starter: Starter,
	    PvPlugin: PvPlugin,
	};

	return persight;

}));
