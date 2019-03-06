<template>
	<view class="uni-page bg">
		<form @submit="apply">
			<view class="uni-form-item">
				<text class="uni-label required">系统类型：</text>
				<text class="uni-input">{{form.os}}</text>
			</view>
			<view class="uni-form-item" v-if='form.imei'>
				<text class="uni-label required">设备识别号：</text>
				<text class="uni-input">{{form.imei}}</text>
			</view>
			<view class="uni-form-item">
				<text class="uni-label required">登录用户名：</text>
				<input type="text" name="userid" class="uni-input" readonly="readonly" v-model="form.userid" placeholder="请输入登录用户名">
			</view>
			<view class="uni-form-item">
				<text class="uni-label required">登录密码：</text>
				<input type="text" name="pwd" class="uni-input" readonly="readonly" v-model="form.pwd" placeholder="请输入登录密码">
			</view>
			<view class="uni-form-item">
				<text class="uni-label required">手机号码：</text>
				<input type="text" name="sim" class="uni-input" readonly="readonly" v-model="form.sim" placeholder="请输入手机号码">
			</view>
			<button class="sumbit-two" form-type="submit">提交申请</button>
		</form>
		
	</view>
</template>

<script>import graceChecker from '../../../common/graceChecker.js';
	export default {
		onLoad(option){
			this.form.userid = option.userid;
			this.form.pwd = option.pwd;
		},
		data(){
			return {
				form:{
					os: this.$pdStorage.get(this.$pdGlobal.osKey),
					imei: this.$pdStorage.get(this.$pdGlobal.imei),
					userid: '',
					pwd:'',
					sim: this.$pdLogin.getUser().sim
				}
			}
		},
		methods:{
			apply(e){
				console.log(e.detail.value)
				let rule = [
					{name:'userid',checkType:'notnull',errorMsg: '请输入用户名'},
					{name:'pwd',checkType:'notnull',errorMsg: '请输入密码'},
					{name:'sim',checkType:'notnull',errorMsg: '请输入手机号码'},
					{name:'sim',checkType:'phoneno',errorMsg: '请输入合理手机号码，如：13912345678'}
				]
				let checkRes = graceChecker.check(e.detail.value, rule);
				if (checkRes) {
					this.applyAjax();
				}else{
					this.$pdAction.toast(graceChecker.error,{icon:'none'})
				}
			},
			applyAjax(){
				let param = {
					service:"SAVE_BMDSQXX",
					yhid:this.form.userid,
					pwd:this.form.pwd,
					sjh: this.form.sim
				}
				this.$pdResource.service({
					data:param
				}).then((data) => {
					this.$pdLogin.setUser({
						userid:this.form.userid,
						pwd:this.form.pwd,
						sim: this.form.sim
					})
					this.$pdAction.alert(data.message).then(function(){
						this.$pdAction.back();
					})
				});
			}
		}
	}
</script>

<style lang="scss">
	@import '../../../common/powerapp/css/_var.scss';
	@import '../../../common/powerapp/css/_mixin.scss';
	.uni-form-item {
		background-color:#fff;
		margin-top: 10upx;
		padding:4upx 0;
	}
	.uni-label{
		text-align: right;
	}
	.sumbit-two{
		margin-top:40upx;
	}
</style>
