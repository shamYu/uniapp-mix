/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc 设备相关组件【网络状态，是否开发环境，系统信息，发短信，打电话、扫码，分享】【依赖于pd.action模块、pd.storage模块】
* @date 20190116
* @author 李凤
*/
import {PdAction} from './pd.action';
import {PdStorage} from './pd.storage';
import {pdValue} from './pd.common'
import {Log} from './log';
export const PdDevice = {
	/**
	* @desc： 获取当前设备的网络状态
	* @return 网络状态【none: 表示无网络；wifi, 4G】其他返回参数值参考：https://uniapp.dcloud.io/api/system/network
	*/
	getNetwork () {
		return new Promise((resolve,reject) => {
			uni.getNetworkType({
				success: (res) => {
					const networkType = res.subtype || res.networkType;
					// 是否有网, 网络类型
					let netWork = {hasNetwork: true, networkType: networkType};
					Log.log(`==当前网络${netWork.networkType}==`)
					resolve(netWork);
				},
				fail: () => {
					PdAction.alert('网络异常，请检查网络连接后再试！',{title:'系统消息'});
					reject();
				}
			})
		});
	},
	/**
	* @desc： 是否是开发环境
	* @return true【开发环境】；false【生产发布环境】
	*/
	isKFHJ () {
		return process.env.NODE_ENV === 'development'
	},
	//获取当前设备的IMEI号,有些设备会有两个IMEI号，默认取第一个即可。
	getImei() {
		// #ifdef APP-PLUS
		let imei = plus.device.imei;
		if(!imei&&plus.os.name=='iOS'){
			//iOS系统不支持，推荐使用设备的唯一标识号UUID作为IMEI号，（注意：UUID在设备重置后会重新生成）。
			return plus.device.uuid;
		}else{
			return imei.split(',')[0];
		}
		// #endif
		return ''
	},
	/**
	* @desc： 获取当前的系统信息
	* @return 系统信息【如：system:操作系统版本，】其他返回参数值参考：https://uniapp.dcloud.io/api/system/info?id=getsysteminfo
	*/
	getSysInfo(){
		return new Promise((resolve,reject) => {
			let system = PdStorage.get('system');
			console.log(system)
			if (system){
				resolve(system);
			}else{
				uni.getSystemInfo({
					success: function (res) {
						PdStorage.set('system',res);
						console.log('系统信息');
						console.log(JSON.stringify(res));
						resolve(res);
					}
				});
			}
		});
	},
	/**
	 * @desc 开始录音。【h5不支持、支付宝不支持】
	 */
	startRecognize(options) {
	},
	/**需要勾选sdk的messaging模块【仅app支持】
	 * @desc 发送消息如：【this.$pdDevice.sendMessage({acceptArr:['15823904221'],message:'nihao,利好'})】
	 * @param type:消息类型【plus.messaging.TYPE_SMS(短信)、plus.messaging.TYPE_MMS(彩信)、plus.messaging.TYPE_EMAIL(邮件)】,
	 * acceptArr:接收人数组,message:发送内容
	 * @return promise对象
	 */
	sendMessage({type,acceptArr,message}={}){
		return new Promise((resolve, reject) => {
			// #ifdef APP-PLUS
			type = type || plus.messaging.TYPE_SMS;// 短信
			console.log('sendMsg')
			let msg = plus.messaging.createMessage(type);
			msg.to = acceptArr;
			msg.body = message;
			console.log(plus.messaging.sendMessage)
			plus.messaging.sendMessage(msg,function(){
				console.log('发送短信成功')
				resolve();
			},function(error){
				console.log('发送信息失败')
				if(error.code===2 && error.message==="canceled"){
					PdAction.toast("用户取消！",{icon:'none'});
				}else{
					PdAction.toast("不支持发送短信！",{icon:'none'});
				}
				reject(error);
			});
			// #endif
			// #ifndef APP-PLUS
			PdAction.toast("不支持发送短信！",{icon:'none'});
			reject('不支持');
			// #endif
		});
	},
	/**
	 * @desc 打电话【需要勾选sdk的concat模块】
	 * @param number:电话号码
	 * @return promise对象
	 */
	call(number){
		return new Promise((resolve, reject) => {
			// #ifdef APP-PLUS
			uni.makePhoneCall({
				phoneNumber: number, //仅为示例
				success: function (res) {
					console.log('打电话成功');
					resolve(res)
				},
				fail: function (res) {
					console.log('打电话失败')
					reject(res.error)
				}
			});
			// #endif
			// #ifndef APP-PLUS
			PdAction.toast("不支持打电话！",{icon:'none'});
			reject('不支持');
			// #endif
		});
		
	},
	/**如：this.$pdDevice.scanUni()
	 * @desc 调起客户端扫码界面，扫码成功后返回对应的结果。【h5不支持】
	 * @param onlyFromCamera【true:只允许通过相机扫码；false:运行相机和相册扫码】
	 * 其他参数：https://uniapp.dcloud.io/api/system/barcode?id=scancode
	 * @return promise对象
	 */
	scanUni(options){
		return new Promise((resolve, reject) => {
			// #ifdef H5
			PdAction.toast("不支持扫码！",{icon:'none'});
			reject('不支持');
			// #endif
			// #ifndef H5
			options = Object.assign({
				onlyFromCamera:false
			},options)
			options.success = function (res) {
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
					resolve(res);
				};
			options.fail = function (res) {
				console.log('打电话失败')
				reject(res.error)
			}
			uni.scanCode(options);
			// #endif
		});
	},
	/**
	 * 构建二维码扫描器，并启动扫描器
	 * @param elemId 页面上构建扫描器的html元素id
	 * callback(type, result) 扫成功后回调函数
	 * @param options 扫描器相关配置项（非必须）
	 */
// 	createScan(elemId,callback,options){
// 		// #ifdef APP-PLUS
// 		var scan = new plus.barcode.Barcode(elemId);
// 		scan.onmarked = function(type,result,file){
// 			callback(type,result,file);
// 		}
// 		scan.start(options);
// 		return scan;
// 		// #endif
// 		// #ifdef H5
// 		PdAction.toast("不支持扫码！",{icon:'none'});
// 		// #endif
// 	},
	/**如：this.$pdDevice.scanUni();
	 * @desc uni-app分享【仅App支持】
	 * @param 【type:1;shareUni({type:1,summary:'只分享文字'})
	 * 【type:2；shareUni({type:1,imageUrl: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png"})】
	 * 【type:0；shareUni({type:0,href: "http://uniapp.dcloud.io/",summary:'文字'imageUrl: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png"})】
	 * 其他参数：https://uniapp.dcloud.io/api/plugins/share
	 * @return promise对象
	 */
	shareUni(options){
		return new Promise((resolve, reject) => {
			// #ifdef APP-PLUS
			options = Object.assign({
				provider: "weixin",
				scene: "WXSceneSession",//[WXSceneSession:分享到聊天界面;WXSenceTimeline:分享到朋友圈]
				type: 0,// [0:图文，1纯文字；2纯图片]
				success:(res) =>{
					console.log("success:" + JSON.stringify(res));
					PdAction.toast('分享成功！');
				},
				fail: (err) => {
					PdAction.toast('分享失败！');
					console.log("fail:" + JSON.stringify(err));
				}
			},options)
			uni.share(options);
			// #endif
			// #ifndef APP-PLUS
			PdAction.toast("不支持分享！",{icon:'none'});
			reject('不支持');
			// #endif
		});
	},
	/**
	 * @desc 截屏分享【仅App支持】
	 * @param
	 * 其他参数：https://uniapp.dcloud.io/api/system/barcode?id=scancode
	 * @return promise对象
	 */
	shareScreenShot(){
		// #ifdef APP-PLUS
		let ws = plus.webview.currentWebview();
		let bitmap = new plus.nativeObj.Bitmap("screenshot");
		// 将webview内容绘制到Bitmap对象中
		ws.draw(bitmap,()=>{
			//保存图片
			bitmap.save('_doc/shot/screenshot.jpg',{overwrite:true,quality:50},(i)=>{
				//pdActionSvr.toast('截屏并保存成功');
				//这里是绝对路径
				let picPath = plus.io.convertLocalFileSystemURL(i.target);
				//获取相对路径
				picPath = plus.io.convertAbsoluteFileSystem(picPath);
				let msg={extra:{scene:''}};//微信分享场景，仅微信分享平台有效
				msg.pictures = [picPath];
				
				//_this.shareAction(msg);
				this.shareSystem(msg);
				//销毁Bitmap
				bitmap.clear();
			},function(e){
				PdAction.toast("截屏失败！");
				//销毁Bitmap
				bitmap.clear();
			})
		},function(e){
			console.log('截屏绘制图片失败：'+JSON.stringify(e));
		});
		// #endif
		// #ifndef APP-PLUS
		PdAction.toast('不支持屏幕截屏')
		// #endif
	},
	/**
	 * @desc 调用系统分享【仅App支持】
	 * @param msg 分享内容
	 */
	shareSystem(msg){
		// #ifdef APP-PLUS
		plus.share.sendWithSystem ? plus.share.sendWithSystem(msg, function(){
			// PdAction.toast('分享成功！');
		}, function(e){
			console.log('Failed: '+JSON.stringify(e));
		}) : (function(msg){
			if(plus.os.name !== 'Android'){
				PdAction.alert('此平台暂不支持系统分享功能!');
				return;
			}
			let intent=new Intent(Intent.ACTION_SEND);
			if(msg.pictures.length > 0){
				let p = '';
				p = msg.pictures[0];
				if(p.substr(0,7)==='file://'){
					p=p.substr(7);
				}else if(p.sub(0)!=='/'){
					p=plus.io.convertLocalFileSystemURL(p);
				}
			}
			let f = new File(p);
			let uri = Uri.fromFile(f);
			if(f.exists() && f.isFile()){
				intent.setType('image/*');
				intent.putExtra(Intent.EXTRA_STREAM,uri);
			}else{
				console.log('text/plain');
				intent.setType('text/plain');
			}
			intent.putExtra(Intent.EXTRA_SUBJECT,'systemShare');
			intent.putExtra(Intent.EXTRA_TEXT,msg.content);
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			main.startActivity(Intent.createChooser(intent,'系统分享'));
		})();
		// #endif
		// #ifndef APP-PLUS
		PdAction.toast('不支持系统分享',{icon:'none'})
		// #endif
	},
	/**
   * 分享操作【仅支持app】
   * @param {plus.share.ShareMessage} msg
   * @desc http://www.html5plus.org/doc/zh_cn/share.html#plus.share.ShareMessage
   */
	shareAction(msg) {
		// #ifdef APP-PLUS
		//更新分享服务
		plus.share.getServices(function(s){
			let shares={};
			for(let i in s){
				let t=s[i];
				shares[t.id]=t;
			}
			let shareBts=[];
			// 更新分享列表
			let ss=shares['weixin'];
			ss&&ss.nativeClient&&(shareBts.push({title:'朋友圈',s:ss,x:'WXSceneTimeline'}),
			shareBts.push({title:'微信',s:ss,x:'WXSceneSession'}));
			ss=shares['qq'];
			ss&&ss.nativeClient&&shareBts.push({title:'QQ',s:ss});
			
			// 弹出分享列表
			shareBts.length>0 ? plus.nativeUI.actionSheet({title:'分享到',cancel:'取消',buttons:shareBts},function(e){
				if(e.index>0){
					let sb = shareBts[e.index-1];
					msg.extra.scene = sb.x;
					if(!sb||!sb.s){
						PdAction.toast('无效的分享服务！');
						return;
					}
					// 发送分享
					if(sb.s.authenticated){
						sb.s.send(msg, function(){
							PdAction.toast('分享到"'+sb.s.description+'"成功！');
						}, function(e){
							console.error('分享到"'+sb.s.description+'"失败: '+JSON.stringify(e));
						});
					}else{
						sb.s.authorize(function(){
							sb.s.send(msg, function(){
								PdAction.toast('分享到"'+sb.s.description+'"成功！');
							}, function(e){
								console.error('分享到"'+sb.s.description+'"失败: '+JSON.stringify(e));
							});
						}, function(e){
							PdAction.toast('认证授权失败：'+e.code+' - '+e.message);
						});
					}
				}
			}) : PdAction.alert('当前环境无法支持分享链接操作!');
		}, function(e){
			console.error('获取分享服务列表失败：'+e.message);
		});
		// #endif
		// #ifndef APP-PLUS
		PdAction.toast('不支持分享操作')
		// #endif
	},
	/**
	* 第三方app传参数解析【】
	*/
	getAppParam(options){
		let extraParam = {};
		if(options.param && options.param!={}){//替换参数中的变量
			let paramStr = JSON.stringify(options.param);//将json转为字符串
			let token = PdStorage.getToken();
			paramStr = paramStr.replace(/#USERID#/g,token.userid);
			paramStr = paramStr.replace(/#USERPWD#/g,token.pwd);
			paramStr = paramStr.replace(/#SJH#/g,token.sim||"");
			extraParam = JSON.parse(paramStr);//重新将字符串转为json对象
			console.log("===调用第三方app传参数："+JSON.stringify(extraParam));
		}
		return extraParam
	},
	/**
	 * 打开第三方应用   add molinshen
	 * @param options:{
	 * 	  pname:[android包名]（android必须，打包时的配置项）
	 *    action:URLScheme字符串（IOS必须），格式如：weixin://
	 *    param:android额外传参，json格式。注意key要有双引号。如：{"userid":"#USERID#","userpwd":"#USERPWD#"}
	 *    aDownUrl:应用未安装情况下android端该app的下载安装地址(可选)
	 *    iDownUrl:应用未安装情况下ios端该app的下载安装地址(可选)
	 * }
	 * 另外：param支持替换的变量有：#USERID#,#USERPWD#,#SJH#。分别代表用户ID,用户密码，用户手机号
	 */
	launchApplication(options){
		// #ifdef APP-PLUS
			//处理参数
			let extraParam = this.getAppParam(options);
			//根据不同系统使用不同处理逻辑打开
			if(plus.os.name == "iOS"){//如果是iOS系统
				//将参数转为Url字符串形式追加在action后
				let strParam = "";
				for(let a in extraParam){
					strParam += strParam==''?(a+"="+extraParam[a]):("&"+a+"="+extraParam[a]);
				}
				if(strParam != ""){
					if(options.action.indexOf("?")>0){
						options.action += strParam;
					}else{
						options.action += "?"+strParam;
					}
				}
				plus.runtime.launchApplication({action:options.action},(e)=>{//打开失败
						if(options.iDownUrl && options.iDownUrl != ""){
				    		PdAction.alert('当前应用尚未在设备上安装，是否现在下载安装？',{
								title : "安装提示",
								confirmText :'是',
								cancelText:'否'
							}).then(res=>{
								//IOS不支持直接安装，建议借助第三方如“蒲公英”打开网址来下载安装
								plus.runtime.openURL(options.iDownUrl);
							})
				    	}else{
				    		PdAction.alert("当前应用未安装，请安装后再重试！");
				    	}
					}
				);
			}else{//如果是android系统
				plus.runtime.launchApplication({pname:options.pname,extra:extraParam},(e)=>{//打开失败
					let downUrl = options.aDownUrl;
					if(downUrl && downUrl != ""){
						PdAction.alert("当前应用尚未在设备上安装，是否现在下载安装？",{
							title : "安装提示",
							confirmText :'是',
							cancelText:'否'
						}).then(res=>{
							let hz = downUrl.substring(downUrl.lastIndexOf(".")+1).toLowerCase();
							if(hz=='apk'){//如果网址后缀是apk则直接下载安装
								PdAction.showWait("开始下载...");
								let dtask = plus.downloader.createDownload(downUrl,{filename:"_doc/download/"},function(d,status){
									if(status == 200) {
										PdAction.showWait("正在安装...");
										plus.runtime.install(d.filename, {}, function() {
											PdAction.closeWait();
										}, function(e) {
											PdAction.alert("安装失败：" + JSON.stringify(e));
											PdAction.closeWait();
										});
									} else {
										PdAction.alert("下载失败！");
										PdAction.closeWait();
									}
								})
								let prTime = 0;
								dtask.addEventListener("statechanged", function(download, status) {
									let progress = 0;
									if(download.totalSize && download.totalSize !== 0 && download.downloadedSize <= download.totalSize){
										progress = parseInt(download.downloadedSize / download.totalSize * 100);
										if(progress != 100) {
											let nTime = Date.parse(new Date());
											if(nTime - prTime > 500){
												PdAction.showWait("已下载:" + progress + "%");
												prTime = Date.parse(new Date());
											}
										}
									}
								}, false);
								dtask.start();
							}else{//如果是网页，则调用内置浏览器打开
								pdBrowserSvr.openUrl(downUrl);
							}
						})
					}else{
						PdAction.alert("当前应用未安装，请安装后再重试！");
					}
				});
			}
		// #endif
		// #ifndef APP-PLUS
		PdAction.toast('不支持打开第三方应用')
		// #endif
	},
	/**
	 * 打开原生的android应用（离线打包的内部集成原生应用时使用有效）add molinshen
	 * 需借助插件来打开内部集成的原生android应用
	 * @param options:{
	 * 	  pname:android包名（必须）
	 *    activity:android应用启动特有的入口（必须）
	 *    param:额外传参，json格式。注意key要有双引号。如：{"userid":"#USERID#","userpwd":"#USERPWD#"}
	 * }
	 * 另外：param支持替换的变量有：#USERID#,#USERPWD#,#SJH#。分别代表用户ID,用户密码，用户手机号
	 */
	openAndroidApp(options){
		// #ifdef APP-PLUS
			let extraParam = this.getAppParam(options);
			let PluginProxy = plus.android.importClass("com.szboanda.gzmh.PluginProxy");
		    PluginProxy.makeSureStartActivityWithClass(plus.android.runtimeMainActivity(),options.activity,options.pname,extraParam);
		// #endif
		// #ifndef APP-PLUS
		PdAction.toast('不支持打开第三方应用')
		// #endif
	},
	/**
	 * @desc 获取第三方传入的参数
	 */
	getPlusArgs(){
		return new Promise((resolve,reject)=>{
			// #ifdef APP-PLUS
			let args = plus.runtime.arguments;
			// args='?userid=SYSTEM&userpwd=PURE4'
			try{
				args = JSON.parse(args);
			}catch(e){
				args = pdValue.stringToObj(args);
				//TODO handle the exception
			}
			if (args.userid&&args.userpwd){
				resolve({
					userid: args.userid,
					pwd: args.userpwd
				});
			}else{
				reject()
			}
			// #endif
			// #ifndef APP-PLUS
			// PdAction.toast('不支持获取第三方应用传入参数');
			reject()
			// #endif
		})
	},
	/**
	 * 应用重启
	 */
	restart(){
		// #ifdef APP-PLUS
		plus.runtime.restart();
		// #endif
	},
	/**
	 * 退出应用
	 */
	quit(){
		// #ifdef APP-PLUS
		plus.runtime.quit();
		// #endif
	}
};
