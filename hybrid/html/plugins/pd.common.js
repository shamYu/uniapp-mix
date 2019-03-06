/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc 常用的公用js方法【如：日期格式的转换，】
* @date 20190124
* @author [李凤]
*/
// value值的显示处理
var pdValue = {
	/**
	 * @desc 对象object转换为string;以？开头通过&连接的键值对
	 * @param options：Object类型值;如：{name: 'lee'}
	 */
	objToString(options){
		let keys = Object.keys(options);
		let string='';
		keys.map(key=>{
			if(string==''){
				string+='?'
			}else{
				string+='&';
			}
			string+=key+'='+options[key]
		});
		return string;
	},
	/**
	 * @desc string（通过&连接的键值对）转换为对象object
	 * @param str:如：name=lea&age=23
	 */
	stringToObj(str){
		let obj = {};
		let index = str.indexOf('?');
		if (str){
			let arr = str.substring((index+1)).split('&');
			for(let i=0,length=arr.length;i<length;i++){
				let item = arr[i].split('=');
				obj[item[0]] = item[1];
			}
		}
		console.log(obj)
		return obj;
	},
	// 月，日，时分秒0位补齐
	zeroComplete(val){
		if(val < 10) {
			val = "0" + val;
		}
		return val;
	},
	//0转空字符串
	zeroToNull(value){
		if (value == 0){
			return ''
		}
		return value
	},
	// 值为0或空时转为默认字符串str 例：{{pdValue.nullToDefault(123.56,'--')}}
	nullToDefault(value,d=''){
		if(value==''||value=='0'||value=='0.0'||value=='0.00'||value=='0.000'){
    		return d;
    	}
    	return value;
	},
	////向后追加新字符串，为空或为0时不加; 例：{{pdValue.append(123.56,'万元')}}，输出结果：123.56万元
	append(value = '',str){
		if(value != '0' && value != ''){
    		return value+str;
    	}else{
    		return '';
    	}
	},
	//将文本中特殊字符转为相关html标记
	toHtml(value, str){
		if(inputHtml==null||inputHtml==undefined){
    		if(str){
    			inputHtml = str;//为空时，默认展示字符串，如：--
    		}
    		return inputHtml
    	}
    	//HTML特殊字符处理
        inputHtml=inputHtml.replace(new RegExp(/(%22)/g),"\"")
			.replace(new RegExp(/(&lt;)/g),"<")
			.replace(new RegExp(/(&gt;)/g),">")
			.replace(new RegExp(/(&amp;)/g),"&")
			.replace(new RegExp(/(&amp;)/g),"&")
			.replace(new RegExp(/(&#39;)/g),"'")
			.replace(new RegExp(/(\r\n)/g),"<br/>")
			.replace(new RegExp(/(\n)/g),"<br/>");
    	return inputHtml;
	}
};
// 日期格式
var pdDate = {
	/**
	 * @desc 通过时间转换为对象
	 * @param ; time:默认当前时间
	 * @return 返回时间对象
	 */
	getObject(time = new Date()){
		if (typeof time == 'string') {
			time = time.replace(/\-/g,'/');
			time = new Date(time);
		}
		let obj = {
			year: time.getFullYear(), //年
			month: pdValue.zeroComplete(parseInt(time.getMonth() + 1)), //月【1月为1】
			date: pdValue.zeroComplete(time.getDate()), //日
			hour: pdValue.zeroComplete(time.getHours()), //时
			minute: pdValue.zeroComplete(time.getMinutes()), //分
			second: pdValue.zeroComplete(time.getSeconds()), //秒
			week: time.getDay() //星期几[0:表示星期天，1-6: 星期一到星期六]
		};
		// 得到时间所在这个月份的天数
		obj.days = new Date(obj.year, obj.month, 0).getDate();
		return obj;
	},
	/**
	 * @desc 通过时间获取需要格式的时间
	 * @param ; time:默认当前时间【0||空||undefined】
	 * type:0:年月日时分秒；1: :年；2：年月；3：年月日；4:年月日时;5 年月日时分
	 * split '':分割符转为中文；
	 * @return 返回需要格式的时间
	 */
	getFormat(time,type=0,split='/'){
		if (time == '') {time = new Date()}
		let obj = this.getObject(time);
		switch(type){
			case 0:
			time = obj.year + (split||'年') + obj.month + (split||'月') + obj.date + (split==''?'日 ':' ') + obj.hour + (split==''?'时':':') + obj.minute + (split==''?'分':':') + obj.second+(split==''?'秒':'');
			break;
			case 1:
			time = obj.year + (split||'年')
			break;
			case 2:
			time = obj.year + (split||'年') + obj.month + (split||'月');
			break;
			case 3:
			time =  obj.year + (split||'年') + obj.month + (split||'月') + obj.date + (split==''?'日':'');
			break;
			case 4:
			time = obj.year + (split||'年') + obj.month + (split||'月') + obj.date + (split==''?'日 ':' ') + obj.hour + (split==''?'时':'')
			break;
			case 5:
			time = obj.year + (split||'年') + obj.month + (split||'月') + obj.date + (split==''?'日 ':' ') + obj.hour + (split==''?'时':':') + obj.minute + (split==''?'分':'')
			break;
		}
		return time;
	}
}
// 文件相关处理
var pdFile = {
	type(t=''){
		let i = t.indexOf('.')
		if(i>-1){
			t = t.substring(i).toLowerCase()
		}else{
			t='.'+t;
		}
		let type_img = 'file_unknow';
		switch(t){
			case '.doc'||'.docx':
			type_img = 'file_icon_doc';
			break;
			case '.xlsx'||'.xls':
			type_img = 'file_icon_xls';
			break;
			case '.pptx'||'.ppt':
			type_img = 'file_icon_ppt';
			break;
			case '.pdf':
			type_img = 'file_icon_pdf';
			break;
			case '.txt':
			type_img = 'file_icon_txt';
			break;
			case '.rar'||'.zip'||'.gz'||'.7z':
			type_img = 'file_icon_ysb';
			break;
			case '.jpg'||'.png'||'.jpeg'||'.gif'||'.bmp':
			type_img = 'file_icon_pic';
			break;
			case '.avi'||'.mp4'||'.wmv'||'.gif'||'.mov':
			type_img = 'file_icon_video';
			break;
		}
		return type_img;
	},
	size(value){ // 将纯数字【表示b】大小转换为带单位(KB,MB)的文件大小格式
		if (value && value !== "" && !isNaN(value)) {
			value = parseInt(value);
			if(value/1024/1024 >= 1){
				value = (value/1024/1024).toFixed(2)+" MB";
			}else if(value/1024<1){
				value = "小于1KB";
			}else{
				value = (value/1024).toFixed(2)+" KB";
			}
    	}
    	return value;
	}
}

// 页面切换和通信【hybrid目录下特有的功能】
var pdHtml = {
	/**
	 * @desc 保留当前页面【可返回】，跳转到应用内的某个页面【uni.navigateBack可以返回到原页面。】
	 * @param url： 跳转地址【如：'new-page/new-page?data=Hello'】
	 * @return Promise
	 */
	navigateTo(url) {
		uni.navigateTo({
			url: url
		});
	},
	/**
	* @desc 不保留当前页面【不可返回】，跳转到应用内的某个页面【uni.navigateBack可以返回到原页面。】
	* @param url： 跳转地址【如：'new-page/new-page?data=Hello'】
	* @return Promise
	*/
	redirectTo(url) {
		uni.redirectTo({
			url: url,
		});
	},
	alert(data){
		plus.nativeUI.alert(data)
	},
	// web-view组件应用中向html页面传递值
	fireMsg(js,key){
		key = key || 'subid'
		var subid =plus.storage.getItem(key);
		var sub = plus.webview.getWebviewById(subid);
		plus.storage.removeItem(key);
		console.log(sub.getURL())
		sub.evalJS(js);
	},
	saveFireSub(key){
		key = key || 'subid'
		var id = plus.webview.currentWebview().id;
		plus.storage.setItem(key,id);
	}
}