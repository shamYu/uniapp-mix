<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			console.log('window')
			console.log(window)
			//设置imei、os
			if (!this.$pdStorage.get(this.$pdGlobal.imeiKey)){
				this.$pdStorage.set(this.$pdGlobal.imeiKey,this.$pdDevice.getImei());
			}
			if (!this.$pdStorage.get(this.$pdGlobal.osKey)){
				this.$pdDevice.getSysInfo().then(res=>{
					this.$pdStorage.set(this.$pdGlobal.osKey,res.platform);
				})
			}
			// #ifdef APP-PLUS
			// 锁定屏幕方向
			plus.screen.lockOrientation('portrait-primary'); //锁定
			// 检测升级
			this.$pdUpdate.checkUpdate();
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	@import './common/powerapp/css/iconfont.css';
	@import './common/powerapp/css/app.scss';
	@import './common/powerapp/css/demo.scss';
	@import './common/powerapp/map/map.scss';


	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background-color: #F4F5F6;
		height: 100%;
		font-size: 28upx;
		line-height: 1.8;
	}

	.uni-header-logo {
		padding: 30upx;
		text-align: center;
		margin-top: 10upx;
	}

	.uni-header-logo image {
		width: 140upx;
		height: 140upx;
	}

	.uni-hello-text {
		color: #7A7E83;
	}

	.uni-hello-addfile {
		text-align: center;
		line-height: 300upx;
		background: #FFF;
		padding: 50upx;
		margin-top: 10px;
		font-size: 38upx;
		color: #808080;
	}
</style>
