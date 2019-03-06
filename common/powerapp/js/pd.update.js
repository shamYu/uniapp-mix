/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc app的更新【pd.device】【pd.action】
* @date 20190124
* @author 李凤
*/
import {PdResource} from './pd.resource';
import {PdAction} from './pd.action';
import {PdGlobal} from './pd.global';
import {Log} from './log';
export const PdUpdate = {
	/**
	 * @desc 获取app当前版本号【(apk/ipa)的版本号】
	 */
	getCurrentVersion(){
		return typeof plus === 'undefined'?'':plus.runtime.version
	},
	/**
	 * 检查是否有更新可用
	 */
	checkUpdate(url = 'SEARCH_BBXX_DETAIL'){
		return new Promise((resolve,reject)=>{
			Log.log('监测是否需要升级？')
			PdResource.service({data:{service:url}}).then(result=>{
				Log.log("当前版本"+PdGlobal.version+"==监测是否有更新版本？")
				result.data_json={}
				if ( result.data_json&&parseFloat(PdGlobal.version) < parseFloat(result.data_json.BBH)){
					Log.log('==监测有更新版本==')
					// 更新可用
					let msg = '当前系统有版本更新，是否现在马上升级？';
					let con = result.data_json.BZ;
					msg+=con?('\r\n更新内容：\r\n'+con):'';
					PdAction.alert(msg,{
						confirmText:'马上升级',
						showCancel: true,
						cancelText:'下次再说'
					}).then(ok=>{
						if (ok == 'confirm'){
// 							PdAction.showWait('正在下载，请耐心等待...')
// 							// 下载安装升级包
// 							PdUpdate.downloadAndInstallUpdate(result.data_json.WJID,result.data_json.XH)
// 							.then(e=>{
// 								//更新之后重启应用
// 								PdAction.alert("应用资源更新完成！").then(function(){
// 									PdAction.closeWait();
// 									PdDevice.restart();
// 								})
// 							}).catch(e=>{
// 								PdAction.closeWait(); 
// 								PdAction.alert("安装更新失败["+e.code+"]："+e.message);
// 							});
							plus.runtime.openURL(result.data_json.WJID);
						}
					})
				}else{
					resolve({
						status:0,
						msg:"已经是最新版本"
					})
					Log.log('==监测没有更新版本==')
				}
			}).catch(e=>{
				Log.error(JSON.stringify(e));
			})
		});
		
	},
	/**
	 * 下载更新,下载完成之后更新
	 * @param downloadPath:安装包下载地址
	 * @param newVersionKey:所更新版本的序号(插入更新记录需要)
	 */
	downloadAndInstallUpdate(downloadPath) {
		if(!downloadPath) {
			PdAction.toast("请指定更新包下载地址！",{icon:'none'});
			return;
		}
		plus.nativeUI.showWaiting("下载更新...");
		return new Promise((resolve,reject)=>{
			console.log("wgt路径：" + PdStorage.get("serviceUrl") + downloadPath);
			let download = plus.downloader.createDownload(PdStorage.get(PdGlobal.serviceurlKey) + downloadPath, {
				filename: "_doc/update/"
			}, function(d, status) {
				if(status=="200") {
					// 安装wgt包
					console.log("下载名："+JSON.stringify(d));
					plus.nativeUI.showWaiting("安装更新...");
					plus.runtime.install(d.filename, {}, function() {
						//更新之后插入更新记录
						PdResource.service({data:{
							service:"RECORD_UPDATE",
							versionXH: newVersionKey
						}}).then(function() {
							console.log("已插入更新记录！");
							//清空所有服务地址缓存, 移动至插入记录成功后，否则无法插入记录
							PdStorage.remove(PdGlobal.serviceurlKey)
							resolve();
						}).catch(e => {
							console.log(e);
							reject(e);
						});
					}, function(e) {
						alert("安装更新失败：" + JSON.stringify(e));
						reject(e);
					});
				} else {
					plus.nativeUI.showWaiting("下载wgt失败！");
				}
			});
			download.addEventListener("statechanged", function(){
				var num = download.downloadedSize / download.totalSize * 100;
				if(num < 100){
					var progress = Math.floor(num);
					if(downloadProgress!=progress){
						downloadProgress = progress;
						plus.nativeUI.showWaiting("下载更新"+progress+"%...");
					} 
				} 
			}, false );
			download.start();
		})
	}
};
