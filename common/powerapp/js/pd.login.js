/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc 设备相关组件【网络状态，是否开发环境，系统信息，发短信，打电话、扫码，分享】
* 【依赖于pd.action模块、pd.storage模块、pd.global,pd.resource,pd.view,pd.cache,log】
* @date 20190116
* @author 李凤
*/
import {PdGlobal} from './pd.global';
import {PdStorage} from './pd.storage';
import {PdAction} from './pd.action';
import {PdResource} from './pd.resource';
import {PdView} from './pd.view';
import {PdCache} from './pd.cache';
import {PdDevice} from './pd.device';
import {Log} from './log';
import store from '../../../store/index.js';
export const PdLogin = {
	/**
	 * @desc 设置全局的用户名和密码
	 */
	setUser(options){
		PdStorage.set('userid',options.userid,false);
		PdStorage.set('pwd',options.pwd,false);
		PdStorage.set(PdGlobal.simKey,options.sim,false);
	},
	getUser(){
		return {
			userid:PdStorage.get('userid','',false),
			pwd:PdStorage.get('pwd','',false),
			sim:PdStorage.get(PdGlobal.simKey,'',false)
		}
	},
	/**
	* @desc： 开始自动登录【作为子系统或者第三方自动登录】
	* @return promise
	*/
	isAutoLogin () {
		return new Promise((resolve,reject) => {
			if (PdGlobal.ISSUB&&!store.state.hasLogin){// 作为子系统且没登录，则自动登录
				//更新当前APP的token信息
				let user = this.getUser()
				PdStorage.setToken(user);
				Log.log('子系统登录')
				resolve(user)
			}else{
				// 作为第三方应用自动登录
				PdDevice.getPlusArgs().then(data=>{
					Log.log('第三方应用登录')
					resolve(data)
				}).catch(()=>{
					reject()
				})
			}
		});
	},
	// 登录
	login(param,autoLogin=false){
		return new Promise((resolve,reject) => {
			PdResource.service({
				url: PdGlobal.LOGINPATH,
				data: {
					userid:param.userid,
					password:param.pwd
				}
			},{
				isWait:true,
				waitMsg: autoLogin ? "自动登录中..." : "正在登录..."
			}).then(data => {
				// 设置后端数据请求token
				let token = Object.assign({
					jwtToken: data.jwtToken,
					userid: param.userid,
					pwd:param.pwd,
					sim: PdStorage.get(PdGlobal.simKey,'',false)
				});
				store.commit('login', token);
				//设置全局的用户名和密码(用于其它集成app共享)
				this.setUser({
					userid:param.userid,
					pwd: param.pwd,
					sim: PdStorage.get(PdGlobal.simKey)
				});
				// 缓存userInfo的数据
				let userInfo = Object.assign({
					userid: param.userid,
					pwd:param.pwd},data.userInfo)
				PdStorage.set('userInfo',userInfo)
				//缓存基础数据
				PdCache.cacheBaseData().then(()=>{
					// /powerapp/pages/login/guide
					setTimeout(()=>{
						PdView.reLaunch('/powerapp/pages/tabBar/index/index').then((data) => {
							PdAction.toast('登录成功');
							resolve(data);
						})
					}, 800)
				});
						
			}).catch((data) => {
				Log.error('登录失败')
				if(data&&data.resData&&data.resData.data){
					data = data.resData.data;
				}
				//如果是由第三方应用打开进行的自动登录，登录失败情况下也手动关闭启动画面
				if(autoLogin){PdStorage.set("lauchFlag", "true")};
				// 验证白名单
				if (!data.xhr){
					if(data.check_status=='TRUE'){//需要验证白名单
						if(data.status_code == '1'){
							let paramString = PdStorage.objToString(param)
							PdAction.alert(data.error_msg).then(()=>{
								PdView.navigateTo("/powerapp/pages/login/bmdApply"+paramString);
							})
						}else{
							//如果手机号为空，则让用户重新手动输入手机号（用户清除了缓存的情况下导致手机号为空，可能造成白名单验证不通）
							if(this.getUser().sim==undefined||this.getUser().sim == ''){
								reject('sim')
							}else{
								let num = store.state.loginNum;
								num++;
								store.commit('resetLoginNum',num)
								PdAction.toast(data.error_msg,{icon:'none'});
								if(store.state.loginNum > 3){//如果点击登录次数超过3次,还提示白名单验证不通过的话,则清空缓存的手机号,让用户重新输入!
									store.commit('resetLoginNum')
									PdStorage.removeItem(PdGlobal.simKey)
									PdAction.alert("您已超过3次没有登录成功了,有可能是手机号不正确,请重新录入手机号!").then(function(){
										reject('login')
									});
								}
							}
						}
					}else{
						let msg = data.error_msg||data.errMsg;
						msg = msg==undefined?'登陆失败':msg
						PdAction.toast(msg,{icon:'none'});
					}
					return;
				}
				if(data.xhr.status===404 || (data.xhr.status==200 && data.error_msg==="parsererror")){
					//主机名和端口正确,URI不正确
					PdAction.toast("登录失败，请检查服务地址！");
				}else if(data.xhr.status===0){
					PdDevice.getNetwork().then(net=>{
						PdAction.toast("登录失败，请检查服务地址！");//有网络,地址不正确
					}).catch(()=>{
						PdAction.toast("登录失败，网络异常！");
					})
				}
				reject(data)
			})
		});
	}
};
