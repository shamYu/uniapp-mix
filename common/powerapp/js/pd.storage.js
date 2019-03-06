/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc app操作本地存储服务（依赖于pd.global模块）
* @date 20190116
* @author 李凤
*/
// （为防止app应用间缓存值冲突，缓存和取值时key默认加上APPID）
import {PdGlobal} from './pd.global.js';
export const PdStorage = {
	/** 同步
	 * @desc 存入键值对
	 * @param key: 键；value: 值【String/Object】;hasAPPID:是否加前缀APPID
	 * @return true[删除成功]，false[失败]
	 */
	set(key, value,hasAPPID = true){
		try {
			key = hasAPPID?(PdGlobal.APPID + key):key;
			uni.setStorageSync(key, value);
			return true;
		} catch (e) {
			console.log(`同步设置${key}失败`)
			return false;
			// error
		}
	},
	/** 同步
	 * @desc 根据key获取value
	 * @param key: 键；
	 * @return false[失败]
	 */
	get(key, defaultValue, hasAPPID = true) {
		if (defaultValue == undefined) {
			defaultValue = '';
		}
		try {
			key = hasAPPID?(PdGlobal.APPID + key):key;
			let value = uni.getStorageSync(key);
			if (value === '') {
				return defaultValue;
			}
			return value;
		} catch (e) {
			console.log(`同步获取${key}失败`)
			return defaultValue
			// error
		}
	},
	getObject(key) {
		let objStr = this.get(key);
		return objStr ? objStr : {};
	},
	/** 同步
	 * * @desc 移除指定项缓存
	 * @param key: 键；
	 * @return true[删除成功]，false[失败]
	 */
	remove(key,hasAPPID = true){
		try {
			key = hasAPPID?(PdGlobal.APPID + key):key;
			uni.removeStorageSync(key);
			return true;
		} catch (e) {
			console.log(`删除${key}失败`)
			return false
			// error
		}
	},
	/** 同步
	* @desc 清除应用所有的键值对存储数据
	*/
	clear(){
		uni.clearStorageSync();
	},
	/** 异步
	* @desc 存入键值对
	* @param key: 键；value: 值【String/Object】; 
	* @return promise对象
	*/
	setPromise(key, value,hasAPPID = true){
		return new Promise ((resolve, reject) => {
			key = hasAPPID?(PdGlobal.APPID + key):key;
			uni.setStorage({
				key:key,
				data: value,
				success () {
					resolve()
				},
				fail () {
					reject()
				}
			});
		});
	},
	/** 异步
	* @desc 根据key获取value
	* @param key: 键；
	* @return promise对象
	*/
	getPromise(key,hasAPPID = true){
		return new Promise ((resolve, reject) => {
			key = hasAPPID?(PdGlobal.APPID + key):key;
			uni.getStorage({
				key:key,
				success (res) {
					resolve(res.data)
				},
				fail () {
					reject()
				}
			});
		});
	},
	/** 同步
	* * @desc 移除指定项缓存
	* @param key: 键；
	* @return promise对象
	*/
	removePromise(key,hasAPPID = true){
		return new Promise ((resolve, reject) => {
			key = hasAPPID?(PdGlobal.APPID + key):key;
			uni.removeStorage({
				key:key,
				success () {
					resolve()
				},
				fail () {
					reject()
				}
			});
		});
	},
	/** 异步
	* @desc 清除应用所有的键值对存储数据
	*/
	clearPromise(){
		uni.clearStorage();
	},
	/**
	* @desc 根据key从缓存获取对象形式的数据
	* @param value: 值；key: 键【默认token】； isSync【是否同步】: true【同步】;false 【异步】
	 * @return promise对象或值
	 */
	setToken(value, key = 'token',isSync = true) {
		if (isSync) {
			return this.set(key, value);
		} else {
			return new Promise((resolve,reject) => {
				this.setPromise(key, value).then(()=>{
					resolve()
				}).catch(()=>{
					reject()
				})
			})
		}
	},
	/**
	* @param value: 值；key: 键【默认token】； isSync【是否同步】: true【同步】;false 【异步】
	* @return promise对象或值
	*/
	getToken(token, key = 'token',isSync = true) {
		if (isSync) {
			return this.get(key)
		} else {
			return new Promise((resolve,reject) => {
				this.getPromise(key).then((data)=>{
					resolve(JSON.parse(data))
				}).catch(()=>{
					reject()
				})
			});
		}
	},
	removeToken(key = 'token',isSync = true){
		if (isSync) {
			this.remove(key)
		} else {
			return new Promise((resolve,reject) => {
				this.removePromise(key).then(()=>{
					resolve()
				}).catch(()=>{
					reject()
				})
			});
		}
	}
};
