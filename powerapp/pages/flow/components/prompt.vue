<!-- prompt组件 -->
<!-- prompt -->
<template>
	<view class="prompt-box" v-if="!isHidden">
		<view class="prompt-content contentFontColor">
			<view class="prompt-title">{{title}}</view>
			<view class="prompt-text">{{text}}</view>
			<view class="prompt-input">
				<input class="uni-input" @input="_input" :value="cost" focus/>
			</view>
			<view class="prompt-btn-group">
				<button class="btn-item" @tap="_cancel">{{btn_cancel}}</button>
				<button class="btn-item" @tap="_confirm">{{btn_certain}}</button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				multipleSlots: true, // 在组件定义时的选项中启用多slot支持
				isHidden: true,
				cost: '',
				focus: false
			};
		},
		props: {
			title: {
				type: String,
				default: '提示'
			},
			btn_cancel: {
				type: String,
				default: '取消'
			},
			btn_certain: {
				type: String,
				default: '确定'
			},
			text: {
				type: String,
				default: '',
			}
		},
		watch: {

		},
		methods: {
			hide: function() {
				this.isHidden = true;
			},
			show(e) {
				this.isHidden = false;
				if (e != null && e != undefined && e != "") {
					this.text = e;
				}
			},
			/*
			 * 内部私有方法建议以下划线开头
			 * triggerEvent 用于触发事件
			 */
			_cancel() {
				//触发cancel事件，即在外部，在组件上绑定cancel事件即可，bind:cancel，像绑定tap一样
				this.cost = '';
				this.hide();
				this.$emit('onCancel');
			},
			_confirm() {
				//this.triggerEvent("confirm");
				this.$emit('onConfirm', this.cost);
				this.cost = '';
			},
			_input(e) {
				//将参数传出去，这样在getInput函数中可以通过e去获得必要的参数
				//this.triggerEvent("getInput",e.detail);
				this.cost = e.detail.value;
			}
		}
	}
</script>

<style>
	/* components/vas-prompt/vas-prompt.wxss */
	.prompt-box {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 11;
		background: rgba(0, 0, 0, 0.5);
	}

	.prompt-content {
		position: absolute;
		left: 50%;
		top: 40%;
		width: 80%;
		max-width: 600upx;
		border: 2upx solid #ccc;
		box-sizing: bordre-box;
		transform: translate(-50%, -50%);
		overflow: hidden;
		background: #fff;
	}

	.prompt-title {
		width: 100%;
		padding: 30upx 0upx 30upx 20upx;
		text-align: left;
		font-size: 40upx;
		border-bottom: 3upx solid #00BFFF;
		color: #00BFFF;
	}

	.prompt-input {
		margin: 6% 0 6% 0;
		width: 100%;
		height: 85upx;
		border-bottom: 1px solid #00BFFF;
		font-size: 30upx;
	}
	
	.prompt-input input{
		margin-left: 15upx;margin-right: 15upx;margin-bottom: 0upx;font-size: 30upx;
	}

	.prompt-btn-group {
		display: flex;
	}

	.btn-item {
		width: 50%;
		height: 100upx;
		line-height: 100upx;
		background-color: white;
		justify-content: space-around;
	}

	.prompt-text {
		margin-top: 15upx;
		margin-bottom: 15upx;
		margin-left: 20upx;
		font-size: 38upx;
	}
</style>
