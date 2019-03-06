<template>
	<view class="uni-page bg">
		<!-- 上拉刷新下拉加载 -->
		<!-- <pd-pullrefresh @setList="setList" ref="pullrefresh1"
		service-name="SEARCH_DEMO_LIST"
		:service-param='serviceParam'
		:data-name="{count:'total_count',list:'data_array'}">
			<div class="uni-list-item" v-for="(item,index) in list" :key="index">
				<h4 v-cloak><b>{{item[serviceParam.mainField]}}</b></h4>
				<p v-cloak>{{serviceParam.subField?item[serviceParam.subField]:''}}</p>
				<p v-cloak>{{serviceParam.showCjsj?item['CJSJ']:''}}</p>
			</div>
		</pd-pullrefresh> -->
		<pd-swiper other-class="guide-swiper" bottom='40'>
			<swiper-item>
				<image src="/static/powerapp/guide/guide1.png" alt="guide1"/>
			</swiper-item>
			<swiper-item>
				<image src="../../../static/powerapp/guide/guide2.png" alt="guide2"/>
			</swiper-item>
			<swiper-item>
				<image src="../../../static/powerapp/guide/guide3.png" alt="guide3"/>
				<view class="guide-btn submit circle" @tap="toLogin">
					立即体验
				</view>
			</swiper-item>
		</pd-swiper>
	</view>
</template>
<script>import pdSwiper from '@/powerapp/components/pd-swiper';
// import pdPullrefresh from '@/powerapp/components/pd-pullrefresh/pd-pullrefresh.vue';
// import {mixin_pullrefresh} from '@/powerapp/components/pd-pullrefresh/mixin'
	export default {
// 		mixins:[mixin_pullrefresh],
// 		onReachBottom() { // 上拉加载
// 			this.$refs.pullrefresh1.reachBottom();
// 		},
// 		onPullDownRefresh(){ // 下拉刷新
// 			console.log('下拉刷新')
// 			this.$refs.pullrefresh1.refresh();
// 		},
		components:{
			pdSwiper
			// ,pdPullrefresh
		},
		data() {
			return {
				// serviceParam:{"mainField":"XM","subField":"MOBILE","showCjsj":true}
			};
		},
		methods:{
			toLogin(){
				this.$pdStorage.set("lauchFlag", "true");
				this.$pdView.reLaunch('login');
			}
		}
	}
</script>

<style lang="scss">
	@import '../../../common/powerapp/css/_mixin.scss';
	.guide-swiper{
		@include width-height;
	}
	swiper-item{
		position:relative;
	}
	swiper-item>image{
		@include width-height;
	}
	.guide-btn{
		z-index:100;
		box-shadow: 0 0 10px 0px #fff;
		display:inline-block;
		@include position($bottom:15%,$left:50%);
		transform: translateX(-50%);
		color:#fff;
		
	}
	
</style>
