<template>
	<view class="uni-scroll">
		<view class="dg-card">
			<view class="table-list-ctn" width="100%">
				<ul>
					<li>
						<span class="span-hd">
							<font class="starred">*</font>服务器地址：
							<!-- <text class="tips">请输入原密码</text> -->
						</span>
						<span class="span-value">
							<input type="text" placeholder="请输入服务器地址" placeholder-style="color:#999;" v-model="serviceUrl" />
						</span>
					</li>
					<li>
						<span class="span-hd">
							<font class="starred">*</font>sim：
						</span>
						<span class="uni-password span-value">
							<input type="text" placeholder="请输入手机号码" v-model="sim" placeholder-style="color:#999;" />
						</span>
					</li>
					<li>
						<span class="span-hd">
							<font class="starred">*</font>imei：
						</span>
						<span class="uni-password span-value">
							<input type="text" placeholder="请输入IMEI号" v-model="imei" />

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
	import {
		mapMutations
	} from 'vuex'
	export default {
		components: {
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				serviceUrl: this.$pdStorage.get(this.$pdGlobal.serviceurlKey, ''),
				sim: this.$pdStorage.get(this.$pdGlobal.simKey, ''),
				imei: this.$pdStorage.get(this.$pdGlobal.imeiKey, ""),
				toastOp: {
					icon: 'none',
					duration: 1000
				}
			};
		},
		computed: {

		},
		onNavigationBarButtonTap() {
			this.save();
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			validate() {

				//验证规则
				let serverReg = new RegExp("/(^(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$)/");
				if (this.serviceUrl == '') {
					this.$pdAction.toast('服务器地址必填', this.toastOp)
					return false;
				}
				// 			    if(!(serverReg.test(this.serviceUrl))){
				// 					this.$pdAction.toast('服务器地址不合法',this.toastOp);
				// 					return false;
				// 				}
				if (this.sim == '') {
					this.$pdAction.toast('手机号码必填', this.toastOp)
					return false;
				}
				if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(this.sim))) {
					this.$pdAction.toast('手机号码不合法', this.toastOp);
					return false;
				}
				if (this.imei == '') {
					this.$pdAction.toast('imei必填', this.toastOp)
					return false;
				}
				return true;
			},
			save() {
				if (!this.validate()) {
					return
				}
				this.$pdStorage.set(this.$pdGlobal.serviceurlKey, this.serviceUrl);
				this.$pdStorage.set(this.$pdGlobal.simKey, this.sim);
				this.$pdStorage.set(this.$pdGlobal.imeiKey, this.imei);
				this.$pdAction.toast('保存成功')
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
</style>
