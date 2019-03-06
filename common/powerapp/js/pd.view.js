/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/*
* @desc 视图控制模块
* @date 20190116
* @author 李凤
*/
import {PdGlobal} from './pd.global';
export const PdView = {
	/**
	 * @desc 保留当前页面【可返回】，跳转到应用内的某个页面【uni.navigateBack可以返回到原页面。】
	 * @param url： 跳转地址【如：'new-page/new-page?data=Hello'】
	 * @return Promise
	 */
	navigateTo(url) {
		return new Promise ((resolve, reject) => {
			uni.navigateTo({
				url: url,
				success () {
					resolve()
				},
				fail () {
					reject()
				}
			});
		});
	},
	/**
	* @desc 不保留当前页面【不可返回】，跳转到应用内的某个页面【uni.navigateBack可以返回到原页面。】
	* @param url： 跳转地址【如：'new-page/new-page?data=Hello'】
	* @return Promise
	*/
	redirectTo(url) {
		return new Promise ((resolve, reject) => {
			uni.redirectTo({
				url: url,
				success () {
					resolve()
				},
				fail () {
					reject()
				}
			});
		});
	},
	/**
	* @desc 跳转到 tabBar【底部导航栏路由】 页面，并关闭其他所有非 tabBar 页面
	* @param url： 跳转地址【如：'new-page/new-page?data=Hello'】
	* @return Promise
	*/
	switchTab(url) {
		return new Promise ((resolve, reject) => {
			uni.switchTab({
				url: url,
				success () {
					resolve()
				},
				fail () {
					reject()
				}
			});
		});
	},
	/**
	* @desc 关闭所有页面，跳转到应用内的某个页面【uni.navigateBack可以返回到原页面。】
	* @param url： 跳转地址【如：'new-page/new-page?data=Hello'】
	* @return Promise
	*/
	reLaunch(url) {
		return new Promise ((resolve, reject) => {
			uni.reLaunch({
				url: url,
				success () {
					console.log('relauch成功')
					resolve()
				},
				fail () {
					console.log('relauch失败')
					reject()
				}
			});
		});
	},
	/**
	* @desc 关闭当前页面，返回上一页面或多级页面
	* @param delta： 1【上个页面】；2【上上个页面】
	*/
	back(delta=1) {
		uni.navigateBack({delta:delta});
	},
	/**
	 * @desc 获取视图
	 * @return route: 当前页面的路由，view[只有5+app才有]
	 */
	getCurrentView (index=1) {
		let pages = uni.getCurrentPages();
		const current = pages[pages.length - index];
		let currentWebview = null;
		// 【此方法仅 5+app 支持】
		// #ifdef APP-PLUS
		currentWebview = current.$getAppWebview();
		// #endif
		return {current: current,route: current.route, view:currentWebview}
	},
	/**
	 * @desc 设置页面顶部的标题title
	 * @return route: 当前页面的路由，view[只有5+app才有]
	 */
	setNavTitle (){
		uni.setNavigationBarTitle({
			title: title
		})
	},
	/**
	 * @desc 设置页面顶部的标题背景色
	 * @param hasSetBg【true:有背景色；false:无背景色】
	 * @return route: 当前页面的路由，view[只有5+app才有]
	 */
	setNavColor (hasSetBg=true){
		uni.setNavigationBarColor({
			frontColor: this.hasSetBg ? "#ffffff" : "#000000",
			backgroundColor: this.hasSetBg ? PdGlobal.BASECOLOR : "#fff"
		})
	},
	/* 返回前一个页面并传值 */
	/* passValToPrePage (json){
		//跳转页面并传值
		//跳转页面并返回上一页传值
		var pages = getCurrentPages();
		var currPage = pages[pages.length - 1]; //当前页面
		var prevPage = pages[pages.length - 2]; //上一个页面
		if(prevPage.setDataVal){
			prevPage.setDataVal(json) 
		}else{
			prevPage.$vm.setDataVal(json) 
		}
		uni.navigateBack();
	} */
	
	passValToPrePage (json,delta = 2){// 2 上上个页面
		//跳转页面并传值
		//跳转页面并返回上一页传值
		var pages = getCurrentPages();
		var currPage = pages[pages.length - 1]; //当前页面
		var prevPage = pages[pages.length - delta -1]; //上一个页面
		if(prevPage.setDataVal){
		  prevPage.setDataVal(json) 
		}else{
		  prevPage.$vm.setDataVal(json) 
		}
		this.back(delta);
  }
	
}
