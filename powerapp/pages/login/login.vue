<template>
	<view class="uni-page" v-if="!$pdGlobal.ISSUE">
		<image src="/static/powerapp/login/login_bg.png" class="login-bg" ></image>
		<view class="login-content">
			<image src="/static/powerapp/login/login_logo.png" class="login-logo" />
			<view class="login-item">
				<text class='prev-icon user'></text>
				<input type="text" class="uni-input" placeholder="请输入用户名/手机号码" v-model.trim="userInfo.userid" @input="key13Down($event)"
				@blur="common_scrollToTop()" v-cloak />
				<i class="ic-clear prev-icon" v-show="userInfo.userid != ''" @tap="clearUserIn"></i>
			</view>
			<view class="login-item">
				<text class='prev-icon lock'></text>
				<input :password="pwdType!='text'" class="uni-input" placeholder="请输入密码" v-model.trim="userInfo.password" @input="key13Down($event)" @blur="common_scrollToTop()" />
				<i :class="pwdShow" class="prev-icon" @tap="showPwd"></i>
			</view>
			<view class="cbx-item">
				<checkbox-group class="cbx-item mt0" @change="loginModelChange">
					<label :class="userInfo.isRemember?'cbx-active':'cbx'"><checkbox value="remenberPwd" :checked="userInfo.isRemember" />记住密码</label>
					<label :class="userInfo.isAutoLogin?'cbx-active':'cbx'"><checkbox value="autoLogin" :checked="userInfo.isAutoLogin" />自动登录</label>
				</checkbox-group>
			</view>
			<button class="login-btn" @tap="loginIn()">登&nbsp;&nbsp;录</button>
		</view>
		<view>
			<neil-modal :show="showModal" @close="closeModal" @confirm="confirmModal" title="系统设置">
				<view class="table-list-ctn">
					<ul>
						<li>
							<span class="span-hd">服务地址：</span>
							<span class="span-value"><input v-model="setting.serviceUrl" placeholder="请输入服务地址" v-cloak /></span>
						</li>
						<li>
							<span class="span-hd">电话号码：</span>
							<span class="span-value"><input v-model="setting.sim" placeholder="请输入电话号码" v-cloak /></span>
						</li>
						<li>
							<span class="span-hd">设备号码：</span>
							<span class="span-value"><input disabled="true" :value="setting.imei" v-cloak /></span>
						</li>
					</ul>
				</view>
			</neil-modal>
		</view>
		<footer class="login-bot" @tap="settingModal">技术支持：深圳市博安达信息技术股份有限公司</footer>
		<!-- <pd-prompt :show="showSim" @confirm="showSim=false" @cancel="showSim=false"></pd-prompt> -->
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import {common_mixin} from '@/powerapp/components/common_mixin.js'
	import {
		mapState,
		mapMutations,
	} from 'vuex'
	export default {
		mixins:[common_mixin],
		components: {
			neilModal
		},
		onLoad(option) { //同mounted
			this.$store.commit('resetLoginNum',0);
			if (option.exit){// app退出到登陆页
				this.userInfo.userid = this.$pdLogin.getUser().userid;
				this.userInfo.isAutoLogin = false;
				this.userInfo.password = '';
				this.userInfo.isRemember = false;
			}else{
				// 是否作为第三方应用或子系统自动登陆
				this.$pdLogin.isAutoLogin().then(data=>{
					this.dealBeforeLogin(data,true);
				}).catch(()=>{
					// 页面操作登录
					let userSet = this.$pdStorage.get("userSet");
					let user = this.$pdLogin.getUser();
					let isAuto = userSet&&userSet.autoLogin; // 登录页面是否设置过自动登录【设置过，则自动登录】
					this.dealBeforeLogin(user,isAuto,userSet);
				})
			}
		},
		data() {
			return {
				pwdType: 'password',
				pwdShow: 'ic-eyes',
				showModal: false,
				userInfo: {
					userid: '',
					password: '',
					isAutoLogin:false,
					isRemember:false
				},
				setting: {
					serviceUrl: this.$pdStorage.get(this.$pdGlobal.serviceurlKey, ''),
					sim: this.$pdLogin.getUser().sim,
					imei: this.$pdStorage.get(this.$pdGlobal.imeiKey, "")
				},
				showSim: false
			};
		},
		methods: {
			loginIn(autoLogin = false) { // 自动登陆成功
				if (!this.userInfo.userid) {
					this.$pdAction.toast("请输入用户名", {
						icon: "none"
					});
					return;
				}
				if (!this.userInfo.password) {
					this.$pdAction.toast("请输入密码", {
						icon: "none"
					});
					return;
				}
				this.$pdLogin.login({
						userid: this.userInfo.userid,
						pwd: this.userInfo.password
				},autoLogin).then(data=>{
					// 登录设置
					this.$pdStorage.set('userSet',{
						autoLogin:this.userInfo.isAutoLogin,
						remember:this.userInfo.isRemember
					});
				}).catch(result=>{
					if (result=='sim'){
						this.showSim = true;
					}else if(result=='login'){
						this.loginIn();
					}
				});
			},
			// 登录前处理【页面处理】
			dealBeforeLogin(user,autoLogin,userSet) {
				this.userInfo.isAutoLogin = autoLogin;
				if (autoLogin){ // 自动登陆
					this.userInfo.userid = user.userid;
					this.userInfo.password = user.pwd;
					this.userInfo.isRemember = userSet.remember;
					this.userInfo.isAutoLogin = userSet.autoLogin;
					this.loginIn(true)
				}else{// 不自动登陆
					let showGuide = this.$pdStorage.get('lauchFlag'); //读取本地存储，检查是否为首次启动
					if (!showGuide) {
						//显示启动导航
						this.$pdView.reLaunch('guide');
					}else{
						if (userSet&&userSet.remember){// 记住密码
							this.userInfo.userid = user.userid;
							this.userInfo.password = user.pwd;
							this.userInfo.isRemember = userSet.remember;
						}
					}
				}
			},
			loginModelChange: function(e) {
				let value = e.detail.value;
				this.userInfo.isRemember = value.includes('remenberPwd')
				this.userInfo.isAutoLogin = value.includes('autoLogin');
			},
			key13Down: function($event) {
				if ($event.keyCode == 13) {
					this.loginIn();
				}
			},
			clearUserIn: function() {
				this.userInfo.userid = '';
			},
			showPwd: function() {
				if (this.pwdType == 'password') {
					this.pwdType = 'text';
					this.pwdShow = 'ic-eye';
				} else {
					this.pwdType = 'password';
					this.pwdShow = 'ic-eyes';
				}
			},
			settingModal: function() {
                this.showModal = true;
            },
            closeModal: function() {
                this.showModal = false;
            },
            confirmModal: function() {
                this.$pdStorage.set(this.$pdGlobal.serviceurlKey, this.setting.serviceUrl);
				this.$pdStorage.set(this.$pdGlobal.sim, this.setting.sim, false);
                this.$pdStorage.set(this.$pdGlobal.imei, this.setting.imei);
            }
		}

	}
</script>

<style lang="scss">
	@import '../../../common/powerapp/css/_var.scss';
	@import '../../../common/powerapp/css/_mixin.scss';
	.login-bg {
		@include position-zero();
		@include width-height();
		z-index:0;
	}
	.login-content {
		z-index:1;
		@include position($top:50%,$left:60upx,$right:60upx);
		transform: translateY(-50%);
		margin-top:calc(-274upx / 2);
	}
	.login-logo {
		display: block;
		width: 208upx;;
		height: 274upx;
		margin: 0 auto;
	}
	.login-item{
		display:flex;
		flex-direction: row;
		align-items: center;
		margin-top:60upx;
		border-bottom: 1upx solid rgba(25, 255, 255, .4);
		padding:0 10upx;
	}
	.login-item+.login-item{
		margin-top:30upx;
	}
	.uni-input{
		text-align: left;
		font-size:30upx;
		color:#fff;
		padding:20upx 10upx;
		height:44upx;
		line-height: 44upx;
		background-color: transparent;
	}
	.prev-icon{
		width:32upx;
		height:32upx;
		background-size: cover;
	}
	.user {
		background-image: url(~@/static/powerapp/login/login_user.png);
		background-repeat: no-repeat;
	}
	.lock {
		background-image: url(~@/static/powerapp/login/login_lock.png);
	}
	.ic-clear {
		background-image: url(~@/static/powerapp/login/ic_clear.png);
	}
	
	.ic-eye {
		background-image: url(~@/static/powerapp/login/ic_eye.png);
	}
	
	.ic-eyes {
		background-image: url(~@/static/powerapp/login/ic_eyes.png);
	}
	.login-bot {
		color: #b1ecf2;
		font-size: $pd-font-size-smaller;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 30upx;
		text-align: center;
	}
	.cbx-item{
		margin-top:30upx;
		display:flex;
		flex-direction: row;
		justify-content: space-between;
		color:#fff;
		font-size:$pd-font-size-smaller;
	}
	.cbx,.cbx-active{
		display:flex;
		flex-direction: row;
		align-items: center;
		padding-right:0;
		&:first-child{
			margin-left:10upx;
		}
		&:last-child{
			margin-right:4upx;
		}
	}
	
	.cbx checkbox,.cbx-active checkbox{
		display:none;
	}
	.cbx:before,.cbx-active:before{
		content:'';
		width:28upx;
		height:28upx;
		background-image: url(~@/static/powerapp/login/login_icon_radio.png);
		background-size: cover;
		margin-right:10upx;
	}
	.cbx-active:before{
		background-image: url(~@/static/powerapp/login/login_icon_radio_on.png);
		
	}
	.login-btn {
		height: 88upx;
		line-height: 88upx;
		border:0;
		border-radius: 14upx;
		background-color: #0a9eb3;
		color: white;
		font-size: $pd-font-size-big;
		margin-top:60upx;
	}
	.login-btn:after{
		display:none;
	}
</style>
