/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc 发起请求的服务,该模块依赖于【pd.global】模块常量TIMEOUT,SERVICEPATH;【pd.device】【pd.action】
* @date 20190118
* @author 李凤
*/
import {PdDevice} from './pd.device';
import {PdGlobal} from './pd.global';
import {PdAction} from './pd.action';
import {PdStorage} from './pd.storage';
import {Log} from './log';
import store from '../../../store/index.js';
export const PdResource = {
	/**
	 * ajax请求,返回promise
	 */
	errorDeal(options={},code){
		let msg = '',type='error',
		time = new Date();
		switch (code) {
		  case 400:
			msg = '请求错误'
			break
		  case 401:
			msg = '401'
			break
		  case 403:
			msg = '拒绝访问'
			break
		  case 404:
			msg = `请求地址出错: ${options.url}`,
			type='not found'
			break
		  case 408:
			msg = '请求超时';
			type = 'timeout';
			break
		  case 500:
			msg = '服务器内部错误'
			break
		  case 501:
			msg = '服务未实现'
			break
		  case 502:
			msg = '网关错误'
			break
		  case 503:
			msg = '服务不可用'
			break
		  case 504:
			msg = '网关超时'
			type = 'timeout';
			break
		  case 505:
			msg = 'HTTP版本不受支持'
			break
		  default:
		}
		if (msg) {
			PdAction.alert(msg,{title:false});
		}
		return {time: time, url:options.url, reqData:options.data, type: 'error',status:code,message: msg}
	},
	/**
	 * ajax请求，先判断是否有网
	 * @param opt：{
	 * 	@param url：请求路径如： '/login'
	 *  @param data：请求参数，白名单相关的参数不需要进行输入，系统会自动添加
	 * }
	 *  @return promise对象
	 */
	service(param,{isWait=false,waitMsg='正在加载数据'}={}, isPartUrl= true, version=PdGlobal.version) {
		return new Promise((resolve,reject)=>{
			if(isWait){
				PdAction.showWait(waitMsg)
			}
			PdDevice.getNetwork().then((res) => {
				//构建请求参数
				if (param.data == undefined){param.data = {}}
				param.data.version = version
				//调用ajax
				this.ajax(param,isPartUrl).then(res=>{
					if(isWait){
						PdAction.closeWait()
					}
					resolve(res)
				}).catch(error=>{
					if(isWait){
						PdAction.closeWait()
					}
					reject(error)
				})
			}).catch(e => {
				if(isWait){
					PdAction.closeWait()
				}
				reject(e);
			})
		})
		
	},
	/**
	 * ajax请求,返回promise
	 * @param opt：{
	 * 	@param url：请求路径如： '/login'
	 *  @param data：请求参数，白名单相关的参数不需要进行输入，系统会自动添加
	 * }
	 * isPartUrl: true【非完整地址】；false【完整地址】
	 *  @return promise对象
	 */
	ajax(opt={}, isPartUrl= true) {
		let url = opt.url;
		if (isPartUrl) {
			let isKFHJ = PdDevice.isKFHJ(); // true :开发环境【】
			let partUrl = typeof url != "undefined" ? url : PdGlobal.SERVICEPATH;
			let servicePath = PdStorage.get(PdGlobal.serviceurlKey)||PdGlobal.SERVICEURL;
			url = servicePath+partUrl;
			// opt.url = isKFHJ?('/pure4'+partUrl):(PdGlobal.SERVICEURL+partUrl);
		}
		let options = Object.assign({
			method: 'POST', // GET, POST, PUT, DELETE
			dataType: 'json',// 设为 json，会尝试对返回的数据做一次 JSON.parse
		},opt,{
			url: url
		})
		console.log(options)
		// 请求数据参数
		let sim = PdStorage.get(PdGlobal.simKey,'',false)
		Object.assign(options.data,{
			imei: PdStorage.get(PdGlobal.imeiKey),
			os:PdStorage.get(PdGlobal.osKey),
			sim:sim
		});
		// 已登录，此时接口参数加上用户名、密码、token、sim
		if (store.state.hasLogin){
			Object.assign(options.data,PdStorage.getToken());
		}
		console.log('请求参数');
		console.log(JSON.stringify(options.data))
		const startTime = new Date();
		return new Promise((resolve,reject)=>{
			options.success = (res) => {
				let endTime = new Date();
				let data = res.data;
				if(res.statusCode == 200&&data['status_code'] == '0') {
					Log.log("请求成功,返回数据："+JSON.stringify(res.data));
					resolve(res.data);
				} else {
					console.log('fail error other')
					let result = this.errorDeal(opt,res.statusCode);
					if (!result.message){
						result.message = data.error_msg
					}
					result.cost = endTime - startTime;
					result.resData = res
					Log.error("请求失败："+JSON.stringify(result));
					reject(result);
				}
			};
			options.fail = (res) => {
				console.log(JSON.stringify(res))
				console.log('fail error')
				let endTime = new Date();
				let result = this.errorDeal(options,res.statusCode);
				result.cost = endTime - startTime;
				Log.error("请求失败："+JSON.stringify(result));
				reject(result);
			};
			const resTask = uni.request(options);
		})
	},
	/**
	 * ajax的GET请求
	 * @param opt：{
	 * 	@param url：请求路径如： '/login'
	 *  @param data：请求参数，白名单相关的参数不需要进行输入，系统会自动添加
	 * }
	 * isPartUrl: true【非完整地址】；false【完整地址】
	 *  @return promise对象
	 */
	get(opt={}, isPartUrl= true){
		Object.assign(opt, {
			method: 'GET'
		})
		return this.service(opt,true)
	},
	/**
	 * ajax的POST请求
	 * @param opt：{
	 * 	@param url：请求路径如： '/login'；
	 *  @param data：请求参数，白名单相关的参数不需要进行输入，系统会自动添加
	 * }
	 * isPartUrl: true【非完整地址】；false【完整地址】
	 * @return promise对象
	 */
	post(opt={}, isPartUrl= true){
		Object.assign(opt, {
			method: 'POST'
		})
		return this.service(opt,true)
	},
	/**
	 * @desc上传文件
	 * @param opt：{
	 * 	@param url：请求路径;已有默认的可不加；如： '/XXX'
	 *  @param formData：额外请求参数[可不加]
	 *  单文件：filePath、name；多文件：files
	 * }
	 * isPartUrl: true【非完整地址】；false【完整地址】
	 *  @return promise对象
	 */
	uploadFile(opt={},isMultiple = false, isPartUrl= true) {
		if (isPartUrl) {
			opt.url = PdGlobal.UPLOADSERVICE;
		}
		let options = Object.assign({
			formData: {},//HTTP 请求中其他额外的 form data
		},opt)
		if (isMultiple) { // 多文件上传【5+App支持多文件上传，微信小程序只支持单文件上传，传多个文件需要反复调用本API。】
			options = Object.assign({
				files: [] //[{name: '',url: ''}] 需要上传的文件列表。使用 files 时，filePath 和 name 不生效。
			},options);
		}else{//单文件上传
			options = Object.assign({
				filePath: options.filePath, // 文件地址
				name: options.name, // 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
			},options)
		}
		Object.assign(options.formData,{
			sim: PdStorage.set('sim'),
			imei: PdStorage.set('imei'),
			os: PdStorage.set('os')
		})
		return new Promise((resolve,reject)=>{
			uni.uploadFile({
				url: opt.url,
				formData: options.formData,
				success: (uploadFileRes) => {
					console.log(uploadFileRes);
					resolve(uploadFileRes)
				},
				fail:(res) => {
					console.log(res)
					let result = this.errorDeal(opt.url,res.statusCode);
					reject(result);
				}
			});

		})
	},
	/**
	 * @desc本地相册选择图片或使用相机拍照
	 * @param  isAutoUpload:true:自动上传
	 *  @return promise对象
	 */
	chooseImg(isAutoUpload = true,{count=0} = {}){
		return new Promise((resolve,reject)=>{
			uni.chooseImage({
				count: 9,
				sourceType:['album','camera'],
			    success: (chooseImageRes) => {
			        const tempFilePaths = chooseImageRes.tempFilePaths;
					if (isAutoUpload){ // 自动上传
						PdResource.uploadFile().then(res=>{
							console.log(res)
							resolve(res)
						}).catch(e=>{
							reject()
						});
					}else{
						resolve(tempFilePaths);
					}
			    },
				complete:(res)=>{ // 调用成功、失败都会执行
					console.error(res)
				}
			});
		})
		
	}
};
