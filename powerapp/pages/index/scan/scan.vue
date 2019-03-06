<template>
	<view class="uni-page scan-body">
		<page-head :title="title"></page-head>
		<view class="uni-title">扫码结果：</view>
		<view class="scan-result" v-if="result">
			二维码类型:{{result.scanType}}<br>
			二维码结果:{{result.result}}
		</view>
		<view class="uni-btn-v">
			<button type="primary" @tap="scan">扫一扫</button>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'scanCode',
				result: '1'
			}
		},
		methods: {
			scan: function() {
				this.$pdDevice.scanUni().then(result=>{
					console.log(result)
					this.result = result;
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/powerapp/css/_var.scss';

	.scan-body{
		padding: 0 20upx;
	}
	.scan-result {
		width:80%;
		min-height:200upx;
		padding:20upx;
		line-height: 40upx;
		margin-top:10upx;
		margin-left:auto;
		margin-right:auto;
		background-color: $pd-bg-gray;
	}
</style>
