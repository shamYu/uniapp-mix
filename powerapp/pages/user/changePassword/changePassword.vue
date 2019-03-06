<template>
	<view class="uni-scroll">
		<view class="dg-card">
			<view class="table-list-ctn" width="100%">
				<ul>
					<li>
						<span class="span-hd">
							<font class="starred">*</font>原密码：
							<!-- <span class="tips">请输入原密码</span> -->
						</span>
						<span class="span-value">
							<input  :password="passList[0].type!='text'" placeholder-style="color:#999;" v-model="passList[0].password"
							 placeholder="请输入原密码" />
							<i  class="pd-icon-eye prev-icon" :class="{'pd-icon-eye-on' : passList[0].type == 'text' }" @click="viewWord('0')"
							 ></i>
						</span>
					</li>
					<li>
						<span class="span-hd">
							<font class="starred">*</font>新密码：
							<!-- <span class="tips">请输入新密码</span>
							<span class="tips">密码长度要求6-16个字符且不能包含中文</span>
							<span class="tips">原密码不能和新密码一样</span> -->
						</span>
						<span class="uni-password span-value">
							<input  :password="passList[1].type!='text'" v-model="passList[1].password" placeholder-style="color:#999;"
							 placeholder="请输入新密码" />
							<i  class="pd-icon-eye prev-icon" :class="{'pd-icon-eye-on' : passList[1].type == 'text' }" @click="viewWord('1')"
							 ></i>
						</span>
					</li>
					<li>
						<span class="span-hd">
							<font class="starred">*</font>确认密码：
							<!-- <span class="tips">请再次输入新密码</span>
							<span class="tips">两次密码不一致</span> -->
						</span>
						<span class="uni-password span-value">
							<input  :password="passList[2].type!='text'" v-model="passList[2].password" placeholder-style="color:#999;"
							 placeholder="请再次输入新密码" />
							<i  class="pd-icon-eye prev-icon" :class="{'pd-icon-eye-on' : passList[2].type == 'text' }" @click="viewWord('2')"
							 ></i>
						</span>
					</li>
				</ul>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '../../../../components/uni-nav-bar.vue'
	import uniIcon from '../../../../components/uni-icon.vue'
	import {mapMutations} from 'vuex'
	export default {
		components: {
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				passList: [{
						password: '',
						type: 'password'
					},
					{
						password: '',
						type: 'password'
					},
					{
						password: '',
						type: 'password'
					}
				],
				toastOp : {
					icon : 'none',
					duration : 1000
				}
			};
		},
		onNavigationBarButtonTap() {
			this.save();
		},
		computed: {

		},
		methods: {
			...mapMutations(['logout']),
			back() {
				uni.navigateBack();
			},
			viadate () {
				if(this.passList[0].password == ''){
					this.$pdAction.toast('请输入原密码',this.toastOp)
					return false;
				}
				if(this.passList[1].password == ''){
					this.$pdAction.toast('请输入新密码',this.toastOp)
					return false;
				}
				//校验密码：只能输入6-16个字母、数字、下划线 
				 var patrn=/^(\w){6,16}$/; 
				  if(!patrn.test(this.passList[1].password)){
					  this.$pdAction.toast('只能输入6-16个字母、数字、下划线',this.toastOp)
					  return false
				  }
				if(this.passList[2].password == ''){
					this.$pdAction.toast('请再次输入新密码',this.toastOp)
					return false;
				}
				if(this.passList[1].password != this.passList[2].password){
					this.$pdAction.toast('两次输入的新密码不一致',this.toastOp)
					return false;
				}
				return true
			},
			save() {
				if(!this.viadate()){
					return
				}
				let _this = this;
				let oldPass = this.passList[0].password;
				let newPass = this.passList[1].password;
				this.$pdAction.showWait('正在修改，请稍后...');
				this.$pdResource.service({data:{service:'MODIFY_PASS',oldpass : oldPass ,newpass : newPass}}).then((res) =>{
					this.$pdAction.closeWait();
					this.$pdAction.alert('修改密码成功，请重新登录',{
						title:'退出登陆'
					}).then(confirm=>{
						if (confirm=='confirm'){
							this.$pdView.reLaunch('/powerapp/pages/login/login?exit=true')
							this.logout()
						}
					})
				},(e) => {
					let res = e.resData.data;
					if(res.status_code == -1){
						this.$pdAction.toast(res.error_msg,this.toastOp);
						return
					}
					this.$pdAction.closeWait();
				})
			},
			viewWord(index) {
				this.passList[index].type = this.passList[index].type == 'password' ? 'text' : 'password';
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../../../common/powerapp/css/table_lr.scss';

	.dg-card {
		width: 100%;
		top: 0px;
		position: relative;
	}

	.uni-input-row {
		padding: 0;
	}

	.uni-input {
		padding: 0 24upx;
	}
	
	.span-value {
		background: #fff;
	}
	.span-value input {
		width: 100%;
		height: 100%;
		background: #fff;
		padding-left: 6upx;
	}

	.pd-icon-eye {
		position: absolute;
		right: 10upx;
		top: 20upx;
		z-index: 2;

	}

	.uni-input {
		border: none;
		outline: none;
		background: none;
	}

	.table-list-ctn li {
		position: relative;
	}

	.pd-icon-eye-on {
		color: royalblue;
	}
	.pd-icon-eye{
		background-image: url(~@/static/powerapp/user/images/ic_eye_hide.png);
	}
	
	.pd-icon-eye-on {
		background-image: url(~@/static/powerapp/user/images/ic_eye_show.png);
	}
	.prev-icon{
		width:32upx;
		height:32upx;
		background-size: cover;
	}
</style>
