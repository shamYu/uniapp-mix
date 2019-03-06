<template>
	<view class="mapLayer">
		<div class="map-icon-box">
			<img :src="pathOne" class="icon" @tap="getMapDatas(1)" />
			<img :src="pathTwo" class="icon" @tap="getMapDatas(2)" />
		</div>
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
	// import {jsonWrw} from '@/common/powerapp/json/wry';
	import {jsonTr} from '@/common/powerapp/json/tr';
	// #ifdef H5
	import {mapPointEmp_mixin} from './mpe.js';
	// #endif
	export default {
		// #ifdef H5
		mixins:[mapPointEmp_mixin],
		// #endif
		mounted(){
			console.log('mouted')
			// #ifdef H5
			this.getMapDatas(1);
			// #endif
			// #ifdef APP-PLUS
			// this.src = '/hybrid/html/html/mapPointEmp.html';
			plus.storage.setItem('wry',JSON.stringify(jsonTr));
			plus.storage.setItem('tr',JSON.stringify(jsonTr));
			// #endif			
		},
		onNavigationBarButtonTap(e){
			console.log('顶部按钮点击事件');
			// #ifdef H5
			this.dw();
			// #endif
			// #ifdef APP-PLUS
			pdHtml.fireMsg('customSend()')
			// #endif
		},
		destroyed(){
			console.log('销毁');
			// #ifdef APP-PLUS
			plus.storage.removeItem('wry');
			plus.storage.removeItem('tr');
			plus.storage.removeItem('subid');
			// #endif
		},
		data() {
			return {
				src: '/hybrid/html/html/mapPointEmp.html',
				type: 0,
				pathOne:"../../../../static/powerapp/index/map/business_wry.png",
				pathTwo:"../../../../static/powerapp/index/map/business_tr.png",
				dataOne:[],
				dataTwo:[]
			};
		},
		methods: {
			//获取数据【H5；直接得到数据；app:获取@message返回数据】
			toDetail(e){
				console.log('message')
				let data;
				// #ifdef H5
				data = e;
				// #endif
				// #ifdef APP-PLUS
				data = e.detail.data; // 通过message方式获取
				// #endif
				this.$pdAction.alert(JSON.stringify(data));
			},
			getMapDatas (num){
				let data = []
				if(this.type == num){
					return;
				}else{
					this.type = num;
				}
				if(num == 1){
// 					data = jsonWrw;
// 					this.dataOne = jsonWrw;
					data = jsonTr;
					this.dataOne = jsonTr;
				}else if(num == 2){
					this.dataTwo = jsonTr;
					data = jsonTr;
				}else{
					console.log("0")
				}
				this.renderMarker(data,num)
			}
		}
	}
</script>

<style lang="scss">

</style>
