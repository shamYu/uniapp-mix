/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc app的更新【pd.resource】【pd.storage】【pd.global】
* @date 20190124
* @author 李凤
*/
import {PdResource} from './pd.resource';
import {PdStorage} from './pd.storage';
import {PdGlobal} from './pd.global';
import {PdView} from './pd.view';
import {PdAction} from './pd.action';
export const PdCache = {
	//[登录后] 缓存基础数据
	cacheBaseData(){
		//查询各类基础数据的是否更新缓存标识
		return new Promise(resolve=>{
			PdCache.queryIsUpdateCacheFlag().then(function(data){
				let bean = data.data_json;
				console.info(">>>各类基础数据缓存更新标识："+JSON.stringify(bean));
				//比对缓存标识，判断【终端应用】是否要进行缓存
				if(bean.yyUpdateFlag!="" && bean.yyUpdateFlag!=PdStorage.get("yyUpdateFlag")){
					PdCache.cacheIndexApp().then(function(){
						//更新缓存标识
						PdStorage.set("yyUpdateFlag",bean.yyUpdateFlag);
						//此处缓存完再跳转index页面
						resolve()
					});
				}else{
					resolve()
				}
				//比对缓存标识，判断【部门信息】是否要进行缓存
				if(bean.bmUpdateFlag!="" && bean.bmUpdateFlag!=PdStorage.get("bmUpdateFlag")){
					PdCache.cacheDepts().then(function(){
						PdStorage.set("bmUpdateFlag",bean.bmUpdateFlag);
					});
				}
				//比对缓存标识，判断【用户信息】是否要进行缓存
				if(bean.yhUpdateFlag!="" && bean.yhUpdateFlag!=PdStorage.get("yhUpdateFlag")){
					PdCache.cacheUsers().then(function(){
						PdStorage.set("yhUpdateFlag",bean.yhUpdateFlag);
					});
				}
				//比对缓存标识，判断【公共代码值】是否要进行缓存
				if(bean.ggdmUpdateFlag!="" && bean.ggdmUpdateFlag!=PdStorage.get("ggdmUpdateFlag")){
					PdCache.cacheGgdmz().then(function(){
						PdStorage.set("ggdmUpdateFlag",bean.ggdmUpdateFlag);
					});
				}
				//比对缓存标识，判断【行业类型】是否要进行缓存
				if(bean.hylxUpdateFlag!="" && bean.hylxUpdateFlag!=PdStorage.get("hylxUpdateFlag")){
					PdCache.cacheHylx().then(function(){
						PdStorage.set("hylxUpdateFlag",bean.hylxUpdateFlag);
					});
				}
				//比对缓存标识，判断【行政区划】是否要进行缓存
				if(bean.xzqhUpdateFlag!="" && bean.xzqhUpdateFlag!=PdStorage.get("xzqhUpdateFlag")){
					PdCache.cacheXzqh().then(function(){
						PdStorage.set("xzqhUpdateFlag",bean.xzqhUpdateFlag);
					}).catch(e=>{})
				}
				console.log('----------------------------------cacheBaseData')
			}).catch((data)=>{
				Log.error('===查询缓存更新标识失败：'+JSON.stringify(data.error_msg));
			})
			//缓存签章相关信息
			PdCache.cacheSignInfo();
			//缓存处理用户clientId内容
			PdCache.cacheUserClientId();
			console.log('----------------------------------cacheBaseData2')

		})
		
	},
	/**
	 * 查询各类基础数据的[是否更新缓存标识]
	 */
	queryIsUpdateCacheFlag(){
		return PdResource.service({
			data:{
				service: "IS_UPDATE_CACHE",
				isCacheHylx:PdGlobal.ISCACHEHYLX,
				isCacheXzqh:PdGlobal.ISCACHEXZQH
			}
		});
	},
	/**
	 * 缓存终端应用。数据格式：[{},{},{}]
	 */
	cacheIndexApp(){
		return new Promise((resolve,reject)=>{
			PdResource.service({
				data:{
					service: "SEARCH_INDEXAPP",
					isCacheHylx:PdGlobal.ISCACHEHYLX,
					isCacheXzqh:PdGlobal.ISCACHEXZQH
				}
			}).then((data)=>{
				//缓存应用配置信息
				PdStorage.set("configArray",data.config_array);
				if(data.config_array.length>0){
					console.info(">>>已缓存终端应用配置数据："+JSON.stringify(data.config_array));
				}
				//缓存个人定制应用
				PdStorage.set("myDzAppsArray",data.myDzApps_array);
				if(data.myDzApps_array.length>0){
					console.info(">>>已缓存个人定制应用数据："+JSON.stringify(data.myDzApps_array));
				}
				//缓存所有个人权限下的终端应用
				PdStorage.set("myAppsArray",data.myApps_array);
				if(data.myApps_array.length>0){
					console.info(">>>已缓存所有个人终端应用数据："+JSON.stringify(data.myApps_array));
				}else{
					console.info(">>>个人终端应用数据为空，请在后台【终端应用管理】功能中配置！");
				}
				resolve(data);
			}).catch(data=>{
				PdAction.toast("读取终端应用数据失败，请联系管理员！");
				console.error("===缓存终端应用数据失败："+data.message);
				reject(data);
			})
		})
	},
	/**
	 * 缓存所有部门
	 */
	cacheDepts(){
		return new Promise((resolve,reject)=>{
			PdResource.service({
				data:{service: "SEARCH_BMXX"}
			}).then((data)=>{
				if(data.data_array.length>0){
					PdStorage.set("bmxxArray",data.data_array);
					console.info(">>>已缓存部门信息数据："+JSON.stringify(data.data_array));
					PdStorage.remove("zzjgTree");//清空组织用户树目录缓存(通讯录使用)
					PdStorage.remove("twoLzzjgTree");//清空二级组织用户树目录缓存(流程和公共人员选择使用)
					resolve(data);
				}else{
					console.info(">>>部门信息数据为空！");
					reject(data);
				}
			}).catch(data=>{
				console.error("===缓存部门信息数据失败："+data.message);
				reject(data);
			})
		});
	},
	/**
	 * 缓存所有用户
	 */
	cacheUsers(){
		return new Promise((resolve,reject)=>{
			PdResource.service({
				data:{service: "SEARCH_YHXX"}
			}).then((data)=>{
				if(data.data_array.length>0){
					PdStorage.set("yhxxArray",data.data_array);
					console.info(">>>已缓存用户信息数据："+JSON.stringify(data.data_array));
					PdStorage.remove("zzjgTree");//清空组织用户树目录缓存(通讯录使用)
					PdStorage.remove("twoLzzjgTree");//清空二级组织用户树目录缓存(流程和公共人员选择使用)
					resolve(data);
				}else{
					console.info(">>>用户信息数据为空！");
					reject(data);
				}
			}).catch(data=>{
				console.error("===缓存用户信息数据失败："+data.message);
				reject(data);
			})
		});
	},
	/**
	 * 缓存所有有效公共代码值。数据格式：{"DMJBH1":[{},{}],"DMJBH2":[{},{}]}
	 */
	cacheGgdmz(){
		return new Promise((resolve,reject)=>{
			PdResource.service({
				data:{service: "SEARCH_GGDMZ"}
			}).then((data)=>{
				if(data.data_object!=null && Object.keys(data.data_object).length>0){
					PdStorage.set("ggdmzObj",data.data_object);
					console.info(">>>已缓存公共代码值数据："+JSON.stringify(data.data_object));
					resolve(data);
				}else{
					console.info(">>>公共代码值数据为空！");
					reject(data);
				}
			}).catch(data=>{
				console.error("===缓存公共代码值数据失败："+data.message);
				reject(data);
			})
		});
	},
	/**
	 * 缓存所有行业类型。数据格式：[{},{},{}]
	 */
	cacheHylx(){
		return new Promise((resolve,reject)=>{
			PdResource.service({
				data:{service: "SEARCH_HYLX"}
			}).then((data)=>{
				if(data.data_array.length>0){
					PdStorage.set("hylxArray",data.data_array);
					console.info(">>>已缓存行业类型数据："+JSON.stringify(data.data_array));
					resolve(data);
				}else{
					console.info(">>>行业类型数据为空！");
					reject(data);
				}
			}).catch(data=>{
				console.error("===缓存行业类型数据失败："+data.message);
				reject(data);
			})
		});
	},
	/**
	 * 缓存本省所有行政区划,数据格式：[{},{},{}]
	 */
	cacheXzqh(){
		return new Promise((resolve,reject)=>{
			PdResource.service({
				data:{service: "SEARCH_XZQH"}
			}).then((data)=>{
				if(data.data_array.length>0){
					PdStorage.set("xzqhArray",data.data_array);
					console.info(">>>已缓存行政区划数据："+JSON.stringify(data.data_array));
					PdStorage.remove("xzqhTree");//清空行政区划树目录缓存
					resolve(data);
				}else{
					console.info(">>>行政区划数据为空！");
					reject(data);
				}
			}).catch(data=>{
				console.error("===缓存行政区划数据失败："+data.message);
				reject(data);
			})
		});
	},
	
	/**
	 * 缓存签章信息
	 */
	cacheSignInfo(){
		return new Promise((resolve,reject)=>{
			PdResource.service({
				data:{service: "APP_DZQZ_QUERY"}
			}).then((data)=>{
				if(data.data_json!=null && Object.keys(data.data_json).length>0){
					PdStorage.set("iSignType",data.data_json.SIGNTYPE);
					PdStorage.set("iSignKeySn",data.data_json.KEYSN);
					PdStorage.set("iSignKeyName",data.data_json.SIGNNAME);
				}else{
					//清空内存
					PdStorage.remove("iSignType");
					PdStorage.remove("iSignKeySn");
					PdStorage.remove("iSignKeyName");
				}
				console.info(">>>已缓存签章信息："+JSON.stringify(data.data_json));
			}).catch(data=>{
				console.error("===缓存签章信息失败！"+data.message);
				reject(data);
			})
		});
	},
	
	/**
	 * 缓存处理用户移动端clientId信息
	 */
	cacheUserClientId(){
		return new Promise((resolve,reject)=>{
			let cacheKey = PdStorage.get(PdGlobal.serviceurlKey)+PdStorage.getToken().userid+"userClientId";//缓存KEY
			let userClientId = PdStorage.get(cacheKey);
			if(typeof userClientId == 'undefined' || userClientId==''){
				// #ifdef APP-PLUS
				let info = plus.push.getClientInfo();
				let clientid=info.clientid;
				if(clientid.length>0){
					PdResource.service({
						data:{service: "PROCESS_USER_CLIENTID","clientId":clientid,"os":PdStorage.get(PdGlobal.osKey)}
					}).then((data)=>{
						if(data.data_json!=null && data.data_json!=undefined){
							PdStorage.set("iSignType",data.data_json.SIGNTYPE);
							PdStorage.set("iSignKeySn",data.data_json.KEYSN);
							PdStorage.set("iSignKeyName",data.data_json.SIGNNAME);
						}else{
							//清空内存
							PdStorage.remove("iSignType");
							PdStorage.remove("iSignKeySn");
							PdStorage.remove("iSignKeyName");
						}
						console.info(">>>已缓存签章信息1："+JSON.stringify(data.data_json));
					}).catch(data=>{
						console.error("===缓存签章信息失败！"+data.message);
						reject(data);
					})
				}
				// #endif
				// #ifndef APP-PLUS
				console.error("===不支持缓存签章信息失败！");
				reject('error');
				// #endif
			}
		});
	},
	/*========================以下是从缓存获取数据的相关方法========================*/
	/**
	 * 根据部门编号获取部门信息,返回数据格式：{}
	 */
	getBmxxByBmbh(bmbh){
		let bmxxArray = PdStorage.get("bmxxArray");
		let newArr = bmxxArray.filter(item=>item.ZZBH===bmbh);
		return newArr[0]||{};
	},
	//通过部门编号获取部门名称
	getBmmcByBmbh(bmbh){
		let bm = this.getBmxxByBmbh(bmbh);
		return bm.ZZQC||''
	},
	/**
	 * 获取当前用户信息,返回数据格式：{}
	 */
	getCurrUserInfo(){
		let userid = PdStorage.getToken().userid;
		return this.getYhxxByYhid(userid);
	},
	/**
	 * 根据用户ID获取用户信息,返回数据格式：{}
	 */
	getYhxxByYhid(yhid){
		let yhxxArray = PdStorage.get("yhxxArray");
		let newArr = yhxxArray.filter(item=>item.YHID===yhid);
		return newArr[0]||{};
	},
	getYhmcByYhid(yhid){
		let yh = this.getYhxxByYhid(yhid);
		return yh.YHMC||''
	},
	//公共代码转代码内容
	getDmjbh(dm,dmjbh){
		let dmnr = '';
    	if(dm && dm!='' && dmjbh && dmjbh!=''){
    		let list = this.getGgdmzBydmj(dmjbh);
    		if(typeof(list) != 'undefined'){
				let newArr = list.filter(item=>item.DM===dm);
				dmnr = newArr.length?'':newArr[0].DMNR;
    		}else{
    			Log.error('未找到编号为【'+dmjbh+'】的代码集，可能原因：未缓存公共代码集！');
    		}
    	}
    	return dmnr;
	},
	// 行业类型代码转行业类型名称
	getHylx(hylxdm){
		return this.getHylxBydm(hylxdm)||'';
	},
	getXzqh(){
		return this.getXzqhBydm(xzqhdm)||''
	},
	/**
	 * 获取某部门下所有用户,返回数据格式：[{},{}]
	 */
	getUsersByBmbh(bmbh){
		let yhxxArray = PdStorage.get("yhxxArray");
		let newArr = yhxxArray.filter(item=>item.BMBH===bmbh);
		return newArr;
	},
	/**
	 * 根据应用代码获取对应的应用配置信息,返回数据格式：{}
	 */
	getAppConfigBydm(dm){
		let configArray = PdStorage.get("configArray");
		let newArr = configArray.filter(item=>item.XH===dm);
		return newArr[0]||{};
	},
	/**
	 * 根据分类代码获取对应的应用集合,返回数据格式：[{},{},{}]
	 */
	getAppsBydm(dm){
		let myAppsArray = PdStorage.get("myAppsArray");
		let newArr = myAppsArray.filter(item=>item.SSFLXH===dm);
		return newArr;
	},
	/**
	 * 根据应用ID获取应用信息,返回json对象
	 */
	getAppById(id){
		let myAppsArray = PdStorage.get("myAppsArray");
		let newArr = myAppsArray.filter(item=>item.XH===id);
		return newArr[0]||{};
	},
	/**
	 *获取默认显示在首页的应用集合,返回数据格式：[{},{},{}]
	 */
	getDefaultIndexApps(){
		let myAppsArray = PdStorage.get("myAppsArray");
		let newArr = myAppsArray.filter(item=>item.SFMRXSZSY==='1');
		return newArr[0]||{};
	},
	/**
	 * 根据公共代码集查询代码值,返回数据格式：[{},{},{}]
	 */
	getGgdmzBydmj(dmjbh){
		return PdStorage.get("ggdmzObj")[dmjbh];
	},
	/**
	 * 根据行业类型代码从缓存中获取行业类型名称
	 */
	getHylxBydm(hylxdm){
		let hylxmc = '';
		let hylxArray = PdStorage.get("hylxArray");
		let newArr = hylxArray.filter(item=>item.HYLXDM===hylxdm);
		hylxmc = newArr.length?'':newArr[0].HYLX;
		return hylxmc;
	},
	/**
	 * 根据行政区划代码从缓存中获取行政区划名称
	 */
	getXzqhBydm(xzqhdm){
		let xzqhmc = '';
		let xzqhArray = PdStorage.get("xzqhArray");
		let newArr = xzqhArray.filter(item=>item.XZQHDM===xzqhdm);
		xzqhmc = newArr.length?'':newArr[0].XZQH;
		return xzqhmc;
	},
	/*从缓存中获取政区划代码树结构*/
	getXzqhTree(){
		let xzqhTree = PdStorage.get("xzqhTree")
		if(xzqhTree){
			PdAction.showWait("正在初始化数据，请耐心等待...");
			let tree = this.buildXzqhTree();
			if(tree.length>0){
				PdStorage.set("xzqhTree",tree);
				console.info(">>>已缓存行政区划树！");
			}else{
				console.error("===行政区划数据为空！");
			}
			PdAction.closeWait();
		}
		return PdStorage.get("xzqhTree");
	},
	/**
	 * 归递构建行政区划代码树结构（行政区划选择组件使用）
	 */
	buildXzqhTree(fdm){
		let trees = [];
		let xzqhArray = PdStorage.get("xzqhArray");
		for(let i = 0 ; i < xzqhArray.length ; i++){
			if(fdm=='' || typeof(fdm)=="undefined"){
				if(xzqhArray[i].XZJB == '1'){
					let children = this.buildXzqhTree(xzqhArray[i].XZQHDM);
					trees.push({'text':xzqhArray[i].XZQH,'value':xzqhArray[i].XZQHDM,'children':children});
				}
			}else{
				if(xzqhArray[i].FDM == fdm){
					let children = this.buildXzqhTree(xzqhArray[i].XZQHDM);
					trees.push({'text':xzqhArray[i].XZQH,'value':xzqhArray[i].XZQHDM,'children':children});
				}
			}
		}
		return trees;
	},
	/*从缓存中获取组织机构树缓存*/
	getZzjgTree(){
		let zzjgTree = PdStorage.get("zzjgTree");
		if(zzjgTree == null || zzjgTree == "" || zzjgTree == {}){
			PdAction.closeWait();
			PdAction.showWait("正在初始化数据，请耐心等待...");
			let tree = this.buildZzjgTree();
			if(tree.length>0){
				PdStorage.set("zzjgTree",tree);
				console.info(">>>已缓存组织机构树！");
			}
			PdAction.closeWait();
		}
		return PdStorage.get("zzjgTree");
	},
	/*从缓存中获取两级子部门的组织机构树缓存*/
	getTwoLZzjgTree(){
		let twoLzzjgTree = PdStorage.get("twoLzzjgTree");
		if(twoLzzjgTree == null || twoLzzjgTree == "" || twoLzzjgTree == {}){
			let trees = [];
			let tree = this.getZzjgTree();
			for(let k=0;k<tree.length;k++){
				if(tree[k].pId=='ROOT'){
					let clilds = tree[k].children;
					if(clilds.length>0){
						let twoTree = [];//二级部门树
						for(let f=0;f<clilds.length;f++){ //如果有二级部门
							let users = this.getTwoAllUsers(clilds[f]);//获取二级部门下所有用户数据（包括子部门）
							clilds[f].users = users;
							clilds[f].count = users.length;
							twoTree.push(clilds[f]);//添加二级部门及用户数据
						}
						tree[k].children = twoTree;
					}
					trees.push(tree[k]);//添加一级部门及用户数据
				}
			}
			if(trees.length>0){
				PdStorage.set("twoLzzjgTree",trees);
				console.info(">>>已缓存两级的组织机构树！");
			}
			PdAction.closeWait();
		}
		return PdStorage.get("twoLzzjgTree");
	},
	/**
	 * 获取二级部门下所有用户数据（包括子部门）
	 */
	getTwoAllUsers(dept){
		let users = dept.users;//子部门用户
		let childs = dept.children;
		for(let v=0;v<childs.length;v++){
			users = users.concat(this.getTwoAllUsers(childs[v]));
		}
		return users;
	},
	/**
	 * 归递构建组织机构树结构（通讯录-组织机构查询使用）
	 */
	buildZzjgTree(fdm){
		let trees = [];
		let bmxxArray = PdStorage.get("bmxxArray");
		for(let i = 0 ; i < bmxxArray.length ; i++){
			if(fdm=='' || typeof(fdm)=="undefined"){
				if(bmxxArray[i].SJZZXH == 'ROOT'){
					let children = this.buildZzjgTree(bmxxArray[i].ZZBH);//子部门
					let users = this.getUsersByBmbh(bmxxArray[i].ZZBH);//该部门下用户
					let userCount = users.length;//该部门的用户数
					children.map(child=>{
						userCount += child.count;
					});
					trees.push({'deptId':bmxxArray[i].ZZBH,'deptName':bmxxArray[i].ZZJC,'pId':bmxxArray[i].SJZZXH,'children':children,'users':users,'count':userCount});
				}
			}else{
				if(bmxxArray[i].SJZZXH == fdm){
					let children = this.buildZzjgTree(bmxxArray[i].ZZBH);//子部门
					let users = this.getUsersByBmbh(bmxxArray[i].ZZBH);//该部门下用户/
					let userCount = users.length;//该部门的用户数
					children.map(child=>{
						userCount += child.count;
					});
					trees.push({'deptId':bmxxArray[i].ZZBH,'deptName':bmxxArray[i].ZZJC,'pId':bmxxArray[i].SJZZXH,'children':children,'users':users,'count':userCount});
				}
			}
		}
		return trees;
	}
};
