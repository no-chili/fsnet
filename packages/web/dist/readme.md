# 这是一个轻量化、可插拔、可配置的前端监控 sdk

## 安装

```js
npm i fishnets-web
```

## 快速入门

在项目的顶层

```js
new Starter([FPSPlugin], {
	url: 'url',
})
```

## 支持特性

错误捕获：代码报错、资源加载报错、接口请求报错

性能数据：FP、FCP、LCP...

白屏检测：颗粒度配置、容错范围

用户行为：行为采集、PV

自定义数据：每一个插件均可添加自定义数据

卡顿检测:FPS

## 启动器 Starter

启动器负责管理插件，同时他也可以配置 Sender

```js
const starter = new Starter([FPSPlugin], {
	//这里填写上报的地址
	url: 'url',
	//这里可以配置一些统一的自定义数据
	data: {
		//可以是静态的数据
		someData: 'someData',
		otherData: () => {
			//也可以时一个函数，他会在进行上报请求时执行
			new Date()
		},
	},
})
	// 注册插件
	.regist()
	//卸载插件
	.uninstallPlugin()
```

## 插件 Plugin

目前提供的内置插件

```
[BehaviorPlugin, WhiteScreenPlugin, FPSPlugin, PerformancePlugin, PvPlugin, HttpErrorPlugin, SourceErrorPlugin, JSErrorPlugin]
```

每一种插件均可自由配置 option

example

```js
const fps = new FPSPlugin({
	limit: 60,
	//这里可以配置插件的个性化数据
	data: {
		//可以是静态的数据
		someData: 'someData',
		//也可以时一个函数，他会在进行上报请求时执行
		otherData: () => new Date(),
	},
})
starter.regist(fps)
```

## 上报器 Sender

Sender 用于上报处理 log 数据，在 Starter 和 Plugin 中配置的 data 最终会被 Sender 收集汇总，并进行数据上报，你只需要在 Starter 中填写好 url 后，他会被自动创建

## todo

网络测速：接口测速、资源测速

日志容灾：localstorage 备份

Memory 页面内存

日志去除重复
