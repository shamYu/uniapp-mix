<template>
	<view class='pd-prompt' v-if="showDeal">
		<view class="pd-prompt-modal">
			<view class="pd-prompt-inner">
				<text class="title">{{title}}</text>
				<text class="msg">{{msg}}</text>
				<input class="uni-input smaller" v-model.trim="value" placeholder="键盘右下角按钮显示为搜索" />
			</view>
			<view class='pd-prompt-buttons'>
				<text @tap="confirm">{{buttons[0]}}</text>
				<text @tap="cancel">{{buttons[1]}}</text>
			</view>
		</view>
		<!-- <view class="mask"></view> -->
	</view>
</template>

<script>import graceChecker from '../../common/graceChecker.js';
	export default {
		name: "pd-prompt",
		props: {
			show: {
				type:Boolean,
				default:false
			},
			title: {
				type: String,
				default:'白名单验证'
			},
			msg: { // 内容到底部的距离
				type: String,
				default: '请输入白名单登记的手机号：'
			},
			buttons:{
				type:Array,
				default(){
					return ['保存','取消']
				}
			},
			type:{
				type: String,
				default: 'sim'
			}
		},
		data(){
			return {
				value: ''
			}
		},
		computed: {
			showDeal:{
				get(){
					return this.show;
				}
			}
		},
		watch:{
			show(newVal){
				if(newVal){
					this.value=""
				}
			}
		},
		methods: {
			confirm() { // 确认
				let rule = [
					{name:'sim',checkType:'notnull',errorMsg: '请输入手机号码'},
					{name:'sim',checkType:'phoneno',errorMsg: '请输入合理手机号码，如：13912345678'}
				]
				let checkRes = graceChecker.check({sim:this.value}, rule);
				if (checkRes) {
					if (this.type === 'sim'){
						window.localStorage[this.$pdGlobal.simKey] = this.value;
					}
					this.$emit('confirm',this.value);
				}else{
					this.$pdAction.toast(graceChecker.error,{icon:'none'})
				}
			},
			cancel(){// 取消
				console.log('取消')
				this.$emit('cancel',this.value);
			}
		}
	}
</script>
<style lang="scss">
	@import '../../common/powerapp/css/_var.scss';
	@import '../../common/powerapp/css/_mixin.scss';
	.pd-prompt{
		@include position-zero;
		position:fixed;
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index:99999;
		&:after{
			@include mask;
			z-index:99999;
		}
	}
	.pd-prompt-modal{
		width:600upx;
		height:auto;
		background-color: #fff;
		border-radius: 30upx;
		overflow: hidden;
		z-index:199999;
	}
	.pd-prompt-inner{
		padding:30upx;
		background:rgba(255,255,255,.95);
		display:flex;
		flex-direction: column;
	}
	.title,.msg{
		text-align: left;
	}
	.title{
		font-size:$pd-font-size-bigger;
		font-weight: 500;
	}
	.msg{
		margin-top:10upx;
		font-size:$pd-font-size;
	}
	.pd-prompt-buttons{
		display:flex;
		flex-direction: row;
		height:80upx;
		line-height:80upx;
		box-sizing: content-box;
		border-top:1px solid $pd-border-color;
	}
	.pd-prompt-buttons text{
		flex:1;
		text-align: center;
		color:$pd-color-primary;
		font-size:$pd-font-size-big;
	}
	.pd-prompt-buttons text+text{
		border-left:1px solid $pd-border-color;
	}
	.uni-input{
		margin:30upx 0 0;
		border-bottom:1px solid $pd-color-primary;

	}
</style>
