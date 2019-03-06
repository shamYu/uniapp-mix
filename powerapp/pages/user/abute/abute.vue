<template>
	<view>
		<view class="logoBox">
			<image src="../../../../static/icon.png" mode=""></image>
			<view class="text">
				{{currentVersion}}
			</view>
		</view>
		<view class="about-uni-list">
			<view class="uni-list-cell uni-list-cell-pd" @click="checkUpdate">
				<view class="uni-list-cell-db">版本更新</view>
				<text class="iconfont icon-enter"></text>
			</view>

			<view class="uni-list-cell uni-list-cell-pd" @tap="feedback">
				<view class="uni-list-cell-db">问题反馈</view>
				<text class="iconfont icon-enter"></text>
			</view>

			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db">技术支持：深圳市博安达信息技术股份有限公司</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				currentVersion: this.$pdGlobal.APPNAME + "V" + this.$pdGlobal.version
			};
		},
		methods: {
			//检查版本更新
			checkUpdate() {
				this.$pdUpdate.checkUpdate().then((res) => {
					if(res.status == 0){
						this.$pdAction.toast(res.msg)
					}
				},(err) => {
					console.log(err)
				});
			},
			//问题反馈
			feedback() {
				uni.navigateTo({
					url: './feedBackList'
				})
			}
		}
	}
</script>

<style lang="scss">
	.uni-list-cell-db {
		font-size: 30upx;
	}

	.logoBox {
		text-align: center;
		padding: 40upx 0;
	}

	.logoBox image {
		height: 250upx;
		width: 250upx;
	}

	.logoBox .text {
		font-size: 30upx;
	}
	.about-uni-list{
		background: #fff;
		margin: 0;
	}
	.icon-enter{
		color: #888;
	}
</style>
