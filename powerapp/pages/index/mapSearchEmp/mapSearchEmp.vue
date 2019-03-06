<template>
	<view class="mapLayer">
		<input confirm-type='search' :value="searchStr" @input='inputDeal' class="map-input" placeholder="请输入搜索地点...如:咖啡">
		<div id='panel_result' class="panel-result"></div>
		<!-- #ifdef H5 -->
		<view id="map_container" class='map-container'></view>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<web-view :src="src"></web-view>
		<!-- #endif -->
	</view>
</template>

<script>
	import {pdHtml} from '@/common/powerapp/js/pd.common';
	// #ifdef H5
	import {mapSearchEmp_mixin} from './mse.js';
	// #endif
	export default {
		// #ifdef H5
		mixins:[mapSearchEmp_mixin],
		// #endif
		mounted(){
			console.log('mouted')
			// #ifdef H5
			// #endif
			// #ifdef APP-PLUS
			
			// #endif			
		},
		destroyed(){
			console.log('销毁');
			// #ifdef APP-PLUS
			// #endif
		},
		data() {
			return {
				src: '/hybrid/html/html/mapSearchEmp.html',
				searchStr: ''
			};
		},
		methods: {
			inputDeal(){
				this.search(this.searchStr)
			}
		}
	}
</script>

<style lang="scss">
</style>
