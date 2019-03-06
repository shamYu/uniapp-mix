/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc 消息弹框、加载框、信息提示、导航栏【navBar】设置、动态设置tabBar、
* @date 20190116
* @author 李凤
*/
export const PdAction = {
	/**
	 * 显示等待加载框，如果已经存在一个等待框则修改等待框的信息否则生成一个新的等待框。
	 * @message : 等待框显示的信息
	 * 其他参数参考uni-app:https://uniapp.dcloud.io/api/ui/prompt?id=showloading
	 * @return promise对象
	 */
	showWait(message = "正在加载",{mask=true}={}) {
		return new Promise ((resolve, reject) => {
			uni.showLoading({
				title: message,
				mask: mask,
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
	 * 关闭等待框
	 */
	closeWait() {
		uni.hideLoading();
	},
	/**
	 * 提示消息
	 * @message：提示的消息
	 * 其他参数参考icon:【"success", "loading", "none"】uni-app:https://uniapp.dcloud.io/api/ui/prompt?id=showtoast
	 * @return promise对象
	 */
	toast(message,{image,icon = 'success',mask = true, duration=1500} = {}){
		return new Promise ((resolve, reject) => {
			uni.showToast({
				title: message,
				icon: icon,
				image: image,
				mask: mask,
				duration: duration,
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
	 * 弹出框
	 * @param message:弹出框消息
	 * 其他参数参考uni-app:https://uniapp.dcloud.io/api/ui/prompt?id=showmodal
	 * @return promise对象
	 * 如无标题：this.$pdAction.alert('消息',{title:false});
	 */
	alert(message,{title='系统消息',confirmText = '确定',showCancel=false,cancelText='取消'} = {}){
		return new Promise ((resolve, reject) => {
			let options = {
				content: message,
				showCancel: showCancel,
				confirmText:confirmText,
				cancelText: cancelText,
				success (res) {
					if (res.confirm) { // 用户点击了确定
						resolve('confirm')
					}else if (res.cancel){
						resolve('cancel')
					}
				},
				fail () {
					reject()
				}
			}
			if (title) {
				options.title = title;
			}
			uni.showModal(options);
		});
	},
	/**
	 * 显示操作表
	 * @param buttons ：数组,操作表的按钮对象描述为['a']
	 * * @return promise对象
	 */
	showActionSheet({buttons=[],itemColor='#000'}={}){
		return new Promise ((resolve, reject) => {
			uni.showActionSheet({
				itemList: buttons,
				itemColor: itemColor,
				success: function (res) {
					console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
					resolve(res)
				},
				fail: function (res) {
					reject(res.error)
				}
			});
		});
	}
};
