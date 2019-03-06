<template>
	<view class="uni-page">
		<!-- <view class='map_container'></view> -->
		<web-view src="../../hybrid/html/map.html"></web-view>
	</view>
</template>
<script>
	// import {GdMap} from '@/common/powerapp/map/pd.map.js';
	// import icon from '@/static/app-plus/location@3x.png'
	export default {
		components: {
		},
		onLoad (){//同created
			// let mapObj = GdMap.create();
		},
		data() {
			return {
				amap: null
			}
		},
		methods:{
			markertap(){
				
			}
		}
	}
</script>
<style lang="scss">
	@import '@/common/powerapp/css/_mixin.scss';
	.amap-one{
		width:750upx;
		height:100%;
	}
</style>
