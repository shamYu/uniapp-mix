<template>
	<view class='pd-swiper-box' :class="otherClass">
		<swiper class="pd-swiper" :style="{height: getHeight}" :autoplay="autoplay" :indicator-dots="false" @change="changeSwiper">
			<slot></slot>
		</swiper>
		<view class="pd-swiper-dots-box" v-if='indicatorDots'>
			<text :class="current===0?'pd-swiper-dot-active':'pd-swiper-dot'"></text>
			<text :class="current===1?'pd-swiper-dot-active':'pd-swiper-dot'"></text>
			<text :class="current===2?'pd-swiper-dot-active':'pd-swiper-dot'"></text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "pd-swiper",
		props: {
			autoplay: {
				type: Boolean,
				default:false
			},
			bottom: { // 内容到底部的距离
				type: String,
				default: '0'
			},
			indicatorDots:{
				type:Boolean,
				default:true
			},
			otherClass:{
				type:String
			}
		},
		data(){
			return {
				current: 0
			}
		},
		computed:{
			getHeight(){
				let px = uni.upx2px(this.bottom*2)+'px'
				return 'calc(100% - '+px+')'
				// return '100%'
			}
		},
		methods: {
			changeSwiper(e) {
				let detail = e.detail;
				this.current = detail.current;// 当前展示项
				this.$emit('change',detail)
			}
		}
	}
</script>
<style lang="scss">
	@import '../../common/powerapp/css/_var.scss';
	@import '../../common/powerapp/css/_mixin.scss';
	.pd-swiper-box{
		position:relative;
	}
	.pd-swiper-box,.pd-swiper{
		@include width-height;
	}
	.pd-swiper-dots-box{
		z-index: 1;
		@include position($left:50%,$bottom:20upx);
		transform: translate(-50%,0);
	}
	.pd-swiper-dots-box text+text{
		margin-left:10upx;
	}
	.pd-swiper-dot,.pd-swiper-dot-active{
		display:inline-block;
		width:20upx;
		height:8upx;
		border-radius: 8upx;
		background-color:$pd-color-gray;
	}
	.pd-swiper-dot-active{
		background-color: $pd-color-primary;
	}
</style>
