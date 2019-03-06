/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc app常用常量[依赖pdStorage模块]
* @date 20190116
* @author 李凤
*/
import {PdUpdate} from './pd.update'
export const PdGlobal = {
	version:'1.0',//版本号
	//配置app应用ID(为防止缓存冲突，各个APP必须修改此常量)
	APPID: 'jgjc',
	//app名称，主要用于[我的]>[关于]中app名称的显示
	APPNAME: '博安达WebApp标准开发平台',
	/*app集成配置：标记当前app是否作为子App。 当为true时，主app调用子app时会自动登录子app（前提是用户名和密码与主app的保持一致）
	 *另外，当前子app会在首页增加返回按钮,同时自动屏掉安全退出、修改密码、版本更新、服务白名单设置等功能。
	 *注意：如果作为子App,子APP所有资源的“根目录名称”要与APPID一致，且要与pages同级。 */
	ISSUB: false,
	//后台服务环境的平台版本：4.0 或 3.0 （因平台的差异，有此功能需要区分平台进行特殊处理可通过此变量进行分别设置）
	PLATFORMVER: '4.0',
	//视图跳转时样式（右进方式)
	VIEWINSTYLE: 'slide-in-right',
	// 后端服务请求【数据库地址】
	// #ifdef H5
	SERVICEURL: 'http://localhost:8012/pure4',
	// #endif
	// #ifndef H5
	SERVICEURL: 'http://202.104.140.36:8009/pure4',
	// #endif
	//后端端服务请求path
	SERVICEPATH: '/invoke',
	//后端登录请求path
	LOGINPATH: '/mobileLogin',
	//请求过期时间,15秒
	TIMEOUT: '15000',
	//附件下载保存的路径,注意不要使用_downloads/temp/作为路径，会找不到文件。且要以_downloads为根目录
	DOWNLOADPATH: '_downloads/_temp/',
	//上传服务(支持在线编辑上传)  web.xml配置的uploadServlet
	UPLOADSERVICE: '/webapp/uploadFile',
	//登录后会缓存相关基础数据， 但有些数据不是必须的，如行业类型和行政区划，通过以下两个常量控制是否要缓存，false不缓存
	ISCACHEHYLX: true,
	ISCACHEXZQH: true, // 行政区划
	//初始化基础颜色(青绿色：#17bdcc，蓝色：#457aff)，只对状态栏及原生导航头颜色起作用
	BASECOLOR: '#17bdcc',
	// 固定key
	serviceurlKey: 'serviceurl',
	simKey:'sim',
	imeiKey: 'imei',
	osKey: 'os'
};